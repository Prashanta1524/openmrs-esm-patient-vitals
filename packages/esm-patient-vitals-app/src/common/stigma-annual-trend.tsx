// import React, { useState, useMemo } from 'react';
// import { Chart } from 'react-chartjs-2';
// // Define AggregatedData type locally if not exported from './stigma-type-dimensions'
// export type AggregatedData = {
//   hiv_as: number;
//   hiv_es: number;
//   hiv_is: number;
//   mh_as: number;
//   mh_es: number;
//   mh_is: number;
//   sgm_as: number;
//   sgm_es: number;
//   sgm_is: number;
//   em_as: number;
//   em_es: number;
//   em_is: number;
// };
// import 'chart.js/auto';

// interface YearlyPatientCounts {
//   [year: string]: {
//     as: { hiv: number; mh: number; sgm: number; em: number };
//     es: { hiv: number; mh: number; sgm: number; em: number };
//     is: { hiv: number; mh: number; sgm: number; em: number };
//   };
// }

// const CUTOFF_VALUES = {
//   as: 7, // Adjust these cutoff values as needed
//   es: 7,
//   is: 7,
// };

// const DOMAINS = ['hiv', 'mh', 'sgm', 'em'] as const;
// const STIGMA_TYPES = ['as', 'es', 'is'] as const;

// export function StigmaAnnualTrendChart({ data }: { data: Array<AggregatedData & { year: string }> }) {
//   const [selectedStigmaType, setSelectedStigmaType] = useState<'all' | (typeof STIGMA_TYPES)[number]>('all');
//   const [viewMode, setViewMode] = useState<'stacked' | 'grouped'>('stacked');

//   // Process data to get yearly counts
//   const yearlyData = useMemo(() => {
//     const counts: YearlyPatientCounts = {};

//     data.forEach((entry) => {
//       const year = entry.year;
//       if (!counts[year]) {
//         counts[year] = {
//           as: { hiv: 0, mh: 0, sgm: 0, em: 0 },
//           es: { hiv: 0, mh: 0, sgm: 0, em: 0 },
//           is: { hiv: 0, mh: 0, sgm: 0, em: 0 },
//         };
//       }

//       // Check each domain and stigma type
//       DOMAINS.forEach((domain) => {
//         STIGMA_TYPES.forEach((stype) => {
//           const key = `${domain}_${stype}` as keyof AggregatedData;
//           if (entry[key] >= CUTOFF_VALUES[stype]) {
//             counts[year][stype][domain]++;
//           }
//         });
//       });
//     });

//     return counts;
//   }, [data]);

//   // Prepare chart data
//   const chartData = useMemo(() => {
//     const years = Object.keys(yearlyData).sort();
//     const datasets = [];

//     if (selectedStigmaType === 'all' || viewMode === 'stacked') {
//       // Create datasets for each domain within each stigma type
//       STIGMA_TYPES.forEach((stype) => {
//         if (selectedStigmaType === 'all' || selectedStigmaType === stype) {
//           DOMAINS.forEach((domain) => {
//             datasets.push({
//               label: `${domain.toUpperCase()} - ${stype.toUpperCase()}`,
//               data: years.map((year) => yearlyData[year][stype][domain]),
//               backgroundColor: getColor(domain, stype),
//               stack: viewMode === 'stacked' ? stype : undefined,
//             });
//           });
//         }
//       });
//     } else {
//       // Grouped view for a specific stigma type
//       DOMAINS.forEach((domain) => {
//         datasets.push({
//           label: domain.toUpperCase(),
//           data: years.map((year) => yearlyData[year][selectedStigmaType][domain]),
//           backgroundColor: getColor(domain, selectedStigmaType),
//         });
//       });
//     }

//     return {
//       labels: years,
//       datasets,
//     };
//   }, [yearlyData, selectedStigmaType, viewMode]);

//   const options = {
//     responsive: true,
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Year',
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Number of Patients',
//         },
//         beginAtZero: true,
//       },
//     },
//     plugins: {
//       title: {
//         display: true,
//         text: 'Annual Trend of Patients Meeting Stigma Cutoffs',
//         font: { size: 16 },
//       },
//       legend: {
//         position: 'top' as const,
//       },
//     },
//   };

//   return (
//     <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fafafa' }}>
//       <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
//         <div>
//           <label htmlFor="stigmaType">Stigma Type: </label>
//           <select
//             id="stigmaType"
//             value={selectedStigmaType}
//             onChange={(e) => setSelectedStigmaType(e.target.value as any)}
//           >
//             <option value="all">All Types</option>
//             <option value="as">Anticipated Stigma</option>
//             <option value="es">Enacted Stigma</option>
//             <option value="is">Internalized Stigma</option>
//           </select>
//         </div>
//         <div>
//           <label htmlFor="viewMode">View Mode: </label>
//           <select id="viewMode" value={viewMode} onChange={(e) => setViewMode(e.target.value as any)}>
//             <option value="stacked">Stacked</option>
//             <option value="grouped">Grouped</option>
//           </select>
//         </div>
//       </div>
//       <Chart type="bar" data={chartData} options={options} />
//     </div>
//   );
// }

// // Helper function to get colors for different domains and stigma types
// function getColor(domain: string, stigmaType: string): string {
//   const baseColors = {
//     hiv: '#e74c3c',
//     mh: '#3498db',
//     sgm: '#2ecc71',
//     em: '#f1c40f',
//   };

//   const opacity = {
//     as: '99',
//     es: 'cc',
//     is: 'ff',
//   };

//   return baseColors[domain as keyof typeof baseColors] + (opacity[stigmaType as keyof typeof opacity] ?? 'ff');
// }
