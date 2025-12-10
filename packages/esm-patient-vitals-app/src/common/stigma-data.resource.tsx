import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';
import type { VitalsTableRow } from '../vitals/types';
import type { ObservationInterpretation } from './types';
import React, { useState } from 'react';
// import hivGuidelinesImg from '../common/img/National HIV testing and treatment guidelines.png';
// import unaids from '../common/img/UNAIDS terminology guideline.png';
import qr1hivawareness from '../common/img/QR1_HIV awareness_NAPN.png';
import qr2tpo from '../common/img/QR2_TPO_Managing fear.png';
import qr3bds from '../common/img/QR3_BDS_Ideal World.png';
import qr4artadherence from '../common/img/QR4_Treatment adherence video(उपचार पालना)_NCASC.png';

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
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'auto',
          position: 'relative',
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
            fontSize: '20px',
            cursor: 'pointer',
            color: '#333',
          }}
          onClick={onClose}
        >
          ✕
        </button>
        <img
          src={imageUrl}
          alt={altText}
          style={{
            maxWidth: '100%',
            maxHeight: 'calc(90vh - 60px)',
            objectFit: 'contain',
            display: 'block',
            margin: '0 auto',
          }}
        />
        <p style={{ textAlign: 'center', marginTop: '10px' }}>{altText}</p>
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

/* ---------------- Types ---------------- */
export interface StigmaData {
  [x: string]: any;
  id: string;
  date: string; // encounterDatetime ISO
  stigmaType: string; // 'एन्टिसिपेटेड Stigma' | 'व्यावहारिक लान्छना ' | 'आत्मलान्छना '
  stigmaScore: string | number;
  dimensionType: string;
  dimensionScore: string | number | string[]; // e.g. "HIV:86, MH:0, SGM:0, EM:0"
  intersectionalScore: string | number;
  encounterUuid: string;

  // normalized numeric fields
  as_score?: number;
  es_score?: number;
  is_score?: number;
  hiv_domain_as?: number;
  mh_domain_as?: number;
  sgm_domain_as?: number;
  em_domain_as?: number;
  intersectional_stigma_as?: number;
  hiv_domain_es?: number;
  mh_domain_es?: number;
  sgm_domain_es?: number;
  em_domain_es?: number;
  intersectional_stigma_es?: number;
  hiv_domain_is?: number;
  mh_domain_is?: number;
  sgm_domain_is?: number;
  em_domain_is?: number;
  intersectional_stigma_is?: number;
}

