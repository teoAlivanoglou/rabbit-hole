-- Migration: Add Row-Level Security policies for resources and tags

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.resource_tags ENABLE ROW LEVEL SECURITY;

-- Set default user_id to auth.uid() so it auto-populates from the session
ALTER TABLE public.resources
  ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Grant table privileges to authenticated role
GRANT ALL ON public.resources TO authenticated;
GRANT SELECT ON public.resources TO anon;

GRANT ALL ON public.tags TO authenticated;
GRANT SELECT ON public.tags TO anon;

GRANT ALL ON public.resource_tags TO authenticated;
GRANT SELECT ON public.resource_tags TO anon;

-- 1. SELECT policy: anyone can read resources
DROP POLICY IF EXISTS "Allow read access on resources" ON public.resources;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.resources;
CREATE POLICY "Allow read access on resources"
  ON public.resources
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- 2. INSERT policy: authenticated users can insert resources
DROP POLICY IF EXISTS "Allow authenticated insert on resources" ON public.resources;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.resources;
CREATE POLICY "Allow authenticated insert on resources"
  ON public.resources
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 3. UPDATE policy: users can update their own resources
DROP POLICY IF EXISTS "Allow users to update own resources" ON public.resources;
CREATE POLICY "Allow users to update own resources"
  ON public.resources
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- 4. DELETE policy: users can delete their own resources
DROP POLICY IF EXISTS "Allow users to delete own resources" ON public.resources;
CREATE POLICY "Allow users to delete own resources"
  ON public.resources
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);
