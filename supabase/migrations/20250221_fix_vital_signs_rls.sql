-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view own vital signs" ON public.vital_signs;
DROP POLICY IF EXISTS "Users can create own vital signs" ON public.vital_signs;
DROP POLICY IF EXISTS "Users can update own vital signs" ON public.vital_signs;
DROP POLICY IF EXISTS "Users can delete own vital signs" ON public.vital_signs;

DROP POLICY IF EXISTS "Users can view own vital sign goals" ON public.vital_sign_goals;
DROP POLICY IF EXISTS "Users can create own vital sign goals" ON public.vital_sign_goals;
DROP POLICY IF EXISTS "Users can update own vital sign goals" ON public.vital_sign_goals;
DROP POLICY IF EXISTS "Users can delete own vital sign goals" ON public.vital_sign_goals;

-- RLSを無効化して再度有効化
ALTER TABLE public.vital_signs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vital_sign_goals DISABLE ROW LEVEL SECURITY;

ALTER TABLE public.vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vital_sign_goals ENABLE ROW LEVEL SECURITY;

-- 新しいポリシーを作成（vital_signs）
CREATE POLICY "Enable read for users based on user_id" 
    ON public.vital_signs
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only" 
    ON public.vital_signs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" 
    ON public.vital_signs
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" 
    ON public.vital_signs
    FOR DELETE
    USING (auth.uid() = user_id);

-- 新しいポリシーを作成（vital_sign_goals）
CREATE POLICY "Enable read for users based on user_id" 
    ON public.vital_sign_goals
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only" 
    ON public.vital_sign_goals
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" 
    ON public.vital_sign_goals
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" 
    ON public.vital_sign_goals
    FOR DELETE
    USING (auth.uid() = user_id);
