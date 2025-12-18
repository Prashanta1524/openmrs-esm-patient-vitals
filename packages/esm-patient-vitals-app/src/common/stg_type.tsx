import React, { useMemo, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

export type StigmaType = 'आत्मलान्छना' | 'अपेक्षित लान्छना' | 'व्यावहारिक लान्छना';
export type MetricType = 'min' | 'max' | 'all';

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
  if (!obs) return null;
  const vq = obs.valueQuantity?.value;
  if (typeof vq === 'number') return vq;
  if (typeof obs.valueNumber === 'number') return obs.valueNumber;
  if (typeof obs.value === 'number') return obs.value;

  if (Array.isArray(obs.component)) {
    for (const c of obs.component) {
      const cv = c.valueQuantity?.value ?? c.valueNumber ?? c.value;
      if (typeof cv === 'number') return cv;
    }
  }

  return null;
}

interface MinMaxData {
  internalized: { min: number; max: number };
  anticipated: { min: number; max: number };
  enacted: { min: number; max: number };
}

// Interface for time-series data
interface TimeSeriesDataPoint {
  date: string;
  timestamp: number;
  internalized: { min: number; max: number; values: number[] };
  anticipated: { min: number; max: number; values: number[] };
  enacted: { min: number; max: number; values: number[] };
}

// Format date key for grouping by date
function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Format display label for date
function formatDisplayLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split('-');
  return `${day}/${month}/${year.slice(2)}`;
}

// Compute time-series data grouped by date
function computeTimeSeriesData(
  allPatientsData: any[],
  startDate?: string,
  endDate?: string,
  currentLocationUuid?: string,
): TimeSeriesDataPoint[] {
  const dataMap: Map<
    string,
    {
      timestamp: number;
      internalized: number[];
      anticipated: number[];
      enacted: number[];
    }
  > = new Map();

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  (allPatientsData || []).forEach((patientObs) => {
    (patientObs || []).forEach((obs: any) => {
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

      const dateKey = formatDateKey(d);

      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, {
          timestamp: d.getTime(),
          internalized: [],
          anticipated: [],
          enacted: [],
        });
      }

      const entry = dataMap.get(dateKey)!;
      if (norm === 'आत्मलान्छना') {
        entry.internalized.push(value);
      } else if (norm === 'अपेक्षित लान्छना') {
        entry.anticipated.push(value);
      } else if (norm === 'व्यावहारिक लान्छना') {
        entry.enacted.push(value);
      }
    });
  });

  // Convert map to sorted array with computed min/max
  const sortedKeys = Array.from(dataMap.keys()).sort();

  // If no data, generate dummy data
  if (sortedKeys.length === 0) {
    const dummyData: TimeSeriesDataPoint[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = formatDateKey(date);
      dummyData.push({
        date: dateKey,
        timestamp: date.getTime(),
        internalized: { min: 30 + Math.random() * 20, max: 150 + Math.random() * 50, values: [] },
        anticipated: { min: 40 + Math.random() * 15, max: 120 + Math.random() * 40, values: [] },
        enacted: { min: 35 + Math.random() * 10, max: 80 + Math.random() * 25, values: [] },
      });
    }
    return dummyData;
  }

  return sortedKeys.map((dateKey) => {
    const entry = dataMap.get(dateKey)!;

    const computeStats = (values: number[]) => {
      if (values.length === 0) return { min: 0, max: 0, values };
      const positiveValues = values.filter((v) => v > 0);
      return {
        min: positiveValues.length > 0 ? Math.min(...positiveValues) : 0,
        max: values.length > 0 ? Math.max(...values) : 0,
        values,
      };
    };

    return {
      date: dateKey,
      timestamp: entry.timestamp,
      internalized: computeStats(entry.internalized),
      anticipated: computeStats(entry.anticipated),
      enacted: computeStats(entry.enacted),
    };
  });
}

