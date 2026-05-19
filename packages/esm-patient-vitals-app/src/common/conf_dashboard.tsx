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
import participantFormJson from '../participate.json';
import counselorFormJson from '../काउन्सिलर फारम.json';
import conferenceFormJson from '../कन्फरेन्स फारम.json';
import { MonthlyBarChart } from './monthly-bar-chart';
import { StgTypeVisualization } from './stg_type';
import { DimensionVisualization } from './dimension-visualization';
import { IntersectionalVisualization } from './intersectional-visualization';
import { CovidStigmaData } from './types';

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

export const PATIENT_CONFIG = {
  // Patient UUIDs - representing sites in the system
  allowedPatients: [
    {
      patientId: '04756e92-8e41-4d15-aae6-6431c5065829',
      description: 'Kathmandu Site',
    },
    {
      patientId: '019061e6-7306-4e6d-bacf-05edf852a922',
      description: 'Bhaktapur Site',
    },
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
  ],

  // Extract just the patient IDs for easy filtering
  get patientIdList() {
    return this.allowedPatients.map((p) => p.patientId);
  },

  // Get description for a site
  getDescription(patientId: string) {
    const patient = this.allowedPatients.find((p) => p.patientId === patientId);
    return patient?.description || 'Unknown site';
  },
};

// 💡 USllPGE NOTES:
// • These are LOCATION UUIDs, not patient UUIDs
// • Patients from these locations will be shown in dropdown
// • Kathmandu (6b4b134d...) and Bhaktapur (5fdefb8b...) locations
// • Only patients associated with these locations appear in form interface
// ============================================================================
// import { StigmaAnnualTrendChart } from './stigma-annual-trend';
// import { StigmaOverviewChart } from './StigmaOverviewChart'; // adjust path if needed
// ---------------- Fetch ll Patients (for all visualizations) ----------------
async function fetchAllPatients() {
  let allPatients: any[] = [];

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

  try {
    const restUrl = '/ws/rest/v1/patient?v=full&limit=100';
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

//not used now
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

// ---------------- Fetch Counselling/Stigma Data for a patient ----------------
async function fetchPatientStigmaData(patientId: string) {
  try {
    const url = `${fhirBaseUrl}/Observation?subject=${patientId}&_count=100`;
    const { data } = await openmrsFetch(url);
    if (!data?.entry) return [];
    return data.entry.map((e: any) => e.resource);
  } catch (error) {
    // console.error(`Error fetching stigma data for patient ${patientId}:`, error);
    return [];
  }
}

// ---------------- Fetch Stigma Data with Location Info (from RESTPI encounters) ----------------
async function fetchPatientStigmaDataWithLocation(patientId: string): Promise<any[]> {
  try {
    // Use REST PI to get encounters with location info
    const url = `/ws/rest/v1/encounter?patient=${patientId}&v=full&limit=100`;
    const { data } = await openmrsFetch(url);
    if (!data?.results) return [];

    const observations: any[] = [];

    // Extract observations from encounters with location info
    for (const encounter of data.results) {
      const encounterLocationUuid = encounter.location?.uuid;
      const encounterDate = encounter.encounterDatetime;

      if (encounter.obs && Array.isArray(encounter.obs)) {
        for (const obs of encounter.obs) {
          // Parse value - handle "X/Y" format (e.g., "31/36")
          const rawValue = obs.value?.display ?? obs.value;
          let numericValue: number | undefined;

          if (typeof rawValue === 'number') {
            numericValue = rawValue;
          } else if (typeof rawValue === 'string') {
            // Try "X/Y" format first
            const slashMatch = rawValue.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*\d+/);
            if (slashMatch) {
              numericValue = parseFloat(slashMatch[1]);
            } else {
              // Try regular number
              const match = rawValue.match(/-?\d+(?:\.\d+)?/);
              if (match) {
                numericValue = parseFloat(match[0]);
              }
            }
          }

          // Attach location and date info to each observation
          observations.push({
            ...obs,
            locationUuid: encounterLocationUuid,
            effectiveDateTime: encounterDate,
            date: encounterDate,

            code: {
              coding: [
                {
                  code: obs.concept?.uuid,
                  display: obs.concept?.display,
                },
              ],
              text: obs.concept?.display,
            },
            valueQuantity: {
              value: numericValue,
            },
            value: rawValue,
          });
        }
      }
    }

    return observations;
  } catch (error) {
    console.error(`Error fetching stigma data with location for patient ${patientId}:`, error);
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

// ---------------- Main Dashboard ----------------s
export default function AllPatientsDashboard() {
  const session = useSession();
  const { data, isLoading, error } = useAllPatients();
  const patients = data?.patients || [];
  const [allPatientsData, setAllPatientsData] = useState<any[]>([]);
  const [locationFilteredData, setLocationFilteredData] = useState<any[]>([]); // Data filtered by current location
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [vizType, setVizType] = useState<
    'summary' | 'monthly' | 'custom1' | 'custom2' | 'stgtype' | 'Location' | 'dimensions'
  >('summary');

  // Get current location UUID for filtering
  const currentLocationUuid = session?.sessionLocation?.uuid;
  const currentLocationName = session?.sessionLocation?.display;

  // Debug: Log session location on component mount/updates
  useEffect(() => {
    console.log('🔐 Session info:', {
      authenticated: session?.authenticated,
      sessionLocationUuid: currentLocationUuid,
      sessionLocationName: currentLocationName,
      user: session?.user?.display,
    });
  }, [session, currentLocationUuid, currentLocationName]);

  // Fetch all patient data (for summary/monthly views that show all data)
  useEffect(() => {
    if (!patients?.length) return;
    Promise.all(patients.map((p) => fetchPatientStigmaData(p.id))).then((results) => {
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
  }, [patients]);

  // Fetch location-filtered data (for stgtype, dimensions, cutoff, Location, patient-participation)
  useEffect(() => {
    if (!patients?.length) {
      console.log('⚠️ No patients to fetch location-filtered data');
      setLocationFilteredData([]);
      return;
    }

    if (!currentLocationUuid) {
      console.log('⚠️ No currentLocationUuid set - location filtering disabled');
      // Still fetch data but don't filter by location if no location is set
      Promise.all(patients.map((p) => fetchPatientStigmaDataWithLocation(p.id))).then((results) => {
        console.log(
          '📊 Fetched all data without location filter:',
          results.reduce((sum, arr) => sum + arr.length, 0),
          'obs',
        );
        setLocationFilteredData(results);
      });
      return;
    }

    console.log('🏥 Fetching location-filtered data for:', currentLocationName, '(', currentLocationUuid, ')');

    Promise.all(patients.map((p) => fetchPatientStigmaDataWithLocation(p.id))).then((results) => {
      // Debug: show unique locations in data
      const locationSet = new Set<string>();
      results.forEach((patientObs) => {
        patientObs.forEach((obs: any) => {
          if (obs.locationUuid) locationSet.add(obs.locationUuid);
        });
      });
      console.log('📍 Unique locations in data:', Array.from(locationSet));
      console.log('📍 Current location UUID:', currentLocationUuid);

      // Filter observations by current location
      const filteredResults = results.map((patientObs) =>
        patientObs.filter((obs: any) => {
          // Only include observations from the current location
          const matches = obs.locationUuid === currentLocationUuid;
          return matches;
        }),
      );

      const totalObs = results.reduce((sum, arr) => sum + arr.length, 0);
      const filteredObs = filteredResults.reduce((sum, arr) => sum + arr.length, 0);
      console.log(`📊 Location filtering: ${filteredObs}/${totalObs} observations from ${currentLocationName}`);

      // If no observations match the location, log a warning
      if (filteredObs === 0 && totalObs > 0) {
        console.warn('⚠️ NO OBSERVATIONS MATCH THE CURRENT LOCATION! Check if location UUIDs match.');
        console.log(
          'First few obs locationUuids:',
          results.slice(0, 3).flatMap((arr) => arr.slice(0, 3).map((o: any) => o.locationUuid)),
        );
      }

      setLocationFilteredData(filteredResults);
    });
  }, [patients, currentLocationUuid, currentLocationName]);

  // Debug: Log allPatientsData and extracted stigma types when user selects the Stigma Type viz
  useEffect(() => {
    if (vizType !== 'stgtype') return;
    // console.log('All Patients Data (debug):', allPatientsData);
    if (!allPatientsData || allPatientsData.length === 0) {
      // console.log('No patient observations loaded yet (allPatientsData is empty)');
      return;
    }
    const summary: Record<string, number> = {};
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

        if (type) {
          if (summary[type] === undefined) summary[type] = 0;
          summary[type]++;
        }
      });
    });
    // console.log('Stigma Type Summary (debug):', summary);
  }, [vizType, allPatientsData]);

  // When selecting ART ID the ArtIdPanel will be shown by the conditional render below

  function normalizeStigmaType(obs: any): 'anticipated' | 'enacted' | 'internalized' | null {
    const text = (obs.stigmaType || obs.code?.coding?.[0]?.display || obs.code?.text || '').toString().toLowerCase();
    if (text.includes('anticipated') || text.includes('अपेक्षित')) return 'anticipated';
    if (text.includes('enacted') || text.includes('व्यावहारिक')) return 'enacted';
    if (text.includes('internalized') || text.includes('आत्म')) return 'internalized';
    return null;
  }

  function getNumericScore(obs: any): number {
    if (typeof obs.stigmaScore === 'number') return obs.stigmaScore;
    if (typeof obs.stigmaScore === 'string') {
      const parsed = parseFloat(obs.stigmaScore);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    if (obs.valueQuantity?.value !== undefined) return Number(obs.valueQuantity.value);
    const displayValue = (obs.display || '').toString();
    const match = displayValue.match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : 0;
  }

  function calculateStigmaTypeSummary(patientData: any[]) {
    const thresholds: Record<'anticipated' | 'enacted' | 'internalized', number> = {
      anticipated: 40,
      enacted: 43,
      internalized: 33,
    };

    const summary = {
      anticipated: { above: 0, below: 0, total: 0 },
      enacted: { above: 0, below: 0, total: 0 },
      internalized: { above: 0, below: 0, total: 0 },
    };

    patientData.forEach((observations) => {
      const mostRecentByType: Record<
        'anticipated' | 'enacted' | 'internalized',
        { obs: any | null; date: Date | null }
      > = {
        anticipated: { obs: null, date: null },
        enacted: { obs: null, date: null },
        internalized: { obs: null, date: null },
      };

      observations.forEach((obs: any) => {
        const type = normalizeStigmaType(obs);
        if (!type) return;
        const date = new Date(obs.effectiveDateTime || obs.date || Date.now());
        const current = mostRecentByType[type];
        if (!current.date || date > current.date) {
          mostRecentByType[type] = { obs, date };
        }
      });

      (['anticipated', 'enacted', 'internalized'] as const).forEach((type) => {
        const { obs } = mostRecentByType[type];
        if (!obs) return;
        const score = getNumericScore(obs);
        if (Number.isNaN(score)) return;
        const key = score >= thresholds[type] ? 'above' : 'below';
        summary[type][key] += 1;
        summary[type].total += 1;
      });
    });

    return summary;
  }

  // Test function to analyze stigma data
  function testStigmaAnalysis(patientData: any[], startDate?: string, endDate?: string) {
    let totalPatients = 0;
    let matchedPatients = 0;
    let unmatchedPatients = 0;
    const patientMatches: Record<
      string,
      { matched: boolean; highestScores: { type: string; score: number; threshold: number }[] }
    > = {};

    // Parse date range if provided
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    patientData.forEach((observations, patientIndex) => {
      const patientId = String(patientIndex);

      // Process observations to match CovidStigmaData format
      const stigmaData: CovidStigmaData[] = observations
        .filter((obs: any) => {
          // Filter only stigma-related observations
          const isStigma = obs.code?.coding?.some(
            (coding: any) =>
              coding.display?.toLowerCase().includes('stigma') || coding.code?.toLowerCase().includes('stigma'),
          );
          if (!isStigma) return false;
          // Date filter
          if (start || end) {
            const obsDate = obs.effectiveDateTime || obs.date;
            if (!obsDate) return false;
            const d = new Date(obsDate);
            if (start && d < start) return false;
            if (end && d > end) return false;
          }
          return true;
        })
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
          matchedPatients++;
        } else {
          unmatchedPatients++;
        }
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

  // Summary cutoff analysis uses location-filtered data
  const stigmaCutoffSummary = useMemo(() => {
    // Use location-filtered data for cutoff analysis
    const dataToUse = locationFilteredData.length > 0 ? locationFilteredData : [];
    if (dataToUse.length > 0) {
      const analysisResult = testStigmaAnalysis(dataToUse, startDate || undefined, endDate || undefined);
      const typeSummary = calculateStigmaTypeSummary(dataToUse);
      return {
        ...analysisResult,
        typeSummary,
      };
    }
    return null;
  }, [locationFilteredData, startDate, endDate]);

  return (
    <div
      style={{
        padding: '1rem',
        border: '2px solid #fafbfdff',
        margin: '1rem',
        backgroundColor: '#f0f8ff',
      }}
    >
      {/* Two-column layout: Left space + Right visualization */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', minHeight: '400px' }}>
        {/* Left side - Form Filling Interface */}
        <div
          style={{
            flex: '1',
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
            />
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              {/* <h4>📝 Form Filling Interface</h4> */}
              <p style={{ color: '#666' }}>Loading patients...</p>
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '4px' }}>
                {/* <p>
                  <strong>Form UUID:</strong> 55b82773-3cd0-4813-a38e-9d0c1ea35e45
                </p> */}
                <p>
                  <strong>Status:</strong> Waiting for patient data
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Right side - Visualization dropdown and controls */}
        <div style={{ flex: '1' }}>
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
              <option value="dimensions">Dimensions</option>
              <option value="custom2">Intersectional Score</option>
              <option value="Location">Conference Meeting</option>
            </select>
          </div>

          {vizType !== 'custom1' && vizType !== 'Location' && (
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                marginBottom: 12,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
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
          )}

          {/* All visualizations now contained within the right column */}
          {isLoading && <p>Loading patient data...</p>}
          {error && <p style={{ color: 'red' }}>Error loading patients: {String(error)}</p>}
          {!isLoading && !patients?.length && <p>No patients found</p>}

          {/* Display Stigma Analysis Results if data is available and summary selected */}
          {vizType === 'summary' && (
            <>
              {!currentLocationUuid && (
                <div
                  style={{
                    color: '#d9534f',
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: '#fff3cd',
                    borderRadius: '8px',
                  }}
                >
                  ⚠️ कुनै स्थान छानिएको छैन। कृपया सत्र स्थान सेट गर्नुहोस्।
                </div>
              )}
              {locationFilteredData.length > 0 && (
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
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem',
                        width: '100%',
                      }}
                    >
                      {[
                        {
                          title: 'Overall Intersectional Stigma',
                          above: stigmaCutoffSummary.matchedPatients,
                          below: stigmaCutoffSummary.unmatchedPatients,
                          total: stigmaCutoffSummary.totalPatients,
                        },
                        {
                          title: 'Anticipated Stigma',
                          above: stigmaCutoffSummary.typeSummary.anticipated.above,
                          below: stigmaCutoffSummary.typeSummary.anticipated.below,
                          total: stigmaCutoffSummary.typeSummary.anticipated.total,
                        },
                        {
                          title: 'Enacted Stigma',
                          above: stigmaCutoffSummary.typeSummary.enacted.above,
                          below: stigmaCutoffSummary.typeSummary.enacted.below,
                          total: stigmaCutoffSummary.typeSummary.enacted.total,
                        },
                        {
                          title: 'Internalized Stigma',
                          above: stigmaCutoffSummary.typeSummary.internalized.above,
                          below: stigmaCutoffSummary.typeSummary.internalized.below,
                          total: stigmaCutoffSummary.typeSummary.internalized.total,
                        },
                      ].map((chart) => (
                        <div
                          key={chart.title}
                          style={{
                            backgroundColor: '#fafbfd',
                            borderRadius: '12px',
                            padding: '1rem',
                            boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
                            minHeight: '320px',
                          }}
                        >
                          <h4
                            style={{
                              margin: '0 0 0.75rem',
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: '#1f2937',
                            }}
                          >
                            {chart.title}
                          </h4>
                          {chart.total > 0 ? (
                            <>
                              <Chart
                                type="pie"
                                data={{
                                  labels: ['उच्च लान्छना स्कोर', 'न्यून लान्छना स्कोर'],
                                  datasets: [
                                    {
                                      data: [chart.above, chart.below],
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
                                          size: 12,
                                          weight: 500,
                                        },
                                        padding: 16,
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
                                          const value = context.raw as number;
                                          const percentage = chart.total > 0 ? ((value / chart.total) * 100).toFixed(1) : '0.0';
                                          return `${context.label}: ${percentage}% (${value})`;
                                        },
                                      },
                                    },
                                  },
                                }}
                              />
                              <div style={{ marginTop: '0.75rem', color: '#334155', textAlign: 'center' }}>
                                <p style={{ margin: '0.2rem 0', fontWeight: 600 }}>
                                  Above: {chart.above} ({chart.total > 0 ? ((chart.above / chart.total) * 100).toFixed(1) : '0.0'}%)
                                </p>
                                <p style={{ margin: '0.2rem 0', fontWeight: 600 }}>
                                  Below: {chart.below} ({chart.total > 0 ? ((chart.below / chart.total) * 100).toFixed(1) : '0.0'}%)
                                </p>
                              </div>
                            </>
                          ) : (
                            <p style={{ margin: '1rem 0', color: '#64748b' }}>No data available for this category.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>तथ्यांक विश्लेषण गर्दै...</p>
                  )}
                </div>
              )}
            </>
          )}

          {vizType === 'monthly' && patients.length > 0 && selectedYear && (
            <>
              {!currentLocationUuid && (
                <div
                  style={{
                    color: '#d9534f',
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: '#fff3cd',
                    borderRadius: '8px',
                  }}
                >
                  ⚠️ कुनै स्थान छानिएको छैन। कृपया सत्र स्थान सेट गर्नुहोस्।
                </div>
              )}
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
                  <MonthlyBarChart
                    allPatientsData={locationFilteredData}
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                    availableYears={availableYears}
                    startDate={startDate || undefined}
                    endDate={endDate || undefined}
                  />
                </div>
              </div>
            </>
          )}

          {/* ART ID panel: enter ART ID to lookup patient and show participant + counselor forms */}
          {vizType === 'custom1' && <ArtIdPanel patients={patients} />}

          {vizType === 'stgtype' && (
            <>
              {!currentLocationUuid && (
                <div
                  style={{
                    color: '#d9534f',
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: '#fff3cd',
                    borderRadius: '8px',
                  }}
                >
                  ⚠️ कुनै स्थान छानिएको छैन। कृपया सत्र स्थान सेट गर्नुहोस्।
                </div>
              )}
              <StgTypeVisualization
                allPatientsData={locationFilteredData}
                startDate={startDate || undefined}
                endDate={endDate || undefined}
                currentLocationUuid={currentLocationUuid}
              />
            </>
          )}

          {vizType === 'dimensions' && (
            <>
              {!currentLocationUuid && (
                <div
                  style={{
                    color: '#d9534f',
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: '#fff3cd',
                    borderRadius: '8px',
                  }}
                >
                  ⚠️ कुनै स्थान छानिएको छैन। कृपया सत्र स्थान सेट गर्नुहोस्।
                </div>
              )}
              <DimensionVisualization
                allPatientsData={locationFilteredData}
                currentLocationUuid={currentLocationUuid}
                startDate={startDate || undefined}
                endDate={endDate || undefined}
              />
            </>
          )}

          {vizType === 'custom2' && (
            <>
              {!currentLocationUuid && (
                <div
                  style={{
                    color: '#d9534f',
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: '#fff3cd',
                    borderRadius: '8px',
                  }}
                >
                  ⚠️ कुनै स्थान छानिएको छैन। कृपया सत्र स्थान सेट गर्नुहोस्।
                </div>
              )}
              <IntersectionalVisualization
                allPatientsData={locationFilteredData}
                currentLocationUuid={currentLocationUuid}
                startDate={startDate || undefined}
                endDate={endDate || undefined}
              />
            </>
          )}

          {vizType === 'Location' && (
            <>
              {!currentLocationUuid && (
                <div
                  style={{
                    color: '#d9534f',
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: '#fff3cd',
                    borderRadius: '8px',
                  }}
                >
                  ⚠️ कुनै स्थान छानिएको छैन। कृपया सत्र स्थान सेट गर्नुहोस्।
                </div>
              )}
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
                <SitesDataVisualization patients={patients} />
              </div>
            </>
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
        </div>
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
  const [loading, setLoading] = React.useState(false);

  async function findPatientUuidByArtId(inputArtId: string) {
    const normalizedArtId = inputArtId.trim().toLowerCase();
    if (!normalizedArtId) {
      return null;
    }

    console.log('[ART-ID] lookup started', { artId: inputArtId.trim() });

    try {
      const url = `/ws/rest/v1/patient?q=${encodeURIComponent(inputArtId.trim())}&v=full&limit=50`;
      const { data } = await openmrsFetch(url);
      const apiPatients = Array.isArray(data?.results) ? data.results : [];
      console.log('[ART-ID] API search results', { count: apiPatients.length });

      const matchedApiPatient = apiPatients.find((p: any) => {
        const identifiers = Array.isArray(p?.identifiers) ? p.identifiers : [];
        return identifiers.some((id: any) => {
          const directIdentifier = (id?.identifier || '').toString().trim().toLowerCase();
          const fromDisplay = (id?.display || '').toString();
          const parsedDisplayIdentifier = fromDisplay.includes('=')
            ? fromDisplay.split('=').pop()?.trim().toLowerCase()
            : fromDisplay.trim().toLowerCase();

          return directIdentifier === normalizedArtId || parsedDisplayIdentifier === normalizedArtId;
        });
      });

      if (matchedApiPatient?.uuid) {
        console.log('[ART-ID] matched via API identifiers', { patientUuid: matchedApiPatient.uuid });
        return matchedApiPatient.uuid as string;
      }

      console.log('[ART-ID] no exact identifier match from API results; trying local fallback');
    } catch (error) {
      console.warn('ART ID API lookup failed; falling back to local patient list.', error);
    }

    const localPatient = patients.find(
      (p) => p.identifier && p.identifier.some((id: any) => id.value && id.value.toLowerCase() === normalizedArtId),
    );

    if (localPatient?.uuid || localPatient?.id) {
      console.log('[ART-ID] matched via local patient list', { patientUuid: localPatient?.uuid || localPatient?.id });
    } else {
      console.log('[ART-ID] not found in API or local fallback', { artId: inputArtId.trim() });
    }

    return localPatient?.uuid || localPatient?.id || null;
  }

  async function onSearch() {
    setSelectedPatientUuid(null);
    setParticipantAnswers({});
    setCounselorAnswers({});
    if (!artId.trim()) return;

    console.log('[ART-ID] search button clicked', { artId: artId.trim() });

    setLoading(true);
    try {
      const patientUuid = await findPatientUuidByArtId(artId);

      if (!patientUuid) {
        console.log('[ART-ID] search ended with no patient UUID');
        setSelectedPatientUuid(null);
        return;
      }

      setSelectedPatientUuid(patientUuid);
      console.log('[ART-ID] fetching form answers', { patientUuid });
      const [pAns, cAns] = await Promise.all([
        fetchPatientAnswers(patientUuid, participantFormJson),
        fetchPatientAnswers(patientUuid, counselorFormJson),
      ]);

      setParticipantAnswers(pAns || {});
      setCounselorAnswers(cAns || {});
      console.log('[ART-ID] form answers loaded', {
        participantAnswerKeys: Object.keys(pAns || {}).length,
        counselorAnswerKeys: Object.keys(cAns || {}).length,
      });
    } catch (err) {
      console.error('Error fetching form answers for ART ID', artId, err);
      setParticipantAnswers({});
      setCounselorAnswers({});
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
        {loading && <p>Loading answers...</p>}
        {!loading && selectedPatientUuid && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              {/* Per-patient stigma bar chart */}
              <MultiChartSelector patientUuid={selectedPatientUuid} chartType="bar" />
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0' }}>सहभागी फारम - उत्तरहरू</h4>
              <FormDisplay
                formDefinition={participantFormJson}
                answers={participantAnswers}
                showAllQuestions
                respectVisibility={false}
              />
            </div>
            <div>
              {/* <h4 style={{ margin: '0 0 8px 0' }}>Counselor Form</h4> */}
              <ConunselorFormDisplay formDefinition={counselorFormJson} answers={counselorAnswers} />
            </div>
          </div>
        )}
        {!loading && !selectedPatientUuid && artId && <p>No patient found for ART ID: {artId}</p>}
      </div>
    </div>
  );
}

// Sites Data Visualization Component
function SitesDataVisualization({ patients }: { patients: any[] }) {
  const session = useSession();
  const defaultLocationUuid = session?.sessionLocation?.uuid;
  const defaultLocationName = session?.sessionLocation?.display;

  // Find the patient with identifier value "location" (shared across all sites)
  const locationPatient = React.useMemo(() => {
    if (!patients || patients.length === 0) return null;
    return patients.find((p) => {
      return p.identifier?.some((id: any) => id.value?.trim().toLowerCase() === 'location');
    });
  }, [patients]);

  const patientUuid = locationPatient?.uuid || locationPatient?.id || null;

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

  React.useEffect(() => {
    const fetchSitesData = async () => {
      if (!patientUuid || !defaultLocationUuid) {
        console.log('🚫 No patientUuid or location found, skipping fetch.');
        return;
      }
      setLoading(true);
      try {
        // Fetch ALL obs for location patient
        let allObs: any[] = [];
        let startIndex = 0;
        const limit = 100;

        while (true) {
          const obsUrl = `/ws/rest/v1/obs?patient=${patientUuid}&v=full&limit=${limit}&startIndex=${startIndex}`;
          const obsResp = await openmrsFetch(obsUrl);
          const batch = obsResp.data?.results || [];
          allObs = allObs.concat(batch);
          if (batch.length < limit) break;
          startIndex += limit;
        }

        console.log('📊 Total obs fetched:', allObs.length);

        // Get conference form concept UUIDs
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

        // Filter to only conference form obs AND current location
        const conferenceObs = allObs.filter((obs) => {
          const matchesConcept = conferenceConceptUuids.has(obs.concept?.uuid);
          const matchesLocation = obs.location?.uuid === defaultLocationUuid;
          return matchesConcept && matchesLocation;
        });

        console.log('✅ Conference obs for current location:', conferenceObs.length);

        // Group obs by timestamp (hour precision)
        const submissionsByTimestamp: Record<string, any[]> = {};
        conferenceObs.forEach((obs: any) => {
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

            if (obs.value?.display) {
              value = obs.value.display;
            } else if (typeof obs.value === 'number') {
              // Convert numeric radio values back to readable labels
              if (conceptId === '7189452b-be65-42aa-ad77-4861f7d07bae') {
                value = obs.value === 1 ? 'गरियो' : obs.value === 2 ? 'गरिएन' : obs.value.toString();
              } else if (conceptId === '49b60881-a607-408d-89b4-f0c2105c1d96') {
                value = obs.value === 1 ? 'भयो' : obs.value === 2 ? 'भएन' : obs.value.toString();
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
  }, [defaultLocationUuid, patientUuid, conceptLabelMap]);

  const siteSubmissions =
    defaultLocationUuid !== undefined && defaultLocationUuid !== null ? sitesData[defaultLocationUuid] || [] : [];
  const selectedSiteName = defaultLocationName || 'Current Site';

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        maxHeight: '600px',
        overflowY: 'auto',
      }}
    >
      {!defaultLocationUuid ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ff7875' }}>
          <p>⚠️ No default location found. Please log in.</p>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>⏳ Loading...</p>
        </div>
      ) : siteSubmissions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>No submissions found</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: window.innerWidth < 768 ? '0.85rem' : '0.95rem',
            }}
          >
            <thead>
              <tr style={{ background: '#2563eb', color: 'white' }}>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '2px solid #1e40af',
                    width: window.innerWidth < 768 ? '50px' : '60px',
                  }}
                >
                  No.
                </th>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '2px solid #1e40af',
                    width: window.innerWidth < 768 ? '120px' : '150px',
                  }}
                >
                  Submission Date
                </th>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '2px solid #1e40af',
                    width: window.innerWidth < 768 ? '150px' : '200px',
                  }}
                >
                  Site
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #1e40af' }}>Form Data</th>
              </tr>
            </thead>
            <tbody>
              {siteSubmissions.map(
                (
                  submission: {
                    id: React.Key | null | undefined;
                    date: string | number | Date;
                    data: { [s: string]: unknown } | ArrayLike<unknown>;
                  },
                  index: number,
                ) => {
                  // Fields to hide (date and main radio questions)
                  const hideKeys = [
                    '१. आज मिति',
                    '२. कन्फरेन्स बैठक भयो / भएन ?',
                    '३. कन्फरेन्स बैठकको सारांश तयार गरियो / गरिएन ?',
                  ];

                  return (
                    <tr
                      key={submission.id}
                      style={{
                        background: index % 2 === 0 ? '#f9fafb' : '#ffffff',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      <td
                        style={{
                          padding: '0.75rem',
                          fontWeight: '500',
                          color: '#374151',
                        }}
                      >
                        {index + 1}
                      </td>
                      <td style={{ padding: '0.75rem', color: '#6b7280' }}>
                        {new Date(submission.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td style={{ padding: '0.75rem', color: '#374151', fontWeight: '500' }}>{selectedSiteName}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {Object.entries(submission.data)
                            .filter(([key]) => !hideKeys.includes(key))
                            .map(([key, value]) => (
                              <div
                                key={key}
                                style={{
                                  fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem',
                                  lineHeight: '1.5',
                                }}
                              >
                                <strong style={{ color: '#1f2937' }}>
                                  {key}
                                  {key.endsWith('?') || key.endsWith(':') || key.endsWith('।') ? '' : ':'}
                                </strong>{' '}
                                <span style={{ color: '#4b5563' }}>{String(value)}</span>
                              </div>
                            ))}
                        </div>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Concept Validation Tool Component
function ConceptValidationTool() {
  const [results, setResults] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);
  const [showTool, setShowTool] = React.useState(false);

  // Concept UUIDs from the conference form
  const conceptsToCheck = [
    { id: 'aeaccd85-9186-43c5-bee1-f64577de21d2', name: 'बैठकको मिति (Conference Date)', type: 'question' },
    {
      id: '4756e92-8e41-4d15-aae6-6431c5065829',
      name: '✅ नयाँ गतिविधि निर्णय (New Activity Decision)',
      type: 'question',
    },
    {
      id: '4a3ee8de-fa98-4ee0-89a6-63e83f1a7255',
      name: 'गतिविधि विवरण - हो (Activity Details - Yes)',
      type: 'question',
    },
    {
      id: '42354488-0ad0-4cc8-8447-8a0fc075ecd3',
      name: 'गतिविधि कारण - होइन (Activity Reason - No)',
      type: 'question',
    },
    { id: '019061e6-7306-4e6d-bacf-05edf852a922', name: '✅ अघिल्लो गतिविधि (Previous Activity)', type: 'question' },
    {
      id: 'bc5aa67e-fe29-4258-9eef-8a619dcba1ec',
      name: 'गतिविधि विवरण - भयो (Activity Details - Done)',
      type: 'question',
    },
    {
      id: 'c4e607b0-9e59-4a2d-a901-38a657b1e023',
      name: 'गतिविधि कारण - भएन (Activity Reason - Not Done)',
      type: 'question',
    },
    // Answer concepts for radio buttons
    { id: '5f74c3b5-c1d0-4835-9bc2-7098cb711f99', name: '🔘 Answer: गरियो/भयो (Yes/Done)', type: 'answer' },
    { id: 'f643d6d0-27e4-4ec2-be28-fb0a4a8019c9', name: '🔘 Answer: गरिएन/भएन (No/Not Done)', type: 'answer' },
    { id: 'c09c4def-5523-46c4-b851-0b8b30268ee3', name: 'Prompt Text', type: 'question' },
  ];

  const checkConcepts = async () => {
    setLoading(true);
    const conceptResults: any = {};

    for (const concept of conceptsToCheck) {
      try {
        const response = await fetch(`/openmrs/ws/rest/v1/concept/${concept.id}`);

        if (response.ok) {
          const conceptData = await response.json();
          conceptResults[concept.id] = {
            exists: true,
            name: concept.name,
            apiName: conceptData.display || conceptData.name,
            datatype: conceptData.datatype?.display,
            conceptClass: conceptData.conceptClass?.display,
            type: concept.type,
            status: concept.type === 'answer' ? '✅ ANSWER EXISTS' : '✅ EXISTS',
          };
        } else {
          conceptResults[concept.id] = {
            exists: false,
            name: concept.name,
            type: concept.type,
            error: `HTTP ${response.status}`,
            status: concept.type === 'answer' ? '❌ ANSWER NOT FOUND' : '❌ NOT FOUND',
          };
        }
      } catch (error) {
        conceptResults[concept.id] = {
          exists: false,
          name: concept.name,
          type: concept.type,
          // error: error.message,
          status: concept.type === 'answer' ? '❌ ANSWER ERROR' : '❌ ERROR',
        };
      }
    }

    setResults(conceptResults);
    setLoading(false);
  };

  if (!showTool) {
    return (
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => setShowTool(true)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          🔧 Check Concept UUIDs
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: '2rem',
        padding: '1rem',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        background: '#f9fafb',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: '0', color: '#1f2937' }}>🔧 Conference Form Concept Validation</h4>
        <button
          onClick={() => setShowTool(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: '#6b7280',
          }}
        >
          ×
        </button>
      </div>

      <p style={{ margin: '0 0 1rem 0', color: '#6b7280', fontSize: '0.9rem' }}>
        This tool checks if the concept UUIDs in your conference form exist in your OpenMRS database.
      </p>

      <button
        onClick={checkConcepts}
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: loading ? '#9ca3af' : '#059669',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '1rem',
        }}
      >
        {loading ? '🔄 Checking...' : '🔍 Check All Concepts'}
      </button>

      {Object.keys(results).length > 0 && (
        <div>
          <h5 style={{ margin: '0 0 0.5rem 0' }}>Results:</h5>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {Object.entries(results).map(([conceptId, result]: [string, any]) => (
              <div
                key={conceptId}
                style={{
                  padding: '0.5rem',
                  borderRadius: '4px',
                  backgroundColor: result.exists ? '#d1fae5' : '#fee2e2',
                  border: result.exists ? '1px solid #10b981' : '1px solid #ef4444',
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                  {result.status} {result.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', fontFamily: 'monospace' }}>{conceptId}</div>
                {result.exists && result.datatype && (
                  <div style={{ fontSize: '0.8rem', color: '#059669' }}>
                    Type: {result.datatype} | Class: {result.conceptClass} | API Name: {result.apiName}
                  </div>
                )}
                {!result.exists && <div style={{ fontSize: '0.8rem', color: '#dc2626' }}>Error: {result.error}</div>}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#eff6ff', borderRadius: '6px' }}>
            <h6 style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>💡 Diagnosis & Fix Guide:</h6>
            <div style={{ margin: '0', color: '#1e40af', fontSize: '0.9rem' }}>
              <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>🔍 Based on your errors:</p>
              <ul style={{ marginLeft: '1rem', paddingLeft: '0.5rem' }}>
                <li>
                  <strong>Concepts with ⚠️ are failing</strong> - These are your radio button questions
                </li>
                <li>
                  <strong>Answer concepts 🔘 need to exist</strong> - Radio buttons submit concept UUIDs as values
                </li>
                <li>
                  <strong>Check datatype compatibility</strong> - Radio questions should use "Coded" datatype
                </li>
              </ul>
              <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>🛠️ To fix:</p>
              <ul style={{ marginLeft: '1rem', paddingLeft: '0.5rem' }}>
                <li>If answer concepts are missing, create them or use existing ones</li>
                <li>If question concepts exist, ensure they have "Coded" datatype</li>
                <li>Radio button questions need both question AND answer concepts to exist</li>
                <li>
                  Find existing concepts: <code>/openmrs/dictionary</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Form Filling Interface Component for Left Side
function FormFillingInterface({ formUuid, patients }: { formUuid: string; patients: any[] }): JSX.Element {
  const session = useSession();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formSchema, setFormSchema] = React.useState<any>(null);
  const [formDefinition, setFormDefinition] = React.useState<any>(null);
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, boolean>>({});

  // Get session location for display and submission
  const currentLocationUuid = session?.sessionLocation?.uuid;
  const currentLocationName = session?.sessionLocation?.display;

  // Override: Use local JSON for conference form instead of loading from database
  React.useEffect(() => {
    if (formUuid === '55b82773-3cd0-4813-a38e-9d0c1ea35e45') {
      setFormDefinition(conferenceFormJson);
    }
  }, [formUuid]);

  // Load latest conference form submission data into form fields
  React.useEffect(() => {
    const loadLatestSubmission = async () => {
      if (!patients || patients.length === 0 || !currentLocationUuid) return;

      try {
        const patientUuid = patients[0]?.id;
        if (!patientUuid) return;

        // Fetch all conference form observations for this patient at current location
        const obsUrl = `/ws/rest/v1/obs?patient=${patientUuid}&v=full&limit=1000`;
        const obsResp = await openmrsFetch(obsUrl);
        const allObs = obsResp.data?.results || [];

        // Get conference form concept UUIDs
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

        // Filter to only conference form obs at current location
        const conferenceObs = allObs.filter((obs: any) => {
          const matchesConcept = conferenceConceptUuids.has(obs.concept?.uuid);
          const matchesLocation = obs.location?.uuid === currentLocationUuid;
          return matchesConcept && matchesLocation;
        });

        if (conferenceObs.length === 0) return;

        // Group obs by timestamp and get the LATEST submission
        const submissionsByTimestamp: Record<string, any[]> = {};
        conferenceObs.forEach((obs: any) => {
          const timestamp = obs.obsDatetime ? new Date(obs.obsDatetime).toISOString().substring(0, 13) : 'unknown';
          if (!submissionsByTimestamp[timestamp]) {
            submissionsByTimestamp[timestamp] = [];
          }
          submissionsByTimestamp[timestamp].push(obs);
        });

        const timestamps = Object.keys(submissionsByTimestamp).sort().reverse();
        if (timestamps.length === 0) return;

        const latestTimestamp = timestamps[0];
        const latestObsGroup = submissionsByTimestamp[latestTimestamp];

        // Build form data from latest submission
        const newFormData: Record<string, any> = {};
        latestObsGroup.forEach((obs: any) => {
          const conceptId = obs.concept?.uuid;
          let value = obs.value;

          if (obs.value?.display) {
            value = obs.value.display;
          } else if (typeof obs.value === 'number') {
            value = obs.value.toString();
          }

          if (value !== undefined && value !== null && value !== '') {
            newFormData[conceptId] = value;
          }
        });

        if (Object.keys(newFormData).length > 0) {
          setFormData(newFormData);
          console.log('📋 Loaded latest submission into form:', newFormData);

          // Update conditional values
          Object.entries(newFormData).forEach(([conceptId, value]) => {
            if (conceptId === '7189452b-be65-42aa-ad77-4861f7d07bae') {
              setConditionalValues((prev: any) => ({
                ...prev,
                decide_to_implement: value,
              }));
            } else if (conceptId === '49b60881-a607-408d-89b4-f0c2105c1d96') {
              setConditionalValues((prev: any) => ({
                ...prev,
                implement_activity: value,
              }));
            }
          });
        }
      } catch (error) {
        console.error('Error loading latest submission:', error);
      }
    };

    loadLatestSubmission();
  }, [patients, currentLocationUuid]);

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

  // Load form schema from OpenMRS
  // form containing the form's metadata and resources which include form name creator dates and array of resources related to form.

  // v1/clobdata/{uuid} fetch large data paylaods like form definitions stored as CLOBs in OpenMRS
  const loadFormSchema = React.useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading form schema for UUID:', formUuid);

      // Try to load form definition
      const formResponse = await fetch(`/openmrs/ws/rest/v1/form/${formUuid}?v=full`);
      console.log('Form API response status:', formResponse.status);

      if (formResponse.ok) {
        const form = await formResponse.json();
        console.log('Form schema loaded successfully:', form);
        console.log('Form resources:', form.resources);
        console.log('Form published:', form.published);
        setFormSchema(form);

        // Try to get the actual form definition from resources
        if (form.resources && form.resources.length > 0) {
          for (const resource of form.resources) {
            if (resource.name === 'JSON schema' && resource.valueReference) {
              console.log('Found JSON schema resource, valueReference:', resource.valueReference);

              // Check if valueReference is a UUID (resource reference)
              //https://resources.openmrs.org/doc-1.10/index.html?org/openmrs/api/db/ClobDatatypeStorage.html
              // checks if the valueReference matches the UUID pattern mean the content is stored externally in the CLOB storage
              if (
                typeof resource.valueReference === 'string' &&
                resource.valueReference.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
              ) {
                console.log('ValueReference is a UUID, fetching resource content...');

                try {
                  // Fetch the actual form resource content
                  const resourceResponse = await fetch(`/openmrs/ws/rest/v1/clobdata/${resource.valueReference}`);
                  if (resourceResponse.ok) {
                    const resourceText = await resourceResponse.text();
                    console.log('Resource content fetched:', resourceText);

                    try {
                      const parsedFormDefinition = JSON.parse(resourceText);
                      console.log('Parsed form definition:', parsedFormDefinition);
                      setFormDefinition(parsedFormDefinition);
                      break;
                    } catch (parseError) {
                      console.error('Error parsing resource content as JSON:', parseError);
                    }
                  } else {
                    console.error('Failed to fetch resource content:', resourceResponse.status);
                  }
                } catch (fetchError) {
                  console.error('Error fetching resource content:', fetchError);
                }
              } else {
                // Try to parse as direct JSON content
                try {
                  const parsedFormDefinition = JSON.parse(resource.valueReference);
                  console.log('Direct JSON parsing successful:', parsedFormDefinition);
                  setFormDefinition(parsedFormDefinition);
                  break;
                } catch (parseError) {
                  console.log('Not direct JSON content, skipping...');
                }
              }
            }
          }
        }
      } else {
        const errorText = await formResponse.text();
        console.error('Failed to load form schema:', formResponse.status, formResponse.statusText);
        console.error('Error response:', errorText);

        // Try alternative form loading methods
        console.log('Trying alternative form loading...');

        // Try loading as form resource
        const altResponse = await fetch(`/openmrs/ws/rest/v1/formresource?form=${formUuid}&v=full`);
        if (altResponse.ok) {
          const altForm = await altResponse.json();
          console.log('Alternative form data:', altForm);
        }
      }
    } catch (error) {
      console.error('Error loading form schema:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formUuid]);

  React.useEffect(() => {
    if (formUuid) {
      loadFormSchema();
    }
  }, [formUuid, loadFormSchema]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('🚀 Form submission started');
      console.log('📊 FormData:', formData);
      console.log('� Session location:', currentLocationUuid, currentLocationName);

      // Check if form has any data
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

      // Validate required conference length field (length_meeting concept)
      const meetingConcept = '694b7410-6b0d-4ac7-baaa-5479de255d92';
      const meetingValue = formData[meetingConcept];
      if (!meetingValue || (typeof meetingValue === 'string' && meetingValue.trim() === '')) {
        showSnackbar({
          title: 'त्रुटि / Error',
          kind: 'error',
          subtitle: 'कृपया बैठकको अवधि भर्नुहोस् (घण्टा र मिनेट दुबै चाहिन्छ)। / Please enter meeting length (hours and minutes).',
        });
        return;
      }

      if (!currentLocationUuid) {
        showSnackbar({
          title: 'त्रुटि / Error',
          kind: 'error',
          subtitle: 'Session location not found. Please log in again.',
        });
        return;
      }

      // Find patient with identifier value "location" (matching draftconf.tsx approach)
      const patient =
        patients && patients.length > 0
          ? patients.find((p) => {
              const hasLocationIdentifier = p.identifier?.some(
                (id: any) => id.value?.trim().toLowerCase() === 'location',
              );
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

      setIsLoading(true);

      // Submit each observation using patient UUID (not location UUID)
      let successCount = 0;
      let errorCount = 0;

      for (const [conceptUuid, value] of Object.entries(formData)) {
        const hasValue = Array.isArray(value)
          ? value.length > 0
          : value !== null && value !== undefined && value !== '';

        if (hasValue) {
          // Transform radio button values: concept UUIDs → numeric values
          let transformedValue = value;

          // For radio button concepts (Numeric type in database)
          if (
            conceptUuid === '7189452b-be65-42aa-ad77-4861f7d07bae' ||
            conceptUuid === '49b60881-a607-408d-89b4-f0c2105c1d96'
          ) {
            if (value === '5f74c3b5-c1d0-4835-9bc2-7098cb711f99') {
              transformedValue = 1; // गरियो/भयो (Yes/Done)
              console.log(`🔢 Converted radio answer UUID to 1 (Yes/Done)`);
            } else if (value === 'f643d6d0-27e4-4ec2-be28-fb0a4a8019c9') {
              transformedValue = 2; // गरिएन/भएन (No/Not Done)
              console.log(`🔢 Converted radio answer UUID to 2 (No/Not Done)`);
            }
          }

          const obsPayload = {
            person: patient.id, // ← Use PATIENT UUID, not location UUID
            concept: conceptUuid,
            value: transformedValue,
            obsDatetime: new Date().toISOString(),
            location: currentLocationUuid,
          };

          console.log('📤 Submitting observation:', obsPayload);

          try {
            const response = await openmrsFetch('/ws/rest/v1/obs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(obsPayload),
            });

            console.log('📥 Response:', response);

            if (response && (response.status === 200 || response.status === 201)) {
              successCount++;
              console.log('✅ SUCCESS for concept:', conceptUuid);
            } else {
              errorCount++;
              console.log('❌ FAILED for concept:', conceptUuid, response);
            }
          } catch (err) {
            errorCount++;
            console.error('❌ ERROR for concept:', conceptUuid, err);
          }
        }
      }

      if (errorCount === 0) {
        showSnackbar({
          title: 'फारम सफल / Form Success',
          kind: 'success',
          subtitle: 'फारम सफलतापूर्वक पेश गरियो! Form submitted successfully!',
        });
        setFormData({});
        window.location.href = 'http://3.14.101.233/openmrs/spa/home';
      } else {
        showSnackbar({
          title: '⚠️ आंशिक सफलता / Partial Success',
          kind: 'warning',
          subtitle: `${successCount} सफल, ${errorCount} असफल। ${successCount} successful, ${errorCount} failed.`,
        });
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      showSnackbar({
        title: '❌ त्रुटि / Error',
        kind: 'error',
        subtitle: 'फारम पेश गर्दा त्रुटि भयो। Error submitting form. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '300px', background: '#f9f9f9', padding: '1rem' }}>
      <h4 style={{ margin: '0 0 1rem 0', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
        Conference Form{' '}
      </h4>

      {/* Current Site Display (Auto-selected) */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Current Site:</label>
        <div
          style={{
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          {currentLocationName || 'Loading...'}
        </div>
        {!currentLocationUuid && (
          <p style={{ color: '#ff7875', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            ⚠️ Unable to determine your login location. Please check your OpenMRS session.
          </p>
        )}
      </div>

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
                                  {question.label || question.id}
                                  {!question.readonly ? ':' : ''}
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
                                {/* Special handling for field 4 (length_meeting) - Duration input */}
                                {question.id === 'length_meeting' ? (
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <select
                                      value={
                                        formData[question.questionOptions?.concept]
                                          ? formData[question.questionOptions?.concept].split(' ')[0] || ''
                                          : ''
                                      }
                                      onChange={(e) => {
                                        const hours = e.target.value;
                                        const currentValue = formData[question.questionOptions?.concept] || '';
                                        const minutes = currentValue.split(' ')[2] || '';
                                        setFormData({
                                          ...formData,
                                          [question.questionOptions?.concept]: hours && minutes ? `${hours} घण्टा ${minutes} मिनेट` : '',
                                        });
                                      }}
                                      style={{
                                        width: '100px',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        fontSize: '1rem',
                                      }}
                                    >
                                      <option value="">-- छान्नुहोस् --</option>
                                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                        <option key={h} value={h}>
                                          {h}
                                        </option>
                                      ))}
                                    </select>
                                    <span>घण्टा</span>
                                    <select
                                      value={
                                        formData[question.questionOptions?.concept]
                                          ? formData[question.questionOptions?.concept].split(' ')[2] || ''
                                          : ''
                                      }
                                      onChange={(e) => {
                                        const minutes = e.target.value;
                                        const currentValue = formData[question.questionOptions?.concept] || '';
                                        const hours = currentValue.split(' ')[0] || '';
                                        setFormData({
                                          ...formData,
                                          [question.questionOptions?.concept]: hours && minutes ? `${hours} घण्टा ${minutes} मिनेट` : '',
                                        });
                                      }}
                                      style={{
                                        width: '100px',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        fontSize: '1rem',
                                      }}
                                    >
                                      <option value="">-- छान्नुहोस् --</option>
                                      {Array.from({ length: 60 }, (_, i) => i + 1).map((m) => (
                                        <option key={m} value={m}>
                                          {m}
                                        </option>
                                      ))}
                                    </select>
                                    <span>मिनेट</span>
                                  </div>
                                ) : question.questionOptions?.rendering === 'textarea' ? (
                                  <textarea
                                    value={formData[question.questionOptions?.concept] || ''}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        [question.questionOptions?.concept]: e.target.value,
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
                                            checked={
                                              formData[question.questionOptions?.concept]?.includes(answer.concept) ||
                                              false
                                            }
                                            onChange={(e) => {
                                              const currentValues = formData[question.questionOptions?.concept] || [];
                                              const newValues = e.target.checked
                                                ? [...currentValues, answer.concept]
                                                : currentValues.filter((v: string) => v !== answer.concept);
                                              setFormData({
                                                ...formData,
                                                [question.questionOptions?.concept]: newValues,
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
                                    value={formData[question.questionOptions?.concept] || ''}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        [question.questionOptions?.concept]: e.target.value,
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
                                ) : question.questionOptions?.rendering === 'time' ? (
                                  <input
                                    type="time"
                                    value={formData[question.questionOptions?.concept] || ''}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        [question.questionOptions?.concept]: e.target.value,
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
                                            checked={formData[question.questionOptions?.concept] === answer.concept}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setFormData({
                                                ...formData,
                                                [question.questionOptions?.concept]: value,
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
                  ⚠️ Form schema loaded but form definition is being fetched. Please wait...
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
}

// State Variable,Purpose
// selectedPatient,The UUID of the patient currently selected from the dropdown.
// isLoading,A boolean flag used to disable buttons and show a loading spinner during API calls.
// formSchema,"The basic metadata fetched from the OpenMRS /form REST endpoint (includes name, UUID, and resource list)."
// formDefinition,"The detailed JSON structure of the form (pages, sections, questions) parsed from the form's resource (CLOB data). This drives the dynamic rendering."

//////              useful links              //////
//-----------------------------------------------//
//https://resources.openmrs.org/doc-1.10/index.html?org/openmrs/api/db/ClobDatatypeStorage.html
//https://talk.openmrs.org/t/o3forms-module-to-support-posting-form-translations/45453/8

// encounter,"The new Encounter object created when a patient is selected, necessary to link observations."
// formData,"An object that stores the collected form data, mapping Concept UUIDs to user input values."

// {/* ) : question.id === 'prompt_conference' ? (
//       <textarea
//         value={formData[question.questionOptions?.concept] || ''}
//         onChange={(e) =>
//           setFormData({
//             ...formData,
//             [question.questionOptions?.concept]: e.target.value,
//           })
//         }
//         rows={4}f
//         // placeholder="कृपया यहाँ बैठकको छलफलको विवरण लेख्नुहोस्..."
//         style={{
//           width: '100%',
//           padding: '0.5rem',
//           border: '1px solid #ccc',
//           borderRadius: '4px',
//           fontFamily: 'inherit',didnt
//           resize: 'vertical',
//         }}
//       />
//     */}
