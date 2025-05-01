import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
});

export type RegisterData = z.infer<typeof registerSchema>;

export async function register(data: RegisterData) {
  try {
    const validatedData = registerSchema.parse(data);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('Invalid registration data');
    }
    throw error;
  }
} 