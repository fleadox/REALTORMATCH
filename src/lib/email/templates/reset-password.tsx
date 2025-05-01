import { Theme } from '@react-email/theme';
import { Container } from '@react-email/container';
import { Section } from '@react-email/section';
import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import { Button } from '@react-email/button';
import { Head } from '@react-email/head';
import { Preview } from '@react-email/preview';

interface ResetPasswordEmailProps {
  url: string;
  host: string;
  userEmail?: string;
}

export default function ResetPasswordEmail({
  url,
  host,
  userEmail,
}: ResetPasswordEmailProps) {
  const previewText = `Reset your password for ${host}`;

  return (
    <Html>
      <Head>
        <Theme />
      </Head>
      <Preview>{previewText}</Preview>
      <Section style={main}>
        <Container style={container}>
          <Text style={heading}>Reset Your Password</Text>
          <Text style={paragraph}>
            We received a request to reset the password for your account
            {userEmail && ` (${userEmail})`}. Click the button below to reset it:
          </Text>
          <Button pX={20} pY={12} style={button} href={url}>
            Reset Password
          </Button>
          <Text style={paragraph}>
            If you didn't request this password reset, you can safely ignore this email.
          </Text>
          <Text style={paragraph}>
            This link will expire in 1 hour for security reasons.
          </Text>
          <Text style={footer}>
            If the button above doesn't work, copy and paste this URL into your browser:<br />
            {url}
          </Text>
        </Container>
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '5px',
  margin: '0 auto',
  padding: '20px',
  width: '100%',
  maxWidth: '600px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
  color: '#1a1a1a',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#484848',
};

const button = {
  backgroundColor: '#4f46e5',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  margin: '30px auto',
};

const footer = {
  fontSize: '12px',
  color: '#898989',
  lineHeight: '22px',
  marginTop: '30px',
  wordBreak: 'break-all' as const,
}; 