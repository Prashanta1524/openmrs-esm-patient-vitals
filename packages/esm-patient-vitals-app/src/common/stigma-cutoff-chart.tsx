import React, { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

interface StigmaCutoffSummary {
  totalPatients: number;
  matchedPatients: number;
  unmatchedPatients: number;
}

interface StigmaCutoffChartProps {
  stigmaCutoffSummary: StigmaCutoffSummary | null;
  patientsData?: any[];
  stigmaScoreLabel?: string;
  stigmaScoreThreshold?: number;
}

export function StigmaCutoffChart({
  stigmaCutoffSummary,
  patientsData,
  stigmaScoreLabel,
  stigmaScoreThreshold,
}: StigmaCutoffChartProps) {
  // If we have the raw data and should calculate
  const calculatedData = useMemo(() => {
    if (patientsData && stigmaScoreLabel && stigmaScoreThreshold) {
      return calculateStigmaThresholdCounts(patientsData, stigmaScoreLabel, stigmaScoreThreshold);
    }
    return null;
  }, [patientsData, stigmaScoreLabel, stigmaScoreThreshold]);

  // Use either pre-calculated or calculated data
  const chartData = useMemo(() => {
    if (calculatedData) {
      return {
        aboveThreshold: calculatedData.aboveThresholdCount,
        belowThreshold: calculatedData.belowThresholdCount,
        total: calculatedData.aboveThresholdCount + calculatedData.belowThresholdCount,
      };
    } else if (stigmaCutoffSummary) {
      return {
        aboveThreshold: stigmaCutoffSummary.matchedPatients,
        belowThreshold: stigmaCutoffSummary.unmatchedPatients,
        total: stigmaCutoffSummary.totalPatients,
      };
    }
    return null;
  }, [calculatedData, stigmaCutoffSummary]);

  // Loading state
  if (!chartData) {
    return <p>तथ्यांक विश्लेषण गर्दै...</p>;
  }

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
        लान्छना विश्लेषण नतिजाहरू
      </h3>
      <div
        style={{
          maxWidth: '500px',
          margin: '20px auto',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        <Chart
          type="pie"
          data={{
            labels: ['उच्च लान्छना स्कोर', 'न्यून लान्छना स्कोर'],
            datasets: [
              {
                data: [chartData.aboveThreshold, chartData.belowThreshold],
                backgroundColor: ['#f7cc5c', '#28a6a4'],
                borderColor: ['#fff', '#fff'],
                borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'bottom' as const,
                labels: {
                  font: {
                    size: 14,
                    weight: 'bold',
                  },
                  padding: 20,
                  color: '#333',
                },
              },
              tooltip: {
                titleFont: {
                  size: 14,
                  weight: 'bold',
                },
                bodyFont: {
                  size: 13,
                },
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#333',
                bodyColor: '#333',
                borderColor: '#ccc',
                borderWidth: 1,
                callbacks: {
                  label: function (context) {
                    const total = chartData.total;
                    const value = context.raw as number;
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${context.label}: ${percentage}% (${value} बिरामीहरू)`;
                  },
                },
              },
            },
          }}
        />
      </div>
      {stigmaScoreThreshold && (
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#555' }}>
          <p>
            Threshold: {stigmaScoreThreshold} | Total Patients: {chartData.total}
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to calculate stigma threshold counts
function calculateStigmaThresholdCounts(patientsData: any[], stigmaScoreLabel: string, stigmaScoreThreshold: number) {
  let aboveThresholdCount = 0;
  let belowThresholdCount = 0;

  patientsData.forEach((patient) => {
    // Find the most recent stigma score for each patient
    let mostRecent = null;
    let mostRecentDate = null;

    patient.forEach((obs: any) => {
      if (obs.display?.includes(stigmaScoreLabel)) {
        const date = new Date(obs.effectiveDateTime || obs.date);
        if (!mostRecentDate || date > mostRecentDate) {
          mostRecentDate = date;
          mostRecent = obs;
        }
      }
    });

    if (mostRecent) {
      // Extract the numeric value from the display string
      // Assuming the format is like "Stigma Score: 12"
      const valueMatch = mostRecent.display.match(/\d+(\.\d+)?/);
      if (valueMatch) {
        const value = parseFloat(valueMatch[0]);
        if (value >= stigmaScoreThreshold) {
          aboveThresholdCount++;
        } else {
          belowThresholdCount++;
        }
      }
    }
  });

  return { aboveThresholdCount, belowThresholdCount };
}
