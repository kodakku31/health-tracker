-- 既存のテーブルとタイプを削除
DROP TABLE IF EXISTS public.exercises;
DROP TYPE IF EXISTS exercise_intensity;
DROP TYPE IF EXISTS exercise_type;

-- 運動の種類を文字列として定義
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    exercise_type TEXT CHECK (exercise_type IN (
        'walking',
        'running',
        'cycling',
        'swimming',
        'weight_training',
        'yoga',
        'stretching',
        'hiit',
        'other'
    )) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    calories_burned INTEGER,
    intensity TEXT CHECK (intensity IN ('light', 'moderate', 'vigorous')) NOT NULL,
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
