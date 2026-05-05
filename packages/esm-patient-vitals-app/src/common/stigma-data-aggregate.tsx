// Async function to fetch and map patient answers by concept UUID
export async function fetchPatientAnswers(patientUuid: string, formJson: any) {
  // Flatten all questions
  const questions: any[] = [];
  formJson.pages.forEach((page: any) =>
    page.sections.forEach((section: any) => section.questions.forEach((q: any) => questions.push(q))),
  );
  // Get all concept UUIDs - both question concepts and answer option concepts
  const conceptUuids: string[] = [];
  questions.forEach((q) => {
    // Add main question concept
    if (q.questionOptions?.concept) {
      conceptUuids.push(q.questionOptions.concept);
    }
    // For checkbox questions, also add all answer option concepts
    if (q.questionOptions?.rendering === 'checkbox' && q.questionOptions?.answers) {
      q.questionOptions.answers.forEach((answer: any) => {
        if (answer.concept) {
          conceptUuids.push(answer.concept);
        }
      });
    }
  });

  // Fetch all obs for patient, handling pagination
  let obsArray: any[] = [];
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
          data.links && Array.isArray(data.links) ? data.links.find((l: any) => l.rel === 'next')?.uri || null : null;
      } else {
        console.error('API error', response.status, nextUrl);
        break;
      }
    }
  } catch (err) {
    console.error('Fetch error', err, nextUrl);
  }

  // Only keep obs matching our concepts
  obsArray = obsArray.filter((obs) => {
    if (!obs.concept) return false;
    if (typeof obs.concept === 'string') return conceptUuids.includes(obs.concept);
    if (obs.concept.uuid) return conceptUuids.includes(obs.concept.uuid);
    return false;
  });

  // Keep only observations from the latest encounter so ART ID view reflects a single form submission.
  const getObsTime = (o: any) => {
    return (
      (o.obsDatetime && new Date(o.obsDatetime).getTime()) ||
      (o.auditInfo?.dateCreated && new Date(o.auditInfo.dateCreated).getTime()) ||
      (o.dateCreated && new Date(o.dateCreated).getTime()) ||
      0
    );
  };

  const encounterUuidByObsUuid = new Map<string, string>();
  const encounterLatestTime = new Map<string, number>();

  obsArray.forEach((obs: any) => {
    const obsUuid = obs?.uuid;
    const encounterUuid = obs?.encounter?.uuid;
    if (obsUuid && encounterUuid) {
      encounterUuidByObsUuid.set(obsUuid, encounterUuid);
      const t = getObsTime(obs);
      const prev = encounterLatestTime.get(encounterUuid) ?? 0;
      if (t > prev) {
        encounterLatestTime.set(encounterUuid, t);
      }
    }
  });

  if (encounterLatestTime.size > 0) {
    let latestEncounterUuid: string | undefined;
    let latestTime = 0;
    for (const [encUuid, t] of encounterLatestTime.entries()) {
      if (t > latestTime) {
        latestTime = t;
        latestEncounterUuid = encUuid;
      }
    }

    if (latestEncounterUuid) {
      obsArray = obsArray.filter((obs: any) => obs?.encounter?.uuid === latestEncounterUuid);
    }
  }

  // Helpers for strict concept-based mapping
  const getConceptUuid = (obs: any) => {
    if (!obs?.concept) return undefined;
    if (typeof obs.concept === 'string') return obs.concept;
    return obs.concept.uuid;
  };

  const getCodedValueUuid = (obs: any) => {
    const directValue = obs?.value;
    if (typeof directValue === 'string') return directValue;
    if (directValue && typeof directValue === 'object' && directValue.uuid) return directValue.uuid;
    if (obs?.valueCoded && typeof obs.valueCoded === 'object' && obs.valueCoded.uuid) return obs.valueCoded.uuid;
    return undefined;
  };

  const extractSingleValue = (obs: any) => {
    const codedUuid = getCodedValueUuid(obs);
    if (codedUuid !== undefined && codedUuid !== null) return codedUuid;
    if (obs?.valueNumeric !== undefined && obs?.valueNumeric !== null) return obs.valueNumeric;
    if (obs?.valueQuantity?.value !== undefined && obs?.valueQuantity?.value !== null) return obs.valueQuantity.value;
    if (obs?.valueText !== undefined && obs?.valueText !== null) return obs.valueText;
    if (obs?.value !== undefined && obs?.value !== null) {
      if (typeof obs.value === 'object' && obs.value.display) return obs.value.display;
      return obs.value;
    }
    if (obs?.display) {
      const match = String(obs.display).match(/:\s*(.+)$/);
      return match ? match[1].trim() : obs.display;
    }
    return undefined;
  };

  // Build deterministic per-concept queues so repeated concept UUIDs map to distinct repeated questions.
  const obsByConcept = new Map<string, any[]>();
  obsArray.forEach((obs: any) => {
    const concept = getConceptUuid(obs);
    if (!concept) return;
    const existing = obsByConcept.get(concept) || [];
    existing.push(obs);
    obsByConcept.set(concept, existing);
  });

  for (const [concept, list] of obsByConcept.entries()) {
    list.sort((a, b) => getObsTime(a) - getObsTime(b));
    obsByConcept.set(concept, list);
  }

  const conceptReadIndex = new Map<string, number>();
  const getObsGroupKey = (obs: any) => {
    const groupUuid = obs?.obsGroup?.uuid;
    return typeof groupUuid === 'string' && groupUuid.length > 0 ? groupUuid : undefined;
  };

  const consumeObsPacketForConcept = (concept: string) => {
    const list = obsByConcept.get(concept) || [];
    if (!list.length) return [] as any[];

    const start = conceptReadIndex.get(concept) || 0;
    if (start >= list.length) return [] as any[];

    const first = list[start];
    const packet: any[] = [first];
    let nextIndex = start + 1;

    // If observations are grouped, consume the whole group as one logical answer packet.
    const firstGroup = getObsGroupKey(first);
    if (firstGroup) {
      while (nextIndex < list.length && getObsGroupKey(list[nextIndex]) === firstGroup) {
        packet.push(list[nextIndex]);
        nextIndex += 1;
      }
    }

    conceptReadIndex.set(concept, nextIndex);
    return packet;
  };

  // Map answers
  const answers: Record<string, any> = {};
  questions.forEach((q) => {
    const questionConcept = q.questionOptions?.concept;
    if (!questionConcept) {
      answers[q.id] = undefined;
      return;
    }

    const rendering = q.questionOptions?.rendering;
    const optionConcepts: string[] = (q.questionOptions?.answers || [])
      .map((a: any) => a?.concept)
      .filter((c: any) => typeof c === 'string');

    const matchesByQuestionConcept = obsArray.filter((obs) => getConceptUuid(obs) === questionConcept);

    if (rendering === 'checkbox') {
      // Consume only the next packet for this repeated concept to avoid cross-section leakage.
      const selectedOptionConcepts = new Set<string>();

      const packet = consumeObsPacketForConcept(questionConcept);

      packet.forEach((obs) => {
        const coded = getCodedValueUuid(obs);
        if (coded && optionConcepts.includes(coded)) selectedOptionConcepts.add(coded);
      });

      answers[q.id] = selectedOptionConcepts.size > 0 ? Array.from(selectedOptionConcepts) : undefined;
      return;
    }

    if (matchesByQuestionConcept.length === 0) {
      answers[q.id] = undefined;
      return;
    }

    // Single-value question: consume next observation packet for this concept.
    const packet = consumeObsPacketForConcept(questionConcept);
    const selectedObs = packet.length ? packet[packet.length - 1] : undefined;
    answers[q.id] = selectedObs ? extractSingleValue(selectedObs) : undefined;
  });

  return answers;
}
import React, { useMemo } from 'react';
import { FormDisplay } from './formdisplay';
import formJson from '../participate.json'; // participant form
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
                p.identifier.some((id: any) => id.value && id.value.toLowerCase() === artId.trim().toLowerCase()),
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
                  <FormDisplay formDefinition={formJson} answers={patientAnswers} showAllQuestions />
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
import { Bar, Line } from 'react-chartjs-2'; // Switched from Bar to Line
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
    const regex = new RegExp(`${label}\\s*:?\\s*(\\d+(?:\\.\\d+)?)`);
    const match = scoreStr.match(regex);
    if (match) domainMap[key] = Number(match[1]);
  });

  return domainMap;
}

