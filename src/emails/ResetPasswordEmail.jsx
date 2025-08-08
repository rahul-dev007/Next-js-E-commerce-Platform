import * as React from 'react';
import { 
    Html, 
    Head, 
    Preview, 
    Body, 
    Container, 
    Section, 
    Heading, 
    Text, 
    Button, 
    Hr, 
    Tailwind 
} from '@react-email/components';

export default function ResetPasswordEmail({ resetUrl }) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for MyShop</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white border border-solid border-gray-200 rounded-lg my-10 mx-auto p-10 w-[465px]">
            <Heading className="text-2xl font-bold text-gray-800">Reset Your Password</Heading>
            <Text className="text-gray-600 text-base leading-6">
              Someone requested a password reset for your MyShop account. If this was you, click the button below to set a new password. This link is valid for 10 minutes.
            </Text>
            <Section className="text-center my-8">
              <Button 
                className="bg-indigo-600 rounded-md text-white font-semibold px-5 py-3" 
                href={resetUrl}
              >
                Reset Password
              </Button>
            </Section>
            <Text className="text-gray-600 text-base leading-6">
              If you did not request a password reset, you can safely ignore this email.
            </Text>
            <Hr className="border-t border-solid border-gray-200 my-6" />
            <Text className="text-xs text-gray-400">
              MyShop Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}