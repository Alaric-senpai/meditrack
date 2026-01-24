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

interface WelcomeEmailProps {
  userName: string;
}

const baseUrl = process.env.NEXT_PUBLIC_URL ? process.env.NEXT_PUBLIC_URL : "";

export const WelcomeEmail = ({
  userName,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to MediTrack - Your medical operations partner</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
            <Heading style={logo}>MediTrack</Heading>
        </Section>
        <Section style={content}>
          <Heading style={h1}>Registration Successful</Heading>
          <Text style={text}>Hello {userName},</Text>
          <Text style={text}>
            Welcome to <strong>MediTrack</strong>! Your account has been successfully created and you now have access to our professional healthcare monitoring and operations platform.
          </Text>
          
          <Text style={text}>
            We are committed to providing you with the most reliable and efficient tools to manage clinical workflows and patient care.
          </Text>

          <Button style={button} href={`${baseUrl}/dashboard`}>
            Go to Dashboard
          </Button>
          
          <Text style={text}>
            If you have any questions, our technical support team is available to assist you.
          </Text>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            MediTrack Healthcare Solutions &copy; {new Date().getFullYear()}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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

const button = {
  backgroundColor: "#1e3a8a",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px",
  marginTop: "24px",
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
