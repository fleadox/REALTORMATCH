import { z } from 'zod';

// Profile validation schema
export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+995\s\d{3}\s\d{2}\s\d{2}\s\d{2}$/, 'Invalid Georgian phone number format'),
  bio: z.string().max(500, 'Bio must be less than 500 characters'),
  agencyAffiliation: z.string().min(2, 'Agency name must be at least 2 characters'),
  experienceLevel: z.enum(['0-1', '1-3', '3-5', '5-10', '10+']),
  regionsServed: z.array(z.string()).min(1, 'Select at least one region'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  socialLinks: z.object({
    facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
    twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
    instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
    linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
    youtube: z.string().url('Invalid URL').optional().or(z.literal(''))
  }),
  availability: z.object({
    status: z.enum(['available', 'busy', 'away']),
    message: z.string().max(100).optional()
  }),
  credentials: z.array(z.object({
    id: z.string(),
    type: z.string(),
    number: z.string(),
    issueDate: z.string(),
    expiryDate: z.string().optional()
  })),
  expertise: z.array(z.string()).min(1, 'Select at least one area of expertise'),
  contactPreferences: z.object({
    email: z.boolean(),
    phone: z.boolean(),
    whatsapp: z.boolean()
  })
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Registration form data
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  agreeTerms: boolean;
}

export interface AdminLoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}