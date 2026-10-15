"""
recommendation_engine.py
------------------------
Generates diet-type recommendations from a user profile.

Primary path  : load a trained sklearn model (.pkl) and run predict().
Fallback path : deterministic rule-based logic so the app works even
                when no model file is available.
"""

import os
import logging
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Model helpers
# ---------------------------------------------------------------------------

def load_model(model_path: str) -> Optional[Any]:
    """Load a pickled sklearn model.  Returns None if file is missing."""
    if not os.path.exists(model_path):
        logger.warning(f"Model file not found: {model_path} — will use rule-based fallback.")
        return None
    try:
        import joblib
        model = joblib.load(model_path)
        logger.info(f"Loaded diet recommender model from {model_path}")
        return model
    except Exception as exc:
        logger.error(f"Failed to load model: {exc}")
        return None


# ---------------------------------------------------------------------------
# Rule-based fallback recommendation
# ---------------------------------------------------------------------------

def _bmi(weight_kg: float, height_cm: float) -> float:
    if height_cm <= 0:
        return 22.0
    height_m = height_cm / 100.0
    return weight_kg / (height_m ** 2)


def _rule_based_recommendation(user_profile: Dict[str, Any]) -> str:
    """Deterministic recommendation based on BMI, activity, restrictions, and conditions."""
    weight  = float(user_profile.get('weight', 70) or 70)
    height  = float(user_profile.get('height', 170) or 170)
    bmi     = _bmi(weight, height)

    activity      = str(user_profile.get('activity_level', '') or '').lower()
    restrictions  = [r.lower() for r in (user_profile.get('dietary_restrictions') or [])]
    conditions    = [c.lower() for c in (user_profile.get('health_conditions') or [])]

    is_active = any(w in activity for w in ('active', 'moderate', 'very', 'extra'))
    is_vegan  = 'vegan' in restrictions
    is_veggie = 'vegetarian' in restrictions or is_vegan
    has_diab  = any('diabet' in c for c in conditions)
    has_hbp   = any(c in conditions for c in ('hypertension', 'high blood pressure'))
    has_chol  = any(c in conditions for c in ('high cholesterol', 'heart disease'))

    # --- Build recommendation string ---
    if has_diab:
        base = (
            "Low Glycaemic Index (Low-GI) diet recommended. "
            "Focus on complex carbohydrates, fibre-rich vegetables, and lean proteins. "
            "Limit added sugars and refined carbs to stabilise blood glucose levels."
        )
    elif has_hbp:
        base = (
            "DASH (Dietary Approaches to Stop Hypertension) diet recommended. "
            "Emphasise fruits, vegetables, whole grains, and low-sodium foods. "
            "Limit processed foods, salt, and saturated fats."
        )
    elif has_chol:
        base = (
            "Heart-Healthy diet recommended. "
            "Prioritise omega-3 fatty acids, soluble fibre, and plant sterols. "
            "Reduce saturated fats, trans fats, and dietary cholesterol."
        )
    elif is_vegan:
        base = (
            "Whole-Food Plant-Based diet recommended. "
            "Ensure adequate B12, iron, calcium, and omega-3 intake through fortified foods or supplements."
        )
    elif is_veggie:
        base = (
            "Balanced Lacto-Ovo Vegetarian diet recommended. "
            "Include eggs and dairy for complete proteins, and monitor iron and zinc intake."
        )
    elif bmi >= 30:
        base = (
            "Calorie-Controlled, nutrient-dense diet recommended for healthy weight management. "
            "Emphasise high-volume, low-calorie-density foods: vegetables, legumes, and lean proteins."
        )
    elif bmi < 18.5:
        base = (
            "High-Calorie, nutrient-dense diet recommended to support healthy weight gain. "
            "Include healthy fats, complex carbohydrates, and high-quality protein sources."
        )
    elif is_active:
        base = (
            "High-Protein, performance-focused diet recommended. "
            "Target 1.6–2.0 g protein per kg body weight. "
            "Time carbohydrate intake around workouts for optimal energy and recovery."
        )
    else:
        base = (
            "Balanced Mediterranean-style diet recommended. "
            "Emphasise whole grains, healthy fats (olive oil, nuts), lean proteins, and abundant vegetables."
        )

    # Append BMI note
    bmi_note = f" (Current estimated BMI: {bmi:.1f})"
    return base + bmi_note


# ---------------------------------------------------------------------------
# Public interface
# ---------------------------------------------------------------------------

def recommend_diet(user_profile: Dict[str, Any], model: Optional[Any] = None) -> str:
    """
    Generate a diet recommendation.

    If a trained sklearn model is supplied, use it.
    Otherwise fall back to the rule-based recommender.
    """
    # --- Model path (trained sklearn) ---
    if model is not None:
        try:
            import pandas as pd
            features = {
                'age':         float(user_profile.get('age', 30) or 30),
                'weight':      float(user_profile.get('weight', 70) or 70),
                'height':      float(user_profile.get('height', 170) or 170),
                'is_active':   1 if 'active' in str(user_profile.get('activity_level', '')).lower() else 0,
                'is_vegan':    1 if 'vegan'  in [r.lower() for r in (user_profile.get('dietary_restrictions') or [])] else 0,
                'has_diabetes':1 if any('diabet' in c.lower() for c in (user_profile.get('health_conditions') or [])) else 0,
            }
            X = pd.DataFrame([features])
            diet_type = model.predict(X)[0]
            label_map = {
                0: "Low-Calorie diet recommended for your health profile.",
                1: "Balanced Plant-Based diet recommended for your profile.",
                2: "High-Protein diet recommended for your activity level.",
            }
            return label_map.get(diet_type, "Balanced diet recommended.")
        except Exception as exc:
            logger.warning(f"Model prediction failed ({exc}) — using rule-based fallback.")

    # --- Deterministic fallback ---
    return _rule_based_recommendation(user_profile)
