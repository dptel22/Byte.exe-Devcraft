import { useState } from 'react';
import '../App.css';

const FIELDS = [
  {
    name: 'age',
    label: 'Age',
    unit: 'years',
    min: 5,
    max: 65,
    step: 1,
    placeholder: 'e.g. 28',
    hint: 'Valid range: 5–65',
  },
  {
    name: 'systolic_bp',
    label: 'Systolic BP',
    unit: 'mmHg',
    min: 70,
    max: 200,
    step: 1,
    placeholder: 'e.g. 120',
    hint: 'Valid range: 70–200',
  },
  {
    name: 'diastolic_bp',
    label: 'Diastolic BP',
    unit: 'mmHg',
    min: 40,
    max: 150,
    step: 1,
    placeholder: 'e.g. 80',
    hint: 'Valid range: 40–150',
  },
  {
    name: 'blood_glucose',
    label: 'Blood Glucose',
    unit: 'mmol/L',
    min: 6,
    max: 20,
    step: 0.1,
    placeholder: 'e.g. 7.5',
    hint: 'Valid range: 6–20',
  },
  {
    name: 'body_temp',
    label: 'Body Temperature',
    unit: '°C',
    min: 35,
    max: 42,
    step: 0.1,
    placeholder: 'e.g. 37.0',
    hint: 'Valid range: 35–42',
  },
  {
    name: 'heart_rate',
    label: 'Heart Rate',
    unit: 'bpm',
    min: 40,
    max: 150,
    step: 1,
    placeholder: 'e.g. 75',
    hint: 'Valid range: 40–150',
  },
];

const emptyForm = () =>
  Object.fromEntries(FIELDS.map((f) => [f.name, '']));

const emptyErrors = () =>
  Object.fromEntries(FIELDS.map((f) => [f.name, '']));

export default function VitalsForm({ onSubmit, isLoading }) {
  const [values, setValues] = useState(emptyForm());
  const [errors, setErrors] = useState(emptyErrors());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = emptyErrors();
    let valid = true;

    for (const field of FIELDS) {
      const raw = values[field.name];
      if (raw === '' || raw === null || raw === undefined) {
        newErrors[field.name] = 'This field is required.';
        valid = false;
        continue;
      }
      const num = parseFloat(raw);
      if (isNaN(num)) {
        newErrors[field.name] = 'Enter a valid number.';
        valid = false;
        continue;
      }
      if (num < field.min || num > field.max) {
        newErrors[field.name] = `Must be between ${field.min} and ${field.max}.`;
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      age: parseInt(values.age, 10),
      systolic_bp: parseInt(values.systolic_bp, 10),
      diastolic_bp: parseInt(values.diastolic_bp, 10),
      blood_glucose: parseFloat(values.blood_glucose),
      body_temp: parseFloat(values.body_temp),
      heart_rate: parseInt(values.heart_rate, 10),
    };

    onSubmit(payload);
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
              <div className="field-input-row">
                <input
                  id={`field-${field.name}`}
                  type="number"
                  name={field.name}
                  value={values[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  step={field.step}
                  className={`field-input${errors[field.name] ? ' input-error' : ''}`}
                  autoComplete="off"
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
          {isLoading ? 'Analysing…' : 'Assess Risk'}
        </button>
      </form>
    </div>
  );
}
