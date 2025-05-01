// Shared configuration for Netlify Functions
const config = {
  // CORS settings
  cors: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
  },

  // Error handling
  errorResponse: (error) => ({
    statusCode: error.status || 400,
    headers: config.cors.headers,
    body: JSON.stringify({
      success: false,
      error: error.message || 'An error occurred',
    }),
  }),

  // Success response helper
  successResponse: (data, message) => ({
    statusCode: 200,
    headers: config.cors.headers,
    body: JSON.stringify({
      success: true,
      message,
      data,
    }),
  }),

  // Request validation
  validateRequest: (body, requiredFields) => {
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  },

  // Environment validation
  validateEnvironment: () => {
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXT_PUBLIC_APP_URL',
    ];

    const missingVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
  },
};

module.exports = config; 