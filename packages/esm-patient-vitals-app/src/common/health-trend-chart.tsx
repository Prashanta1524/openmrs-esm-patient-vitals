import React, { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

interface HealthTrendChartProps {
  allPatientsData: any[];
  healthScoreLabel: string;
  periodInMonths?: number; // Default to 12 months
}

export function HealthTrendChart({ allPatientsData, healthScoreLabel, periodInMonths = 12 }: HealthTrendChartProps) {
  // Calculate the trend data for health scores
  const { months, averages } = useMemo(() => {
    return calculateMonthlyHealthScoreAverages(allPatientsData, healthScoreLabel, periodInMonths);
  }, [allPatientsData, healthScoreLabel, periodInMonths]);

  // Chart data
  const data = {
    labels: months,
    datasets: [
      {
        label: 'Average Health Score',
        data: averages,
        borderColor: '#1f77b4',
        backgroundColor: 'rgba(31, 119, 180, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Average Health Score',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function (context: any) {
            return `Avg: ${context.raw.toFixed(1)}`;
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h3
        style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#333',
          textRendering: 'optimizeLegibility',
          marginBottom: '1.5rem',
        }}
      >
        Health Score Trend (Last {periodInMonths} Months)
      </h3>
      <div style={{ maxHeight: '400px' }}>
        <Chart type="line" data={data} options={options} />
      </div>
    </div>
  );
}

// Helper function to calculate monthly health score averages
function calculateMonthlyHealthScoreAverages(allPatientsData: any[], healthScoreLabel: string, periodInMonths: number) {
  const now = new Date();
  const months: string[] = [];
  const averages: number[] = [];
  const monthlyScores: { [key: string]: number[] } = {};

  // Generate month labels for the past periodInMonths
  for (let i = periodInMonths - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const monthYear = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
    months.push(monthYear);
    monthlyScores[monthYear] = [];
  }

  // Collect health scores by month
  allPatientsData.forEach((patient) => {
    patient.forEach((obs: any) => {
      if (obs.display?.includes(healthScoreLabel)) {
        const date = new Date(obs.effectiveDateTime || obs.date);
        if (!date) return;

        // Adjust for Nepali Time (UTC+5:45)
        const offsetInMs = 5 * 60 * 60 * 1000 + 45 * 60 * 1000;
        const nepaliDate = new Date(date.getTime() + offsetInMs);

        // Check if date is within the last periodInMonths
        const monthsAgo = (now.getFullYear() - nepaliDate.getFullYear()) * 12 + now.getMonth() - nepaliDate.getMonth();

        if (monthsAgo >= 0 && monthsAgo < periodInMonths) {
          const monthYear = `${nepaliDate.toLocaleString('default', { month: 'short' })} ${nepaliDate.getFullYear()}`;

          // Extract the numeric value from the display string
          const valueMatch = obs.display.match(/\d+(\.\d+)?/);
          if (valueMatch && monthlyScores[monthYear]) {
            const value = parseFloat(valueMatch[0]);
            monthlyScores[monthYear].push(value);
          }
        }
      }
    });
  });

  // Calculate averages
  months.forEach((month) => {
    const scores = monthlyScores[month] || [];
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = scores.length > 0 ? sum / scores.length : 0;
    averages.push(avg);
  });

  return { months, averages };
}
