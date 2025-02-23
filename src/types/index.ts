// Base Types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends BaseEntity {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  height: number | null;
  birth_date: string | null;
  gender: 'male' | 'female' | 'other' | null;
}

// Health Related Types
export interface VitalSign extends BaseEntity {
  user_id: string;
  measured_at: string;
  weight: number | null;
  systolic_bp: number | null;
  diastolic_bp: number | null;
  heart_rate: number | null;
  body_temperature: number | null;
  notes: string | null;
}

export interface VitalSignGoal extends BaseEntity {
  user_id: string;
  target_weight: number | null;
  target_systolic_bp: number | null;
  target_diastolic_bp: number | null;
  target_heart_rate: number | null;
  notes: string | null;
}

export type ExerciseType = 'walking' | 'running' | 'cycling' | 'swimming' | 'weight_training' | 'yoga' | 'other';

export interface Exercise extends BaseEntity {
  user_id: string;
  exercise_type: ExerciseType;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  distance_km: number | null;
  calories_burned: number | null;
  notes: string | null;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal extends BaseEntity {
  user_id: string;
  meal_type: MealType;
  eaten_at: string;
  name: string;
  calories: number | null;
  protein_grams: number | null;
  carbs_grams: number | null;
  fat_grams: number | null;
  notes: string | null;
}

// Form Types
export interface FormState {
  loading: boolean;
  error: string | null;
}

// Common Types
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

// Chart Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
}

// Stats Types
export interface VitalSignStats {
  average: number;
  min: number;
  max: number;
  trend: 'up' | 'down' | 'stable';
}

// Additional Types
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
