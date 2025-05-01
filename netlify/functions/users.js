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

    // Handle different user operations
    switch (action) {
      case 'get-user':
        if (!data?.userId) {
          throw new Error('User ID is required');
        }
        const { data: user, error: getUserError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.userId)
          .single();
        if (getUserError) throw getUserError;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, user }),
        };

      case 'list-users':
        const { data: users, error: listUsersError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });
        if (listUsersError) throw listUsersError;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, users }),
        };

      case 'delete-user':
        if (!data?.userId) {
          throw new Error('User ID is required');
        }
        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .eq('id', data.userId);
        if (deleteError) throw deleteError;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'User deleted successfully',
          }),
        };

      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  } catch (error) {
    console.error('Users function error:', error);

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