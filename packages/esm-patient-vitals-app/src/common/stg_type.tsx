import React, { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

export type StigmaType = 'आत्मलान्छना' | 'अपेक्षित लान्छना' | 'व्यावहारिक लान्छना';

export interface StgTypeProps {
  allPatientsData: any[];
  startDate?: string; // ISO yyyy-mm-dd
  endDate?: string; // ISO yyyy-mm-dd
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

function computeMaxScores(allPatientsData: any[], startDate?: string, endDate?: string): Record<string, number> {
  const maxMap: Record<string, number> = {
    आत्मलान्छना: 0,
    'अपेक्षित लान्छना': 0,
    'व्यावहारिक लान्छना': 0,
  };

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  (allPatientsData || []).forEach((patientObs) => {
    (patientObs || []).forEach((obs: any) => {
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

      if (value > (maxMap[norm] || 0)) {
        maxMap[norm] = value;
      }
    });
  });

  return maxMap;
}

export const StgTypeVisualization: React.FC<StgTypeProps> = ({ allPatientsData, startDate, endDate }) => {
  const maxMap = useMemo(
    () => computeMaxScores(allPatientsData, startDate, endDate),
    [allPatientsData, startDate, endDate],
  );
  const labels: StigmaType[] = ['आत्मलान्छना', 'अपेक्षित लान्छना', 'व्यावहारिक लान्छना'];
  const data = labels.map((l) => +(maxMap[l] || 0));

  const max = Math.max(...data);
  const highestType = max > 0 ? labels[data.indexOf(max)] : '';

  return (
    <div style={{ background: '#fff', padding: '1rem', borderRadius: 10, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 8 }}>
        {/* <h3 style={{ margin: 0 }}>Stigma Type</h3> */}
        {highestType ? (
          <div style={{ marginTop: 6 }}>
            Highest Score Type: <strong>{highestType}</strong> — {max}
          </div>
        ) : (
          <div style={{ marginTop: 6, color: '#666' }}></div>
        )}
      </div>

      {data.every((v) => v === 0) ? (
        <div style={{ padding: 12, color: '#666' }}>No stigma scores found</div>
      ) : (
        <Chart
          type="bar"
          data={{
            labels,
            datasets: [{ label: 'Max score', data, backgroundColor: ['#FFA500', '#87CEEB', '#90EE90'] }],
          }}
          options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }}
        />
      )}
    </div>
  );
};

export default StgTypeVisualization;
