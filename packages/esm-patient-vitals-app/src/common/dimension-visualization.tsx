import React, { useState, useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { useSession } from '@openmrs/esm-framework';
import { getMaxVisitCount } from './visit-utils';

interface DimensionVisualizationProps {
  allPatientsData: any[];
  currentLocationUuid?: string;
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

// Helper function to extract dimension scores grouped by visit from raw observations
// Matches observations by domain concept UUID and returns scores grouped by encounter order.
function extractDimensionVisitScores(
  allPatientsData: any[],
  selectedType: 'as' | 'es' | 'is',
  currentLocationUuid?: string,
) {
  const visitScores: Array<Record<'hiv' | 'mh' | 'sgm' | 'em', number[]>> = [];
  let maxVisitCount = 0;

  const uuids = {
    hiv: DOMAIN_UUIDS[`hiv_domain_${selectedType}` as keyof typeof DOMAIN_UUIDS],
    mh: DOMAIN_UUIDS[`mh_domain_${selectedType}` as keyof typeof DOMAIN_UUIDS],
    sgm: DOMAIN_UUIDS[`sgm_domain_${selectedType}` as keyof typeof DOMAIN_UUIDS],
    em: DOMAIN_UUIDS[`em_domain_${selectedType}` as keyof typeof DOMAIN_UUIDS],
  };

  allPatientsData.forEach((patientObservations) => {
    const encounters = new Map<
      string,
      {
        date: Date;
        scores: Record<'hiv' | 'mh' | 'sgm' | 'em', number[]>;
      }
    >();

    patientObservations.forEach((obs: any) => {
      const conceptUuid = obs.code?.coding?.[0]?.code || obs.concept?.uuid || '';

      const encounterKey =
        obs.encounter?.uuid ||
        obs.encounter?.reference ||
        obs.encounterUuid ||
        String(obs.effectiveDateTime || obs.date || 'unknown');
      if (!encounterKey) return;

      const dateValue = obs.effectiveDateTime || obs.date;
      const date = dateValue ? new Date(dateValue) : new Date();
      if (Number.isNaN(date.getTime())) return;

      const group = encounters.get(encounterKey) || {
        date,
        scores: { hiv: [], mh: [], sgm: [], em: [] },
      };
      if (!encounters.has(encounterKey)) {
        encounters.set(encounterKey, group);
      }

      let score: number | null = null;
      if (typeof obs.valueQuantity?.value === 'number') {
        score = obs.valueQuantity.value;
      } else if (typeof obs.value === 'number') {
        score = obs.value;
      } else if (typeof obs.value === 'string') {
        const match = obs.value.match(/-?\d+(?:\.\d+)?/);
        if (match) score = parseFloat(match[0]);
      }

      if (score === null || isNaN(score) || score < 0) return;

      if (conceptUuid !== uuids.hiv && conceptUuid !== uuids.mh && conceptUuid !== uuids.sgm && conceptUuid !== uuids.em) {
        return;
      }

      if (conceptUuid === uuids.hiv) group.scores.hiv.push(score);
      else if (conceptUuid === uuids.mh) group.scores.mh.push(score);
      else if (conceptUuid === uuids.sgm) group.scores.sgm.push(score);
      else if (conceptUuid === uuids.em) group.scores.em.push(score);
    });

    const sortedEncounters = Array.from(encounters.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
    maxVisitCount = Math.max(maxVisitCount, sortedEncounters.length);
    sortedEncounters.forEach((encounterGroup, encounterIndex) => {
      const current = visitScores[encounterIndex] || { hiv: [], mh: [], sgm: [], em: [] };
      current.hiv.push(...encounterGroup.scores.hiv);
      current.mh.push(...encounterGroup.scores.mh);
      current.sgm.push(...encounterGroup.scores.sgm);
      current.em.push(...encounterGroup.scores.em);
      visitScores[encounterIndex] = current;
    });
  });

  const visitCount = Math.max(visitScores.length, maxVisitCount, getMaxVisitCount(allPatientsData));
  return Array.from({ length: visitCount }, (_, index) =>
    visitScores[index] || { hiv: [], mh: [], sgm: [], em: [] },
  );
}

function calculateVisitAverages(
  visitScores: Array<Record<'hiv' | 'mh' | 'sgm' | 'em', number[]>>,
) {
  const average = (values: number[]) => {
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  };

  return visitScores.map((scores, index) => ({
    visit: index + 1,
    hiv: average(scores.hiv),
    mh: average(scores.mh),
    sgm: average(scores.sgm),
    em: average(scores.em),
  }));
}

function getOrdinalSuffix(n: number) {
  if (n % 100 >= 11 && n % 100 <= 13) return 'th';
  if (n % 10 === 1) return 'st';
  if (n % 10 === 2) return 'nd';
  if (n % 10 === 3) return 'rd';
  return 'th';
}

function formatVisitLabel(index: number) {
  return `${index + 1}${getOrdinalSuffix(index + 1)} visit`;
}

export function DimensionVisualization({
  allPatientsData,
  currentLocationUuid,
}: DimensionVisualizationProps) {
  const session = useSession();
  const [selectedType, setSelectedType] = useState<'as' | 'es' | 'is' | 'all'>('as');
  const [selectedDomain, setSelectedDomain] = useState<'hiv' | 'mh' | 'sgm' | 'em'>('hiv');

  // Use passed location or session location
  const locationUuid = currentLocationUuid || session?.sessionLocation?.uuid;
  const locationName = session?.sessionLocation?.display || 'Current Site';

  const visitAverages = useMemo(() => {
    if (selectedType === 'all') {
      const asScores = extractDimensionVisitScores(allPatientsData, 'as', locationUuid);
      const esScores = extractDimensionVisitScores(allPatientsData, 'es', locationUuid);
      const isScores = extractDimensionVisitScores(allPatientsData, 'is', locationUuid);

      const maxLen = Math.max(asScores.length, esScores.length, isScores.length);
      const merged: Array<Record<'hiv' | 'mh' | 'sgm' | 'em', number[]>> = [];

      for (let i = 0; i < maxLen; i++) {
        merged[i] = { hiv: [], mh: [], sgm: [], em: [] };
        const srcs = [asScores[i], esScores[i], isScores[i]];
        srcs.forEach((s) => {
          if (!s) return;
          merged[i].hiv.push(...(s.hiv || []));
          merged[i].mh.push(...(s.mh || []));
          merged[i].sgm.push(...(s.sgm || []));
          merged[i].em.push(...(s.em || []));
        });
      }

      return calculateVisitAverages(merged);
    }

    const visitScores = extractDimensionVisitScores(allPatientsData, selectedType as 'as' | 'es' | 'is', locationUuid);
    return calculateVisitAverages(visitScores);
  }, [allPatientsData, selectedType, locationUuid]);

  const domainOptions = useMemo(
    () =>
      (Object.keys(DOMAIN_LABELS) as Array<keyof typeof DOMAIN_LABELS>).map((key) => ({
        value: key,
        label: DOMAIN_LABELS[key],
      })),
    [],
  );

  const roundValue = (value: number) => Number(value.toFixed(1));

  // Prepare chart data with visits on the x-axis and selected domain values
  const chartData = useMemo(() => {
    const colors = ['#9C27B0', '#FF9800', '#4CAF50'];
    const borderColors = ['#7B1FA2', '#F57C00', '#388E3C'];

    if (selectedType === 'all') {
      const asScores = calculateVisitAverages(extractDimensionVisitScores(allPatientsData, 'as', locationUuid));
      const esScores = calculateVisitAverages(extractDimensionVisitScores(allPatientsData, 'es', locationUuid));
      const isScores = calculateVisitAverages(extractDimensionVisitScores(allPatientsData, 'is', locationUuid));

      const maxLen = Math.max(asScores.length, esScores.length, isScores.length);
      const visitLabels = Array.from({ length: maxLen }, (_, i) => formatVisitLabel(i));

      const makeData = (arr: any[]) =>
        Array.from({ length: maxLen }, (_, i) => roundValue((arr[i] && (arr[i] as any)[selectedDomain]) || 0));

      return {
        labels: visitLabels,
        datasets: [
          {
            label: `${STIGMA_TYPE_LABELS.as} (${DOMAIN_LABELS[selectedDomain]})`,
            data: makeData(asScores),
            backgroundColor: colors[0],
            borderColor: borderColors[0],
            borderWidth: 3,
            fill: false,
            tension: 0.35,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHitRadius: 10,
          },
          {
            label: `${STIGMA_TYPE_LABELS.es} (${DOMAIN_LABELS[selectedDomain]})`,
            data: makeData(esScores),
            backgroundColor: colors[1],
            borderColor: borderColors[1],
            borderWidth: 3,
            fill: false,
            tension: 0.35,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHitRadius: 10,
          },
          {
            label: `${STIGMA_TYPE_LABELS.is} (${DOMAIN_LABELS[selectedDomain]})`,
            data: makeData(isScores),
            backgroundColor: colors[2],
            borderColor: borderColors[2],
            borderWidth: 3,
            fill: false,
            tension: 0.35,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHitRadius: 10,
          },
        ],
      };
    }

    return {
      labels: visitAverages.map((_, index) => formatVisitLabel(index)),
      datasets: [
        {
          label: `${DOMAIN_LABELS[selectedDomain]} (${selectedType === 'as' ? 'Anticipated' : selectedType === 'es' ? 'Enacted' : 'Internalized'})`,
          data: visitAverages.map((visit) => roundValue(visit[selectedDomain])),
          backgroundColor: colors[0],
          borderColor: borderColors[0],
          borderWidth: 3,
          fill: false,
          tension: 0.35,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointHitRadius: 10,
        },
      ],
    };
  }, [visitAverages, selectedDomain, selectedType, allPatientsData, locationUuid]);

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 35,
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: true,
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
        enabled: true,
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
          text: 'Average Score',
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
      <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <label style={{ marginRight: 8, fontWeight: 'bold', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
          Stigma Type:
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as 'as' | 'es' | 'is' | 'all')}
          style={{
            padding: 'clamp(6px, 1.5vw, 8px)',
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
            cursor: 'pointer',
          }}
        >
            <option value="all">All stigma types</option>
            <option value="as">{STIGMA_TYPE_LABELS.as}</option>
            <option value="es">{STIGMA_TYPE_LABELS.es}</option>
            <option value="is">{STIGMA_TYPE_LABELS.is}</option>
        </select>

        <label style={{ marginRight: 8, fontWeight: 'bold', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
          Dimension:
        </label>
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value as 'hiv' | 'mh' | 'sgm' | 'em')}
          style={{
            padding: 'clamp(6px, 1.5vw, 8px)',
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
            cursor: 'pointer',
          }}
        >
          {domainOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
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
          type="line"
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
}
