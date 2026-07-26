"use client";
import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateEventTitle } from "@/lib/event";
import { eventTitleSchema, eventTitleSchemaType } from "@/schema/event-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2, IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface EventTitleFormProps {
  initialData: {
    title: string | undefined;
  };
  eventId: string;
}

const EventTitleForm = ({ initialData, eventId }: EventTitleFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<eventTitleSchemaType>({
    resolver: zodResolver(eventTitleSchema),
    defaultValues: {
      title: initialData.title,
    },
  });
  const { isSubmitting, isValid } = form.formState;
  useEffect(() => {
    form.reset({ title: initialData.title });
  }, [initialData.title, form]);
  const onSubmit = async (values: eventTitleSchemaType) => {
    try {
      const response = await updateEventTitle({
        id: eventId,
        values: values,
      });
      if (response?.status === "success") {
        toast.success("Event title updated successfully!");
        setIsOpen(false);
        startTransition(() => {
          router.refresh();
        });
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="mt-4 rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between font-medium">
        <span className="text-lg">Title</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => setIsOpen(true)}
        >
          <IconPencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        {/* Dialog Window Container */}
        <Modal
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title="Edit event title"
          description="Make changes to your event title here. Click save when you're
                done."
        >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FieldGroup>
              <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-foreground text-base"
                    >
                      Title
                    </FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      className="placeholder:text-sm md:text-sm"
                      placeholder="Enter event title. eg: Happy Hollowen Event"
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
      <p className="mt-2 text-slate-700 dark:text-slate-300">
        {isPending ? (
          <IconLoader2 className="h-4 w-4 animate-spin" />
        ) : (
          initialData.title
        )}
      </p>
    </div>
  );
};

export default EventTitleForm;
