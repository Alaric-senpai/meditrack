import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PasswordResetEmailProps {
  userName: string;
  resetLink: string;
}

export const PasswordResetEmail = ({
  userName,
  resetLink,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your MediTrack password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
            <Heading style={logo}>MediTrack</Heading>
        </Section>
        <Section style={content}>
          <Heading style={h1}>Password Reset Request</Heading>
          <Text style={text}>Hello {userName},</Text>
          <Text style={text}>
            We received a request to reset the password for your <strong>MediTrack Clinical Portal</strong> account.
          </Text>
          
          <Section style={center}>
            <Button style={button} href={resetLink}>
                Reset Password
            </Button>
          </Section>

          <Text style={text}>
            This link will expire in 2 hours for security reasons. If you did not request a password reset, please ignore this email or notify your system administrator if you suspect unauthorized access.
          </Text>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            For security, never share this link with anyone. MediTrack staff will never ask for your password.
          </Text>
          <Text style={footer}>
            MediTrack Healthcare Solutions &copy; {new Date().getFullYear()}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

const main = {
  backgroundColor: "#f4f7f9",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};

const header = {
    padding: "32px 48px",
    backgroundColor: "#1e3a8a",
    borderRadius: "8px 8px 0 0",
    textAlign: "center" as const,
};

const logo = {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "800",
    margin: "0",
    letterSpacing: "-0.5px",
};

const content = {
  padding: "48px 48px",
};

const h1 = {
  color: "#1e3a8a",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#334155",
  fontSize: "16px",
  lineHeight: "26px",
};

const center = {
    textAlign: "center" as const,
    margin: "32px 0",
};

const button = {
  backgroundColor: "#1e3a8a",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "40px 0",
};

const footer = {
  color: "#94a3b8",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "10px",
};
