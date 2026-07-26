"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { IconAlertTriangle, IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const DeleteAccountForm = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const handleDelete = () => {
    startTransition(async () => {
      await authClient.deleteUser(
        {
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            toast.success("Account has been deleted successfully.");
            router.refresh();
          },
          onError: () => {
            toast.error("Failed to delete account.");
          },
        }
      );
    });
  };
  return (
    <div>
      <Button
        variant={"destructive"}
        onClick={handleDelete}
        disabled={pending}
        className="cursor-pointer"
      >
        {pending && <IconLoader className="animate-spin" />}
        <IconAlertTriangle /> Delete My Account
      </Button>
    </div>
  );
};

export default DeleteAccountForm;
