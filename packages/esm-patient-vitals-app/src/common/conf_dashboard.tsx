// Utility: Get or create a location patient for the current session location
// Remove any top-level hook calls. All hooks must be inside a function component.
// ...existing code...
// Enacted Dimension Visualization Component
function EnactedDimensionVisualization({ patients }: { patients: any[] }) {
  const dimensionKeys = ['hiv_domain_es', 'mh_domain_es', 'sgm_domain_es', 'em_domain_es'];
  const chartLabels = ['HIV Domain (ES)', 'Mental Health Domain (ES)', 'SGM Domain (ES)', 'EM Domain (ES)'];
  const dimensionScores: Record<string, number[]> = {
    hiv_domain_es: [],
    mh_domain_es: [],
    sgm_domain_es: [],
    em_domain_es: [],
  };
  // Updated mapping to match actual code.text values found in debug logs
  const codeToDimensionKey: Record<string, string> = {
    // HIV Domain
    'HIV Impact Rating': 'hiv_domain_es',
    'HIV domain total score- Enacted stigma': 'hiv_domain_es',
    'HIV domain total score-Enacted stigma': 'hiv_domain_es',
    // Mental Health Domain
    'Mental Health Impact Rating': 'mh_domain_es',
    'Mental health domain score- Enacted stigma': 'mh_domain_es',
    'Mental health domain total score - Enacted stigma': 'mh_domain_es',
    'Mental health domain total score-Enacted stigma': 'mh_domain_es',
    // SGM Domain
    'Sexual and Gender Minorities Impact Rating': 'sgm_domain_es',
    'Sexual and Gender Minorities domain total score-Enacted stigma': 'sgm_domain_es',
    'Sexual and Gender Minorities domain score-Enacted stigma': 'sgm_domain_es',
    'Sexual and Gender Minorities  domain score- Enacted stigma': 'sgm_domain_es',
    // EM Domain
    'Ethnic Minorities Impact Rating': 'em_domain_es',
    'Ethnic Minorities domain score-Enacted stigma': 'em_domain_es',
    'Ethnic Minorities domain total score-Enacted stigma': 'em_domain_es',
    'Ethnic Minorities domain score- Enacted stigma score': 'em_domain_es',
  };
  patients.forEach((observations) => {
    if (!Array.isArray(observations)) return;
    observations.forEach((obs: any) => {
      const codeText = obs.code?.text?.trim() || '';
      let key = codeToDimensionKey[codeText];
      if (!key) {
        // Fallback: fuzzy match using includes
        for (const mapText in codeToDimensionKey) {
          if (codeText.includes(mapText)) {
            key = codeToDimensionKey[mapText];
            // console.log('ENACTED FUZZY MAT
            // CH:', codeText, '->', mapText, '->', key);
            break;
          }
        }
      }
      if (!key) {
        // console.log('ENACTED SKIPPED:', codeText);
        return;
      }
      const rawValue = obs.valueQuantity?.value ?? (obs.valueString ? Number(obs.valueString) : undefined);
      if (typeof rawValue === 'number' && !isNaN(rawValue)) {
        dimensionScores[key].push(rawValue);
        // console.log('ENACTED MATCH', key, rawValue);
      } else {
        // console.log('ENACTED VALUE SKIPPED:', codeText, rawValue);
      }
    });
  });

  const maxDimensions: Record<string, number> = {};
  dimensionKeys.forEach((key) => {
    maxDimensions[key] = dimensionScores[key].length > 0 ? Math.max(...dimensionScores[key]) : 0;
  });
  const chartData = dimensionKeys.map((key) => maxDimensions[key]);
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
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e3a8a', fontSize: '1.3rem' }}>Enacted Dimension Analysis</h3>
      {/* <div style={{ marginBottom: '2rem' }}>
        <strong>Max Enacted Dimension Scores:</strong>
        <ul>
          {dimensionKeys.map((key, idx) => (
            <li key={key}>
              {chartLabels[idx]}: <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{maxDimensions[key]}</span>
            </li>
          ))}
        </ul>
      </div> */}
      <Chart
        type="bar"
        data={{
          labels: chartLabels,
          datasets: [
            {
              label: 'Max Score',
              data: chartData,
              backgroundColor: [
                'rgba(220, 38, 38, 0.7)',
                'rgba(251, 191, 36, 0.7)',
                'rgba(34, 197, 94, 0.7)',
                'rgba(139, 92, 246, 0.7)',
              ],
              borderColor: [
                'rgba(220, 38, 38, 1)',
                'rgba(251, 191, 36, 1)',
                'rgba(34, 197, 94, 1)',
                'rgba(139, 92, 246, 1)',
              ],
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function (context: any) {
                  return `Max Score: ${context.parsed.y}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Max Score',
                font: { size: 14, weight: 600 },
              },
              ticks: { font: { size: 12 } },
            },
            x: {
              ticks: { font: { size: 12 } },
            },
          },
        }}
      />
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
async function fetchPatientStigmaData(patientId: string, locationUuid?: string) {
  try {
    const url = `${fhirBaseUrl}/Observation?subject=${patientId}&_count=100`;
    const { data } = await openmrsFetch(url);
    if (!data?.entry) return [];

    let observations = data.entry.map((e: any) => e.resource);

    if (locationUuid) {
      observations = observations.filter((obs: any) => {
        const obsLocation = obs.location?.reference?.split('/')?.pop() || obs.location?.uuid || obs.location?.id;
        return obsLocation === locationUuid;
      });
    }

    return observations;
  } catch (error) {
    // console.error(`Error fetching stigma data for patient ${patientId}:`, error);
    return [];
  }
}

// MonthlyBarChart is now imported from './monthly-bar-chart' to keep a single responsive implementation.

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
  const [vizType, setVizType] = useState<
    'summary' | 'monthly' | 'custom1' | 'custom2' | 'stgtype' | 'Sites' | 'Intersectional' | 'Dimension'
  >('summary');

  // Add refreshTrigger state for SitesDataVisualization
  const [sitesRefreshTrigger, setSitesRefreshTrigger] = React.useState(0);
  const handleSitesRefresh = () => setSitesRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!patients?.length) return;

    // Fetch patient data with location filter
    Promise.all(patients.map((p) => fetchPatientStigmaData(p.id, currentLocationUuid))).then((results) => {
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
    // console.log('All Patients Data (debug):', allPatientsData);
    if (!allPatientsData || allPatientsData.length === 0) {
      // console.log('No patient observations loaded yet (allPatientsData is empty)');
      return;
    }
    const summary: Record<string, number> = { आत्मलान्छना: 0, 'अपेक्षित लान्छना': 0, 'व्यावहारिक लान्छना': 0 };
    allPatientsData.forEach((patientObs) => {
      patientObs.forEach((obs: any) => {
        const raw = (obs.stigmaType || obs.code?.coding?.[0]?.display || obs.code?.text || '').toString();
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
    // console.log('Stigma Type Summary (debug):', summary);
  }, [vizType, allPatientsData]);

  // When selecting ART ID the ArtIdPanel will be shown by the conditional render below

  // Test function to analyze stigma data
  function testStigmaAnalysis(patientData: any[]) {
    let totalPatients = 0;
    let matchedPatients = 0;
    let unmatchedPatients = 0;
    const patientMatches: Record<
      string,
      { matched: boolean; highestScores: { type: string; score: number; threshold: number }[] }
    > = {};

    patientData.forEach((observations, patientIndex) => {
      const patientId = String(patientIndex);

      // Process observations to match CovidStigmaData format
      const stigmaData: CovidStigmaData[] = observations
        .filter((obs: any) =>
          // Filter only stigma-related observations
          obs.code?.coding?.some(
            (coding: any) =>
              coding.display?.toLowerCase().includes('stigma') || coding.code?.toLowerCase().includes('stigma'),
          ),
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
    // Run the test analysis when data is available
    if (allPatientsData.length > 0) {
      const analysisResult = testStigmaAnalysis(allPatientsData);
      //   console.log('Stigma Analysis Test Results:', analysisResult);
      return analysisResult;
    }
    return null;
  }, [allPatientsData]);

  return (
    <div
      style={{
        padding: '1rem',
        border: '2px solid #fafbfdff',
        margin: '1rem',
        backgroundColor: '#f0f8ff',
      }}
    >
      {/* Location Indicator */}
      <div
        style={{
          backgroundColor: '#fff',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', minHeight: '400px' }}>
        {/* Left side - Form Filling Interface */}
        <div
          style={{
            flex: '0 0 35%',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            backgroundColor: '#fff',
            minHeight: '300px',
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
        <div style={{ flex: '0 0 62%' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <label style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>Visualization: </label>
            <select
              value={vizType}
              onChange={(e) => setVizType(e.target.value as any)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#f8f8f8',
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
                padding: '1rem',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                width: '100%',
                minHeight: 300,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box',
              }}
            >
              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '1rem',
                }}
              >
                लान्छना विश्लेषण नतिजाहरू
              </h3>
              {stigmaCutoffSummary ? (
                <>
                  <div
                    style={{
                      maxWidth: '500px',
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
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              font: {
                                size: 14,
                                weight: 500,
                              },
                              padding: 20,
                            },
                          },
                          tooltip: {
                            titleFont: {
                              size: 14,
                              weight: 600,
                            },
                            bodyFont: {
                              size: 13,
                            },
                            callbacks: {
                              label: function (context) {
                                const total = stigmaCutoffSummary.totalPatients;
                                const value = context.raw as number;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${percentage}% (${value} बिरामीहरू)`;
                              },
                            },
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
              <div style={{ width: '100%', padding: 8 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <label style={{ color: '#444', fontSize: 14 }}>Start:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{ padding: '6px 8px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <label style={{ color: '#444', fontSize: 14 }}>End:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{ padding: '6px 8px' }}
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
                    style={{ padding: '6px 10px' }}
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                    }}
                    style={{ padding: '6px 10px' }}
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
                />
              </div>
            </div>
          )}

          {/* ART ID panel: enter ART ID to lookup patient and show participant + counselor forms */}
          {vizType === 'custom1' && <ArtIdPanel patients={patients} />}

          {vizType === 'stgtype' && (
            <StgTypeVisualization
              allPatientsData={allPatientsData}
              startDate={startDate || undefined}
              endDate={endDate || undefined}
            />
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
            <SitesDataVisualization
              patients={patients}
              refreshTrigger={sitesRefreshTrigger}
              onRefresh={handleSitesRefresh}
            />
          )}
          {vizType === 'Intersectional' && <IntersectionalStigmaVisualization patients={allPatientsData} />}
          {vizType === 'Dimension' && <DimensionVisualization patients={allPatientsData} />}
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
                      o संक्षेपमा कुरा राखेर थप सामना गर्ने तरिकाहरू बारे बताउनुहोस् ।
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
                    गतिविधी ३: एचआईभी संक्रमित व्यक्तिहरूलाई सपोर्ट ग्रुपसँग जोडिन सहयोग गर्नुहोस् ।
                  </h3>
                  <div style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
                    <p style={{ margin: '0.5rem 0' }}>
                      o एचआइभी संक्रमित व्यक्तिहरूलाई सपोर्ट ग्रुपमा रुचि छ कि छैन भन्ने बुझ्न खुला प्रश्नहरू सोध्नुहोस्
                      ।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o उनीहरुको सपोर्ट ग्रुपसँगको पहिलेका अनुभवहरू (सकारात्मक वा नकारात्मक) बारे छलफल गर्नुहोस् ।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o उपयुक्त सपोर्ट ग्रुपसँग कसरी जोडिन र सहयोग लिन सकिन्छ भन्ने कुरा थप्नुहोस्।
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o एचआइभी संक्रमित व्यक्तिहरूको रुचि भएमा, सपोर्ट ग्रुपहरूको बारेमा जानकारी दिनुहोस् र सम्पर्क गर्न
                      सहयोग गर्नुहोस् ।
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
                  <div style={{ marginLeft: '1rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', lineHeight: '1.6' }}>
                      <tbody>
                        <tr>
                          <td>१. ड्रप-इन सेन्टर</td>
                          <td>स्वतन्त्र पथ, बुटवल, रूपन्देही</td>
                          <td>msmgnepal@gmail.com, ०७१-५२४८६२</td>
                        </tr>
                        <tr>
                          <td>२. ड्रप-इन सेन्टर</td>
                          <td>मुर्ली बगैचा, वीरगञ्ज, पर्सा</td>
                          <td>parsachemsexdic@gmail.com, ०५१-५२८६०६</td>
                        </tr>
                        <tr>
                          <td>३. ड्रप-इन सेन्टर</td>
                          <td>नील सरस्वतीथान, खुरसानिटार, काठमाडौं</td>
                          <td>cruiseaids@gmail.com, ०१-४४२४०५२</td>
                        </tr>
                        <tr>
                          <td>४. एनएपि+एन</td>
                          <td>बालुवाटार, काठमाडौं</td>
                          <td>info@napn.org.np, ०१-४५२७४५९</td>
                        </tr>
                        <tr>
                          <td>५. एनएफडब्लुएलएचए</td>
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
                    <p style={{ margin: '0.5rem 0' }}>o लान्छनारहित सेवा दिन सहयोग हुने कार्यसूची तयार गर्नुहोस्。</p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o एआरटीका कर्मचारीहरूलाई नियमित रूपमा संवेदनशीलता सम्बन्धी तालिम प्रदान गर्नुहोस्。
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o प्रतीक्षा गर्ने ठाउँहरूमा लान्छना कम गर्न सहयोग हुने पोस्टर र सन्देशहरू टाँस्नुहोस्。
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>
                      o सबै कर्मचारीहरु, रिसेप्सन र प्रशासनसहित, लाई आदरपूर्वक र बिना भेदभाव सेवा प्रदान कसरी गर्ने
                      समन्धित तालिम दिनुहोस्。
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
function IntersectionalStigmaVisualization({ patients }: { patients: any[] }) {
  const [loading, setLoading] = React.useState(true);
  const [intersectionalData, setIntersectionalData] = React.useState<{
    stigma_as: { highest: any };
    stigma_es: { highest: any };
    stigma_is: { highest: any };
  } | null>(null);

  // Get access to all patients for ART ID lookup
  const { data } = useAllPatients();
  const allPatients = data?.patients || [];

  React.useEffect(() => {
    if (!patients || patients.length === 0) {
      // console.log('❌ No patients data available for Intersectional Stigma Analysis');
      setLoading(false);
      return;
    }

    // console.log('📊 Starting Int...');
    // console.log('Total patients to analyze:', patients.length);

    // Calculate highest for each intersectional stigma type
    const calculateExtremes = () => {
      const stigmaTypes = {
        stigma_as: { highest: null as any, highestScore: -Infinity },
        stigma_es: { highest: null as any, highestScore: -Infinity },
        stigma_is: { highest: null as any, highestScore: -Infinity },
      };

      let processedPatients = 0;
      let totalObservations = 0;

      patients.forEach((observations, patientIndex) => {
        if (!Array.isArray(observations) || observations.length === 0) return;

        // Filter stigma-related observations
        const stigmaData = observations.filter((obs: any) =>
          obs.code?.coding?.some(
            (coding: any) =>
              coding.display?.toLowerCase().includes('stigma') || coding.code?.toLowerCase().includes('stigma'),
          ),
        );

        if (stigmaData.length === 0) return;

        processedPatients++;
        totalObservations += stigmaData.length;

        // Process each stigma observation
        stigmaData.forEach((obs: any) => {
          const stigmaTypeRaw = obs.code?.coding?.[0]?.display || '';
          const stigmaType = stigmaTypeRaw.toLowerCase();
          const score = obs.valueQuantity?.value;
          const date = obs.effectiveDateTime || obs.date;

          // Must be numeric score and intersectional type
          if (typeof score !== 'number' || isNaN(score)) return;
          if (!stigmaType.includes('intersectional')) return;

          // console.log(`📋 Found intersectional: ${stigmaTypeRaw} = ${score} (Patient ${patientIndex})`);

          // Check Anticipated Intersectional Stigma
          if (stigmaType.includes('anticipated')) {
            const prevHighest = stigmaTypes.stigma_as.highestScore;
            if (score > stigmaTypes.stigma_as.highestScore) {
              stigmaTypes.stigma_as.highestScore = score;
              // Get ART ID from patient identifier
              const patient = allPatients[patientIndex];
              // Find ART ID, not OpenMRS ID
              const artIdObj = patient?.identifier?.find(
                (id: any) =>
                  (id.identifierType?.display === 'ART ID' ||
                    id.identifierType?.uuid === '9c257200-27e4-447b-b78f-b7778d27cf9f') &&
                  id.value,
              );
              const artId = artIdObj?.value || `ART ID ${patientIndex}`;
              const identifierType = artIdObj?.identifierType?.display || 'ART ID';
              stigmaTypes.stigma_as.highest = { stigmaType: stigmaTypeRaw, score, date, artId };
              // console.log(
              //   `🔴 New HIGHEST AS: ${score} (ART ID: ${artId}) - Previous highest was: ${prevHighest === -Infinity ? 'None' : prevHighest}`,
              // );
            } else {
              // console.log(
              //   `⚪ AS: ${score} (ART ID: ${allPatients[patientIndex]?.identifier?.find((id: any) => id.value)?.value}) - Not higher than current highest: ${prevHighest}`,
              // );
            }
          }

          // Check Enacted Intersectional Stigma
          if (stigmaType.includes('enacted')) {
            const prevHighest = stigmaTypes.stigma_es.highestScore;
            if (score > stigmaTypes.stigma_es.highestScore) {
              stigmaTypes.stigma_es.highestScore = score;
              // Get ART ID from patient identifier
              const patient = allPatients[patientIndex];
              const artIdObj = patient?.identifier?.find(
                (id: any) =>
                  (id.identifierType?.display === 'ART ID' ||
                    id.identifierType?.uuid === '9c257200-27e4-447b-b78f-b7778d27cf9f') &&
                  id.value,
              );
              const artId = artIdObj?.value || `ART ID ${patientIndex}`;
              const identifierType = artIdObj?.identifierType?.display || 'ART ID';
              stigmaTypes.stigma_es.highest = { stigmaType: stigmaTypeRaw, score, date, artId };
              // console.log(
              //   `🔴 New HIGHEST ES: ${score} (ART ID: ${artId}) - Previous highest was: ${prevHighest === -Infinity ? 'None' : prevHighest}`,
              // );
            } else {
              // console.log(
              //   `⚪ ES: ${score} (ART ID: ${allPatients[patientIndex]?.identifier?.find((id: any) => id.value)?.value}) - Not higher than current highest: ${prevHighest}`,
              // );
            }
          }

          // Check Internalized Intersectional Stigma
          if (stigmaType.includes('internalized')) {
            const prevHighest = stigmaTypes.stigma_is.highestScore;
            if (score > stigmaTypes.stigma_is.highestScore) {
              stigmaTypes.stigma_is.highestScore = score;
              // Get ART ID from patient identifier
              const patient = allPatients[patientIndex];
              const artIdObj = patient?.identifier?.find(
                (id: any) =>
                  (id.identifierType?.display === 'ART ID' ||
                    id.identifierType?.uuid === '9c257200-27e4-447b-b78f-b7778d27cf9f') &&
                  id.value,
              );
              const artId = artIdObj?.value || `Patient ${patientIndex}`;
              const identifierType = artIdObj?.identifierType?.display || 'ART ID';
              stigmaTypes.stigma_is.highest = { stigmaType: stigmaTypeRaw, score, date, artId };
              // console.log(
              //   `🔴 New HIGHEST IS: ${score} (ART ID: ${artId}) - Previous highest was: ${prevHighest === -Infinity ? 'None' : prevHighest}`,
              // );
            } else {
              // console.log(
              //   `⚪ IS: ${score} (ART ID: ${allPatients[patientIndex]?.identifier?.find((id: any) => id.value)?.value}) - Not higher than current highest: ${prevHighest}`,
              // );
            }
          }
        });
      });

      // console.log('✅ Analysis Complete!');
      // console.log('Processed patients with stigma data:', processedPatients);
      // console.log('Total stigma observations:', totalObservations);
      // console.log('Results:', {
      //   'Anticipated Stigma (AS)': {
      //     highest: stigmaTypes.stigma_as.highestScore,
      //   },
      //   'Enacted Stigma (ES)': {
      //     highest: stigmaTypes.stigma_es.highestScore,
      //   },
      //   'Internalized Stigma (IS)': {
      //     highest: stigmaTypes.stigma_is.highestScore,
      //   },
      // });

      setIntersectionalData({
        stigma_as: { highest: stigmaTypes.stigma_as.highest },
        stigma_es: { highest: stigmaTypes.stigma_es.highest },
        stigma_is: { highest: stigmaTypes.stigma_is.highest },
      });
      setLoading(false);
    };

    calculateExtremes();
  }, [patients]);

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
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(191, 188, 188, 0.1)',
        width: '100%',
      }}
    >
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e3a8a', fontSize: '1.3rem' }}>Intersectional</h3>

      {/* Bar Chart Visualization - Full Width */}
      <Chart
        type="bar"
        data={{
          labels: ['Anticipated Stigma (AS)', 'Enacted Stigma (ES)', 'Internalized Stigma (IS)'],
          datasets: [
            {
              label: 'Highest Score',
              data: [
                intersectionalData.stigma_as.highest?.score || 0,
                intersectionalData.stigma_es.highest?.score || 0,
                intersectionalData.stigma_is.highest?.score || 0,
              ],
              backgroundColor: 'rgba(220, 38, 38, 0.8)',
              borderColor: 'rgba(220, 38, 38, 1)',
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 14,
                  weight: 500,
                },
                padding: 15,
              },
            },
            tooltip: {
              titleFont: {
                size: 14,
                weight: 600,
              },
              bodyFont: {
                size: 13,
              },
              callbacks: {
                afterLabel: function (context) {
                  const stigmaType =
                    context.dataIndex === 0 ? 'stigma_as' : context.dataIndex === 1 ? 'stigma_es' : 'stigma_is';
                  const data = intersectionalData[stigmaType].highest;
                  if (data) {
                    return `ART ID: ${data.artId}\nDate: ${new Date(data.date).toLocaleDateString()}`;
                  }
                  return '';
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Stigma Score',
                font: {
                  size: 14,
                  weight: 600,
                },
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
            x: {
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
          },
        }}
      />
    </div>
  );
}

// Dimension Visualization Component
function DimensionVisualization({ patients }: { patients: any[] }) {
  // Support anticipated and internalized dimensions
  // Separate keys and labels for anticipated and internalized
  const anticipatedKeys = ['hiv_domain_as', 'mh_domain_as', 'sgm_domain_as', 'em_domain_as'];
  const anticipatedLabels = ['HIV Domain (AS)', 'Mental Health Domain (AS)', 'SGM Domain (AS)', 'EM Domain (AS)'];
  const internalizedKeys = ['hiv_domain_is', 'mh_domain_is', 'sgm_domain_is', 'em_domain_is'];
  const internalizedLabels = ['HIV Domain (IS)', 'Mental Health Domain (IS)', 'SGM Domain (IS)', 'EM Domain (IS)'];
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
  const codeToDimensionKey: Record<string, string> = {
    // Anticipated
    'Anticipated stigma score': 'sgm_domain_as',
    'HIV stigma score': 'hiv_domain_as',
    'Mental health stigma score': 'mh_domain_as',
    'Experience of marginalization score': 'em_domain_as',
    'HIV domain total score- Anticipated stigma': 'hiv_domain_as',
    'Mental health domain score- Anticipated stigma': 'mh_domain_as',
    'Sexual and Gender Minorities  domain score- Anticipated stigma': 'sgm_domain_as',
    'Ethnic Minorities domain score- Anticipated stigma score': 'em_domain_as',
    // Internalized
    'Internalized stigma score': 'sgm_domain_is',
    'HIV domain total score- Internalized stigma': 'hiv_domain_is',
    'Mental health domain score- Internalized stigma': 'mh_domain_is',
    'Sexual and Gender Minorities  domain score- Internalized stigma': 'sgm_domain_is',
    'Ethnic Minorities domain score- Internalized stigma score': 'em_domain_is',
    // Add any other variations from logs here
  };
  patients.forEach((observations) => {
    if (!Array.isArray(observations)) return;
    observations.forEach((obs: any) => {
      const codeText = obs.code?.text;
      let key = codeToDimensionKey[codeText];
      if (!key) {
        // Fuzzy match for internalized
        for (const mapText in codeToDimensionKey) {
          if (
            codeText &&
            mapText.toLowerCase().replace(/\s+/g, '').includes('internalized') &&
            codeText.toLowerCase().replace(/\s+/g, '').includes('internalized') &&
            mapText.toLowerCase().replace(/\s+/g, '') === codeText.toLowerCase().replace(/\s+/g, '')
          ) {
            key = codeToDimensionKey[mapText];
            // console.log('[FUZZY MATCH INTERNALIZED]', codeText, '->', key);
            break;
          }
        }
        if (!key) {
          // Try partial fuzzy match
          for (const mapText in codeToDimensionKey) {
            if (
              codeText &&
              mapText.toLowerCase().replace(/\s+/g, '').includes('internalized') &&
              codeText.toLowerCase().replace(/\s+/g, '').includes('internalized')
            ) {
              key = codeToDimensionKey[mapText];
              // console.log('[PARTIAL FUZZY INTERNALIZED]', codeText, '->', key);
              break;
            }
          }
        }
      }
      if (!key) return;
      const rawValue = obs.valueQuantity?.value ?? (obs.valueString ? Number(obs.valueString) : undefined);
      if (typeof rawValue === 'number' && !isNaN(rawValue)) {
        dimensionScores[key].push(rawValue);
        // console.log('[MATCH]', key, rawValue, 'from', codeText);
      } else {
        // console.log('[SKIP]', key, rawValue, 'from', codeText);
      }
    });
  });

  const maxDimensions: Record<string, number> = {};
  [...anticipatedKeys, ...internalizedKeys].forEach((key) => {
    maxDimensions[key] = dimensionScores[key].length > 0 ? Math.max(...dimensionScores[key]) : 0;
  });
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
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
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
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e3a8a', fontSize: '1.3rem' }}>Dimension (Anticipated)</h3>
          {/* <div style={{ marginBottom: '2rem' }}>
            <strong>Max Dimension Scores:</strong>
            <ul>
              {anticipatedKeys.map((key, idx) => (
                <li key={key}>
                  {anticipatedLabels[idx]}:{' '}
                  <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{maxDimensions[key]}</span>
                </li>
              ))}
            </ul>
          </div> */}
          <Chart
            type="bar"
            data={{
              labels: anticipatedLabels,
              datasets: [
                {
                  label: 'Max Score',
                  data: anticipatedKeys.map((key) => maxDimensions[key]),
                  backgroundColor: [
                    'rgba(56, 189, 248, 0.7)',
                    'rgba(34, 197, 94, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(251, 191, 36, 0.7)',
                  ],
                  borderColor: [
                    'rgba(56, 189, 248, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(251, 191, 36, 1)',
                  ],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: function (context: any) {
                      return `Max Score: ${context.parsed.y}`;
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Max Score',
                    font: { size: 14, weight: 600 },
                  },
                  ticks: { font: { size: 12 } },
                },
                x: {
                  ticks: { font: { size: 12 } },
                },
              },
            }}
          />
        </>
      )}
      {tab === 'enacted' && <EnactedDimensionVisualization patients={patients} />}
      {tab === 'internalized' && (
        <>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#a21caf', fontSize: '1.3rem' }}>Dimension (Internalized)</h3>
          {/* <div style={{ marginBottom: '2rem' }}>
            <strong>Max Dimension Scores:</strong>
            <ul>
              {internalizedKeys.map((key, idx) => (
                <li key={key}>
                  {internalizedLabels[idx]}:{' '}
                  <span style={{ color: '#a21caf', fontWeight: 'bold' }}>{maxDimensions[key]}</span>
                </li>
              ))}
            </ul>
          </div> */}
          <Chart
            type="bar"
            data={{
              labels: internalizedLabels,
              datasets: [
                {
                  label: 'Max Score',
                  data: internalizedKeys.map((key) => maxDimensions[key]),
                  backgroundColor: [
                    'rgba(168, 85, 247, 0.7)',
                    'rgba(236, 72, 153, 0.7)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(251, 191, 36, 0.7)',
                  ],
                  borderColor: [
                    'rgba(168, 85, 247, 1)',
                    'rgba(236, 72, 153, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(251, 191, 36, 1)',
                  ],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: function (context: any) {
                      return `Max Score: ${context.parsed.y}`;
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Max Score',
                    font: { size: 14, weight: 600 },
                  },
                  ticks: { font: { size: 12 } },
                },
                x: {
                  ticks: { font: { size: 12 } },
                },
              },
            }}
          />
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
}: {
  patients: any[];
  refreshTrigger?: number;
  onRefresh?: () => void;
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

        // Filter to only conference form related obs AND current location
        // This ensures Site A only sees Site A data, Site B only sees Site B data
        const conferenceObs =
          conferenceConceptUuids.size > 0
            ? allObs.filter((obs) => {
                const matchesConcept = conferenceConceptUuids.has(obs.concept?.uuid);
                const matchesLocation = obs.location?.uuid === defaultLocationUuid;

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

                return matchesConcept && matchesLocation;
              })
            : allObs.filter((obs) => obs.location?.uuid === defaultLocationUuid);

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
  }, [defaultLocationUuid, refreshTrigger, patientUuid, conceptLabelMap]);

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
          <h4 style={{ margin: '0 0 1rem 0', color: '#1e3a8a' }}> </h4>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #e5e7eb',
                fontSize: '0.9rem',
                tableLayout: 'fixed',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#1e3a8a', color: '#fff' }}>
                  <th
                    style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #1e3a8a', width: '60px' }}
                  >
                    No.
                  </th>
                  <th
                    style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #1e3a8a', width: '180px' }}
                  >
                    Submission Date
                  </th>
                  <th
                    style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #1e3a8a', width: '120px' }}
                  >
                    Site
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>
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
          <h5 style={{ color: '#1890ff', marginBottom: '1rem' }}>Submitted Observations</h5>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1em' }}>
            <thead>
              <tr style={{ background: '#f6fbff' }}>
                <th style={{ border: '1px solid #e6f7ff', padding: '0.5rem' }}>Concept</th>
                <th style={{ border: '1px solid #e6f7ff', padding: '0.5rem' }}>Value</th>
                <th style={{ border: '1px solid #e6f7ff', padding: '0.5rem' }}>Datetime</th>
              </tr>
            </thead>
            <tbody>
              {patientObs.map((obs) => (
                <tr key={obs.uuid}>
                  <td style={{ border: '1px solid #e6f7ff', padding: '0.5rem' }}>
                    {obs.concept?.display || obs.concept?.uuid}
                  </td>
                  <td style={{ border: '1px solid #e6f7ff', padding: '0.5rem' }}>{obs.value}</td>
                  <td style={{ border: '1px solid #e6f7ff', padding: '0.5rem' }}>
                    {obs.obsDatetime ? new Date(obs.obsDatetime).toLocaleString() : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                                      padding: '0.5rem',
                                      border: '1px solid #ccc',
                                      borderRadius: '4px',
                                      resize: 'vertical',
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
                                      padding: '0.5rem',
                                      border: '1px solid #ccc',
                                      borderRadius: '4px',
                                      fontSize: '1rem',
                                    }}
                                  />
                                ) : question.questionOptions?.rendering === 'radio' ? (
                                  <div>
                                    {question.questionOptions.answers &&
                                      question.questionOptions.answers.map((answer: any, answerIndex: number) => (
                                        <label key={answerIndex} style={{ display: 'block', marginBottom: '0.3rem' }}>
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
              padding: '0.75rem',
              backgroundColor: !isLoading ? '#056b2cff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: !isLoading ? 'pointer' : 'not-allowed',
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
