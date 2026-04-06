import { useState } from 'react';
import './App.css';
import VitalsForm from './components/VitalsForm';
import RiskBadge from './components/RiskBadge';
import ReferralCard from './components/ReferralCard';
import PatientHistory from './components/PatientHistory';

const EMPTY_FORM_DATA = {
  age: '',
  systolic_bp: '',
  diastolic_bp: '',
  blood_glucose: '',
  body_temp: '',
  heart_rate: '',
};

export default function App() {
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResult = (data) => {
    setResult(data);

    const entry = {
      age: formData.age,
      systolic_bp: formData.systolic_bp,
      diastolic_bp: formData.diastolic_bp,
      blood_glucose: formData.blood_glucose,
      risk_level: data.risk_level,
      color: data.color,
      timestamp: new Date().toISOString(),
    };

    setHistory((prev) => [entry, ...prev].slice(0, 5));
  };

  const handleClear = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="header-brand">MaternalGuard</span>
        <span className="header-subtitle">ASHA Clinical Decision Support</span>
      </header>

      <main className="app-content">
        {error && (
          <div className="error-banner" role="alert" id="error-banner">
            {error}
          </div>
        )}

        <VitalsForm
          formData={formData}
          onFormDataChange={setFormData}
          onResult={handleResult}
          onError={setError}
          isLoading={isLoading}
          onLoadingChange={setIsLoading}
        />

        {result !== null && (
          <div className="result-view">
            <RiskBadge
              riskLevel={result.risk_level}
              confidence={result.confidence}
              color={result.color}
            />

            <ReferralCard
              referral={result.referral}
              color={result.color}
              reasons={result.reasons}
            />

            <button
              type="button"
              className="back-btn"
              onClick={handleClear}
              id="clear-result-btn"
            >
              Clear
            </button>
          </div>
        )}

        <div style={{ marginTop: '24px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <PatientHistory history={history} />
        </div>
      </main>
    </div>
  );
}
