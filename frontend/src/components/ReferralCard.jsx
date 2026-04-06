import '../App.css';

const COLOR_CLASS = {
  red: 'referral-red',
  amber: 'referral-amber',
  green: 'referral-green',
};

export default function ReferralCard({ referral, referralColor, topReasons }) {
  const colorClass = COLOR_CLASS[referralColor] ?? 'referral-red';
  const reasons = Array.isArray(topReasons) ? topReasons : [];

  return (
    <div className="card referral-card" id="referral-card">
      <h3 className="card-title" style={{ marginBottom: '12px' }}>
        Recommended Action
      </h3>

      {referral && (
        <p className={`referral-action-text ${colorClass}`}>{referral}</p>
      )}

      {reasons.length > 0 && (
        <>
          <p className="shap-section-title">Why this result?</p>
          <ul className="shap-list">
            {reasons.map((reason, idx) => (
              <li key={idx}>
                <span className="shap-bullet">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
