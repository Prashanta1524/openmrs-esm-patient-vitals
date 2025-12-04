import React from 'react';
import { useTranslation } from 'react-i18next';
import BiometricsBase from './biometrics-base.component';

interface BiometricsProps {
  patientUuid: string;
  basePath: string;
}

const BiometricsOverview: React.FC<BiometricsProps> = ({ patientUuid, basePath }) => {
  return <BiometricsBase patientUuid={patientUuid} />;
};

export default BiometricsOverview;
