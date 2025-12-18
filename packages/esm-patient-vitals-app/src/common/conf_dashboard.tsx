// Utility: Get or create a location patient for the current session location
// Remove any top-level hook calls. All hooks must be inside a function component.
// ...existing code...

// Helper interface for dimension score data with min/max
interface DimensionScoreData {
  scores: number[];
  max: number;
  min: number;
  count: number;
}

// Calculate min, max for dimension scores
function calculateDimensionStats(scores: number[]): DimensionScoreData {
  if (scores.length === 0) {
    return { scores: [], max: 0, min: 0, count: 0 };
  }
  const positiveScores = scores.filter((s) => s > 0);
  const max = Math.max(...scores);
  const min = positiveScores.length > 0 ? Math.min(...positiveScores) : 0;
  return { scores, max, min, count: scores.length };
}

// Enacted Dimension Visualization Component with Min/Max
function EnactedDimensionVisualization({
  patients,
  currentLocationUuid,
  startDate,
  endDate,
}: {
  patients: any[];
  currentLocationUuid?: string;
  startDate?: string;
  endDate?: string;
}) {
  // Helper function to check if observation date is within range
  const isWithinDateRange = (obsDate: string | undefined): boolean => {
    if (!obsDate) return true;
    if (!startDate && !endDate) return true;

    const date = new Date(obsDate);
    if (startDate && date < new Date(startDate)) return false;
    if (endDate && date > new Date(endDate + 'T23:59:59')) return false;
    return true;
  };

  const dimensionKeys = ['hiv_domain_es', 'mh_domain_es', 'sgm_domain_es', 'em_domain_es'];
  const chartLabels = ['HIV Domain (ES)', 'Mental Health Domain (ES)', 'SGM Domain (ES)', 'EM Domain (ES)'];

  // Exact observation UUIDs from stigma-data.resource.tsx
  const DIMENSION_UUIDS: Record<string, string> = {
    hiv_domain_es: '6a0fbece-ed88-4da2-9cb2-6db7848dbdfd',
    mh_domain_es: '7ed8a592-dac5-4c7b-b9c0-3ac6126689b8',
    sgm_domain_es: '5c10bc7a-332c-4586-94f2-fbb90b8a264d',
    em_domain_es: '298384cf-8f27-4ec0-93ca-4657eb66c8a1',
  };

  const dimensionScores: Record<string, number[]> = {
    hiv_domain_es: [],
    mh_domain_es: [],
    sgm_domain_es: [],
    em_domain_es: [],
  };

  console.log('\n🔍 ===== ENACTED DIMENSION QA LOG START =====');
  console.log('Using EXACT observation UUIDs:');
  Object.entries(DIMENSION_UUIDS).forEach(([key, uuid]) => {
    console.log(`  ${key}: ${uuid}`);
  });

  patients.forEach((observations, patientIndex) => {
    if (!Array.isArray(observations)) return;

    // Filter by location and date
    const filtered = observations.filter((obs: any) => {
      const locationMatch = !currentLocationUuid || obs.locationUuid === currentLocationUuid;
      const dateMatch = isWithinDateRange(obs.effectiveDateTime || obs.date);
      return locationMatch && dateMatch;
    });

    // Check each dimension for this patient
    Object.entries(DIMENSION_UUIDS).forEach(([key, uuid]) => {
      const obs = filtered.find(
        (o: any) => o.concept?.uuid === uuid || o.code?.coding?.some((c: any) => c.code === uuid),
      );

      if (obs) {
        const rawValue = obs.valueQuantity?.value ?? (obs.valueString ? Number(obs.valueString) : undefined);
        if (typeof rawValue === 'number' && !isNaN(rawValue)) {
          dimensionScores[key].push(rawValue);
          console.log(`📊 Patient ${patientIndex} | ${key}: ${rawValue}`);
        }
      }
    });
  });

  console.log('\n📈 ENACTED DIMENSION FINAL RESULTS:');
  const dimensionStats: Record<string, DimensionScoreData> = {};
  dimensionKeys.forEach((key) => {
    dimensionStats[key] = calculateDimensionStats(dimensionScores[key]);
    console.log(
      `${key}: Max = ${dimensionStats[key].max}, Min = ${dimensionStats[key].min} (from ${dimensionStats[key].count} observations)`,
    );
  });
  console.log('🔍 ===== ENACTED DIMENSION QA LOG END =====\n');

  const maxData = dimensionKeys.map((key) => dimensionStats[key].max);
  const minData = dimensionKeys.map((key) => dimensionStats[key].min);

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <h3
        style={{
          margin: '0 0 1.5rem 0',
          color: '#dc2626',
          fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
          textAlign: 'center',
        }}
      >
        Dimensional Enacted
      </h3>
      <div
        style={{
          height: window.innerWidth <= 480 ? '320px' : window.innerWidth <= 768 ? '380px' : '420px',
          width: '100%',
          position: 'relative',
        }}
      >
        <Chart
          type="bar"
          data={{
            labels: chartLabels,
            datasets: [
              {
                label: 'Max Score',
                data: maxData,
                backgroundColor: 'rgba(220, 38, 38, 0.8)',
                borderColor: 'rgba(220, 38, 38, 1)',
                borderWidth: 2,
                borderRadius: 4,
              },
              {
                label: 'Min Score',
                data: minData,
                backgroundColor: 'rgba(79, 195, 247, 0.8)',
                borderColor: 'rgba(79, 195, 247, 1)',
                borderWidth: 2,
                borderRadius: 4,
              },
            ],
          }}
          plugins={[
            {
              id: 'datalabels-enacted',
              afterDatasetsDraw: function (chart: any) {
                const ctx = chart.ctx;
                ctx.save();
                const fontSize = window.innerWidth <= 480 ? 11 : window.innerWidth <= 768 ? 14 : 16;
                ctx.font = `bold ${fontSize}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillStyle = '#333';
                chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
                  const meta = chart.getDatasetMeta(datasetIndex);
                  meta.data.forEach((bar: any, index: number) => {
                    const value = dataset.data[index];
                    ctx.fillText(value, bar.x, bar.y - 8);
                  });
                });
                ctx.restore();
              },
            },
          ]}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 35,
              },
            },
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  font: {
                    size: window.innerWidth <= 480 ? 11 : window.innerWidth <= 768 ? 13 : 15,
                    weight: 600,
                  },
                  padding: window.innerWidth <= 480 ? 15 : window.innerWidth <= 768 ? 20 : 25,
                  boxWidth: window.innerWidth <= 480 ? 12 : 16,
                },
              },
              tooltip: {
                enabled: false,
              },
            },
            animation: {
              duration: 0,
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Score',
                  font: {
                    size: window.innerWidth <= 480 ? 10 : window.innerWidth <= 768 ? 12 : 14,
                    weight: 600,
                  },
                },
                ticks: {
                  font: {
                    size: window.innerWidth <= 480 ? 9 : window.innerWidth <= 768 ? 10 : 12,
                  },
                },
              },
              x: {
                ticks: {
                  font: {
                    size: window.innerWidth <= 480 ? 8 : window.innerWidth <= 768 ? 10 : 12,
                  },
                  maxRotation: window.innerWidth <= 480 ? 45 : 0,
                  minRotation: 0,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
// import MultiChartSelector from './stigma-data-aggregate';
// // New function for ART ID visualization
// function ArtIdVisualization({ patients }: { patients: any[] }) {
//   const [artId, setArtId] = React.useState('');
//   const [selectedPatientUuid, setSelectedPatientUuid] = React.useState<string | null>(null);

//   return (
//     <div
//       style={{
//         backgroundColor: '#fff',
//         padding: 'clamp(1rem, 3vw, 2rem)',
//         marginBottom: '1.5rem',
//         borderRadius: '12px',
//         boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
//         maxWidth: '98vw',
//         minWidth: 0,
//         width: '100%',
//         minHeight: 300,
//         margin: '0 auto',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         boxSizing: 'border-box',
//       }}
//     >
//       <label>
//         Enter ART ID:{' '}
//         <input
//           type="text"
//           value={artId}
//           onChange={(e) => setArtId(e.target.value)}
//           style={{
//             padding: '0.5rem',
//             borderRadius: 4,
//             border: '1px solid #ccc',
//             marginRight: '1rem',
//           }}
//         />
//         <button
//           onClick={() => {
//             const patient = patients.find(
//               (p) =>
//                 p.identifier &&
//                 p.identifier.some((id) => id.value && id.value.toLowerCase() === artId.trim().toLowerCase()),
//             );
//             setSelectedPatientUuid(patient ? patient.id : null);
//           }}
//           style={{
//             padding: '0.5rem 1rem',
//             borderRadius: 4,
//             border: 'none',
//             background: '#1f2e5b',
//             color: '#fff',
//             cursor: 'pointer',
//           }}
//         >
//           Visualize
//         </button>
//       </label>
//       <div style={{ width: '100%', marginTop: '2rem' }}>
//         {selectedPatientUuid ? (
//           <MultiChartSelector patientUuid={selectedPatientUuid} />
//         ) : (
//           <p style={{ color: '#888', fontSize: '1.1rem', marginTop: '2rem' }}>
//             {artId ? 'No patient found for this ART ID.' : 'Please enter an ART ID and click Visualize.'}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from 'react';
import useSWR from 'swr';
import { fhirBaseUrl, openmrsFetch, showSnackbar, useSession } from '@openmrs/esm-framework';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto'; // ensures chart.js works
// import { StigmaOverviewChart } from './stigma-type-dimensions';
// import { StigmaAnnualTrendChart } from './stigma-annual-trend';
// import type { AggregatedData } from './stigma-annual-trend';
import { useCovidStigmaData, computeStigmaMatch_LatestOnly } from './stigma-data.resource';
// Inline ART ID panel: fetch and display forms directly in this dashboard
import { fetchPatientAnswers } from './stigma-data-aggregate';
import MultiChartSelector from './stigma-data-aggregate';
import { FormDisplay } from './formdisplay';
import ConunselorFormDisplay from './conunselorformdisplay';
import ConferenceFormDisplay from './conferenceformdisplay';
import participantFormJson from '../सहभागी फारम.json';
import counselorFormJson from '../काउन्सिलर फारम.json';
import conferenceFormJson from '../कन्फरेन्स फारम.json';
import { MonthlyBarChart } from './monthly-bar-chart';
import StgTypeVisualization from './stg_type';
import { type CovidStigmaData } from './types';

// QR Code imports
import qr1hivawareness from './img/QR1_HIV awareness_NAPN.png';
import qr2tpo from './img/QR2_TPO_Managing fear.png';
import qr3bds from './img/QR3_BDS_Ideal World.png';
import qr4artadherence from './img/QR4_Treatment adherence video(उपचार पालना)_NCASC.png';
import qr5bdscourse from './img/QR 5_BDS E-course.png';
import qr6hivguidelines from './img/QR 6_National HIV testing and treatment guidelines.png';
import qr7unaids from './img/QR 7_UNAIDS terminology guideline.png';
import qr8bdsdonts from './img/QR 8_BDS_Dos and donts.png';

/* ---------------- Image Modal Component ---------------- */
interface ImageModalProps {
  imageUrl: string;
  altText: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, altText, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
          }}
          onClick={onClose}
        >
          ×
        </button>
        <img
          src={imageUrl}
          alt={altText}
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
};

// QR Code component with popup functionality
interface QRCodeWithPopupProps {
  image: string;
  alt: string;
}

const QRCodeWithPopup: React.FC<QRCodeWithPopupProps> = ({ image, alt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <img
        src={image}
        alt={alt}
        style={{
          maxWidth: '100px',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
        onClick={() => setIsModalOpen(true)}
      />
      <ImageModal imageUrl={image} altText={alt} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

// Clickable text component with QR popup functionality
interface ClickableTextWithQRProps {
  text: string;
  image: string;
  alt: string;
}

const ClickableTextWithQR: React.FC<ClickableTextWithQRProps> = ({ text, image, alt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <p
        style={{
          margin: '0.3rem 0',
          cursor: 'pointer',
          color: isHovered ? '#2563eb' : '#1e3a8a',
          textDecoration: isHovered ? 'underline' : 'none',
          fontWeight: '500',
          transition: 'all 0.2s ease-in-out',
        }}
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {text}
      </p>
      <ImageModal imageUrl={image} altText={alt} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

// ============================================================================
// � PATIENT CONFIGURATION
// ============================================================================
// Configuration for allowed patients in the form interface
// To add new patients, simply add their patient ID to this array
// export const PATIENT_CONFIG = {
// Patient UUIDs - representing sites in the system
// allowedPatients: [
//   {
//     patientId: '04756e92-8e41-4d15-aae6-6431c5065829',
//     description: 'Kathmandu Site',
//   },
//   {
//     patientId: '019061e6-7306-4e6d-bacf-05edf852a922',
//     description: 'Bhaktapur Site',
//   },
// 🚀 TO ADD MORE SITES:
// Uncomment and modify the examples below, then add more as needed:
//
// {
//   patientId: 'your-new-site-patient-id-here',
//   description: 'Site Name'
// },
// {
//   patientId: 'another-site-patient-id-here',
//   description: 'Another Site'
// },
// ],

// Extract just the patient IDs for easy filtering
// get patientIdList() {
//   return this.allowedPatients.map((p) => p.patientId);
// },

// Get description for a site
// getDescription(patientId: string) {
//   const patient = this.allowedPatients.find((p) => p.patientId === patientId);
//   return patient?.description || 'Unknown site';
// },
// };

// 💡 USAGE NOTES:
// • These are LOCATION UUIDs, not patient UUIDs
// • Patients from these locations will be shown in dropdown
// • Kathmandu (6b4b134d...) and Bhaktapur (5fdefb8b...) locations
// • Only patients associated with these locations appear in form interface
// ============================================================================
// import { StigmaAnnualTrendChart } from './stigma-annual-trend';
// import { StigmaOverviewChart } from './StigmaOverviewChart'; // adjust path if needed
// ---------------- Fetch All Patients (for all visualizations) ----------------
async function fetchAllPatients() {
  let allPatients: any[] = [];

  // Method 1: Try FHIR API
  try {
    let offset = 0;
    while (true) {
      const url = `${fhirBaseUrl}/Patient?_count=100&_getpagesoffset=${offset}`;
      const { data } = await openmrsFetch(url);
      if (!data?.entry || data.entry.length === 0) break;
      const patients = data.entry.map((e: any) => e.resource);
      allPatients = allPatients.concat(patients);

      const total = data?.total || allPatients.length;
      offset += 100;
      if (allPatients.length >= total) break;
    }
  } catch (error) {
    // FHIR API failed, continue to next method
  }

  // Method 2: Try REST API (v1/patient)
  try {
    const restUrl = '/ws/rest/v1/patient?limit=100';
    const { data } = await openmrsFetch(restUrl);

    if (data?.results) {
      // If REST API has more patients, use those instead
      if (data.results.length > allPatients.length) {
        allPatients = data.results;
      }
    }
  } catch (error) {
    // REST API failed
  }

  return { patients: allPatients, total: allPatients.length };
}
export function useAllPatients() {
  return useSWR('allPatients', fetchAllPatients);
}
export function checkCutoff(
  value: number | undefined | null,
  cutoff: number,
  returnBoolean = false,
): 'below' | 'above' | 'equal' | boolean {
  if (value == null) return returnBoolean ? false : 'below';
  if (value < cutoff) return returnBoolean ? false : 'below';
  if (value > cutoff) return returnBoolean ? true : 'above';
  return returnBoolean ? true : 'equal';
}

// ---------------- Fetch Counselling/Stigma Data for a patient (with location filter) ----------------
// Static flag to log REST API fallback message only once
let hasLoggedRestApiFallback = false;

async function fetchPatientStigmaData(patientId: string, locationUuid?: string) {
  try {
    // Try REST API first to get observations WITH location data (obs.location.uuid)
    const restUrl = `/ws/rest/v1/obs?patient=${patientId}&v=full&limit=1000`;
    const restResponse = await openmrsFetch(restUrl);

    if (restResponse.data?.results) {
      let observations = restResponse.data.results;

      // Add location info to each observation for easy access
      observations = observations.map((obs: any) => ({
        ...obs,
        locationUuid: obs?.location?.uuid,
        locationName: obs?.location?.display,
      }));

      // Filter by location if provided
      if (locationUuid) {
        observations = observations.filter((obs: any) => obs.locationUuid === locationUuid);
      }

      return observations;
    }
  } catch (restError) {
    // Only log this message once to avoid console clutter
    if (!hasLoggedRestApiFallback) {
      console.info('ℹ️ REST API not available for patients, using FHIR API with encounter location data');
      hasLoggedRestApiFallback = true;
    } // Fallback to FHIR API and fetch encounters to get location
    try {
      const fhirUrl = `${fhirBaseUrl}/Observation?subject=${patientId}&_count=1000`;
      const fhirResponse = await openmrsFetch(fhirUrl);

      if (!fhirResponse.data?.entry) return [];

      let observations = fhirResponse.data.entry.map((e: any) => e.resource);

      // Fetch encounter details to get location for each observation
      const encounterIds = [
        ...new Set(observations.map((obs: any) => obs.encounter?.reference?.split('/')?.[1]).filter(Boolean)),
      ] as string[];

      const encounterLocations: Record<string, { uuid: string; display: string }> = {};

      // Fetch encounters in parallel (limit to avoid too many requests)
      await Promise.all(
        encounterIds.slice(0, 50).map(async (encId: string) => {
          try {
            const encUrl = `${fhirBaseUrl}/Encounter/${encId}`;
            const encResp = await openmrsFetch(encUrl);
            const location = encResp.data?.location?.[0]?.location;
            if (location) {
              encounterLocations[encId] = {
                uuid: location.reference?.split('/')?.[1] || location.id,
                display: location.display || '',
              };
            }
          } catch (e) {
            // Ignore individual encounter fetch errors
          }
        }),
      );

      // Add location info from encounters
      observations = observations.map((obs: any) => {
        const encId = obs.encounter?.reference?.split('/')?.[1] as string | undefined;
        const location = encId ? encounterLocations[encId] : undefined;
        return {
          ...obs,
          locationUuid: location?.uuid,
          locationName: location?.display,
        };
      });

      // Filter by location if provided
      if (locationUuid) {
        observations = observations.filter((obs: any) => obs.locationUuid === locationUuid);
      }

      return observations;
    } catch (fhirError) {
      console.error(`Both REST and FHIR APIs failed for patient ${patientId}:`, fhirError);
      return [];
    }
  }

  return [];
}

// MonthlyBarChart is now imported from './monthly-bar-chart' to keep a single responsive implementation.

// Reusable Date Picker Controls Component
function DatePickerControls({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: {
  startDate: string;
  endDate: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'clamp(6px, 1.5vw, 12px)',
        alignItems: 'center',
        marginBottom: 12,
        flexWrap: 'wrap',
        justifyContent: window.innerWidth <= 480 ? 'center' : 'flex-start',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          width: window.innerWidth <= 480 ? '100%' : 'auto',
        }}
      >
        <label
          style={{
            color: '#444',
            fontSize: 'clamp(12px, 2vw, 14px)',
            minWidth: '45px',
          }}
        >
          Start:
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          style={{
            padding: 'clamp(4px, 1vw, 6px) clamp(6px, 1.5vw, 8px)',
            fontSize: 'clamp(12px, 2vw, 14px)',
            flex: 1,
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          width: window.innerWidth <= 480 ? '100%' : 'auto',
        }}
      >
        <label
          style={{
            color: '#444',
            fontSize: 'clamp(12px, 2vw, 14px)',
            minWidth: '45px',
          }}
        >
          End:
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          style={{
            padding: 'clamp(4px, 1vw, 6px) clamp(6px, 1.5vw, 8px)',
            fontSize: 'clamp(12px, 2vw, 14px)',
            flex: 1,
          }}
        />
      </div>
      <button
        onClick={() => {
          if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            const s = startDate;
            onStartDateChange(endDate);
            onEndDateChange(s);
          }
        }}
        style={{
          padding: 'clamp(4px, 1vw, 6px) clamp(8px, 1.5vw, 10px)',
          fontSize: 'clamp(12px, 2vw, 14px)',
          cursor: 'pointer',
        }}
      >
        Apply
      </button>
      <button
        onClick={() => {
          onStartDateChange('');
          onEndDateChange('');
        }}
        style={{
          padding: 'clamp(4px, 1vw, 6px) clamp(8px, 1.5vw, 10px)',
          fontSize: 'clamp(12px, 2vw, 14px)',
          cursor: 'pointer',
        }}
      >
        Clear
      </button>
    </div>
  );
}

export function isAboveCutoff(value: number | undefined | null, cutoff: number): boolean {
  if (value == null) return false;
  return value > cutoff;
}

export function isBelowCutoff(value: number | undefined | null, cutoff: number): boolean {
  if (value == null) return true;
  return value < cutoff;
}

// ---------------- Main Dashboard ----------------
export default function AllPatientsDashboard() {
  const session = useSession();
  const currentLocationUuid = session?.sessionLocation?.uuid;
  const currentLocationName = session?.sessionLocation?.display;

  const { data, isLoading, error } = useAllPatients();
  const patients = data?.patients || [];
  const [allPatientsData, setAllPatientsData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Date states for each visualization
  const [summaryStartDate, setSummaryStartDate] = useState<string>('');
  const [summaryEndDate, setSummaryEndDate] = useState<string>('');
  const [stgTypeStartDate, setStgTypeStartDate] = useState<string>('');
  const [stgTypeEndDate, setStgTypeEndDate] = useState<string>('');
  const [sitesStartDate, setSitesStartDate] = useState<string>('');
  const [sitesEndDate, setSitesEndDate] = useState<string>('');
  const [intersectionalStartDate, setIntersectionalStartDate] = useState<string>('');
  const [intersectionalEndDate, setIntersectionalEndDate] = useState<string>('');
  const [dimensionStartDate, setDimensionStartDate] = useState<string>('');
  const [dimensionEndDate, setDimensionEndDate] = useState<string>('');

  const [vizType, setVizType] = useState<
    'summary' | 'monthly' | 'custom1' | 'custom2' | 'stgtype' | 'Sites' | 'Intersectional' | 'Dimension'
  >('summary');

  // Add refreshTrigger state for SitesDataVisualization
  const [sitesRefreshTrigger, setSitesRefreshTrigger] = React.useState(0);
  const handleSitesRefresh = () => setSitesRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!patients?.length) return;

    // Fetch patient data with location filter and add ART IDs
    Promise.all(
      patients.map((p, idx) => {
        // Get ART ID from patient
        const artIdObj = p.identifier?.find((id: any) => {
          // REST API format
          if (id.identifierType?.uuid === '9c257200-27e4-447b-b78f-b7778d27cf9f' && id.value) {
            return true;
          }
          // FHIR format
          if (
            id.type?.coding?.some(
              (coding: any) =>
                coding.code === '9c257200-27e4-447b-b78f-b7778d27cf9f' ||
                coding.system?.includes('9c257200-27e4-447b-b78f-b7778d27cf9f'),
            ) &&
            id.value
          ) {
            return true;
          }
          // Fallback: Check if display name contains "ART"
          if (
            (id.identifierType?.display?.includes('ART') ||
              id.type?.text?.includes('ART') ||
              id.type?.coding?.[0]?.display?.includes('ART')) &&
            id.value
          ) {
            return true;
          }
          return false;
        });
        const artId = artIdObj?.value || `Patient ${idx}`;

        return fetchPatientStigmaData(p.id, currentLocationUuid).then((observations) => {
          // Add ART ID to each observation
          return observations.map((obs: any) => ({ ...obs, artId }));
        });
      }),
    ).then((results) => {
      setAllPatientsData(results);
      // Find all years present in the data
      const yearsSet = new Set<string>();
      results.forEach((patientData) => {
        patientData.forEach((obs: any) => {
          const date = new Date(obs.effectiveDateTime || obs.date);
          if (!date) return;
          // Adjust for Nepali Time
          const offsetInMs = 5 * 60 * 60 * 1000 + 45 * 60 * 1000;
          const nepaliDate = new Date(date.getTime() + offsetInMs);
          yearsSet.add(nepaliDate.getFullYear().toString());
        });
      });
      const yearsArr = Array.from(yearsSet).sort();
      setAvailableYears(yearsArr);
      // Default to latest year
      if (yearsArr.length > 0) setSelectedYear(yearsArr[yearsArr.length - 1]);
    });
  }, [patients, currentLocationUuid]);

  // Debug: Log allPatientsData and extracted stigma types when user selects the Stigma Type viz
  useEffect(() => {
    if (vizType !== 'stgtype') return;
    if (!allPatientsData || allPatientsData.length === 0) {
      return;
    }

    const summary: Record<string, number> = { आत्मलान्छना: 0, 'अपेक्षित लान्छना': 0, 'व्यावहारिक लान्छना': 0 };
    let totalObsChecked = 0;
    let locationFilteredObs = 0;

    allPatientsData.forEach((patientObs) => {
      patientObs.forEach((obs: any) => {
        totalObsChecked++;

        // Filter by current location
        if (currentLocationUuid && obs.locationUuid !== currentLocationUuid) {
          return; // Skip observations from other locations
        }

        locationFilteredObs++;

        const raw = (
          obs.stigmaType ||
          obs.code?.coding?.[0]?.display ||
          obs.code?.text ||
          obs.concept?.display ||
          ''
        ).toString();
        const s = raw.toLowerCase();
        // normalize common English keywords to Nepali categories
        let type = '';
        if (s.includes('internal') || s.includes('internalized') || s.includes('आत्म')) type = 'आत्मलान्छना';
        else if (s.includes('anticip') || s.includes('anticipated') || s.includes('अपेक्षित'))
          type = 'अपेक्षित लान्छना';
        else if (s.includes('enact') || s.includes('enacted') || s.includes('व्यावहारिक')) type = 'व्यावहारिक लान्छना';
        else type = raw; // keep raw if it doesn't match

        if (summary[type] !== undefined) summary[type]++;
      });
    });

    console.log(
      `🎯 Stigma Type Location Filter: ${locationFilteredObs}/${totalObsChecked} observations at ${currentLocationName}`,
    );
    console.log('Stigma Type Summary:', summary);
  }, [vizType, allPatientsData, currentLocationUuid, currentLocationName]);

  // When selecting ART ID the ArtIdPanel will be shown by the conditional render below

  // Test function to analyze stigma data with optional date filtering
  function testStigmaAnalysis(patientData: any[], filterStartDate?: string, filterEndDate?: string) {
    let totalPatients = 0;
    let matchedPatients = 0;
    let unmatchedPatients = 0;
    const patientMatches: Record<
      string,
      { matched: boolean; highestScores: { type: string; score: number; threshold: number }[] }
    > = {};

    // Helper to check if observation date is within range
    const isWithinDateRange = (obsDate: string | undefined): boolean => {
      if (!obsDate) return true;
      if (!filterStartDate && !filterEndDate) return true;

      const date = new Date(obsDate);
      if (filterStartDate && date < new Date(filterStartDate)) return false;
      if (filterEndDate && date > new Date(filterEndDate + 'T23:59:59')) return false;
      return true;
    };

    patientData.forEach((observations, patientIndex) => {
      const patientId = String(patientIndex);

      // Filter observations by current location FIRST, then by date
      const locationFilteredObs = observations.filter((obs: any) => {
        const locationMatch = !currentLocationUuid || obs.locationUuid === currentLocationUuid;
        const dateMatch = isWithinDateRange(obs.effectiveDateTime || obs.date);
        return locationMatch && dateMatch;
      });

      // Process observations to match CovidStigmaData format
      const stigmaData: CovidStigmaData[] = locationFilteredObs
        .filter(
          (obs: any) =>
            // Filter only stigma-related observations
            obs.code?.coding?.some(
              (coding: any) =>
                coding.display?.toLowerCase().includes('stigma') || coding.code?.toLowerCase().includes('stigma'),
            ) || obs.concept?.display?.toLowerCase().includes('stigma'),
        )
        .map((obs: any) => ({
          id: obs.id,
          date: obs.effectiveDateTime || obs.date,
          encounterUuid: obs.encounter?.reference,
          stigmaType: obs.code?.coding?.[0]?.display || '',
          stigmaScore: obs.valueQuantity?.value || 0,
          dimensionType: '',
          dimensionScore:
            obs.component?.map((c: any) => `${c.code.text}:${c.valueQuantity?.value || 0}`).join(', ') || '',
          intersectionalScore:
            obs.component?.find((c: any) => c.code.text?.toLowerCase().includes('intersectional'))?.valueQuantity
              ?.value || 0,
        }));

      // Only count patients who have stigma data
      if (stigmaData.length > 0) {
        // console.log(`\n📊 Analyzing Patient ${patientId}:`);

        // Use a Set to track unique score types for this patient
        const uniqueScoreTypes = new Set();

        // Count all scores over their respective thresholds, ensuring each type is only counted once per patient
        const highScores = stigmaData.reduce(
          (scores, entry) => {
            const type = entry.stigmaType?.toLowerCase() || '';
            const score =
              typeof entry.stigmaScore === 'number'
                ? entry.stigmaScore
                : typeof entry.stigmaScore === 'string'
                  ? parseFloat(entry.stigmaScore)
                  : 0;

            // Skip if score is not a valid number
            if (isNaN(score)) return scores;

            // Intersectional scores
            if (type.includes('intersectional')) {
              if (type.includes('anticipated') && score >= 80 && !uniqueScoreTypes.has('Anticipated Intersectional')) {
                uniqueScoreTypes.add('Anticipated Intersectional');
                scores.push({ type: 'Anticipated Intersectional', score, threshold: 80 });
              }
              if (type.includes('enacted') && score >= 86 && !uniqueScoreTypes.has('Enacted Intersectional')) {
                uniqueScoreTypes.add('Enacted Intersectional');
                scores.push({ type: 'Enacted Intersectional', score, threshold: 86 });
              }
              if (
                type.includes('internalized') &&
                score >= 66 &&
                !uniqueScoreTypes.has('Internalized Intersectional')
              ) {
                uniqueScoreTypes.add('Internalized Intersectional');
                scores.push({ type: 'Internalized Intersectional', score, threshold: 66 });
              }
            }

            // Domain scores
            if (type.includes('mental health')) {
              if (type.includes('enacted') && score >= 43 && !uniqueScoreTypes.has('Mental Health Enacted')) {
                uniqueScoreTypes.add('Mental Health Enacted');
                scores.push({ type: 'Mental Health Enacted', score, threshold: 43 });
              }
              if (type.includes('anticipated') && score >= 40 && !uniqueScoreTypes.has('Mental Health Anticipated')) {
                uniqueScoreTypes.add('Mental Health Anticipated');
                scores.push({ type: 'Mental Health Anticipated', score, threshold: 40 });
              }
              if (type.includes('internalized') && score >= 33 && !uniqueScoreTypes.has('Mental Health Internalized')) {
                uniqueScoreTypes.add('Mental Health Internalized');
                scores.push({ type: 'Mental Health Internalized', score, threshold: 33 });
              }
            }

            // Total scores
            if (type.includes('total score')) {
              if (type.includes('enacted') && score >= 43 && !uniqueScoreTypes.has('Total Enacted')) {
                uniqueScoreTypes.add('Total Enacted');
                scores.push({ type: 'Total Enacted', score, threshold: 43 });
              }
              if (type.includes('anticipated') && score >= 40) {
                scores.push({ type: 'Total Anticipated', score, threshold: 40 });
              }
              if (type.includes('internalized') && score >= 33) {
                scores.push({ type: 'Total Internalized', score, threshold: 33 });
              }
            }

            return scores;
          },
          [] as { type: string; score: number; threshold: number }[],
        );

        totalPatients++;
        const hasHighScore = highScores.length > 0;
        patientMatches[patientId] = { matched: hasHighScore, highestScores: highScores };

        if (hasHighScore) {
          //   console.log('⚠️ HIGH STIGMA DETECTED:');
          highScores.forEach((s) => {
            // console.log(`  → ${s.type}: ${s.score} (threshold: ${s.threshold})`);
          });
          matchedPatients++;
        } else {
          //   console.log('✓ All scores below thresholds');
          unmatchedPatients++;
        }

        // console.log('Running Totals:', {
        //   total: totalPatients,
        //   high: matchedPatients,
        //   low: unmatchedPatients,
        // });
      }
    });

    return {
      totalPatients,
      matchedPatients,
      unmatchedPatients,
      patientMatches,
    };
  }

  const stigmaDataByPatient: Record<string, CovidStigmaData[]> = {};
  allPatientsData.forEach((patientObservations, index) => {
    stigmaDataByPatient[String(index)] = patientObservations;
  });

  // Test the analysis and log results
  useEffect(() => {
    if (allPatientsData.length > 0) {
      const analysisResult = testStigmaAnalysis(allPatientsData);
      //   console.log('Stigma Analysis Test Results:', {
      //     totalPatients: analysisResult.totalPatients,
      //     matchedPatients: analysisResult.matchedPatients,
      //     unmatchedPatients: analysisResult.unmatchedPatients,
      //     matchDetails: analysisResult.patientMatches,
      //   });
    }
  }, [allPatientsData]);

  const stigmaCutoffSummary = useMemo(() => {
    // Run the test analysis when data is available with date filtering
    if (allPatientsData.length > 0) {
      const analysisResult = testStigmaAnalysis(
        allPatientsData,
        summaryStartDate || undefined,
        summaryEndDate || undefined,
      );
      return analysisResult;
    }
    return null;
  }, [allPatientsData, summaryStartDate, summaryEndDate]);

  return (
    <div
      style={{
        padding: 'clamp(0.5rem, 2vw, 1rem)',
        border: '2px solid #fafbfdff',
        margin: 'clamp(0.5rem, 2vw, 1rem)',
        backgroundColor: '#f0f8ff',
        maxWidth: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Location Indicator */}
      <div
        style={{
          backgroundColor: '#fff',
          padding: 'clamp(0.5rem, 2vw, 1rem)',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        {/* <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: '600', color: '#333' }}>📍 Current Location:</span>
          <span style={{ fontSize: '1rem', color: '#1890ff', fontWeight: '500' }}>
            {currentLocationName || 'Unknown Location'}
          </span>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}></span> */}
      </div>
      {/* Two-column layout: Left space + Right visualization */}
      <div
        style={{
          display: 'flex',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          gap: 'clamp(1rem, 2vw, 2rem)',
          marginBottom: '1.5rem',
          minHeight: window.innerWidth <= 768 ? 'auto' : '400px',
          width: '100%',
        }}
      >
        {/* Left side - Form Filling Interface */}
        <div
          style={{
            flex: window.innerWidth <= 768 ? '1 1 100%' : '0 0 35%',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: 'clamp(0.75rem, 2vw, 1rem)',
            backgroundColor: '#fff',
            minHeight: '300px',
            width: window.innerWidth <= 768 ? '100%' : 'auto',
            boxSizing: 'border-box',
          }}
        >
          {patients && patients.length > 0 ? (
            <FormFillingInterface
              formUuid="55b82773-3cd0-4813-a38e-9d0c1ea35e45"
              patients={patients}
              onSubmitSuccess={handleSitesRefresh}
            />
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              {/* <h4>📝 Form Filling Interface</h4> */}
              <p style={{ color: '#666' }}>Loading ...</p>
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '4px' }}>
                {/* <p>
                  <strong>Form UUID:</strong> 55b82773-3cd0-4813-a38e-9d0c1ea35e45
                </p> */}
                <p>
                  <strong>Status:</strong> Waiting
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Right side - Visualization dropdown and controls */}
        <div
          style={{
            flex: window.innerWidth <= 768 ? '1 1 100%' : '0 0 62%',
            width: window.innerWidth <= 768 ? '100%' : 'auto',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <label
              style={{
                marginRight: window.innerWidth <= 480 ? '0' : '0.5rem',
                fontWeight: 'bold',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              }}
            >
              Visualization:{' '}
            </label>
            <select
              value={vizType}
              onChange={(e) => setVizType(e.target.value as any)}
              style={{
                padding: 'clamp(0.4rem, 1.5vw, 0.75rem)',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#f8f8f8',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                width: window.innerWidth <= 480 ? '100%' : 'auto',
                maxWidth: '300px',
              }}
            >
              <option value="summary">Above/Below Cutoff Stigma Score</option>
              <option value="monthly">Patient Participation</option>
              <option value="custom1">ART ID</option>
              <option value="stgtype"> Stigma Type</option>
              <option value="Sites">Sites</option>
              <option value="Intersectional">Intersectional</option>
              <option value="Dimension">Dimension</option>
            </select>
          </div>

          {/* All visualizations now contained within the right column */}
          {isLoading && <p>Loading data...</p>}
          {error && <p style={{ color: 'red' }}>Error loading patients: {String(error)}</p>}
          {!isLoading && !patients?.length && <p>No patients found</p>}

          {/* Display Stigma Analysis Results if data is available and summary selected */}
          {vizType === 'summary' && allPatientsData.length > 0 && (
            <div
              style={{
                backgroundColor: '#fff',
                padding: 'clamp(0.75rem, 2vw, 1.5rem)',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                width: '100%',
                minHeight: window.innerWidth <= 768 ? '250px' : '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box',
              }}
            >
              <h3
                style={{
                  fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '1rem',
                }}
              >
                लान्छना विश्लेषण नतिजाहरू
              </h3>
              {/* Date Picker for Summary */}
              <DatePickerControls
                startDate={summaryStartDate}
                endDate={summaryEndDate}
                onStartDateChange={setSummaryStartDate}
                onEndDateChange={setSummaryEndDate}
              />
              {stigmaCutoffSummary ? (
                <>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: window.innerWidth <= 480 ? '320px' : window.innerWidth <= 768 ? '450px' : '600px',
                      height: window.innerWidth <= 480 ? '350px' : window.innerWidth <= 768 ? '420px' : '500px',
                      margin: '20px auto',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                    }}
                  >
                    <Chart
                      type="pie"
                      data={{
                        labels: ['उच्च लान्छना स्कोर', 'न्यून लान्छना स्कोर'],
                        datasets: [
                          {
                            data: [stigmaCutoffSummary.matchedPatients, stigmaCutoffSummary.unmatchedPatients],
                            backgroundColor: ['#FFA500', '#87CEEB'],
                            borderColor: ['#fff', '#fff'],
                            borderWidth: 2,
                          },
                        ],
                      }}
                      plugins={[
                        {
                          id: 'datalabels-pie',
                          afterDatasetsDraw: function (chart: any) {
                            const ctx = chart.ctx;
                            ctx.save();
                            const total = stigmaCutoffSummary.totalPatients;
                            const fontSize = window.innerWidth <= 480 ? 12 : window.innerWidth <= 768 ? 15 : 18;
                            ctx.font = `bold ${fontSize}px sans-serif`;
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';

                            chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
                              const meta = chart.getDatasetMeta(datasetIndex);
                              meta.data.forEach((element: any, index: number) => {
                                const value = dataset.data[index];
                                const percentage = ((value / total) * 100).toFixed(1);
                                const position = element.tooltipPosition();

                                // Draw value and percentage
                                ctx.fillStyle = '#000';
                                ctx.fillText(`${value}`, position.x, position.y - 10);
                                ctx.fillText(`(${percentage}%)`, position.x, position.y + 12);
                              });
                            });
                            ctx.restore();
                          },
                        },
                      ]}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: {
                          duration: 0,
                        },
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              font: {
                                size: window.innerWidth <= 480 ? 12 : window.innerWidth <= 768 ? 14 : 16,
                                weight: 600,
                              },
                              padding: window.innerWidth <= 480 ? 15 : window.innerWidth <= 768 ? 20 : 25,
                            },
                          },
                          tooltip: {
                            enabled: false,
                          },
                        },
                      }}
                    />
                  </div>
                </>
              ) : (
                <p>तथ्यांक विश्लेषण गर्दै...</p>
              )}
            </div>
          )}

          {vizType === 'monthly' && patients.length > 0 && selectedYear && (
            <div
              style={{
                backgroundColor: '#fff',
                padding: 'clamp(1rem, 3vw, 2rem)',
                marginBottom: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                maxWidth: '98vw',
                minWidth: 0,
                width: '100%',
                minHeight: 300,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ width: '100%', padding: 'clamp(4px, 1.5vw, 8px)' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: 'clamp(6px, 1.5vw, 12px)',
                    alignItems: 'center',
                    marginBottom: 12,
                    flexWrap: 'wrap',
                    justifyContent: window.innerWidth <= 480 ? 'center' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      width: window.innerWidth <= 480 ? '100%' : 'auto',
                    }}
                  >
                    <label
                      style={{
                        color: '#444',
                        fontSize: 'clamp(12px, 2vw, 14px)',
                        minWidth: '45px',
                      }}
                    >
                      Start:
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{
                        padding: 'clamp(4px, 1vw, 6px) clamp(6px, 1.5vw, 8px)',
                        fontSize: 'clamp(12px, 2vw, 14px)',
                        flex: 1,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      width: window.innerWidth <= 480 ? '100%' : 'auto',
                    }}
                  >
                    <label
                      style={{
                        color: '#444',
                        fontSize: 'clamp(12px, 2vw, 14px)',
                        minWidth: '45px',
                      }}
                    >
                      End:
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{
                        padding: 'clamp(4px, 1vw, 6px) clamp(6px, 1.5vw, 8px)',
                        fontSize: 'clamp(12px, 2vw, 14px)',
                        flex: 1,
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      // If both dates present but out of order, swap them
                      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
                        const s = startDate;
                        setStartDate(endDate);
                        setEndDate(s);
                      }
                    }}
                    style={{
                      padding: 'clamp(4px, 1vw, 6px) clamp(8px, 1.5vw, 10px)',
                      fontSize: 'clamp(12px, 2vw, 14px)',
                      cursor: 'pointer',
                    }}
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                    }}
                    style={{
                      padding: 'clamp(4px, 1vw, 6px) clamp(8px, 1.5vw, 10px)',
                      fontSize: 'clamp(12px, 2vw, 14px)',
                      cursor: 'pointer',
                    }}
                  >
                    Clear
                  </button>
                </div>

                <MonthlyBarChart
                  allPatientsData={allPatientsData}
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                  availableYears={availableYears}
                  startDate={startDate || undefined}
                  endDate={endDate || undefined}
                  currentLocationUuid={currentLocationUuid}
                />
              </div>
            </div>
          )}

          {/* ART ID panel: enter ART ID to lookup patient and show participant + counselor forms */}
          {vizType === 'custom1' && <ArtIdPanel patients={patients} />}

          {vizType === 'stgtype' && (
            <div
              style={{
                backgroundColor: '#fff',
                padding: 'clamp(1rem, 3vw, 2rem)',
                marginBottom: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                maxWidth: '98vw',
                minWidth: 0,
                width: '100%',
                minHeight: 300,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box',
              }}
            >
              {/* Date Picker for Stigma Type */}
              <DatePickerControls
                startDate={stgTypeStartDate}
                endDate={stgTypeEndDate}
                onStartDateChange={setStgTypeStartDate}
                onEndDateChange={setStgTypeEndDate}
              />
              <StgTypeVisualization
                allPatientsData={allPatientsData}
                startDate={stgTypeStartDate || undefined}
                endDate={stgTypeEndDate || undefined}
                currentLocationUuid={currentLocationUuid}
              />
            </div>
          )}

          {vizType === 'custom2' && (
            <div
              style={{
                backgroundColor: '#fff',
                padding: 'clamp(1rem, 3vw, 2rem)',
                marginBottom: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                maxWidth: '98vw',
                minWidth: 0,
                width: '100%',
                minHeight: 300,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              <p style={{ color: '#888', fontSize: '1.2rem' }}>ART ID</p>
              {/* Later: Replace this with your new chart/component */}
            </div>
          )}

          {vizType === 'Sites' && (
            <div
              style={{
                backgroundColor: '#fff',
                padding: 'clamp(1rem, 3vw, 2rem)',
                marginBottom: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                maxWidth: '98vw',
                minWidth: 0,
                width: '100%',
                minHeight: 300,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box',
              }}
            >
              {/* Date Picker for Sites */}
              <DatePickerControls
                startDate={sitesStartDate}
                endDate={sitesEndDate}
                onStartDateChange={setSitesStartDate}
                onEndDateChange={setSitesEndDate}
              />
              <SitesDataVisualization
                patients={patients}
                refreshTrigger={sitesRefreshTrigger}
                onRefresh={handleSitesRefresh}
                startDate={sitesStartDate || undefined}
                endDate={sitesEndDate || undefined}
              />
            </div>
          )}
          {vizType === 'Intersectional' && (
            <div
              style={{
                backgroundColor: '#fff',
                padding: 'clamp(1rem, 3vw, 2rem)',
                marginBottom: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                maxWidth: '98vw',
                minWidth: 0,
                width: '100%',
                minHeight: 300,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box',
              }}
            >
              {/* Date Picker for Intersectional */}
              <DatePickerControls
                startDate={intersectionalStartDate}
                endDate={intersectionalEndDate}
                onStartDateChange={setIntersectionalStartDate}
                onEndDateChange={setIntersectionalEndDate}
              />
              <IntersectionalStigmaVisualization
                patients={allPatientsData}
                currentLocationUuid={currentLocationUuid}
                startDate={intersectionalStartDate || undefined}
                endDate={intersectionalEndDate || undefined}
              />
            </div>
          )}
          {vizType === 'Dimension' && (
            <div
              style={{
                backgroundColor: '#fff',
                padding: 'clamp(1rem, 3vw, 2rem)',
                marginBottom: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                maxWidth: '98vw',
                minWidth: 0,
                width: '100%',
                minHeight: 300,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box',
              }}
            >
              {/* Date Picker for Dimension */}
              <DatePickerControls
                startDate={dimensionStartDate}
                endDate={dimensionEndDate}
                onStartDateChange={setDimensionStartDate}
                onEndDateChange={setDimensionEndDate}
              />
              <DimensionVisualization
                patients={allPatientsData}
                currentLocationUuid={currentLocationUuid}
                startDate={dimensionStartDate || undefined}
                endDate={dimensionEndDate || undefined}
              />
            </div>
          )}
          {/* Optional: Stigma Overview Chart */}
          {/* <div style={{ marginTop: '2rem' }}>
        <StigmaOverviewChart allPatientsData={allPatientsData} />
      </div> */}

          {/* Monthly Trend Chart */}
          {/* <div style={{ marginTop: '2rem' }}>
        <StigmaOverviewChart allPatientsData={allPatientsData} />
      </div> */}

          {/* Annual Trend Chart */}
          {/* <div style={{ marginTop: '2rem' }}>
        <StigmaAnnualTrendChart
          data={allPatientsData.reduce(
            (acc, observations) => {
              const stigmaData = observations.filter((obs: any) =>
                obs.code?.coding?.some(
                  (coding: any) =>
                    coding.display?.toLowerCase().includes('stigma') || coding.code?.toLowerCase().includes('stigma'),
                ),
              );

              if (stigmaData.length === 0) return acc;

              const date = stigmaData[0]?.effectiveDateTime || stigmaData[0]?.date;
              if (!date) return acc;

              const year = new Date(date).getFullYear().toString();
              const stats = computeStigmaMatch_LatestOnly(stigmaData);

              // Find or create year entry
              const yearEntry = acc.find((entry) => entry.year === year);
              if (!yearEntry) {
                acc.push({
                  year,
                  hiv_as: stats.matched ? 1 : 0,
                  hiv_es: stats.matched ? 1 : 0,
                  hiv_is: stats.matched ? 1 : 0,
                  mh_as: stats.matched ? 1 : 0,
                  mh_es: stats.matched ? 1 : 0,
                  mh_is: stats.matched ? 1 : 0,
                  sgm_as: stats.matched ? 1 : 0,
                  sgm_es: stats.matched ? 1 : 0,
                  sgm_is: stats.matched ? 1 : 0,
                  em_as: stats.matched ? 1 : 0,
                  em_es: stats.matched ? 1 : 0,
                  em_is: stats.matched ? 1 : 0,
                });
              } else {
                // Update existing year entry
                yearEntry.hiv_as += stats.matched ? 1 : 0;
                yearEntry.hiv_es += stats.matched ? 1 : 0;
                yearEntry.hiv_is += stats.matched ? 1 : 0;
                yearEntry.mh_as += stats.matched ? 1 : 0;
                yearEntry.mh_es += stats.matched ? 1 : 0;
                yearEntry.mh_is += stats.matched ? 1 : 0;
                yearEntry.sgm_as += stats.matched ? 1 : 0;
                yearEntry.sgm_es += stats.matched ? 1 : 0;
                yearEntry.sgm_is += stats.matched ? 1 : 0;
                yearEntry.em_as += stats.matched ? 1 : 0;
                yearEntry.em_es += stats.matched ? 1 : 0;
                yearEntry.em_is += stats.matched ? 1 : 0;
              }

              return acc;
            },
            [] as Array<AggregatedData & { year: string }>,
          )}
        />
      </div> */}
        </div>{' '}
        {/* Close right column */}
      </div>{' '}
      {/* Close two-column layout */}
      {/* New div below right column */}
      <div
        id="activities-section"
        style={{
          backgroundColor: '#fff',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          border: '1px solid #e0e0e0',
          marginTop: '1.5rem',
          position: 'relative',
        }}
      >
        <div style={{ lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}>
          {/* QR Code Images */}
          {(() => {
            return (
              <>
                {/* गतिविधी १ */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      margin: '0 0 1rem 0',
                      color: '#1e3a8a',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    गतिविधी १: स्वास्थ्यकर्मीहरू: विचार र समीक्षा गर्नुहोस्।
                  </h3>
                  <div style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
                    <p style={{ margin: '0.5rem 0' }}>
                      o आफ्नो परामर्श र अन्तरक्रिया गर्ने तरिका बारे विचार तथा समिक्षा गर्नुहोला।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o आवश्यकताअनुसार उपयुक्त सम्बन्धित स्रोतहरू (जस्तै, नयाँ कर्मचारीको पारम्भिक र अन्य तालिम पुस्तिका
                      तथा कार्यशाला सामग्री) पुनः अध्ययन गर्नुहोस्।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o मासिक बैठकमा टिमसँग एचआईभी संक्रमित व्यक्तिहरूका जवाफहरूको समीक्षा गरी सकारात्मक/ मजबुत पक्ष र
                      सुधार गर्नुपर्ने ठाउँहरू बारे छलफल गर्नुहोस्।
                    </p>
                  </div>

                  <h4
                    style={{
                      margin: '1rem 0 0.5rem 0',
                      color: '#1e3a8a',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    श्रोतहरु:
                  </h4>
                  <div style={{ marginLeft: '1rem' }}>
                    <div style={{ margin: '0.5rem 0' }}>
                      <ClickableTextWithQR
                        text="१. लैङ्गिकता र लिङ्ग पहिचान"
                        image={qr5bdscourse}
                        alt="QR Code for BDS E-course"
                      />
                    </div>
                    <div style={{ margin: '0.5rem 0' }}>
                      <ClickableTextWithQR
                        text="२. उपचार पालना सम्बन्धी परामर्श"
                        image={qr6hivguidelines}
                        alt="QR Code for HIV guidelines"
                      />
                    </div>
                    <div style={{ margin: '0.5rem 0' }}>
                      <ClickableTextWithQR
                        text="३. एचआईभी सम्बन्धी शब्दावलीको स्रोत"
                        image={qr7unaids}
                        alt="QR Code for UNAIDS terminology"
                      />
                    </div>
                    <div style={{ margin: '0.5rem 0' }}>
                      <ClickableTextWithQR
                        text="४. गर्ने हुने र गर्न नहुने कुरा (लैङ्गिक तथा यौनिक अल्पसंख्यकहरूका लागि)"
                        image={qr8bdsdonts}
                        alt="QR Code for BDS dos and donts"
                      />
                    </div>
                  </div>
                </div>

                {/* गतिविधी २ */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      margin: '0 0 1rem 0',
                      color: '#1e3a8a',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    एचआईभी संक्रमित व्यक्तिहरूको आत्मसक्षमता र आत्मसम्मान बढाउने परामर्श
                  </h3>
                  <div style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
                    <p style={{ margin: '0.5rem 0' }}>
                      o कुराकानी गर्दा खुल्ला प्रश्नहरु सोध्नुहोस्, ध्यान दिएर सुन्नुहोस् र उनीहरूले भनेको कुरालाई मनन
                      गर्दै जवाफ दिनुहोस्।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o एचआईभी संक्रमित व्यक्तिहरूको आत्मविश्वास र आत्मसम्मान बढाउन सहयोग गर्नुहोस्।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o एचआईभी संक्रमित व्यक्तिहरूको एआरटि, उपचारको नियमित पालना, र मानसिक स्वास्थ्य सम्बन्धी अनुभव र
                      सोचबारे छलफल गर्नुहोस्।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o एचआईभी संक्रमित व्यक्तिहरूले हाल प्रयोग गरिरहेका वा थाहा पाएका सामना गर्ने तरिकाहरूको बारेमा
                      कुरा गर्नुहोस्।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o संक्षेपमा कुरा राखेर थप सामना गर्ने तरिकाहरू बारे बताउनुहोस्।
                    </p>
                  </div>

                  <h4
                    style={{
                      margin: '1rem 0 0.5rem 0',
                      color: '#1e3a8a',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    श्रोतहरु:
                  </h4>
                  <div style={{ marginLeft: '1rem' }}>
                    <div style={{ margin: '0.5rem 0' }}>
                      <ClickableTextWithQR
                        text="१. एचआईभी सम्बन्धि जनचेतना"
                        image={qr1hivawareness}
                        alt="QR Code for HIV awareness"
                      />
                    </div>
                    <div style={{ margin: '0.5rem 0' }}>
                      <ClickableTextWithQR
                        text="२. मानसिक स्वास्थ्य (डरको व्यवस्थापन)"
                        image={qr2tpo}
                        alt="QR Code for managing fear"
                      />
                    </div>
                    <div style={{ margin: '0.5rem 0' }}>
                      <ClickableTextWithQR
                        text="३. लैङ्गिक तथा यौनिक अल्पसङ्ख्यकको लागि जानकारी"
                        image={qr3bds}
                        alt="QR Code for ideal world info"
                      />
                    </div>
                    <div style={{ margin: '0.5rem 0' }}>
                      <ClickableTextWithQR
                        text="४. उपचार पालना सम्बन्धि जनचेतना"
                        image={qr4artadherence}
                        alt="QR Code for treatment adherence"
                      />
                    </div>
                  </div>
                </div>

                {/* गतिविधी ३ */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      margin: '0 0 1rem 0',
                      color: '#1e3a8a',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    गतिविधी ३: एचआईभी संक्रमित व्यक्तिहरूलाई सपोर्ट ग्रुपसँग जोडिन सहयोग गर्नुहोस्।
                  </h3>
                  <div style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
                    <p style={{ margin: '0.5rem 0' }}>
                      o एचआइभी संक्रमित व्यक्तिहरूलाई सपोर्ट ग्रुपमा रुचि छ कि छैन भन्ने बुझ्न खुला प्रश्नहरू सोध्नुहोस्
                      ।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o उनीहरुको सपोर्ट ग्रुपसँगको पहिलेका अनुभवहरू (सकारात्मक वा नकारात्मक) बारे छलफल गर्नुहोस्।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o उपयुक्त सपोर्ट ग्रुपसँग कसरी जोडिन र सहयोग लिन सकिन्छ भन्ने कुरा थप्नुहोस्।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o एचआइभी संक्रमित व्यक्तिहरूको रुचि भएमा, सपोर्ट ग्रुपहरूको बारेमा जानकारी दिनुहोस् र सम्पर्क गर्न
                      सहयोग गर्नुहोस्।
                    </p>
                  </div>

                  <h4
                    style={{
                      margin: '1rem 0 0.5rem 0',
                      color: '#1e3a8a',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    सपोर्ट ग्रुपहरूको सूची: (जब सहभागीले सपोर्ट ग्रुपमा सामेल हुन सहमति जनाउँछन् तब देखाउनुहोस्)
                  </h4>
                  <div style={{ marginLeft: 'clamp(0.5rem, 2vw, 1rem)', overflowX: 'auto' }}>
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        lineHeight: '1.6',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        minWidth: '300px',
                      }}
                    >
                      <tbody>
                        <tr>
                          <td style={{ padding: 'clamp(0.3rem, 1vw, 0.5rem)' }}>१. ड्रप-इन सेन्टर</td>
                          <td style={{ padding: 'clamp(0.3rem, 1vw, 0.5rem)' }}>स्वतन्त्र पथ, बुटवल, रूपन्देही</td>
                          <td style={{ padding: 'clamp(0.3rem, 1vw, 0.5rem)', wordBreak: 'break-word' }}>
                            msmgnepal@gmail.com, ०७१-५२४८६२
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: 'clamp(0.3rem, 1vw, 0.5rem)' }}>२. ड्रप-इन सेन्टर</td>
                          <td style={{ padding: 'clamp(0.3rem, 1vw, 0.5rem)' }}>मुर्ली बगैचा, वीरगञ्ज, पर्सा</td>
                          <td style={{ padding: 'clamp(0.3rem, 1vw, 0.5rem)', wordBreak: 'break-word' }}>
                            parsachemsexdic@gmail.com, ०५१-५२८६०६
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: 'clamp(0.3rem, 1vw, 0.5rem)' }}>३. ड्रप-इन सेन्टर</td>
                          <td style={{ padding: 'clamp(0.3rem, 1vw, 0.5rem)' }}>
                            नील सरस्वतीथान, खुरसानिटार, काठमाडौं
                          </td>
                          <td style={{ padding: 'clamp(0.3rem, 1vw, 0.5rem)', wordBreak: 'break-word' }}>
                            cruiseaids@gmail.com, ०१-४४२४०५२
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: 'clamp(0.3rem, 1vw, 0.5rem)' }}>४. एनएपि+एन</td>
                          <td style={{ padding: 'clamp(0.3rem, 1vw, 0.5rem)' }}>बालुवाटार, काठमाडौं</td>
                          <td style={{ padding: 'clamp(0.3rem, 1vw, 0.5rem)', wordBreak: 'break-word' }}>
                            info@napn.org.np, ०१-४५२७४५९
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: 'clamp(0.3rem, 1vw, 0.5rem)' }}>५. एनएफडब्लुएलएचए</td>
                          <td>नयाँ बानेश्वर, काठमाडौं</td>
                          <td>nfwlha007@gmail.com, ०१-४५९९३७५</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* गतिविधी ४ */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      margin: '0 0 1rem 0',
                      color: '#1e3a8a',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    गतिविधी ४: एचआईभी संक्रमित व्यक्तिहरूका एआरटी र स्वास्थ्यकर्मीहरू सम्बन्धी गुनासोहरुको व्यवस्थापन
                    गर्ने।
                  </h3>
                  <div style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
                    <p style={{ margin: '0.5rem 0' }}>
                      o एचआईभी संक्रमित व्यक्तिहरूलाई सुझाव/प्रतिक्रिया प्रणालीबारे जानकारी दिनुहोस्।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o प्रतिक्रिया हेरेर आवश्यक भए अनुसार उचित सुधार वा अन्य कार्य गर्नुहोस्।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o एआरटीमा भइरहेका जानेर वा अनजानमा भएका लान्छनापूर्ण अभ्यासहरूको/व्यवहारहरू के–के छन् भनेर पहिचान
                      गरेर सूची बनाउनुहोस्।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>o लान्छनारहित सेवा दिन सहयोग हुने कार्यसूची तयार गर्नुहोस्।</p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o एआरटीका कर्मचारीहरूलाई नियमित रूपमा संवेदनशीलता सम्बन्धी तालिम प्रदान गर्नुहोस्।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o प्रतीक्षा गर्ने ठाउँहरूमा लान्छना कम गर्न सहयोग हुने पोस्टर र सन्देशहरू टाँस्नुहोस्।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o सबै कर्मचारीहरु, रिसेप्सन र प्रशासनसहित, लाई आदरपूर्वक र बिना भेदभाव सेवा प्रदान कसरी गर्ने
                      समन्धित तालिम दिनुहोस्।
                    </p>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// Small inline ART ID panel component that fetches form answers and displays both forms
function ArtIdPanel({ patients }: { patients: any[] }) {
  const [artId, setArtId] = React.useState('');
  const [selectedPatientUuid, setSelectedPatientUuid] = React.useState<string | null>(null);
  const [participantAnswers, setParticipantAnswers] = React.useState<Record<string, any>>({});
  const [counselorAnswers, setCounselorAnswers] = React.useState<Record<string, any>>({});
  const [conferenceAnswers, setConferenceAnswers] = React.useState<Record<string, any>>({});
  const [loading, setLoading] = React.useState(false);

  async function onSearch() {
    setSelectedPatientUuid(null);
    setParticipantAnswers({});
    setCounselorAnswers({});
    setConferenceAnswers({});
    if (!artId) return;
    const patient = patients.find(
      (p) =>
        p.identifier &&
        p.identifier.some((id: any) => id.value && id.value.toLowerCase() === artId.trim().toLowerCase()),
    );
    if (!patient) {
      setSelectedPatientUuid(null);
      return;
    }
    setSelectedPatientUuid(patient.id);
    setLoading(true);
    try {
      const [pAns, cAns, confAns] = await Promise.all([
        fetchPatientAnswers(patient.id, participantFormJson),
        fetchPatientAnswers(patient.id, counselorFormJson),
        fetchPatientAnswers(patient.id, conferenceFormJson),
      ]);

      setParticipantAnswers(pAns || {});
      setCounselorAnswers(cAns || {});
      setConferenceAnswers(confAns || {});
    } catch (err) {
      // console.error('Error fetching form answers for ART ID', artId, err);
      setParticipantAnswers({});
      setCounselorAnswers({});
      setConferenceAnswers({});
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: 'clamp(1rem, 3vw, 2rem)',
        marginBottom: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        maxWidth: '98vw',
        minWidth: 0,
        width: '100%',
        minHeight: 300,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label style={{ fontWeight: 'bold' }}>Enter ART ID:</label>
        <input value={artId} onChange={(e) => setArtId(e.target.value)} style={{ padding: 6 }} />
        <button onClick={onSearch} style={{ padding: '6px 10px' }}>
          Search
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        {loading && <p>Loading...</p>}
        {!loading && selectedPatientUuid && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              {/* Per-patient stigma bar chart */}
              <MultiChartSelector patientUuid={selectedPatientUuid} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0' }}>सहभागी फारम - उत्तरहरू</h4>
              <FormDisplay formDefinition={participantFormJson} answers={participantAnswers} />
            </div>
            <div>
              {/* <h4 style={{ margin: '0 0 8px 0' }}>Counselor Form</h4> */}
              <ConunselorFormDisplay formDefinition={counselorFormJson} answers={counselorAnswers} />
            </div>
            {/* Conference Form removed - it shows in Sites visualization panel instead */}
          </div>
        )}
        {!loading && !selectedPatientUuid && artId && <p>No patient found for ART ID: {artId}</p>}
      </div>
    </div>
  );
}

// Intersectional Stigma Visualization Component
function IntersectionalStigmaVisualization({
  patients,
  currentLocationUuid,
  startDate,
  endDate,
}: {
  patients: any[];
  currentLocationUuid?: string;
  startDate?: string;
  endDate?: string;
}) {
  const [loading, setLoading] = React.useState(true);
  const [intersectionalData, setIntersectionalData] = React.useState<{
    stigma_as: { highest: any; lowest: any };
    stigma_es: { highest: any; lowest: any };
    stigma_is: { highest: any; lowest: any };
  } | null>(null);

  // Helper function to check if observation date is within range
  const isWithinDateRange = (obsDate: string | undefined): boolean => {
    if (!obsDate) return true;
    if (!startDate && !endDate) return true;

    const date = new Date(obsDate);
    if (startDate && date < new Date(startDate)) return false;
    if (endDate && date > new Date(endDate + 'T23:59:59')) return false;
    return true;
  };

  // Get access to all patients for ART ID lookup
  const { data } = useAllPatients();
  const allPatients = data?.patients || [];

  React.useEffect(() => {
    console.log('🔍 allPatients array length:', allPatients.length);
    console.log('🔍 First patient sample:', allPatients[0]);
    if (allPatients.length > 0 && allPatients[0]?.identifier) {
      console.log(
        '🔍 First patient identifiers:',
        allPatients[0].identifier.map((id: any) => ({
          type: id.identifierType?.display || id.identifierType?.name,
          uuid: id.identifierType?.uuid,
          value: id.value,
        })),
      );
    }
  }, [allPatients]);

  React.useEffect(() => {
    if (!patients || patients.length === 0) {
      setLoading(false);
      return;
    }

    // Calculate highest for each intersectional stigma type using EXACT observation UUIDs
    const calculateExtremes = () => {
      console.log('\n🔍 ===== INTERSECTIONAL STIGMA QA LOG START ===== ');
      console.log('Using EXACT observation UUIDs:');
      console.log('  AS Intersectional: 260b7159-9cc9-442d-b641-133b5dbbce06');
      console.log('  ES Intersectional: fb3a85e9-5154-46f7-8c00-54cce586332c');
      console.log('  IS Intersectional: 54addbef-17f5-4678-988a-9d6a68ad38f7');

      const stigmaTypes = {
        stigma_as: { highest: null as any, highestScore: -Infinity, lowest: null as any, lowestScore: Infinity },
        stigma_es: { highest: null as any, highestScore: -Infinity, lowest: null as any, lowestScore: Infinity },
        stigma_is: { highest: null as any, highestScore: -Infinity, lowest: null as any, lowestScore: Infinity },
      };

      // Intersectional stigma observation UUIDs (from stigma-data.resource.tsx)
      const INTERSECTIONAL_AS_UUID = '260b7159-9cc9-442d-b641-133b5dbbce06';
      const INTERSECTIONAL_ES_UUID = 'fb3a85e9-5154-46f7-8c00-54cce586332c';
      const INTERSECTIONAL_IS_UUID = '54addbef-17f5-4678-988a-9d6a68ad38f7';

      let processedPatients = 0;
      let totalObservations = 0;

      patients.forEach((observations, patientIndex) => {
        if (!Array.isArray(observations) || observations.length === 0) return;

        // Filter by location first, then by date
        const locationFiltered = observations.filter((obs: any) => {
          const locationMatch = !currentLocationUuid || obs.locationUuid === currentLocationUuid;
          const dateMatch = isWithinDateRange(obs.effectiveDateTime || obs.date);
          return locationMatch && dateMatch;
        });

        if (locationFiltered.length === 0) return;

        // Get patient info for ART ID lookup
        const patient = allPatients[patientIndex];

        // Try both FHIR format (type.coding) and REST format (identifierType.uuid)
        const artIdObj = patient?.identifier?.find((id: any) => {
          // REST API format
          if (id.identifierType?.uuid === '9c257200-27e4-447b-b78f-b7778d27cf9f' && id.value) {
            return true;
          }
          // FHIR format - check type.coding for the UUID
          if (
            id.type?.coding?.some(
              (coding: any) =>
                coding.code === '9c257200-27e4-447b-b78f-b7778d27cf9f' ||
                coding.system?.includes('9c257200-27e4-447b-b78f-b7778d27cf9f'),
            ) &&
            id.value
          ) {
            return true;
          }
          // Check if display name contains "ART"
          if (
            (id.identifierType?.display?.includes('ART') ||
              id.type?.text?.includes('ART') ||
              id.type?.coding?.[0]?.display?.includes('ART')) &&
            id.value
          ) {
            return true;
          }
          return false;
        });
        const artId = artIdObj?.value || `Patient-${patientIndex}`;

        // Debug identifiers for first few patients
        if (patientIndex <= 2) {
          console.log(`\n🔍 Patient ${patientIndex} identifiers:`);
          patient?.identifier?.forEach((id: any, idx: number) => {
            console.log(`  ID ${idx}:`, {
              value: id.value,
              restType: id.identifierType?.display,
              restUuid: id.identifierType?.uuid,
              fhirTypeText: id.type?.text,
              fhirTypeCoding: id.type?.coding?.[0],
            });
          });
          console.log(`  ➡️ Selected ART ID: ${artId}`);
        }

        console.log(`\n👤 Patient ${patientIndex} (ART ID: ${artId}) - ${locationFiltered.length} observations`);

        // Debug: Log observation structure for Patient 2
        if (patientIndex === 2) {
          console.log('🔍 DEBUG Patient 2 - All observation concept UUIDs:');
          locationFiltered.forEach((obs: any, idx: number) => {
            console.log(`  Obs ${idx}:`, {
              conceptUuid: obs.concept?.uuid,
              conceptDisplay: obs.concept?.display,
              codeSystem: obs.code?.coding?.[0]?.system,
              codeCode: obs.code?.coding?.[0]?.code,
              codeDisplay: obs.code?.coding?.[0]?.display,
              value: obs.valueQuantity?.value || obs.value,
            });
          });
          console.log('Looking for these UUIDs:');
          console.log('  AS:', INTERSECTIONAL_AS_UUID);
          console.log('  ES:', INTERSECTIONAL_ES_UUID);
          console.log('  IS:', INTERSECTIONAL_IS_UUID);
        }

        processedPatients++;

        // Check for Anticipated Intersectional Stigma (AS)
        // Try both FHIR format (code.coding) and REST format (concept.uuid)
        const asObs = locationFiltered.find(
          (obs: any) =>
            obs.concept?.uuid === INTERSECTIONAL_AS_UUID ||
            obs.code?.coding?.some((coding: any) => coding.code === INTERSECTIONAL_AS_UUID),
        );
        if (asObs) {
          const score = asObs.valueQuantity?.value;
          const date = asObs.effectiveDateTime || asObs.date;

          if (typeof score === 'number' && !isNaN(score)) {
            totalObservations++;
            console.log(`  📋 AS Intersectional: ${score} | Date: ${date}`);

            // Track highest (max)
            const prevHighest = stigmaTypes.stigma_as.highestScore;
            if (score > prevHighest) {
              stigmaTypes.stigma_as.highestScore = score;
              stigmaTypes.stigma_as.highest = {
                stigmaType: 'Anticipated Intersectional',
                score,
                date,
                artId,
              };
              console.log(`  ✅ NEW HIGHEST AS: ${score} (was ${prevHighest === -Infinity ? 'None' : prevHighest})`);
            } else {
              console.log(`  ⚪ Not higher than current: ${prevHighest}`);
            }

            // Track lowest (min)
            const prevLowest = stigmaTypes.stigma_as.lowestScore;
            if (score > 0 && score < prevLowest) {
              stigmaTypes.stigma_as.lowestScore = score;
              stigmaTypes.stigma_as.lowest = {
                stigmaType: 'Anticipated Intersectional',
                score,
                date,
                artId,
              };
              console.log(`  ✅ NEW LOWEST AS: ${score} (was ${prevLowest === Infinity ? 'None' : prevLowest})`);
            }
          }
        }

        // Check for Enacted Intersectional Stigma (ES)
        const esObs = locationFiltered.find(
          (obs: any) =>
            obs.concept?.uuid === INTERSECTIONAL_ES_UUID ||
            obs.code?.coding?.some((coding: any) => coding.code === INTERSECTIONAL_ES_UUID),
        );
        if (esObs) {
          const score = esObs.valueQuantity?.value;
          const date = esObs.effectiveDateTime || esObs.date;

          if (typeof score === 'number' && !isNaN(score)) {
            totalObservations++;
            console.log(`  📋 ES Intersectional: ${score} | Date: ${date} | ART ID: ${artId}`);

            // Track highest (max)
            const prevHighest = stigmaTypes.stigma_es.highestScore;
            if (score > prevHighest) {
              stigmaTypes.stigma_es.highestScore = score;
              stigmaTypes.stigma_es.highest = {
                stigmaType: 'Enacted Intersectional',
                score,
                date,
                artId,
              };
              console.log(
                `  ✅ NEW HIGHEST ES: ${score} (ART ID: ${artId}) - was ${prevHighest === -Infinity ? 'None' : prevHighest}`,
              );
            } else {
              console.log(`  ⚪ ES: ${score} (ART ID: ${artId}) - Not higher than current: ${prevHighest}`);
            }

            // Track lowest (min)
            const prevLowest = stigmaTypes.stigma_es.lowestScore;
            if (score > 0 && score < prevLowest) {
              stigmaTypes.stigma_es.lowestScore = score;
              stigmaTypes.stigma_es.lowest = {
                stigmaType: 'Enacted Intersectional',
                score,
                date,
                artId,
              };
              console.log(`  ✅ NEW LOWEST ES: ${score} (was ${prevLowest === Infinity ? 'None' : prevLowest})`);
            }
          }
        } else {
          // Log when ES Intersectional is NOT found for debugging
          if (patientIndex <= 2) {
            console.log(`  ⚠️ No ES Intersectional observation found for Patient ${patientIndex} (ART ID: ${artId})`);
          }
        }

        // Check for Internalized Intersectional Stigma (IS)
        const isObs = locationFiltered.find(
          (obs: any) =>
            obs.concept?.uuid === INTERSECTIONAL_IS_UUID ||
            obs.code?.coding?.some((coding: any) => coding.code === INTERSECTIONAL_IS_UUID),
        );
        if (isObs) {
          const score = isObs.valueQuantity?.value;
          const date = isObs.effectiveDateTime || isObs.date;

          if (typeof score === 'number' && !isNaN(score)) {
            totalObservations++;
            console.log(`  📋 IS Intersectional: ${score} | Date: ${date}`);

            // Track highest (max)
            const prevHighest = stigmaTypes.stigma_is.highestScore;
            if (score > prevHighest) {
              stigmaTypes.stigma_is.highestScore = score;
              stigmaTypes.stigma_is.highest = {
                stigmaType: 'Internalized Intersectional',
                score,
                date,
                artId,
              };
              console.log(`  ✅ NEW HIGHEST IS: ${score} (was ${prevHighest === -Infinity ? 'None' : prevHighest})`);
            } else {
              console.log(`  ⚪ Not higher than current: ${prevHighest}`);
            }

            // Track lowest (min)
            const prevLowest = stigmaTypes.stigma_is.lowestScore;
            if (score > 0 && score < prevLowest) {
              stigmaTypes.stigma_is.lowestScore = score;
              stigmaTypes.stigma_is.lowest = {
                stigmaType: 'Internalized Intersectional',
                score,
                date,
                artId,
              };
              console.log(`  ✅ NEW LOWEST IS: ${score} (was ${prevLowest === Infinity ? 'None' : prevLowest})`);
            }
          }
        }
      });

      console.log('\n📈 INTERSECTIONAL STIGMA FINAL RESULTS:');
      console.log('Anticipated (AS):', {
        max: stigmaTypes.stigma_as.highestScore,
        min: stigmaTypes.stigma_as.lowestScore === Infinity ? 0 : stigmaTypes.stigma_as.lowestScore,
        artId: stigmaTypes.stigma_as.highest?.artId,
        date: stigmaTypes.stigma_as.highest?.date,
      });
      console.log('Enacted (ES):', {
        max: stigmaTypes.stigma_es.highestScore,
        min: stigmaTypes.stigma_es.lowestScore === Infinity ? 0 : stigmaTypes.stigma_es.lowestScore,
        artId: stigmaTypes.stigma_es.highest?.artId,
        date: stigmaTypes.stigma_es.highest?.date,
      });
      console.log('Internalized (IS):', {
        max: stigmaTypes.stigma_is.highestScore,
        min: stigmaTypes.stigma_is.lowestScore === Infinity ? 0 : stigmaTypes.stigma_is.lowestScore,
        artId: stigmaTypes.stigma_is.highest?.artId,
        date: stigmaTypes.stigma_is.highest?.date,
      });
      console.log('Processed patients:', processedPatients, '| Total observations:', totalObservations);
      console.log('🔍 ===== INTERSECTIONAL STIGMA QA LOG END =====\n');

      setIntersectionalData({
        stigma_as: { highest: stigmaTypes.stigma_as.highest, lowest: stigmaTypes.stigma_as.lowest },
        stigma_es: { highest: stigmaTypes.stigma_es.highest, lowest: stigmaTypes.stigma_es.lowest },
        stigma_is: { highest: stigmaTypes.stigma_is.highest, lowest: stigmaTypes.stigma_is.lowest },
      });
      setLoading(false);
    };

    calculateExtremes();
  }, [patients, currentLocationUuid, startDate, endDate, allPatients]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading intersectional stigma data...</p>
      </div>
    );
  }

  if (!intersectionalData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>No intersectional stigma data available</p>
      </div>
    );
  }

  const stigmaLabels = {
    stigma_as: 'Anticipated Stigma (AS)',
    stigma_es: 'Enacted Stigma (ES)',
    stigma_is: 'Internalized Stigma (IS)',
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(191, 188, 188, 0.1)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <h3
        style={{
          margin: '0 0 1.5rem 0',
          color: '#1e3a8a',
          fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
          textAlign: 'center',
        }}
      >
        Intersectional
      </h3>

      {/* Bar Chart Visualization - Full Width */}
      <div
        style={{
          height: window.innerWidth <= 480 ? '320px' : window.innerWidth <= 768 ? '380px' : '420px',
          width: '100%',
          position: 'relative',
        }}
      >
        <Chart
          type="bar"
          data={{
            labels: ['Anticipated Stigma (AS)', 'Enacted Stigma (ES)', 'Internalized Stigma (IS)'],
            datasets: [
              {
                label: 'Max Score',
                data: [
                  intersectionalData.stigma_as.highest?.score || 0,
                  intersectionalData.stigma_es.highest?.score || 0,
                  intersectionalData.stigma_is.highest?.score || 0,
                ],
                backgroundColor: 'rgba(220, 38, 38, 0.8)',
                borderColor: 'rgba(220, 38, 38, 1)',
                borderWidth: 2,
                borderRadius: 4,
              },
              {
                label: 'Min Score',
                data: [
                  intersectionalData.stigma_as.lowest?.score || 0,
                  intersectionalData.stigma_es.lowest?.score || 0,
                  intersectionalData.stigma_is.lowest?.score || 0,
                ],
                backgroundColor: 'rgba(79, 195, 247, 0.8)',
                borderColor: 'rgba(79, 195, 247, 1)',
                borderWidth: 2,
                borderRadius: 4,
              },
            ],
          }}
          plugins={[
            {
              id: 'datalabels-intersectional',
              afterDatasetsDraw: function (chart: any) {
                const ctx = chart.ctx;
                ctx.save();
                const fontSize = window.innerWidth <= 480 ? 11 : window.innerWidth <= 768 ? 14 : 16;
                ctx.font = `bold ${fontSize}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillStyle = '#333';
                chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
                  const meta = chart.getDatasetMeta(datasetIndex);
                  meta.data.forEach((bar: any, index: number) => {
                    const value = dataset.data[index];
                    ctx.fillText(value, bar.x, bar.y - 8);
                  });
                });
                ctx.restore();
              },
            },
          ]}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 35,
              },
            },
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  font: {
                    size: window.innerWidth <= 480 ? 11 : window.innerWidth <= 768 ? 13 : 15,
                    weight: 600,
                  },
                  padding: window.innerWidth <= 480 ? 15 : window.innerWidth <= 768 ? 20 : 25,
                },
              },
              tooltip: {
                enabled: false,
              },
            },
            animation: {
              duration: 0,
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Stigma Score',
                  font: {
                    size: window.innerWidth <= 480 ? 10 : window.innerWidth <= 768 ? 12 : 14,
                    weight: 600,
                  },
                },
                ticks: {
                  font: {
                    size: window.innerWidth <= 480 ? 9 : window.innerWidth <= 768 ? 10 : 12,
                  },
                },
              },
              x: {
                ticks: {
                  font: {
                    size: window.innerWidth <= 480 ? 8 : window.innerWidth <= 768 ? 10 : 12,
                  },
                  maxRotation: window.innerWidth <= 480 ? 45 : 0,
                  minRotation: 0,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// Dimension Visualization Component with Min/Max for Anticipated, Enacted, Internalized
function DimensionVisualization({
  patients,
  currentLocationUuid,
  startDate,
  endDate,
}: {
  patients: any[];
  currentLocationUuid?: string;
  startDate?: string;
  endDate?: string;
}) {
  // Helper function to check if observation date is within range
  const isWithinDateRange = (obsDate: string | undefined): boolean => {
    if (!obsDate) return true;
    if (!startDate && !endDate) return true;

    const date = new Date(obsDate);
    if (startDate && date < new Date(startDate)) return false;
    if (endDate && date > new Date(endDate + 'T23:59:59')) return false;
    return true;
  };

  // Support anticipated and internalized dimensions
  // Separate keys and labels for anticipated and internalized
  const anticipatedKeys = ['hiv_domain_as', 'mh_domain_as', 'sgm_domain_as', 'em_domain_as'];
  const anticipatedLabels = ['HIV Domain (AS)', 'Mental Health Domain (AS)', 'SGM Domain (AS)', 'EM Domain (AS)'];
  const internalizedKeys = ['hiv_domain_is', 'mh_domain_is', 'sgm_domain_is', 'em_domain_is'];
  const internalizedLabels = ['HIV Domain (IS)', 'Mental Health Domain (IS)', 'SGM Domain (IS)', 'EM Domain (IS)'];

  // Exact observation UUIDs from stigma-data.resource.tsx
  const DIMENSION_UUIDS: Record<string, string> = {
    // Anticipated Stigma Domains
    hiv_domain_as: '90e0da1c-1bb4-48db-869e-d0ed4cd11c24',
    mh_domain_as: '8f94f4c3-58f2-414a-9286-68c5ede9c46e',
    sgm_domain_as: 'eb0a135d-3b90-470c-a684-d6dc3464712d',
    em_domain_as: 'd1ccc9dc-92fa-4118-af50-6394295131f8',
    // Internalized Stigma Domains
    hiv_domain_is: 'ea081a06-b663-40f0-b74c-ede85468ed89',
    mh_domain_is: 'ef14a69f-b4fa-4fcd-8699-6b827bb67525',
    sgm_domain_is: '79c9043f-3cb6-41b2-b189-6018cb9b2bde',
    em_domain_is: '373eca5f-bc30-4b5e-a799-c50931731209',
  };

  const dimensionScores: Record<string, number[]> = {
    hiv_domain_as: [],
    mh_domain_as: [],
    sgm_domain_as: [],
    em_domain_as: [],
    hiv_domain_is: [],
    mh_domain_is: [],
    sgm_domain_is: [],
    em_domain_is: [],
  };

  console.log('\n🔍 ===== ANTICIPATED & INTERNALIZED DIMENSION QA LOG START =====');
  console.log('Using EXACT observation UUIDs:');
  Object.entries(DIMENSION_UUIDS).forEach(([key, uuid]) => {
    console.log(`  ${key}: ${uuid}`);
  });

  patients.forEach((observations, patientIndex) => {
    if (!Array.isArray(observations)) return;

    // Filter by location first, then by date
    const locationFiltered = observations.filter((obs: any) => {
      const locationMatch = !currentLocationUuid || obs.locationUuid === currentLocationUuid;
      const dateMatch = isWithinDateRange(obs.effectiveDateTime || obs.date);
      return locationMatch && dateMatch;
    });

    // Check each dimension for this patient
    Object.entries(DIMENSION_UUIDS).forEach(([key, uuid]) => {
      const obs = locationFiltered.find(
        (o: any) => o.concept?.uuid === uuid || o.code?.coding?.some((c: any) => c.code === uuid),
      );

      if (obs) {
        const rawValue = obs.valueQuantity?.value ?? (obs.valueString ? Number(obs.valueString) : undefined);
        if (typeof rawValue === 'number' && !isNaN(rawValue)) {
          dimensionScores[key].push(rawValue);
          console.log(`📊 Patient ${patientIndex} | ${key}: ${rawValue}`);
        }
      }
    });
  });

  console.log('\n📈 DIMENSION FINAL RESULTS:');
  // Calculate stats for all dimensions
  const dimensionStats: Record<string, DimensionScoreData> = {};
  [...anticipatedKeys, ...internalizedKeys].forEach((key) => {
    dimensionStats[key] = calculateDimensionStats(dimensionScores[key]);
    console.log(
      `${key}: Max = ${dimensionStats[key].max}, Min = ${dimensionStats[key].min} (from ${dimensionStats[key].count} observations)`,
    );
  });
  console.log('🔍 ===== ANTICIPATED & INTERNALIZED DIMENSION QA LOG END =====\n');
  const [tab, setTab] = React.useState<'anticipated' | 'enacted' | 'internalized'>('anticipated');
  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => setTab('anticipated')}
          style={{
            padding: '0.5rem 1.2rem',
            borderRadius: 6,
            border: tab === 'anticipated' ? '2px solid #2563eb' : '1px solid #ccc',
            background: tab === 'anticipated' ? '#e0f2fe' : '#fff',
            color: tab === 'anticipated' ? '#2563eb' : '#333',
            fontWeight: tab === 'anticipated' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.2s',
          }}
        >
          Anticipated
        </button>
        <button
          onClick={() => setTab('enacted')}
          style={{
            padding: '0.5rem 1.2rem',
            borderRadius: 6,
            border: tab === 'enacted' ? '2px solid #dc2626' : '1px solid #ccc',
            background: tab === 'enacted' ? '#fee2e2' : '#fff',
            color: tab === 'enacted' ? '#dc2626' : '#333',
            fontWeight: tab === 'enacted' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.2s',
          }}
        >
          Enacted
        </button>
        <button
          onClick={() => setTab('internalized')}
          style={{
            padding: '0.5rem 1.2rem',
            borderRadius: 6,
            border: tab === 'internalized' ? '2px solid #a21caf' : '1px solid #ccc',
            background: tab === 'internalized' ? '#f3e8ff' : '#fff',
            color: tab === 'internalized' ? '#a21caf' : '#333',
            fontWeight: tab === 'internalized' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.2s',
          }}
        >
          Internalized
        </button>
      </div>
      {tab === 'anticipated' && (
        <>
          <h3
            style={{
              margin: '0 0 1.5rem 0',
              color: '#2563eb',
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
              textAlign: 'center',
            }}
          >
            Dimensional Anticipated
          </h3>
          <div
            style={{
              height: window.innerWidth <= 480 ? '320px' : window.innerWidth <= 768 ? '380px' : '420px',
              width: '100%',
              position: 'relative',
            }}
          >
            <Chart
              type="bar"
              data={{
                labels: anticipatedLabels,
                datasets: [
                  {
                    label: 'Max Score',
                    data: anticipatedKeys.map((key) => dimensionStats[key].max),
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 2,
                    borderRadius: 4,
                  },
                  {
                    label: 'Min Score',
                    data: anticipatedKeys.map((key) => dimensionStats[key].min),
                    backgroundColor: 'rgba(79, 195, 247, 0.8)',
                    borderColor: 'rgba(79, 195, 247, 1)',
                    borderWidth: 2,
                    borderRadius: 4,
                  },
                ],
              }}
              plugins={[
                {
                  id: 'datalabels-anticipated',
                  afterDatasetsDraw: function (chart: any) {
                    const ctx = chart.ctx;
                    ctx.save();
                    const fontSize = window.innerWidth <= 480 ? 11 : window.innerWidth <= 768 ? 14 : 16;
                    ctx.font = `bold ${fontSize}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillStyle = '#333';
                    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
                      const meta = chart.getDatasetMeta(datasetIndex);
                      meta.data.forEach((bar: any, index: number) => {
                        const value = dataset.data[index];
                        ctx.fillText(value, bar.x, bar.y - 8);
                      });
                    });
                    ctx.restore();
                  },
                },
              ]}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                  padding: {
                    top: 35,
                  },
                },
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      font: {
                        size: window.innerWidth <= 480 ? 11 : window.innerWidth <= 768 ? 13 : 15,
                        weight: 600,
                      },
                    },
                  },
                  tooltip: {
                    enabled: false,
                  },
                },
                animation: {
                  duration: 0,
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Score',
                      font: {
                        size: window.innerWidth <= 480 ? 10 : window.innerWidth <= 768 ? 12 : 14,
                        weight: 600,
                      },
                    },
                    ticks: {
                      font: {
                        size: window.innerWidth <= 480 ? 9 : window.innerWidth <= 768 ? 10 : 12,
                      },
                    },
                  },
                  x: {
                    ticks: {
                      font: {
                        size: window.innerWidth <= 480 ? 8 : window.innerWidth <= 768 ? 10 : 12,
                      },
                      maxRotation: window.innerWidth <= 480 ? 45 : 0,
                      minRotation: 0,
                    },
                  },
                },
              }}
            />
          </div>
        </>
      )}
      {tab === 'enacted' && (
        <EnactedDimensionVisualization
          patients={patients}
          currentLocationUuid={currentLocationUuid}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      {tab === 'internalized' && (
        <>
          <h3
            style={{
              margin: '0 0 1.5rem 0',
              color: '#a21caf',
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
              textAlign: 'center',
            }}
          >
            Dimensional Internalized
          </h3>
          <div
            style={{
              height: window.innerWidth <= 480 ? '320px' : window.innerWidth <= 768 ? '380px' : '420px',
              width: '100%',
              position: 'relative',
            }}
          >
            <Chart
              type="bar"
              data={{
                labels: internalizedLabels,
                datasets: [
                  {
                    label: 'Max Score',
                    data: internalizedKeys.map((key) => dimensionStats[key].max),
                    backgroundColor: 'rgba(162, 28, 175, 0.8)',
                    borderColor: 'rgba(162, 28, 175, 1)',
                    borderWidth: 2,
                    borderRadius: 4,
                  },
                  {
                    label: 'Min Score',
                    data: internalizedKeys.map((key) => dimensionStats[key].min),
                    backgroundColor: 'rgba(243, 232, 255, 0.9)',
                    borderColor: 'rgba(162, 28, 175, 0.5)',
                    borderWidth: 2,
                    borderRadius: 4,
                  },
                ],
              }}
              plugins={[
                {
                  id: 'datalabels-internalized',
                  afterDatasetsDraw: function (chart: any) {
                    const ctx = chart.ctx;
                    ctx.save();
                    const fontSize = window.innerWidth <= 480 ? 11 : window.innerWidth <= 768 ? 14 : 16;
                    ctx.font = `bold ${fontSize}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillStyle = '#333';
                    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
                      const meta = chart.getDatasetMeta(datasetIndex);
                      meta.data.forEach((bar: any, index: number) => {
                        const value = dataset.data[index];
                        ctx.fillText(value, bar.x, bar.y - 8);
                      });
                    });
                    ctx.restore();
                  },
                },
              ]}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                  padding: {
                    top: 35,
                  },
                },
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      font: {
                        size: window.innerWidth <= 480 ? 11 : window.innerWidth <= 768 ? 13 : 15,
                        weight: 600,
                      },
                    },
                  },
                  tooltip: {
                    enabled: false,
                  },
                },
                animation: {
                  duration: 0,
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Score',
                      font: {
                        size: window.innerWidth <= 480 ? 10 : window.innerWidth <= 768 ? 12 : 14,
                        weight: 600,
                      },
                    },
                    ticks: {
                      font: {
                        size: window.innerWidth <= 480 ? 9 : window.innerWidth <= 768 ? 10 : 12,
                      },
                    },
                  },
                  x: {
                    ticks: {
                      font: {
                        size: window.innerWidth <= 480 ? 8 : window.innerWidth <= 768 ? 10 : 12,
                      },
                      maxRotation: window.innerWidth <= 480 ? 45 : 0,
                      minRotation: 0,
                    },
                  },
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

