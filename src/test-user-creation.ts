import { supabaseClient } from '../lib/supabase';

async function createAndVerifyUser() {
  try {
    // First, try to create the user
    const { data: newUser, error: createError } = await supabaseClient
      .from('users')
      .insert({
        email: 'test@example.com',
        name: 'Test User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      if (createError.code === '23505') { // Unique violation
        console.log('User already exists, proceeding with verification');
      } else {
        console.error('Error creating user:', createError);
        return;
      }
    } else {
      console.log('User created successfully:', newUser);
    }

    // Verify user exists
    const { data: existingUser, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('email', 'test@example.com')
      .single();

    if (userError) {
      console.error('Error verifying user:', userError);
      return;
    }

    console.log('User verification:', existingUser);
    
    // Check related records
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', existingUser.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    } else {
      console.log('Profile:', profile);
    }

    const { data: preferences, error: preferencesError } = await supabaseClient
      .from('user_preferences')
      .select('*')
      .eq('user_id', existingUser.id)
      .single();

    if (preferencesError) {
      console.error('Error fetching preferences:', preferencesError);
    } else {
      console.log('Preferences:', preferences);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAndVerifyUser(); 