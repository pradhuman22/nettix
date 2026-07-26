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
import { updateEventOccupancy } from "@/lib/event";
import {
  eventOccupancySchema,
  eventOccupancySchemaType,
} from "@/schema/event-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2, IconPencil, IconUsers } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface EventOccupancyFormProps {
  initialData: {
    occupancy: number | undefined;
  };
  eventId: string;
}

const EventOccupancyForm = ({
  initialData,
  eventId,
}: EventOccupancyFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<eventOccupancySchemaType>({
    resolver: zodResolver(eventOccupancySchema),
    defaultValues: {
      occupancy: initialData.occupancy ?? 0,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    form.reset({
      occupancy: initialData.occupancy ?? 0,
    });
  }, [initialData.occupancy, form]);

  const onSubmit = async (values: eventOccupancySchemaType) => {
    try {
      const response = await updateEventOccupancy({
        id: eventId,
        values,
      });

      if (response?.status === "success") {
        toast.success("Occupancy updated successfully!");
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
        <span className="flex items-center gap-2 text-lg">
          <IconUsers className="h-5 w-5 text-slate-500" />
          Occupancy
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

        {/* Dialog Window Container */}
        <Modal
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title="Edit max occupancy"
          description="Set the maximum number of attendees permitted for this event."
        >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FieldGroup>
              <Controller
                control={form.control}
                name="occupancy"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-foreground text-base"
                    >
                      Capacity / Seats
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      min={0}
                      step={1}
                      {...field}
                      value={field.value ?? 0}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      className="placeholder:text-sm md:text-sm"
                      placeholder="e.g. 50"
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

      {/* Main card view */}
      <p className="mt-2 text-slate-700 dark:text-slate-300">
        {isPending ? (
          <IconLoader2 className="h-4 w-4 animate-spin" />
        ) : initialData.occupancy !== undefined ? (
          `${initialData.occupancy} seats`
        ) : (
          "No capacity set"
        )}
      </p>
    </div>
  );
};

export default EventOccupancyForm;
