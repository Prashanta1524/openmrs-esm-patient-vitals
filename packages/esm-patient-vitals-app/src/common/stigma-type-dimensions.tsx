// import React, { useMemo } from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // Define labels and colors
// const DOMAIN_COLORS = {
//   hiv: '#e74c3c',
//   mh: '#3498db',
//   sgm: '#2ecc71',
//   em: '#f1c40f',
// };

// const DOMAIN_LABELS = {
//   hiv: 'एचआईभी',
//   mh: 'मानसिक स्वास्थ्य',
//   sgm: 'SGM',
//   em: 'EM',
// };

// // --- Helper to parse string like: "एचआईभी: 78\nमानसिक स्वास्थ्य: 85"
// function parseDimensionScore(scoreStr: string) {
//   const domainMap: Record<string, boolean> = { hiv: false, mh: false, sgm: false, em: false };
//   const mappings = [
//     { key: 'hiv', label: 'एचआईभी' },
//     { key: 'mh', label: 'मानसिक स्वास्थ्य' },
//     { key: 'sgm', label: 'लैङ्गिक तथा यौनिक अल्पसङ्ख्यक' },
//     { key: 'em', label: 'जातीय अल्पसङ्ख्यक/दलित' },
//   ];

//   mappings.forEach(({ key, label }) => {
//     const regex = new RegExp(`${label}\\s*:?\\s*(\\d+)`, 'i');
//     const match = scoreStr.match(regex);
//     if (match && !isNaN(Number(match[1]))) {
//       domainMap[key] = true;
//     }
//   });

//   return domainMap;
// }

// // --- Aggregation function: Count patients per year, stigma type, and domain
// function aggregatePatientCounts(allPatientsData: any[]) {
//   const counts: Record<string, Record<string, Record<string, number>>> = {};
//   // counts[year][stigmaType][domain] = count

//   allPatientsData.forEach((patientData) => {
//     patientData.forEach((obs: any) => {
//       const date = new Date(obs.effectiveDateTime || obs.date);
//       if (!date || isNaN(date.getTime())) return;

//       const offsetInMs = 5 * 60 * 60 * 1000 + 45 * 60 * 1000; // UTC+5:45
//       const nepaliDate = new Date(date.getTime() + offsetInMs);
//       const year = nepaliDate.getFullYear().toString();

//       const stigmaType = obs?.stigmaType;
//       const dimensionScore = obs?.dimensionScore;

//       if (!stigmaType || !dimensionScore) return;

//       const domainsPresent = parseDimensionScore(String(dimensionScore));

//       if (!counts[year]) counts[year] = {};
//       if (!counts[year][stigmaType]) {
//         counts[year][stigmaType] = { hiv: 0, mh: 0, sgm: 0, em: 0 };
//       }

//       Object.entries(domainsPresent).forEach(([key, present]) => {
//         if (present) {
//           counts[year][stigmaType][key] += 1;
//         }
//       });
//     });
//   });

//   // Flatten for chart use
//   const flat: Array<{
//     year: string;
//     type: string;
//     counts: Record<string, number>;
//   }> = [];

//   Object.entries(counts).forEach(([year, stigmaTypes]) => {
//     Object.entries(stigmaTypes).forEach(([type, domainCounts]) => {
//       flat.push({ year, type, counts: domainCounts });
//     });
//   });

//   return flat;
// }

// export function StigmaOverviewChart({ allPatientsData }: { allPatientsData: any[] }) {
//   const aggregatedData = useMemo(() => aggregatePatientCounts(allPatientsData), [allPatientsData]);

//   const years = Array.from(new Set(aggregatedData.map((d) => d.year))).sort();
//   const types = Array.from(new Set(aggregatedData.map((d) => d.type))).sort();
//   const domainKeys = ['hiv', 'mh', 'sgm', 'em'] as const;

//   const datasets = domainKeys.map((domain) => {
//     return {
//       label: DOMAIN_LABELS[domain],
//       data: years.map((year) => {
//         // For each year, sum counts for all stigma types for this domain
//         let sum = 0;
//         types.forEach((type) => {
//           const match = aggregatedData.find((d) => d.year === year && d.type === type);
//           if (match) {
//             sum += match.counts[domain] || 0;
//           }
//         });
//         return sum;
//       }),
//       backgroundColor: DOMAIN_COLORS[domain],
//     };
//   });

//   const chartData = {
//     labels: years,
//     datasets,
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       title: {
//         display: true,
//         text: 'Stigma Dimension Presence by Year',
//       },
//       legend: {
//         position: 'bottom' as const,
//       },
//     },
//     scales: {
//       x: {
//         stacked: true,
//         title: { display: true, text: 'Year' },
//       },
//       y: {
//         stacked: true,
//         beginAtZero: true,
//         title: { display: true, text: 'Patient Count' },
//       },
//     },
//   };

//   return (
//     <div style={{ marginTop: '2rem' }}>
//       <Bar data={chartData} options={options} />
//     </div>
//   );
// }
