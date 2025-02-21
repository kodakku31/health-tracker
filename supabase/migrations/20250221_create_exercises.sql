-- 運動の種類を定義するテーブル
CREATE TYPE exercise_intensity AS ENUM ('light', 'moderate', 'vigorous');
CREATE TYPE exercise_type AS ENUM (
    'walking',
    'running',
    'cycling',
    'swimming',
    'weight_training',
    'yoga',
    'stretching',
    'hiit',
    'other'
);

-- 運動記録テーブル
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    exercise_type exercise_type NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    calories_burned INTEGER,
    intensity exercise_intensity NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_duration CHECK (end_time > start_time),
    CONSTRAINT valid_calories CHECK (calories_burned >= 0)
);

-- インデックスの作成
CREATE INDEX exercises_user_id_idx ON public.exercises(user_id);
CREATE INDEX exercises_start_time_idx ON public.exercises(start_time);

-- RLSの有効化
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成
CREATE POLICY "Users can view own exercises"
    ON public.exercises FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own exercises"
    ON public.exercises FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercises"
    ON public.exercises FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercises"
    ON public.exercises FOR DELETE
    USING (auth.uid() = user_id);

-- 更新時のタイムスタンプを自動更新する関数とトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_exercises_updated_at
    BEFORE UPDATE ON public.exercises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
