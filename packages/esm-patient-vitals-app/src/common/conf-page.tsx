import React, { Suspense, useEffect, useRef, useState } from 'react';
import { ExtensionSlot } from '@openmrs/esm-framework';
import styles from './conf-page.scss';

const ConfPage: React.FC = () => {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const slotContainerRef = useRef<HTMLDivElement | null>(null);
  const [slotLoaded, setSlotLoaded] = useState(false);

  useEffect(() => {
    // Observe the slotRef container for children being added by the extension loader
    const el = slotRef.current || slotContainerRef.current;
    if (!el) return;

    if (el.children && el.children.length > 0) {
      setSlotLoaded(true);
      return;
    }

    const mo = new MutationObserver(() => {
      if (el.children && el.children.length > 0) {
        setSlotLoaded(true);
        mo.disconnect();
      }
    });
    mo.observe(el, { childList: true, subtree: false });

    const to = window.setTimeout(() => {
      // Safety: stop spinner after timeout even if no children detected
      setSlotLoaded(true);
      mo.disconnect();
    }, 10000);

    return () => {
      mo.disconnect();
      window.clearTimeout(to);
    };
  }, []);

  return (
    <div className={styles.confPageContainer}>
      <div className={styles.confPageHeader}>
        <h2>Conference Level Dashboard</h2>
        {/* <p>All Patients Monthly Stigma Trend</p> */}
      </div>

      <div className={styles.confPageContent} ref={(el) => (slotContainerRef.current = el)}>
        {/* Overlay spinner until the extension slot has content */}
        {!slotLoaded && (
          <div className={styles.spinnerOverlay}>
            <div className={styles.spinner} aria-hidden="true" />
          </div>
        )}
        w{/* Load the AllPatientsDashboard from patient-vitals app */}
        <Suspense
          fallback={
            <div className={styles.spinnerContainer}>
              <div className={styles.spinner} aria-hidden="true" />
            </div>
          }
        >
          <div ref={slotRef}>
            <ExtensionSlot name="conference-dashboard-slot" />
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default ConfPage;
