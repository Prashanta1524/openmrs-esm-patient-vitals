import React, { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { Button, ContentSwitcher, DataTableSkeleton, IconSwitch, InlineLoading } from '@carbon/react';
import { Analytics, Table, ChartLine } from '@carbon/react/icons';
import { CardHeader, EmptyState, ErrorState } from '@openmrs/esm-patient-common-lib';
import {
  AddIcon,
  PrinterIcon,
  age,
  getPatientName,
  formatDate,
  parseDate,
  useConfig,
  useLayoutType,
 useSession } from '@openmrs/esm-framework';
import type { ConfigObject } from '../config-schema';
import type { VitalsTableHeader, VitalsTableRow } from './types';
import { useLaunchVitalsAndBiometricsForm } from '../utils';
import { useVitalsAndBiometrics, useConceptUnits, withUnit } from '../common';
import { useCovidStigmaData, mapStigmaDataToVitalsFormat } from '../common/stigma-data.resource';
// import MultiChartSelector from '../common/stigma-data-aggregate'; // Commented out to hide
import PaginatedVitals from './paginated-vitals.component';
import PrintComponent from './print/print.component';
import VitalsChart from './vitals-chart.component';
import styles from './vitals-overview.scss';

import MultiChartSelector from '../common/stigma-data-aggregate';
// import AllPatientsDashboard from '../common/conf_dashboard';
// import AllPatientsDashboard from '../common/conf_dashboard'; // Commented out to hide

interface VitalsOverviewProps {
  patientUuid: string;
  patient: fhir.Patient;
  pageSize: number;
  urlLabel: string;
  pageUrl: string;
}

const VitalsOverview: React.FC<VitalsOverviewProps> = ({ patientUuid, patient, pageSize, urlLabel, pageUrl }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const headerTitle = t('vitals', 'Stigma Score');
  const [chartView, setChartView] = useState(false);
  const [showStigmaChart, setShowStigmaChart] = useState(false);
  const isTablet = useLayoutType() === 'tablet';
  const [isPrinting, setIsPrinting] = useState(false);
  const contentToPrintRef = useRef(null);
  const launchVitalsBiometricsForm = useLaunchVitalsAndBiometricsForm();

  const { excludePatientIdentifierCodeTypes } = useConfig();
  const { data: vitals, error, isLoading, isValidating } = useVitalsAndBiometrics(patientUuid);
  const { data: covidStigmaData, error: stigmaError, isLoading: stigmaLoading } = useCovidStigmaData(patientUuid);
  const { conceptUnits } = useConceptUnits();
  const showPrintButton = config.vitals.showPrintButton && !chartView;

  const { user } = useSession();
  const userRoles = user?.roles?.map((r) => r.display?.toLowerCase()) || [];

  // Hide Vitals completely for self-registration users
  if (userRoles.includes('self registration')) return null;

  const patientDetails = useMemo(() => {
    const getGender = (gender: string): string => {
      switch (gender) {
        case 'male':
          return t('male', 'Male');
        case 'female':
          return t('female', 'Female');
        case 'other':
          return t('other', 'Other');
        case 'unknown':
          return t('unknown', 'Unknown');
        default:
          return gender;
      }
    };

    const identifiers =
      patient?.identifier?.filter(
        (identifier) => !excludePatientIdentifierCodeTypes?.uuids.includes(identifier.type.coding[0].code),
      ) ?? [];

    return {
      name: patient ? getPatientName(patient) : '',
      age: age(patient?.birthDate),
      gender: getGender(patient?.gender),
      location: patient?.address?.[0].city,
      identifiers: identifiers?.length ? identifiers.map(({ value }) => value) : [],
    };
  }, [patient, t, excludePatientIdentifierCodeTypes?.uuids]);

  const tableHeaders: Array<VitalsTableHeader> = [
    {
      key: 'temperatureRender',
      header: 'Type of Stigma\n\n(लान्छनाको प्रकार)',
      style: { width: '200px', minWidth: '200px' },
      isSortable: true,
      sortFunc: (valueA, valueB) =>
        valueA.temperature && valueB.temperature ? valueA.temperature - valueB.temperature : 0,
    },
    {
      key: 'bloodPressureRender',
      header: 'Stigma Score\n\n(लान्छनाको अंक)',
      style: { width: '150px', minWidth: '150px' },
      isSortable: true,
      sortFunc: (valueA, valueB) =>
        valueA.systolic && valueB.systolic && valueA.diastolic && valueB.diastolic
          ? valueA.systolic !== valueB.systolic
            ? valueA.systolic - valueB.systolic
            : valueA.diastolic - valueB.diastolic
          : 0,
    },
    {
      key: 'spo2Render',
      header: 'Intersectional\nStigma Score\n\n(अन्तरसम्बन्धित\nलान्छनाको अंक)',
      style: { width: '140px', maxWidth: '140px' },
      isSortable: true,
      sortFunc: (valueA, valueB) => (valueA.spo2 && valueB.spo2 ? valueA.spo2 - valueB.spo2 : 0),
    },
    {
      key: 'respiratoryRateRender',
      header: 'Dimension Score\n\n(क्षेत्रको अंक)',
      style: { width: '300px', minWidth: '300px' },
      isSortable: true,
      sortFunc: (valueA, valueB) =>
        valueA.respiratoryRate && valueB.respiratoryRate ? valueA.respiratoryRate - valueB.respiratoryRate : 0,
    },
  ];

  const tableRows: VitalsTableRow[] = useMemo(() => {
    if (covidStigmaData && covidStigmaData.length > 0) {
      const allStigmaRows = [
        ...mapStigmaDataToVitalsFormat(covidStigmaData, 'अपेक्षित लान्छना'),
        ...mapStigmaDataToVitalsFormat(covidStigmaData, 'व्यावहारिक लान्छना'),
        ...mapStigmaDataToVitalsFormat(covidStigmaData, 'आत्मलान्छना'),
      ];

      const sortedRows = allStigmaRows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return sortedRows.map((row, idx) => ({
        ...row,
        id: String(idx),
        date: row.date ?? '',
      }));
    } else if (vitals && vitals.length > 0) {
      return vitals
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((d, idx) => ({
          id: String(idx),
          date: d.date ?? '',
          dateRender: d.date ? new Date(d.date).toLocaleDateString() : '',
          temperatureRender: d.temperature ?? '',
          bloodPressureRender: d.bloodPressureRenderInterpretation ?? '',
          pulseRender: d.pulse ?? '',
          respiratoryRateRender: d.respiratoryRate ?? '',
          spo2Render: d.spo2 ?? '',
          temperatureRenderInterpretation: undefined,
          bloodPressureRenderInterpretation: undefined,
          pulseRenderInterpretation: undefined,
          respiratoryRateRenderInterpretation: undefined,
          spo2RenderInterpretation: undefined,
        }));
    }
    return [];
  }, [covidStigmaData, vitals]);

  const onBeforeGetContentResolve = useRef(null);

  useEffect(() => {
    if (isPrinting && onBeforeGetContentResolve.current) {
      onBeforeGetContentResolve.current();
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    content: () => contentToPrintRef.current,
    documentTitle: `OpenMRS - ${patientDetails.name} - ${headerTitle}`,
    onBeforeGetContent: () =>
      new Promise((resolve) => {
        if (patient && headerTitle) {
          onBeforeGetContentResolve.current = resolve;
          setIsPrinting(true);
        }
      }),
    onAfterPrint: () => {
      onBeforeGetContentResolve.current = null;
      setIsPrinting(false);
    },
  });

  return (
    <>
      {(() => {
        if (isLoading || stigmaLoading) {
          return <DataTableSkeleton role="progressbar" compact={!isTablet} zebra />;
        }

        if (error || stigmaError) {
          return <ErrorState error={error || stigmaError} headerTitle={headerTitle} />;
        }

        if (tableRows?.length) {
          return (
            <div className={styles.widgetCard}>
              <CardHeader title={headerTitle}>
                <div className={styles.backgroundDataFetchingIndicator}>
                  <span>{isValidating ? <InlineLoading /> : null}</span>
                </div>
                <div className={styles.vitalsHeaderActionItems}>
                  <Button
                    kind="ghost"
                    size="sm"
                    className={styles.titleChartButton}
                    onClick={() => setShowStigmaChart(!showStigmaChart)}
                    iconDescription={t('toggleChart', 'Toggle Stigma Chart')}
                    renderIcon={(props) => <span className={styles.chartIcon}>📈</span>}
                  >
                    {showStigmaChart ? t('hideChart', 'Hide Chart') : t('showChart', 'Show Chart')}
                  </Button>
                </div>
              </CardHeader>

              {showStigmaChart && (
                <div className={styles.stigmaChartContainer} key={showStigmaChart ? 'chart-open' : 'chart-closed'}>
                  <MultiChartSelector patientUuid={patientUuid} />
                </div>
              )}

              {chartView ? (
                <VitalsChart patientVitals={vitals} conceptUnits={conceptUnits} config={config} />
              ) : (
                <div ref={contentToPrintRef}>
                  <PrintComponent subheader={headerTitle} patientDetails={patientDetails} />
                  <PaginatedVitals
                    isPrinting={isPrinting}
                    pageSize={pageSize}
                    pageUrl={pageUrl}
                    tableHeaders={tableHeaders}
                    tableRows={tableRows}
                    urlLabel={urlLabel}
                  />
                </div>
              )}

              {/* All patients monthly stigma trend removed */}
            </div>
          );
        }
        return (
          <div className={styles.widgetCard}>
            <CardHeader title={headerTitle} children={''} />
            <div style={{ padding: '1rem', textAlign: 'center', fontSize: '1rem' }}>
              {t('noStigmaMessage', 'कुनै पनि डेटा फेला परेन।')}
            </div>
          </div>
        );
      })()}
    </>
  );
};

export default VitalsOverview;
