import { Theme } from '@react-email/theme';
import { Container } from '@react-email/container';
import { Section } from '@react-email/section';
import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import { Button } from '@react-email/button';
import { Head } from '@react-email/head';
import { Preview } from '@react-email/preview';

interface WelcomeEmailProps {
  url: string;
  host: string;
  name?: string;
}

export default function WelcomeEmail({
  url,
  host,
  name,
}: WelcomeEmailProps) {
  const previewText = `Welcome to ${host}!`;

  return (
    <Html>
      <Head>
        <Theme />
      </Head>
      <Preview>{previewText}</Preview>
      <Section style={main}>
        <Container style={container}>
          <Text style={heading}>Welcome to {host}!</Text>
          <Text style={paragraph}>
            Hi {name || 'there'},
          </Text>
          <Text style={paragraph}>
            Thank you for joining {host}. We're excited to have you on board! Your account has been successfully created.
          </Text>
          <Button pX={20} pY={12} style={button} href={url}>
            Get Started
          </Button>
          <Text style={paragraph}>
            If you have any questions or need assistance, don't hesitate to reach out to our support team.
          </Text>
          <Text style={footer}>
            Best regards,<br />
            The {host} Team
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
}; 