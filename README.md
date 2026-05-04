# 🩺 Byte.exe — Maternal Health Risk Screener

> **🏆 3rd Place — DevCraft Hackathon 2026**

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)
![ML](https://img.shields.io/badge/Model-XGBoost%20%2B%20SHAP-orange)
![License](https://img.shields.io/badge/License-MIT-green)

A clinical decision-support web application that screens maternal health risk using 6 vital inputs and returns an interpretable risk classification with SHAP-based explanations and referral guidance — designed for use in low-resource healthcare settings.

---

## 📋 Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [User Stories](#user-stories)
- [ML Model Details](#ml-model-details)
- [Troubleshooting](#troubleshooting)
- [Team](#team)

---

## Problem Statement

Maternal mortality remains a critical public health crisis, particularly in under-resourced regions where clinicians lack fast, reliable tools to assess patient risk during prenatal and postnatal care. Delays in identifying high-risk patients lead to preventable deaths.

---

## Solution Overview

Byte.exe is a lightweight, stateless web application that:

1. Accepts 6 standard maternal health vitals as input
2. Runs inference using a trained XGBoost classifier
3. Returns a **risk level** (Low / Mid / High) with a **confidence score**
4. Explains the prediction using **SHAP values** mapped to plain clinical language
5. Provides **referral guidance** and follow-up timing based on risk level

No database. No external API calls. Fully local-deployable for offline clinic use.

---

## Features

- ✅ **Risk Classification** — Low / Mid / High with confidence score
- ✅ **SHAP Explainability** — Top contributing vitals explained in plain language
- ✅ **Referral Guidance** — Actionable clinical next steps based on risk level
- ✅ **Fast Inference** — Sub-second response via FastAPI
- ✅ **Stateless & Private** — No patient data stored or transmitted
- ✅ **Swagger API Docs** — Auto-generated at `/docs`

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   USER (Clinician)                  │
│             Enters 6 vitals in React UI             │
└───────────────────────────┬─────────────────────────┘
                            │ HTTP POST /predict
                            ▼
┌─────────────────────────────────────────────────────┐
│              FastAPI Backend (Port 8000)            │
│  ┌──────────────┐    ┌──────────────────────────┐   │
│  │ Input Parser │───▶│   XGBoost Classifier     │   │
│  └──────────────┘    └────────────┬─────────────┘   │
│                                   │                  │
│                      ┌────────────▼─────────────┐   │
│                      │   SHAP Explainer         │   │
│                      └────────────┬─────────────┘   │
│                                   │                  │
│                      ┌────────────▼─────────────┐   │
│                      │  Referral Logic Engine   │   │
│                      └────────────┬─────────────┘   │
└────────────────────────────────────┬────────────────┘
                        │ JSON Response
                        ▼
┌─────────────────────────────────────────────────────┐
│           React + Vite Frontend (Port 5173)         │
│   Displays: Risk Level | SHAP Reasons | Referral    │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, JavaScript |
| Backend | Python 3.11, FastAPI, Uvicorn |
| ML Model | XGBoost, scikit-learn |
| Explainability | SHAP |
| Data Processing | pandas, NumPy |
| API Docs | Swagger UI (auto via FastAPI) |

---

## Project Structure

```text
Byte.exe-Devcraft/
├── README.md
├── Byte.exe.pptx              # Hackathon presentation deck
└── project/
    ├── backend/               # FastAPI inference server
    │   ├── main.py            # API entry point
    │   ├── model/             # Trained XGBoost model artifacts
    │   ├── requirements.txt   # Python dependencies
    │   └── shap_utils.py      # SHAP explanation logic
    ├── frontend/              # React + Vite UI
    │   ├── src/
    │   ├── public/
    │   └── package.json
    ├── design/                # UI mockups and HTML prototypes
    └── notebookdbec349673     # Model training notebook
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.11+ |
| Node.js | 18+ |
| npm | 9+ |

### 1. Clone the Repository

```bash
git clone https://github.com/dptel22/Byte.exe-Devcraft.git
cd Byte.exe-Devcraft
```

### 2. Start the Backend

```bash
# Navigate to backend
cd project/backend

# Create and activate virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

Verify at: [http://localhost:8000/health](http://localhost:8000/health)

Expected response:
```json
{ "status": "ok", "model_loaded": true }
```

Swagger docs at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Start the Frontend

Open a **new terminal**:

```bash
cd project/frontend
npm install
npm run dev
```

Open the app at: [http://localhost:5173](http://localhost:5173)

---

## API Reference

### `GET /health`
Returns backend and model status.

**Response:**
```json
{ "status": "ok", "model_loaded": true }
```

---

### `POST /predict`
Predicts maternal health risk from 6 vitals.

**Request Body:**
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

**Input Fields:**

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `age` | int | years | Patient age |
| `systolic_bp` | float | mmHg | Systolic blood pressure |
| `diastolic_bp` | float | mmHg | Diastolic blood pressure |
| `blood_glucose` | float | mmol/L | Blood glucose level |
| `body_temp` | float | °C | Body temperature |
| `heart_rate` | int | bpm | Resting heart rate |

**Response:**
```json
{
  "risk_level": "High",
  "confidence": 0.87,
  "shap_reasons": [
    "Elevated blood glucose is the primary risk driver",
    "High systolic blood pressure is a contributing factor"
  ],
  "referral_guidance": "Immediate referral to obstetric specialist recommended.",
  "follow_up": "Within 24 hours"
}
```

---

### `GET /demo`
Returns a sample prediction response for UI testing.

---

## User Stories

> These are the functional requirements captured as user stories, useful for SRS documentation.

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Clinician | Enter 6 patient vitals | I can receive an automated risk assessment |
| US-02 | Clinician | See a SHAP explanation | I understand which vitals are driving the risk |
| US-03 | Clinician | Receive referral guidance | I know what action to take immediately |
| US-04 | Clinic admin | Run the app without internet | It works in offline/low-resource settings |
| US-05 | Developer | Access Swagger docs | I can test and integrate the API easily |

---

## ML Model Details

| Property | Value |
|----------|-------|
| Algorithm | XGBoost Classifier |
| Target Classes | Low Risk, Mid Risk, High Risk |
| Input Features | Age, Systolic BP, Diastolic BP, Blood Glucose, Body Temp, Heart Rate |
| Explainability | SHAP TreeExplainer |
| Dataset | UCI Maternal Health Risk Dataset |
| Training Environment | Jupyter Notebook (see `project/notebookdbec349673`) |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `uvicorn` not found | Use `python -m uvicorn main:app --reload --port 8000` |
| PowerShell blocks venv activation | Run `Set-ExecutionPolicy -Scope Process Bypass` first |
| Frontend can't connect to backend | Confirm backend is running on port 8000 and health check returns `model_loaded: true` |
| Port already in use | Kill the process using the port, then restart |
| `python` not recognized | Use `py -3.11` instead of `python` on Windows |

---

## Team

**Team Byte.exe** — DevCraft Hackathon 2026 · 🥉 3rd Place

| Name | Role |
|------|------|
| Dhruv Patel | ML Engineer, Backend, Full-Stack |

---

> Built for the DevCraft Hackathon. Designed to be deployable in under 5 minutes on any machine with Python and Node.js.
