/*
# Create signs table and storage bucket for the Chicago Linguistic Landscape Mapper

1. New Tables
- `signs`
  - `id` (uuid, primary key)
  - `photo_url` (text, not null) — public URL of the uploaded photo in storage
  - `latitude` (double precision, not null) — geolocation of the sign
  - `longitude` (double precision, not null) — geolocation of the sign
  - `languages` (text[], not null) — array of languages tagged on the sign
  - `category` (text, not null) — either 'official' or 'grassroots'
  - `note` (text, nullable) — optional description from the contributor
  - `created_at` (timestamptz, default now())

2. Storage
- Create public bucket `sign-photos` for uploaded sign imagery.
- Policies allow anon + authenticated to upload and read photos (public civic project).

3. Security
- Enable RLS on `signs`.
- Grant CRUD to `anon` + `authenticated` so the Data API can reach the table.
- All data is intentionally public/shared (no sign-in for this civic mapping project),
  so policies use `USING (true)` / `WITH CHECK (true)` documented as intentional.
- Storage bucket is public-read; anon + authenticated can upload objects.
*/

CREATE TABLE IF NOT EXISTS signs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_url text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  languages text[] NOT NULL,
  category text NOT NULL CHECK (category IN ('official', 'grassroots')),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE signs ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON signs TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_signs" ON signs;
CREATE POLICY "anon_select_signs" ON signs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_signs" ON signs;
CREATE POLICY "anon_insert_signs" ON signs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_signs" ON signs;
CREATE POLICY "anon_update_signs" ON signs FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_signs" ON signs;
CREATE POLICY "anon_delete_signs" ON signs FOR DELETE
  TO anon, authenticated USING (true);

-- Storage bucket for sign photos (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('sign-photos', 'sign-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload to sign-photos bucket
DROP POLICY IF EXISTS "anon_upload_sign_photos" ON storage.objects;
CREATE POLICY "anon_upload_sign_photos" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'sign-photos');

-- Allow anyone to read sign photos (public bucket)
DROP POLICY IF EXISTS "anon_read_sign_photos" ON storage.objects;
CREATE POLICY "anon_read_sign_photos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'sign-photos');

-- Allow contributors to delete their own uploads (best-effort, public project)
DROP POLICY IF EXISTS "anon_delete_sign_photos" ON storage.objects;
CREATE POLICY "anon_delete_sign_photos" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'sign-photos');
