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
    const textToCopy = `🏥 MaternalGuard Screening Alert
Age: ${formData.age}y | BP: ${formData.systolic_bp}/${formData.diastolic_bp} mmHg
Glucose: ${formData.blood_glucose} mmol/L | Temp: ${formData.body_temp}°C | HR: ${formData.heart_rate} bpm
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

            <ShapReasons reasons={result.reasons} />
            
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
               style={{ width: '100%', marginBottom: '16px', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f5f5f5', color: '#333', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
               onClick={handleCopy}
            >
               📋 Copy Summary for Doctor
            </button>
            
            {showCopyToast && (
               <div style={{ color: '#2e7d32', textAlign: 'center', marginBottom: '16px', fontWeight: 'bold', fontSize: '1rem', backgroundColor: '#e8f5e9', padding: '8px', borderRadius: '6px' }}>
                  ✓ Copied!
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

        <div style={{ marginTop: '24px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <PatientHistory history={history} />
        </div>
      </main>
    </div>
  );
}
