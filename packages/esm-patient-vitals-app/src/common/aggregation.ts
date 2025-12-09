export const getAggregationLevel = (start: Date, end: Date): 'day' | 'month' | 'year' => {
  const diffDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
  if (diffDays <= 30) return 'day';
  if (diffDays <= 365) return 'month';
  return 'year';
};

export function aggregateData(allPatientsData: any[], startDate: Date, endDate: Date, level: 'day' | 'month' | 'year') {
  const resultMap = new Map<string, Set<number>>(); 
  const labelMap = new Map<string, string>(); 

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  allPatientsData.forEach((patientData, patientIdx) => {
    patientData.forEach((obs: any) => {
      const date = new Date(obs.effectiveDateTime || obs.date);
      if (!date) return;
      const offset = 5 * 60 * 60 * 1000 + 45 * 60 * 1000;
      const localDate = new Date(date.getTime() + offset);
      if (localDate < startDate || localDate > endDate) return;

      let sortKey = '';
      let displayLabel = '';
      
      if (level === 'day') {
        sortKey = localDate.toISOString().split('T')[0]; 
        const month = monthNames[localDate.getMonth()];
        const day = localDate.getDate();
        displayLabel = `${month} ${day}`; 
      } else if (level === 'month') {
        sortKey = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM for sorting
        const month = monthNames[localDate.getMonth()];
        const year = localDate.getFullYear();
        displayLabel = `${month} ${year}`; 
      } else if (level === 'year') {
        sortKey = `${localDate.getFullYear()}`;
        displayLabel = sortKey; 
      }

      if (!resultMap.has(sortKey)) {
        resultMap.set(sortKey, new Set());
        labelMap.set(sortKey, displayLabel);
      }
      resultMap.get(sortKey)!.add(patientIdx);
    });
  });

 
  const sortedKeys = Array.from(resultMap.keys()).sort();
  const labels = sortedKeys.map((key) => labelMap.get(key)!);
  const counts = sortedKeys.map((key) => resultMap.get(key)!.size);

  return { labels, counts };
}
