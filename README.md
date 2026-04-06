# MaternalGuard

MaternalGuard is a maternal health risk screening project built for the Byte.exe Devcraft hackathon. It helps ASHA workers and frontline care teams quickly screen a patient using 6 vital measurements, estimate maternal risk, and surface simple next-step guidance that can be acted on immediately during a field visit or clinic intake.

The app runs fully on `localhost`. It does not require a database, authentication, cloud services, or any external API calls.

## What The Project Does

- Accepts 6 patient inputs:
  - Age
  - Systolic blood pressure
  - Diastolic blood pressure
  - Blood glucose
  - Body temperature
  - Heart rate
- Uses a trained XGBoost model to classify the patient as:
  - `Low Risk`
  - `Mid Risk`
  - `High Risk`
- Uses SHAP to explain the most important factors behind the prediction.
- Returns:
  - risk level
  - confidence score
  - action color
  - referral guidance
  - top reasons for the prediction
  - follow-up timing and counseling keys for the frontend

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI
- ML Inference: XGBoost
- Explainability: SHAP
- Language: Python + JavaScript

## Project Structure

```text
Devcraft/
├─ backend/
│  ├─ main.py
│  ├─ model_loader.py
│  ├─ requirements.txt
│  ├─ model/
│  │  ├─ maternal_risk_xgb_model.pkl
│  │  ├─ maternal_risk_shap_explainer.pkl
│  │  ├─ feature_columns.pkl
│  │  └─ fix_shap.py
│  └─ ...
├─ frontend/
│  ├─ package.json
│  ├─ src/
│  │  ├─ App.jsx
│  │  └─ components/
│  └─ ...
├─ design/
├─ presentation/
├─ notebookdbec349673
└─ README.md
```

## Key Files

- `backend/main.py`
  FastAPI app entrypoint. Defines `/health`, `/demo`, and `/predict`.

- `backend/model_loader.py`
  Loads the trained model, rebuilds the SHAP explainer on startup, computes derived features, and returns prediction metadata.

- `backend/model/`
  Stores the trained model artifacts used for inference.

- `frontend/src/App.jsx`
  Main React app shell. Coordinates the form, result cards, and recent patient history.

- `frontend/src/components/VitalsForm.jsx`
  The 6-field screening form that sends a POST request to the backend.

- `notebookdbec349673`
  Training notebook artifact used during model development.

## Prerequisites

Recommended local setup:

- Windows 10/11 with PowerShell
- Python 3.11
- Node.js 18+ or newer
- npm

This repo currently runs on a local machine with:

- Node `v24.12.0`
- npm `11.6.2`

If `python` is not recognized on Windows, use `py -3.11` instead.

## Quick Start

You need two terminals:

1. Terminal A for the FastAPI backend
2. Terminal B for the Vite frontend

Start the backend first, then the frontend.

## Backend Setup And Run

Open PowerShell in the project root:

```powershell
cd C:\Users\dhruv\PycharmProjects\Devcraft
```

Move into the backend folder:

```powershell
cd .\backend
```

### Option A: Use An Existing Working Virtual Environment

If the backend virtual environment is already present and healthy, activate it:

```powershell
.\Scripts\Activate.ps1
```

Then install dependencies to be safe:

```powershell
pip install -r requirements.txt
```

### Option B: Recreate The Backend Virtual Environment

If activation fails, `uvicorn` fails, or Python is missing from the local backend environment, recreate it:

```powershell
cd C:\Users\dhruv\PycharmProjects\Devcraft\backend
py -3.11 -m venv .
.\Scripts\Activate.ps1
pip install -r requirements.txt
```

If `py` is not available but Python 3.11 is installed, use:

