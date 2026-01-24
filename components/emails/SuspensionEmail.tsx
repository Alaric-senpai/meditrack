import {
  Body,
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

interface SuspensionEmailProps {
  userName: string;
  reason?: string;
}

export const SuspensionEmail = ({
  userName,
  reason,
}: SuspensionEmailProps) => (
  <Html>
    <Head />
    <Preview>Security Notice: Account Status Update</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
            <Heading style={logo}>MediTrack</Heading>
        </Section>
        <Section style={content}>
          <Heading style={h1}>Account Suspension Notice</Heading>
          <Text style={text}>Hello {userName},</Text>
          <Text style={text}>
            This is an official notification that your access to the <strong>MediTrack Clinical Portal</strong> has been suspended by a system administrator.
          </Text>
          
          {reason && (
            <Section style={card}>
              <Text style={text}><strong>Reason for suspension:</strong></Text>
              <Text style={text}>{reason}</Text>
            </Section>
          )}

          <Text style={text}>
            During this period, you will be unable to log in or access any clinical records associated with your account. Active sessions have been revoked for security compliance.
          </Text>
          
          <Text style={text}>
            If you believe this is an error or wish to appeal this decision, please contact your department lead or the MediTrack system administrator.
          </Text>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            This is an automated security notice. Please do not reply to this email.
          </Text>
          <Text style={footer}>
            MediTrack Healthcare Solutions &copy; {new Date().getFullYear()}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default SuspensionEmail;

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
    backgroundColor: "#b91c1c", // Red for warning
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
  color: "#b91c1c",
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
    backgroundColor: "#fef2f2",
    borderRadius: "4px",
    padding: "20px",
    margin: "24px 0",
    border: "1px solid #fee2e2",
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
