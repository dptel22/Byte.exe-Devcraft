import React from 'react';

const DANGER_SIGNS = [
  "Severe headache that will not go away",
  "Blurred vision or seeing spots or flashes",
  "Sudden swelling in face, hands, or feet",
  "Baby not moving for 2+ hours",
  "Fits, shaking, or loss of consciousness",
  "Heavy bleeding from below",
  "Difficulty breathing or chest pain",
  "High fever that does not come down"
];

export default function DangerSigns() {
  return (
    <div 
        style={{
            backgroundColor: '#fff0f0',
            border: '2px solid #e53935',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '16px',
            width: '100%',
            maxWidth: '600px',
            boxSizing: 'border-box'
        }}
    >
      <h3 style={{ margin: '0 0 12px 0', color: '#c62828', fontSize: '1.1rem' }}>
        🚨 Tell her: Call me IMMEDIATELY if she has any of these:
      </h3>
      <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', color: '#333', fontSize: '0.95rem', lineHeight: '1.5' }}>
        {DANGER_SIGNS.map((sign, index) => (
          <li key={index} style={{ marginBottom: '6px' }}>
            <strong>{sign}</strong>
          </li>
        ))}
      </ul>
      <p style={{ margin: 0, color: '#d32f2f', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center' }}>
        These are warning signs of pre-eclampsia, eclampsia, or obstetric emergency.
      </p>
    </div>
  );
}
