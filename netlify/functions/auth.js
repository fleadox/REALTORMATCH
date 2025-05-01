const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const { path, httpMethod, headers: requestHeaders, body } = event;
    const { action, data } = JSON.parse(body || '{}');

    // Validate request
    if (!action) {
      throw new Error('Action is required');
    }

    // Handle different auth operations
    switch (action) {
      case 'verify-email':
        if (!data?.token) {
          throw new Error('Verification token is required');
        }
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: data.token,
          type: 'email',
        });
        if (verifyError) throw verifyError;
        break;

      case 'reset-password':
        if (!data?.email) {
          throw new Error('Email is required');
        }
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
        });
        if (resetError) throw resetError;
        break;

      case 'update-profile':
        if (!data?.userId || !data?.updates) {
          throw new Error('User ID and updates are required');
        }
        const { error: updateError } = await supabase
          .from('users')
          .update(data.updates)
          .eq('id', data.userId);
        if (updateError) throw updateError;
        break;

      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `${action} completed successfully`,
      }),
    };
  } catch (error) {
    console.error('Auth function error:', error);

    return {
      statusCode: error.status || 400,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'An error occurred',
      }),
    };
  }
}; 