// Utility to map obs to answers for form questions
function mapObsToAnswers(obsArray: any[], questions: any[]) {
  // console.log('DEBUG: mapObsToAnswers called');
  // console.log('DEBUG: obsArray', obsArray);
  // console.log(
  //   'DEBUG: questions',
  //   questions.map((q) => ({ id: q.id, concept: q.questionOptions?.concept, answers: q.questionOptions?.answers })),
  // );
  const answers: Record<string, any> = {};
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
        (a: any) => a.concept === obsMatch.valueCoded || a.value === obsMatch.value || a.concept === obsMatch.value,
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

      if (d.intersectionalScore) {
        parsed.intersectional = Number(d.intersectionalScore);
      }

      const overall = d.as_score ?? d.es_score ?? d.is_score ?? 0;
      (parsed as any).overall = overall;

      return {
        date: d.date,
        totals: parsed,
      };
    })
    .sort((a, b) => new Date(a.date ?? '').getTime() - new Date(b.date ?? '').getTime());
};

const aggregateByDateGrouped = (data: CovidStigmaData[]) => {
  const grouped: Record<string, { date: string; records: any[] }> = {};

  const safeNum = (v: any): number => {
    if (v === null || v === undefined || v === '') return 0;
    if (typeof v === 'number') return v;
    const s = String(v).trim();
    const match = s.match(/-?\d+(?:\.\d+)?/);
    if (!match) return 0;
    const n = parseFloat(match[0]);
    return Number.isFinite(n) ? n : 0;
  };

  data.forEach((d) => {
    const dDate = d.date ? new Date(d.date) : new Date(0);
    const dateStr = `${dDate.getFullYear()}-${String(dDate.getMonth() + 1).padStart(2, '0')}-${String(dDate.getDate()).padStart(2, '0')}`;

    if (!grouped[dateStr]) {
      grouped[dateStr] = { date: d.date ?? '', records: [] };
    }

    const parsed = d.dimensionScore
      ? parseDimensionScore(String(d.dimensionScore))
      : { hiv: 0, mh: 0, sgm: 0, em: 0, intersectional: 0 };

    const totals: Record<string, number> = {
      hiv: d.hiv_domain_as ?? d.hiv_domain_es ?? d.hiv_domain_is ?? parsed.hiv,
      mh: d.mh_domain_as ?? d.mh_domain_es ?? d.mh_domain_is ?? parsed.mh,
      sgm: d.sgm_domain_as ?? d.sgm_domain_es ?? d.sgm_domain_is ?? parsed.sgm,
      em: d.em_domain_as ?? d.em_domain_es ?? d.em_domain_is ?? parsed.em,
      intersectional:
        d.intersectional_stigma_as ??
        d.intersectional_stigma_es ??
        d.intersectional_stigma_is ??
        safeNum(d.intersectionalScore),
      overall: d.as_score ?? d.es_score ?? d.is_score ?? safeNum(d.stigmaScore),
    };

    grouped[dateStr].records.push({
      type: d.stigmaType || 'Unknown',
      totals,
      as_score: d.as_score,
      es_score: d.es_score,
      is_score: d.is_score,
      stigmaScore: d.stigmaScore,
    });
  });

  const result = Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return result;
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

function normalizeStigmaType(raw?: string) {
  const s = String(raw || '').toLowerCase();
  if (s.includes('आत्म') || s.includes('internal')) return 'आत्मलान्छना';
  if (s.includes('अपेक्षित') || s.includes('anticip')) return 'अपेक्षित लान्छना';
  if (s.includes('व्यावहारिक') || s.includes('enact')) return 'व्यावहारिक लान्छना';
  return 'Unknown';
}

function safeScore(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = parseFloat(String(value).trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function getStigmaScore(record: any, targetType: string) {
  if (!record) return 0;

  const scoreField =
    targetType === 'आत्मलान्छना'
      ? record.is_score
      : targetType === 'अपेक्षित लान्छना'
      ? record.as_score
      : targetType === 'व्यावहारिक लान्छना'
      ? record.es_score
      : undefined;

  return (
    safeScore(scoreField) ||
    safeScore(record.stigmaScore) ||
    safeScore(record.totals?.overall) ||
    safeScore(record.totals?.as_score) ||
    safeScore(record.totals?.es_score) ||
    safeScore(record.totals?.is_score)
  );
}

function VisitStigmaBarChart({ groupedVisits }: { groupedVisits: ReturnType<typeof aggregateByDateGrouped> }) {
  if (!groupedVisits || !groupedVisits.length) return null;

  const stigmaTypes = ['आत्मलान्छना', 'अपेक्षित लान्छना', 'व्यावहारिक लान्छना'];
  const visitEntries = groupedVisits.slice(0, 3);
  const visitLabels = visitEntries.map((entry, index) =>
    index === 0 ? '1st visit' : index === 1 ? '2nd visit' : index === 2 ? '3rd visit' : `${index + 1}th visit`,
  );

  const datasets = visitEntries.map((entry, visitIndex) => {
    const visitScores = stigmaTypes.map((type) => {
      const matchedRecord = entry.records.find((record: any) => normalizeStigmaType(record.type) === type);
      return getStigmaScore(matchedRecord, type);
    });

    const colors = ['rgba(255, 99, 132, 0.85)', 'rgba(54, 162, 235, 0.85)', 'rgba(75, 192, 192, 0.85)'];
    const borderColors = ['#d32f2f', '#1565c0', '#2e7d32'];

    return {
      label: visitLabels[visitIndex],
      data: visitScores,
      backgroundColor: colors[visitIndex % colors.length],
      borderColor: borderColors[visitIndex % borderColors.length],
      borderWidth: 1,
      borderRadius: 6,
      barPercentage: 0.7,
      categoryPercentage: 0.8,
    };
  });

  return (
    <Bar
      data={{ labels: stigmaTypes, datasets }}
      plugins={[
        {
          id: 'datalabels-stigma-types',
          afterDatasetsDraw: (chart: any) => {
            const ctx = chart.ctx;
            ctx.save();
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
              const meta = chart.getDatasetMeta(datasetIndex);
              meta.data.forEach((bar: any, index: number) => {
                const value = dataset.data[index];
                if (value !== undefined && value !== null) {
                  ctx.fillStyle = '#333';
                  ctx.fillText(value.toFixed(1), bar.x, bar.y - 8);
                }
              });
            });
            ctx.restore();
          },
        },
      ]}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Visit-wise Stigma Scores by Type', font: { size: 16 } },
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const value = typeof context.raw === 'number' ? context.raw.toFixed(1) : context.raw;
                return `${context.dataset.label}: ${value}`;
              },
            },
          },
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Score' } },
          x: { title: { display: true, text: 'Stigma Type' } },
        },
      }}
    />
  );
}

