/**
 * Utilities for processing patient data for analytics
 */

// Convert OpenMRS date format to local date object
export function parseOpenMRSDate(dateString?: string): Date | null {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return null;
    return date;
  } catch (e) {
    console.error('Error parsing date', e);
    return null;
  }
}

// Adjust date for Nepali Time (UTC+5:45)
export function adjustForNepaliTimezone(date: Date): Date {
  if (!date) return date;

  const offsetInMs = 5 * 60 * 60 * 1000 + 45 * 60 * 1000;
  return new Date(date.getTime() + offsetInMs);
}

// Extract numeric value from OpenMRS observation display string
export function extractNumericValue(displayString?: string): number | null {
  if (!displayString) return null;

  const valueMatch = displayString.match(/\d+(\.\d+)?/);
  if (valueMatch) {
    return parseFloat(valueMatch[0]);
  }
  return null;
}

// Group patients observations by concept (display label)
export function groupObservationsByConcept(patientObservations: Array<any>): Record<string, Array<any>> {
  const groupedObservations: Record<string, Array<any>> = {};

  patientObservations.forEach((obs) => {
    if (!obs.display) return;

    // Extract the concept name from the display string
    // Format is typically "Concept Name: Value"
    const conceptMatch = obs.display.match(/^([^:]+):/);
    if (conceptMatch) {
      const conceptName = conceptMatch[1].trim();
      if (!groupedObservations[conceptName]) {
        groupedObservations[conceptName] = [];
      }
      groupedObservations[conceptName].push(obs);
    }
  });

  return groupedObservations;
}

// Get the most recent observation for a concept
export function getMostRecentObservation(observations: Array<any>, conceptLabel: string): any | null {
  if (!observations || observations.length === 0) return null;

  let mostRecent = null;
  let mostRecentDate = null;

  observations.forEach((obs: any) => {
    if (obs.display?.includes(conceptLabel)) {
      const date = parseOpenMRSDate(obs.effectiveDateTime || obs.date);
      if (!mostRecentDate || (date && date > mostRecentDate)) {
        mostRecentDate = date;
        mostRecent = obs;
      }
    }
  });

  return mostRecent;
}

// Calculate statistics for numeric observations
export function calculateObservationStats(
  observations: Array<any>,
  conceptLabel: string,
): {
  min: number | null;
  max: number | null;
  avg: number | null;
  count: number;
} {
  if (!observations || observations.length === 0) {
    return { min: null, max: null, avg: null, count: 0 };
  }

  const values: number[] = [];

  observations.forEach((obs: any) => {
    if (obs.display?.includes(conceptLabel)) {
      const value = extractNumericValue(obs.display);
      if (value !== null) {
        values.push(value);
      }
    }
  });

  if (values.length === 0) {
    return { min: null, max: null, avg: null, count: 0 };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;

  return { min, max, avg, count: values.length };
}

// Filter observations by date range
export function filterObservationsByDateRange(observations: Array<any>, startDate: Date, endDate: Date): Array<any> {
  return observations.filter((obs: any) => {
    const obsDate = parseOpenMRSDate(obs.effectiveDateTime || obs.date);
    if (!obsDate) return false;

    return obsDate >= startDate && obsDate <= endDate;
  });
}
