import React from 'react';
import { FlaggedPatient } from '../types/interfaces';

type Props = {
  data: FlaggedPatient[];
};

const RiskReport: React.FC<Props> = ({ data }) => {
  if (!data.length) {
    return <p className="text-green-600 text-sm mt-6">✅ No risk conditions detected.</p>;
  }

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-red-600">
        🚩 Patients with Out-of-Range Observations
      </h2>

      <div className="overflow-x-auto rounded border border-gray-300 shadow-sm">
        <table className="min-w-full text-sm text-left bg-white border border-gray-300 border-collapse">
          <thead className="bg-gray-100 text-xs text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2 border border-gray-300">Patient</th>
              <th className="px-4 py-2 border border-gray-300">Risk Conditions</th>
              <th className="px-4 py-2 border border-gray-300">Flagged Metrics</th>
            </tr>
          </thead>
          <tbody>
            {data.map((patient, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap align-top">
                  <div className="font-medium">
                    {patient.familyName} {patient.givenName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {patient.dob} | {patient.gender}
                  </div>
                </td>

                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap align-top">
                  {patient.matchedConditions.map((cond, i) => (
                    <div key={i} className="text-sm text-red-700">• {cond}</div>
                  ))}
                </td>

                <td className="px-4 py-3 border border-gray-200 align-top">
                  <table className="text-xs border border-gray-300 border-collapse w-full mt-1">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-2 py-1 border border-gray-300">Metric</th>
                        <th className="px-2 py-1 border border-gray-300">Value</th>
                        <th className="px-2 py-1 border border-gray-300">Unit</th>
                        <th className="px-2 py-1 border border-gray-300">Range (Low - High)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.observations.map((obs, j) => (
                        <tr key={j}>
                          <td className="px-2 py-1 border border-gray-200">{obs.oru_sonic_codes}</td>
                          <td className="px-2 py-1 border border-gray-200 font-medium text-red-600">
                            {obs.oru_value}
                          </td>
                          <td className="px-2 py-1 border border-gray-200">{obs.oru_sonic_units}</td>
                          <td className="px-2 py-1 border border-gray-200 text-gray-700">
                            {(obs.everlab_lower === null && obs.everlab_higher !== null)
                              ? 0
                              : (obs.everlab_lower ?? '—')} - {obs.everlab_higher ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RiskReport;
