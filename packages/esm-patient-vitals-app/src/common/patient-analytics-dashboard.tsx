import React, { useState, useMemo, useCallback } from 'react';
import { StigmaCutoffChart } from './stigma-cutoff-chart';
import { MonthlyBarChart } from './monthly-bar-chart';
import { HealthTrendChart } from './health-trend-chart';

interface PatientAnalyticsDashboardProps {
  allPatientsData: any[];
  stigmaScoreLabel?: string;
  healthScoreLabel?: string;
  stigmaScoreThreshold?: number;
}

export function PatientAnalyticsDashboard({
  allPatientsData,
  stigmaScoreLabel = 'Stigma Score',
  healthScoreLabel = 'Health Score',
  stigmaScoreThreshold = 40,
}: PatientAnalyticsDashboardProps) {
  // Available years from data
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    allPatientsData.forEach((patient) => {
      patient.forEach((obs: any) => {
        const date = new Date(obs.effectiveDateTime || obs.date);
        if (date) {
          years.add(date.getFullYear().toString());
        }
      });
    });
    return Array.from(years).sort();
  }, [allPatientsData]);

  // Default to most recent year
  const [selectedYear, setSelectedYear] = useState(() => {
    return availableYears.length > 0 ? availableYears[availableYears.length - 1] : new Date().getFullYear().toString();
  });

  // Handle year change
  const handleYearChange = useCallback((year: string) => {
    setSelectedYear(year);
  }, []);

  // Render loading if no data
  if (!allPatientsData || allPatientsData.length === 0) {
    return <div>Loading patient data...</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Patient Analytics Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Stigma Cutoff Chart */}
        <StigmaCutoffChart
          stigmaCutoffSummary={null}
          patientsData={allPatientsData}
          stigmaScoreLabel={stigmaScoreLabel}
          stigmaScoreThreshold={stigmaScoreThreshold}
        />

        {/* Health Trend Chart */}
        <HealthTrendChart allPatientsData={allPatientsData} healthScoreLabel={healthScoreLabel} periodInMonths={12} />

        {/* Monthly Bar Chart */}
        <MonthlyBarChart
          allPatientsData={allPatientsData}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          availableYears={availableYears}
        />
      </div>
    </div>
  );
}
