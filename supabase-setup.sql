-- VIT GPA Sync Table Setup
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.user_gpa_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_gpa_data_user_id ON public.user_gpa_data(user_id);

-- RLS Policies
ALTER TABLE public.user_gpa_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own data" ON public.user_gpa_data;
CREATE POLICY "Users can read own data" ON public.user_gpa_data
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own data" ON public.user_gpa_data;
CREATE POLICY "Users can insert own data" ON public.user_gpa_data
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own data" ON public.user_gpa_data;
CREATE POLICY "Users can update own data" ON public.user_gpa_data
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own data" ON public.user_gpa_data;
CREATE POLICY "Users can delete own data" ON public.user_gpa_data
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Optional: Enable trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_user_gpa_data_updated ON public.user_gpa_data;
CREATE TRIGGER on_user_gpa_data_updated
  BEFORE UPDATE ON public.user_gpa_data
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
