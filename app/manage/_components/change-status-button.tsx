"use client";
import React, { useTransition } from "react";
import { updateEventStatus } from "@/lib/event";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChangeStatusButtonProps {
  disabled: boolean;
  eventId: string;
  isPublished: boolean;
}

const ChangeStatusButton = ({
  disabled,
  eventId,
  isPublished,
}: ChangeStatusButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const onClick = () => {
    startTransition(async () => {
      try {
        const result = await updateEventStatus({
          eventId,
          status: isPublished ? false : true,
        });
        if (result.status === "error") {
          toast.error(result.message);
        } else {
          toast.success(result.message);
          router.push(`/manage/${result.data?.id}`);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to publish the event.");
      }
    });
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button onClick={onClick} disabled={disabled || isPending} size={"sm"}>
        {isPublished ? "publish" : "unpublish"}
      </Button>
    </div>
  );
};

export default ChangeStatusButton;
