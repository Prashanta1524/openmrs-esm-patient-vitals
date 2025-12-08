import React, { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

export type StigmaType = 'आत्मलान्छना' | 'अपेक्षित लान्छना' | 'व्यावहारिक लान्छना';

export interface StgTypeProps {
  allPatientsData: any[];
  startDate?: string; // ISO yyyy-mm-dd
  endDate?: string; // ISO yyyy-mm-dd
  currentLocationUuid?: string;
}

function normalizeStigmaType(raw: string | undefined): string {
  const s = (raw || '').toLowerCase();
  if (!s) return '';
  if (s.includes('internal') || s.includes('internalized') || s.includes('आत्म')) return 'आत्मलान्छना';
  if (s.includes('anticip') || s.includes('anticipated') || s.includes('अपेक्षित')) return 'अपेक्षित लान्छना';
  if (s.includes('enact') || s.includes('enacted') || s.includes('व्यावहारिक')) return 'व्यावहारिक लान्छना';
  return '';
}

function getNumericValueFromObservation(obs: any): number | null {
  // Try common numeric fields used in this project: valueQuantity.value, valueNumber, value
  if (!obs) return null;
  const vq = obs.valueQuantity?.value;
  if (typeof vq === 'number') return vq;
  if (typeof obs.valueNumber === 'number') return obs.valueNumber;
  if (typeof obs.value === 'number') return obs.value;

  // Some observations use components; try to find a numeric component value
  if (Array.isArray(obs.component)) {
    for (const c of obs.component) {
      const cv = c.valueQuantity?.value ?? c.valueNumber ?? c.value;
      if (typeof cv === 'number') return cv;
    }
  }

  return null;
}

type Agg = { sum: number; count: number; avg: number };

function computeMaxScores(
  allPatientsData: any[],
  startDate?: string,
  endDate?: string,
  currentLocationUuid?: string,
): { maxMap: Record<string, number>; artIdMap: Record<string, string> } {
  const maxMap: Record<string, number> = {
    आत्मलान्छना: 0,
    'अपेक्षित लान्छना': 0,
    'व्यावहारिक लान्छना': 0,
  };

  const artIdMap: Record<string, string> = {
    आत्मलान्छना: '',
    'अपेक्षित लान्छना': '',
    'व्यावहारिक लान्छना': '',
  };

  console.log('\n🔍 ===== STIGMA TYPE QA LOG START ===== ');
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  (allPatientsData || []).forEach((patientObs, patientIndex) => {
    (patientObs || []).forEach((obs: any) => {
      // Filter by location first
      if (currentLocationUuid && obs.locationUuid !== currentLocationUuid) return;

      const ds = obs.effectiveDateTime || obs.date;
      if (!ds) return;
      const d = new Date(ds);
      if (start && d < start) return;
      if (end && d > end) return;

      const raw = (obs.stigmaType || obs.code?.coding?.[0]?.display || obs.code?.text || '').toString();
      const norm = normalizeStigmaType(raw);
      if (!norm) return;

      const value = getNumericValueFromObservation(obs);
      if (value === null || Number.isNaN(value)) return;

      console.log(`📊 Patient ${patientIndex} | ${norm} | Score: ${value} | Current Max: ${maxMap[norm]}`);

      if (value > (maxMap[norm] || 0)) {
        maxMap[norm] = value;
        artIdMap[norm] = obs.artId || `Patient ${patientIndex}`;
        console.log(`✅ NEW MAX for ${norm}: ${value} (${artIdMap[norm]})`);
      }
    });
  });

  console.log('\n📈 FINAL STIGMA TYPE RESULTS:');
  console.log('आत्मलान्छना (Internalized):', maxMap['आत्मलान्छना'], '- ART ID:', artIdMap['आत्मलान्छना']);
  console.log('अपेक्षित लान्छना (Anticipated):', maxMap['अपेक्षित लान्छना'], '- ART ID:', artIdMap['अपेक्षित लान्छना']);
  console.log(
    'व्यावहारिक लान्छना (Enacted):',
    maxMap['व्यावहारिक लान्छना'],
    '- ART ID:',
    artIdMap['व्यावहारिक लान्छना'],
  );
  console.log('🔍 ===== STIGMA TYPE QA LOG END =====\n');

  return { maxMap, artIdMap };
}

export const StgTypeVisualization: React.FC<StgTypeProps> = ({
  allPatientsData,
  startDate,
  endDate,
  currentLocationUuid,
}) => {
  const { maxMap, artIdMap } = useMemo(
    () => computeMaxScores(allPatientsData, startDate, endDate, currentLocationUuid),
    [allPatientsData, startDate, endDate, currentLocationUuid],
  );
  const labels: StigmaType[] = ['आत्मलान्छना', 'अपेक्षित लान्छना', 'व्यावहारिक लान्छना'];
  const data = labels.map((l) => +(maxMap[l] || 0));

  console.log('📊 CHART DATA BEING RENDERED:');
  console.log('maxMap:', maxMap);
  console.log('artIdMap:', artIdMap);
  console.log('Chart data array:', data);
  console.log('Labels:', labels);

  const max = Math.max(...data);
  const highestType = max > 0 ? labels[data.indexOf(max)] : '';

  return (
    <div
      style={{
        background: '#fff',
        padding: 'clamp(0.75rem, 2vw, 1.5rem)',
        borderRadius: 10,
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: 8 }}>
        {/* <h3 style={{ margin: 0 }}>Stigma Type</h3> */}
        {highestType ? (
          <div
            style={{
              marginTop: 6,
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              textAlign: 'center',
            }}
          >
            Highest Score Type: <strong>{highestType}</strong> — {max}
          </div>
        ) : (
          <div style={{ marginTop: 6, color: '#666' }}></div>
        )}
      </div>

      {data.every((v) => v === 0) ? (
        <div
          style={{
            padding: 'clamp(8px, 2vw, 12px)',
            color: '#666',
            textAlign: 'center',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
          }}
        >
          No stigma scores found
        </div>
      ) : (
        <div
          style={{
            height: window.innerWidth <= 480 ? '250px' : window.innerWidth <= 768 ? '300px' : '350px',
            width: '100%',
            position: 'relative',
          }}
        >
          <Chart
            type="bar"
            data={{
              labels,
              datasets: [{ label: 'Max score', data, backgroundColor: ['#FFA500', '#87CEEB', '#90EE90'] }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  titleFont: {
                    size: window.innerWidth <= 480 ? 11 : 13,
                  },
                  bodyFont: {
                    size: window.innerWidth <= 480 ? 10 : 12,
                  },
                  callbacks: {
                    afterLabel: (context: any) => {
                      const label = context.label;
                      const artId = artIdMap[label];
                      return artId ? `ART ID: ${artId}` : '';
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    font: {
                      size: window.innerWidth <= 480 ? 9 : window.innerWidth <= 768 ? 10 : 11,
                    },
                  },
                },
                x: {
                  ticks: {
                    font: {
                      size: window.innerWidth <= 480 ? 9 : window.innerWidth <= 768 ? 10 : 11,
                    },
                    maxRotation: window.innerWidth <= 480 ? 45 : 0,
                    minRotation: 0,
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StgTypeVisualization;
