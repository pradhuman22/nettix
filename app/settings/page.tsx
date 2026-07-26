import React from "react";
import MainWrapper from "@/components/shared/main-wrapper";
import UpdateAccountForm from "./_components/update-account-form";
import { getCurrentSession, getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import UpdateContactInfoForm from "./_components/update-contact-info-form";
import UpdatePasswordForm from "./_components/update-password-form";
import SessionManagement from "./_components/session-management-form";
import DeleteAccountForm from "./_components/delete-account-form";

const SettingsPage = async () => {
  const { isLoggedIn, token, user } = await getCurrentUser();
  if (!isLoggedIn) redirect("/signin");
  const currentSession = await getCurrentSession(token);
  return (
    <MainWrapper>
      <div className="grid gap-8 px-4 py-8 md:px-0">
        <div>
          <h1 className="text-xl font-medium">Basic Information</h1>
          <p className="text-muted-foreground text-sm">
            Choose how you want to be displayed yourself.
          </p>
        </div>
        <UpdateAccountForm user={user} />
        <Separator />
        <div>
          <h1 className="text-xl font-medium">Phone number</h1>
          <p className="text-muted-foreground text-sm">
            Enter the phone number you wish to receive updates.
          </p>
        </div>
        <UpdateContactInfoForm contact={user?.contact} />
        <div>
          <h1 className="text-xl font-medium">Password & Security</h1>
          <p className="text-muted-foreground text-sm">
            Secure your account with password and two-factor authentication.
          </p>
        </div>
        <UpdatePasswordForm />
        <Separator />
        <div>
          <h1 className="text-xl font-medium">Active Device</h1>
          <p className="text-muted-foreground text-sm">
            See the list of devices you are currently signed from.
          </p>
        </div>
        <SessionManagement session={currentSession} />
        <Separator />
        <div>
          <h1 className="text-xl font-medium">Delete Account</h1>
          <p className="text-muted-foreground text-sm">
            If you no longer wish to use, you can permanently delete your
            account.
          </p>
        </div>
        <DeleteAccountForm />
      </div>
    </MainWrapper>
  );
};

export default SettingsPage;
