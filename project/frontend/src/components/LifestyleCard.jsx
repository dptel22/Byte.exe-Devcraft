import React from 'react';

const ADVICE_DATA = {
  'Blood Pressure': {
    heading: 'Reduce Salt & Rest',
    bullets: [
      'No added salt in food today',
      'Avoid pickles, papad, packaged snacks',
      'Rest lying on LEFT side (improves blood flow to baby)',
      'Drink 8–10 glasses of water',
    ],
  },
  'Blood Glucose': {
    heading: 'Control Sugar Today',
    bullets: [
      'Avoid rice, roti, potatoes, sweets, fruit juice',
      'Eat dal, sabzi, eggs, nuts instead',
      'Eat smaller meals every 3–4 hours — do not skip',
      'Drink water, not tea or juice',
    ],
  },
  'Body Temperature': {
    heading: 'Fever Management',
    bullets: [
      'Wet cloth on forehead and neck',
      'Drink water every 30 minutes (3 litres today)',
      'Paracetamol 500 mg if temp above 38.5°C',
      'Stay in a cool, shaded place',
    ],
  },
  'Heart Rate': {
    heading: 'Rest Immediately',
    bullets: [
      'Stop all physical activity right now',
      'Sit or lie down, breathe slowly and deeply',
      'No climbing stairs, no cooking, no lifting',
      'Drink a glass of cool water',
    ],
  },
  Age: {
    heading: 'General Precautions',
    bullets: [
      'Rest for at least 8 hours each night',
      'Eat iron-rich foods: spinach, jaggery, eggs',
      'Do not miss any antenatal appointments',
      'Call ASHA if anything feels different',
    ],
  },
};

export default function LifestyleCard({ riskLevel, topShapFeature }) {
  if (riskLevel === 'Low Risk') return null;
  const advice = ADVICE_DATA[topShapFeature];
  if (!advice) return null;

  return (
    <div style={{
      background: '#f0fdf4',
      border: '1.5px solid #86efac',
      borderRadius: '12px',
      padding: '20px 24px',
      marginBottom: '14px',
      width: '100%',
      maxWidth: '580px',
      boxSizing: 'border-box',
    }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#166534', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
        🥗 Home Care — {advice.heading}
      </p>
      <ul style={{ margin: 0, paddingLeft: '18px', color: '#1e293b', fontSize: '14px', lineHeight: '1.65' }}>
        {advice.bullets.map((bullet, i) => (
          <li key={i} style={{ marginBottom: '6px' }}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}