```powershell
python -m venv .
.\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Start The FastAPI Server

Run:

```powershell
uvicorn main:app --reload --port 8000
```

If the server starts correctly, you should see Uvicorn output showing it is listening on port `8000`.

If `uvicorn` is not recognized in the activated environment, use:

```powershell
python -m uvicorn main:app --reload --port 8000
```

### Verify The Backend Is Running

Open these URLs in a browser:

- [http://localhost:8000/health](http://localhost:8000/health)
- [http://localhost:8000/docs](http://localhost:8000/docs)

Expected health response:

```json
{
  "status": "ok",
  "model_loaded": true
}
```

If `model_loaded` is `false`, the backend started but the model did not load successfully.

## Frontend Setup And Run

Open a second PowerShell terminal in the project root:

```powershell
cd C:\Users\dhruv\PycharmProjects\Devcraft\frontend
```

Install dependencies:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

Vite will print a local URL. In this project the app should open at:

- [http://localhost:5173](http://localhost:5173)

## Full Local Run Order

For reviewers and judges, this is the cleanest run sequence:

1. Open PowerShell in `C:\Users\dhruv\PycharmProjects\Devcraft\backend`
2. Activate the backend venv:
   `.\Scripts\Activate.ps1`
3. Install backend requirements:
   `pip install -r requirements.txt`
4. Start FastAPI:
   `uvicorn main:app --reload --port 8000`
5. Open a second PowerShell in `C:\Users\dhruv\PycharmProjects\Devcraft\frontend`
6. Install frontend dependencies:
   `npm install`
7. Start Vite:
   `npm run dev`
8. Open [http://localhost:5173](http://localhost:5173)
9. Enter all 6 vitals and click `Assess Risk`

## API Contract

### POST `/predict`

Request body:

```json
{
  "age": 28,
  "systolic_bp": 130,
  "diastolic_bp": 85,
  "blood_glucose": 8.5,
  "body_temp": 37.2,
  "heart_rate": 80
}
```

Response shape:

```json
{
  "risk_level": "High Risk",
  "confidence": 0.98,
  "color": "red",
  "referral": "Send to PHC immediately",
  "reasons": [
    "Systolic blood pressure",
    "Blood glucose level",
    "Mean arterial pressure"
  ],
  "top_shap_feature": "Blood Pressure",
  "counseling_key": "High Risk_Blood Pressure",
  "next_visit_days": 1,
  "referral_urgency": "Send to PHC today. Do not wait."
}
```

### GET `/health`

Health check for startup verification.

### GET `/docs`

Swagger UI for manual endpoint testing.

### GET `/demo`

Returns a sample prediction payload for UI/demo purposes.

## How The Screening Flow Works

1. The frontend collects 6 vitals from the user.
2. The form sends those values to `http://localhost:8000/predict`.
3. The backend computes additional derived features internally:
   - pulse pressure
   - mean arterial pressure
   - BP ratio
   - age-glucose interaction
4. The XGBoost model predicts the maternal risk class.
5. SHAP identifies the most influential features.
6. The frontend renders:
   - risk badge
   - explanation cards
   - counseling content
   - next visit timing
   - recent patient history

## Frontend Features

- 6-field maternal vitals form
- Inline validation before submit
- Backend error handling for network errors and API errors
- Risk result cards and counseling content
- Recent patient history table
- Copyable doctor summary

## Backend Features

- FastAPI inference API
- CORS configured for the Vite frontend on `http://localhost:5173`
- Model loading from local `.pkl` artifacts
- SHAP explainer rebuilt on startup
- Offline inference with no external dependencies beyond installed packages

## Troubleshooting

### 1. `python` is not recognized

Use:

```powershell
py -3.11 -m venv .
```

Or install Python 3.11 and ensure it is available in PATH.

### 2. PowerShell blocks venv activation

If `.\Scripts\Activate.ps1` is blocked by execution policy, run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
```

Then activate again:

```powershell
.\Scripts\Activate.ps1
```

### 3. Port 8000 is already in use

Close the process already using port `8000`, then restart:

```powershell
uvicorn main:app --reload --port 8000
```

If needed, the module form also works:

```powershell
python -m uvicorn main:app --reload --port 8000
```

### 4. Frontend cannot reach backend

Check:

- backend is running on `http://localhost:8000`
- frontend is running on `http://localhost:5173`
- `/health` returns `model_loaded: true`

### 5. Model artifacts are missing

Make sure these files exist inside `backend/model/`:

- `maternal_risk_xgb_model.pkl`
- `maternal_risk_shap_explainer.pkl`
- `feature_columns.pkl`

Without the model artifact, `/predict` will not work.

## Submission Notes

- This project is intended for local demo use during a hackathon.
- The backend and frontend are designed to run completely offline once dependencies are installed.
- `design/` and `presentation/` are included for hackathon deliverables.

## Repository

- GitHub: [https://github.com/dptel22/Byte.exe-Devcraft](https://github.com/dptel22/Byte.exe-Devcraft)

## One-Line Demo Script For Judges

If you only need the shortest possible instructions:

```powershell
# Terminal 1
cd C:\Users\dhruv\PycharmProjects\Devcraft\backend
.\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2
cd C:\Users\dhruv\PycharmProjects\Devcraft\frontend
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).
