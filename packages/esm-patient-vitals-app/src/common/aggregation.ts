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

export interface StigmaMonthlyMetrics {
  month: string; // e.g., "Dec 2025"
  sortKey: string; // e.g., "2025-12" for sorting

  // Stigma type counts
  anticipatedCount: number;
  enactedCount: number;
  internalizedCount: number;

  // Dimension scores (any dimension above cutoff)
  dimensionsAboveCutoff: number;
  dimensionsBelowCutoff: number;

  // Intersectional scores
  intersectionalAboveCutoff: number;
  intersectionalBelowCutoff: number;

  // Detailed dimension breakdown
  hivAboveCutoff: number;
  mhAboveCutoff: number;
  sgmAboveCutoff: number;
  emAboveCutoff: number;
}

/**
 * Aggregate stigma data by month with above/below cutoff counts
 * Returns monthly breakdown of:
 * - Dimension scores (HIV, MH, SGM, EM) above/below cutoff
 * - Intersectional stigma above/below cutoff
 * - Breakdown by stigma type (Anticipated, Enacted, Internalized)
 *
 * @param stigmaData - Processed stigma data from useCovidStigmaData hook
 * @param startDate - Start date for filtering
 * @param endDate - End date for filtering
 */
export function aggregateStigmaByMonth(
  stigmaData: any[], // StigmaData[] from stigma-data.resource.tsx
  startDate: Date,
  endDate: Date,
): StigmaMonthlyMetrics[] {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Map of month -> metrics
  const metricsMap = new Map<string, StigmaMonthlyMetrics>();

  // Cutoff values by stigma type
  const cutoffs = {
    anticipated: { dimension: 20, intersectional: 40 },
    enacted: { dimension: 22, intersectional: 43 },
    internalized: { dimension: 17, intersectional: 33 },
  };

  if (!stigmaData || stigmaData.length === 0) {
    return [];
  }

  stigmaData.forEach((entry: any) => {
    const date = new Date(entry.date);
    if (!date || isNaN(date.getTime())) return;

    // Apply Nepal timezone offset
    const offset = 5 * 60 * 60 * 1000 + 45 * 60 * 1000;
    const localDate = new Date(date.getTime() + offset);

    if (localDate < startDate || localDate > endDate) return;

    // Create month key
    const sortKey = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}`;
    const displayLabel = `${monthNames[localDate.getMonth()]} ${localDate.getFullYear()}`;

    // Initialize metrics for this month if not exists
    if (!metricsMap.has(sortKey)) {
      metricsMap.set(sortKey, {
        month: displayLabel,
        sortKey,
        anticipatedCount: 0,
        enactedCount: 0,
        internalizedCount: 0,
        dimensionsAboveCutoff: 0,
        dimensionsBelowCutoff: 0,
        intersectionalAboveCutoff: 0,
        intersectionalBelowCutoff: 0,
        hivAboveCutoff: 0,
        mhAboveCutoff: 0,
        sgmAboveCutoff: 0,
        emAboveCutoff: 0,
      });
    }

    const metrics = metricsMap.get(sortKey)!;

    // Determine stigma type and get appropriate cutoffs
    let stigmaType: 'anticipated' | 'enacted' | 'internalized' | null = null;
    let dimensionCutoff = 0;
    let intersectionalCutoff = 0;

    // Check stigma type based on entry.stigmaType field
    if (entry.stigmaType === 'अपेक्षित लान्छना') {
      stigmaType = 'anticipated';
      metrics.anticipatedCount++;
      dimensionCutoff = cutoffs.anticipated.dimension;
      intersectionalCutoff = cutoffs.anticipated.intersectional;
    } else if (entry.stigmaType === 'व्यावहारिक लान्छना') {
      stigmaType = 'enacted';
      metrics.enactedCount++;
      dimensionCutoff = cutoffs.enacted.dimension;
      intersectionalCutoff = cutoffs.enacted.intersectional;
    } else if (entry.stigmaType === 'आत्मलान्छना') {
      stigmaType = 'internalized';
      metrics.internalizedCount++;
      dimensionCutoff = cutoffs.internalized.dimension;
      intersectionalCutoff = cutoffs.internalized.intersectional;
    }

    if (!stigmaType) return;

    // Get dimension scores based on stigma type
    const hivScore = entry.hiv_domain_as ?? entry.hiv_domain_es ?? entry.hiv_domain_is;
    const mhScore = entry.mh_domain_as ?? entry.mh_domain_es ?? entry.mh_domain_is;
    const sgmScore = entry.sgm_domain_as ?? entry.sgm_domain_es ?? entry.sgm_domain_is;
    const emScore = entry.em_domain_as ?? entry.em_domain_es ?? entry.em_domain_is;

    // Check if any dimension is above cutoff
    const anyDimensionAbove =
      (hivScore !== undefined && hivScore >= dimensionCutoff) ||
      (mhScore !== undefined && mhScore >= dimensionCutoff) ||
      (sgmScore !== undefined && sgmScore >= dimensionCutoff) ||
      (emScore !== undefined && emScore >= dimensionCutoff);

    if (anyDimensionAbove) {
      metrics.dimensionsAboveCutoff++;

      // Count individual dimensions
      if (hivScore !== undefined && hivScore >= dimensionCutoff) metrics.hivAboveCutoff++;
      if (mhScore !== undefined && mhScore >= dimensionCutoff) metrics.mhAboveCutoff++;
      if (sgmScore !== undefined && sgmScore >= dimensionCutoff) metrics.sgmAboveCutoff++;
      if (emScore !== undefined && emScore >= dimensionCutoff) metrics.emAboveCutoff++;
    } else {
      metrics.dimensionsBelowCutoff++;
    }

    // Check intersectional stigma
    const intersectionalScore =
      entry.intersectional_stigma_as ?? entry.intersectional_stigma_es ?? entry.intersectional_stigma_is;

    if (intersectionalScore !== undefined && intersectionalScore !== null) {
      if (intersectionalScore >= intersectionalCutoff) {
        metrics.intersectionalAboveCutoff++;
      } else {
        metrics.intersectionalBelowCutoff++;
      }
    }
  });

  // Convert to sorted array
  const sortedKeys = Array.from(metricsMap.keys()).sort();
  return sortedKeys.map((key) => metricsMap.get(key)!);
}
