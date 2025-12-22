// Async function to fetch and map patient answers by concept UUID
export async function fetchPatientAnswers(patientUuid, formJson) {
  // Flatten all questions
  const questions = [];
  formJson.pages.forEach((page) =>
    page.sections.forEach((section) => section.questions.forEach((q) => questions.push(q))),
  );
  // Get all concept UUIDs - both question concepts and answer option concepts
  const conceptUuids = [];
  questions.forEach((q) => {
    // Add main question concept
    if (q.questionOptions?.concept) {
      conceptUuids.push(q.questionOptions.concept);
    }
    // For checkbox questions, also add all answer option concepts
    if (q.questionOptions?.rendering === 'checkbox' && q.questionOptions?.answers) {
      q.questionOptions.answers.forEach((answer) => {
        if (answer.concept) {
          conceptUuids.push(answer.concept);
        }
      });
    }
  });

  // console.log('DEBUG: Total concept UUIDs to fetch:', conceptUuids.length);
  // console.log('DEBUG: Sample concept UUIDs:', conceptUuids.slice(0, 10));
  // console.log(
  //   'DEBUG: Checkbox answer concepts included:',
  //   conceptUuids.filter(
  //     (uuid) =>
  //       uuid === '884AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' ||
  //       uuid === '3cd7f7cd-8996-4695-8074-a22c2242d1ea' ||
  //       uuid === 'd36a20a7-cc83-41db-ac63-a0e49aca38ae' ||
  //       uuid === '50508043-1d71-4f34-8933-e77dd6471387',
  //   ),
  // );

  // Fetch all obs for patient, handling pagination
  let obsArray = [];
  let nextUrl = `/openmrs/ws/rest/v1/obs?patient=${patientUuid}&v=full`;
  try {
    while (nextUrl) {
      const response = await fetch(nextUrl, {
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        obsArray = obsArray.concat(data.results || []);
        // Check for next page
        nextUrl =
          data.links && Array.isArray(data.links) ? data.links.find((l) => l.rel === 'next')?.uri || null : null;
      } else {
        console.error('API error', response.status, nextUrl);
        break;
      }
    }
  } catch (err) {
    console.error('Fetch error', err, nextUrl);
  }

  // console.log('Total obs fetched before filtering:', obsArray.length);
  // if (obsArray.length > 0) {
  //   console.log(
  //     'Sample obs concept UUIDs:',
  //     obsArray.slice(0, 5).map((obs) => obs.concept?.uuid || obs.concept),
  //   );
  // }

  // console.log('DEBUG: All concept UUIDs we are looking for:', conceptUuids);
  // console.log(
  //   'DEBUG: Sample of all fetched obs concepts:',
  //   obsArray.slice(0, 10).map((obs) => ({
  //     concept: typeof obs.concept === 'string' ? obs.concept : obs.concept?.uuid,
  //     display: obs.display,
  //     value: obs.value,
  //   })),
  // );

  // Only keep obs matching our concepts
  obsArray = obsArray.filter((obs) => {
    if (!obs.concept) return false;
    if (typeof obs.concept === 'string') return conceptUuids.includes(obs.concept);
    if (obs.concept.uuid) return conceptUuids.includes(obs.concept.uuid);
    return false;
  });

  // console.log('Obs after concept filtering:', obsArray.length);
  // console.log(
  //   'DEBUG: Filtered obs sample:',
  //   obsArray.slice(0, 5).map((obs) => ({
  //     concept: typeof obs.concept === 'string' ? obs.concept : obs.concept?.uuid,
  //     display: obs.display,
  //     value: obs.value,
  //   })),
  // );
  // console.log('Form questions count:', questions.length);

  // Map answers
  const answers = {};
  questions.forEach((q) => {
    const concept = q.questionOptions?.concept;
    if (!concept) {
      answers[q.id] = undefined;
      return;
    }

    // Find all observations that match this concept (checkboxes may produce multiple obs)
    const matches = obsArray.filter((obs) => {
      if (!obs.concept) return false;
      if (typeof obs.concept === 'string') return obs.concept === concept;
      if (obs.concept.uuid) return obs.concept.uuid === concept;
      return false;
    });

    if (!matches || matches.length === 0) {
      answers[q.id] = undefined;
      return;
    }

    // Helper to extract a human-friendly value from an observation
    const extractObsValue = (obs: any) => {
      // First try to get the display value (like "HIV Impact Rating: 9")
      if (obs.display) {
        // For checkbox selections like "Factors Affecting Your Concern: Mental Health"
        // Extract the part after the colon
        const match = obs.display.match(/:\s*(.+)$/);
        if (match) return match[1].trim();
        return obs.display;
      }

      // For coded values, get the display of the coded value
      if (obs.valueCoded && typeof obs.valueCoded === 'object' && obs.valueCoded.display) {
        return obs.valueCoded.display;
      }

      // For direct values
      if (obs.value !== undefined && obs.value !== null) {
        if (typeof obs.value === 'object' && obs.value.display) return obs.value.display;
        return obs.value;
      }

      // Other value types
      if (obs.valueText) return obs.valueText;
      if (obs.valueNumeric !== undefined && obs.valueNumeric !== null) return obs.valueNumeric;
      if (obs.valueQuantity && obs.valueQuantity.value !== undefined) return obs.valueQuantity.value;
      if (obs.valueCoded) return obs.valueCoded;

      return undefined;
    };

    // Build pairs { value, time } so we can choose the most recent observation for single-value questions
    const getObsTime = (o: any) => {
      // prefer obsDatetime, fall back to auditInfo.dateCreated or resource date
      return (
        (o.obsDatetime && new Date(o.obsDatetime).getTime()) ||
        (o.auditInfo?.dateCreated && new Date(o.auditInfo.dateCreated).getTime()) ||
        (o.dateCreated && new Date(o.dateCreated).getTime()) ||
        0
      );
    };

    const extractedPairs = matches
      .map((m) => {
        const val = extractObsValue(m);
        return { value: val, time: getObsTime(m) };
      })
      .filter((p) => p.value !== undefined && p.value !== null);

    if (extractedPairs.length === 0) {
      answers[q.id] = undefined;
    } else {
      const rendering = q.questionOptions?.rendering;
      if (rendering === 'checkbox') {
        // For checkbox questions, we need to look for observations where the obs concept UUID
        // matches one of the ANSWER OPTION concept UUIDs, not the main question concept
        const selectedLabels = [];

        // console.log('DEBUG:', q.id, 'checkbox question:');
        // console.log('- Question concept:', concept);
        // console.log(
        //   '- Answer options:',
        //   q.questionOptions?.answers?.map((a) => `${a.concept}: ${a.label}`),
        // );
        // console.log('- Found observations:', matches.length);

        // // DEBUG: Show what's actually in the question concept observations
        // if (matches.length > 0 && q.id === 'as_domain') {
        //   console.log('- Sample question concept observations for as_domain:');
        //   matches.slice(0, 3).forEach((obs, i) => {
        //     console.log(`  [${i}] concept: ${typeof obs.concept === 'string' ? obs.concept : obs.concept?.uuid}`);
        //     console.log(`  [${i}] display: ${obs.display}`);
        //     console.log(`  [${i}] value: ${obs.value}`);
        //     console.log(`  [${i}] valueText: ${obs.valueText}`);
        //     console.log(`  [${i}] valueCoded: ${obs.valueCoded ? JSON.stringify(obs.valueCoded) : 'null'}`);
        //     console.log(`  [${i}] obsDatetime: ${obs.obsDatetime}`);
        //   });
        // }        // Simple approach: use the most recent observation's display/value from the 49 matching observations
        const recentObs = matches.sort(
          (a, b) => new Date(b.obsDatetime || 0).getTime() - new Date(a.obsDatetime || 0).getTime(),
        )[0];

        let observationValue = '';
        if (recentObs.display) observationValue = recentObs.display;
        else if (recentObs.value) observationValue = String(recentObs.value);
        else if (recentObs.valueText) observationValue = recentObs.valueText;

        // console.log('- Recent observation value:', observationValue);

        // Map English strings to Nepali labels (simple and direct)
        if (observationValue.includes('Mental Health')) selectedLabels.push('मानसिक स्वास्थ्य');
        if (observationValue.includes('Sexual') && observationValue.includes('Gender'))
          selectedLabels.push('लैङ्गिक तथा यौनिक अल्पसङ्ख्यक');
        if (observationValue.includes('immunodeficiency') || observationValue.includes('HIV'))
          selectedLabels.push('एचआईभी');
        if (observationValue.includes('Ethnic') && observationValue.includes('Minorities'))
          selectedLabels.push('जातीय अल्पसङ्ख्यक/दलित');

        answers[q.id] = selectedLabels.length > 0 ? selectedLabels : undefined;
        answers[q.id] = selectedLabels.length > 0 ? [...new Set(selectedLabels)] : undefined;
      } else {
        // Single-value question (radio/number/text): pick the most recent observation
        extractedPairs.sort((a, b) => b.time - a.time);
        // If multiple values exist, you can choose other strategies (max, average) — here we pick the latest
        answers[q.id] = extractedPairs[0].value;
      }
    }
  });

  // Debug: show final answers
  // console.log('Final answers object:', answers);
  // console.log(
  //   'Answers with values:',
  //   Object.entries(answers)
  //     .filter(([k, v]) => v !== undefined)
  //     .slice(0, 5),
  // );

  return answers;
}
import React, { useMemo } from 'react';
import { FormDisplay } from './formdisplay';
import formJson from '../सहभागी फारम.json'; // participant form
import counselorFormJson from '../काउन्सिलर फारम.json'; // counselor form
import ConunselorFormDisplay from './conunselorformdisplay';
// ART ID visualization component for reuse
// import MultiChartSelector from './stigma-data-aggregate'; // This line is wrong, will fix below

export function ArtIdVisualization({ patients }: { patients: any[] }) {
  const [artId, setArtId] = React.useState('');
  const [selectedPatientUuid, setSelectedPatientUuid] = React.useState<string | null>(null);
  const [patientAnswers, setPatientAnswers] = React.useState({});
  const [counselorAnswers, setCounselorAnswers] = React.useState({});

  // Fetch and map answers when patient is selected
  React.useEffect(() => {
    async function fetchAnswers() {
      if (!selectedPatientUuid) {
        setPatientAnswers({});
        return;
      }
      // Fetch answers for both participant form and counselor form in parallel
      try {
        const [participantAns, counselorAns] = await Promise.all([
          fetchPatientAnswers(selectedPatientUuid, formJson),
          fetchPatientAnswers(selectedPatientUuid, counselorFormJson),
        ]);
        setPatientAnswers(participantAns || {});
        setCounselorAnswers(counselorAns || {});
      } catch (err) {
        console.error('Error fetching answers for selected patient:', err);
        setPatientAnswers({});
        setCounselorAnswers({});
      }
    }
    fetchAnswers();
  }, [selectedPatientUuid]);

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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      <label>
        Enter ART ID:{' '}
        <input
          type="text"
          value={artId}
          onChange={(e) => setArtId(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: 4,
            border: '1px solid #ccc',
            marginRight: '1rem',
          }}
        />
        <button
          onClick={() => {
            const patient = patients.find(
              (p) =>
                p.identifier &&
                p.identifier.some((id) => id.value && id.value.toLowerCase() === artId.trim().toLowerCase()),
            );
            setSelectedPatientUuid(patient ? patient.id : null);
          }}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 4,
            border: 'none',
            background: '#0d8c7bff',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </label>
      <div style={{ width: '100%', marginTop: '2rem' }}>
        {selectedPatientUuid ? (
          <>
            <MultiChartSelector patientUuid={selectedPatientUuid} />
            <div style={{ marginTop: '2rem', width: '100%' }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0' }}>सहभागी फारम - उत्तरहरू</h4>
                  <FormDisplay formDefinition={formJson} answers={patientAnswers} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 8px 0' }}>Counselor Form</h4>
                  <ConunselorFormDisplay formDefinition={counselorFormJson} answers={counselorAnswers} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: '#888', fontSize: '1.1rem', marginTop: '2rem' }}>
            {artId ? 'No patient found for this ART ID.' : 'Please enter an ART ID: .'}
          </p>
        )}
      </div>
    </div>
  );
}
import { useCovidStigmaData } from './stigma-data.resource';
import { Line } from 'react-chartjs-2'; // Switched from Bar to Line
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { type CovidStigmaData } from './types';
// import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const DOMAIN_COLORS = {
  hiv: 'rgba(255,99,132,0.8)',
  mh: 'rgba(54,162,235,0.8)',
  sgm: 'rgba(255,206,86,0.8)',
  em: 'rgba(75,192,192,0.8)',
  intersectional: 'rgba(153,102,255,0.8)',
};

