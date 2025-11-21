import type { FetchResponse, FHIRResource } from '@openmrs/esm-framework';

type ReferenceRangeValue = number | null | undefined;

export type FHIRSearchBundleResponse = FetchResponse<{
  entry: Array<FHIRResource>;
  link: Array<{ relation: string; url: string }>;
}>;

export interface ObsReferenceRanges {
  hiAbsolute: ReferenceRangeValue;
  hiCritical: ReferenceRangeValue;
  hiNormal: ReferenceRangeValue;
  lowNormal: ReferenceRangeValue;
  lowCritical: ReferenceRangeValue;
  lowAbsolute: ReferenceRangeValue;
}

export type ObservationInterpretation = 'critically_low' | 'critically_high' | 'high' | 'low' | 'normal';

export type MappedVitals = {
  code: string;
  interpretation: string;
  recordedDate: string | Date;
  value: number;
  encounterId: string;
};

export interface FHIRObservationResource {
  resourceType: string;
  id: string;
  category: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  code: {
    coding: Array<{
      code: string;
      display: string;
    }>;
    text: string;
  };
  encounter?: {
    reference: string;
    type: string;
  };
  effectiveDateTime: string;
  issued: string;
  valueString?: string;
  valueQuantity?: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
  valueCodeableConcept?: {
    coding: [
      {
        code: string;
        display: string;
      },
    ];
    text: string;
  };
  referenceRange: Array<{
    low?: {
      value: number;
    };
    high?: {
      value: number;
    };
    type: {
      coding: Array<{
        system: string;
        code: string;
      }>;
    };
  }>;
  hasMember?: Array<{
    reference: string;
  }>;
}

export interface PatientVitalsAndBiometrics {
  id: string;
  date: string;
  systolic?: number;
  diastolic?: number;
  bloodPressureRenderInterpretation?: ObservationInterpretation;
  pulse?: number;
  pulseRenderInterpretation?: ObservationInterpretation;
  temperature?: number;
  temperatureRenderInterpretation?: ObservationInterpretation;
  spo2?: number;
  spo2RenderInterpretation?: ObservationInterpretation;
  height?: number;
  weight?: number;
  bmi?: number | null;
  respiratoryRate?: number;
  respiratoryRateRenderInterpretation?: ObservationInterpretation;
  muac?: number;
}

export interface VitalsResponse {
  entry: Array<{
    resource: FHIRObservationResource;
  }>;
  id: string;
  meta: {
    lastUpdated: string;
  };
  link: Array<{
    relation: string;
    url: string;
  }>;
  resourceType: string;
  total: number;
  type: string;
}

// add to: packages/esm-patient-vitals-app/src/common/types.ts

export interface CovidStigmaData {
  id?: string;
  date?: string; // encounterDatetime ISO string
  stigmaType?: 'अपेक्षित लान्छना' | 'व्यावहारिक लान्छना' | 'आत्मलान्छना' | string;
  stigmaScore?: number | string;
  dimensionType?: string;
  dimensionScore?: string | number | string[]; // raw string like "एचआईभी :74, मानसिक स्वास्थ्य:67, ..."
  intersectionalScore?: number | string;
  encounterUuid?: string;

  // normalized numeric fields used by your existing code
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

  // allow additional properties safely (optional)
  [k: string]: any;
}
