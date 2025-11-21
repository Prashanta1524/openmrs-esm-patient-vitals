export const getAggregationLevel = (start: Date, end: Date): 'day' | 'month' | 'year' => {
  const diffDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
  if (diffDays <= 30) return 'day';
  if (diffDays <= 365) return 'month';
  return 'year';
};

export function aggregateData(allPatientsData: any[], startDate: Date, endDate: Date, level: 'day' | 'month' | 'year') {
  const resultMap = new Map<string, Set<number>>(); // key = label, value = set of patient indices

  allPatientsData.forEach((patientData, patientIdx) => {
    patientData.forEach((obs: any) => {
      const date = new Date(obs.effectiveDateTime || obs.date);
      if (!date) return;
      const offset = 5 * 60 * 60 * 1000 + 45 * 60 * 1000;
      const localDate = new Date(date.getTime() + offset);
      if (localDate < startDate || localDate > endDate) return;

      let key = '';
      if (level === 'day')
        key = localDate.toISOString().split('T')[0]; // YYYY-MM-DD
      else if (level === 'month')
        key = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
      else if (level === 'year') key = `${localDate.getFullYear()}`;

      if (!resultMap.has(key)) resultMap.set(key, new Set());
      resultMap.get(key)!.add(patientIdx);
    });
  });

  // Convert to arrays
  const sortedKeys = Array.from(resultMap.keys()).sort();
  const labels = sortedKeys;
  const counts = sortedKeys.map((key) => resultMap.get(key)!.size);

  return { labels, counts };
}