/* ---------------- Hook ---------------- */
export function useCovidStigmaData(patientUuid: string) {
  const swrKey = patientUuid ? `${restBaseUrl}/encounter?patient=${patientUuid}&v=full&limit=100` : null;

  const { data, error, isLoading, mutate } = useSWR(swrKey, async (url: string) => {
    const response = await openmrsFetch(url);
    const encounters = (response.data?.results as any[]) || [];
    if (!encounters?.length) return [] as StigmaData[];

    const stigmaData: StigmaData[] = [];

    // Parse a value into a number. If the value is a string like "31/36" or "112/120",
    // extract the first numeric token (e.g. 31 or 112) rather than concatenating digits.
    const num = (v: any): number => {
      if (v === null || v === undefined || v === '') return 0;
      if (typeof v === 'number') return v;
      const s = String(v).trim();
      const match = s.match(/-?\d+(?:\.\d+)?/);
      if (!match) return 0;
      const n = parseFloat(match[0]);
      return Number.isFinite(n) ? n : 0;
    };

    const getObsVal = (enc: any, conceptUuid: string) => {
      const obs = enc.obs?.find((o: any) => o.concept?.uuid === conceptUuid);
      if (!obs) return null;
      return obs.value?.display ?? obs.value ?? null;
    };

    for (const enc of encounters) {
      const rawAS = getObsVal(enc, 'b5be0487-ef8e-4c39-ad86-39dd341cf0a7');
      const rawAS_inter = getObsVal(enc, '260b7159-9cc9-442d-b641-133b5dbbce06');
      const rawES = getObsVal(enc, '367a6a1f-b951-4eac-8068-a5f0801d6aff');
      const rawES_inter = getObsVal(enc, 'fb3a85e9-5154-46f7-8c00-54cce586332c');
      const rawIS = getObsVal(enc, '3f318839-599e-47d7-96f5-4c81ca64dfc3');
      const rawIS_inter = getObsVal(enc, '54addbef-17f5-4678-988a-9d6a68ad38f7');

      // Domains
      const hivAS = num(getObsVal(enc, '90e0da1c-1bb4-48db-869e-d0ed4cd11c24'));
      const mhAS = num(getObsVal(enc, '8f94f4c3-58f2-414a-9286-68c5ede9c46e'));
      const sgmAS = num(getObsVal(enc, 'eb0a135d-3b90-470c-a684-d6dc3464712d'));
      const emAS = num(getObsVal(enc, 'd1ccc9dc-92fa-4118-af50-6394295131f8'));

      const hivES = num(getObsVal(enc, '6a0fbece-ed88-4da2-9cb2-6db7848dbdfd'));
      const mhES = num(getObsVal(enc, '7ed8a592-dac5-4c7b-b9c0-3ac6126689b8'));
      const sgmES = num(getObsVal(enc, '5c10bc7a-332c-4586-94f2-fbb90b8a264d'));
      const emES = num(getObsVal(enc, '298384cf-8f27-4ec0-93ca-4657eb66c8a1'));

      const hivIS = num(getObsVal(enc, 'ea081a06-b663-40f0-b74c-ede85468ed89'));
      const mhIS = num(getObsVal(enc, 'ef14a69f-b4fa-4fcd-8699-6b827bb67525'));
      const sgmIS = num(getObsVal(enc, '79c9043f-3cb6-41b2-b189-6018cb9b2bde'));
      const emIS = num(getObsVal(enc, '373eca5f-bc30-4b5e-a799-c50931731209')); 

      const asScore = num(rawAS);
      const esScore = num(rawES);
      const isScore = num(rawIS);

      if (rawAS != null) {
        stigmaData.push({
          id: `${enc.uuid}-एन्टिसिपेटेड`,
          date: enc.encounterDatetime,
          stigmaType: 'अपेक्षित लान्छना',
          stigmaScore: `${rawAS}/36`, 
          as_score: asScore,
          dimensionType: [hivAS, mhAS, sgmAS, emAS].some((s) => s > 0) ? 'Domains' : '',
          dimensionScore: `एचआईभी :${hivAS}/60, मानसिक स्वास्थ्य:${mhAS}/60, लैङ्गिक तथा यौनिक अल्पसङ्ख्यक:${sgmAS}/60, जातीय अल्पसङ्ख्यक/दलित:${emAS}/60`,
          hiv_domain_as: hivAS,
          mh_domain_as: mhAS,
          sgm_domain_as: sgmAS,
          em_domain_as: emAS,
          intersectionalScore: rawAS_inter ?? 0,
          intersectional_stigma_as: num(rawAS_inter),
          encounterUuid: enc.uuid,
        });
      }

      if (rawES != null) {
        stigmaData.push({
          id: `${enc.uuid}-enacted`,
          date: enc.encounterDatetime,
          stigmaType: 'व्यावहारिक लान्छना',
          stigmaScore: `${rawES}/13`, 
          es_score: esScore,
          dimensionType: [hivES, mhES, sgmES, emES].some((s) => s > 0) ? 'Domains' : '',
          dimensionScore: `एचआईभी:${hivES}/65, मानसिक स्वास्थ्य:${mhES}/65, लैङ्गिक तथा यौनिक अल्पसङ्ख्यक:${sgmES}/65, जातीय अल्पसङ्ख्यक/दलित:${emES}/65`,
          hiv_domain_es: hivES,
          mh_domain_es: mhES,
          sgm_domain_es: sgmES,
          em_domain_es: emES,
          intersectionalScore: rawES_inter ?? 0,
          intersectional_stigma_es: num(rawES_inter),
          encounterUuid: enc.uuid,
        });
      }

      if (rawIS != null) {
        stigmaData.push({
          id: `${enc.uuid}-internalized`,
          date: enc.encounterDatetime,
          stigmaType: 'आत्मलान्छना',
          stigmaScore: `${rawIS}/30`, 
          is_score: isScore,
          dimensionType: [hivIS, mhIS, sgmIS, emIS].some((s) => s > 0) ? 'Domains' : '',
          dimensionScore: `एचआईभी:${hivIS}/50, मानसिक स्वास्थ्य:${mhIS}/50, लैङ्गिक तथा यौनिक अल्पसङ्ख्यक:${sgmIS}/50, जातीय अल्पसङ्ख्यक/दलित:${emIS}/50`,
          hiv_domain_is: hivIS,
          mh_domain_is: mhIS,
          sgm_domain_is: sgmIS,
          em_domain_is: emIS,
          intersectionalScore: rawIS_inter ?? 0,
          intersectional_stigma_is: num(rawIS_inter),
          encounterUuid: enc.uuid,
        });
      }
    }

    return stigmaData;
  });

  return {
    data: (data as StigmaData[]) || [],
    error,
    isLoading,
    mutate,
  };
}

