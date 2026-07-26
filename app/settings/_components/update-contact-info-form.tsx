"use client";

import { useTransition } from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { IconLoader, IconPhone } from "@tabler/icons-react";
import { contactSchema, contactSchemaType } from "@/schema/setting-schema";

const UpdateContactInfoForm = ({
  contact,
}: {
  contact: string | null | undefined;
}) => {
  const [pending, startTransition] = useTransition();
  const form = useForm<contactSchemaType>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      contact: contact || "",
    },
  });
  const onSubmit = ({ contact }: contactSchemaType) => {
    startTransition(async () => {
      await authClient.updateUser(
        {
          contact,
        },
        {
          onSuccess: () => {
            toast.success("Contact updated successfully");
          },
          onError: () => {
            toast.error("Failed to update contact");
          },
        }
      );
    });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl">
      <FieldGroup>
        <Controller
          name="contact"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation={"horizontal"}>
              <Input
                placeholder="+81 07034567890"
                {...field}
                className="px-2 text-lg placeholder:text-base"
                disabled={pending}
              />
            </Field>
          )}
        />
        <Field orientation={"horizontal"}>
          <Button
            type="submit"
            className="cursor-pointer px-2.5 text-sm"
            disabled={pending}
          >
            {pending && <IconLoader className="animate-spin" />}{" "}
            <IconPhone className="size-4" /> Update Contact
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default UpdateContactInfoForm;
