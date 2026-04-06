import React from 'react';

const SCRIPTS = {
  "High Risk_Blood Pressure":
    "Didi, your blood pressure is very high right now. This is dangerous for you and your baby. You must go to the PHC today — do not wait. Stop eating salt completely. Avoid pickles and packaged food. Rest lying on your left side. If you get a headache or see blurry, call me immediately.",

  "High Risk_Blood Glucose":
    "Didi, your sugar level is very high. This can harm your baby if not controlled. Avoid rice, roti, sweets, fruit juice, and tea with sugar today. Eat only dal, sabzi, and eggs. Drink 3 glasses of water now. Go to PHC within 24 hours.",

  "High Risk_Body Temperature":
    "Didi, you have a fever right now. This is not safe during pregnancy. Put a wet cloth on your forehead. Drink water every 30 minutes. Take paracetamol only if temp is above 38.5°C. Go to PHC today.",

  "High Risk_Heart Rate":
    "Didi, your heart is beating very fast. Sit down immediately and rest. Do not do any work or walk around. Breathe slowly. I will check again in 10 minutes. If it does not come down, we go to PHC now.",

  "High Risk_Age":
    "Didi, at your age this pregnancy needs extra care. All your vitals together show high risk. You must see the PHC doctor this week. Rest as much as possible and do not miss your next checkup.",

  "Mid Risk_Blood Pressure":
    "Didi, your blood pressure is a little high today. Please rest at home today — no heavy work. Do not add salt to your food. I will come back in 2 days to check again. If you feel a headache or swelling in hands or face, call me immediately.",

  "Mid Risk_Blood Glucose":
    "Didi, your sugar is a little high. Try to eat less rice and sweets for the next 2 days. Eat small meals more often. I will check your sugar again when I visit next. If you feel dizzy, drink a glass of plain water and rest.",

  "Mid Risk_Body Temperature":
    "Didi, your temperature is slightly raised. Drink plenty of water today. Rest and avoid going out in the heat. If the fever increases or does not go away by tomorrow, go to the PHC.",

  "Mid Risk_Heart Rate":
    "Didi, your heart rate is a little fast today. This can happen from heat or stress. Sit and rest for now. Drink water. I will check again in 2 days. If you feel breathless or chest pain, call me right away.",

  "Mid Risk_Age":
    "Didi, everything looks okay right now but your age means we need to watch carefully. I will visit again in 2 days. Please rest well, eat good food, and avoid heavy work.",

  "Low Risk_Blood Pressure":
    "Didi, your readings look good today. Your blood pressure is normal. Keep eating well and resting. I will visit again as scheduled.",

  "Low Risk_Blood Glucose":
    "Didi, your readings look good today. Your sugar is in a safe range. Continue eating balanced meals. I will visit again in 2 weeks.",

  "Low Risk_Body Temperature":
    "Didi, your readings look good today. No fever, no immediate concerns. Stay hydrated and rest well. See you in 2 weeks.",

  "Low Risk_Heart Rate":
    "Didi, your readings look good today. Heart rate is normal. Continue routine care. I will visit again in 2 weeks.",

  "Low Risk_Age":
    "Didi, your readings look good today. Everything is in a safe range. Keep attending your antenatal checkups and eating well."
};

const DEFAULT_SCRIPT = "Continue monitoring. Follow standard ANC protocol and revisit as scheduled.";

export default function CounselingScript({ counselingKey }) {
  const scriptText = SCRIPTS[counselingKey] || DEFAULT_SCRIPT;

  return (
    <div 
        style={{
            backgroundColor: '#fffbea',
            border: '2px solid #f5c842',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '16px',
            width: '100%',
            maxWidth: '600px',
            boxSizing: 'border-box'
        }}
    >
      <h3 style={{ margin: '0 0 4px 0', color: '#333', fontSize: '1.1rem' }}>
        📢 What to tell the patient:
      </h3>
      <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '0.85rem', fontStyle: 'italic' }}>
        Read this out loud to her.
      </p>
      <p style={{ margin: 0, color: '#222', lineHeight: '1.5', fontSize: '0.95rem' }}>
        {scriptText}
      </p>
    </div>
  );
}
