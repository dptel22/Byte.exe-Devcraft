import React from 'react';

const DANGER_SIGNS = [
  'Severe headache that will not go away',
  'Blurred vision or seeing spots or flashes',
  'Sudden swelling in face, hands, or feet',
  'Baby not moving for 2+ hours',
  'Fits, shaking, or loss of consciousness',
  'Heavy bleeding from below',
  'Difficulty breathing or chest pain',
  'High fever that does not come down',
];

export default function DangerSigns() {
  return (
    <div style={{
      background: '#fff1f2',
      border: '1.5px solid #fda4af',
      borderRadius: '12px',
      padding: '20px 24px',
      marginBottom: '14px',
      width: '100%',
      maxWidth: '580px',
      boxSizing: 'border-box',
    }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#9f1239', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
        🚨 Emergency Warning Signs
      </p>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>
        Tell her: call you <strong>immediately</strong> if any of these occur:
      </p>
      <ul style={{ margin: '0 0 12px 0', paddingLeft: '18px', color: '#1e293b', fontSize: '14px', lineHeight: '1.65' }}>
        {DANGER_SIGNS.map((sign, i) => (
          <li key={i} style={{ marginBottom: '5px' }}>{sign}</li>
        ))}
      </ul>
      <p style={{ margin: 0, color: '#9f1239', fontSize: '12px', fontStyle: 'italic' }}>
        These may indicate pre-eclampsia, eclampsia, or obstetric emergency.
      </p>
    </div>
  );
}
