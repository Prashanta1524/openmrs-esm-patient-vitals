import React, { useState, useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { useSession } from '@openmrs/esm-framework';

interface DimensionVisualizationProps {
  allPatientsData: any[];
  currentLocationUuid?: string;
  startDate?: string;
  endDate?: string;
}

// Domain labels in Nepali
const DOMAIN_LABELS = {
  hiv: 'एचआईभी',
  mh: 'मानसिक स्वास्थ्य',
  sgm: 'लैङ्गिक तथा यौनिक अल्पसङ्ख्यक',
  em: 'जातीय अल्पसङ्ख्यक/दलित',
};

// Stigma type labels
const STIGMA_TYPE_LABELS = {
  as: 'अपेक्षित लान्छना (Anticipated Stigma)',
  es: 'व्यावहारिक लान्छना (Enacted Stigma)',
  is: 'आत्मलान्छना (Internalized Stigma)',
};

// Helper function to extract dimension scores from observation data
function extractDimensionScores(
  allPatientsData: any[],
  selectedType: 'as' | 'es' | 'is',
  currentLocationUuid?: string,
) {
  const domainScores: Record<string, number[]> = {
    hiv: [],
    mh: [],
    sgm: [],
    em: [],
  };

  console.log('🔍 Dimension Extraction Debug:', {
    selectedType,
    currentLocationUuid,
    totalPatients: allPatientsData.length,
  });

  let totalObs = 0;
  let matchedTypeObs = 0;
  let foundDomainScores = 0;

  allPatientsData.forEach((patientObservations, pIndex) => {
    patientObservations.forEach((obs: any) => {
      totalObs++;

      // Filter by location - check multiple possible location fields in FHIR/REST data
      const obsLocationUuid =
        obs.locationUuid ||
        obs.location?.uuid ||
        obs.location?.reference?.split('/').pop() ||
        obs.encounter?.location?.[0]?.location?.reference?.split('/').pop();

      // Skip location filter if observation doesn't have location data
      if (currentLocationUuid && obsLocationUuid && obsLocationUuid !== currentLocationUuid) {
        return;
      }

      // Get stigma type from observation
      const raw = (obs.stigmaType || obs.code?.coding?.[0]?.display || obs.code?.text || '').toString();
      const stigmaType = raw.toLowerCase();

      // Match stigma type (AS, ES, IS) with expanded patterns
      let isMatchingType = false;
      let typeLabel = '';

      if (
        selectedType === 'as' &&
        (stigmaType.includes('anticipated') ||
          stigmaType.includes('अपेक्षित') ||
          stigmaType.includes('concern') ||
          stigmaType.includes('fear') ||
          stigmaType.includes('worry') ||
          stigmaType.includes('expect'))
      ) {
        isMatchingType = true;
        typeLabel = 'Anticipated (AS)';
      } else if (
        selectedType === 'es' &&
        (stigmaType.includes('enacted') ||
          stigmaType.includes('व्यावहारिक') ||
          stigmaType.includes('verbal abuse') ||
          stigmaType.includes('mistreatment') ||
          stigmaType.includes('discriminat') ||
          stigmaType.includes('reject') ||
          stigmaType.includes('avoid'))
      ) {
        isMatchingType = true;
        typeLabel = 'Enacted (ES)';
      } else if (
        selectedType === 'is' &&
        (stigmaType.includes('internalized') ||
          stigmaType.includes('आत्म') ||
          stigmaType.includes('self-disgust') ||
          stigmaType.includes('self disgust') ||
          stigmaType.includes('shame') ||
          stigmaType.includes('self-blame') ||
          stigmaType.includes('self blame'))
      ) {
        isMatchingType = true;
        typeLabel = 'Internalized (IS)';
      }

      if (!isMatchingType) return;

      matchedTypeObs++;

      // Now check which DOMAIN this observation is for
      // The key insight: observations are domain-specific!
      // Each observation represents ONE domain's score for ONE stigma type

      let domainFound = false;
      let score: number | null = null;

      // Extract numeric value (same as stg_type.tsx)
      const vq = obs.valueQuantity?.value;
      if (typeof vq === 'number') {
        score = vq;
      } else if (typeof obs.valueNumber === 'number') {
        score = obs.valueNumber;
      } else if (typeof obs.value === 'number') {
        score = obs.value;
      } else if (Array.isArray(obs.component)) {
        for (const c of obs.component) {
          const cv = c.valueQuantity?.value ?? c.valueNumber ?? c.value;
          if (typeof cv === 'number') {
            score = cv;
            break;
          }
        }
      }

      if (score === null || isNaN(score)) return;

      // Determine which domain this observation belongs to
      // Check stigmaType, code.text, code.display, or dimensionScore for domain indicators
      const fullText = (raw + ' ' + (obs.code?.text || '') + ' ' + (obs.dimensionScore || '')).toLowerCase();

      if (fullText.includes('hiv') || fullText.includes('एचआईभी')) {
        domainScores.hiv.push(score);
        domainFound = true;
        if (foundDomainScores < 5) {
          console.log(`📊 Found HIV ${typeLabel} score:`, score, 'from:', raw.substring(0, 50));
        }
      }

      if (fullText.includes('mental') || fullText.includes('मानसिक')) {
        domainScores.mh.push(score);
        domainFound = true;
        if (foundDomainScores < 5) {
          console.log(`📊 Found MH ${typeLabel} score:`, score, 'from:', raw.substring(0, 50));
        }
      }

      if (
        fullText.includes('sgm') ||
        fullText.includes('sexual') ||
        fullText.includes('gender') ||
        fullText.includes('लैङ्गिक')
      ) {
        domainScores.sgm.push(score);
        domainFound = true;
        if (foundDomainScores < 5) {
          console.log(`📊 Found SGM ${typeLabel} score:`, score, 'from:', raw.substring(0, 50));
        }
      }

      if (
        fullText.includes('ethnic') ||
        fullText.includes('dalit') ||
        fullText.includes('minority') ||
        fullText.includes('जातीय') ||
        fullText.includes('अल्पसङ्ख्यक') ||
        fullText.includes('दलित')
      ) {
        domainScores.em.push(score);
        domainFound = true;
        if (foundDomainScores < 5) {
          console.log(` Found EM ${typeLabel} score:`, score, 'from:', raw.substring(0, 50));
        }
      }

      if (domainFound) {
        foundDomainScores++;
      } else if (matchedTypeObs <= 3) {
        // Log first few unmatched observations to see what domains might be missing
        console.log(`⚠️ Matched ${typeLabel} but no domain found in:`, {
          stigmaType: raw.substring(0, 100),
          codeText: obs.code?.text?.substring(0, 100),
          dimensionScore: obs.dimensionScore?.substring(0, 100),
          score,
        });
      }
    });
  });

  console.log('📈 Dimension Extraction Results:', {
    totalObservations: totalObs,
    matchedTypeObservations: matchedTypeObs,
    foundDomainScores: foundDomainScores,
    domainCounts: {
      hiv: domainScores.hiv.length,
      mh: domainScores.mh.length,
      sgm: domainScores.sgm.length,
      em: domainScores.em.length,
    },
    sampleScores: {
      hiv: domainScores.hiv.slice(0, 3),
      mh: domainScores.mh.slice(0, 3),
      sgm: domainScores.sgm.slice(0, 3),
      em: domainScores.em.slice(0, 3),
    },
  });

  return domainScores;
}

// Calculate min and max for each domain
function calculateMinMax(domainScores: Record<string, number[]>) {
  const result: Record<string, { min: number; max: number; count: number }> = {};

  Object.entries(domainScores).forEach(([domain, scores]) => {
    if (scores.length === 0) {
      result[domain] = { min: 0, max: 0, count: 0 };
    } else {
      // Filter positive values for min calculation (ignore 0 scores)
      const positiveScores = scores.filter((v) => v > 0);
      result[domain] = {
        min: positiveScores.length > 0 ? Math.min(...positiveScores) : 0,
        max: Math.max(...scores),
        count: scores.length,
      };
    }
  });

  return result;
}

export function DimensionVisualization({
  allPatientsData,
  currentLocationUuid,
  startDate,
  endDate,
}: DimensionVisualizationProps) {
  const session = useSession();
  const [selectedType, setSelectedType] = useState<'as' | 'es' | 'is'>('as');

  // Use passed location or session location
  const locationUuid = currentLocationUuid || session?.sessionLocation?.uuid;
  const locationName = session?.sessionLocation?.display || 'Current Site';

  const dimensionData = useMemo(() => {
    // Filter by date range if provided
    let filteredData = allPatientsData;
    if (startDate || endDate) {
      const s = startDate ? new Date(startDate) : null;
      const e = endDate ? new Date(endDate) : null;
      filteredData = allPatientsData.map((patientObservations) =>
        patientObservations.filter((obs: any) => {
          const ds = obs.effectiveDateTime || obs.date;
          if (!ds) return false;
          const d = new Date(ds);
          if (s && d < s) return false;
          if (e && d > e) return false;
          return true;
        }),
      );
    }
    const domainScores = extractDimensionScores(filteredData, selectedType, locationUuid);
    return calculateMinMax(domainScores);
  }, [allPatientsData, selectedType, locationUuid, startDate, endDate]);

  // Prepare chart data with new colors
  const chartData = {
    labels: Object.keys(DOMAIN_LABELS).map((key) => DOMAIN_LABELS[key as keyof typeof DOMAIN_LABELS]),
    datasets: [
      {
        label: 'Max Score',
        data: Object.keys(DOMAIN_LABELS).map((key) => dimensionData[key]?.max || 0),
        backgroundColor: ['#9C27B0', '#9C27B0', '#9C27B0', '#9C27B0'],
        borderColor: ['#7B1FA2', '#7B1FA2', '#7B1FA2', '#7B1FA2'],
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.8,
        categoryPercentage: 0.7,
      },
      {
        label: 'Min Score',
        data: Object.keys(DOMAIN_LABELS).map((key) => dimensionData[key]?.min || 0),
        backgroundColor: ['#FF9800', '#FF9800', '#FF9800', '#FF9800'],
        borderColor: ['#F57C00', '#F57C00', '#F57C00', '#F57C00'],
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.8,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 35,
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          font: {
            size: window.innerWidth <= 480 ? 11 : window.innerWidth <= 768 ? 13 : 15,
            weight: 'bold',
          },
          padding: window.innerWidth <= 480 ? 15 : window.innerWidth <= 768 ? 20 : 25,
          usePointStyle: true,
          pointStyle: 'rect',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: false, // Disable hover tooltips
      },
    },
    animation: {
      duration: 0,
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Score',
          font: {
            size: window.innerWidth <= 480 ? 11 : 13,
            weight: 'bold',
          },
        },
        ticks: {
          font: {
            size: window.innerWidth <= 480 ? 10 : 12,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: window.innerWidth <= 480 ? 10 : window.innerWidth <= 768 ? 11 : 12,
          },
          autoSkip: false,
          maxRotation: window.innerWidth <= 480 ? 45 : 0,
          minRotation: window.innerWidth <= 480 ? 45 : 0,
        },
      },
    },
  };

  // Custom plugin to display values on bars (like stigma type)
  const datalabelsPlugin = {
    id: 'datalabels-dimension',
    afterDatasetsDraw: function (chart: any) {
      const ctx = chart.ctx;
      ctx.save();
      const fontSize = window.innerWidth <= 480 ? 11 : window.innerWidth <= 768 ? 14 : 16;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = '#333';
      chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar: any, index: number) => {
          const value = dataset.data[index];
          if (value > 0) {
            ctx.fillText(value, bar.x, bar.y - 8);
          }
        });
      });
      ctx.restore();
    },
  };

  return (
    <div
      style={{
        background: '#fff',
        padding: 'clamp(0.75rem, 2vw, 1.5rem)',
        borderRadius: 10,
        maxWidth: '100%',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8, fontWeight: 'bold', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
          Stigma Type:
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as 'as' | 'es' | 'is')}
          style={{
            padding: 'clamp(6px, 1.5vw, 8px)',
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
            cursor: 'pointer',
          }}
        >
          <option value="as">{STIGMA_TYPE_LABELS.as}</option>
          <option value="es">{STIGMA_TYPE_LABELS.es}</option>
          <option value="is">{STIGMA_TYPE_LABELS.is}</option>
        </select>
      </div>

      <div
        style={{
          height: window.innerWidth <= 480 ? '320px' : window.innerWidth <= 768 ? '380px' : '420px',
          width: '100%',
          position: 'relative',
        }}
      >
        <Chart type="bar" data={chartData} options={options} plugins={[datalabelsPlugin]} />
      </div>
    </div>
  );
}
