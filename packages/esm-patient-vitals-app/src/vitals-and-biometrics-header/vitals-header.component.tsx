import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(isToday);
dayjs.extend(duration);
import { Trans, useTranslation } from 'react-i18next';
import { Button, InlineLoading, Tag } from '@carbon/react';
import { Documentation } from '@carbon/react/icons';
import {
  ConfigurableLink,
  formatDate,
  parseDate,
  useConfig,
  useWorkspaces,
  useSession,
  launchWorkspace,
  WorkspaceContainer,
  DocumentIcon,
} from '@openmrs/esm-framework';
import { useVisitOrOfflineVisit, formEntryWorkspace } from '@openmrs/esm-patient-common-lib';
import {
  assessValue,
  getReferenceRangesForConcept,
  interpretBloodPressure,
  useConceptUnits,
  useVitalsAndBiometrics,
  useVitalsConceptMetadata,
} from '../common';
import { type ConfigObject } from '../config-schema';
import VitalsHeaderItem from './vitals-header-item.component';
import styles from './vitals-header.scss';
import notesIcon from '../common/img/notes.png';
interface VitalsHeaderProps {
  patientUuid: string;
  hideLinks?: boolean;
}

const VitalsHeader: React.FC<VitalsHeaderProps> = ({ patientUuid, hideLinks = false }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const { conceptUnits } = useConceptUnits();
  const { data: vitals, isLoading, isValidating } = useVitalsAndBiometrics(patientUuid, 'both');
  const { conceptRanges } = useVitalsConceptMetadata(patientUuid);
  const latestVitals = vitals?.[0];
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const { workspaces } = useWorkspaces();
  const { user } = useSession();
  const userRoles = user?.roles?.map((r) => r.display?.toLowerCase()) || [];
  const isHCW = userRoles.includes('include_hcw');
  // console.log('User Roles:', userRoles);
  // console.log('Is HCW:', isHCW);
  // console.log('Has Vitals:', Boolean(vitals && vitals.length > 0));
  const [pendingPatientUuid, setPendingPatientUuid] = useState<string | null>(null);
  const [launchFormAfterReady, setLaunchFormAfterReady] = useState(false);

  const isWorkspaceOpen = useCallback(() => Boolean(workspaces?.length), [workspaces]);

  // Handle delayed form launch
  useEffect(() => {
    if (launchFormAfterReady && pendingPatientUuid) {
      const launchForm = async () => {
        // Wait a bit to ensure WorkspaceContainer is mounted
        await new Promise((r) => setTimeout(r, 500));
        try {
          await launchWorkspace(formEntryWorkspace, {
            workspaceTitle: 'काउन्सिलर फारम',
            formInfo: {
              patientUuid: pendingPatientUuid,
              formUuid: 'effc3190-3189-4fc2-9a19-ffee5d5ece95',
              encounterUuid: undefined,
              visitUuid: currentVisit?.uuid ?? undefined,
              visitTypeUuid: undefined,
              visitStartDatetime: undefined,
              visitStopDatetime: undefined,
              htmlForm: null,
              mode: 'enter',
            },
          });
          console.log('[Form Debug] Counselor form launched successfully');
        } catch (error) {
          console.error('[Form Debug] Error launching counselor form:', error);
        } finally {
          setLaunchFormAfterReady(false);
          setPendingPatientUuid(null);
        }
      };
      launchForm();
    }
  }, [launchFormAfterReady, pendingPatientUuid, currentVisit?.uuid]);

  if (isLoading) {
    return (
      <InlineLoading role="progressbar" className={styles.loading} description={`${t('loading', 'Loading')} ...`} />
    );
  }

  // Show vitals if available
  if (latestVitals && Object.keys(latestVitals).length && conceptRanges?.length) {
    const hasActiveVisit = Boolean(currentVisit?.uuid);
    const vitalsTakenToday = Boolean(dayjs(latestVitals?.date).isToday());
    const vitalsOverdue = hasActiveVisit && !vitalsTakenToday;
    const now = dayjs();
    const vitalsOverdueDayCount = Math.round(dayjs.duration(now.diff(latestVitals?.date)).asDays());

    let overdueVitalsTagContent: React.ReactNode = null;
    if (vitalsOverdueDayCount >= 1 && vitalsOverdueDayCount < 7) {
      overdueVitalsTagContent = (
        <Trans i18nKey="daysOldVitals" values={{ count: vitalsOverdueDayCount }}>
          <span>
            These vitals are <strong>{vitalsOverdueDayCount} day old</strong>
          </span>
        </Trans>
      );
    } else if (vitalsOverdueDayCount >= 8 && vitalsOverdueDayCount <= 14) {
      overdueVitalsTagContent = (
        <Trans i18nKey="overOneWeekOldVitals">
          <span>
            These vitals are <strong>over one week old</strong>
          </span>
        </Trans>
      );
    } else {
      overdueVitalsTagContent = (
        <Trans i18nKey="outOfDateVitals">
          <span>
            These vitals are <strong>out of date</strong>
          </span>
        </Trans>
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.vitalsHeader}>
          <div className={styles.headerItems}>
            <span className={styles.heading}>{t('vitalsAndBiometrics', '')}</span>
            <span className={styles.bodyText}>
              {formatDate(parseDate(latestVitals?.date), { day: true, time: true })}
            </span>
            {vitalsOverdue && (
              <Tag className={styles.tag} type="red">
                {overdueVitalsTagContent}
              </Tag>
            )}
            {hideLinks && (
              <ConfigurableLink
                className={styles.link}
                to={`\${openmrsSpaBase}/patient/${patientUuid}/chart/Vitals & Biometrics`}
              >
                {t('vitalsHistory', 'Vitals history')}
              </ConfigurableLink>
            )}
          </div>
        </div>
        <div className={classNames(styles.rowContainer, { [styles.workspaceOpen]: isWorkspaceOpen() })}>
          <div className={styles.row}>
            <VitalsHeaderItem
              interpretation={interpretBloodPressure(
                latestVitals?.systolic,
                latestVitals?.diastolic,
                config?.concepts,
                conceptRanges,
              )}
              unitName={t('bp', 'BP')}
              unitSymbol={(latestVitals?.systolic && conceptUnits.get(config.concepts.systolicBloodPressureUuid)) ?? ''}
              value={`${latestVitals?.systolic ?? '--'} / ${latestVitals?.diastolic ?? '--'}`}
            />
            {/* Add other vitals items here as in your original code */}
          </div>
        </div>
      </div>
    );
  }

  // Empty state with form launch button
  return (
    <div className={styles.emptyStateVitalsHeader}>
      <div className={styles.container}>
        <div className={styles.introBox}>
          <p className={styles.introText}>
            {t(
              'vitalsAndBiometricsIntro',
              'कृपया काउन्सिलर फारम खोल्नुहोस् र निर्देशन अनुसार सहभागीलाई प्रश्नहरु सोध्नुहोला।',
            )}
          </p>
        </div>
        <span className={styles.bodyText}>{t('noDataRecorded', ' ')}</span>
        {/* Separator */}
        {/* <span className={styles.separator} /> */}

        {isHCW && (
          <>
            <span className={styles.separator} />
            <Button
              className={styles.customButton}
              // renderIcon={DocumentIcon}
              onClick={() => {
                setPendingPatientUuid(patientUuid);
                setLaunchFormAfterReady(true);
              }}
            >
              {t('openCounselorForm', 'काउन्सिलर फारम  ')}
              <img
                src={notesIcon} // replace with your image path
                alt="icon"
                className={styles.buttonImage} // optional: for styling
                style={{ marginLeft: '8px', height: '20px' }} // inline margin or use CSS
              />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VitalsHeader;
