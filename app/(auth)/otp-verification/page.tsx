import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OtpVerificationForm from "../_components/otp-verification-form";
import MainWrapper from "@/components/shared/main-wrapper";

const OtpVerificationPage = async () => {
  return (
    <MainWrapper>
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Card className="border-background w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Enter Verification Code</CardTitle>
            <CardDescription className="text-sm">
              We sent a 6-digit code to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OtpVerificationForm />
          </CardContent>
        </Card>
        <div className="text-muted-foreground w-full max-w-xs text-center text-xs leading-loose">
          By clicking continue, you agree to our{" "}
          <Link
            href={"/terms"}
            className="hover:text-foreground cursor-pointer"
          >
            Terms of service
          </Link>{" "}
          and{" "}
          <Link
            href={"/policy"}
            className="hover:text-foreground cursor-pointer"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </MainWrapper>
  );
};

export default OtpVerificationPage;
