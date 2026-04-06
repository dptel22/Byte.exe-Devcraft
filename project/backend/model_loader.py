import pickle
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
import shap


FEATURE_IDS: List[str] = [
    "age",
    "systolic_bp",
    "diastolic_bp",
    "blood_glucose",
    "body_temp",
    "heart_rate",
    "pulse_pressure",
    "map",
    "bp_ratio",
    "age_glucose",
]

FEATURE_LABELS = {
    "age": "Patient age",
    "systolic_bp": "Systolic blood pressure",
    "diastolic_bp": "Diastolic blood pressure",
    "blood_glucose": "Blood glucose level",
    "body_temp": "Body temperature",
    "heart_rate": "Heart rate",
    "pulse_pressure": "Pulse pressure",
    "map": "Mean arterial pressure",
    "bp_ratio": "BP ratio",
    "age_glucose": "Age-glucose interaction",
}

FALLBACK_RISK_LABELS = {
    0: "Low Risk",
    1: "Mid Risk",
    2: "High Risk",
}

RISK_METADATA = {
    "High Risk": {
        "color": "red",
        "referral": "Send to PHC immediately",
    },
    "Mid Risk": {
        "color": "amber",
        "referral": "Revisit in 48 hours",
    },
    "Low Risk": {
        "color": "green",
        "referral": "No immediate action needed",
    },
}

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "maternal_risk_xgb_model.pkl"
LABEL_ENCODER_PATH = MODEL_DIR / "maternal_risk_label_encoder.pkl"


class ModelNotReadyError(RuntimeError):
    """Raised when prediction is requested before the model artifacts are ready."""


class MaternalRiskModelService:
    def __init__(
        self,
        model_path: Path = MODEL_PATH,
        label_encoder_path: Path = LABEL_ENCODER_PATH,
    ):
        self.model_path = model_path
        self.label_encoder_path = label_encoder_path
        self.model = None
        self.explainer = None
        self.label_encoder = None

    @property
    def model_loaded(self) -> bool:
        return self.model is not None and self.explainer is not None

    def load_model(self) -> bool:
        if not self.model_path.exists():
            self.model = None
            self.explainer = None
            self.label_encoder = None
            return False

        try:
            with self.model_path.open("rb") as model_file:
                self.model = pickle.load(model_file)

            # Always regenerate the explainer at startup instead of trusting
            # the saved pickle, which may be stale or corrupt.
            self.explainer = shap.TreeExplainer(self.model)

            if self.label_encoder_path.exists():
                with self.label_encoder_path.open("rb") as encoder_file:
                    self.label_encoder = pickle.load(encoder_file)
            else:
                self.label_encoder = None
        except Exception:
            self.model = None
            self.explainer = None
            self.label_encoder = None
            return False

        return True

    def predict(
        self,
        age: float,
        systolic_bp: float,
        diastolic_bp: float,
        blood_glucose: float,
        body_temp: float,
        heart_rate: float,
    ) -> Dict[str, Any]:
        if not self.model_loaded:
            raise ModelNotReadyError("Model not trained yet")

        input_array = self._build_features(
            age=age,
            systolic_bp=systolic_bp,
            diastolic_bp=diastolic_bp,
            blood_glucose=blood_glucose,
            body_temp=body_temp,
            heart_rate=heart_rate,
        )

        probabilities = np.asarray(self.model.predict_proba(input_array))[0]
        classes = np.asarray(getattr(self.model, "classes_", np.arange(len(probabilities))))
        class_index = int(np.argmax(probabilities))
        predicted_class = classes[class_index]

        risk_level = self._decode_risk_label(predicted_class)
        metadata = RISK_METADATA[risk_level]
        reasons = self._build_top_reasons(input_array, class_index)

        return {
            "risk_level": risk_level,
            "confidence": round(float(probabilities[class_index]), 2),
            "color": metadata["color"],
            "referral": metadata["referral"],
            "reasons": reasons,
        }

    def _build_features(
        self,
        age: float,
        systolic_bp: float,
        diastolic_bp: float,
        blood_glucose: float,
        body_temp: float,
        heart_rate: float,
    ) -> np.ndarray:
        pulse_pressure = systolic_bp - diastolic_bp
        map_value = diastolic_bp + (pulse_pressure / 3)
        bp_ratio = systolic_bp / diastolic_bp
        age_glucose = age * blood_glucose

        return np.asarray(
            [[
                age,
                systolic_bp,
                diastolic_bp,
                blood_glucose,
                body_temp,
                heart_rate,
                pulse_pressure,
                map_value,
                bp_ratio,
                age_glucose,
            ]],
            dtype=float,
        )

    def _decode_risk_label(self, predicted_class: Any) -> str:
        if self.label_encoder is not None:
            decoded = self.label_encoder.inverse_transform([predicted_class])[0]
            return self._normalize_risk_label(decoded)

        try:
            return FALLBACK_RISK_LABELS[int(predicted_class)]
        except (KeyError, TypeError, ValueError) as exc:
            raise ValueError("Unsupported model output") from exc

    def _normalize_risk_label(self, label: Any) -> str:
        normalized = str(label).strip().lower().replace("_", " ")
        normalized = " ".join(normalized.split())

        label_map = {
            "high": "High Risk",
            "high risk": "High Risk",
            "mid": "Mid Risk",
            "mid risk": "Mid Risk",
            "medium": "Mid Risk",
            "medium risk": "Mid Risk",
            "low": "Low Risk",
            "low risk": "Low Risk",
        }

        if normalized not in label_map:
            raise ValueError("Unsupported label encoder output")

        return label_map[normalized]

    def _build_top_reasons(self, input_array: np.ndarray, class_index: int) -> List[str]:
        shap_values = self.explainer.shap_values(input_array)
        class_contributions = self._extract_class_contributions(shap_values, class_index)

        ranked_indices = np.argsort(np.abs(class_contributions))[::-1][:3]
        return [FEATURE_LABELS[FEATURE_IDS[index]] for index in ranked_indices]

    def _extract_class_contributions(self, shap_values: Any, class_index: int) -> np.ndarray:
        if isinstance(shap_values, list):
            return np.asarray(shap_values[class_index])[0]

        values = np.asarray(getattr(shap_values, "values", shap_values))

        if values.ndim == 2:
            return values[0]

        if values.ndim == 3:
            if values.shape[0] == 1 and values.shape[1] == len(FEATURE_IDS):
                return values[0, :, class_index]
            if values.shape[0] == 1 and values.shape[1] != len(FEATURE_IDS):
                return values[0, class_index, :]
            if values.shape[0] != 1 and values.shape[1] == 1:
                return values[class_index, 0, :]

        raise ValueError("Unexpected SHAP value shape")


model_service = MaternalRiskModelService()
