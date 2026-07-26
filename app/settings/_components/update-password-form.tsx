"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  IconEye,
  IconEyeClosed,
  IconLoader,
  IconLock,
} from "@tabler/icons-react";
import { changePasswordSchema } from "@/schema/setting-schema";

type FORMDATA = z.infer<typeof changePasswordSchema>;
const UpdatePasswordForm = () => {
  const [pending, startTranstion] = useTransition();
  const [displayPassword, setDisplayPassword] = useState(false);
  const [displayConfirmPassword, setDisplayConfirmPassword] = useState(false);
  const [displayOldPassword, setDisplayOldPassword] = useState(false);
  const form = useForm<FORMDATA>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = ({ oldPassword, password }: FORMDATA) => {
    startTranstion(async () => {
      await authClient.changePassword(
        {
          currentPassword: oldPassword,
          newPassword: password,
        },
        {
          onSuccess: () => {
            toast.success("Password changed successfully.");
          },
          onError: (ctx) => {
            toast.error(`${ctx.error.message && "Failed to change password."}`);
          },
        }
      );
    });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-6 md:flex-row">
          {/* old password */}
          <Controller
            name="oldPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="oldPassword"
                  className="text-foreground text-sm font-medium"
                >
                  Current Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="******"
                    type={displayOldPassword ? "text" : "password"}
                    className="placeholder:text-sm"
                    disabled={pending}
                  />
                  <InputGroupAddon
                    align={"inline-end"}
                    className="cursor-pointer"
                    onClick={() => setDisplayOldPassword(!displayOldPassword)}
                  >
                    {displayOldPassword ? (
                      <IconEyeClosed className="size-5" />
                    ) : (
                      <IconEye className="size-5" />
                    )}
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* password */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="password"
                  className="text-foreground text-sm font-medium"
                >
                  New Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="******"
                    type={displayPassword ? "text" : "password"}
                    className="placeholder:text-sm"
                    disabled={pending}
                  />
                  <InputGroupAddon
                    align={"inline-end"}
                    className="cursor-pointer"
                    onClick={() => setDisplayPassword(!displayPassword)}
                  >
                    {displayPassword ? (
                      <IconEyeClosed className="size-5" />
                    ) : (
                      <IconEye className="size-5" />
                    )}
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* confirm password */}
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="confirmPassword"
                  className="text-foreground text-sm font-medium"
                >
                  Confirm Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="******"
                    type={displayConfirmPassword ? "text" : "password"}
                    className="placeholder:text-sm"
                    disabled={pending}
                  />
                  <InputGroupAddon
                    align={"inline-end"}
                    className="cursor-pointer"
                    onClick={() =>
                      setDisplayConfirmPassword(!displayConfirmPassword)
                    }
                  >
                    {displayConfirmPassword ? (
                      <IconEyeClosed className="size-5" />
                    ) : (
                      <IconEye className="size-5" />
                    )}
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Field orientation={"horizontal"}>
          <Button type="submit" disabled={pending} className="cursor-pointer">
            {pending && <IconLoader className="animate-spin" />}
            <IconLock className="size-4" />
            Update Password
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default UpdatePasswordForm;
