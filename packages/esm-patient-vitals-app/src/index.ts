import {
  defineConfigSchema,
  fhirBaseUrl,
  getAsyncLifecycle,
  getSyncLifecycle,
  messageOmrsServiceWorker,
  restBaseUrl,
} from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { configSchema } from './config-schema';
import biometricsDetailedSummaryComponent from './biometrics/biometrics-main.component';
import biometricsOverviewComponent from './biometrics/biometrics-overview.component';
import dashboardMeta from './dashboard.meta';
import vitalsHeaderComponent from './vitals-and-biometrics-header/vitals-header.component';
import vitalsMainComponent from './vitals/vitals-main.component';
import vitalsSummaryComponent from './vitals/vitals-summary.component';
import stigmaMonthlyAggregateComponent from './common/stigma-data-aggregate';
import confDashboardComponent from './common/conf_dashboard';
import confPageComponent from './common/conf-page';
// import stigmaDashboardButton from './common/stigma-dashboard-button.component';
import './common/debug-helper'; // Import debug helper

const moduleName = '@openmrs/esm-patient-vitals-app';

const options = {
  featureName: 'patient-vitals',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  messageOmrsServiceWorker({
    type: 'registerDynamicRoute',
    pattern: `${fhirBaseUrl}/Observation.+`,
  });

  messageOmrsServiceWorker({
    type: 'registerDynamicRoute',
    pattern: `.+${restBaseUrl}/concept.+`,
  });

  defineConfigSchema(moduleName, configSchema);
}

export const vitalsSummary = getSyncLifecycle(vitalsSummaryComponent, options);

export const vitalsMain = getSyncLifecycle(vitalsMainComponent, options);

export const vitalsHeader = getSyncLifecycle(vitalsHeaderComponent, options);

export const biometricsOverview = getSyncLifecycle(biometricsOverviewComponent, options);

export const biometricsDetailedSummary = getSyncLifecycle(biometricsDetailedSummaryComponent, options);

export const vitalsAndBiometricsDashboardLink =
  // t('Vitals & Biometrics', 'Vitals & Biometrics')
  getSyncLifecycle(
    createDashboardLink({
      ...dashboardMeta,
      moduleName,
    }),
    options,
  );

export const weightTile = getAsyncLifecycle(() => import('./components/weight-tile/weight-tile.component'), options);

// t('recordVitalsAndBiometrics', 'Record Vitals and Biometrics')
// export const vitalsBiometricsFormWorkspace = getAsyncLifecycle(
//   () => import('./vitals-biometrics-form/vitals-biometrics-form.workspace'),
//   options,
// );

export const vitalsAndBiometricsDeleteConfirmationModal = getAsyncLifecycle(
  () => import('./components/delete-vitals-biometrics-modal/delete-vitals-biometrics.modal'),
  options,
);

export const stigmaMonthlyAggregate = getSyncLifecycle(stigmaMonthlyAggregateComponent, options);

// Hiding the conference dashboard component (लान्छना विश्लेषण नतिजाहरू)
export const confDashboard = getSyncLifecycle(confDashboardComponent, options);

// Export ConfPage component to use with ExtensionSlot
export const confPage = getSyncLifecycle(confPageComponent, options);

// Hiding the conference dashboard link
export const confDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...dashboardMeta,
    title: 'Conference Dashboard',
    moduleName,
  }),
  options,
);

// Register the stigma dashboard button component for patient actions
// This component is already commented out in the imports
// export const stigmaDashboardButton = getSyncLifecycle(stigmaDashboardButton, {
//   featureName: 'patient-actions-slot',
//   moduleName,
// });

// Register the stigma dashboard workspace
// export const stigmaDashboardWorkspace = getAsyncLifecycle(() => import('./common/stigma-dashboard.workspace'), {
//   featureName: 'stigma-dashboard',
//   moduleName,
// });

// // Register the data visualization button in the global nav
// export const dataVisualizationNavButton = getAsyncLifecycle(
//   () => import('./navbar/data-visualization-button.component'),
//   {
//     featureName: 'data-visualization-nav',
//     moduleName,
//   },
// );
