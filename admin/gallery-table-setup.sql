-- ============================================================
--  JSTARC Admin Panel — gallery table
--  Run this in: Supabase → SQL Editor → New Query → Run
-- ============================================================

-- 1. Create the gallery table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.gallery (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    filename    text NOT NULL,
    url         text NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
-- ============================================================
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policy: Allow anyone to READ gallery photos
--    (needed so the public site/homepage marquee can fetch them)
-- ============================================================
CREATE POLICY "Allow public read of gallery"
    ON public.gallery
    FOR SELECT
    USING (true);

-- 4. RLS Policy: Allow authenticated users to INSERT gallery photos
-- ============================================================
CREATE POLICY "Allow authenticated users to insert gallery photos"
    ON public.gallery
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 5. RLS Policy: Allow authenticated users to DELETE gallery photos
-- ============================================================
CREATE POLICY "Allow authenticated users to delete gallery photos"
    ON public.gallery
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================
--  DONE! Verify the table:
-- ============================================================
SELECT * FROM public.gallery ORDER BY created_at DESC;
