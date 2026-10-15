import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { useUser } from '../contexts/UserContext';
import { 
  Activity, 
  Heart, 
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Phone,
  MapPin,
  Calendar,
  Weight,
  Ruler
} from 'lucide-react';

interface OnboardingFormProps {
  onComplete: () => void;
}

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'light', label: 'Lightly Active', description: 'Exercise 1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', description: 'Exercise 3-5 days/week' },
  { value: 'very', label: 'Very Active', description: 'Exercise 6-7 days/week' },
  { value: 'extra', label: 'Extra Active', description: 'Very intense daily exercise' },
];

const dietaryOptions = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
  'Keto', 'Paleo', 'Low-Carb', 'Halal', 'Kosher'
];

const healthConditions = [
  'Diabetes', 'Hypertension', 'Heart Disease', 'High Cholesterol',
  'Celiac Disease', 'IBS', 'Food Allergies', 'PCOS', 'Thyroid Issues', 'None'
];

const goals = [
  { value: 'weight_loss', label: 'Weight Loss', icon: <Activity /> },
  { value: 'muscle_gain', label: 'Muscle Gain', icon: <Activity /> },
  { value: 'maintain', label: 'Maintain Weight', icon: <Target /> },
  { value: 'health', label: 'Improve Health', icon: <Heart /> },
  { value: 'energy', label: 'Increase Energy', icon: <Activity /> },
];

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const { updateUserData, generateDietPlan } = useUser();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    location: '',
    
    // Physical Info
    age: '',
    gender: '',
    weight: '',
    height: '',
    
    // Activity & Goals
    activityLevel: '',
    fitnessGoal: '',
    
    // Dietary Preferences
    dietaryRestrictions: [] as string[],
    healthConditions: [] as string[],
    allergies: '',
    
    // Additional Info
    preferredCuisine: '',
    mealsPerDay: '3',
    waterIntake: '8',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxToggle = (field: 'dietaryRestrictions' | 'healthConditions', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const userData = {
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        weight: parseFloat(formData.weight) || 0,
        height: parseFloat(formData.height) || 0,
        activity_level: formData.activityLevel,
        dietary_restrictions: formData.dietaryRestrictions,
        health_conditions: formData.healthConditions,
        preferred_cuisine: formData.preferredCuisine || 'Any',
        current_mood: 'neutral',
        calorieGoal: 2000,
        proteinGoal: 150,
        carbsGoal: 200,
        fatGoal: 65,
        // Additional personal info
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        location: formData.location,
        fitnessGoal: formData.fitnessGoal,
        allergies: formData.allergies,
        mealsPerDay: parseInt(formData.mealsPerDay),
        waterIntake: parseInt(formData.waterIntake),
      };

      // 1. Save user profile to backend
      await updateUserData(userData as any);

      // 2. Generate personalised diet plan using all backend modules
      //    (runs in background after profile save; errors don't block onboarding)
      generateDietPlan(userData as any).catch((err) =>
        console.warn('Diet plan generation skipped:', err)
      );

      onComplete();
    } catch (error) {
      console.error('Error saving user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
              <p className="text-gray-600">Let's get to know you better</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State"
                  className="pl-10"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Physical Information</h3>
              <p className="text-gray-600">Help us calculate your nutritional needs</p>
            </div>

            <div className="space-y-2">
              <Label>Gender *</Label>
              <div className="grid grid-cols-3 gap-3">
                {['Male', 'Female', 'Other'].map((gender) => (
                  <Button
                    key={gender}
                    type="button"
                    variant={formData.gender === gender.toLowerCase() ? 'default' : 'outline'}
                    onClick={() => handleInputChange('gender', gender.toLowerCase())}
                    className="w-full"
                  >
                    {gender}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="25"
                min="15"
                max="100"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="70"
                    className="pl-10"
                    step="0.1"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm) *</Label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="170"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Activity Level *</Label>
              <div className="space-y-2">
                {activityLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => handleInputChange('activityLevel', level.value)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.activityLevel === level.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="font-semibold">{level.label}</div>
                    <div className="text-sm text-gray-600">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Dietary Preferences</h3>
              <p className="text-gray-600">Tell us about your dietary needs and restrictions</p>
            </div>

            <div className="space-y-2">
              <Label>Dietary Restrictions</Label>
              <div className="grid grid-cols-2 gap-3">
                {dietaryOptions.map((diet) => (
                  <div
                    key={diet}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.dietaryRestrictions.includes(diet)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => handleCheckboxToggle('dietaryRestrictions', diet)}
                  >
                    <Checkbox
                      checked={formData.dietaryRestrictions.includes(diet)}
                      onCheckedChange={() => handleCheckboxToggle('dietaryRestrictions', diet)}
                    />
                    <span className="text-sm">{diet}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Health Conditions</Label>
              <div className="grid grid-cols-2 gap-3">
                {healthConditions.map((condition) => (
                  <div
                    key={condition}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.healthConditions.includes(condition)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => handleCheckboxToggle('healthConditions', condition)}
                  >
                    <Checkbox
                      checked={formData.healthConditions.includes(condition)}
                      onCheckedChange={() => handleCheckboxToggle('healthConditions', condition)}
                    />
                    <span className="text-sm">{condition}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Food Allergies (comma separated)</Label>
              <Input
                id="allergies"
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                placeholder="e.g., Peanuts, Shellfish, Soy"
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Goals & Preferences</h3>
              <p className="text-gray-600">What do you want to achieve?</p>
            </div>

            <div className="space-y-2">
              <Label>Fitness Goal *</Label>
              <div className="space-y-2">
                {goals.map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => handleInputChange('fitnessGoal', goal.value)}
                    className={`w-full p-4 rounded-lg border-2 flex items-center space-x-3 transition-all ${
                      formData.fitnessGoal === goal.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-green-600">{goal.icon}</div>
                    <div className="font-semibold text-left">{goal.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuisine">Preferred Cuisine</Label>
              <Input
                id="cuisine"
                value={formData.preferredCuisine}
                onChange={(e) => handleInputChange('preferredCuisine', e.target.value)}
                placeholder="e.g., Mediterranean, Asian, Indian"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meals">Meals Per Day</Label>
                <Input
                  id="meals"
                  type="number"
                  value={formData.mealsPerDay}
                  onChange={(e) => handleInputChange('mealsPerDay', e.target.value)}
                  min="1"
                  max="6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="water">Water Intake (glasses/day)</Label>
                <Input
                  id="water"
                  type="number"
                  value={formData.waterIntake}
                  onChange={(e) => handleInputChange('waterIntake', e.target.value)}
                  min="1"
                  max="20"
                />
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.dateOfBirth;
      case 2:
        return formData.gender && formData.age && formData.weight && formData.height && formData.activityLevel;
      case 3:
        return true; // Optional fields
      case 4:
        return formData.fitnessGoal;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary">Step {step} of 4</Badge>
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-2 w-12 rounded-full transition-all ${
                      s <= step ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <CardTitle className="text-center">Complete Your Profile</CardTitle>
            <CardDescription className="text-center">
              Help us personalize your nutrition journey
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              
              {step < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="ml-auto bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isLoading}
                  className="ml-auto bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  {isLoading ? (
                    'Saving...'
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
