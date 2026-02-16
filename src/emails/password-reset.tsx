import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
} from "@react-email/components";

interface PasswordResetEmailProps {
  resetUrl: string;
}

export function PasswordResetEmail({ resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Tailfy</Heading>
          <Section style={contentSection}>
            <Text style={title}>Redefinir sua senha</Text>
            <Text style={description}>
              Recebemos uma solicitação para redefinir sua senha. Clique no botão
              abaixo para criar uma nova senha. O link expira em 30 minutos.
            </Text>
            <Section style={buttonSection}>
              <Button style={button} href={resetUrl}>
                Redefinir senha
              </Button>
            </Section>
          </Section>
          <Text style={footer}>
            Se você não solicitou a redefinição de senha, ignore este email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily: "system-ui, -apple-system, sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  margin: "0 auto",
  padding: "40px",
  maxWidth: "480px",
};

const heading = {
  color: "#9333ea",
  fontSize: "24px",
  fontWeight: "700" as const,
  textAlign: "center" as const,
  margin: "0 0 32px",
};

const contentSection = {
  textAlign: "center" as const,
  padding: "24px 0",
};

const title = {
  color: "#18181b",
  fontSize: "18px",
  fontWeight: "600" as const,
  margin: "0 0 12px",
};

const description = {
  color: "#52525b",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 24px",
};

const buttonSection = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#9333ea",
  borderRadius: "9999px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "600" as const,
  padding: "12px 32px",
  textDecoration: "none",
};

const footer = {
  color: "#a1a1aa",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "24px 0 0",
};
