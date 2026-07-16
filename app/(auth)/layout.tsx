import { PropsWithChildren } from "react";
import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: PropsWithChildren) => {
  const { isLoggedIn } = await getCurrentUser();
  if (isLoggedIn) {
    redirect("/dashboard");
  }
  return <>{children}</>;
};

export default AuthLayout;
