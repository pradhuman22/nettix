"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { IconBrandGoogleFilled, IconLoader } from "@tabler/icons-react";

import { useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";

const SocialLoginButton = () => {
  const [pending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const handleSocialLogin = () => {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl || "/dashboard",
        errorCallbackURL: "/signin",
      });
    });
  };
  useEffect(() => {
    if (searchParams.get("error") === "account_not_linked") {
      toast.error("Email already register to other provider");
    }
  }, [searchParams]);
  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        className="w-full cursor-pointer text-sm font-medium"
        variant={"outline"}
        onClick={handleSocialLogin}
        disabled={pending}
      >
        {pending && <IconLoader className="animate-spin" />}
        <IconBrandGoogleFilled />
        Sign In With Google
      </Button>
    </div>
  );
};

export default SocialLoginButton;
