export const dashboardMeta = {
  id: 'vitals-and-biometrics',
  slot: 'patient-chart-vitals-biometrics-dashboard-slot',
  path: 'Individual Dashboard',
  title: 'Individual Dashboard',
  icon: 'omrs-icon-activity',
  widgets: [
    { name: 'vitalsSummary', order: 0 },
    { name: 'vitalsMain', order: 1 },
    { name: 'biometricsOverview', order: 2 },
    { name: 'biometricsDetailedSummary', order: 3 },
    { name: 'stigmaMonthlyAggregate', order: 4 },
    { name: 'confDashboard', order: 5 }, // 👈 conference dashboard component
    { name: 'conferenceDashboard', order: 6 }, // 👈 new conference dashboard component
  ],
};

export default dashboardMeta;
