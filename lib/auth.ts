import { emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth, BetterAuthOptions } from "better-auth";
import OtpVerificationEmail from "@/templates/otp-verification-email";
import prisma from "./prisma";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    freshAge: 0,
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60,
      strategy: "jwe",
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },
      contact: {
        type: "string",
        required: false,
      },
    },
    deleteUser: {
      enabled: true,
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "Nettix <onboarding@resend.dev>",
          to: [email],
          subject: "Nettix- verify your email",
          react: OtpVerificationEmail({ email, otp }),
        });
      },
    }),
    nextCookies(),
  ],
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },
  account: {
    accountLinking: {
      enabled: false,
    },
  },
  trustedOrigins: ["http://localhost:3001"],
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
