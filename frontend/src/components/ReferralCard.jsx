import '../App.css';

const COLOR_CLASS = {
  red: 'referral-red',
  amber: 'referral-amber',
  green: 'referral-green',
};

export default function ReferralCard({ referral, color, reasons }) {
  const colorClass = COLOR_CLASS[color] ?? 'referral-red';
  const topReasons = Array.isArray(reasons) ? reasons : [];

  return (
    <div className="card referral-card" id="referral-card">
      <h3 className="card-title" style={{ marginBottom: '12px' }}>
        Recommended Action
      </h3>

      {referral && (
        <p className={`referral-action-text ${colorClass}`}>
          <strong>{referral}</strong>
        </p>
      )}

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