/* ---------------- Helpers ---------------- */
function parseDimensionScore(scoreStr: string) {
  const domainMap: Record<string, number> = { hiv: 0, mh: 0, sgm: 0, em: 0, intersectional: 0 };
  const mappings = [
    { key: 'hiv', label: 'एचआईभी' },
    { key: 'mh', label: 'मानसिक स्वास्थ्य' },
    { key: 'sgm', label: 'लैङ्गिक तथा यौनिक अल्पसङ्ख्यक' },
    { key: 'em', label: 'जातीय अल्पसङ्ख्यक/दलित' },
    { key: 'intersectional', label: 'इण्टरसेक्सनल' },
  ];

  mappings.forEach(({ key, label }) => {
    const regex = new RegExp(`${label}\\s*:?\\s*(\\d+)`);
    const match = scoreStr.match(regex);
    if (match) domainMap[key] = Number(match[1]);
  });

  return domainMap;
}

// Utility to map obs to answers for form questions
function mapObsToAnswers(obsArray, questions) {
  // console.log('DEBUG: mapObsToAnswers called');
  // console.log('DEBUG: obsArray', obsArray);
  // console.log(
  //   'DEBUG: questions',
  //   questions.map((q) => ({ id: q.id, concept: q.questionOptions?.concept, answers: q.questionOptions?.answers })),
  // );
  const answers = {};
  questions.forEach((q) => {
    // Match obs by concept UUID
    const concept = q.questionOptions?.concept;
    if (!concept) {
      answers[q.id] = undefined;
      return;
    }
    // Log concept being searched
    // console.log('DEBUG: Searching for concept', concept, 'for question', q.id);
    const obsMatch = obsArray.find((obs) => obs.concept === concept || (obs.concept && obs.concept.uuid === concept));
    // console.log('DEBUG: obsMatch for', q.id, obsMatch);
    if (obsMatch) {
      // Find the selected answer from questionOptions.answers
      const possibleAnswers = q.questionOptions.answers || [];
      // console.log('DEBUG: possibleAnswers for', q.id, possibleAnswers);
      // Try to match by concept or value
      const selected = possibleAnswers.find(
        (a) => a.concept === obsMatch.valueCoded || a.value === obsMatch.value || a.concept === obsMatch.value,
      );
      // console.log('DEBUG: selected answer for', q.id, selected);
      answers[q.id] = selected ? selected.value : obsMatch.value || obsMatch.valueCoded || 'Not answered';
    } else {
      answers[q.id] = undefined;
    }
  });
  return answers;
}

