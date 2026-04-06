
import pickle
import shap

# Load your working model
with open("maternal_risk_model.pkl", "rb") as f:
    model = pickle.load(f)

# Regenerate the explainer from it
explainer = shap.TreeExplainer(model)

# Save the new explainer PKL (overwrites the corrupt one)
with open("maternal_risk_shap_explainer.pkl", "wb") as f:
    pickle.dump(explainer, f)

print("Done — SHAP explainer regenerated.")
