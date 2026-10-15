-- Migration: Convert string columns from varchar to text on resources and tags

ALTER TABLE public.resources
  ALTER COLUMN url TYPE text,
  ALTER COLUMN title TYPE text,
  ALTER COLUMN description TYPE text,
  ALTER COLUMN type TYPE text,
  ALTER COLUMN status TYPE text,
  ALTER COLUMN personal_note TYPE text;

ALTER TABLE IF EXISTS public.tags
  ALTER COLUMN name TYPE text;
