import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
} from "@react-email/components";

interface TwoFactorCodeEmailProps {
  code: string;
}

export function TwoFactorCodeEmail({ code }: TwoFactorCodeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Tailfy</Heading>
          <Section style={codeSection}>
            <Text style={title}>Código de verificação</Text>
            <Text style={codeText}>{code}</Text>
            <Text style={subtitle}>
              Use este código para concluir seu login. Ele expira em 10 minutos.
            </Text>
          </Section>
          <Text style={footer}>
            Se você não tentou fazer login, ignore este email.
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

const codeSection = {
  textAlign: "center" as const,
  padding: "24px 0",
};

const title = {
  color: "#18181b",
  fontSize: "18px",
  fontWeight: "600" as const,
  margin: "0 0 16px",
};

const codeText = {
  backgroundColor: "#faf5ff",
  border: "1px solid #e9d5ff",
  borderRadius: "12px",
  color: "#9333ea",
  display: "inline-block",
  fontSize: "32px",
  fontWeight: "700" as const,
  letterSpacing: "8px",
  padding: "16px 32px",
  margin: "0 0 16px",
};

const subtitle = {
  color: "#71717a",
  fontSize: "14px",
  margin: "0",
};

const footer = {
  color: "#a1a1aa",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "24px 0 0",
};
