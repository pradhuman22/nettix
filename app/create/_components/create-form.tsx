"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { IconBookUpload, IconLoader } from "@tabler/icons-react";
import {
  createEventSchema,
  createEventSchemaType,
} from "@/schema/event-schema";
import { createEvent } from "@/lib/event";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<createEventSchemaType>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
    },
  });
  const onSubmit = (values: createEventSchemaType) => {
    startTransition(async () => {
      try {
        const result = await createEvent(values);
        if (result.status === "success") {
          toast.success(result.message);
          router.push(`/manage/${result.data?.id}`);
        }
        if (result.status === "error") {
          if (result.statusCode === 401) {
            router.push("/signin");
          } else if (result.statusCode === 403) {
            router.push("/dashboard");
          }
          toast.error(result.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("An unexpected error occured. Please try again.");
      }
    });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-6">
        <FieldSet>
          <FieldLegend className="data-[variant=legend]:text-xl">
            Basic Information
          </FieldLegend>
          <FieldDescription className="text-base">
            What would you like to name your event? Don&apos;t worry, you can
            change this later.
          </FieldDescription>
          <FieldGroup>
            {/* title */}
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-foreground text-lg"
                  >
                    Title of your event
                  </FieldLabel>
                  <Input
                    id={field.name}
                    className="placeholder:text-sm md:text-sm"
                    placeholder="eg: 'Happy Easter Event'"
                    {...field}
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
          </FieldGroup>
        </FieldSet>
        <Field orientation={"horizontal"}>
          <Button size={"lg"} type="submit" className="cursor-pointer px-2.5">
            {isPending && <IconLoader className="animate-spin" />}
            <IconBookUpload className="size-5" />
            {isPending ? "Creating Event" : "Create Event"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default CreateForm;
