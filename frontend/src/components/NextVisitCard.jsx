import React from 'react';

const URGENCY_COLORS = {
  "High Risk": "#c0392b",
  "Mid Risk": "#e67e22",
  "Low Risk": "#27ae60"
};

const INSTRUCTIONS = {
  "High Risk": "📍 Refer to nearest PHC. Document in ANC register.",
  "Mid Risk": "📝 Re-screen at next visit. Monitor vitals daily.",
  "Low Risk": "✅ Continue routine ANC schedule. No immediate action."
};

export default function NextVisitCard({ riskLevel, referralUrgency, nextVisitDays }) {
  const bgColor = URGENCY_COLORS[riskLevel] || URGENCY_COLORS["Low Risk"];
  const instruction = INSTRUCTIONS[riskLevel] || INSTRUCTIONS["Low Risk"];

  return (
    <div 
        style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '16px',
            width: '100%',
            maxWidth: '600px',
            boxSizing: 'border-box',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
    >
      <div 
        style={{
            backgroundColor: bgColor,
            color: 'white',
            fontWeight: 'bold',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center',
            fontSize: '1.1rem'
        }}
      >
        {referralUrgency}
      </div>

      <p style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#333', fontWeight: 'bold' }}>
        📅 Return visit in: {nextVisitDays} day{nextVisitDays > 1 ? 's' : ''}
      </p>

      <div style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px', borderLeft: `4px solid ${bgColor}`}}>
        <p style={{ margin: 0, color: '#555', fontSize: '0.95rem' }}>
          {instruction}
        </p>
      </div>
    </div>
  );
}
