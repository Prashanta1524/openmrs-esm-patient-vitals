import React, { useMemo, useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { getAggregationLevel, aggregateData } from './aggregation';

interface MonthlyBarChartProps {
  allPatientsData: any[];
  selectedYear: string;
  onYearChange: (year: string) => void;
  availableYears: string[];
  startDate?: string;
  endDate?: string;
  currentLocationUuid?: string;
}

export function MonthlyBarChart({
  allPatientsData,
  selectedYear,
  onYearChange,
  availableYears,
  startDate,
  endDate,
  currentLocationUuid,
}: MonthlyBarChartProps) {
  // Local month state default to current month
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [isNarrow, setIsNarrow] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 1000 : false);

  const stigmaOnlyPatientsData = useMemo(
    () => allPatientsData.map((patientData) => patientData.filter((obs: any) => isStigmaObservation(obs))),
    [allPatientsData],
  );

  const countsByDay = useMemo(() => {
    const counts: Record<number, number> = {};
    stigmaOnlyPatientsData.forEach((patientData) => {
      patientData.forEach((obs: any) => {
        // Filter by location
        if (currentLocationUuid && obs.locationUuid !== currentLocationUuid) return;

        const date = new Date(obs.effectiveDateTime || obs.date);
        if (!date) return;
        const y = date.getFullYear().toString();
        const m = date.getMonth();
        const d = date.getDate();
        if (y === selectedYear && m === month) {
          counts[d] = (counts[d] || 0) + 1;
        }
      });
    });
    return counts;
  }, [stigmaOnlyPatientsData, selectedYear, month, currentLocationUuid]);

  // const dynamic = useMemo(() => {
  //   if (!startDate || !endDate) return null;
  //   const s = new Date(startDate);
  //   const e = new Date(endDate);
  //   const level = getAggregationLevel(s, e);
  //   return aggregateData(allPatientsData, s, e, level);
  // }, [allPatientsData, startDate, endDate]);

  const dynamic = useMemo(() => {
    if (!startDate && !endDate) return null;
    const rawStart = startDate ?? endDate;
    const rawEnd = endDate ?? startDate;
    const s = rawStart ? new Date(rawStart) : null;
    const e = rawEnd ? new Date(rawEnd) : null;
    if (!s || !e || isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    const rangeStart = s <= e ? s : e;
    const rangeEnd = s <= e ? e : s;
    const level = getAggregationLevel(rangeStart, rangeEnd);
    return aggregateData(stigmaOnlyPatientsData, rangeStart, rangeEnd, level);
  }, [stigmaOnlyPatientsData, startDate, endDate]);

  const monthCounts = useMemo(
    () => aggregateYearMonthPatientCount(stigmaOnlyPatientsData, selectedYear, currentLocationUuid),
    [stigmaOnlyPatientsData, selectedYear, currentLocationUuid],
  );

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Modern gradient colors for bars
  const createGradient = (ctx: any, chartArea: any) => {
    if (!chartArea) return '#4F46E5';
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, '#4F46E5'); // Indigo-600
    gradient.addColorStop(0.5, '#6366F1'); // Indigo-500
    gradient.addColorStop(1, '#818CF8'); // Indigo-400
    return gradient;
  };

  const data = dynamic
    ? {
        labels: dynamic.labels,
        datasets: [
          {
            label: 'Patient Count',
            data: dynamic.counts,
            backgroundColor: (context: any) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return '#19147bff';
              return createGradient(ctx, chartArea);
            },
            borderRadius: 8,
            borderSkipped: false,
            hoverBackgroundColor: '#2b21bfff',
          },
        ],
      }
    : {
        labels: months,
        datasets: [
          {
            label: 'Patient Count',
            data: monthCounts,
            backgroundColor: (context: any) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return '#4F46E5';
              return createGradient(ctx, chartArea);
            },
            borderRadius: 8,
            borderSkipped: false,
            hoverBackgroundColor: '#3730A3',
          },
        ],
      };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        padding: 'clamp(1rem, 2.5vw, 1.5rem)',
        marginBottom: '1rem',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
      }}
    >
      <div>
        <div style={{ height: window.innerWidth <= 480 ? 300 : window.innerWidth <= 768 ? 350 : 420, width: '100%' }}>
          <Chart
            type="bar"
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              layout: {
                padding: {
                  left: window.innerWidth <= 480 ? 8 : 12,
                  right: window.innerWidth <= 480 ? 8 : 12,
                  top: window.innerWidth <= 480 ? 12 : 16,
                  bottom: window.innerWidth <= 480 ? 8 : 12,
                },
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: 'rgba(30, 41, 59, 0.95)',
                  titleColor: '#fff',
                  bodyColor: '#e2e8f0',
                  padding: 12,
                  borderColor: 'rgba(148, 163, 184, 0.3)',
                  borderWidth: 1,
                  cornerRadius: 8,
                  displayColors: false,
                  titleFont: {
                    size: window.innerWidth <= 480 ? 13 : 14,
                    weight: 'bold',
                  },
                  bodyFont: {
                    size: window.innerWidth <= 480 ? 12 : 13,
                  },
                  callbacks: {
                    label: function (context) {
                      return `${context.parsed.y}`;
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(148, 163, 184, 0.15)',
                    lineWidth: 1,
                  },
                  border: {
                    display: false,
                  },
                  ticks: {
                    font: {
                      size: window.innerWidth <= 480 ? 11 : window.innerWidth <= 768 ? 12 : 13,
                      weight: 'normal',
                    },
                    color: '#64748b',
                    padding: 8,
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                  border: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: dynamic ? 'Time Period' : 'Month',
                    font: {
                      size: window.innerWidth <= 480 ? 12 : window.innerWidth <= 768 ? 13 : 14,
                      weight: 'bold',
                    },
                    color: '#475569',
                    padding: { top: 10 },
                  },
                  ticks: {
                    autoSkip: window.innerWidth <= 480,
                    maxRotation: window.innerWidth <= 480 ? 45 : 0,
                    minRotation: 0,
                    font: {
                      size: window.innerWidth <= 480 ? 10 : window.innerWidth <= 768 ? 11 : 12,
                      weight: 'normal',
                    },
                    color: '#64748b',
                    padding: 6,
                  },
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
function aggregateYearMonthPatientCount(allPatientsData: any[], selectedYear: string, currentLocationUuid?: string) {
  // For each month, collect a Set of patient IDs
  const monthPatientSets: Array<Set<string>> = Array(12)
    .fill(null)
    .map(() => new Set());

  allPatientsData.forEach((patientData, patientIdx) => {
    patientData.forEach((obs: any) => {
      // Filter by location
      if (currentLocationUuid && obs.locationUuid !== currentLocationUuid) return;

      const date = new Date(obs.effectiveDateTime || obs.date);
      if (!date) return;
      const year = date.getFullYear().toString();
      const month = date.getMonth();
      if (year === selectedYear) {
        monthPatientSets[month].add(String(patientIdx));
      }
    });
  });

  return monthPatientSets.map((set) => set.size);
}

function isStigmaObservation(obs: any): boolean {
  return !!obs?.code?.coding?.some(
    (coding: any) =>
      coding?.display?.toLowerCase().includes('stigma') || coding?.code?.toLowerCase().includes('stigma'),
  );
}
