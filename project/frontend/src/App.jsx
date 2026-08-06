import { useState } from 'react';
import './App.css';
import VitalsForm from './components/VitalsForm';
import RiskBadge from './components/RiskBadge';
import ShapReasons from './components/ShapReasons';
import CounselingScript from './components/CounselingScript';
import LifestyleCard from './components/LifestyleCard';
import DangerSigns from './components/DangerSigns';
import NextVisitCard from './components/NextVisitCard';
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
  const [showCopyToast, setShowCopyToast] = useState(false);

  const handleCopy = () => {
    const textToCopy = `VitaSakhi Screening Alert
Age: ${formData.age}y | BP: ${formData.systolic_bp}/${formData.diastolic_bp} mmHg
Glucose: ${formData.blood_glucose} mmol/L | Temp: ${formData.body_temp}°F | HR: ${formData.heart_rate} bpm
Risk Level: ${result.risk_level}
Main Flag: ${result.top_shap_feature}
Action: ${result.referral_urgency}
Screened: ${new Date().toLocaleString()}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    });
  };

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
        <span className="header-brand">VitaSakhi</span>
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

            <ShapReasons reasons={result.top_reasons} />

            <CounselingScript counselingKey={result.counseling_key} />

            <LifestyleCard
              riskLevel={result.risk_level}
              topShapFeature={result.top_shap_feature}
            />

            <DangerSigns />

            <NextVisitCard
              riskLevel={result.risk_level}
              referralUrgency={result.referral_urgency}
              nextVisitDays={result.next_visit_days}
            />

            <button
              type="button"
              style={{
                width: '100%',
                maxWidth: '580px',
                marginBottom: '10px',
                padding: '13px',
                borderRadius: '10px',
                border: '1.5px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                color: '#475569',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onClick={handleCopy}
            >
              📋 Copy Summary for Doctor
            </button>

            {showCopyToast && (
              <div
                style={{
                  color: '#166534',
                  textAlign: 'center',
                  marginBottom: '10px',
                  fontWeight: 600,
                  fontSize: '13px',
                  backgroundColor: '#f0fdf4',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #86efac',
                  maxWidth: '580px',
                  width: '100%',
                }}
              >
                ✓ Copied to clipboard
              </div>
            )}

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

        <div
          style={{
            marginTop: '24px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <PatientHistory history={history} />
        </div>
      </main>
    </div>
  );
}
