/*
  # Create users and profiles tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `email` (text, unique)
      - `registration_date` (timestamptz)
      - `account_status` (text)
      - `last_login` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add rate limiting through Supabase Edge Functions
*/

-- Create custom types
CREATE TYPE account_status AS ENUM ('pending', 'active', 'suspended');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL CHECK (length(username) >= 3 AND username ~ '^[a-zA-Z0-9_-]+$'),
  email text UNIQUE NOT NULL,
  registration_date timestamptz DEFAULT now() NOT NULL,
  account_status account_status DEFAULT 'pending' NOT NULL,
  last_login timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update last_login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET last_login = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_last_login_on_auth
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION update_last_login();