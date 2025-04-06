import { useEffect, useState } from "react";
import axios from 'axios';
import ORUFileUploader from "./components/ORUFileUploader";
import { DiagnosticMetric, DiagnosticCondition, Patient, FlaggedPatient } from './types/interfaces';
import { getPatientsWithOutOfRangeResults } from "./utils";
import RiskReport from "./components/RiskReport";

function App() {
  const [parsedData, setParsedData] = useState<Patient[]>([]);
  const [diagnosticMetrics, setDiagnosticMetrics] = useState<DiagnosticMetric[]>([]);
  const [diagnosticConditions, setDiagnosticConditions] = useState<DiagnosticCondition[]>([]);
  const [loading, setLoading] = useState(false);
  const [riskPatients, setRiskPatients] = useState<FlaggedPatient[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [metricsRes, conditionsRes] = await Promise.all([
          axios.get<DiagnosticMetric[]>(`${import.meta.env.VITE_API_URL}/api/diagnostic-metrics`),
          axios.get<DiagnosticCondition[]>(`${import.meta.env.VITE_API_URL}/api/diagnostic-conditions`)
        ]);

        setDiagnosticMetrics(metricsRes.data);
        setDiagnosticConditions(conditionsRes.data);
      } catch (err) {
        console.error('Failed to fetch diagnostic data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (parsedData.length > 0) {
      const riskPatients = getPatientsWithOutOfRangeResults(parsedData, diagnosticMetrics, diagnosticConditions);
      setRiskPatients(riskPatients);
    }
  }, [parsedData, diagnosticMetrics, diagnosticConditions]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-4 overflow-x-hidden">
      <ORUFileUploader
        onUploadSuccess={setParsedData}
        onLoadingChange={setLoading}
      />

      {loading && (
        <div className="mt-4 text-blue-600 text-center">
          ⏳ Parsing file, please wait...
        </div>
      )}

      {!loading && parsedData.length > 0 && <RiskReport data={riskPatients} /> }
    </div>
  );
}

export default App;
