import requests

payload = {
    "Age": 28,
    "SystolicBP": 130,
    "DiastolicBP": 85,
    "BloodGlucose": 8.5,
    "BodyTemp": 37.2,
    "HeartRate": 80
}

try:
    r = requests.post("http://localhost:8000/predict", json=payload, timeout=5)
    print("Status:", r.status_code)
    print("Response:", r.json())
except Exception as e:
    print("Connection failed:", e)