function computeMinMax(
  allPatientsData: any[],
  startDate?: string,
  endDate?: string,
  currentLocationUuid?: string,
): MinMaxData {
  const result: MinMaxData = {
    internalized: { min: Infinity, max: -Infinity },
    anticipated: { min: Infinity, max: -Infinity },
    enacted: { min: Infinity, max: -Infinity },
  };

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  let hasData = false;

  // Debug: track all values found
  const allValues: { type: string; value: number }[] = [];

  (allPatientsData || []).forEach((patientObs) => {
    (patientObs || []).forEach((obs: any) => {
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

      hasData = true;
      allValues.push({ type: norm, value });

      if (norm === 'आत्मलान्छना') {
        // Only use value > 0 for min calculation
        if (value > 0) {
          result.internalized.min = Math.min(result.internalized.min, value);
        }
        result.internalized.max = Math.max(result.internalized.max, value);
      } else if (norm === 'अपेक्षित लान्छना') {
        if (value > 0) {
          result.anticipated.min = Math.min(result.anticipated.min, value);
        }
        result.anticipated.max = Math.max(result.anticipated.max, value);
      } else if (norm === 'व्यावहारिक लान्छना') {
        if (value > 0) {
          result.enacted.min = Math.min(result.enacted.min, value);
        }
        result.enacted.max = Math.max(result.enacted.max, value);
      }
    });
  });

  // Debug logging
  console.log('🔍 STG_TYPE DEBUG - All values found:', allValues);
  console.log(
    '🔍 STG_TYPE DEBUG - आत्मलान्छना values:',
    allValues.filter((v) => v.type === 'आत्मलान्छना'),
  );
  console.log(
    '🔍 STG_TYPE DEBUG - अपेक्षित लान्छना values:',
    allValues.filter((v) => v.type === 'अपेक्षित लान्छना'),
  );
  console.log(
    '🔍 STG_TYPE DEBUG - व्यावहारिक लान्छना values:',
    allValues.filter((v) => v.type === 'व्यावहारिक लान्छना'),
  );
  console.log('🔍 STG_TYPE DEBUG - Result before cleanup:', JSON.stringify(result));

  // If no data, use dummy data for visualization
  if (!hasData) {
    return {
      internalized: { min: 30, max: 200 },
      anticipated: { min: 40, max: 160 },
      enacted: { min: 40, max: 105 },
    };
  }

  // Replace Infinity with 0 for types with no positive min values
  if (result.internalized.min === Infinity) result.internalized.min = 0;
  if (result.internalized.max === -Infinity) result.internalized.max = 0;
  if (result.anticipated.min === Infinity) result.anticipated.min = 0;
  if (result.anticipated.max === -Infinity) result.anticipated.max = 0;
  if (result.enacted.min === Infinity) result.enacted.min = 0;
  if (result.enacted.max === -Infinity) result.enacted.max = 0;

  console.log('🔍 STG_TYPE DEBUG - Final result:', JSON.stringify(result));

  return result;
}

