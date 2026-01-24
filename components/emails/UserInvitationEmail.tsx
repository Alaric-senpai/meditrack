import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface InvitationEmailProps {
  userName: string;
  role: string;
  tempPassword?: string;
  invitationLink: string;
}

const baseUrl = process.env.NEXT_PUBLIC_URL ? process.env.NEXT_PUBLIC_URL : "";

export const UserInvitationEmail = ({
  userName,
  role,
  tempPassword,
  invitationLink,
}: InvitationEmailProps) => (
  <Html>
    <Head />
    <Preview>Join MediTrack - Professional Medical Portal</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
            <Heading style={logo}>MediTrack</Heading>
        </Section>
        <Section style={content}>
          <Heading style={h1}>Welcome to MediTrack</Heading>
          <Text style={text}>Hello {userName},</Text>
          <Text style={text}>
            You have been invited to join the <strong>MediTrack Clinical Operations Platform</strong> as a <strong>{role}</strong>.
          </Text>
          
          <Section style={card}>
            <Text style={text}>Your temporary credentials are provided below:</Text>
            <Text style={code}>Temporary Password: {tempPassword}</Text>
          </Section>

          <Button style={button} href={invitationLink}>
            Access Portal
          </Button>
          
          <Text style={text}>
            For security reasons, you will be required to change your password upon your first login.
          </Text>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            If you did not expect this invitation, please ignore this email or contact our support team.
          </Text>
          <Text style={footer}>
            MediTrack Healthcare Solutions &copy; {new Date().getFullYear()}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default UserInvitationEmail;

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

const card = {
    backgroundColor: "#f8fafc",
    borderRadius: "4px",
    padding: "20px",
    margin: "24px 0",
    border: "1px solid #e2e8f0",
};

const code = {
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#1e3a8a",
    fontSize: "18px",
    textAlign: "center" as const,
    margin: "10px 0",
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