/* ---------------- Aggregation ---------------- */
const aggregateByType = (data: CovidStigmaData[]) => {
  return data.map((d) => {
    const parsed = d.dimensionScore
      ? parseDimensionScore(String(d.dimensionScore))
      : { hiv: 0, mh: 0, sgm: 0, em: 0, intersectional: 0 };

    // Use the intersectionalScore property directly
    if (d.intersectionalScore) {
      parsed.intersectional = Number(d.intersectionalScore);
    }

    return {
      type: d.stigmaType || 'Unknown',
      totals: parsed,
    };
  });
};

const aggregateByDate = (data: CovidStigmaData[]) => {
  return data
    .map((d) => {
      const parsed = d.dimensionScore
        ? parseDimensionScore(String(d.dimensionScore))
        : { hiv: 0, mh: 0, sgm: 0, em: 0, intersectional: 0 };

      // Use the intersectionalScore property directly
      if (d.intersectionalScore) {
        parsed.intersectional = Number(d.intersectionalScore);
      }

      return {
        date: d.date,
        totals: parsed, // 👈 no forced sum
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
/* ---------------- Chart Components ---------------- */
// Responsive Bar chart for stigma data
/* Commenting out the Bar Chart as requested
function TypeDimensionBarChart({ data }: { data: ReturnType<typeof aggregateByType> }) {
  // Define the domains and their labels
  const domainKeys = ['hiv', 'mh', 'sgm', 'em', 'intersectional'] as const;
  const domainLabels = {
    hiv: 'एचआईभी',
    mh: 'मानसिक स्वास्थ्य',
    sgm: 'लैङ्गिक तथा यौनिक अल्पसङ्ख्यक',
    em: 'जातीय अल्पसङ्ख्यक/दलित',
    intersectional: 'इण्टरसेक्सनल',
  };
  // Prepare datasets for each domain
  const datasets = domainKeys.map((key) => ({
    label: domainLabels[key],
    data: data.map((d) => d.totals[key]),
    backgroundColor: DOMAIN_COLORS[key],
  }));
  // Render a responsive Bar chart that fills its container
  return (
    <Bar
      data={{ labels: data.map((d) => d.type), datasets }}
      options={{
        responsive: true,
        maintainAspectRatio: false, // Fill parent container
        plugins: {
          title: { display: true, text: 'Stigma Scores Across Type × Dimension' },
          legend: { position: 'top' },
        },
        scales: {
          x: { stacked: false, title: { display: true, text: 'Stigma Type' } },
          y: { stacked: false, title: { display: true, text: 'Score' } },
        },
      }}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
*/

function StigmaLineChart({ data }: { data: ReturnType<typeof aggregateByDate> }) {
  // Format labels as Day Month Year
  const labels = data.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' });
  });

  const domainLabels = {
    hiv: 'एचआईभी',
    mh: 'मानसिक स्वास्थ्य',
    sgm: 'लैङ्गिक तथा यौनिक अल्पसङ्ख्यक',
    em: 'जातीय अल्पसङ्ख्यक/दलित',
    intersectional: 'इण्टरसेक्सनल',
  };

  const datasets = Object.keys(DOMAIN_COLORS).map((key) => ({
    label: domainLabels[key as keyof typeof domainLabels],
    data: data.map((d) => d.totals[key]),
    borderColor: DOMAIN_COLORS[key as keyof typeof DOMAIN_COLORS],
    backgroundColor: DOMAIN_COLORS[key as keyof typeof DOMAIN_COLORS],
    fill: false,
    tension: 0.2,
  }));

  return (
    <Line
      data={{ labels, datasets }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Stigma Scores Trends' },
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function (context) {
                const index = context.dataIndex;
                const d = data[index];
                return `${context.dataset.label}: ${context.parsed.y} (Date: ${new Date(d.date).toLocaleDateString()})`;
              },
            },
          },
        },
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Score' }, beginAtZero: true },
        },
      }}
    />
  );
}

