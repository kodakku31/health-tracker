-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create tables
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

create table health_scores (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  date date not null,
  overall_score integer not null check (overall_score between 0 and 100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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

-- Create indexes
create index idx_vital_signs_user_id_recorded_at on vital_signs(user_id, recorded_at);
create index idx_exercises_user_id_start_time on exercises(user_id, start_time);
create index idx_sleep_records_user_id_start_time on sleep_records(user_id, start_time);
create index idx_meal_logs_user_id_timestamp on meal_logs(user_id, timestamp);
create index idx_goals_user_id_status on goals(user_id, status);
create index idx_health_scores_user_id_date on health_scores(user_id, date);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

create trigger update_user_settings_updated_at
  before update on user_settings
  for each row
  execute function update_updated_at_column();

-- Enable Row Level Security
alter table profiles enable row level security;
alter table vital_signs enable row level security;
alter table exercises enable row level security;
alter table sleep_records enable row level security;
alter table meal_logs enable row level security;
alter table food_items enable row level security;
alter table goals enable row level security;
alter table health_scores enable row level security;
alter table user_settings enable row level security;

-- Create RLS policies
-- Profiles
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Food Items (special case - access through meal_logs)
create policy "Users can view own food items"
  on food_items for select
  using (exists (
    select 1 from meal_logs
    where meal_logs.id = food_items.meal_log_id
    and meal_logs.user_id = auth.uid()
  ));

create policy "Users can insert own food items"
  on food_items for insert
  with check (exists (
    select 1 from meal_logs
    where meal_logs.id = meal_log_id
    and meal_logs.user_id = auth.uid()
  ));

create policy "Users can update own food items"
  on food_items for update
  using (exists (
    select 1 from meal_logs
    where meal_logs.id = food_items.meal_log_id
    and meal_logs.user_id = auth.uid()
  ));

create policy "Users can delete own food items"
  on food_items for delete
  using (exists (
    select 1 from meal_logs
    where meal_logs.id = food_items.meal_log_id
    and meal_logs.user_id = auth.uid()
  ));

-- Other tables with direct user_id
do $$
declare
  table_name text;
begin
  for table_name in
    select tablename from pg_tables
    where schemaname = 'public'
      and tablename in (
        'vital_signs', 'exercises', 'sleep_records',
        'meal_logs', 'goals', 'health_scores',
        'user_settings'
      )
  loop
    execute format('
      create policy "Users can view own records" on %I
        for select using (auth.uid() = user_id);
      
      create policy "Users can insert own records" on %I
        for insert with check (auth.uid() = user_id);
      
      create policy "Users can update own records" on %I
        for update using (auth.uid() = user_id);
      
      create policy "Users can delete own records" on %I
        for delete using (auth.uid() = user_id);
    ', table_name, table_name, table_name, table_name);
  end loop;
end;
$$;
