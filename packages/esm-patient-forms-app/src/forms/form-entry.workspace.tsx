import React, { useEffect, useMemo, useState } from 'react';
import { ExtensionSlot, useConnectivity, useFeatureFlag, useVisitContextStore } from '@openmrs/esm-framework';
import {
  clinicalFormsWorkspace,
  type DefaultPatientWorkspaceProps,
  type FormEntryProps,
  useVisitOrOfflineVisit,
} from '@openmrs/esm-patient-common-lib';

interface FormEntryComponentProps extends DefaultPatientWorkspaceProps {
  mutateForm: () => void;
  formInfo: FormEntryProps;
  clinicalFormsWorkspaceName?: string;
}

const FormEntry: React.FC<FormEntryComponentProps> = ({
  patientUuid,
  patient,
  clinicalFormsWorkspaceName = clinicalFormsWorkspace,
  closeWorkspace,
  closeWorkspaceWithSavedChanges,
  promptBeforeClosing,
  mutateForm,
  formInfo,
}) => {
  const { encounterUuid, formUuid, visitStartDatetime, visitStopDatetime, visitTypeUuid, visitUuid, additionalProps } =
    formInfo || {};
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const [showForm, setShowForm] = useState(true);
  const isOnline = useConnectivity();
  const { mutateVisit } = useVisitContextStore();

  const state = useMemo(
    () => ({
      view: 'form',
      formUuid: formUuid ?? null,
      visitUuid: visitUuid ?? currentVisit?.uuid ?? null,
      visitTypeUuid: visitTypeUuid ?? currentVisit?.visitType?.uuid ?? null,
      visitStartDatetime: visitStartDatetime ?? currentVisit?.startDatetime ?? null,
      visitStopDatetime: visitStopDatetime ?? currentVisit?.stopDatetime ?? null,
      isOffline: !isOnline,
      patientUuid: patientUuid ?? null,
      patient,
      encounterUuid: encounterUuid ?? null,
      closeWorkspace: () => {
        typeof mutateForm === 'function' && mutateForm();
        closeWorkspace();
      },
      closeWorkspaceWithSavedChanges: () => {
        typeof mutateForm === 'function' && mutateForm();
        mutateVisit();
        closeWorkspaceWithSavedChanges();
      },
      promptBeforeClosing,
      additionalProps,
      clinicalFormsWorkspaceName,
    }),
    [
      formUuid,
      visitUuid,
      visitTypeUuid,
      encounterUuid,
      visitStartDatetime,
      visitStopDatetime,
      currentVisit?.uuid,
      currentVisit?.visitType?.uuid,
      currentVisit?.startDatetime,
      currentVisit?.stopDatetime,
      patientUuid,
      patient,
      isOnline,
      mutateForm,
      mutateVisit,
      closeWorkspace,
      closeWorkspaceWithSavedChanges,
      promptBeforeClosing,
      additionalProps,
      clinicalFormsWorkspaceName,
    ],
  );

  // FIXME: This logic triggers a reload of the form when the formUuid changes. It's a workaround for the fact that the form doesn't reload when the formUuid changes.
  useEffect(() => {
    if (state.formUuid) {
      console.log('[Form Debug] Reloading form with UUID:', state.formUuid);
      setShowForm(false);
      setTimeout(() => {
        setShowForm(true);
        console.log('[Form Debug] Form reloaded with showForm =', true);
      });
    }
  }, [state]);

  // Log when form is about to render
  useEffect(() => {
    if (showForm && formInfo && patientUuid && patient) {
      console.log('[Form Debug] Form workspace is ready to render form');
      console.log('[Form Debug] Form widget slot will be rendered with state:', state);
    } else {
      console.log('[Form Debug] Form workspace conditions not met:', { 
        showForm, 
        hasFormInfo: !!formInfo, 
        hasPatientUuid: !!patientUuid, 
        hasPatient: !!patient 
      });
    }
  }, [showForm, formInfo, patientUuid, patient, state]);

  return (
    <div>
      <ExtensionSlot name="visit-context-header-slot" state={{ patientUuid }} />
      {showForm && formInfo && patientUuid && patient && <ExtensionSlot name="form-widget-slot" state={state} />}

      {/* Debug information panel */}
      <div
        style={{
          margin: '1rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          border: '1px solid #ddd',
          borderRadius: '0.25rem',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
        }}
      >
        <h3 style={{ margin: '0 0 0.5rem' }}>Form Debug Info:</h3>
        <div>
          <strong>Form UUID:</strong> {formUuid || 'Not provided'}
        </div>
        <div>
          <strong>Patient UUID:</strong> {patientUuid || 'Not provided'}
        </div>
        <div>
          <strong>Visit UUID:</strong> {visitUuid || currentVisit?.uuid || 'Not provided'}
        </div>
        <div>
          <strong>showForm:</strong> {showForm ? 'true' : 'false'}
        </div>
        <div>
          <strong>formInfo present:</strong> {formInfo ? 'yes' : 'no'}
        </div>
        <div>
          <strong>patient object present:</strong> {patient ? 'yes' : 'no'}
        </div>
        <div>
          <strong>isOnline:</strong> {isOnline ? 'yes' : 'no'}
        </div>
      </div>
    </div>
  );
};

export default FormEntry;