export const StgTypeVisualization: React.FC<StgTypeProps> = ({
  allPatientsData,
  startDate,
  endDate,
  currentLocationUuid,
}) => {
  const [metricType, setMetricType] = useState<MetricType>('all');
  const [sliderValue, setSliderValue] = useState<number>(100); // 100% = show all data points

  const minMaxData = useMemo(
    () => computeMinMax(allPatientsData, startDate, endDate, currentLocationUuid),
    [allPatientsData, startDate, endDate, currentLocationUuid],
  );

  const allTimeSeriesData = useMemo(
    () => computeTimeSeriesData(allPatientsData, startDate, endDate, currentLocationUuid),
    [allPatientsData, startDate, endDate, currentLocationUuid],
  );

  // Filter time series data based on slider value
  const timeSeriesData = useMemo(() => {
    if (sliderValue >= 100 || allTimeSeriesData.length <= 1) return allTimeSeriesData;
    const count = Math.max(1, Math.round((sliderValue / 100) * allTimeSeriesData.length));
    // Take the most recent 'count' data points
    return allTimeSeriesData.slice(-count);
  }, [allTimeSeriesData, sliderValue]);

  // X-axis: stigma types for bar chart
  const labels = ['आत्मलान्छना', 'अपेक्षित लान्छना', 'व्यावहारिक लान्छना'];

  // Y values for each grouped bar
  const maxValues = [minMaxData.internalized.max, minMaxData.anticipated.max, minMaxData.enacted.max];
  const minValues = [minMaxData.internalized.min, minMaxData.anticipated.min, minMaxData.enacted.min];

  // Prepare line chart data
  const lineLabels = timeSeriesData.map((d) => formatDisplayLabel(d.date));

  // Build datasets based on metricType selection (only min/max, no average)
  const buildLineDatasets = () => {
    const datasets: any[] = [];
    const colors = {
      internalized: { main: '#FF6B6B', light: 'rgba(255, 107, 107, 0.2)' },
      anticipated: { main: '#4FC3F7', light: 'rgba(79, 195, 247, 0.2)' },
      enacted: { main: '#81C784', light: 'rgba(129, 199, 132, 0.2)' },
    };

    const stigmaTypes = [
      { key: 'internalized', name: 'आत्मलान्छना', color: colors.internalized },
      { key: 'anticipated', name: 'अपेक्षित लान्छना', color: colors.anticipated },
      { key: 'enacted', name: 'व्यावहारिक लान्छना', color: colors.enacted },
    ];

    stigmaTypes.forEach(({ key, name, color }) => {
      if (metricType === 'max' || metricType === 'all') {
        datasets.push({
          label: `${name} - Max`,
          data: timeSeriesData.map((d) =>
            d[key as keyof TimeSeriesDataPoint] && typeof d[key as keyof TimeSeriesDataPoint] === 'object'
              ? (d[key as keyof TimeSeriesDataPoint] as any).max
              : 0,
          ),
          borderColor: color.main,
          backgroundColor: color.light,
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderDash: [],
        });
      }

      if (metricType === 'min' || metricType === 'all') {
        datasets.push({
          label: `${name} - Min`,
          data: timeSeriesData.map((d) =>
            d[key as keyof TimeSeriesDataPoint] && typeof d[key as keyof TimeSeriesDataPoint] === 'object'
              ? (d[key as keyof TimeSeriesDataPoint] as any).min
              : 0,
          ),
          borderColor: color.main,
          backgroundColor: color.light,
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderDash: [5, 5],
        });
      }
    });

    return datasets;
  };

  const buttonStyle = (active: boolean) => ({
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: active ? 'bold' : 'normal',
    backgroundColor: active ? '#1976D2' : '#E0E0E0',
    color: active ? '#fff' : '#333',
    transition: 'all 0.2s',
  });

  // Calculate date range for slider display
  const getDateRangeText = () => {
    if (timeSeriesData.length === 0) return 'No data';
    if (timeSeriesData.length === 1) return formatDisplayLabel(timeSeriesData[0].date);
    const firstDate = formatDisplayLabel(timeSeriesData[0].date);
    const lastDate = formatDisplayLabel(timeSeriesData[timeSeriesData.length - 1].date);
    return `${firstDate} - ${lastDate} (${timeSeriesData.length} days)`;
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
      {/* Bar Chart Section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12, textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>लान्छना प्रकार</h4>
        </div>

        <div
          style={{
            height: window.innerWidth <= 480 ? '320px' : window.innerWidth <= 768 ? '380px' : '420px',
            width: '100%',
            position: 'relative',
          }}
        >
          <Chart
            type="bar"
            data={{
              labels,
              datasets: [
                {
                  label: 'Max Score',
                  data: maxValues,
                  backgroundColor: ['#FF6B6B', '#FF6B6B', '#FF6B6B'],
                  borderColor: ['#D32F2F', '#D32F2F', '#D32F2F'],
                  borderWidth: 2,
                  borderRadius: 6,
                  barPercentage: 0.8,
                  categoryPercentage: 0.7,
                },
                {
                  label: 'Min Score',
                  data: minValues,
                  backgroundColor: ['#4FC3F7', '#4FC3F7', '#4FC3F7'],
                  borderColor: ['#0288D1', '#0288D1', '#0288D1'],
                  borderWidth: 2,
                  borderRadius: 6,
                  barPercentage: 0.8,
                  categoryPercentage: 0.7,
                },
              ],
            }}
            plugins={[
              {
                id: 'datalabels-stigmatype',
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
                      ctx.fillText(value, bar.x, bar.y - 8);
                    });
                  });
                  ctx.restore();
                },
              },
            ]}
            options={{
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
                  position: 'bottom',
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
                tooltip: {
                  enabled: false,
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
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: 'Stigma Type',
                    font: {
                      size: window.innerWidth <= 480 ? 11 : 13,
                      weight: 'bold',
                    },
                  },
                  ticks: {
                    font: {
                      size: window.innerWidth <= 480 ? 10 : window.innerWidth <= 768 ? 11 : 12,
                    },
                  },
                  grid: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Line Chart Section - Trend Over Time - COMMENTED OUT
      <div style={{ borderTop: '2px solid #E0E0E0', paddingTop: 20 }}>
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
            📈 लान्छना प्रकार - Trend Over Time
          </h4>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'center',
                width: '100%',
                maxWidth: '400px',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>📅 Date Range:</span>
              <input
                type="range"
                min="10"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  accentColor: '#1976D2',
                }}
              />
              <span style={{ fontSize: '11px', color: '#666' }}>{getDateRangeText()}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>🎯 Show:</span>
              <button style={buttonStyle(metricType === 'all')} onClick={() => setMetricType('all')}>
                All
              </button>
              <button style={buttonStyle(metricType === 'min')} onClick={() => setMetricType('min')}>
                Min
              </button>
              <button style={buttonStyle(metricType === 'max')} onClick={() => setMetricType('max')}>
                Max
              </button>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>
          </div>
        </div>

        <div
          style={{
            height: window.innerWidth <= 480 ? '300px' : window.innerWidth <= 768 ? '380px' : '450px',
            width: '100%',
            position: 'relative',
          }}
        >
          <Chart
            type="line"
            data={{
              labels: lineLabels,
              datasets: buildLineDatasets(),
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: {
                    font: {
                      size: window.innerWidth <= 480 ? 9 : 11,
                    },
                    padding: 10,
                    usePointStyle: true,
                    boxWidth: 20,
                  },
                },
                tooltip: {
                  titleFont: {
                    size: 13,
                    weight: 'bold',
                  },
                  bodyFont: {
                    size: 12,
                  },
                  padding: 10,
                  callbacks: {
                    label: (context: any) => {
                      const value = typeof context.raw === 'number' ? context.raw.toFixed(1) : context.raw;
                      return `${context.dataset.label}: ${value}`;
                    },
                  },
                },
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
                  grid: {
                    color: 'rgba(0, 0, 0, 0.08)',
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                    font: {
                      size: window.innerWidth <= 480 ? 11 : 13,
                      weight: 'bold',
                    },
                  },
                  ticks: {
                    font: {
                      size: window.innerWidth <= 480 ? 9 : 11,
                    },
                    maxRotation: 45,
                    minRotation: 0,
                  },
                  grid: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>

        <div
          style={{
            marginTop: '12px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '16px',
                height: '4px',
                backgroundColor: '#FF6B6B',
                display: 'inline-block',
                borderRadius: '2px',
              }}
            ></span>
            <span>आत्मलान्छना (Internalized)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '16px',
                height: '4px',
                backgroundColor: '#4FC3F7',
                display: 'inline-block',
                borderRadius: '2px',
              }}
            ></span>
            <span>अपेक्षित लान्छना (Anticipated)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '16px',
                height: '4px',
                backgroundColor: '#81C784',
                display: 'inline-block',
                borderRadius: '2px',
              }}
            ></span>
            <span>व्यावहारिक लान्छना (Enacted)</span>
          </div>
        </div>
      </div>
      */}

      {/* Summary below chart */}
      {/* <div
        style={{
          marginTop: '1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          textAlign: 'center',
          fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
        }}
      >
        <div style={{ padding: '0.5rem', background: '#FFF3E0', borderRadius: '6px' }}>
          <div style={{ fontWeight: 'bold', color: '#E65100' }}>आत्मलान्छना</div>
          <div>
            Min: <strong style={{ color: '#0288D1' }}>{minMaxData.internalized.min}</strong>
          </div>
          <div>
            Max: <strong style={{ color: '#D32F2F' }}>{minMaxData.internalized.max}</strong>
          </div>
        </div>
        <div style={{ padding: '0.5rem', background: '#E3F2FD', borderRadius: '6px' }}>
          <div style={{ fontWeight: 'bold', color: '#1565C0' }}>अपेक्षित लान्छना</div>
          <div>
            Min: <strong style={{ color: '#0288D1' }}>{minMaxData.anticipated.min}</strong>
          </div>
          <div>
            Max: <strong style={{ color: '#D32F2F' }}>{minMaxData.anticipated.max}</strong>
          </div>
        </div>
        <div style={{ padding: '0.5rem', background: '#E8F5E9', borderRadius: '6px' }}>
          <div style={{ fontWeight: 'bold', color: '#2E7D32' }}>व्यावहारिक लान्छना</div>
          <div>
            Min: <strong style={{ color: '#0288D1' }}>{minMaxData.enacted.min}</strong>
          </div>
          <div>
            Max: <strong style={{ color: '#D32F2F' }}>{minMaxData.enacted.max}</strong>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default StgTypeVisualization;
