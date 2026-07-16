import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SocialLoginButton from "../_components/social-login-button";
import SendOtpForm from "../_components/send-otp-form";
import MainWrapper from "@/components/shared/main-wrapper";

const SignInPage = async () => {
  return (
    <MainWrapper>
      <div className="gap4 flex flex-col items-center justify-center py-20">
        <Card className="w-full max-w-sm">
          <CardHeader className="px-4">
            <CardTitle className="text-base">Welcome Back!</CardTitle>
            <CardDescription className="text-base">
              Please sign in to continue..
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 px-4 pb-4">
            <SendOtpForm />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center uppercase">
                <span className="bg-card text-muted-foreground px-2">
                  Or continue with
                </span>
              </div>
            </div>
            <SocialLoginButton />
          </CardContent>
        </Card>
      </div>
    </MainWrapper>
  );
};

export default SignInPage;
