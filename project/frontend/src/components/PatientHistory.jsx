import '../App.css';

const PILL_CLASS = {
  'High Risk': 'risk-high',
  'Mid Risk': 'risk-mid',
  'Low Risk': 'risk-low',
};

function formatTime(isoString) {
  try {
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}

export default function PatientHistory({ history }) {
  if (!Array.isArray(history) || history.length === 0) {
    return (
      <div className="card history-card" id="patient-history">
        <h3 className="card-title" style={{ marginBottom: '12px' }}>
          Recent Assessments
        </h3>
        <p className="history-empty">No previous assessments in this session</p>
      </div>
    );
  }

  return (
    <div className="card history-card" id="patient-history">
      <h3 className="card-title" style={{ marginBottom: '16px' }}>
        Recent Assessments
      </h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="history-table">
          <thead>
            <tr>
              <th>Age</th>
              <th>SBP</th>
              <th>DBP</th>
              <th>Glucose</th>
              <th>Risk Level</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => {
              const pillClass = PILL_CLASS[entry.risk_level] ?? 'risk-low';

              return (
                <tr key={index}>
                  <td>{entry.age}</td>
                  <td>{entry.systolic_bp}</td>
                  <td>{entry.diastolic_bp}</td>
                  <td>{entry.blood_glucose}</td>
                  <td>
                    <span className={`risk-pill ${pillClass}`}>
                      {entry.risk_level}
                    </span>
                  </td>
                  <td>{formatTime(entry.timestamp)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
