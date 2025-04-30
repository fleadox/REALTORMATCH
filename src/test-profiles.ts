import { createClient } from '@supabase/supabase-js';
import { hash } from 'bcryptjs';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// @ts-ignore
global.fetch = fetch;

// Load environment variables
dotenv.config();

// Use the correct Supabase URL and service role key
const supabaseUrl = 'https://vdditqxjenyrcgwghagq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZGl0cXhqZW55cmNnd2doYWdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjAyOTk2MCwiZXhwIjoyMDYxNjA1OTYwfQ.mCLoYCrQKlXe-ehNOkwcci6Ubb7kz7gOjSBT-jk3X-I';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

console.log('Supabase URL:', supabaseUrl);
console.log('Using Supabase client with configuration:', {
  url: supabaseUrl,
  hasKey: !!supabaseKey
});

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

async function createTestUser() {
  try {
    console.log('🔍 Creating test user...');

    // Test user credentials
    const testUser = {
      email: 'test@realtormatch.pro',
      password: 'Test123!',
      full_name: 'Test User',
      role: 'user'
    };

    // Hash password
    const hashedPassword = await hash(testUser.password, 12);
    
    // Create user profile
    const { data: newUser, error: createError } = await supabase
      .from('profiles')
      .insert([
        {
          email: testUser.email,
          full_name: testUser.full_name,
          password_hash: hashedPassword,
          role: testUser.role
        }
      ])
      .select()
      .single();

    if (createError) {
      throw new Error(`User creation failed: ${createError.message}`);
    }

    console.log('✅ Successfully created test user');
    console.log('\nTest User Credentials:');
    console.log('----------------------');
    console.log('Email:', testUser.email);
    console.log('Password:', testUser.password);
    console.log('Role:', testUser.role);
    console.log('----------------------');
    console.log('\nYou can use these credentials to test the application.');

  } catch (error) {
    console.error('❌ Failed to create test user:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}

// Create the test user
createTestUser(); 