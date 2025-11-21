import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CardHeader } from '@openmrs/esm-patient-common-lib';
import { ExtensionSlot, useSession } from '@openmrs/esm-framework';
import styles from './visualization-base.scss';

interface VisualizationBaseProps {
  patientUuid: string;
}

const VisualizationBase: React.FC<VisualizationBaseProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { user } = useSession();

  // Determine user roles
  const userRoles = useMemo(() => user?.roles?.map((r) => r.display?.toLowerCase()) || [], [user]);

  // If user has self-registration role, hide the widget
  if (userRoles.includes('self registration')) return null;

  const headerTitle = t('visualizations', 'Data Visualizations');
  const headerSubtitle = t('visualizationsSubtitle', 'डाटा भिजुअलाइजेसन');

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={headerTitle}>
        <div className={styles.headerActions}>
          <h4>{headerSubtitle}</h4>
        </div>
      </CardHeader>

      <div className={styles.body}>
        <section className={styles.visualizationSection}>
          <h3>{t('monthlyCounseling', 'Monthly Counseling Trend')}</h3>
          <h4>{t('monthlyCounselingNp', 'मासिक परामर्श प्रवृत्ति')}</h4>
          <ExtensionSlot name="monthly-counseling-visualization" state={{ patientUuid }} />
        </section>

        <section className={styles.visualizationSection}>
          <h3>{t('stigmaTrend', 'Stigma Trend Analysis')}</h3>
          <h4>{t('stigmaTrendNp', 'लान्छना विश्लेषण नतिजाहरू')}</h4>
          <ExtensionSlot name="stigma-trend-visualization" state={{ patientUuid }} />
        </section>
      </div>
    </div>
  );
};

export default VisualizationBase;
