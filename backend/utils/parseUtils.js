function parseHL7(rawContent) {
  const records = [];

  const segments = rawContent.split(/\r?\n|\r/).filter(line => line.trim() !== '');
  let currentRecord = [];

  for (const line of segments) {
    if (line.startsWith('MSH')) {
      if (currentRecord.length > 0) {
        records.push(parseRecord(currentRecord));
        currentRecord = [];
      }
    }
    currentRecord.push(line);
  }

  if (currentRecord.length > 0) {
    records.push(parseRecord(currentRecord));
  }

  return records.map(extractPatientData);
}

function parseRecord(lines) {
  const parsed = {};
  for (const line of lines) {
    const [segment, ...fields] = line.split('|');
    if (!parsed[segment]) parsed[segment] = [];
    parsed[segment].push(fields);
  }
  return parsed;
}

function extractPatientData(message) {
  const pid = message.PID?.[0] || [];
  const obxSegments = message.OBX || [];

  const nameField = pid[4] || '';
  const [familyName, givenName] = nameField.split('^');
  const dob = pid[6] || null;
  const gender = pid[7] || null;
  const addressField = pid[10] || '';
  const [street, , city, state, zipcode, country] = addressField.split('^');
  const ssn = pid[18] || null;

  const observations = obxSegments.map(fields => {
    const codeField = fields[2] || '';
    const oru_sonic_codes = codeField.split('^')[1] || null;

    const oru_value = fields[4] || null;

    const unitField = fields[5] || '';
    const oru_sonic_units = unitField.split('^')[0] || null;

    const rangeRaw = fields[6] || '';
    const rangeMatch = rangeRaw.match(/(\d+\.?\d*)-(\d+\.?\d*)/);
    const reference_range = rangeMatch ? [parseFloat(rangeMatch[1]), parseFloat(rangeMatch[2])] : [];

    const oru_status = fields[10] || null;

    return {
      oru_sonic_codes,
      oru_value,
      oru_sonic_units,
      reference_range,
      oru_status
    };
  });

  return {
    familyName,
    givenName,
    dob,
    gender,
    address: {
      street,
      city,
      state,
      zipcode,
      country
    },
    ssn,
    observations
  };
}

module.exports = {
  parseHL7,
};
