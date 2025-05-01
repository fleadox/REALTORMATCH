import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Request, Response } from 'express';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY!,
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

export async function POST(req: Request, res: Response) {
  try {
    const { token } = verifyTokenSchema.parse(req.body);

    // Verify the token with Supabase Auth
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'recovery'
    });

    if (error) {
      console.error('Token verification error:', error);
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    return res.status(200).json({ 
      message: 'Token is valid',
      user: data.user
    });
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid token format' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
} 