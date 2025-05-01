import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Request, Response } from 'express';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(req: Request & { supabaseUrl?: string; supabaseKey?: string; appUrl?: string }, res: Response) {
  try {
    console.log('Processing forgot password request...');
    
    if (!req.supabaseUrl || !req.supabaseKey || !req.appUrl) {
      throw new Error('Missing required environment variables');
    }

    // Initialize Supabase client
    const supabase = createClient(
      req.supabaseUrl,
      req.supabaseKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { email } = forgotPasswordSchema.parse(req.body);
    console.log('Parsed email:', email);

    // Send password reset email through Supabase Auth
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${req.appUrl}/auth/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      return res.status(400).json({ 
        error: 'Failed to send reset email',
        details: error.message
      });
    }

    console.log('Password reset email sent successfully');
    return res.status(200).json({ 
      message: 'Password reset email sent successfully',
      email
    });
  } catch (error) {
    console.error('Error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid email address',
        details: error.errors
      });
    }

    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 