// helper: show dimension scores with correct color thresholds
// Color based on clinical cutoff, display shows total possible score (denominator)
function renderColoredValue(
  label: string,
  value: number | undefined,
  displayDenominator: number,
  clinicalCutoff: number,
) {
  // Show "Low" when below cutoff, otherwise show value/denominator in red

  return (
    <div key={label} style={{ display: 'block', marginBottom: '8px', whiteSpace: 'nowrap' }}>
      <span style={{ fontWeight: 'bold' }}>
        {label}:{' '}
        {value == null ? null : value < clinicalCutoff ? (
          <span style={{ color: '#5993ebff', fontWeight: 'bold' }}>Low</span>
        ) : (
          <span style={{ color: 'red' }}>
            {value}/{displayDenominator}
          </span>
        )}
      </span>
    </div>
  );
}

// helper for rendering just the score value with color
// Show "Low" when below clinical cutoff, otherwise show score in red
function renderScoreOnly(
  scoreText: string,
  rawValue: number | undefined,
  displayDenominator: number,
  clinicalCutoff: number,
) {
  if (rawValue == null) return null;

  if (rawValue < clinicalCutoff) {
    return <span style={{ color: '#5993ebff', fontWeight: 'bold' }}>Low</span>;
  }

  return <span style={{ color: 'red', fontWeight: 'bold' }}>{scoreText}</span>;
}

// helper for rendering intersectional score - shows the value with conditional color
// Uses display denominator for UI (240/260/200) but compares against clinical cutoff for color
function renderIntersectionalScore(value: number | undefined, clinicalCutoff: number, displayDenominator: number) {
  if (value == null) return null;
  const color = value >= clinicalCutoff ? 'red' : '#5993ebff';
  return (
    <span style={{ color, fontWeight: 'bold' }}>
      {value}/{displayDenominator}
    </span>
  );
}

