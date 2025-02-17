# 健康管理アプリ データ定義

## 1. UserProfile
```typescript
interface UserProfile {
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
```

## 2. VitalSigns
```typescript
interface VitalSigns {
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
```

## 3. Exercise
```typescript
interface Exercise {
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

type ExerciseType = 'walking' | 'running' | 'cycling' | 'swimming' | 'weight_training' | 'yoga' | 'other';
```

## 4. Sleep
```typescript
interface Sleep {
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
```

## 5. MealLog & FoodItem
```typescript
interface MealLog {
  id: string;
  userId: string;
  timestamp: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  totalCalories: number;
  photoUrl?: string;
  notes?: string;
}

interface FoodItem {
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
```

## 6. Goal & GoalType
```typescript
interface Goal {
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

type GoalType = 'weight' | 'exercise' | 'sleep' | 'nutrition' | 'water_intake' | 'steps';
```

## 7. HealthScore
```typescript
interface HealthScore {
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
```

## 8. AppSettings
```typescript
interface AppSettings {
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
```

## データの関係性

1. **ユーザープロファイル**を中心に、他のすべてのデータが関連付けられます
2. **健康スコア**は他のデータモデルから計算される集計データです
3. **目標**は特定のデータタイプ（体重、運動など）と紐付けられます

## データ更新頻度

1. **高頻度更新**
   - バイタルサイン（毎日）
   - 食事記録（1日複数回）
   - 運動記録（1日複数回）

2. **中頻度更新**
   - 睡眠記録（毎日）
   - 健康スコア（毎日）
   - 目標の進捗（毎日）

3. **低頻度更新**
   - ユーザープロファイル
   - アプリケーション設定
   - 目標設定

## データバリデーションルール

1. **必須チェック**
   - ユーザーID
   - タイムスタンプ
   - 測定値の基本項目

2. **範囲チェック**
   - 体重: 0-500 kg
   - 体温: 30-45 ℃
   - 血圧: 収縮期 0-300 mmHg, 拡張期 0-200 mmHg
   - カロリー: 0-10000 kcal
   - スコア: 0-100

3. **論理チェック**
   - 開始時刻 < 終了時刻
   - 目標値 > 現在値（減量目標の場合は逆）
   - 合計値の整合性（例：栄養素の合計）
