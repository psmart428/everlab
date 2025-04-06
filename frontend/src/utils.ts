import {
  DiagnosticMetric,
  DiagnosticCondition,
  Patient,
  EnrichedObservation,
  FlaggedPatient
} from './types/interfaces';

function getAgeFromDob(dob: string): number {
  const year = parseInt(dob.slice(0, 4), 10);
  const month = parseInt(dob.slice(4, 6), 10) - 1;
  const day = parseInt(dob.slice(6, 8), 10);

  const birthDate = new Date(year, month, day);
  const now = new Date();
  const age = now.getFullYear() - birthDate.getFullYear();

  const hasHadBirthday =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());

  return hasHadBirthday ? age : age - 1;
}

function isGenderMatch(metricGender: string | null, patientGender: string | undefined): boolean {
  if (!metricGender || metricGender.toLowerCase() === 'any') return true;
  return metricGender.toLowerCase() === patientGender?.toLowerCase();
}

function isAgeInRange(age: number, min: number | null, max: number | null): boolean {
  const minOk = min === null || age >= min;
  const maxOk = max === null || age <= max;
  return minOk && maxOk;
}

function addConditionsFromMetric(
  metricName: string,
  conditionSet: Set<string>,
  diagnosticConditions: DiagnosticCondition[]
) {
  diagnosticConditions.forEach(condition => {
    if (condition.diagnostic_metrics.includes(metricName)) {
      if (condition.name) {
        conditionSet.add(condition.name);
      }
    }
  });
}

export function getPatientsWithOutOfRangeResults(
  patients: Patient[],
  diagnosticMetrics: DiagnosticMetric[],
  diagnosticConditions: DiagnosticCondition[]
): FlaggedPatient[] {
  return patients
    .map(patient => {
      const age = getAgeFromDob(patient.dob);
      const gender = patient.gender;
      const matchedConditions = new Set<string>();

      const outOfRangeObservations: EnrichedObservation[] = patient.observations.flatMap(obs => {
        if (
          !obs.oru_sonic_codes ||
          !obs.oru_value ||
          !obs.oru_sonic_units ||
          isNaN(Number(obs.oru_value))
        ) {
          return [];
        }

        const matchingMetrics = diagnosticMetrics.filter(metric =>
          metric.oru_sonic_codes.includes(obs.oru_sonic_codes!) &&
          metric.oru_sonic_units.includes(obs.oru_sonic_units!) &&
          isGenderMatch(metric.gender, gender) &&
          isAgeInRange(age, metric.min_age, metric.max_age)
        );

        if (matchingMetrics.length === 0) return [];

        const value = parseFloat(obs.oru_value);

        return matchingMetrics
          .map(metric => {
            const lower = metric.everlab_lower;
            const higher = metric.everlab_higher;
            const effectiveLower = lower === null && higher !== null ? 0 : lower;

            const outOfRange =
              (effectiveLower !== null && value < effectiveLower) ||
              (higher !== null && value > higher) ||
              (lower === null && higher === null);

            if (!outOfRange) return null;

            if (metric.name) {
              addConditionsFromMetric(metric.name, matchedConditions, diagnosticConditions);
            }

            return {
              ...obs,
              everlab_lower: lower,
              everlab_higher: higher,
              standard_lower: metric.standard_lower,
              standard_higher: metric.standard_higher
            };
          })
          .filter((o): o is EnrichedObservation => o !== null);
      });

      return outOfRangeObservations.length > 0
        ? {
            ...patient,
            observations: outOfRangeObservations,
            matchedConditions: Array.from(matchedConditions)
          }
        : null;
    })
    .filter((p): p is FlaggedPatient => p !== null);
}
