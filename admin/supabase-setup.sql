-- ============================================================
--  JSTARC Admin Panel — admin_settings table
--  Run this in: Supabase → SQL Editor → New Query → Run
-- ============================================================

-- 1. Create the table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_settings (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email       text NOT NULL UNIQUE,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. Seed your initial admin emails
--    (edit these before running if needed)
-- ============================================================
INSERT INTO public.admin_settings (email) VALUES
    ('apughanti20@gmail.com'),
    ('apughanti.dev@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 3. Enable Row Level Security
-- ============================================================
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Allow anyone to READ the list
--    (needed so AuthGuard can fetch it before the user is "confirmed")
-- ============================================================
CREATE POLICY "Allow public read of admin_settings"
    ON public.admin_settings
    FOR SELECT
    USING (true);

-- 5. RLS Policy: Allow authenticated users to INSERT new admins
-- ============================================================
CREATE POLICY "Allow authenticated users to insert admin emails"
    ON public.admin_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 6. RLS Policy: Allow authenticated users to DELETE admins
-- ============================================================
CREATE POLICY "Allow authenticated users to delete admin emails"
    ON public.admin_settings
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================
--  DONE! Verify the table and seed data:
-- ============================================================
SELECT * FROM public.admin_settings ORDER BY created_at;
