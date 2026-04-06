import '../App.css';

const COLOR_CLASS = {
  red: 'risk-high',
  amber: 'risk-mid',
  green: 'risk-low',
};

export default function RiskBadge({ riskLevel, confidence, color }) {
  const className = COLOR_CLASS[color] ?? 'risk-low';
  const confidencePercent =
    confidence !== null && confidence !== undefined
      ? `${Math.round(confidence * 100)}%`
      : null;

  return (
    <div className={`risk-badge-card ${className}`} id="risk-badge">
      <p className="risk-label">Risk Level</p>
      <p className="risk-level-text">{riskLevel || '-'}</p>
      {confidencePercent && (
        <p className="risk-confidence">Confidence: {confidencePercent}</p>
      )}
    </div>
  );
}
