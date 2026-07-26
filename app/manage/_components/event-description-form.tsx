"use client";

import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import {
  eventDescriptionSchema,
  eventDescriptionSchemaType,
} from "@/schema/event-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2, IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { updateEventDescription } from "@/lib/event";
import { Textarea } from "@/components/ui/textarea";

interface EventDescriptionFormProps {
  initialData: {
    description: string | undefined;
  };
  eventId: string;
}

const EventDescriptionForm = ({
  initialData,
  eventId,
}: EventDescriptionFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<eventDescriptionSchemaType>({
    resolver: zodResolver(eventDescriptionSchema),
    defaultValues: {
      description: initialData.description,
    },
  });
  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    form.reset({ description: initialData.description });
  }, [initialData.description, form]);

  const onSubmit = async (values: eventDescriptionSchemaType) => {
    try {
      const response = await updateEventDescription({
        id: eventId,
        values: values,
      });
      if (response?.status === "success") {
        toast.success("Event description updated successfully.");
        setIsOpen(false);
        startTransition(() => {
          router.refresh();
        });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="mt-6 rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between font-medium text-slate-900 dark:text-slate-100">
        <span className="text-lg">Description</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => setIsOpen(true)}
        >
          <IconPencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title="Edit event description"
          description="Make changes to your event description here. Click save when you're
                done."
        >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FieldGroup>
              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-foreground text-base"
                    >
                      Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="eg: Write your short description."
                      className="h-60 placeholder:text-base"
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

            <Field orientation={"horizontal"} className="py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button disabled={!isValid || isSubmitting} type="submit">
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </Field>
          </form>
        </Modal>
      </div>
      {/* Main card view always stays clean and static */}
      <div className="mt-2">
        {isPending ? (
          <IconLoader2 className="h-4 w-4 animate-spin" />
        ) : initialData.description ? (
          initialData.description
        ) : (
          <span className="mt-4 flex">No description</span>
        )}
      </div>
    </div>
  );
};

export default EventDescriptionForm;
