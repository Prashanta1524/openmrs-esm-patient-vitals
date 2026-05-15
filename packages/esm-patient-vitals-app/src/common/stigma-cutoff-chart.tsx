import React, { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import type { StigmaData } from './stigma-data.resource';
import 'chart.js/auto';

interface StigmaCutoffSummary {
  totalPatients: number;
  matchedPatients: number;
  unmatchedPatients: number;
}

interface StigmaCutoffChartProps {
  stigmaCutoffSummary: StigmaCutoffSummary | null;
  patientsData?: any[];
  stigmaData?: StigmaData[];
  stigmaScoreLabel?: string;
  stigmaScoreThreshold?: number;
}

type StigmaTypeKey = 'anticipated' | 'enacted' | 'internalized';

interface ChartAverages {
  aboveAverage: number;
  belowAverage: number;
  aboveCount: number;
  belowCount: number;
  totalCount: number;
  cutoff: number;
}

const STIGMA_CUTOFFS: Record<StigmaTypeKey, number> = {
  anticipated: 40,
  enacted: 43,
  internalized: 33,
};

function normalizeStigmaType(entry: any): StigmaTypeKey | null {
  const type = (entry.stigmaType || entry.type || entry.display || '').toString().toLowerCase();
  if (type.includes('anticipated') || type.includes('अपेक्षित')) return 'anticipated';
  if (type.includes('enacted') || type.includes('व्यावहारिक')) return 'enacted';
  if (type.includes('internalized') || type.includes('आत्म')) return 'internalized';
  return null;
}

function getIntersectionalScore(entry: any, stigmaType: StigmaTypeKey | null = null): number | undefined {
  if (entry.intersectionalScore !== undefined && entry.intersectionalScore !== null) {
    return Number(entry.intersectionalScore);
  }
  if (stigmaType === 'anticipated' && entry.intersectional_stigma_as !== undefined) {
    return Number(entry.intersectional_stigma_as);
  }
  if (stigmaType === 'enacted' && entry.intersectional_stigma_es !== undefined) {
    return Number(entry.intersectional_stigma_es);
  }
  if (stigmaType === 'internalized' && entry.intersectional_stigma_is !== undefined) {
    return Number(entry.intersectional_stigma_is);
  }
  const scoreString = (entry.display || entry.stigmaScore || '').toString();
  const match = scoreString.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : undefined;
}

function calculateStigmaStrategyAverages(stigmaData: StigmaData[], overallCutoff = 0) {
  const averages: Record<'overall' | StigmaTypeKey, ChartAverages> = {
    overall: { aboveAverage: 0, belowAverage: 0, aboveCount: 0, belowCount: 0, totalCount: 0, cutoff: overallCutoff },
    anticipated: { aboveAverage: 0, belowAverage: 0, aboveCount: 0, belowCount: 0, totalCount: 0, cutoff: STIGMA_CUTOFFS.anticipated },
    enacted: { aboveAverage: 0, belowAverage: 0, aboveCount: 0, belowCount: 0, totalCount: 0, cutoff: STIGMA_CUTOFFS.enacted },
    internalized: { aboveAverage: 0, belowAverage: 0, aboveCount: 0, belowCount: 0, totalCount: 0, cutoff: STIGMA_CUTOFFS.internalized },
  };

  const sums: Record<'overall' | StigmaTypeKey, { above: number; below: number }> = {
    overall: { above: 0, below: 0 },
    anticipated: { above: 0, below: 0 },
    enacted: { above: 0, below: 0 },
    internalized: { above: 0, below: 0 },
  };

  stigmaData.forEach((entry) => {
    const stigmaType = normalizeStigmaType(entry);
    const score = getIntersectionalScore(entry, stigmaType);
    if (score === undefined || Number.isNaN(score) || !stigmaType) {
      return;
    }

    const typeCutoff = STIGMA_CUTOFFS[stigmaType];
    const overallAbove = overallCutoff ? score >= overallCutoff : false;
    const typeAbove = score >= typeCutoff;

    if (overallAbove) {
      averages.overall.aboveCount += 1;
      sums.overall.above += score;
    } else {
      averages.overall.belowCount += 1;
      sums.overall.below += score;
    }
    averages.overall.totalCount += 1;

    if (typeAbove) {
      averages[stigmaType].aboveCount += 1;
      sums[stigmaType].above += score;
    } else {
      averages[stigmaType].belowCount += 1;
      sums[stigmaType].below += score;
    }
    averages[stigmaType].totalCount += 1;
  });

  (Object.keys(averages) as Array<'overall' | StigmaTypeKey>).forEach((key) => {
    const group = averages[key];
    group.aboveAverage = group.aboveCount > 0 ? sums[key].above / group.aboveCount : 0;
    group.belowAverage = group.belowCount > 0 ? sums[key].below / group.belowCount : 0;
  });

  return averages;
}

export function StigmaCutoffChart({
  stigmaCutoffSummary,
  patientsData,
  stigmaData,
  stigmaScoreLabel,
  stigmaScoreThreshold,
}: StigmaCutoffChartProps) {
  const chartCounts = useMemo(() => {
    if (stigmaData && stigmaData.length > 0) {
      return calculateStigmaStrategyAverages(stigmaData, stigmaScoreThreshold ?? 0);
    }

    if (patientsData && stigmaScoreLabel && stigmaScoreThreshold) {
      const result = calculateStigmaThresholdCounts(patientsData, stigmaScoreLabel, stigmaScoreThreshold);
      const total = result.aboveThresholdCount + result.belowThresholdCount;
      return {
        overall: {
          aboveAverage: total > 0 ? result.aboveThresholdCount / total : 0,
          belowAverage: total > 0 ? result.belowThresholdCount / total : 0,
          aboveCount: result.aboveThresholdCount,
          belowCount: result.belowThresholdCount,
          totalCount: total,
          cutoff: stigmaScoreThreshold,
        },
        anticipated: { aboveAverage: 0, belowAverage: 0, aboveCount: 0, belowCount: 0, totalCount: 0, cutoff: STIGMA_CUTOFFS.anticipated },
        enacted: { aboveAverage: 0, belowAverage: 0, aboveCount: 0, belowCount: 0, totalCount: 0, cutoff: STIGMA_CUTOFFS.enacted },
        internalized: { aboveAverage: 0, belowAverage: 0, aboveCount: 0, belowCount: 0, totalCount: 0, cutoff: STIGMA_CUTOFFS.internalized },
      };
    }

    if (stigmaCutoffSummary) {
      const total = stigmaCutoffSummary.totalPatients;
      return {
        overall: {
          aboveAverage: total > 0 ? stigmaCutoffSummary.matchedPatients / total : 0,
          belowAverage: total > 0 ? stigmaCutoffSummary.unmatchedPatients / total : 0,
          aboveCount: stigmaCutoffSummary.matchedPatients,
          belowCount: stigmaCutoffSummary.unmatchedPatients,
          totalCount: total,
          cutoff: stigmaScoreThreshold ?? 0,
        },
        anticipated: { aboveAverage: 0, belowAverage: 0, aboveCount: 0, belowCount: 0, totalCount: 0, cutoff: STIGMA_CUTOFFS.anticipated },
        enacted: { aboveAverage: 0, belowAverage: 0, aboveCount: 0, belowCount: 0, totalCount: 0, cutoff: STIGMA_CUTOFFS.enacted },
        internalized: { aboveAverage: 0, belowAverage: 0, aboveCount: 0, belowCount: 0, totalCount: 0, cutoff: STIGMA_CUTOFFS.internalized },
      };
    }

    return null;
  }, [stigmaCutoffSummary, patientsData, stigmaData, stigmaScoreLabel, stigmaScoreThreshold]);

  if (!chartCounts) {
    return <p>तथ्यांक विश्लेषण गर्दै...</p>;
  }

  const makeChartConfig = (counts: ChartAverages) => ({
    labels: ['Above cut-off score', 'Below cut-off score'],
    datasets: [
      {
        data: [counts.aboveAverage, counts.belowAverage],
        backgroundColor: ['#f7cc5c', '#28a6a4'],
        borderColor: ['#fff', '#fff'],
        borderWidth: 2,
      },
    ],
  });

  const chartCards = [
    { title: 'Overall Intersectional Stigma', counts: chartCounts.overall },
    { title: 'Anticipated Stigma', counts: chartCounts.anticipated },
    { title: 'Enacted Stigma', counts: chartCounts.enacted },
    { title: 'Internalized Stigma', counts: chartCounts.internalized },
  ];

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
        Above/Below Intersectional Stigma Cut-off Score
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          alignItems: 'start',
        }}
      >
        {chartCards.map((card) => {
          const totalCount = card.counts.totalCount;
          const aboveAverage = card.counts.aboveAverage;
          const belowAverage = card.counts.belowAverage;
          return (
            <div
              key={card.title}
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 1px 6px rgba(15, 23, 42, 0.08)',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ margin: '0 0 0.75rem', color: '#111827', fontSize: '1.1rem' }}>{card.title}</h4>
              <Chart
                type="pie"
                data={makeChartConfig(card.counts)}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        font: { size: 12, weight: 'bold' },
                        padding: 12,
                        color: '#1f2937',
                      },
                    },
                    tooltip: {
                      titleFont: { size: 14, weight: 'bold' },
                      bodyFont: { size: 13 },
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      titleColor: '#111827',
                      bodyColor: '#111827',
                      borderColor: '#d1d5db',
                      borderWidth: 1,
                      callbacks: {
                        label: function (context) {
                          const value = context.raw as number;
                          const label = context.label || '';
                          const percentage = totalCount > 0 ? ((value / (aboveAverage + belowAverage)) * 100).toFixed(1) : '0.0';
                          return `${label}: ${percentage}% (${value.toFixed(1)})`;
                        },
                      },
                    },
                  },
                }}
              />
              <div style={{ marginTop: '1rem', textAlign: 'center', color: '#374151' }}>
                <p style={{ margin: '0.2rem 0', fontWeight: 600 }}>
                  Above cut-off score average: {aboveAverage.toFixed(1)}
                </p>
                <p style={{ margin: '0.2rem 0', fontWeight: 600 }}>
                  Below cut-off score average: {belowAverage.toFixed(1)}
                </p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                  Total entries: {totalCount}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to calculate stigma threshold counts
function calculateStigmaThresholdCounts(patientsData: any[], stigmaScoreLabel: string, stigmaScoreThreshold: number) {
  let aboveThresholdCount = 0;
  let belowThresholdCount = 0;

  patientsData.forEach((patient: any[]) => {
    // Find the most recent stigma score for each patient
    let mostRecent: any = null;
    let mostRecentDate: Date | null = null;

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
