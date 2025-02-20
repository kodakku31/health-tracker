export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  birthDate: Date;
  gender: 'male' | 'female' | 'other';
  height: number;
  targetWeight?: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  createdAt: Date;
  updatedAt: Date;
}

export interface VitalSigns {
  id: string;
  userId: string;
  recordedAt: Date;
  weight?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  bodyTemperature?: number;
  heartRate?: number;
  notes?: string;
}

export interface Exercise {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  type: ExerciseType;
  intensity: 'low' | 'moderate' | 'high';
  caloriesBurned: number;
  distance?: number;
  steps?: number;
  notes?: string;
}

export type ExerciseType = 'walking' | 'running' | 'cycling' | 'swimming' | 'weight_training' | 'yoga' | 'other';

export interface Sleep {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  deepSleepDuration?: number;
  lightSleepDuration?: number;
  remSleepDuration?: number;
  interruptions?: number;
  notes?: string;
}

export interface MealLog {
  id: string;
  userId: string;
  timestamp: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  totalCalories: number;
  photoUrl?: string;
  notes?: string;
}

export interface FoodItem {
  name: string;
  quantity: number;
  unit: 'g' | 'ml' | 'servings';
  calories: number;
  nutrients: {
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber?: number;
    sugar?: number;
  };
}

export interface Goal {
  id: string;
  userId: string;
  type: GoalType;
  target: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'failed';
  progress: number;
  reminderFrequency?: 'daily' | 'weekly' | 'monthly';
  notes?: string;
}

export type GoalType = 'weight' | 'exercise' | 'sleep' | 'nutrition' | 'water_intake' | 'steps';

export interface HealthScore {
  id: string;
  userId: string;
  date: Date;
  overallScore: number;
  components: {
    exercise: number;
    sleep: number;
    nutrition: number;
    vitals: number;
  };
  insights: string[];
}

export interface AppSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    enabled: boolean;
    types: {
      goals: boolean;
      measurements: boolean;
      insights: boolean;
      reminders: boolean;
    };
  };
  measurementUnit: 'metric' | 'imperial';
  language: string;
  privacySettings: {
    dataSharing: boolean;
    anonymousAnalytics: boolean;
  };
}
