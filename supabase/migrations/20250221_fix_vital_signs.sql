-- 既存のテーブルを削除
DROP TABLE IF EXISTS public.vital_signs;
DROP TABLE IF EXISTS public.vital_sign_goals;

-- バイタルサインの記録テーブル
CREATE TABLE IF NOT EXISTS public.vital_signs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    measured_at TIMESTAMP WITH TIME ZONE NOT NULL,
    weight DECIMAL(5,2), -- kg、小数点2桁まで
    systolic_bp INTEGER, -- 収縮期血圧
    diastolic_bp INTEGER, -- 拡張期血圧
    heart_rate INTEGER, -- 心拍数
    body_temperature DECIMAL(3,1), -- 体温、小数点1桁まで
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_weight CHECK (weight > 0 AND weight < 300),
    CONSTRAINT valid_systolic_bp CHECK (systolic_bp > 0 AND systolic_bp < 300),
    CONSTRAINT valid_diastolic_bp CHECK (diastolic_bp > 0 AND diastolic_bp < 300),
    CONSTRAINT valid_heart_rate CHECK (heart_rate > 0 AND heart_rate < 300),
    CONSTRAINT valid_body_temperature CHECK (body_temperature > 30 AND body_temperature < 45)
);

-- 目標値テーブル
CREATE TABLE IF NOT EXISTS public.vital_sign_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    target_weight DECIMAL(5,2),
    target_systolic_bp INTEGER,
    target_diastolic_bp INTEGER,
    target_heart_rate INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_target_weight CHECK (target_weight > 0 AND target_weight < 300),
    CONSTRAINT valid_target_systolic_bp CHECK (target_systolic_bp > 0 AND target_systolic_bp < 300),
    CONSTRAINT valid_target_diastolic_bp CHECK (target_diastolic_bp > 0 AND target_diastolic_bp < 300),
    CONSTRAINT valid_target_heart_rate CHECK (target_heart_rate > 0 AND target_heart_rate < 300)
);

-- インデックスの作成
CREATE INDEX vital_signs_user_id_idx ON public.vital_signs(user_id);
CREATE INDEX vital_signs_measured_at_idx ON public.vital_signs(measured_at);
CREATE INDEX vital_sign_goals_user_id_idx ON public.vital_sign_goals(user_id);

-- RLSの有効化
ALTER TABLE public.vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vital_sign_goals ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成（vital_signs）
CREATE POLICY "Users can view own vital signs"
    ON public.vital_signs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own vital signs"
    ON public.vital_signs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vital signs"
    ON public.vital_signs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vital signs"
    ON public.vital_signs FOR DELETE
    USING (auth.uid() = user_id);

-- ポリシーの作成（vital_sign_goals）
CREATE POLICY "Users can view own vital sign goals"
    ON public.vital_sign_goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own vital sign goals"
    ON public.vital_sign_goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vital sign goals"
    ON public.vital_sign_goals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vital sign goals"
    ON public.vital_sign_goals FOR DELETE
    USING (auth.uid() = user_id);

-- 更新時のタイムスタンプを自動更新する関数とトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vital_signs_updated_at
    BEFORE UPDATE ON public.vital_signs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vital_sign_goals_updated_at
    BEFORE UPDATE ON public.vital_sign_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