// Sites Data Visualization Component
function SitesDataVisualization({
  patients,
  refreshTrigger = 0,
  onRefresh,
  startDate,
  endDate,
}: {
  patients: any[];
  refreshTrigger?: number;
  onRefresh?: () => void;
  startDate?: string;
  endDate?: string;
}) {
  const session = useSession();
  React.useEffect(() => {
    console.log('🏥 Current session data:', session);
  }, [session]);

  const defaultLocationUuid = session?.sessionLocation?.uuid;
  const defaultLocationName = session?.sessionLocation?.display;

  // Find the patient with identifier value "location" (shared across all sites)
  // Location-based filtering happens via obs.location.uuid, not via separate patients
  const locationPatient = React.useMemo(() => {
    if (!patients || patients.length === 0) return null;

    // Find patient whose identifier value is "location"
    const patient = patients.find((p) => {
      return p.identifier?.some((id: any) => id.value?.trim().toLowerCase() === 'location');
    });

    console.log('🔍 All patients count:', patients.length);
    console.log('🔍 Found location patient:', patient ? 'YES' : 'NO', patient);

    return patient;
  }, [patients]);

  const patientUuid = locationPatient?.uuid || locationPatient?.id || null;

  React.useEffect(() => {
    console.log('🔍 Selected patient for location:', {
      locationName: defaultLocationName,
      locationUuid: defaultLocationUuid,
      patientUuid: patientUuid,
      patientDisplay: locationPatient?.display || locationPatient?.person?.display,
      hasIdentifiers: !!locationPatient?.identifier,
    });
  }, [locationPatient, patientUuid, defaultLocationName, defaultLocationUuid]);

  const [sitesData, setSitesData] = React.useState<Record<string, any[]>>({});
  const [loading, setLoading] = React.useState(false);

  // Create concept-to-label mapping from conference form JSON
  const conceptLabelMap = React.useMemo(() => {
    const map: Record<string, string> = {};

    if (conferenceFormJson?.pages) {
      conferenceFormJson.pages.forEach((page: any) => {
        page.sections?.forEach((section: any) => {
          section.questions?.forEach((question: any) => {
            const concept = question.questionOptions?.concept;
            if (concept && question.label) {
              map[concept] = question.label;
            }

            // Also map answer concepts (for radio/checkbox values)
            question.questionOptions?.answers?.forEach((answer: any) => {
              if (answer.concept && answer.label) {
                map[answer.concept] = answer.label;
              }
            });
          });
        });
      });
    }

    return map;
  }, []);

  // Console log for debugging
  React.useEffect(() => {
    console.log('🏥 Sites Visualization - Using default location:', {
      uuid: defaultLocationUuid,
      name: defaultLocationName,
    });
  }, [defaultLocationUuid, defaultLocationName]);

  React.useEffect(() => {
    const fetchSitesData = async () => {
      // Use patientUuid for API request
      if (!patientUuid) {
        console.log('🚫 No patientUuid found, skipping fetch.');
        return;
      }
      setLoading(true);
      try {
        // Fetch ALL obs directly for this patient (includes existing + new data)
        // This matches how FormFillingInterface submits data: directly as obs
        let allObs: any[] = [];
        let startIndex = 0;
        const limit = 100;

        // Fetch all obs with pagination
        while (true) {
          const obsUrl = `/ws/rest/v1/obs?patient=${patientUuid}&v=full&limit=${limit}&startIndex=${startIndex}`;
          console.log('🔍 Fetching obs - Patient UUID:', patientUuid, 'startIndex:', startIndex);

          const obsResp = await openmrsFetch(obsUrl);
          const batch = obsResp.data?.results || [];
          allObs = allObs.concat(batch);

          if (batch.length < limit) break; // No more data
          startIndex += limit;
        }

        console.log('📊 Total obs fetched for location patient:', allObs.length);
        console.log('📊 Current location UUID for filtering:', defaultLocationUuid);
        console.log('📊 Current location name:', defaultLocationName);

        // Debug: Log first few obs locations
        if (allObs.length > 0) {
          console.log(
            '📊 Sample obs locations:',
            allObs.slice(0, 3).map((obs) => ({
              concept: obs.concept?.display,
              location: obs.location?.uuid,
              locationName: obs.location?.display,
            })),
          );
        }

        // Get all conference form concept UUIDs to filter relevant obs
        const conferenceConceptUuids = new Set<string>();
        if (conferenceFormJson?.pages) {
          conferenceFormJson.pages.forEach((page: any) => {
            page.sections?.forEach((section: any) => {
              section.questions?.forEach((question: any) => {
                const concept = question.questionOptions?.concept;
                if (concept) conferenceConceptUuids.add(concept);
              });
            });
          });
        }

        // Helper function to check if observation date is within range
        const isWithinDateRange = (obsDate: string | undefined): boolean => {
          if (!obsDate) return true;
          if (!startDate && !endDate) return true;

          const date = new Date(obsDate);
          if (startDate && date < new Date(startDate)) return false;
          if (endDate && date > new Date(endDate + 'T23:59:59')) return false;
          return true;
        };

        // Filter to only conference form related obs AND current location AND date range
        // This ensures Site A only sees Site A data, Site B only sees Site B data
        const conferenceObs =
          conferenceConceptUuids.size > 0
            ? allObs.filter((obs) => {
                const matchesConcept = conferenceConceptUuids.has(obs.concept?.uuid);
                const matchesLocation = obs.location?.uuid === defaultLocationUuid;
                const matchesDate = isWithinDateRange(obs.obsDatetime);

                // Debug logging for location mismatch
                if (matchesConcept && !matchesLocation) {
                  console.log('⚠️ Obs filtered out - wrong location:', {
                    concept: obs.concept?.display,
                    obsLocation: obs.location?.uuid,
                    obsLocationName: obs.location?.display,
                    expectedLocation: defaultLocationUuid,
                    expectedLocationName: defaultLocationName,
                  });
                }

                return matchesConcept && matchesLocation && matchesDate;
              })
            : allObs.filter((obs) => obs.location?.uuid === defaultLocationUuid && isWithinDateRange(obs.obsDatetime));

        console.log('✅ Conference form obs for current location (' + defaultLocationName + '):', conferenceObs.length);

        // Group obs by timestamp (precise to hour) to handle multiple submissions per day
        const submissionsByTimestamp: Record<string, any[]> = {};
        conferenceObs.forEach((obs: any) => {
          // Group by date + hour to separate different form submissions
          const timestamp = obs.obsDatetime ? new Date(obs.obsDatetime).toISOString().substring(0, 13) : 'unknown';
          if (!submissionsByTimestamp[timestamp]) {
            submissionsByTimestamp[timestamp] = [];
          }
          submissionsByTimestamp[timestamp].push(obs);
        });

        // Map submissions to table format
        const formData: any[] = Object.entries(submissionsByTimestamp).map(([timestamp, obsGroup]) => {
          const data: Record<string, any> = {};
          obsGroup.forEach((obs: any) => {
            const conceptId = obs.concept?.uuid || 'unknown-concept';
            const conceptLabel = conceptLabelMap[conceptId] || obs.concept?.display || conceptId;
            let value = obs.value;

            // Handle coded/display values
            if (obs.value?.display) {
              value = obs.value.display;
            }
            // Special handling for numeric radio button values from conference form
            else if (typeof obs.value === 'number') {
              // Convert numeric values back to readable labels for these specific radio concepts
              if (conceptId === '7189452b-be65-42aa-ad77-4861f7d07bae') {
                // Question 2: "यस बैठकमा, लान्छना सम्बन्धि  कुनै नयाँ गतिविधिहरु कार्यान्वयन गर्नको लागि निर्णय गर्नुभयो?"
                value = obs.value === 1 ? 'गरियो (Yes)' : obs.value === 2 ? 'गरिएन (No)' : obs.value.toString();
              } else if (conceptId === '49b60881-a607-408d-89b4-f0c2105c1d96') {
                // Question 3: "अघिल्लो बैठकमा छलफल भएको कुनै गतिविधीहरु, गएको महिनामा प्रयोग गर्नुभयो?"
                value = obs.value === 1 ? 'भयो (Yes)' : obs.value === 2 ? 'भएन (No)' : obs.value.toString();
              } else {
                value = obs.value.toString();
              }
            } else if (typeof obs.value === 'string') {
              value = obs.value;
            }

            if (value !== undefined && value !== null && value !== '') {
              data[conceptLabel] = value;
            }
          });
          return {
            id: `submission-${timestamp}`,
            date: obsGroup[0]?.obsDatetime || new Date().toISOString(),
            siteId: defaultLocationUuid,
            data,
          };
        });

        // Sort by date (newest first)
        formData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        console.log('📊 Processed submissions:', formData.length);
        setSitesData({ [defaultLocationUuid]: formData });
      } catch (error) {
        console.error('❌ Error fetching sites data:', error);
        setSitesData({ [defaultLocationUuid]: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchSitesData();
  }, [defaultLocationUuid, refreshTrigger, patientUuid, conceptLabelMap, startDate, endDate]);

  const siteSubmissions = sitesData[defaultLocationUuid] || [];
  const selectedSiteName = defaultLocationName || 'Current Site';
  if (siteSubmissions.length === 0) {
    return <div>No submissions found for {selectedSiteName}</div>;
  }

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        maxHeight: '700px',
        overflowY: 'auto',
        width: '100%',
      }}
    >
      {/* Displaying data for logged-in user's default location */}
      {!defaultLocationUuid ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ff7875' }}>
          <p>⚠️ No default location found. Please ensure you are logged in with a valid session location.</p>
        </div>
      ) : (
        <>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}
          >
            <h3 style={{ margin: '0', color: '#1e3a8a', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {selectedSiteName} -
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                {loading ? 'Loading...' : `${siteSubmissions.length} submissions`}
              </span>
              <button
                onClick={onRefresh}
                disabled={loading}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: loading ? '#ccc' : '#0f62fe',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>⏳ Loading data for {selectedSiteName}...</p>
            </div>
          ) : siteSubmissions.length === 0 ? (
            <div
              style={{
                background: '#fff3cd',
                padding: '1rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                border: '1px solid #ffeaa7',
              }}
            ></div>
          ) : (
            <></>
          )}
        </>
      )}

      {/* Summary Stats */}
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f8ff', borderRadius: '6px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{siteSubmissions.length}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Submissions at {selectedSiteName}</div>
          </div>
        </div>
      </div>

      {/* Table View of Form Data */}
      {defaultLocationUuid && siteSubmissions.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h4
            style={{
              margin: '0 0 1rem 0',
              color: '#1e3a8a',
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            }}
          >
            {' '}
          </h4>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #e5e7eb',
                fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
                tableLayout: window.innerWidth <= 768 ? 'auto' : 'fixed',
                minWidth: '600px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#1e3a8a', color: '#fff' }}>
                  <th
                    style={{
                      padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                      textAlign: 'left',
                      borderBottom: '2px solid #1e3a8a',
                      width: window.innerWidth <= 768 ? 'auto' : '60px',
                      minWidth: '40px',
                    }}
                  >
                    No.
                  </th>
                  <th
                    style={{
                      padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                      textAlign: 'left',
                      borderBottom: '2px solid #1e3a8a',
                      width: window.innerWidth <= 768 ? 'auto' : '180px',
                      minWidth: '120px',
                    }}
                  >
                    Submission Date
                  </th>
                  <th
                    style={{
                      padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                      textAlign: 'left',
                      borderBottom: '2px solid #1e3a8a',
                      width: window.innerWidth <= 768 ? 'auto' : '120px',
                      minWidth: '80px',
                    }}
                  >
                    Site
                  </th>
                  <th
                    style={{
                      padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                      textAlign: 'left',
                      borderBottom: '2px solid #1e3a8a',
                      minWidth: '150px',
                    }}
                  >
                    Form Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {siteSubmissions.map((submission, index) => (
                  <tr
                    key={submission.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f9fafb' : '#fff',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    <td style={{ padding: '0.75rem', borderRight: '1px solid #e5e7eb', verticalAlign: 'top' }}>
                      {index + 1}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        borderRight: '1px solid #e5e7eb',
                        verticalAlign: 'top',
                        fontSize: '0.85rem',
                      }}
                    >
                      {new Date(submission.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        borderRight: '1px solid #e5e7eb',
                        fontWeight: 'bold',
                        verticalAlign: 'top',
                      }}
                    >
                      {selectedSiteName}
                    </td>
                    <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {(() => {
                          console.log('DEBUG submission.data:', submission.data);
                          return null;
                        })()}
                        {Object.keys(submission.data).length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {Object.entries(submission.data)
                              .filter(([key, value]: [string, any]) => {
                                // Hide date field and main radio questions
                                const hideKeys = [
                                  '१. बैठकको गठन गरेको  मिति',
                                  '२. यस बैठकमा, लान्छना सम्बन्धि  कुनै नयाँ गतिविधिहरु कार्यान्वयन गर्नको लागि निर्णय गर्नुभयो?',
                                  '३. अघिल्लो बैठकमा छलफल भएको कुनै गतिविधीहरु, गएको महिनामा प्रयोग गर्नुभयो?',
                                ];
                                return !hideKeys.includes(key.trim());
                              })
                              .map(([key, value]: [string, any]) => {
                                const fieldLabel = key;
                                const displayValue = value;
                                return (
                                  <div
                                    key={key}
                                    style={{
                                      fontSize: '0.85rem',
                                      borderBottom: '1px solid #f0f0f0',
                                      paddingBottom: '0.5rem',
                                    }}
                                  >
                                    <div
                                      style={{
                                        color: '#1e3a8a',
                                        fontWeight: 'bold',
                                        marginBottom: '0.3rem',
                                        fontSize: '0.9rem',
                                      }}
                                    >
                                      {fieldLabel}
                                    </div>
                                    <div style={{ color: '#374151', paddingLeft: '0.5rem', lineHeight: '1.4' }}>
                                      {typeof displayValue === 'object'
                                        ? JSON.stringify(displayValue)
                                        : String(displayValue)}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No data</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Form Filling Interface Component for Left Side
const FormFillingInterface = ({
  formUuid,
  patients,
  onSubmitSuccess,
}: {
  formUuid: string;
  patients: any[];
  onSubmitSuccess?: () => void;
}): JSX.Element => {
  // State to hold fetched obs for visualization
  const [patientObs, setPatientObs] = React.useState<any[]>([]);
  const session = useSession();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formSchema, setFormSchema] = React.useState<any>(null);
  const [formDefinition, setFormDefinition] = React.useState<any>(null);
  const [formData, setFormData] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    if (formUuid === '55b82773-3cd0-4813-a38e-9d0c1ea35e45') {
      setFormDefinition(conferenceFormJson);
    }
  }, [formUuid]);

  // State for conditional form logic
  const [conditionalValues, setConditionalValues] = React.useState<Record<string, any>>({
    decide_to_implement: null,
    implement_activity: null,
  });

  // Function to check if a field should be visible based on conditional logic
  const shouldShowField = (question: any) => {
    // Handle conditional fields for conference form
    if (question.id === 'decision_yes_specify') {
      return conditionalValues.decide_to_implement === '5f74c3b5-c1d0-4835-9bc2-7098cb711f99'; // गरियो
    }
    if (question.id === 'decision_no_specify') {
      return conditionalValues.decide_to_implement === 'f643d6d0-27e4-4ec2-be28-fb0a4a8019c9'; // गरिएन
    }
    if (question.id === 'implement_yes_specify') {
      return conditionalValues.implement_activity === '5f74c3b5-c1d0-4835-9bc2-7098cb711f99'; // भयो
    }
    if (question.id === 'implement_no_specify') {
      return conditionalValues.implement_activity === 'f643d6d0-27e4-4ec2-be28-fb0a4a8019c9'; // भएन
    }

    // Show all other fields by default
    return true;
  };

  // No location selection needed

  // Load form schema from OpenMRS
  // form containing the form's metadata and resources which include form name creator dates and array of resources related to form.

  // v1/clobdata/{uuid} fetch large data paylaods like form definitions stored as CLOBs in OpenMRS
  const loadFormSchema = React.useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('[DEBUG] Loading form schema for UUID:', formUuid);

      const formResponse = await fetch(`/openmrs/ws/rest/v1/form/${formUuid}?v=full`);
      console.log('[DEBUG] Form API response status:', formResponse.status);

      if (formResponse.ok) {
        const form = await formResponse.json();
        console.log('[DEBUG] Form schema loaded successfully:', form);
        setFormSchema(form);

        if (form.resources && form.resources.length > 0) {
          for (const resource of form.resources) {
            if (resource.name === 'JSON schema' && resource.valueReference) {
              console.log('[DEBUG] Found JSON schema resource, valueReference:', resource.valueReference);

              if (
                typeof resource.valueReference === 'string' &&
                resource.valueReference.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
              ) {
                try {
                  const resourceResponse = await fetch(`/openmrs/ws/rest/v1/clobdata/${resource.valueReference}`);
                  if (resourceResponse.ok) {
                    const resourceText = await resourceResponse.text();
                    console.log('[DEBUG] Resource content fetched:', resourceText);

                    try {
                      const parsedFormDefinition = JSON.parse(resourceText);
                      console.log('[DEBUG] Parsed form definition:', parsedFormDefinition);
                      setFormDefinition(parsedFormDefinition);
                      break;
                    } catch (parseError) {
                      console.error('[DEBUG] Error parsing resource content as JSON:', parseError);
                    }
                  } else {
                    console.error('[DEBUG] Failed to fetch resource content:', resourceResponse.status);
                  }
                } catch (fetchError) {
                  console.error('[DEBUG] Error fetching resource content:', fetchError);
                }
              } else {
                try {
                  const parsedFormDefinition = JSON.parse(resource.valueReference);
                  console.log('[DEBUG] Direct JSON parsing successful:', parsedFormDefinition);
                  setFormDefinition(parsedFormDefinition);
                  break;
                } catch (parseError) {
                  console.log('[DEBUG] Not direct JSON content, skipping...');
                }
              }
            }
          }
        }
      } else {
        const errorText = await formResponse.text();
        console.error('[DEBUG] Failed to load form schema:', formResponse.status, formResponse.statusText);
        console.error('[DEBUG] Error response:', errorText);

        const altResponse = await fetch(`/openmrs/ws/rest/v1/formresource?form=${formUuid}&v=full`);
        if (altResponse.ok) {
          const altForm = await altResponse.json();
          console.log('[DEBUG] Alternative form data:', altForm);
        }
      }
    } catch (error) {
      console.error('[DEBUG] Error loading form schema:', error);
    }
    setIsLoading(false); // Force loading to false in all cases
  }, [formUuid]);

  React.useEffect(() => {
    if (formUuid) {
      loadFormSchema();
    }
  }, [formUuid, loadFormSchema]);

  // No encounter logic needed

  const handleSubmit = async (e: React.FormEvent) => {
    // if (patients && patients.length > 0) {
    //   console.log('[DEBUG] first patient object:', patients[0]);
    // }
    e.preventDefault();
    try {
      // console.log('[DEBUG] handleSubmit called');
      e.preventDefault();
      // console.log('[DEBUG] Submit button clicked');
      // console.log('[DEBUG] formData keys:', Object.keys(formData));
      // console.log('[DEBUG] formData values:', formData);
      // console.log('[DEBUG] patients array:', patients);

      // ===== VALIDATION: Check if form has any data =====
      const hasAnyData =
        Object.keys(formData).length > 0 &&
        Object.values(formData).some((value) => {
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          return value !== null && value !== undefined && value !== '';
        });

      if (!hasAnyData) {
        showSnackbar({
          title: 'फारम रित्तो छ / Empty Form',
          kind: 'warning',
          subtitle: 'कृपया फारम भर्नुहोस्। सबै क्षेत्रहरू रित्तो छन्। / Please fill the form. All fields are empty.',
        });
        return;
      }

      // ===== VALIDATION: Check for required fields =====
      if (formDefinition && formDefinition.pages) {
        const emptyRequiredFields: string[] = [];

        formDefinition.pages.forEach((page: any) => {
          if (page.sections) {
            page.sections.forEach((section: any) => {
              if (section.questions) {
                section.questions.forEach((question: any) => {
                  // Check if field is required and should be shown
                  if (question.required && shouldShowField(question)) {
                    const value = formData[question.id];
                    const isEmpty =
                      value === undefined ||
                      value === null ||
                      value === '' ||
                      (Array.isArray(value) && value.length === 0);

                    if (isEmpty) {
                      emptyRequiredFields.push(question.label || question.id);
                    }
                  }
                });
              }
            });
          }
        });

        if (emptyRequiredFields.length > 0) {
          showSnackbar({
            title: 'आवश्यक क्षेत्रहरू छुटेका छन् / Required Fields Missing',
            kind: 'warning',
            subtitle: `कृपया यी क्षेत्रहरू भर्नुहोस्: ${emptyRequiredFields.join(', ')} / Please fill: ${emptyRequiredFields.join(', ')}`,
          });
          return;
        }
      }

      // Helper to find question by id in formDefinition
      function findQuestionById(formDef, questionId) {
        if (!formDef || !formDef.pages) return null;
        for (const page of formDef.pages) {
          if (!page.sections) continue;
          for (const section of page.sections) {
            if (!section.questions) continue;
            for (const question of section.questions) {
              if (question.id === questionId) return question;
            }
          }
        }
        return null;
      }

      // Build obsArray using question.id → concept UUID mapping, and map value type
      const skippedFields: string[] = [];
      // List all possible Yes/No UUIDs used in radio answers
      const YES_UUIDS = [
        '5f74c3b5-c1d0-4835-9bc2-7098cb711f99', // Yes
        'f643d6d0-27e4-4ec2-be28-fb0a4a8019c9', // No (sometimes used as Yes in some forms)
        'e2b7e5e2-1e4e-4e7a-9e2e-2e2e2e2e2e2e', // No (alternate)
      ];
      const NO_UUIDS = [
        'f643d6d0-27e4-4ec2-be28-fb0a4a8019c9', // No
        'e2b7e5e2-1e4e-4e7a-9e2e-2e2e2e2e2e2e', // No (alternate)
      ];
      const obsArray = Object.entries(formData)
        .map(([questionId, value]) => {
          const question = findQuestionById(formDefinition, questionId);
          const rendering = question?.questionOptions?.rendering;
          const concept = question?.questionOptions?.concept;
          const datatype = question?.questionOptions?.datatype;
          const allowDecimal = question?.questionOptions?.allowDecimal;
          let mappedValue = value;
          let valid = true;
          let reason = '';

          console.log(`🔍 Processing field: ${questionId}`, {
            value,
            rendering,
            concept,
            datatype,
          });

          // Strict radio mapping: must match concept UUID
          if (rendering === 'radio' && question?.questionOptions?.answers) {
            const answerObj = question.questionOptions.answers.find(
              (ans: any) => ans.label === value || ans.concept === value,
            );
            if (answerObj) {
              mappedValue = answerObj.concept;
              console.log(`✅ Radio matched:`, { questionId, mappedValue, concept, answerObj });

              // IMMEDIATE conversion for numeric radio concepts
              // These conference form concepts are Numeric type in OpenMRS database
              if (
                concept === '7189452b-be65-42aa-ad77-4861f7d07bae' ||
                concept === '49b60881-a607-408d-89b4-f0c2105c1d96'
              ) {
                console.log(`🔢 Converting radio UUID to numeric for concept ${concept}`);

                // Map answer concept UUIDs to their numeric values from the form definition
                if (mappedValue === '5f74c3b5-c1d0-4835-9bc2-7098cb711f99') {
                  // "गरियो" / "भयो" (Yes) - answer value = 1
                  mappedValue = 1;
                  console.log(`✅ Converted '5f74c3b5...' (Yes) → 1`);
                } else if (mappedValue === 'f643d6d0-27e4-4ec2-be28-fb0a4a8019c9') {
                  // "गरिएन" / "भएन" (No) - answer value = 2
                  mappedValue = 2;
                  console.log(`✅ Converted 'f643d6d0...' (No) → 2`);
                } else {
                  valid = false;
                  reason = `Unknown radio answer UUID for numeric concept: ${mappedValue}`;
                  console.log(`❌ ${reason}`);
                }
              }
            } else {
              valid = false;
              reason = 'Radio answer not mapped to concept UUID';
              console.log(`❌ Radio NOT matched:`, {
                questionId,
                value,
                availableAnswers: question.questionOptions.answers,
              });
            }
          }

          // For numeric concepts, convert Yes/No UUIDs to 1/0, only allow integers if allowDecimal is false
          if ((rendering === 'number' || datatype === 'Numeric') && concept) {
            if (
              concept === '7189452b-be65-42aa-ad77-4861f7d07bae' ||
              concept === '49b60881-a607-408d-89b4-f0c2105c1d96'
            ) {
              if (YES_UUIDS.includes(mappedValue)) mappedValue = 1;
              else if (NO_UUIDS.includes(mappedValue)) mappedValue = 0;
            }
            if (allowDecimal === false || allowDecimal === 'No') {
              if (typeof mappedValue === 'string') {
                if (mappedValue.trim().toLowerCase() === 'yes') mappedValue = 1;
                else if (mappedValue.trim().toLowerCase() === 'no') mappedValue = 0;
                else if (/^\d+$/.test(mappedValue.trim())) mappedValue = parseInt(mappedValue.trim(), 10);
                else {
                  valid = false;
                  reason = 'Value is not integer for numeric concept';
                }
              } else if (Number.isInteger(mappedValue)) {
                // already integer
              } else {
                valid = false;
                reason = 'Value is not integer for numeric concept';
              }
              if (!valid || !Number.isInteger(mappedValue)) {
                valid = false;
                reason = 'Final check failed: value is not integer for numeric concept';
              }
            } else {
              mappedValue = Number(mappedValue);
              if (isNaN(mappedValue)) {
                valid = false;
                reason = 'Value is not a valid number for numeric concept';
              }
            }
          }
          // Strict date mapping
          if (rendering === 'date' || datatype === 'Date') {
            if (!mappedValue || isNaN(Date.parse(mappedValue))) {
              valid = false;
              reason = 'Value is not a valid date';
            }
          }

          // Strict text/textarea mapping
          if (
            (rendering === 'text' || rendering === 'textarea' || datatype === 'Text') &&
            typeof mappedValue !== 'string'
          ) {
            valid = false;
            reason = 'Value is not a valid string';
          }

          // Concept UUID must exist
          if (!concept) {
            valid = false;
            reason = 'Missing concept UUID';
          }
          if (!valid) {
            skippedFields.push(`${question?.label || questionId}: ${reason}`);
            return null;
          }
          return {
            concept,
            value: mappedValue,
            obsDatetime: new Date().toISOString(),
          };
        })
        .filter((o) => o && o.concept && o.value !== undefined && o.value !== null && o.value !== '');

      // console.log('[DEBUG] OBS Array:', obsArray);

      if (obsArray.length === 0) {
        // console.log('[DEBUG] Branch: No observations, showing warning snackbar');
        showSnackbar({
          title: 'Warning',
          kind: 'warning',
          subtitle: 'No valid observations detected. Make sure all fields have valid values and concept UUIDs.',
        });
        return;
      }

      const currentLocationUuid = session?.sessionLocation?.uuid;
      const currentLocationName = session?.sessionLocation?.display;

      const patient =
        patients && patients.length > 0
          ? patients.find((p) => {
              const hasLocationIdentifier = p.identifier?.some(
                (id: any) => id.value?.trim().toLowerCase() === 'location',
              );
              // For now, match by identifier "location" only
              // In the future, you can add location-specific matching here
              return hasLocationIdentifier;
            })
          : null;

      if (!patient || !patient.id) {
        showSnackbar({
          title: 'त्रुटि / Error',
          kind: 'error',
          subtitle: 'No patient found with identifier value "location" for current site. Cannot submit form.',
        });
        return;
      }

      console.log('📝 Submitting form for location:', currentLocationName, 'using patient:', patient.id);
      // Fetch obs for patient after submission
      try {
        const obsResponse = await openmrsFetch(`/ws/rest/v1/obs?person=${patient.id}`);
        if (obsResponse && obsResponse.data && Array.isArray(obsResponse.data.results)) {
          setPatientObs(obsResponse.data.results);
        } else {
          setPatientObs([]);
        }
      } catch (err) {
        setPatientObs([]);
      }
      // Submit each observation directly to /ws/rest/v1/obs
      const locationUuid = session?.sessionLocation?.uuid;
      let allSuccess = true;
      let errorMessages = [];
      for (const obs of obsArray) {
        const obsPayload = {
          person: patient.id,
          concept: obs.concept,
          value: obs.value,
          obsDatetime: obs.obsDatetime,
          location: locationUuid,
        };

        console.log('[DEBUG] Obs payload to submit:', obsPayload);
        // console.log('[DEBUG] Obs payload to submit:', obsPayload);
        // console.log('[DEBUG] openmrsFetch obs response:', obsResponse);
        let response;
        try {
          response = await openmrsFetch('/ws/rest/v1/obs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(obsPayload),
          });
          console.log('[DEBUG] openmrsFetch obs response:', response);
          if (!(response && (response.status === 200 || response.status === 201))) {
            allSuccess = false;
            let errorText = 'Unknown error';
            if (response.data && response.data.error) {
              errorText = response.data.error;
            } else if (response.data) {
              errorText = JSON.stringify(response.data);
            }
            errorMessages.push(errorText);
            showSnackbar({
              title: 'Observation Error',
              kind: 'error',
              subtitle: `Obs for concept ${obs.concept} failed: ${errorText}`,
            });
          }
        } catch (err) {
          allSuccess = false;
          errorMessages.push(String(err));
          showSnackbar({
            title: 'Observation Error',
            kind: 'error',
            subtitle: `Obs for concept ${obs.concept} failed: ${String(err)}`,
          });
        }
      }
      if (allSuccess) {
        showSnackbar({
          title: 'फारम सफल / Form Success',
          kind: 'success',
          subtitle: 'फारम सफलतापूर्वक पेश गरियो! All observations submitted successfully!',
        });
        setFormData({});

        // Trigger SitesDataVisualization refresh after successful submission
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        showSnackbar({
          title: 'त्रुटि / Error',
          kind: 'error',
          subtitle: 'Some observations failed: ' + errorMessages.join('; '),
        });
      }
    } catch (e) {
      console.error('[DEBUG] Exception in handleSubmit (outer):', e);
      showSnackbar({
        title: 'त्रुटि / Error',
        kind: 'error',
        subtitle: 'फारम पेश गर्दा त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्। Error submitting form. Please try again.',
      });
    }
  };

  return (
    <div style={{ minHeight: '300px', background: '#f9f9f9', padding: '1rem' }}>
      {/* Visualization: Show obs in table if available */}
      {patientObs && patientObs.length > 0 && (
        <div
          style={{
            margin: '1rem 0',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px #eee',
            padding: '1rem',
          }}
        >
          <h5
            style={{
              color: '#1890ff',
              marginBottom: '1rem',
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            }}
          >
            Submitted Observations
          </h5>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                minWidth: '300px',
              }}
            >
              <thead>
                <tr style={{ background: '#f6fbff' }}>
                  <th
                    style={{
                      border: '1px solid #e6f7ff',
                      padding: 'clamp(0.3rem, 1.5vw, 0.5rem)',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    }}
                  >
                    Concept
                  </th>
                  <th
                    style={{
                      border: '1px solid #e6f7ff',
                      padding: 'clamp(0.3rem, 1.5vw, 0.5rem)',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    }}
                  >
                    Value
                  </th>
                  <th
                    style={{
                      border: '1px solid #e6f7ff',
                      padding: 'clamp(0.3rem, 1.5vw, 0.5rem)',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    }}
                  >
                    Datetime
                  </th>
                </tr>
              </thead>
              <tbody>
                {patientObs.map((obs) => (
                  <tr key={obs.uuid}>
                    <td
                      style={{
                        border: '1px solid #e6f7ff',
                        padding: 'clamp(0.3rem, 1.5vw, 0.5rem)',
                        wordBreak: 'break-word',
                      }}
                    >
                      {obs.concept?.display || obs.concept?.uuid}
                    </td>
                    <td
                      style={{
                        border: '1px solid #e6f7ff',
                        padding: 'clamp(0.3rem, 1.5vw, 0.5rem)',
                        wordBreak: 'break-word',
                      }}
                    >
                      {obs.value}
                    </td>
                    <td
                      style={{
                        border: '1px solid #e6f7ff',
                        padding: 'clamp(0.3rem, 1.5vw, 0.5rem)',
                        wordBreak: 'break-word',
                        fontSize: 'clamp(0.65rem, 1.8vw, 0.875rem)',
                      }}
                    >
                      {obs.obsDatetime ? new Date(obs.obsDatetime).toLocaleString() : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <h4 style={{ margin: '0 0 1rem 0', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
        Conference Form{' '}
        <span style={{ fontSize: '0.85em', color: '#888', fontWeight: 'normal', marginLeft: '0.5rem' }}>
          ({session?.sessionLocation?.display || 'Unknown Location'})
        </span>
      </h4>
      {/* Form Interface */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading form...</p>
        </div>
      ) : formSchema ? (
        <form onSubmit={handleSubmit}>
          <div
            style={{
              border: '1px solid #e6f7ff',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: '#f6fbff',
              marginBottom: '1rem',
            }}
          >
            <h5 style={{ margin: '0 0 1rem 0', color: '#1890ff' }}>{formSchema.display || 'Form'}</h5>
            {/* <p style={{ fontSize: '0.9em', color: '#666', margin: '0 0 1rem 0' }}>Form UUID: {formUuid}</p> */}

            {/* Dynamic form fields based on form definition */}
            {formDefinition && formDefinition.pages ? (
              formDefinition.pages.map((page: any, pageIndex: number) => (
                <div key={`page-${pageIndex}`} style={{ marginBottom: '1rem' }}>
                  <h6 style={{ margin: '0 0 1rem 0', color: '#1890ff' }}>{page.label}</h6>
                  {page.sections &&
                    page.sections.map((section: any, sectionIndex: number) => (
                      <div key={`section-${sectionIndex}`} style={{ marginBottom: '1rem' }}>
                        <h6 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{section.label}</h6>
                        {section.questions &&
                          section.questions
                            .filter((question: any) => shouldShowField(question))
                            .map((question: any, questionIndex: number) => (
                              <div key={`question-${questionIndex}`} style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                  {question.label || question.id}:
                                </label>

                                {/* DEBUG: Log question details (no output in JSX) */}
                                {(() => {
                                  // console.log('🔍 QUESTION DEBUG:', {
                                  //   id: question.id,
                                  //   label: question.label,
                                  //   rendering: question.questionOptions?.rendering,
                                  //   concept: question.questionOptions?.concept,
                                  //   readonly: question.readonly,
                                  //   shouldShow: shouldShowField(question),
                                  //   conditionalValues: conditionalValues,
                                  // });

                                  // Special debug for the date field
                                  if (question.id === 'num_conference') {
                                    // console.log('📅 DATE FIELD DETECTED:', {
                                    //   rendering: question.questionOptions?.rendering,
                                    //   shouldRenderAsDate: question.questionOptions?.rendering === 'date',
                                    //   datePickerFormat: question.datePickerFormat,
                                    //   questionObject: question,
                                    // });
                                  }

                                  return null;
                                })()}

                                {/* Render different input types based on question type */}
                                {question.questionOptions?.rendering === 'textarea' ? (
                                  <textarea
                                    value={formData[question.id] || ''}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        [question.id]: e.target.value,
                                      })
                                    }
                                    rows={question.questionOptions?.rows || 4}
                                    // placeholder={`${question.label || question.id}...`}
                                    style={{
                                      width: '100%',
                                      padding: 'clamp(0.4rem, 1.5vw, 0.5rem)',
                                      border: '1px solid #ccc',
                                      borderRadius: '4px',
                                      resize: 'vertical',
                                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                      boxSizing: 'border-box',
                                    }}
                                  />
                                ) : question.questionOptions?.rendering === 'checkbox' ? (
                                  <div>
                                    {question.questionOptions.answers &&
                                      question.questionOptions.answers.map((answer: any, answerIndex: number) => (
                                        <label key={answerIndex} style={{ display: 'block', marginBottom: '0.3rem' }}>
                                          <input
                                            type="checkbox"
                                            checked={formData[question.id]?.includes(answer.concept) || false}
                                            onChange={(e) => {
                                              const currentValues = formData[question.id] || [];
                                              const newValues = e.target.checked
                                                ? [...currentValues, answer.concept]
                                                : currentValues.filter((v: string) => v !== answer.concept);
                                              setFormData({
                                                ...formData,
                                                [question.id]: newValues,
                                              });
                                            }}
                                            style={{ marginRight: '0.5rem' }}
                                          />
                                          {answer.label}
                                        </label>
                                      ))}
                                  </div>
                                ) : question.questionOptions?.rendering === 'date' ? (
                                  <input
                                    type="date"
                                    value={formData[question.id] || ''}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        [question.id]: e.target.value,
                                      })
                                    }
                                    style={{
                                      width: '100%',
                                      padding: 'clamp(0.4rem, 1.5vw, 0.5rem)',
                                      border: '1px solid #ccc',
                                      borderRadius: '4px',
                                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                      boxSizing: 'border-box',
                                    }}
                                  />
                                ) : question.questionOptions?.rendering === 'radio' ? (
                                  <div>
                                    {question.questionOptions.answers &&
                                      question.questionOptions.answers.map((answer: any, answerIndex: number) => (
                                        <label
                                          key={answerIndex}
                                          style={{
                                            display: 'block',
                                            marginBottom: '0.3rem',
                                            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                          }}
                                        >
                                          <input
                                            type="radio"
                                            name={question.id}
                                            value={answer.concept}
                                            checked={formData[question.id] === answer.concept}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setFormData({
                                                ...formData,
                                                [question.id]: value,
                                              });
                                              // Update conditional values for radio buttons
                                              if (question.id === 'decide_to_implement') {
                                                setConditionalValues({
                                                  ...conditionalValues,
                                                  decide_to_implement: value,
                                                });
                                              }
                                              if (question.id === 'implement_activity') {
                                                setConditionalValues({
                                                  ...conditionalValues,
                                                  implement_activity: value,
                                                });
                                              }
                                            }}
                                            style={{ marginRight: '0.5rem' }}
                                          />
                                          {answer.label}
                                        </label>
                                      ))}
                                  </div>
                                ) : question.questionOptions?.rendering === 'text' &&
                                  question.readonly &&
                                  question.id !== 'prompt_conference' ? (
                                  <div
                                    style={{
                                      padding: '0.5rem',
                                      background: '#f5f5f5',
                                      borderRadius: '4px',
                                      fontStyle: 'italic',
                                      color: '#1890ff',
                                    }}
                                  >
                                    {question.label}
                                  </div>
                                ) : null}
                              </div>
                            ))}
                      </div>
                    ))}
                </div>
              ))
            ) : formSchema ? (
              <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '4px', marginBottom: '1rem' }}>
                <p style={{ margin: 0, color: '#856404' }}>
                  Form schema loaded but form definition is being fetched. Please wait...
                </p>
              </div>
            ) : (
              // Fallback simple form if no proper form schema found
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Notes:</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="counseling notes..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '0.5rem',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Session Date:</label>
                  <input
                    type="date"
                    value={formData.sessionDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: 'clamp(0.65rem, 2vw, 0.75rem)',
              backgroundColor: !isLoading ? '#056b2cff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              fontWeight: 'bold',
              cursor: !isLoading ? 'pointer' : 'not-allowed',
              boxSizing: 'border-box',
            }}
          >
            {isLoading ? 'Submitting...' : 'बुझाउनुहोस्'}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>Unable to load form. Please check the form UUID.</p>
        </div>
      )}
    </div>
  );
};

export { FormFillingInterface };

function setLocationPatientUuid(uuid: any) {
  throw new Error('Function not implemented.');
}
