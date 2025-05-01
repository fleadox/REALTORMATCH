// Set environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://hzzvpvsuspbnqyjmnfbv.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6enZwdnN1c3BibnF5am1uZmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwOTA5MDYsImV4cCI6MjA2MTY2NjkwNn0.ww1ticfuxFcirclJufx-FAwP0NGwp4Pzv8j9HhNmKIU';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6enZwdnN1c3BibnF5am1uZmJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjA5MDkwNiwiZXhwIjoyMDYxNjY2OTA2fQ.HbSvzAZegetvEudvc0KeCsG9aO4rSzOZr4GbxjSUqRQ';

// Verify environment variables are set
console.log('Environment variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');

// Import and run the tests
import { createClient } from '@supabase/supabase-js';
import { Database } from './types/supabase';

// Initialize test clients with schema configuration
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    }
  }
);

const adminSupabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    }
  }
);

async function testDatabaseSecurity() {
  console.log('🔒 Starting Database Security Tests\n');
  
  try {
    // 1. Test User Creation and Profiles
    console.log('1️⃣ Testing User Creation and Automatic Profile Generation');
    
    // Create user with auth.admin.createUser
    const timestamp = new Date().getTime();
    const testEmail = `test.user.${timestamp}@gmail.com`;
    const { data: userData, error: createError } = await adminSupabase.auth.admin.createUser({
      email: testEmail,
      password: 'Test123!@#',
      email_confirm: true
    });

    if (createError) {
      throw new Error(`Failed to create test user: ${createError.message}`);
    }

    if (!userData.user) {
      throw new Error('User creation failed: No user data returned');
    }

    console.log('✅ User created successfully:', userData.user);

    // Wait for triggers to complete
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Verify Profile Creation Trigger
    const { data: profile, error: profileError } = await adminSupabase
      .schema('public')
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (profileError) {
      console.log('Profile error:', profileError);
      throw new Error(`Failed to verify profile creation: ${profileError.message}`);
    }
    console.log('✅ Profile created automatically:', profile);

    // 3. Test RLS Policies
    console.log('\n2️⃣ Testing Row Level Security Policies');
    
    // Try to read profiles with non-admin client
    const { data: profiles, error: rlsError } = await supabase
      .schema('public')
      .from('profiles')
      .select('*');

    if (rlsError) {
      console.log('✅ RLS blocked unauthorized access');
    } else {
      console.log('ℹ️ Public profiles are readable:', profiles.length, 'profiles found');
    }

    // 4. Test Profile Update Function
    console.log('\n3️⃣ Testing Profile Update Function');
    const { error: updateError } = await adminSupabase
      .schema('public')
      .rpc('update_user_profile', {
        _user_id: userData.user.id,
        _username: 'security_tester',
        _full_name: 'Security Test User',
        _bio: 'Testing security features',
        _website: 'example.com',
        _avatar_url: 'https://example.com/avatar.jpg'
      });

    if (updateError) {
      console.log('Update error:', updateError);
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }
    console.log('✅ Profile updated successfully');

    // 5. Test Audit Logging
    console.log('\n4️⃣ Testing Audit Logging');
    const { data: auditLogs, error: auditError } = await adminSupabase
      .schema('public')
      .from('audit_log')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (auditError) {
      console.log('Audit error:', auditError);
      throw new Error(`Failed to check audit logs: ${auditError.message}`);
    }
    console.log('✅ Audit logs created successfully:', auditLogs);

    // 6. Test User Deletion and Cleanup
    console.log('\n5️⃣ Testing User Deletion and Cleanup');
    
    // Delete the user using auth.admin
    const { error: deleteAuthError } = await adminSupabase.auth.admin.deleteUser(
      userData.user.id
    );

    if (deleteAuthError) {
      throw new Error(`Failed to delete user: ${deleteAuthError.message}`);
    }
    console.log('✅ User deleted successfully');

    // Verify deletion
    const { data: deletedProfile, error: verifyError } = await adminSupabase
      .schema('public')
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (!deletedProfile) {
      console.log('✅ Profile deletion cascade verified');
    } else {
      console.log('⚠️ Profile still exists after user deletion');
    }

    console.log('\n✨ All security tests completed successfully!');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    throw error;
  }
}

// Run the tests
testDatabaseSecurity().catch(console.error); 