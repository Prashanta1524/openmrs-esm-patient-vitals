// import React, { useMemo, useState } from 'react';
// import { useCovidStigmaData, type CovidStigmaData } from './covid-stigma-data.resource';
// import { Bar, Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from 'chart.js';
// import zoomPlugin from 'chartjs-plugin-zoom';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   zoomPlugin,
// );

// const DOMAIN_COLORS = {
//   hiv: 'rgba(255,99,132,0.8)',
//   mh: 'rgba(54,162,235,0.8)',
//   sgm: 'rgba(255,206,86,0.8)',
//   em: 'rgba(75,192,192,0.8)',
//   intersectional: 'rgba(153,102,255,0.8)',
// };

// /* ---------------- Helpers ---------------- */
// function parseDimensionScore(scoreStr: string) {
//   const domainMap: Record<string, number> = { hiv: 0, mh: 0, sgm: 0, em: 0 };
//   const mappings = [
//     { key: 'hiv', label: 'एचआईभी' },
//     { key: 'mh', label: 'मानसिक स्वास्थ्य' },
//     { key: 'sgm', label: 'लैङ्गिक तथा यौनिक अल्पसङ्ख्यक' },
//     { key: 'em', label: 'जातीय अल्पसङ्ख्यक/दलित' },
//   ];

//   mappings.forEach(({ key, label }) => {
//     const regex = new RegExp(`${label}\\s*:?\\s*(\\d+)`);
//     const match = scoreStr.match(regex);
//     if (match) domainMap[key] = Number(match[1]);
//   });

//   return domainMap;
// }

// /* ---------------- Aggregation ---------------- */
// const aggregateByType = (data: CovidStigmaData[]) => {
//   const typeMap: Record<string, { hiv: number; mh: number; sgm: number; em: number; intersectional: number }> = {};
//   data.forEach((d) => {
//     const type = d.stigmaType || 'Unknown';
//     if (!typeMap[type]) typeMap[type] = { hiv: 0, mh: 0, sgm: 0, em: 0, intersectional: 0 };

//     if (d.dimensionScore) {
//       const parsed = parseDimensionScore(String(d.dimensionScore));
//       typeMap[type].hiv += parsed.hiv;
//       typeMap[type].mh += parsed.mh;
//       typeMap[type].sgm += parsed.sgm;
//       typeMap[type].em += parsed.em;
//       typeMap[type].intersectional += parsed.hiv + parsed.mh + parsed.sgm + parsed.em;
//     }
//   });
//   return Object.entries(typeMap).map(([type, totals]) => ({ type, totals }));
// };

// const aggregateByDate = (data: CovidStigmaData[]) =>
//   data
//     .map((d) => {
//       if (!d.dimensionScore) return null;
//       const parsed = parseDimensionScore(String(d.dimensionScore));
//       return {
//         date: d.date,
//         totals: {
//           ...parsed,
//           intersectional: parsed.hiv + parsed.mh + parsed.sgm + parsed.em,
//         },
//       };
//     })
//     .filter(Boolean)
//     .sort((a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime()) as {
//     date: string;
//     totals: Record<string, number>;
//   }[];

// /* ---------------- Chart Components ---------------- */
// function TypeDimensionBarChart({ data }: { data: ReturnType<typeof aggregateByType> }) {
//   const domainKeys = ['hiv', 'mh', 'sgm', 'em', 'intersectional'] as const;
//   const datasets = domainKeys.map((key) => ({
//     label: key.toUpperCase(),
//     data: data.map((d) => d.totals[key]),
//     backgroundColor: DOMAIN_COLORS[key],
//   }));

//   return (
//     <Bar
//       data={{ labels: data.map((d) => d.type), datasets }}
//       options={{
//         responsive: true,
//         plugins: {
//           title: { display: true, text: 'Stigma Scores by Type × Dimension' },
//           legend: { position: 'bottom' },
//         },
//         scales: { x: { stacked: true }, y: { stacked: true, title: { display: true, text: 'Score' } } },
//       }}
//     />
//   );
// }

// function StigmaLineChart({ data }: { data: ReturnType<typeof aggregateByDate> }) {
//   const labels = data.map((_, i) => i + 1);
//   const datasets = Object.keys(DOMAIN_COLORS).map((key) => ({
//     label: key.toUpperCase(),
//     data: data.map((d) => d.totals[key]),
//     borderColor: DOMAIN_COLORS[key as keyof typeof DOMAIN_COLORS],
//     backgroundColor: DOMAIN_COLORS[key as keyof typeof DOMAIN_COLORS],
//     fill: false,
//     tension: 0.2,
//   }));

//   return (
//     <Line
//       data={{ labels, datasets }}
//       options={{
//         responsive: true,
//         plugins: {
//           title: { display: true, text: 'Stigma Scores Over Time' },
//           legend: { position: 'bottom' },
//           tooltip: {
//             callbacks: {
//               label: function (context) {
//                 const index = context.dataIndex;
//                 const d = data[index];
//                 return `${context.dataset.label}: ${context.parsed.y} (Date: ${new Date(d.date).toLocaleString()})`;
//               },
//             },
//           },
//           zoom: {
//             zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
//             pan: { enabled: true, mode: 'x' },
//           },
//         },
//         scales: {
//           x: { title: { display: true, text: 'Data Points' }, ticks: { callback: (val) => `#${val}` } },
//           y: { title: { display: true, text: 'Score' } },
//         },
//       }}
//     />
//   );
// }

// /* ---------------- Wrapper ---------------- */
// export default function MultiChartSelector({ patientUuid }: { patientUuid: string }) {
//   const { data, isLoading, error } = useCovidStigmaData(patientUuid);
//   const [chartType, setChartType] = useState<'line' | 'type'>('type');

//   const typeData = useMemo(() => (data ? aggregateByType(data) : []), [data]);
//   const lineData = useMemo(() => (data ? aggregateByDate(data) : []), [data]);

//   if (isLoading) return <p>Loading stigma data...</p>;
//   if (error) return <p style={{ color: 'red' }}>Failed to load stigma data.</p>;
//   if (!data?.length) return <p>No stigma data available</p>;

//   return (
//     <div style={{ padding: '1rem' }}>
//       <h3>Stigma Charts</h3>
//       <div style={{ marginBottom: '1rem' }}>
//         <label>Select chart: </label>
//         <select value={chartType} onChange={(e) => setChartType(e.target.value as any)}>
//           <option value="type">Stigma Scores by Type × Dimension (Bar)</option>
//           <option value="line">Stigma Scores Over Time (Line)</option>
//         </select>
//       </div>
//       {chartType === 'type' ? <TypeDimensionBarChart data={typeData} /> : <StigmaLineChart data={lineData} />}
//     </div>
//   );
// }
