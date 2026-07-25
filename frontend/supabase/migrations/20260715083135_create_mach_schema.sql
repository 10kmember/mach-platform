/*
# Mach platform schema — profiles, agents, skills, usage

## Purpose
Multi-tenant schema for the Mach agent-hosting platform. Each authenticated
user owns their own agents and skill subscriptions. A profile row extends
`auth.users` with display name and plan. Agents represent hosted AI workers;
skills are packaged workflows attached to agents; usage_events track
per-run telemetry for dashboards.

## 1. New Tables

### profiles
- `id` (uuid, PK, references auth.users ON DELETE CASCADE)
- `name` (text, not null) — display name
- `plan` (text, not null, default 'personal') — 'personal' or 'corporate'
- `created_at` (timestamptz, default now())

### agents
- `id` (uuid, PK, default gen_random_uuid())
- `user_id` (uuid, not null, default auth.uid(), references auth.users ON DELETE CASCADE)
- `name` (text, not null)
- `type` (text, not null) — agent kind: 'mach_one' | 'mach_forge' | 'mach_relay' | 'mach_sentry'
- `status` (text, not null, default 'active') — 'active' | 'paused' | 'deploying'
- `channels` (text[], default '{}') — list of connected channels
- `created_at` (timestamptz, default now())

### skills
- `id` (uuid, PK, default gen_random_uuid())
- `user_id` (uuid, not null, default auth.uid(), references auth.users ON DELETE CASCADE)
- `agent_id` (uuid, nullable, references agents ON DELETE SET NULL)
- `name` (text, not null)
- `schedule` (text, not null) — e.g. 'Every 15 min', 'Real time', 'Daily 7:00 AM'
- `tag` (text, not null, default 'Scheduled') — 'Scheduled' | 'Continuous'
- `status` (text, not null, default 'running') — 'running' | 'paused' | 'error'
- `last_run_at` (timestamptz, nullable)
- `created_at` (timestamptz, default now())

### usage_events
- `id` (uuid, PK, default gen_random_uuid())
- `user_id` (uuid, not null, default auth.uid(), references auth.users ON DELETE CASCADE)
- `agent_id` (uuid, nullable, references agents ON DELETE SET NULL)
- `skill_id` (uuid, nullable, references skills ON DELETE SET NULL)
- `event_type` (text, not null) — 'run' | 'error' | 'backup' | 'update'
- `cost_cents` (integer, not null, default 0) — API cost in cents
- `duration_ms` (integer, not null, default 0)
- `created_at` (timestamptz, default now())

## 2. Security (RLS)

All tables have RLS enabled. Policies are owner-scoped: each authenticated
user can only SELECT, INSERT, UPDATE, DELETE rows where `user_id = auth.uid()`.
Owner columns default to `auth.uid()` so inserts that omit `user_id` succeed.

The `profiles` table is keyed by `id` (the auth.users id), so ownership is
`auth.uid() = id`.

## 3. Important Notes
1. `DEFAULT auth.uid()` on user_id columns allows `.insert({ name, type })`
   without passing user_id — the DB fills it from the session.
2. No `FOR ALL` policies — four separate policies per table (select/insert/update/delete).
3. Indexes added for common query paths (user_id on agents, skills, usage_events).
4. Email confirmation stays OFF — sign-up immediately yields a session.
*/

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  plan text NOT NULL DEFAULT 'personal',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- agents
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  channels text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_agents" ON agents;
CREATE POLICY "select_own_agents" ON agents FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_agents" ON agents;
CREATE POLICY "insert_own_agents" ON agents FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_agents" ON agents;
CREATE POLICY "update_own_agents" ON agents FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_agents" ON agents;
CREATE POLICY "delete_own_agents" ON agents FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);

-- skills
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  name text NOT NULL,
  schedule text NOT NULL,
  tag text NOT NULL DEFAULT 'Scheduled',
  status text NOT NULL DEFAULT 'running',
  last_run_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_skills" ON skills;
CREATE POLICY "select_own_skills" ON skills FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_skills" ON skills;
CREATE POLICY "insert_own_skills" ON skills FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_skills" ON skills;
CREATE POLICY "update_own_skills" ON skills FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_skills" ON skills;
CREATE POLICY "delete_own_skills" ON skills FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_agent_id ON skills(agent_id);

-- usage_events
CREATE TABLE IF NOT EXISTS usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  skill_id uuid REFERENCES skills(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  cost_cents integer NOT NULL DEFAULT 0,
  duration_ms integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_usage_events" ON usage_events;
CREATE POLICY "select_own_usage_events" ON usage_events FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_usage_events" ON usage_events;
CREATE POLICY "insert_own_usage_events" ON usage_events FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_usage_events" ON usage_events;
CREATE POLICY "update_own_usage_events" ON usage_events FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_usage_events" ON usage_events;
CREATE POLICY "delete_own_usage_events" ON usage_events FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_usage_events_user_id ON usage_events(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_created_at ON usage_events(created_at DESC);

-- Auto-create a profile row when a new auth.users row is inserted
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'plan', 'personal')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
