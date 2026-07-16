"use client";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { IconLoader } from "@tabler/icons-react";
import { useResendOtp } from "@/hooks/useResendOtp";

const otpSchema = z.object({
  otp: z.string().optional(),
});

type FORMDATA = z.infer<typeof otpSchema>;

const OtpVerificationForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cooldown = useResendOtp(30);
  const [pending, startTransition] = useTransition();
  const [resending, setResending] = useState(false);

  // Use useMemo to derive the email from the search params
  const email = useMemo(() => {
    if (!searchParams) return "";
    return searchParams.get("email") || "";
  }, [searchParams]);

  const form = useForm<FORMDATA>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async ({ otp }: FORMDATA) => {
    startTransition(async () => {
      await authClient.signIn.emailOtp(
        {
          email,
          otp: otp,
        },
        {
          onSuccess: (response) => {
            toast.success("Email verified successfully.");

            if (
              response.data.user.name === null ||
              response.data.user.name === ""
            ) {
              router.push("/settings");
            } else {
              router.push("/dashboard");
            }
            router.refresh();
          },
          onError: async (ctx) => {
            toast.error(`${ctx.error.message ?? "Something went wrong"}`);
          },
        }
      );
    });
  };

  const handleResendCode = async () => {
    await authClient.emailOtp.sendVerificationOtp(
      {
        email,
        type: "sign-in",
      },
      {
        onRequest: () => {
          setResending(true);
        },
        onSuccess: () => {
          toast.success(`Verification code sent to ${email}`);
          cooldown.start();
          setResending(false);
        },
        onError: async (ctx) => {
          toast.error(`${ctx.error.message ?? "Something went wrong"}`, {
            style: { color: "red" },
          });
          setResending(false);
        },
      }
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-6">
        <Controller
          name="otp"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <InputOTP
                maxLength={6}
                id="otp"
                required
                onChange={(value) => field.onChange(value)}
                value={field.value}
                onBlur={field.onBlur}
                disabled={pending}
              >
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:border-foreground w-full gap-3 *:data-[slot=input-otp-slot]:h-11 *:data-[slot=input-otp-slot]:w-14 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {fieldState.invalid && (
                <FieldError
                  className="capitalize"
                  errors={[fieldState.error]}
                />
              )}
              <FieldDescription>
                Enter the 6-digit code sent to your email.
              </FieldDescription>
            </Field>
          )}
        />
        <Field orientation={"responsive"}>
          <Button
            type="submit"
            disabled={pending}
            className="cursor-pointer text-base"
          >
            {pending && <IconLoader className="animate-spin" />}
            Verify Email
          </Button>
        </Field>
        <Field>
          {cooldown.canResend ? (
            <FieldDescription className="flex items-center justify-center text-center">
              {resending && <IconLoader className="animate-spin" />}
              <span>Didn&apos;t receive the code?</span>
              <Button
                type="button"
                variant={"link"}
                className="text-muted-foreground hover:text-foreground cursor-pointer border px-0.5"
                onClick={handleResendCode}
              >
                Resend
              </Button>
            </FieldDescription>
          ) : (
            <FieldDescription className="text-center">
              Resend code in {cooldown.remaining}s
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
};

export default OtpVerificationForm;
