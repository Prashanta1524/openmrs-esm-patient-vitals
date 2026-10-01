export function getMaxVisitCount(allPatientsData: any[]): number {
  return (allPatientsData || []).reduce((maxCount, patientObservations) => {
    const encounterKeys = new Set<string>();

    (patientObservations || []).forEach((obs: any) => {
      const dateValue = obs.effectiveDateTime || obs.date;
      if (!dateValue || Number.isNaN(new Date(dateValue).getTime())) return;

      const encounterKey =
        obs.encounter?.uuid ||
        obs.encounter?.reference ||
        obs.encounterUuid ||
        String(dateValue);
      if (encounterKey) encounterKeys.add(encounterKey);
    });

    return Math.max(maxCount, encounterKeys.size);
  }, 0);
}
