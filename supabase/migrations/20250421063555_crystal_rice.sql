/*
  # Create test user account

  1. Changes
    - Create test user with secure password
    - Grant necessary permissions
    - Set up profile data

  2. Security
    - Use secure password hashing
    - Maintain data integrity
    - Follow RLS policies
*/

-- Create test user if not exists
DO $$ 
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if user already exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'sarah.johnson@example.com'
  ) THEN
    -- Insert into auth.users with explicit UUID
    new_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) 
    VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'sarah.johnson@example.com',
      crypt('GR#Test2025!', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Sarah Johnson"}',
      'authenticated',
      'authenticated',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    -- Create profile
    INSERT INTO public.profiles (
      user_id,
      full_name,
      email,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      'Sarah Johnson',
      'sarah.johnson@example.com',
      NOW(),
      NOW()
    );
  END IF;
END $$;