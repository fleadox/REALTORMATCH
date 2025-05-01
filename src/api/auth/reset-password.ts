import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Request, Response } from 'express';
import zxcvbn from 'zxcvbn';

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
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: Request, res: Response) {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);

    // Check password strength
    const passwordCheck = zxcvbn(password);
    if (passwordCheck.score < 2) {
      return res.status(400).json({ 
        error: 'Password is too weak',
        feedback: passwordCheck.feedback.warning
      });
    }

    // Update password using Supabase Auth
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('Password reset error:', error);
      return res.status(400).json({ error: 'Failed to reset password' });
    }

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
} 