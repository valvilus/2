/*
  # Initial Schema Setup

  1. New Tables
    - cities
      - id (uuid, primary key)
      - name (text)
      - latitude (float8)
      - longitude (float8)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - drones
      - id (uuid, primary key) 
      - name (text)
      - model (text)
      - serial_number (text, unique)
      - weight (int)
      - max_speed (int)
      - max_flight_time (int)
      - max_altitude (int)
      - battery_level (int)
      - status (text)
      - pilot_id (uuid, foreign key)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - pilots
      - id (uuid, primary key)
      - full_name (text)
      - email (text, unique)
      - phone (text)
      - license_number (text, unique)
      - license_expiry (timestamptz)
      - experience (int)
      - status (text)
      - avatar_url (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - no_fly_zones
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - type (text)
      - start_date (timestamptz)
      - end_date (timestamptz)
      - min_altitude (int)
      - max_altitude (int)
      - radius (int)
      - color (text)
      - icon (text)
      - latitude (float8)
      - longitude (float8)
      - status (text)
      - created_by (uuid)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - flight_logs
      - id (uuid, primary key)
      - drone_id (uuid, foreign key)
      - pilot_id (uuid, foreign key)
      - start_time (timestamptz)
      - end_time (timestamptz)
      - duration (int)
      - distance (float8)
      - max_altitude (int)
      - avg_speed (float8)
      - battery_used (int)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  latitude float8 NOT NULL,
  longitude float8 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create drones table
CREATE TABLE IF NOT EXISTS drones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  model text NOT NULL,
  serial_number text UNIQUE NOT NULL,
  weight int NOT NULL,
  max_speed int NOT NULL,
  max_flight_time int NOT NULL,
  max_altitude int NOT NULL,
  battery_level int DEFAULT 100,
  status text NOT NULL DEFAULT 'inactive',
  pilot_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pilots table
CREATE TABLE IF NOT EXISTS pilots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  license_number text UNIQUE NOT NULL,
  license_expiry timestamptz NOT NULL,
  experience int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create no_fly_zones table
CREATE TABLE IF NOT EXISTS no_fly_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text NOT NULL,
  start_date timestamptz,
  end_date timestamptz,
  min_altitude int,
  max_altitude int,
  radius int NOT NULL,
  color text NOT NULL DEFAULT '#ff4444',
  icon text,
  latitude float8 NOT NULL,
  longitude float8 NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create flight_logs table
CREATE TABLE IF NOT EXISTS flight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drone_id uuid REFERENCES drones(id) ON DELETE CASCADE,
  pilot_id uuid REFERENCES auth.users(id),
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration int,
  distance float8,
  max_altitude int,
  avg_speed float8,
  battery_used int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE drones ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilots ENABLE ROW LEVEL SECURITY;
ALTER TABLE no_fly_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Cities are viewable by everyone" ON cities
  FOR SELECT USING (true);

CREATE POLICY "Drones are viewable by authenticated users" ON drones
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Drones are editable by owners" ON drones
  FOR ALL TO authenticated USING (auth.uid() = pilot_id);

CREATE POLICY "Pilots are viewable by authenticated users" ON pilots
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Pilots are editable by themselves" ON pilots
  FOR ALL TO authenticated USING (auth.uid()::text = id::text);

CREATE POLICY "No-fly zones are viewable by everyone" ON no_fly_zones
  FOR SELECT USING (true);

CREATE POLICY "No-fly zones are editable by creators" ON no_fly_zones
  FOR ALL TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Flight logs are viewable by authenticated users" ON flight_logs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Flight logs are editable by pilots" ON flight_logs
  FOR ALL TO authenticated USING (auth.uid() = pilot_id);

-- Insert Kazakhstan cities
INSERT INTO cities (name, latitude, longitude) VALUES
  ('Астана', 51.1694, 71.4491),
  ('Алматы', 43.2220, 76.8512),
  ('Шымкент', 42.3167, 69.5967),
  ('Караганда', 49.8333, 73.1667),
  ('Актобе', 50.2833, 57.1667),
  ('Тараз', 42.9000, 71.3667),
  ('Павлодар', 52.2833, 76.9667),
  ('Усть-Каменогорск', 49.9714, 82.6059),
  ('Семей', 50.4111, 80.2275),
  ('Атырау', 47.1167, 51.8833),
  ('Костанай', 53.2167, 63.6167),
  ('Кызылорда', 44.8533, 65.5023),
  ('Уральск', 51.2333, 51.3667),
  ('Петропавловск', 54.8667, 69.1333),
  ('Актау', 43.6525, 51.1575)
ON CONFLICT DO NOTHING;