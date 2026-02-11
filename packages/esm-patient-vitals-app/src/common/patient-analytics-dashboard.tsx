// import React, { useState, useMemo, useCallback } from 'react';
// import { StigmaCutoffChart } from './stigma-cutoff-chart';
// import { MonthlyBarChart } from './monthly-bar-chart';
// import { HealthTrendChart } from './health-trend-chart';
// import { StigmaMonthlyView } from './stigma-monthly-view';

// interface PatientAnalyticsDashboardProps {
//   allPatientsData: any[];
//   patientUuids?: string[]; // Optional: UUIDs of all patients for stigma data fetching
//   stigmaScoreLabel?: string;
//   healthScoreLabel?: string;
//   stigmaScoreThreshold?: number;
// }

// export function PatientAnalyticsDashboard({
//   allPatientsData,
//   patientUuids = [],
//   stigmaScoreLabel = 'Stigma Score',
//   healthScoreLabel = 'Health Score',
//   stigmaScoreThreshold = 40,
// }: PatientAnalyticsDashboardProps) {
//   // Available years from data
//   const availableYears = useMemo(() => {
//     const years = new Set<string>();
//     allPatientsData.forEach((patient) => {
//       patient.forEach((obs: any) => {
//         const date = new Date(obs.effectiveDateTime || obs.date);
//         if (date) {
//           years.add(date.getFullYear().toString());
//         }
//       });
//     });
//     return Array.from(years).sort();
//   }, [allPatientsData]);

//   // Default to most recent year
//   const [selectedYear, setSelectedYear] = useState(() => {
//     return availableYears.length > 0 ? availableYears[availableYears.length - 1] : new Date().getFullYear().toString();
//   });

//   // Date range for monthly view (default: last 12 months)
//   const [startDate, setStartDate] = useState(() => {
//     const date = new Date();
//     date.setMonth(date.getMonth() - 12);
//     return date;
//   });

//   const [endDate, setEndDate] = useState(() => new Date());

//   // Handle year change
//   const handleYearChange = useCallback((year: string) => {
//     setSelectedYear(year);
//   }, []);

//   // Collect stigma data from all patients
//   // Note: This is a simplified approach. In production, you'd want to fetch this more efficiently
//   const allStigmaData = useMemo(() => {
//     // For now, we'll extract stigma data from allPatientsData if it's already processed
//     // This assumes allPatientsData contains the processed stigma data structure
//     const stigmaEntries: any[] = [];

//     allPatientsData.forEach((patientData) => {
//       if (Array.isArray(patientData)) {
//         patientData.forEach((entry: any) => {
//           // Check if this entry has stigma data fields
//           if (entry.stigmaType || entry.as_score !== undefined || entry.es_score !== undefined || entry.is_score !== undefined) {
//             stigmaEntries.push(entry);
//           }
//         });
//       }
//     });

//     return stigmaEntries;
//   }, [allPatientsData]);

//   // Render loading if no data
//   if (!allPatientsData || allPatientsData.length === 0) {
//     return <div>Loading patient data...</div>;
//   }

//   return (
//     <div style={{ padding: '1rem' }}>
//       <h2 style={{ marginBottom: '1.5rem' }}>Patient Analytics Dashboard</h2>

//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
//         {/* Stigma Cutoff Chart */}
//         <StigmaCutoffChart
//           stigmaCutoffSummary={null}
//           patientsData={allPatientsData}
//           stigmaScoreLabel={stigmaScoreLabel}
//           stigmaScoreThreshold={stigmaScoreThreshold}
//         />

//         {/* Health Trend Chart */}
//         <HealthTrendChart allPatientsData={allPatientsData} healthScoreLabel={healthScoreLabel} periodInMonths={12} />

//         {/* Monthly Bar Chart */}
//         <MonthlyBarChart
//           allPatientsData={allPatientsData}
//           selectedYear={selectedYear}
//           onYearChange={handleYearChange}
//           availableYears={availableYears}
//         />
//       </div>

//       {/* NEW: Monthly Stigma Metrics View */}
//       <div style={{ marginTop: '2rem' }}>
//         <div style={{
//           backgroundColor: '#fff',
//           padding: '1.5rem',
//           borderRadius: '12px',
//           boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
//           border: '1px solid #e0e0e0'
//         }}>
//           <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
//             <h3 style={{ margin: 0, color: '#1e3a8a' }}>📅 Monthly Stigma Analysis</h3>
//             <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
//               <label>
//                 <strong>Start Date:</strong>
//                 <input
//                   type="date"
//                   value={startDate.toISOString().split('T')[0]}
//                   onChange={(e) => setStartDate(new Date(e.target.value))}
//                   style={{ marginLeft: '0.5rem', padding: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}
//                 />
//               </label>
//               <label>
//                 <strong>End Date:</strong>
//                 <input
//                   type="date"
//                   value={endDate.toISOString().split('T')[0]}
//                   onChange={(e) => setEndDate(new Date(e.target.value))}
//                   style={{ marginLeft: '0.5rem', padding: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}
//                 />
//               </label>
//             </div>
//           </div>

//           <StigmaMonthlyView
//             stigmaData={allStigmaData}
//             startDate={startDate}
//             endDate={endDate}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
