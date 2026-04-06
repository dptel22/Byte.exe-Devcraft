import React from 'react';

const ADVICE_DATA = {
  "Blood Pressure": {
    heading: "Reduce Salt & Rest",
    bullets: [
      "No added salt in food today",
      "Avoid pickles, papad, packaged snacks",
      "Rest lying on LEFT side (improves blood flow to baby)",
      "Drink 8-10 glasses of water"
    ]
  },
  "Blood Glucose": {
    heading: "Control Sugar Today",
    bullets: [
      "Avoid rice, roti, potatoes, sweets, fruit juice",
      "Eat dal, sabzi, eggs, nuts instead",
      "Eat smaller meals every 3-4 hours — do not skip",
      "Drink water, not tea or juice"
    ]
  },
  "Body Temperature": {
    heading: "Fever Management",
    bullets: [
      "Wet cloth on forehead and neck",
      "Drink water every 30 minutes (3 litres today)",
      "Paracetamol 500mg if temp above 38.5°C",
      "Stay in a cool, shaded place"
    ]
  },
  "Heart Rate": {
    heading: "Rest Immediately",
    bullets: [
      "Stop all physical activity right now",
      "Sit or lie down, breathe slowly and deeply",
      "No climbing stairs, no cooking, no lifting",
      "Drink a glass of cool water"
    ]
  },
  "Age": {
    heading: "General Precautions",
    bullets: [
      "Rest for at least 8 hours each night",
      "Eat iron-rich foods: spinach, jaggery, eggs",
      "Do not miss any antenatal appointments",
      "Call ASHA if anything feels different"
    ]
  }
};

export default function LifestyleCard({ riskLevel, topShapFeature }) {
  if (riskLevel === "Low Risk") {
    return null;
  }

  const advice = ADVICE_DATA[topShapFeature];
  if (!advice) {
    return null; // Don't render if the feature isn't recognized
  }

  return (
    <div 
        style={{
            backgroundColor: '#f0faf0',
            border: '2px solid #4caf50',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '16px',
            width: '100%',
            maxWidth: '600px',
            boxSizing: 'border-box'
        }}
    >
      <h3 style={{ margin: '0 0 12px 0', color: '#2e7d32', fontSize: '1.1rem' }}>
        🥗 Home Care Advice: {advice.heading}
      </h3>
      <ul style={{ margin: 0, paddingLeft: '20px', color: '#333', fontSize: '0.95rem', lineHeight: '1.5' }}>
        {advice.bullets.map((bullet, index) => (
          <li key={index} style={{ marginBottom: '6px' }}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}