export function mapStigmaDataToVitalsFormat(
  stigmaData: StigmaData[],
  type: 'अपेक्षित लान्छना' | 'व्यावहारिक लान्छना' | 'आत्मलान्छना',
): VitalsTableRow[] {
  const seen = new Set<string>();

  return stigmaData
    .filter((d) => {
      const key = `${d.encounterUuid}-${d.stigmaType}`;
      if (d.stigmaType === type && !seen.has(key)) {
        seen.add(key);
        return true;
      }
      return false;
    })
    .map((d) => {
      // Get the right stigma score cutoff based on type
      const stigmaScoreCutoff =
        d.stigmaType === 'अपेक्षित लान्छना'
          ? 12 // as_score >= 12
          : d.stigmaType === 'व्यावहारिक लान्छना'
            ? 4 // es_score >= 4
            : 10; // is_score >= 10 (for आत्मलान्छना)

      // cutoff values for dimensions (clinical thresholds for color)
      const dimensionClinicalCutoff =
        d.stigmaType === 'अपेक्षित लान्छना' ? 20 : d.stigmaType === 'व्यावहारिक लान्छना' ? 22 : 17;

      // display denominators for dimensions (shown in UI)
      const dimensionDisplayDenominator =
        d.stigmaType === 'अपेक्षित लान्छना' ? 60 : d.stigmaType === 'व्यावहारिक लान्छना' ? 65 : 50;

      // Clinical cutoff values for intersectional stigma (for matching logic only)
      const intersectionalCutoff =
        d.stigmaType === 'अपेक्षित लान्छना' ? 40 : d.stigmaType === 'व्यावहारिक लान्छना' ? 43 : 33;

      // Display denominators for intersectional stigma (shown in UI)
      const intersectionalDisplayDenominator =
        d.stigmaType === 'अपेक्षित लान्छना' ? 240 : d.stigmaType === 'व्यावहारिक लान्छना' ? 260 : 200;

      // build JSX fragment with colored domains
      const dimensionScoreRender = (
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '-4px' }}>
          {renderColoredValue(
            'एचआईभी',
            d.hiv_domain_as ?? d.hiv_domain_es ?? d.hiv_domain_is,
            dimensionDisplayDenominator,
            dimensionClinicalCutoff,
          )}
          {renderColoredValue(
            'मानसिक स्वास्थ्य',
            d.mh_domain_as ?? d.mh_domain_es ?? d.mh_domain_is,
            dimensionDisplayDenominator,
            dimensionClinicalCutoff,
          )}
          {renderColoredValue(
            'लैङ्गिक तथा यौनिक अल्पसङ्ख्यक',
            d.sgm_domain_as ?? d.sgm_domain_es ?? d.sgm_domain_is,
            dimensionDisplayDenominator,
            dimensionClinicalCutoff,
          )}
          {renderColoredValue(
            'जातीय अल्पसङ्ख्यक/दलित',
            d.em_domain_as ?? d.em_domain_es ?? d.em_domain_is,
            dimensionDisplayDenominator,
            dimensionClinicalCutoff,
          )}
        </div>
      );

      // build JSX for stigma score - showing colored score based on stigma type
      const stigmaScoreValue =
        d.stigmaType === 'अपेक्षित लान्छना'
          ? d.as_score
          : d.stigmaType === 'व्यावहारिक लान्छना'
            ? d.es_score
            : d.is_score;

      // determine display denominator per stigma type (these are the totals shown in UI)
      const displayDenominator =
        d.stigmaType === 'अपेक्षित लान्छना' ? 36 : d.stigmaType === 'व्यावहारिक लान्छना' ? 13 : 30;

      const stigmaScoreRender = renderScoreOnly(
        String(d.stigmaScore), // formatted score with total (e.g., "5/36")
        stigmaScoreValue, // raw score for color comparison
        displayDenominator,
        stigmaScoreCutoff, // clinical cutoff for color
      );

      // build JSX for intersectional score - always showing the number with conditional color
      const intersectionalRender = renderIntersectionalScore(
        d.intersectional_stigma_as ?? d.intersectional_stigma_es ?? d.intersectional_stigma_is,
        intersectionalCutoff,
        intersectionalDisplayDenominator,
      );

      return {
        id: d.id,
        date: d.date,
        temperatureRender: d.stigmaType || '',
        bloodPressureRender: stigmaScoreRender,
        pulseRender: d.dimensionType || '',
        respiratoryRateRender: dimensionScoreRender,
        spo2Render: intersectionalRender,
        dateRender: d.date ? new Date(d.date).toLocaleDateString() : '',
        temperatureRenderInterpretation: undefined,
        bloodPressureRenderInterpretation: undefined,
        pulseRenderInterpretation: undefined,
        respiratoryRateRenderInterpretation: undefined,
        spo2RenderInterpretation: undefined,
      };
    });
}

/* ---------------- Activities logic (LATEST ENCOUNTER ONLY) ---------------- */

