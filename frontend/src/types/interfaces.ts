export type DiagnosticMetric = {
  name: string | null;
  oru_sonic_codes: string[];
  diagnostic: string | null;
  diagnostic_groups: string[];
  oru_sonic_units: string[];
  units: string | null;
  min_age: number | null;
  max_age: number | null;
  gender: string | null;
  standard_lower: number | null;
  standard_higher: number | null;
  everlab_lower: number | null;
  everlab_higher: number | null;
};

export type DiagnosticCondition = {
  name: string | null;
  diagnostic_metrics: string[];
};

export type Observation = {
  oru_sonic_codes: string | null;
  oru_value: string | null;
  oru_sonic_units: string | null;
  reference_range: number[];
  oru_status: string | null;
};

export type Patient = {
  familyName: string;
  givenName: string;
  dob: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  };
  ssn: string | null;
  observations: Observation[];
};

export type EnrichedObservation = Observation & {
  everlab_lower: number | null;
  everlab_higher: number | null;
  standard_lower: number | null;
  standard_higher: number | null;
};

export type FlaggedPatient = Patient & {
  matchedConditions: string[];
  observations: EnrichedObservation[];
};