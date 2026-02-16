import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, useSession } from '@openmrs/esm-framework';
import * as Framework from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { esmPatientChartSchema } from './config-schema';
import { moduleName } from './constants';
import { setupCacheableRoutes, setupOfflineVisitsSync } from './offline';
import { summaryDashboardMeta, encountersDashboardMeta } from './dashboard.meta';
import deleteVisitActionButtonComponent from './actions-buttons/delete-visit.component';
import currentVisitSummaryComponent from './visit/visits-widget/current-visit-summary.component';
import markPatientAliveActionButtonComponent from './actions-buttons/mark-patient-alive.component';
import markPatientDeceasedActionButtonComponent from './actions-buttons/mark-patient-deceased.component';
import pastVisitsOverviewComponent from './visit/visits-widget/visit-detail-overview.component';
import patientChartPageComponent from './root.component';
import patientDetailsTileComponent from './patient-details-tile/patient-details-tile.component';
import startVisitActionButtonComponent from './actions-buttons/start-visit.component';
import startVisitActionButtonOnPatientSearch from './visit/start-visit-button.component';
import stopVisitActionButtonComponent from './actions-buttons/stop-visit.component';
import visitAttributeTagsComponent from './patient-banner-tags/visit-attribute-tags.component';

// Expose framework for legacy modules (like ngx-formentry)
window['_openmrs_esm_framework'] = Framework;

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  setupOfflineVisitsSync();
  setupCacheableRoutes();

  defineConfigSchema(moduleName, esmPatientChartSchema);
}

// ✅ Restrict ONLY for "self registration" and "include_hcw"
function useIsRestrictedUser() {
  const { user } = useSession();
  const roles = user?.roles?.map((r) => r.display?.toLowerCase()) || [];

  // If user has either restricted role → restrict
  // return roles.includes('self registration') || roles.includes('include_hcw');
  return roles.includes('self registration');
}

export const root = getSyncLifecycle(patientChartPageComponent, {
  featureName: 'patient-chart',
  moduleName,
});

export const patientSummaryDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...summaryDashboardMeta,
    moduleName: '',
  }),
  {
    featureName: 'summary-dashboard',
    moduleName,
  },
);

export const markPatientAliveActionButton = getSyncLifecycle(markPatientAliveActionButtonComponent, {
  featureName: 'patient-actions-slot',
  moduleName,
});

export const markPatientDeceasedActionButton = getSyncLifecycle(markPatientDeceasedActionButtonComponent, {
  featureName: 'patient-actions-slot-deceased-button',
  moduleName,
});

export const startVisitActionButton = getSyncLifecycle(startVisitActionButtonComponent, {
  featureName: 'patient-actions-slot',
  moduleName,
});

export const stopVisitActionButton = getSyncLifecycle(stopVisitActionButtonComponent, {
  featureName: 'patient-actions-slot',
  moduleName,
});

export const deleteVisitActionMenuButton = getSyncLifecycle(deleteVisitActionButtonComponent, {
  featureName: 'patient-actions-slot',
  moduleName,
});

export const startVisitPatientSearchActionButton = getSyncLifecycle(startVisitActionButtonOnPatientSearch, {
  featureName: 'start-visit-button-patient-search',
  moduleName,
});

export const stopVisitPatientSearchActionButton = getSyncLifecycle(stopVisitActionButtonComponent, {
  featureName: 'patient-actions-slot',
  moduleName,
});

export const clinicalViewsSummary = getAsyncLifecycle(
  () => import('./clinical-views/encounter-tile/clinical-views-summary.component'),
  { featureName: 'clinical-views-summary', moduleName },
);

// ✅ Visits dashboard link with restriction
export const encountersSummaryDashboardLink = getSyncLifecycle(
  (props: { basePath: string }) => {
    const restricted = useIsRestrictedUser();
    if (restricted) return null;

    const DashboardLink = createDashboardLink({
      ...encountersDashboardMeta,
      moduleName: '',
    });

    return DashboardLink(props);
  },
  { featureName: 'encounter', moduleName },
);

