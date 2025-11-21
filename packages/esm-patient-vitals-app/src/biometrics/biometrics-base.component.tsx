import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CardHeader } from '@openmrs/esm-patient-common-lib';
import { useSession } from '@openmrs/esm-framework';
import { useCovidStigmaData, getActivitiesBasedOnStigma } from '../common/stigma-data.resource';
import styles from './biometrics-base.scss';

interface BiometricsBaseProps {
  patientUuid: string;
}

const BiometricsBase: React.FC<BiometricsBaseProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { user } = useSession();

  //  user roles
  const userRoles = useMemo(() => user?.roles?.map((r) => r.display?.toLowerCase()) || [], [user]);

  // If user has self registration role then hide the widget name activities
  if (userRoles.includes('self registration')) return null;

  const headerTitle = t('activities', 'गतिविधिहरू');
  const { data: covidData, isLoading } = useCovidStigmaData(patientUuid);
  const activities = getActivitiesBasedOnStigma(covidData);

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={headerTitle} children={''} />
      <div className={styles.body}>
        {isLoading ? (
          <p>{t('loading', 'Loading...')}</p>
        ) : !covidData || covidData.length === 0 ? (
          <div style={{ minHeight: '50px' }} />
        ) : (
          <div>{activities}</div>
        )}
      </div>
    </div>
  );
};

export default BiometricsBase;
