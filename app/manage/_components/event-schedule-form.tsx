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
import { updateEventSchedule } from "@/lib/event";
import {
  eventScheduleSchema,
  eventScheduleSchemaType,
} from "@/schema/event-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar, IconLoader2, IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface EventScheduleFormProps {
  initialData: {
    schedule: Date | string | null;
  };
  eventId: string;
}

// Helper utilities to slice ISO date strings for input defaults
const getDateString = (dateVal?: Date | string | null) => {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
};

const getTimeString = (dateVal?: Date | string | null) => {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`; // "HH:mm"
};

const EventScheduleForm = ({
  initialData,
  eventId,
}: EventScheduleFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<eventScheduleSchemaType>({
    resolver: zodResolver(eventScheduleSchema),
    defaultValues: {
      date: getDateString(initialData.schedule),
      time: getTimeString(initialData.schedule),
    },
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    form.reset({
      date: getDateString(initialData.schedule),
      time: getTimeString(initialData.schedule),
    });
  }, [initialData.schedule, form]);

  const onSubmit = async (values: eventScheduleSchemaType) => {
    try {
      // Merge date and time string into a valid JS Date object
      const combinedDateTime = new Date(`${values.date}T${values.time}`);

      const response = await updateEventSchedule({
        id: eventId,
        schedule: combinedDateTime,
      });

      if (response?.status === "success") {
        toast.success("Schedule updated successfully!");
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

  // Card display formatter
  const formattedSchedule = initialData.schedule
    ? new Date(initialData.schedule).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "No schedule set";

  return (
    <div className="mt-4 rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between font-medium">
        <span className="flex items-center gap-2 text-lg">
          <IconCalendar className="h-5 w-5 text-slate-500" />
          Schedule
        </span>
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
          title="Edit event schedule"
          description="Select the date and time for this event."
        >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="date"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-foreground text-base"
                    >
                      Date
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="date"
                      {...field}
                      className="placeholder:text-sm md:text-sm"
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

              <Controller
                control={form.control}
                name="time"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-foreground text-base"
                    >
                      Time
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="time"
                      {...field}
                      className="placeholder:text-sm md:text-sm"
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

      <p className="mt-2 text-slate-700 dark:text-slate-300">
        {isPending ? (
          <IconLoader2 className="h-4 w-4 animate-spin" />
        ) : (
          formattedSchedule
        )}
      </p>
    </div>
  );
};

export default EventScheduleForm;