/* ---------------- Wrapper ---------------- */
// MultiChartSelector: Responsive, modern chart container for workspace
export default function MultiChartSelector({
  patientUuid,
  filterByDate,
}: {
  patientUuid: string;
  filterByDate?: string;
}) {
  // Fetch data for the patient
  const { data, isLoading, error } = useCovidStigmaData(patientUuid);

  // Filter data by date if specified
  const filteredData = useMemo(() => {
    if (!data || !filterByDate) return data;

    return data.filter((item) => {
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      return itemDate === filterByDate;
    });
  }, [data, filterByDate]);

  // Prepare chart data
  const dateData = useMemo(() => (filteredData ? aggregateByDate(filteredData) : []), [filteredData]);

  // Loading and error states
  if (isLoading) return <p>Loading stigma data...</p>;
  if (error) return <p style={{ color: 'red' }}>Failed to load stigma data.</p>;
  if (!filteredData?.length) return <p>No stigma data available{filterByDate ? ' for selected visit' : ''}</p>;

  // Responsive, modern card container
  return (
    <div
      // Card style: responsive, shadow, rounded, centered
      style={{
        width: '100%',
        maxWidth: 700,
        minWidth: 0,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Responsive chart area: fills card, not congested */}
      <div style={{ width: '100%', minHeight: 400, height: '50vw', maxHeight: 600 }}>
        <StigmaLineChart data={dateData} />
      </div>
    </div>
  );
}

// export ArtIdVisualization({ patients }: { patients: any[] }) {
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
