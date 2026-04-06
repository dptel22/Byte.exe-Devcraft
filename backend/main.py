from contextlib import asynccontextmanager
import logging
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field

from model_loader import ModelNotReadyError, model_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class PatientVitals(BaseModel):
    model_config = ConfigDict(extra="forbid")

    age: float = Field(description="Patient age")
    systolic_bp: float = Field(description="Systolic blood pressure")
    diastolic_bp: float = Field(description="Diastolic blood pressure")
    blood_glucose: float = Field(description="Blood glucose level")
    body_temp: float = Field(description="Body temperature")
    heart_rate: float = Field(description="Heart rate")


class PredictionResponse(BaseModel):
    risk_level: str
    confidence: float
    color: str
    referral: str
    reasons: List[str]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool


@asynccontextmanager
async def lifespan(_: FastAPI):
    loaded = model_service.load_model()
    if loaded:
        logger.info("MaternalGuard: model and SHAP explainer loaded successfully")
    else:
        logger.warning("MaternalGuard: model artifacts not ready; /predict will return 503")
    yield


app = FastAPI(
    title="MaternalGuard API",
    description="AI-powered maternal health risk screener for ASHA workers",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse(status="ok", model_loaded=model_service.model_loaded)


@app.get("/demo", response_model=PredictionResponse)
def demo_prediction() -> PredictionResponse:
    return PredictionResponse(
        risk_level="High Risk",
        confidence=0.87,
        color="red",
        referral="Send to PHC immediately",
        reasons=[
            "Blood glucose level",
            "Systolic blood pressure",
            "Patient age",
        ],
    )


@app.post("/predict", response_model=PredictionResponse)
def predict_risk(vitals: PatientVitals) -> PredictionResponse:
    try:
        prediction = model_service.predict(
            age=vitals.age,
            systolic_bp=vitals.systolic_bp,
            diastolic_bp=vitals.diastolic_bp,
            blood_glucose=vitals.blood_glucose,
            body_temp=vitals.body_temp,
            heart_rate=vitals.heart_rate,
        )
    except ModelNotReadyError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Prediction failed") from exc

    return PredictionResponse(**prediction)
