import { useState } from 'react';
import '../App.css';

const API_BASE = 'http://localhost:8000';

const FIELDS = [
  {
    name: 'age',
    label: 'Age',
    unit: 'years',
    min: 5,
    max: 65,
    step: 0.1,
    placeholder: 'e.g. 28',
    hint: 'Valid range: 5-65',
  },
  {
    name: 'systolic_bp',
    label: 'Systolic BP',
    unit: 'mmHg',
    min: 70,
    max: 160,
    step: 0.1,
    placeholder: 'e.g. 120',
    hint: 'Valid range: 70-160',
  },
  {
    name: 'diastolic_bp',
    label: 'Diastolic BP',
    unit: 'mmHg',
    min: 49,
    max: 100,
    step: 0.1,
    placeholder: 'e.g. 80',
    hint: 'Valid range: 49-100',
  },
  {
    name: 'blood_glucose',
    label: 'Blood Glucose',
    unit: 'mmol/L',
    min: 6.0,
    max: 19.0,
    step: 0.1,
    placeholder: 'e.g. 7.5',
    hint: 'Valid range: 6.0-19.0',
  },
  {
    name: 'body_temp',
    label: 'Body Temp',
    unit: '°F',
    min: 98,
    max: 103,
    step: 0.1,
    placeholder: 'e.g. 98.6',
    hint: 'Valid range: 98-103°F',
  },
  {
    name: 'heart_rate',
    label: 'Heart Rate',
    unit: 'bpm',
    min: 40,
    max: 90,
    step: 0.1,
    placeholder: 'e.g. 75',
    hint: 'Valid range: 40-90',
  },
];

const emptyErrors = () =>
  Object.fromEntries(FIELDS.map((field) => [field.name, '']));

export default function VitalsForm({
  formData,
  onFormDataChange,
  onResult,
  onError,
  isLoading,
  onLoadingChange,
}) {
  const [errors, setErrors] = useState(emptyErrors());

  const handleChange = (event) => {
    const { name, value } = event.target;
    onFormDataChange((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = emptyErrors();
    let isValid = true;

    for (const field of FIELDS) {
      const rawValue = formData[field.name];
      if (rawValue === '' || rawValue === null || rawValue === undefined) {
        nextErrors[field.name] = 'This field is required.';
        isValid = false;
        continue;
      }

      const numericValue = parseFloat(rawValue);
      if (Number.isNaN(numericValue)) {
        nextErrors[field.name] = 'Enter a valid number.';
        isValid = false;
        continue;
      }

      if (numericValue < field.min || numericValue > field.max) {
        nextErrors[field.name] = `Must be between ${field.min} and ${field.max}.`;
        isValid = false;
      }
    }

    setErrors(nextErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const payload = {
      age: parseFloat(formData.age),
      systolic_bp: parseFloat(formData.systolic_bp),
      diastolic_bp: parseFloat(formData.diastolic_bp),
      blood_glucose: parseFloat(formData.blood_glucose),
      body_temp: parseFloat(formData.body_temp),
      heart_rate: parseFloat(formData.heart_rate),
    };

    onLoadingChange(true);
    onError(null);

    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Backend error:', response.status, data);
        onError(
          `Server error ${response.status}: ${
            data?.detail || data?.message || JSON.stringify(data)
          }`
        );
        return;
      }

      onResult(data);
    } catch (error) {
      console.error('Network error:', error);
      onError('Cannot connect to backend. Is the server running on port 8000?');
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Patient Vitals Assessment</h2>
      <p className="card-subtitle">
        Enter all 6 measurements to assess maternal risk
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="vitals-grid">
          {FIELDS.map((field) => (
            <div className="field-group" key={field.name}>
              <label className="field-label" htmlFor={`field-${field.name}`}>
                {field.label}
              </label>
              <div className={`field-input-row${errors[field.name] ? ' has-error' : ''}`}>
                <input
                  id={`field-${field.name}`}
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  step={field.step}
                  className="field-input"
                  autoComplete="off"
                  disabled={isLoading}
                />
                <span className="field-unit">{field.unit}</span>
              </div>
              {errors[field.name] ? (
                <span className="field-error-msg">{errors[field.name]}</span>
              ) : (
                <span className="field-hint">{field.hint}</span>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading}
          id="assess-risk-btn"
        >
          {isLoading ? 'Analysing...' : 'Assess Risk'}
        </button>
      </form>
    </div>
  );
}
