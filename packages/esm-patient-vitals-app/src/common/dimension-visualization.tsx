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

// All 12 domain concept UUIDs from stigma-data.resource.tsx
const DOMAIN_UUIDS = {
  // Anticipated Stigma (AS) domains
  hiv_domain_as: '90e0da1c-1bb4-48db-869e-d0ed4cd11c24',
  mh_domain_as: '8f94f4c3-58f2-414a-9286-68c5ede9c46e',
  sgm_domain_as: 'eb0a135d-3b90-470c-a684-d6dc3464712d',
  em_domain_as: 'd1ccc9dc-92fa-4118-af50-6394295131f8',
  // Enacted Stigma (ES) domains
  hiv_domain_es: '6a0fbece-ed88-4da2-9cb2-6db7848dbdfd',
  mh_domain_es: '7ed8a592-dac5-4c7b-b9c0-3ac6126689b8',
  sgm_domain_es: '5c10bc7a-332c-4586-94f2-fbb90b8a264d',
  em_domain_es: '298384cf-8f27-4ec0-93ca-4657eb66c8a1',
  // Internalized Stigma (IS) domains
  hiv_domain_is: 'ea081a06-b663-40f0-b74c-ede85468ed89',
  mh_domain_is: 'ef14a69f-b4fa-4fcd-8699-6b827bb67525',
  sgm_domain_is: '79c9043f-3cb6-41b2-b189-6018cb9b2bde',
  em_domain_is: '373eca5f-bc30-4b5e-a799-c50931731209',
};

// Helper function to extract dimension scores from raw observations
// Matches observations by concept UUID (code.coding[0].code)
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

  // Get the 4 concept UUIDs for the selected stigma type
  const uuids = {
    hiv: DOMAIN_UUIDS[`hiv_domain_${selectedType}` as keyof typeof DOMAIN_UUIDS],
    mh: DOMAIN_UUIDS[`mh_domain_${selectedType}` as keyof typeof DOMAIN_UUIDS],
    sgm: DOMAIN_UUIDS[`sgm_domain_${selectedType}` as keyof typeof DOMAIN_UUIDS],
    em: DOMAIN_UUIDS[`em_domain_${selectedType}` as keyof typeof DOMAIN_UUIDS],
  };

  console.log('🔍 Dimension Extraction using concept UUIDs:', { selectedType, uuids });
  console.log('📊 Total patients/observation arrays received:', allPatientsData.length);

  let totalObsCount = 0;
  const sampleConceptUuids: string[] = [];
  allPatientsData.forEach((p) => {
    totalObsCount += p?.length || 0;
    // Collect some sample concept UUIDs
    if (sampleConceptUuids.length < 20) {
      p?.forEach((obs: any) => {
        const uuid = obs.code?.coding?.[0]?.code || obs.concept?.uuid || 'N/A';
        if (sampleConceptUuids.length < 20) sampleConceptUuids.push(uuid);
      });
    }
  });
  console.log('📊 Total observations across all patients:', totalObsCount);
  console.log('📊 Sample concept UUIDs in data:', sampleConceptUuids);

  let foundCount = 0;

  allPatientsData.forEach((patientObservations, patientIdx) => {
    patientObservations.forEach((obs: any) => {
      // Skip location filtering since data is already filtered by conf_dashboard
      // const obsLocationUuid = obs.locationUuid || obs.location?.uuid;
      // if (currentLocationUuid && obsLocationUuid && obsLocationUuid !== currentLocationUuid) {
      //   return;
      // }

      // Get concept UUID from observation (code.coding[0].code maps from obs.concept.uuid)
      const conceptUuid = obs.code?.coding?.[0]?.code || obs.concept?.uuid || '';

      // Extract numeric value
      let score: number | null = null;
      if (typeof obs.valueQuantity?.value === 'number') {
        score = obs.valueQuantity.value;
      } else if (typeof obs.value === 'number') {
        score = obs.value;
      } else if (typeof obs.value === 'string') {
        const match = obs.value.match(/-?\d+(?:\.\d+)?/);
        if (match) score = parseFloat(match[0]);
      }

      if (score === null || isNaN(score) || score <= 0) return;

      // Match by exact concept UUID
      if (conceptUuid === uuids.hiv) {
        domainScores.hiv.push(score);
        foundCount++;
        if (foundCount <= 8) console.log(`📊 HIV ${selectedType.toUpperCase()}: ${score}`);
      } else if (conceptUuid === uuids.mh) {
        domainScores.mh.push(score);
        foundCount++;
        if (foundCount <= 8) console.log(`📊 MH ${selectedType.toUpperCase()}: ${score}`);
      } else if (conceptUuid === uuids.sgm) {
        domainScores.sgm.push(score);
        foundCount++;
        if (foundCount <= 8) console.log(`📊 SGM ${selectedType.toUpperCase()}: ${score}`);
      } else if (conceptUuid === uuids.em) {
        domainScores.em.push(score);
        foundCount++;
        if (foundCount <= 8) console.log(`📊 EM ${selectedType.toUpperCase()}: ${score}`);
      }
    });
  });

  console.log('📈 Dimension Results for', selectedType.toUpperCase(), ':', {
    counts: {
      hiv: domainScores.hiv.length,
      mh: domainScores.mh.length,
      sgm: domainScores.sgm.length,
      em: domainScores.em.length,
    },
    allValues: {
      hiv: domainScores.hiv,
      mh: domainScores.mh,
      sgm: domainScores.sgm,
      em: domainScores.em,
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

  // Prepare chart data with new colors - wrapped in useMemo
  const chartData = useMemo(
    () => ({
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
    }),
    [dimensionData],
  );

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
        <Chart
          key={`dimension-chart-${selectedType}`}
          type="bar"
          data={chartData}
          options={options}
          plugins={[datalabelsPlugin]}
        />
      </div>
    </div>
  );
}
