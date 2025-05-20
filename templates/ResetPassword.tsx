import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  name?: string;
  url?: string;
}

const ResetPassword = ({ name, url }: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Password Reset Request for Your E-BOX Account</Preview>
      <Tailwind>
        <Body className="bg-background px-4 py-6 font-sans">
          <Container className="max-w-lg mx-auto bg-background border border-muted-foreground rounded-lg p-6 shadow-md">
            <Section className="mb-4">
              <Text className="text-lg font-semibold text-muted-foreground">
                Hi {name},
              </Text>
            </Section>
            <Section className="mb-6">
              <Text className="text-base text-muted-foreground">
                We received a request to reset the password for your E-BOX
                account. If you made this request, please click the button below
                to reset your password:
              </Text>
            </Section>
            <Section className="text-center mb-6">
              <Button
                className="bg-teal-500 text-teal-50 px-6 py-3 rounded-md text-base font-medium"
                href={url}
              >
                Reset Password
              </Button>
            </Section>
            <Section className="mb-6">
              <Text className="text-base text-muted-foreground">
                If you didn’t request to reset your password, no action is
                required. You can safely ignore this email.
              </Text>
            </Section>
            <Section>
              <Text className="text-sm text-muted-foreground">
                To ensure the security of your account, please do not forward
                this email or share the reset link with anyone.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPassword;
