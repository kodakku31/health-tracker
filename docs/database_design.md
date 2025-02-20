# データベース設計

## テーブル構造

### profiles
- ユーザープロファイル情報を管理
```sql
create table profiles (
  id uuid references auth.users primary key,
  email text unique not null,
  display_name text,
  birth_date date,
  gender text check (gender in ('male', 'female', 'other')),
  height numeric,
  target_weight numeric,
  activity_level text check (activity_level in ('sedentary', 'lightly_active', 'moderately_active', 'very_active')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### vital_signs
- ユーザーのバイタルサイン記録
```sql
create table vital_signs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  recorded_at timestamp with time zone not null,
  weight numeric,
  systolic_pressure integer,
  diastolic_pressure integer,
  body_temperature numeric,
  heart_rate integer,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### exercises
- 運動記録
```sql
create table exercises (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  type text check (type in ('walking', 'running', 'cycling', 'swimming', 'weight_training', 'yoga', 'other')),
  intensity text check (intensity in ('low', 'moderate', 'high')),
  calories_burned integer,
  distance numeric,
  steps integer,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### sleep_records
- 睡眠記録
```sql
create table sleep_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  quality text check (quality in ('poor', 'fair', 'good', 'excellent')),
  deep_sleep_duration integer,
  light_sleep_duration integer,
  rem_sleep_duration integer,
  interruptions integer,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### meal_logs
- 食事記録
```sql
create table meal_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  timestamp timestamp with time zone not null,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  total_calories integer,
  photo_url text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### food_items
- 食事記録の詳細
```sql
create table food_items (
  id uuid primary key default uuid_generate_v4(),
  meal_log_id uuid references meal_logs(id) on delete cascade not null,
  name text not null,
  quantity numeric not null,
  unit text check (unit in ('g', 'ml', 'servings')),
  calories integer not null,
  protein numeric,
  carbohydrates numeric,
  fat numeric,
  fiber numeric,
  sugar numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### goals
- 目標設定
```sql
create table goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  type text check (type in ('weight', 'exercise', 'sleep', 'nutrition', 'water_intake', 'steps')),
  target numeric not null,
  unit text not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  status text check (status in ('active', 'completed', 'failed')),
  progress numeric default 0,
  reminder_frequency text check (reminder_frequency in ('daily', 'weekly', 'monthly')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### health_scores
- 健康スコア
```sql
create table health_scores (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  date date not null,
  overall_score integer not null check (overall_score between 0 and 100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### user_settings
- ユーザー設定
```sql
create table user_settings (
  user_id uuid references profiles(id) on delete cascade primary key,
  theme text check (theme in ('light', 'dark', 'system')) default 'system',
  notifications_enabled boolean default true,
  notification_goals boolean default true,
  notification_measurements boolean default true,
  notification_insights boolean default true,
  notification_reminders boolean default true,
  measurement_unit text check (measurement_unit in ('metric', 'imperial')) default 'metric',
  language text default 'ja',
  data_sharing boolean default false,
  anonymous_analytics boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## RLSポリシー設定

各テーブルに以下のRLSポリシーを設定します：

1. profiles
```sql
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

2. その他のテーブル（vital_signs, exercises, sleep_records, meal_logs, goals, health_scores, user_settings）
```sql
alter table [table_name] enable row level security;

create policy "Users can view own records"
  on [table_name] for select
  using (auth.uid() = user_id);

create policy "Users can insert own records"
  on [table_name] for insert
  with check (auth.uid() = user_id);

create policy "Users can update own records"
  on [table_name] for update
  using (auth.uid() = user_id);

create policy "Users can delete own records"
  on [table_name] for delete
  using (auth.uid() = user_id);
```

## インデックス設定

パフォーマンス向上のため、以下のインデックスを作成します：

```sql
-- vital_signs
create index idx_vital_signs_user_id_recorded_at on vital_signs(user_id, recorded_at);

-- exercises
create index idx_exercises_user_id_start_time on exercises(user_id, start_time);

-- sleep_records
create index idx_sleep_records_user_id_start_time on sleep_records(user_id, start_time);

-- meal_logs
create index idx_meal_logs_user_id_timestamp on meal_logs(user_id, timestamp);

-- goals
create index idx_goals_user_id_status on goals(user_id, status);

-- health_scores
create index idx_health_scores_user_id_date on health_scores(user_id, date);
```

## トリガー設定

1. updated_at自動更新
```sql
create function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

create trigger update_user_settings_updated_at
  before update on user_settings
  for each row
  execute function update_updated_at_column();
```
