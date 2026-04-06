import React from 'react';
import '../App.css';

export default function ShapReasons({ reasons }) {
  const topReasons = Array.isArray(reasons) ? reasons : [];

  if (topReasons.length === 0) return null;

  return (
    <div className="card referral-card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
      <p className="shap-section-title">Why this result?</p>
      <ul className="shap-list">
        {topReasons.map((reason, index) => (
          <li key={index}>
            <span className="shap-bullet">-</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
