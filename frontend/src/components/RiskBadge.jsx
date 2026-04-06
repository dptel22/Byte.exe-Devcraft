import '../App.css';

const RISK_CLASS = {
  High: 'risk-high',
  Mid: 'risk-mid',
  Low: 'risk-low',
};

export default function RiskBadge({ riskLevel, confidence }) {
  const cls = RISK_CLASS[riskLevel] ?? 'risk-low';
  const pct =
    confidence !== null && confidence !== undefined
      ? `${Math.round(confidence * 100)}%`
      : null;

  return (
    <div className={`risk-badge-card ${cls}`} id="risk-badge">
      <p className="risk-label">Risk Level</p>
      <p className="risk-level-text">{riskLevel ? riskLevel.toUpperCase() : '—'}</p>
      {pct && <p className="risk-confidence">Confidence: {pct}</p>}
    </div>
  );
}
