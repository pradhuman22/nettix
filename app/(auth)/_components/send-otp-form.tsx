"use client";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IconLoader, IconSend } from "@tabler/icons-react";

const signInSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
});

type FORMDATA = z.infer<typeof signInSchema>;

const SendOtpForm = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<FORMDATA>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = ({ email }: FORMDATA) => {
    startTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success(`Verification code send to ${email}`);
            router.push(`/otp-verification?email=${email}`);
          },
          onError: async (ctx) => {
            toast.error(`${ctx.error.message ?? "Something went wrong"}`);
          },
        },
      });
    });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-5">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="email" className="text-sm font-medium">
                Email
              </FieldLabel>
              <Input
                placeholder="hari@example.com"
                className="border-border focus-visible:border-border px-2 placeholder:text-base placeholder:font-medium"
                {...field}
                id="email"
                disabled={pending}
              />
              {fieldState.invalid && (
                <FieldError
                  className="capitalize"
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />
        <Field>
          <Button
            className="cursor-pointer text-sm font-medium"
            type="submit"
            disabled={pending}
          >
            {pending ? (
              <>
                <IconLoader className="size-4 animate-spin" />{" "}
                <span>Loading...</span>
              </>
            ) : (
              <>
                <IconSend className="size-4" /> <span>Continue With Email</span>
              </>
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default SendOtpForm;
