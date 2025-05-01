import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Validation schema
const verifyTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = verifyTokenSchema.parse(body);

    // Verify the token with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Check if the user has a pending password reset
    const { data, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !data?.session) {
      console.error('Session verification error:', sessionError);
      return NextResponse.json(
        { error: 'Invalid reset session' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Token verified successfully',
      user: {
        id: user.id,
        email: user.email
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 