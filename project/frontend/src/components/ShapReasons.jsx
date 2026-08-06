import React from 'react';
import '../App.css';

const FEATURE_MAP = {
  SystolicBP: 'Systolic Blood Pressure',
  BS: 'Blood Glucose',
  BodyTemp: 'Body Temperature',
  DiastolicBP: 'Diastolic Blood Pressure',
  Age: 'Age',
  HeartRate: 'Heart Rate',
  PulsePressure: 'Pulse Pressure',
  MAP: 'Mean Arterial Pressure',
  BPRatio: 'BP Ratio',
  AgeGlucose: 'Age–Glucose Interaction',
};

export default function ShapReasons({ reasons }) {
  const topReasons = Array.isArray(reasons) ? [...reasons] : [];

  if (topReasons.length === 0) {
    return (
      <div className="card referral-card" style={{ padding: '16px 20px', marginBottom: '14px' }}>
        <p className="shap-section-title">Why this result?</p>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>No SHAP data available.</p>
      </div>
    );
  }

  topReasons.sort((a, b) => Math.abs(b.shap) - Math.abs(a.shap));

  return (
    <div className="card referral-card" style={{ padding: '20px 24px', marginBottom: '14px' }}>
      <p className="shap-section-title">Why this result?</p>
      <ul className="shap-list">
        {topReasons.map((reasonObj, index) => {
          const isElevating = reasonObj.direction === 'elevating';
          const arrow = isElevating ? '↑' : '↓';
          const effect = isElevating ? 'is elevating risk' : 'is reducing risk';
          const featureName = FEATURE_MAP[reasonObj.feature] || reasonObj.feature;
          const arrowColor = isElevating ? '#e11d48' : '#16a34a';

          return (
            <li key={index}>
              <span style={{ color: arrowColor, fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>{arrow}</span>
              <span style={{ color: '#1e293b' }}>
                <strong>{featureName}</strong>{' '}
                <span style={{ color: '#64748b' }}>{effect}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
