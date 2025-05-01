import { Theme } from '@react-email/theme';
import { Container } from '@react-email/container';
import { Section } from '@react-email/section';
import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import { Button } from '@react-email/button';
import { Head } from '@react-email/head';
import { Preview } from '@react-email/preview';

interface VerificationEmailProps {
  url: string;
  host: string;
  userEmail?: string;
}

export default function VerificationEmail({
  url,
  host,
  userEmail,
}: VerificationEmailProps) {
  const previewText = `Verify your email address for ${host}`;

  return (
    <Html>
      <Head>
        <Theme />
      </Head>
      <Preview>{previewText}</Preview>
      <Section style={main}>
        <Container style={container}>
          <Text style={heading}>Verify your email address</Text>
          <Text style={paragraph}>
            Thank you for registering with {host}. Please verify your email address by clicking the button below:
          </Text>
          <Button pX={20} pY={12} style={button} href={url}>
            Verify Email Address
          </Button>
          <Text style={paragraph}>
            If you didn't request this email, you can safely ignore it.
          </Text>
          <Text style={paragraph}>
            This link will expire in 24 hours.
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