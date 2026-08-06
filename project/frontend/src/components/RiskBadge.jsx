import '../App.css';

const CONTEXT = {
  'Low Risk':  'All vitals are within normal range.',
  'Mid Risk':  'One or more vitals are borderline.',
  'High Risk': 'Multiple vitals indicate elevated concern.',
};

export default function RiskBadge({ riskLevel, confidence, color }) {
  let className = 'risk-low';
  if (riskLevel === 'Mid Risk')  className = 'risk-mid';
  if (riskLevel === 'High Risk') className = 'risk-high';

  const confidencePercent = confidence != null
    ? `${Math.round(confidence * 100)}%`
    : null;

  const contextStr = CONTEXT[riskLevel] || '';

  return (
    <div className={`risk-badge-card ${className}`} id="risk-badge">
      <p className="risk-label">Risk Level</p>
      <p className="risk-level-text">{riskLevel || '—'}</p>
      {confidencePercent && (
        <>
          <p className="risk-confidence">Model confidence: {confidencePercent}</p>
          {contextStr && (
            <p style={{ fontSize: '13px', marginTop: '6px', opacity: 0.75 }}>{contextStr}</p>
          )}
        </>
      )}
    </div>
  );
}