function StigmaLineChart({ data }: { data: ReturnType<typeof aggregateByDate> }) {
  // Format labels as Day Month Year
  const labels = data.map((d) => {
    const date = new Date(d.date ?? '');
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
    data: data.map((d) => (d.totals as any)[key]),
    borderColor: DOMAIN_COLORS[key as keyof typeof DOMAIN_COLORS],
    backgroundColor: DOMAIN_COLORS[key as keyof typeof DOMAIN_COLORS],
    fill: false,
    tension: 0.2,
  }));

  return (
    <Line
      data={{ labels, datasets }}
      plugins={[
        {
          id: 'datalabels-line',
          afterDatasetsDraw: (chart: any) => {
            const ctx = chart.ctx;
            ctx.save();
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
              const meta = chart.getDatasetMeta(datasetIndex);
              ctx.fillStyle = dataset.borderColor;
              meta.data.forEach((point: any, index: number) => {
                const value = dataset.data[index];
                if (value !== null) {
                  ctx.fillText(value, point.x, point.y - 8);
                }
              });
            });
            ctx.restore();
          },
        },
      ]}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Stigma Scores Trends' },
          legend: { position: 'bottom' },
          tooltip: {
            enabled: false,
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
  chartType = 'line',
}: {
  patientUuid: string;
  filterByDate?: string;
  chartType?: 'line' | 'bar';
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
  const dateDataLine = useMemo(() => (filteredData ? aggregateByDate(filteredData) : []), [filteredData]);
  const dateDataGrouped = useMemo(() => (filteredData ? aggregateByDateGrouped(filteredData) : []), [filteredData]);

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
        {chartType === 'bar' ? (
          <VisitStigmaBarChart groupedVisits={dateDataGrouped} />
        ) : (
          <StigmaLineChart data={dateDataLine} />
        )}
      </div>
    </div>
  );
}
