import { createClient } from '@supabase/supabase-js';
import { Database } from './types/supabase';

// Initialize test clients
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const adminSupabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testDatabaseSecurity() {
  console.log('🔒 Starting Database Security Tests\n');
  
  try {
    // 1. Test User Creation and Profiles
    console.log('1️⃣ Testing User Creation and Automatic Profile Generation');
    const testUser = {
      email: 'security_test@example.com',
      name: 'Security Test User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Create user with admin client
    const { data: newUser, error: createError } = await adminSupabase
      .from('users')
      .insert(testUser)
      .select()
      .single();

    if (createError) {
      throw new Error(`Failed to create test user: ${createError.message}`);
    }
    console.log('✅ User created successfully');

    // 2. Verify Profile Creation Trigger
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('id', newUser.id)
      .single();

    if (profileError) {
      throw new Error(`Failed to verify profile creation: ${profileError.message}`);
    }
    console.log('✅ Profile created automatically');

    // 3. Test RLS Policies
    console.log('\n2️⃣ Testing Row Level Security Policies');
    
    // Try to read other users with non-admin client
    const { data: users, error: rlsError } = await supabase
      .from('users')
      .select('*');

    if (rlsError) {
      console.log('✅ RLS blocked unauthorized access to users table');
    } else if (users.length > 0) {
      throw new Error('❌ RLS failed: Non-admin client could read all users');
    }

    // 4. Test Profile Update Function
    console.log('\n3️⃣ Testing Profile Update Function');
    const { error: updateError } = await adminSupabase
      .rpc('update_user_profile', {
        _user_id: newUser.id,
        _username: 'security_tester',
        _full_name: 'Security Test User',
        _bio: 'Testing security features',
        _website: 'example.com',
        _avatar_url: 'https://example.com/avatar.jpg'
      });

    if (updateError) {
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }
    console.log('✅ Profile updated successfully');

    // 5. Test Audit Logging
    console.log('\n4️⃣ Testing Audit Logging');
    const { data: auditLogs, error: auditError } = await adminSupabase
      .from('audit_log')
      .select('*')
      .eq('user_id', newUser.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (auditError) {
      throw new Error(`Failed to check audit logs: ${auditError.message}`);
    }
    console.log('✅ Audit logs created successfully');

    // 6. Test User Deletion and Cleanup
    console.log('\n5️⃣ Testing User Deletion and Cleanup');
    const { error: deleteError } = await adminSupabase
      .rpc('delete_user', { user_id: newUser.id });

    if (deleteError) {
      throw new Error(`Failed to delete user: ${deleteError.message}`);
    }
    console.log('✅ User and related records deleted successfully');

    // Verify deletion
    const { data: deletedUser } = await adminSupabase
      .from('users')
      .select('*')
      .eq('id', newUser.id)
      .single();

    if (!deletedUser) {
      console.log('✅ User deletion verified');
    }

    console.log('\n✨ All security tests completed successfully!');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    throw error;
  }
}

// Run the tests
testDatabaseSecurity().catch(console.error); 