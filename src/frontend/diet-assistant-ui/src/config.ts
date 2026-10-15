// API Configuration
export const API_BASE_URL = 'http://localhost:5000';

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN:       `${API_BASE_URL}/api/auth/login`,
  REGISTER:    `${API_BASE_URL}/api/auth/register`,
  LOGOUT:      `${API_BASE_URL}/api/auth/logout`,
  UPDATE_USER: `${API_BASE_URL}/api/user/update`,
};

// Diet Plan Endpoints
export const DIET_ENDPOINTS = {
  GENERATE:    `${API_BASE_URL}/api/generate-diet`,
  GET_PLAN:    `${API_BASE_URL}/api/diet-plan`,
};

// Meal & Food Endpoints
export const MEAL_ENDPOINTS = {
  AI_SUGGESTIONS: `${API_BASE_URL}/api/ai-meal-suggestions`,
  FOOD_SEARCH:    `${API_BASE_URL}/api/foods/search`,
  ANALYZE_IMAGE:  `${API_BASE_URL}/api/analyze-food-image`,
  RECIPE_SEARCH:  `${API_BASE_URL}/api/recipes/search`,
  RECOMMEND:      `${API_BASE_URL}/api/recommend-recipes`,
};