export function getActivitiesBasedOnStigma(stigmaData: StigmaData[] | undefined): JSX.Element {
  const { matched, latestEncounterUuid } = computeStigmaMatch_LatestOnly(stigmaData);

  // Force remount when latest encounter changes or match flips
  const renderKey = `act:${latestEncounterUuid ?? 'none'}:${matched ? '1' : '0'}`;
  // const showHivGuidelines = shouldShowHivGuidelines(stigmaData);

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#e9f5ff',
    border: '1px solid #2f80ed',
    borderRadius: 8,
    padding: '1rem',
    marginBottom: '1rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    maxWidth: '100%',
    wordWrap: 'break-word',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '1.15rem',
    fontWeight: 700,
    textAlign: 'center',
    color: '#0b3d91',
    marginBottom: '.5rem',
  };

  const listStyle: React.CSSProperties = {
    paddingLeft: '1.1rem',
    lineHeight: 1.6,
    marginBottom: '.4rem',
  };

  return (
    <div key={renderKey} style={{ width: '100%', boxSizing: 'border-box' }}>
      {matched ? (
        <>
          <div style={cardStyle}>
            <h4 style={{ ...headingStyle, fontWeight: 'bold' }}>
              एचआईभी संक्रमित व्यक्तिहरूको आत्मसक्षमता र आत्मसम्मान बढाउने परामर्श{' '}
            </h4>
            <span style={{ fontStyle: 'italic' }}>
              एचआईभी संक्रमित व्यक्तिहरूलाई आत्मसक्षमता र आत्मसम्मान बढाउनको लागि तल दिईएका बुदाँहरु प्रयोग गरि परामर्श
              दिनुहोस्।
            </span>{' '}
            <br></br>
            <br></br>
            <ul
              style={{
                color: '#333',
                fontWeight: '500',
                lineHeight: '1.6',
                paddingLeft: '20px',
              }}
            >
              <li>
                o कुराकानी गर्दा खुल्ला प्रश्नहरु सोध्नुहोस्, ध्यान दिएर सुन्नुहोस् र उनीहरूले भनेको कुरालाई मनन गर्दै
                जवाफ दिनुहोस्।
              </li>
              <li>o एचआईभी संक्रमित व्यक्तिहरूको आत्मविश्वास र आत्मसम्मान बढाउन सहयोग गर्नुहोस्।</li>
              <li>
                o एचआईभी संक्रमित व्यक्तिहरूको एआरटि, उपचारको नियमित पालना, र मानसिक स्वास्थ्य सम्बन्धी अनुभव र सोचबारे
                छलफल गर्नुहोस्।
              </li>
              <li>
                o एचआईभी संक्रमित व्यक्तिहरूले हाल प्रयोग गरिरहेका वा थाहा पाएका सामना गर्ने तरिकाहरूको बारेमा कुरा
                गर्नुहोस्।
              </li>
              <li>o संक्षेपमा कुरा राखेर थप सामना गर्ने तरिकाहरू बारे बताउनुहोस्।</li>
            </ul>
            <br></br>
            {/* <p>
              <strong>श्रोतहरु:</strong>
            </p> */}
          </div>
          <br></br>
          <br></br>
          <div style={cardStyle}>
            <p style={{ fontWeight: 'bold', color: '#222', paddingLeft: '20px' }}>श्रोतहरु:</p>
            <span style={{ fontStyle: 'italic', paddingLeft: '20px' }}>
              थप जानकारीको लागि तल दिईएका श्रोतहरु सेयर गर्नुहोस्।
            </span>
            <br />
            <br />
            <ul
              style={{
                color: '#333',
                fontWeight: '500',
                lineHeight: '1.6',
                listStyle: 'none',
                paddingLeft: '20px',
              }}
            >
              <li style={{ marginBottom: '2rem' }}>
                <span style={{ display: 'block', marginBottom: '0.5rem' }}>१. एचआइभी सम्बन्धि जनचेतना</span>
                <QRCodeWithPopup image={qr1hivawareness} alt="HIV Awareness" />
              </li>

              <li style={{ marginBottom: '2rem' }}>
                <span style={{ display: 'block', marginBottom: '0.5rem' }}>२. मानसिक स्वास्थ्य (डरको व्यवस्थापन)</span>
                <QRCodeWithPopup image={qr2tpo} alt="TPO" />
              </li>

              <li style={{ marginBottom: '2rem' }}>
                <span style={{ display: 'block', marginBottom: '0.5rem' }}>
                  ३. लैङ्गिक तथा यौनिक अल्पसङ्ख्यकको लागि जानकारी
                </span>
                <QRCodeWithPopup image={qr3bds} alt="BDS" />
              </li>

              <li style={{ marginBottom: '2rem' }}>
                <span style={{ display: 'block', marginBottom: '0.5rem' }}>४. उपचार पालना सम्बन्धि जनचेतना</span>
                <QRCodeWithPopup image={qr4artadherence} alt="Treatment Adherence" />
              </li>
            </ul>
          </div>

          <br></br>
          <br></br>

          <div style={cardStyle}>
            <h4 style={{ ...headingStyle, fontWeight: 'bold' }}>सपोर्ट ग्रुपको सूची</h4>
            <span style={{ fontStyle: 'italic', paddingLeft: '20px' }}>
              यदि सहभागी सपोर्ट ग्रुपमा सामेल सहमत भएमा तल दिईएको जानकारी सेयर गर्नुहोस्।
            </span>
            <br />
            <br />
            <table style={{ width: '100%', borderCollapse: 'collapse', lineHeight: '1.6' }}>
              <tbody>
                <tr>
                  <td>५. ड्रप-इन सेन्टर</td>
                  <td>स्वतन्त्र पथ, बुटवल, रूपन्देही</td>
                  {/* <td>हसिना चौहान</td> */}
                  <td>msmgnepal@gmail.com, ०७१-५२४८६२</td>
                </tr>
                <tr>
                  <td>६. ड्रप-इन सेन्टर</td>
                  <td>मुर्ली बगैचा, वीरगञ्ज, पर्सा</td>
                  {/* <td>टीका कार्की</td> */}
                  <td>parsachemsexdic@gmail.com, ०५१-५२८६०६</td>
                </tr>
                <tr>
                  <td>७. ड्रप-इन सेन्टर</td>
                  <td>नील सरस्वतीथान, खुरसानिटार, काठमाडौं</td>
                  {/* <td>सुजन लिम्बु</td> */}
                  <td>cruiseaids@gmail.com, ०१-४४२४०५२</td>
                </tr>
                <tr>
                  <td>८. एनएपि+एन</td>
                  <td>बालुवाटार, काठमाडौं</td>
                  {/* <td></td> */}
                  <td>info@napn.org.np, ०१-४५२७४५९</td>
                </tr>
                <tr>
                  <td>९. एनएफडब्लुएलएचए</td>
                  <td>नयाँ बानेश्वर, काठमाडौं</td>
                  <td>nfwlha007@gmail.com, ०१-४५९९३७५</td>
                  {/* <td>nfwlha007@gmail.com, ०१-४५२७४५९ </td> */}
                </tr>
              </tbody>
            </table>
            <br></br>
            <p style={{ color: 'blue', fontWeight: 'bold', textAlign: 'center' }}>
              कृपया सहभागीको कुरा सक्रिय रुपमा सुन्नुहोला।
            </p>
          </div>

        </>
      ) : (
        <div style={cardStyle}>
          <h4 style={{ ...headingStyle, fontWeight: 'bold' }}>आधारभूत परामर्श आधारभूत परामर्श</h4>
          <span style={{ fontStyle: 'italic' }}>कृपया सहभागीलाई आधारभूत परामर्श प्रदान गर्नुहोस्।</span> <br></br>
          <ul
            style={{
              color: '#333',
              fontWeight: '500',
              lineHeight: '1.6',
              paddingLeft: '20px',
            }}
          >
            <li>
              {' '}
              o एचआईभी संक्रमित व्यक्तिहरूसँग एआरटी, उपचारको पालना, र मानसिक स्वास्थ्यसम्बन्धी अनुभव र सोचबारे खुला
              प्रश्नहरू प्रयोग गरेर कुराकानी गर्नुहोस्।
            </li>
            <li>o उनीहरूले भोगेका भावना र चुनौतीहरूलाई महत्व दिनुहोस्।</li>
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function safeParse(val: string | number | undefined | null): number {
  if (val === undefined || val === null || String(val).trim() === '') return 0;
  if (typeof val === 'number') return val;
  const cleaned = String(val)
    .trim()
    .replace(/[^\d.\-]/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function parseDimensionString(dimScore: string | number | string[] | undefined | null) {
  const result = { hiv: 0, mh: 0, sgm: 0, em: 0 };
  if (dimScore === undefined || dimScore === null) return result;

  const str = Array.isArray(dimScore) ? dimScore.join(',') : String(dimScore);
  str.split(',').forEach((part) => {
    const [kRaw, vRaw] = part.split(':');
    if (!kRaw) return;
    const key = kRaw.trim().toLowerCase();
    const token = String(vRaw ?? '0')
      .trim()
      .match(/-?\d+(?:\.\d+)?/);
    const n = token ? parseFloat(token[0]) : 0;
    if (key.startsWith('hiv')) result.hiv = n;
    else if (key.startsWith('mh')) result.mh = n;
    else if (key.startsWith('sgm')) result.sgm = n;
    else if (key.startsWith('em')) result.em = n;
  });

  return result;
}

/**
 * Only evaluate the **latest encounter**:
 * - find the max encounterDatetime
 * - collect all stigma rows with that same encounterUuid
 * - check thresholds on those rows only
 */
export function computeStigmaMatch_LatestOnly(stigmaData: StigmaData[] | undefined): {
  matched: boolean;
  latestEncounterUuid?: string;
} {
  if (!stigmaData || stigmaData.length === 0) return { matched: false };

  // Find latest by date
  const latest = stigmaData.reduce((acc, cur) => {
    const accT = Date.parse(acc.date || '') || 0;
    const curT = Date.parse(cur.date || '') || 0;
    return curT > accT ? cur : acc;
  });

  const latestEncounterUuid = latest.encounterUuid;
  const current = stigmaData.filter((d) => d.encounterUuid === latestEncounterUuid);

  for (const entry of current) {
    const score =
      entry.stigmaType === 'अपेक्षित लान्छना' && typeof entry.as_score === 'number'
        ? entry.as_score
        : entry.stigmaType === 'व्यावहारिक लान्छना' && typeof entry.es_score === 'number'
          ? entry.es_score
          : entry.stigmaType === 'आत्मलान्छना' && typeof entry.is_score === 'number'
            ? entry.is_score
            : safeParse(entry.stigmaScore);

    const dims = parseDimensionString(entry.dimensionScore);
    const hiv = entry.hiv_domain_as ?? entry.hiv_domain_es ?? entry.hiv_domain_is ?? dims.hiv;
    const mh = entry.mh_domain_as ?? entry.mh_domain_es ?? entry.mh_domain_is ?? dims.mh;
    const sgm = entry.sgm_domain_as ?? entry.sgm_domain_es ?? entry.sgm_domain_is ?? dims.sgm;
    const em = entry.em_domain_as ?? entry.em_domain_es ?? entry.em_domain_is ?? dims.em;

    const inter =
      entry.intersectional_stigma_as ??
      entry.intersectional_stigma_es ??
      entry.intersectional_stigma_is ??
      safeParse(entry.intersectionalScore);

    // thresholds
    if (
      entry.stigmaType === 'अपेक्षित लान्छना' &&
      score >= 12 &&
      (hiv >= 20 || mh >= 20 || sgm >= 20 || em >= 20 || inter >= 40)
    ) {
      return { matched: true, latestEncounterUuid };
    }

    if (
      entry.stigmaType === 'व्यावहारिक लान्छना' &&
      score >= 4 &&
      (hiv >= 22 || mh >= 22 || sgm >= 22 || em >= 22 || inter >= 43)
    ) {
      return { matched: true, latestEncounterUuid };
    }

    if (
      entry.stigmaType === 'आत्मलान्छना' &&
      score >= 10 &&
      (hiv >= 17 || mh >= 17 || sgm >= 17 || em >= 17 || inter >= 33)
    ) {
      return { matched: true, latestEncounterUuid };
    }
  }

  return { matched: false, latestEncounterUuid };
}

/**
 * function to calculate stigma type trends over time
 * Focuses only on the three stigma types: Anticipated (as_score),
 * Enacted (es_score), and Internalized (is_score)
 */

type StigmaRecord = {
  date: string; // e.g. "2025-09-14"
  as_score?: number;
  es_score?: number;
  is_score?: number;
};

export function preprocessStigmaTrendsAll(data: StigmaRecord[]) {
  if (!data || data.length === 0) {
    return {
      labels: [],
      anticipated: [],
      enacted: [],
      internalized: [],
    };
  }

  // 🔸 Sort by date
  const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const labels: string[] = [];
  const anticipated: (number | null)[] = [];
  const enacted: (number | null)[] = [];
  const internalized: (number | null)[] = [];

  sorted.forEach((item) => {
    labels.push(formatDate(item.date)); // nice label like 14 Sep 2025

    anticipated.push(item.as_score ?? null);
    enacted.push(item.es_score ?? null);
    internalized.push(item.is_score ?? null);
  });

  return { labels, anticipated, enacted, internalized };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' });
}
