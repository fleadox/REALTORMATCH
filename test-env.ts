import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Function to test environment variables
function testEnvironmentVariables() {
  console.log('\n=== Testing Environment Variables ===\n')

  // Test NEXTAUTH_URL and NEXTAUTH_SECRET
  console.log('1. Testing NextAuth Configuration:')
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing')
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing')

  // Test Supabase Configuration
  console.log('\n2. Testing Supabase Configuration:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing')

  // Test Supabase Connection
  console.log('\n3. Testing Supabase Connection:')
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    console.log('Supabase Client Created:', '✅ Success')
    
    // Test a simple query to verify connection
    return supabase.from('__dummy__').select('*').limit(1)
      .then(() => {
        console.log('Supabase Query Test:', '✅ Success')
      })
      .catch((error) => {
        // This error is expected since we're querying a non-existent table
        if (error.message.includes('does not exist')) {
          console.log('Supabase Query Test:', '✅ Success (Expected error)')
        } else {
          console.error('Supabase Query Test:', '❌ Failed', error.message)
        }
      })
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    return null
  }
}

// Run the test
testEnvironmentVariables() 