import React, { useMemo, useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { getAggregationLevel, aggregateData } from './aggregation';

interface MonthlyBarChartProps {
  allPatientsData: any[];
  selectedYear: string;
  onYearChange: (year: string) => void;
  availableYears: string[];
  // optional date range (ISO strings: yyyy-mm-dd)
  startDate?: string;
  endDate?: string;
}

export function MonthlyBarChart({
  allPatientsData,
  selectedYear,
  onYearChange,
  availableYears,
  startDate,
  endDate,
}: MonthlyBarChartProps) {
  // Local month state default to current month
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [isNarrow, setIsNarrow] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 1000 : false);

  // If startDate and endDate provided, compute aggregation dynamically
  const countsByDay = useMemo(() => {
    const counts: Record<number, number> = {};
    allPatientsData.forEach((patientData) => {
      patientData.forEach((obs: any) => {
        const date = new Date(obs.effectiveDateTime || obs.date);
        if (!date) return;
        const offsetInMs = 5 * 60 * 60 * 1000 + 45 * 60 * 1000;
        const nepaliDate = new Date(date.getTime() + offsetInMs);
        const y = nepaliDate.getFullYear().toString();
        const m = nepaliDate.getMonth();
        const d = nepaliDate.getDate();
        if (y === selectedYear && m === month) {
          counts[d] = (counts[d] || 0) + 1;
        }
      });
    });
    return counts;
  }, [allPatientsData, selectedYear, month]);

  const dynamic = useMemo(() => {
    if (!startDate || !endDate) return null;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const level = getAggregationLevel(s, e);
    return aggregateData(allPatientsData, s, e, level);
  }, [allPatientsData, startDate, endDate]);

  const monthCounts = useMemo(
    () => aggregateYearMonthPatientCount(allPatientsData, selectedYear),
    [allPatientsData, selectedYear],
  );

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const data = dynamic
    ? {
        labels: dynamic.labels,
        datasets: [
          {
            label: '',
            data: dynamic.counts,
            backgroundColor: '#1f2e5bff',
          },
        ],
      }
    : {
        labels: months,
        datasets: [
          {
            label: '',
            data: monthCounts,
            backgroundColor: '#1f2e5bff',
          },
        ],
      };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'block',
      }}
    >
      <div>
        <div style={{ height: 420 }}>
          <Chart
            type="bar"
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              layout: { padding: { left: 8, right: 8, top: 8, bottom: 8 } },
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: false,
                    text: '',
                  },
                  ticks: {
                    display: false,
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: 'Month',
                  },
                  ticks: { autoSkip: true, maxRotation: 0, minRotation: 0 },
                },
              },
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------- Aggregate Data By Year and Month ----------------
function aggregateYearMonthPatientCount(allPatientsData: any[], selectedYear: string) {
  // For each month, collect a Set of patient IDs
  const monthPatientSets: Array<Set<string>> = Array(12)
    .fill(null)
    .map(() => new Set());

  allPatientsData.forEach((patientData, patientIdx) => {
    patientData.forEach((obs: any) => {
      const date = new Date(obs.effectiveDateTime || obs.date);
      if (!date) return;
      // Adjust for Nepali Time (UTC+5:45)
      const offsetInMs = 5 * 60 * 60 * 1000 + 45 * 60 * 1000;
      const nepaliDate = new Date(date.getTime() + offsetInMs);
      const year = nepaliDate.getFullYear().toString();
      const month = nepaliDate.getMonth(); // 0=Jan, 11=Dec
      if (year === selectedYear) {
        // Use patientIdx as unique patient identifier (since each patientData is for one patient)
        monthPatientSets[month].add(String(patientIdx));
      }
    });
  });

  // Convert sets to counts
  return monthPatientSets.map((set) => set.size);
}
