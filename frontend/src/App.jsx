import { useState } from 'react';
import './App.css';
import VitalsForm from './components/VitalsForm';
import RiskBadge from './components/RiskBadge';
import ReferralCard from './components/ReferralCard';
import PatientHistory from './components/PatientHistory';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show actual backend error message in UI + log full detail
        console.error('Backend error:', response.status, data);
        setError(
          `Server error ${response.status}: ${
            data?.detail || data?.message || JSON.stringify(data)
          }`
        );
        return;
      }

      setResult(data);

      // Append to history (max 5, oldest drops off)
      const entry = {
        age: formData.age,
        systolic_bp: formData.systolic_bp,
        blood_glucose: formData.blood_glucose,
        risk_level: data.risk_level,
        timestamp: new Date().toISOString(),
      };

      setHistory((prev) => {
        const updated = [entry, ...prev];
        return updated.slice(0, 5);
      });
    } catch (err) {
      // Only reaches here if server is truly unreachable (network error)
      console.error('Network error:', err);
      setError('Cannot connect to backend. Is the server running on port 8000?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAssessment = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="app-header">
        <span className="header-brand">🏥 MaternalGuard</span>
        <span className="header-subtitle">ASHA Clinical Decision Support</span>
      </header>

      {/* ── Main Content ── */}
      <main className="app-content">
        {/* Error Banner — shown in both views */}
        {error && (
          <div className="error-banner" role="alert" id="error-banner">
            {error}
          </div>
        )}

        {/* ── VIEW 1: Input Form ── */}
        {result === null && (
          <>
            <VitalsForm onSubmit={handleFormSubmit} isLoading={isLoading} />

            {history.length > 0 && (
              <div style={{ marginTop: '24px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PatientHistory history={history} />
              </div>
            )}
          </>
        )}

        {/* ── VIEW 2: Result View ── */}
        {result !== null && (
          <div className="result-view">
            <button
              className="back-btn"
              onClick={handleNewAssessment}
              id="new-assessment-btn"
            >
              ← New Assessment
            </button>

            <RiskBadge
              riskLevel={result.risk_level}
              confidence={result.confidence}
            />

            <ReferralCard
              referral={result.referral}
              referralColor={result.referral_color}
              topReasons={result.top_reasons}
            />

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PatientHistory history={history} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
