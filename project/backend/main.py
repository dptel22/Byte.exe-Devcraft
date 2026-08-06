from contextlib import asynccontextmanager
import logging
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field

from model_loader import FEATURE_IDS, ModelNotReadyError, model_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TOP_SHAP_FEATURE_MAP = {
    "age": "Age",
    "systolic_bp": "Blood Pressure",
    "diastolic_bp": "Blood Pressure",
    "blood_glucose": "Blood Glucose",
    "body_temp": "Body Temperature",
    "heart_rate": "Heart Rate",
    "pulse_pressure": "Blood Pressure",
    "map": "Blood Pressure",
    "bp_ratio": "Blood Pressure",
    "age_glucose": "Blood Glucose",
}

NEXT_VISIT_DAYS = {
    "High Risk": 1,
    "Mid Risk": 2,
    "Low Risk": 14,
}

REFERRAL_URGENCY = {
    "High Risk": "Send to PHC today. Do not wait.",
    "Mid Risk": "Revisit patient in 48 hours. Re-screen at next visit.",
    "Low Risk": "Next scheduled visit in 2 weeks. Continue routine monitoring.",
}


class PatientVitals(BaseModel):
    model_config = ConfigDict(extra="forbid")

    age: float = Field(description="Patient age")
    systolic_bp: float = Field(description="Systolic blood pressure")
    diastolic_bp: float = Field(description="Diastolic blood pressure")
    blood_glucose: float = Field(description="Blood glucose level")
    body_temp: float = Field(description="Body temperature")
    heart_rate: float = Field(description="Heart rate")


class ShapReason(BaseModel):
    feature: str
    shap: float
    direction: str


class PredictionResponse(BaseModel):
    risk_level: str
    confidence: float
    color: str
    referral: str
    reasons: List[str]
    top_reasons: List[ShapReason] = []
    top_shap_feature: str
    counseling_key: str
    next_visit_days: int
    referral_urgency: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool


def _get_top_shap_feature(
    vitals: PatientVitals,
) -> str:
    input_array = model_service._build_features(
        age=vitals.age,
        systolic_bp=vitals.systolic_bp,
        diastolic_bp=vitals.diastolic_bp,
        blood_glucose=vitals.blood_glucose,
        body_temp=vitals.body_temp,
        heart_rate=vitals.heart_rate,
    )
    probabilities = model_service.model.predict_proba(input_array)[0]
    class_index = max(
        range(len(probabilities)),
        key=lambda index: float(probabilities[index]),
    )
    shap_values = model_service.explainer.shap_values(input_array)
    class_contributions = model_service._extract_class_contributions(
        shap_values,
        class_index,
    )
    top_feature_index = max(
        range(len(class_contributions)),
        key=lambda index: abs(float(class_contributions[index])),
    )
    top_feature_id = FEATURE_IDS[top_feature_index]
    return TOP_SHAP_FEATURE_MAP[top_feature_id]


def _build_response_enrichment(
    vitals: PatientVitals,
    risk_level: str,
) -> dict:
    top_shap_feature = _get_top_shap_feature(vitals)
    return {
        "top_shap_feature": top_shap_feature,
        "counseling_key": f"{risk_level}_{top_shap_feature}",
        "next_visit_days": NEXT_VISIT_DAYS[risk_level],
        "referral_urgency": REFERRAL_URGENCY[risk_level],
    }


@asynccontextmanager
async def lifespan(_: FastAPI):
    loaded = model_service.load_model()
    if loaded:
        logger.info("VitaSakhi: model and SHAP explainer loaded successfully")
    else:
        logger.warning("VitaSakhi: model artifacts not ready; /predict will return 503")
    yield


app = FastAPI(
    title="VitaSakhi API",
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
        top_reasons=[
            {"feature": "SystolicBP", "shap": 1.56, "direction": "elevating"},
            {"feature": "BS", "shap": -0.46, "direction": "reducing"},
            {"feature": "BodyTemp", "shap": 0.74, "direction": "elevating"},
        ],
        top_shap_feature="Blood Pressure",
        counseling_key="High Risk_Blood Pressure",
        next_visit_days=1,
        referral_urgency="Send to PHC today. Do not wait.",
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
        prediction.update(_build_response_enrichment(vitals, prediction["risk_level"]))
    except ModelNotReadyError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Prediction failed") from exc

    return PredictionResponse(**prediction)
