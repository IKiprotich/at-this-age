-- Incremental DB updates for existing projects.
-- Run this AFTER your original schema.sql has already been applied.

-- 1) Add soft-archive and update tracking columns to thoughts.
ALTER TABLE thoughts
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2) Allow users to update only their own thoughts.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'thoughts'
      AND policyname = 'Users can update own thoughts'
  ) THEN
    CREATE POLICY "Users can update own thoughts"
      ON thoughts FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- 3) Keep thoughts.updated_at current on every update.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'update_thoughts_updated_at'
  ) THEN
    CREATE TRIGGER update_thoughts_updated_at
      BEFORE UPDATE ON thoughts
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;
