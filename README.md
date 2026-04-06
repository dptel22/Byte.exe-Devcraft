# Byte.exe Hackathon Submission

This repository is arranged in the requested hackathon format:

```text
project-name/
|
|-- README.md
|-- Byte.exe.pptx
|
`-- project/
    |-- backend/
    |-- frontend/
    |-- design/
    `-- notebookdbec349673
```

## Project Overview

This project is a maternal health risk screening web application built for hackathon evaluation. The app helps screen a patient using 6 vital inputs and returns a risk prediction with clinical guidance.

Main capabilities:

- collects 6 maternal health vitals
- predicts risk level using a trained ML model
- explains the result using SHAP-based reasons
- shows referral guidance and follow-up timing
- runs fully on localhost with no database and no external APIs

## Submission Files

- `README.md`
  Project explanation, setup guide, required modules, and detailed run steps.

- `Byte.exe.pptx`
  Hackathon presentation deck.

- `project/`
  Actual implementation and supporting project files.

## Inside `project/`

- `project/backend/`
  FastAPI backend for inference and API endpoints.

- `project/frontend/`
  React + Vite frontend for the screening UI.

- `project/design/`
  Design and HTML artifact files used during project development.

- `project/notebookdbec349673`
  Training notebook artifact.

## Tech Stack

- Frontend: React, Vite
- Backend: FastAPI
- ML: XGBoost, SHAP
- Language: Python, JavaScript

## Requirements

### System Requirements

- Windows PowerShell
- Python 3.11 recommended
- Node.js 18 or newer
- npm

### Backend Python Dependencies

These are required for the backend and are installed from `project/backend/requirements.txt`:

- `fastapi`
- `uvicorn`
- `xgboost`
- `shap`
- `pandas`
- `scikit-learn`
- `numpy`
- `requests`

### Frontend Node Dependencies

Installed from `project/frontend/package.json`:

- Runtime:
  - `react`
  - `react-dom`
- Development:
  - `vite`
  - `@vitejs/plugin-react`
  - `eslint`
  - `@eslint/js`
  - `eslint-plugin-react-hooks`
  - `eslint-plugin-react-refresh`
  - `globals`
  - `@types/react`
  - `@types/react-dom`

## How To Run The Application

Use 2 terminals:

1. one terminal for the backend
2. one terminal for the frontend

Start the backend first, then start the frontend.

## Backend Setup

Open PowerShell in the repository root:

```powershell
cd C:\Users\dhruv\PycharmProjects\Devcraft
```

Move into the backend:

```powershell
cd .\project\backend
```

Create a virtual environment if needed:

```powershell
py -3.11 -m venv .
```

Activate the virtual environment:

```powershell
.\Scripts\Activate.ps1
```

If PowerShell blocks activation, run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\Scripts\Activate.ps1
```

Install backend dependencies:

```powershell
pip install -r requirements.txt
```

Start the FastAPI server:

```powershell
uvicorn main:app --reload --port 8000
```

If `uvicorn` is not recognized, use:

```powershell
python -m uvicorn main:app --reload --port 8000
```

### Backend Verification

Open:

- [http://localhost:8000/health](http://localhost:8000/health)
- [http://localhost:8000/docs](http://localhost:8000/docs)

Expected health response:

```json
{
  "status": "ok",
  "model_loaded": true
}
```

## Frontend Setup

Open a second PowerShell window and run:

```powershell
cd C:\Users\dhruv\PycharmProjects\Devcraft\project\frontend
```

Install frontend dependencies:

```powershell
npm install
```

Start the frontend:

```powershell
npm run dev
```

Open the app in your browser:

- [http://localhost:5173](http://localhost:5173)

## Full Run Order

### Terminal 1

```powershell
cd C:\Users\dhruv\PycharmProjects\Devcraft\project\backend
.\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Terminal 2

```powershell
cd C:\Users\dhruv\PycharmProjects\Devcraft\project\frontend
npm install
npm run dev
```

Then open:

- [http://localhost:5173](http://localhost:5173)

## API Summary

Backend endpoints:

- `GET /health`
  Health check

- `GET /docs`
  Swagger API docs

- `GET /demo`
  Demo response

- `POST /predict`
  Predicts maternal health risk from 6 vitals

## Input Expected By The Backend

Example request body:

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

## Troubleshooting

### Python not found

Use:

```powershell
py -3.11 -m venv .
```

### Backend does not start

Make sure you are inside:

```powershell
cd C:\Users\dhruv\PycharmProjects\Devcraft\project\backend
```

Then reinstall dependencies:

```powershell
.\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Frontend cannot connect to backend

Check:

- backend is running on `http://localhost:8000`
- frontend is running on `http://localhost:5173`
- `http://localhost:8000/health` returns `model_loaded: true`

### Port already in use

Close the process already using the port and restart:

```powershell
uvicorn main:app --reload --port 8000
```

## Submission Note

Before final hackathon submission:

- keep the repository public
- make sure the repository name matches the registered team name
- keep `README.md`, `Byte.exe.pptx`, and `project/` at the repository root
