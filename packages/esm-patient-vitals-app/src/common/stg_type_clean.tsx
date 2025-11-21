import React, { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

export interface StgTypeProps {
  allPatientsData: any[];
  startDate?: string;
  endDate?: string;
}

function normalizeStigmaType(raw: string | undefined): string {
  const s = (raw || '').toLowerCase();
  if (!s) return '';
  if (s.includes('internal') || s.includes('internalized') || s.includes('आत्म')) return 'आत्मलान्छना';
  if (s.includes('anticip') || s.includes('anticipated') || s.includes('अपेक्षित')) return 'अपेक्षित लान्छना';
  if (s.includes('enact') || s.includes('enacted') || s.includes('व्यावहारिक')) return 'व्यावहारिक लान्छना';
  return '';
}

function computeUniquePatientCounts(allPatientsData: any[], startDate?: string, endDate?: string) {
  const counts: Record<string, number> = { आत्मलान्छना: 0, 'अपेक्षित लान्छना': 0, 'व्यावहारिक लान्छना': 0 };
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  (allPatientsData || []).forEach((patientObs) => {
    const seen = new Set<string>();
    (patientObs || []).forEach((obs: any) => {
      const ds = obs.effectiveDateTime || obs.date;
      if (!ds) return;
      const d = new Date(ds);
      if (start && d < start) return;
      if (end && d > end) return;
      const raw = (obs.stigmaType || obs.code?.coding?.[0]?.display || obs.code?.text || '').toString();
      const norm = normalizeStigmaType(raw);
      if (norm) seen.add(norm);
    });

    seen.forEach((t) => {
      if (counts[t] !== undefined) counts[t]++;
    });
  });

  return counts;
}

export const StgTypeVisualization: React.FC<StgTypeProps> = ({ allPatientsData, startDate, endDate }) => {
  const counts = useMemo(
    () => computeUniquePatientCounts(allPatientsData, startDate, endDate),
    [allPatientsData, startDate, endDate],
  );
  const labels = ['आत्मलान्छना', 'अपेक्षित लान्छना', 'व्यावहारिक लान्छना'];
  const data = labels.map((l) => counts[l] || 0);
  const total = data.reduce((s, v) => s + v, 0);
  const max = Math.max(...data);
  const highestType = max > 0 ? labels[data.indexOf(max)] : '';
  const highestPct = total > 0 ? ((max / total) * 100).toFixed(1) : '0.0';

  return (
    <div style={{ background: '#fff', padding: '1rem', borderRadius: 10, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Stigma Type — Unique patients</h3>
        {highestType ? (
          <div style={{ marginTop: 6 }}>
            Highest: <strong>{highestType}</strong> — {max} patients ({highestPct}%)
          </div>
        ) : (
          <div style={{ marginTop: 6, color: '#666' }}>No stigma observations found for the selected range.</div>
        )}
      </div>

      {total === 0 ? (
        <div style={{ padding: 12, color: '#666' }}>No stigma observations found for the current patient set.</div>
      ) : (
        <Chart
          type="bar"
          data={{
            labels,
            datasets: [{ label: 'Unique patients', data, backgroundColor: ['#FFA500', '#87CEEB', '#90EE90'] }],
          }}
          options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }}
        />
      )}
    </div>
  );
};

export default StgTypeVisualization;
