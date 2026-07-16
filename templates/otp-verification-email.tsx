import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface OtpEmailProps {
  otp: string;
  email: string;
}

const OtpVerificationEmail = ({ otp, email }: OtpEmailProps) => {
  return (
    <Html>
      <Head />

      <Preview>Your Nettix Verification Code</Preview>

      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto px-3">
            <Heading className="mx-0 my-10 p-0 text-[24px] text-[#333]">
              Verify Your Email
            </Heading>

            <Link
              href={`/verify-request?email=${email}`}
              className="text-primary mb-4 block text-[14px] underline"
              target="_blank"
            >
              Use the code below to verify your account
            </Link>

            <Text className="text-muted-foreground my-6 mb-3.5 text-[14px]">
              Copy and paste this verification code:
            </Text>

            <code className="inline-block w-[90%] rounded-md border border-solid border-[#eee] bg-[#f4f4f4] px-[4.5%] py-4 font-mono text-[18px] tracking-[0.3em] text-[#333]">
              {otp}
            </code>

            <Text className="mt-4 mb-4 text-[14px]">
              This code will expire in 5 minutes.
            </Text>

            <Text className="mt-3 mb-8 text-[14px]">
              If you didn&apos;t request this verification code, you can safely
              ignore this email.
            </Text>
            <Text className="mt-3 mb-6 text-[12px] leading-[22px]">
              <Link href="/" className="underline">
                Nettix
              </Link>
              <br />A modern platform for learning and skill development.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OtpVerificationEmail;
