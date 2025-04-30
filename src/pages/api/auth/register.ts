import { hash } from 'bcryptjs';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          email,
          full_name: fullName,
          password_hash: hashedPassword,
          role: 'user',
        },
      ])
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    return res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Failed to register user' });
  }
} 