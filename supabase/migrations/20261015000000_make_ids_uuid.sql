-- Migration: Change resources.id and tags.id from int (IDENTITY) to uuid
-- Also updates junction table resource_tags foreign keys

BEGIN;

-- 1. Drop foreign key constraints on the junction table if they exist
ALTER TABLE IF EXISTS public.resource_tags
  DROP CONSTRAINT IF EXISTS resource_tags_resource_id_fkey,
  DROP CONSTRAINT IF EXISTS resource_tags_tag_id_fkey;

-- 2. Drop IDENTITY property and convert resources.id to uuid
ALTER TABLE public.resources
  ALTER COLUMN id DROP IDENTITY IF EXISTS,
  ALTER COLUMN id DROP DEFAULT;

ALTER TABLE public.resources
  ALTER COLUMN id TYPE uuid USING gen_random_uuid(),
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Drop IDENTITY property and convert tags.id to uuid
ALTER TABLE public.tags
  ALTER COLUMN id DROP IDENTITY IF EXISTS,
  ALTER COLUMN id DROP DEFAULT;

ALTER TABLE public.tags
  ALTER COLUMN id TYPE uuid USING gen_random_uuid(),
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 4. Update junction table foreign key columns to uuid to match
ALTER TABLE IF EXISTS public.resource_tags
  ALTER COLUMN resource_id TYPE uuid USING gen_random_uuid(),
  ALTER COLUMN tag_id TYPE uuid USING gen_random_uuid();

-- 5. Re-add foreign key constraints
ALTER TABLE IF EXISTS public.resource_tags
  ADD CONSTRAINT resource_tags_resource_id_fkey
    FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE,
  ADD CONSTRAINT resource_tags_tag_id_fkey
    FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;

COMMIT;
