import { type PatientVitalsAndBiometrics, type ObservationInterpretation } from '../common';
import React from 'react';

export interface VitalsTableRow extends PatientVitalsAndBiometrics {
  id: string;
  dateRender: string;
  bloodPressureRender: string | number | React.ReactNode;
  bloodPressureRenderInterpretation?: ObservationInterpretation;
  pulseRender: string | number;
  pulseRenderInterpretation?: ObservationInterpretation;
  spo2Render: string | number | React.ReactNode;
  spo2RenderInterpretation?: ObservationInterpretation;
  temperatureRender: string | number;
  temperatureRenderInterpretation?: ObservationInterpretation;
  respiratoryRateRender: React.ReactNode;
  respiratoryRateRenderInterpretation?: ObservationInterpretation;
}

export interface VitalsTableHeader {
  key:
    | 'dateRender'
    | 'temperatureRender'
    | 'bloodPressureRender'
    | 'pulseRender'
    | 'respiratoryRateRender'
    | 'spo2Render';
  header: string | React.ReactNode;
  isSortable?: boolean;
  style?: React.CSSProperties;
  sortFunc: (valueA: VitalsTableRow, valueB: VitalsTableRow) => number;
}
