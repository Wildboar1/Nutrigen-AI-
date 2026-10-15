import pandas as pd
import os
import random

class RecipeRecommender:
    def __init__(self, recipe_csv_path):
        self.recipe_csv_path = recipe_csv_path
        self.recipes = self._load_recipes()

    def _load_recipes(self):
        if not os.path.exists(self.recipe_csv_path):
            raise FileNotFoundError(f"Recipe file not found: {self.recipe_csv_path}")
        try:
            # Load up to 25,000 recipes for snappy server startup and rich recommendations
            df = pd.read_csv(self.recipe_csv_path, nrows=25000, low_memory=False)
        except Exception:
            df = pd.read_csv(self.recipe_csv_path, nrows=1000)  # fallback to sample
        return df

    def recommend(self, dietary_restrictions=None, preferences=None, n=5):
        df = self.recipes
        
        # Determine column names flexibly
        ingredient_col = None
        for col in ['RecipeIngredientParts', 'ingredients', 'RecipeIngredientQuantities', 'Description']:
            if col in df.columns:
                ingredient_col = col
                break
                
        diet_col = None
        for col in ['Keywords', 'RecipeCategory', 'diet', 'Description']:
            if col in df.columns:
                diet_col = col
                break

        if dietary_restrictions and diet_col:
            for restriction in dietary_restrictions:
                df = df[df[diet_col].astype(str).str.contains(restriction, case=False, na=False)]
                
        if preferences and ingredient_col:
            for pref in preferences:
                df = df[df[ingredient_col].astype(str).str.contains(pref, case=False, na=False)]
                
        if len(df) == 0:
            # Fallback to general sample if strict filter yields no items
            return self.recipes.sample(min(n, len(self.recipes))).to_dict(orient='records')
        return df.sample(min(n, len(df))).to_dict(orient='records')
