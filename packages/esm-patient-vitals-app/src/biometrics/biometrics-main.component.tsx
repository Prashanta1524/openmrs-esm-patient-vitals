import React from 'react';
import { useTranslation } from 'react-i18next';
import BiometricsBase from './biometrics-base.component';

interface BiometricsProps {
  patientUuid: string;
}

const BiometricsMain: React.FC<BiometricsProps> = ({ patientUuid }) => {
  return <BiometricsBase patientUuid={patientUuid} />;
};

export default BiometricsMain;
