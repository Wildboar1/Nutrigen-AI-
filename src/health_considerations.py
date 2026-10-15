"""
health_considerations.py
------------------------
Adjusts a generated diet plan based on the user's health conditions.
Each food item in the plan is a dict with keys: calories, protein, fat,
carbs, sugar, sodium, and optionally 'name'.
"""

from typing import List, Dict, Any


# Thresholds per serving/item
DIABETES_MAX_SUGAR_G = 15        # flag items with sugar > 15g
HYPERTENSION_MAX_SODIUM_MG = 300 # flag items with sodium > 300mg
CHOLESTEROL_MAX_FAT_G = 25       # flag items with fat > 25g
KIDNEY_MAX_PROTEIN_G = 25        # flag items with protein > 25g (renal diet)


def _flag(item: Dict[str, Any], condition: str, reason: str) -> Dict[str, Any]:
    """Attach a warning flag to a food item without removing it."""
    item = dict(item)  # shallow copy so we don't mutate caller's data
    warnings: list = item.get('health_warnings', [])
    warnings.append({'condition': condition, 'reason': reason})
    item['health_warnings'] = warnings
    return item


def adjust_for_health_conditions(
    diet_plan: List[Dict[str, Any]],
    health_conditions: List[str],
) -> List[Dict[str, Any]]:
    """
    Review each meal in the diet plan and annotate items that may be
    unsuitable for the user's health conditions.

    Returns the same list with optional 'health_warnings' added to items,
    and an overall 'condition_notes' key on each item when applicable.
    """
    if not health_conditions or not diet_plan:
        return diet_plan

    conditions_lower = {c.strip().lower() for c in health_conditions}
    adjusted: List[Dict[str, Any]] = []

    for item in diet_plan:
        item = dict(item)  # work on a copy

        sugar   = float(item.get('sugar',   0) or 0)
        sodium  = float(item.get('sodium',  0) or 0)
        fat     = float(item.get('fat',     0) or 0)
        protein = float(item.get('protein', 0) or 0)
        name    = item.get('name', 'this item')

        # --- Diabetes ---
        if any(k in conditions_lower for k in ('diabetes', 'type 2 diabetes', 'type 1 diabetes')):
            if sugar > DIABETES_MAX_SUGAR_G:
                item = _flag(
                    item, 'Diabetes',
                    f'{name} contains {sugar:.1f}g sugar — consider a lower-sugar alternative.'
                )
            # also reduce carb-dense items subtly
            if float(item.get('carbs', 0) or 0) > 60:
                item = _flag(
                    item, 'Diabetes',
                    f'{name} is high in carbohydrates ({item.get("carbs"):.0f}g) — monitor glycaemic impact.'
                )

        # --- Hypertension / High Blood Pressure ---
        if any(k in conditions_lower for k in ('hypertension', 'high blood pressure')):
            if sodium > HYPERTENSION_MAX_SODIUM_MG:
                item = _flag(
                    item, 'Hypertension',
                    f'{name} is high in sodium ({sodium:.0f}mg) — choose a low-sodium alternative.'
                )

        # --- High Cholesterol ---
        if any(k in conditions_lower for k in ('high cholesterol', 'hypercholesterolemia', 'heart disease')):
            if fat > CHOLESTEROL_MAX_FAT_G:
                item = _flag(
                    item, 'High Cholesterol',
                    f'{name} is high in fat ({fat:.1f}g) — opt for a leaner option.'
                )

        # --- Kidney Disease ---
        if any(k in conditions_lower for k in ('kidney disease', 'chronic kidney disease', 'ckd', 'renal')):
            if protein > KIDNEY_MAX_PROTEIN_G:
                item = _flag(
                    item, 'Kidney Disease',
                    f'{name} is high in protein ({protein:.1f}g) — consult your dietitian.'
                )

        # --- IBS / Digestive Issues ---
        if any(k in conditions_lower for k in ('ibs', 'irritable bowel syndrome', 'crohn', 'celiac')):
            # Flag if high in fat (triggers IBS) or high sugar
            if fat > 20 or sugar > 12:
                item = _flag(
                    item, 'Digestive Condition',
                    f'{name} may be hard to digest — consider a lower-fat, lower-sugar option.'
                )

        adjusted.append(item)

    return adjusted
