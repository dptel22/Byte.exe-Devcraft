import React from 'react';

const URGENCY_STYLE = {
  'High Risk': { bg: '#e11d48', text: 'white' },
  'Mid Risk':  { bg: '#ea580c', text: 'white' },
  'Low Risk':  { bg: '#16a34a', text: 'white' },
};

const ACCENT = {
  'High Risk': '#e11d48',
  'Mid Risk':  '#ea580c',
  'Low Risk':  '#16a34a',
};

const INSTRUCTIONS = {
  'High Risk': '📍 Refer to nearest PHC. Document in ANC register.',
  'Mid Risk':  '📝 Re-screen at next visit. Monitor vitals daily.',
  'Low Risk':  '✅ Continue routine ANC schedule. No immediate action.',
};

export default function NextVisitCard({ riskLevel, referralUrgency, nextVisitDays }) {
  const style = URGENCY_STYLE[riskLevel] || URGENCY_STYLE['Low Risk'];
  const accent = ACCENT[riskLevel] || ACCENT['Low Risk'];
  const instruction = INSTRUCTIONS[riskLevel] || INSTRUCTIONS['Low Risk'];

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px 24px',
      marginBottom: '14px',
      width: '100%',
      maxWidth: '580px',
      boxSizing: 'border-box',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        background: style.bg,
        color: style.text,
        fontWeight: 700,
        padding: '10px 16px',
        borderRadius: '8px',
        marginBottom: '16px',
        textAlign: 'center',
        fontSize: '14px',
        letterSpacing: '0.1px',
      }}>
        {referralUrgency}
      </div>

      <p style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#1e293b', fontWeight: 600 }}>
        📅 Return visit in: {nextVisitDays} day{nextVisitDays > 1 ? 's' : ''}
      </p>

      <div style={{
        background: '#f8fafc',
        padding: '12px 14px',
        borderRadius: '8px',
        borderLeft: `4px solid ${accent}`,
      }}>
        <p style={{ margin: 0, color: '#475569', fontSize: '14px' }}>{instruction}</p>
      </div>
    </div>
  );
}