// ✅ Current visit summary with restriction
export const currentVisitSummary = getSyncLifecycle(
  (props: { basePath: string; patientUuid: string }) => {
    const restricted = useIsRestrictedUser();
    if (restricted) return null;
    return currentVisitSummaryComponent({ patientUuid: props.patientUuid });
  },
  { featureName: 'current-visit-summary', moduleName },
);

export const pastVisitsDetailOverview = getSyncLifecycle(pastVisitsOverviewComponent, {
  featureName: 'visits-detail-slot',
  moduleName,
});

export const patientDetailsTile = getSyncLifecycle(patientDetailsTileComponent, {
  featureName: 'patient-details-tile',
  moduleName,
});

export const visitAttributeTags = getSyncLifecycle(visitAttributeTagsComponent, {
  featureName: 'visit-attribute-tags',
  moduleName,
});

export const startVisitWorkspace = getAsyncLifecycle(() => import('./visit/visit-form/visit-form.workspace'), {
  featureName: 'start-visit-form',
  moduleName,
});

export const markPatientDeceasedForm = getAsyncLifecycle(
  () => import('./mark-patient-deceased/mark-patient-deceased-form.workspace'),
  {
    featureName: 'mark-patient-deceased-form',
    moduleName,
  },
);

export const startVisitModal = getAsyncLifecycle(() => import('./visit/visit-prompt/start-visit-dialog.component'), {
  featureName: 'start visit',
  moduleName,
});

export const deleteVisitModal = getAsyncLifecycle(() => import('./visit/visit-prompt/delete-visit-dialog.component'), {
  featureName: 'delete visit',
  moduleName,
});

export const modifyVisitDateModal = getAsyncLifecycle(() => import('./visit/visit-prompt/modify-visit-date.modal'), {
  featureName: 'modify visit date',
  moduleName,
});

export const endVisitModal = getAsyncLifecycle(() => import('./visit/visit-prompt/end-visit-dialog.component'), {
  featureName: 'end visit',
  moduleName,
});

export const markPatientAliveModal = getAsyncLifecycle(() => import('./mark-patient-alive/mark-patient-alive.modal'), {
  featureName: 'mark patient alive',
  moduleName,
});

export const deleteEncounterModal = getAsyncLifecycle(
  () => import('./visit/visits-widget/past-visits-components/delete-encounter.modal'),
  {
    featureName: 'delete-encounter-modal',
    moduleName,
  },
);

export const editVisitDetailsActionButton = getAsyncLifecycle(
  () => import('./visit/visit-action-items/edit-visit-details.component'),
  { featureName: 'edit-visit-details', moduleName },
);

export const deleteVisitActionButton = getAsyncLifecycle(
  () => import('./visit/visit-action-items/delete-visit-action-item.component'),
  { featureName: 'delete-visit', moduleName },
);

export const activeVisitActionsComponent = getAsyncLifecycle(
  () => import('./visit/visits-widget/active-visit-buttons/active-visit-buttons'),
  { featureName: 'active-visit-actions', moduleName },
);

export const encounterListTableTabs = getAsyncLifecycle(
  () => import('./clinical-views/encounter-list/encounter-list-tabs.component'),
  { featureName: 'encounter-list-table-tabs', moduleName },
);

export const visitContextSwitcherModal = getAsyncLifecycle(
  () => import('./visit/visits-widget/visit-context/visit-context-switcher.modal'),
  { featureName: 'visit-context-switcher', moduleName },
);

export const visitContextHeader = getAsyncLifecycle(
  () => import('./visit/visits-widget/visit-context/visit-context-header.component'),
  { featureName: 'visit-context-header', moduleName },
);

export const retrospectiveDateTimePicker = getAsyncLifecycle(
  () =>
    import(
      './visit/visits-widget/visit-context/retrospective-data-date-time-picker/retrospective-date-time-picker.component'
    ),
  { featureName: 'retrospective-date-time-picker', moduleName },
);
