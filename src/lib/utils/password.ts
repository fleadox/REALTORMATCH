import zxcvbn from 'zxcvbn';

export interface PasswordRequirement {
  message: string;
  test: (password: string) => boolean;
}

export interface PasswordStrength {
  score: number;
  feedback: string;
}

export const passwordRequirements: PasswordRequirement[] = [
  {
    message: 'At least 8 characters long',
    test: (password: string) => password.length >= 8,
  },
  {
    message: 'Contains at least one uppercase letter',
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    message: 'Contains at least one lowercase letter',
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    message: 'Contains at least one number',
    test: (password: string) => /\d/.test(password),
  },
  {
    message: 'Contains at least one special character',
    test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

export function checkPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, feedback: '' };
  }

  const result = zxcvbn(password);
  
  const feedbackMessages = {
    0: 'Very weak - Too short or common password',
    1: 'Weak - Add more characters and mix letters/numbers',
    2: 'Fair - Consider adding special characters',
    3: 'Strong - Good combination of characters',
    4: 'Very strong - Excellent password choice'
  };

  return {
    score: result.score,
    feedback: feedbackMessages[result.score as keyof typeof feedbackMessages]
  };
} 