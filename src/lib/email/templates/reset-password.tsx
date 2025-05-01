import React from 'react';

interface ResetPasswordEmailProps {
  url: string;
  name?: string;
}

const button = {
  backgroundColor: '#4F46E5',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  width: '200px',
  margin: '20px 0',
};

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
  url,
  name,
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#1F2937', fontSize: '24px', marginBottom: '20px' }}>
        Reset Your Password
      </h1>
      <p style={{ color: '#4B5563', fontSize: '16px', lineHeight: '24px' }}>
        {name ? `Hi ${name},` : 'Hi,'}
      </p>
      <p style={{ color: '#4B5563', fontSize: '16px', lineHeight: '24px' }}>
        We received a request to reset your password. Click the button below to create a new password:
      </p>
      <div style={{ textAlign: 'center' as const }}>
        <a href={url} style={button}>
          Reset Password
        </a>
      </div>
      <p style={{ color: '#4B5563', fontSize: '16px', lineHeight: '24px' }}>
        If you didn't request this, you can safely ignore this email.
      </p>
      <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '20px', marginTop: '40px' }}>
        This link will expire in 24 hours.
      </p>
    </div>
  );
}; 