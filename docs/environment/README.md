# Environment Configuration

## Overview
This document describes the environment configuration for the application, including required variables and their purposes.

## Environment Variables

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL`: Public URL of your Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anon key for client-side Supabase access
- `SUPABASE_SERVICE_KEY`: Private service role key for server-side operations

### Authentication
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

### Email Configuration
- `EMAIL_SERVER_HOST`: SMTP server host
- `EMAIL_SERVER_PORT`: SMTP server port (usually 587 for TLS)
- `EMAIL_SERVER_USER`: SMTP server username
- `EMAIL_SERVER_PASSWORD`: SMTP server password
- `EMAIL_FROM`: Default sender email address

### Environment Mode
- `NODE_ENV`: Application environment ('development', 'test', or 'production')

## Security Considerations

### Public Variables
Variables prefixed with `NEXT_PUBLIC_` are:
- Exposed to the browser
- Safe to be public
- Used for client-side operations

### Private Variables
All other variables are:
- Never exposed to the client
- Used only in server-side operations
- Require careful handling

## Deployment

### Netlify Setup
1. Navigate to Site settings > Build & deploy > Environment
2. Import variables from `.env.production`
3. Select appropriate scopes and deploy contexts
4. Verify after deployment

### Validation
Environment variables are validated using Zod schema in `src/lib/env/validate.ts`

### Access Pattern
Use the environment singleton from `src/lib/env/index.ts`:
```typescript
import { env } from '@/lib/env';

// Access variables
const supabaseUrl = env.supabaseUrl;
const isProduction = env.isProduction;
```

## Troubleshooting

### Common Issues
1. Missing variables in production
2. Type mismatches in validation
3. Incorrect scope settings

### Solutions
1. Verify all variables are set in Netlify
2. Check validation schema matches expected types
3. Review deploy contexts and scopes 