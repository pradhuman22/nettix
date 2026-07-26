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
import { updateEventPrice } from "@/lib/event";
import { eventPriceSchema, eventPriceSchemaType } from "@/schema/event-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconCurrencyDollar,
  IconCurrencyYen,
  IconLoader2,
  IconPencil,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface EventPriceFormProps {
  initialData: {
    price: number | undefined;
  };
  eventId: string;
}

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return "No price set";
  if (price === 0) return "Free";
  return price.toString();
};

const EventPriceForm = ({ initialData, eventId }: EventPriceFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<eventPriceSchemaType>({
    resolver: zodResolver(eventPriceSchema),
    defaultValues: {
      price: initialData.price ?? 0,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    form.reset({
      price: initialData.price ?? 0,
    });
  }, [initialData.price, form]);

  const onSubmit = async (values: eventPriceSchemaType) => {
    try {
      const response = await updateEventPrice({
        id: eventId,
        values,
      });

      if (response?.status === "success") {
        toast.success("Event price updated successfully!");
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
          <IconCurrencyYen className="h-5 w-5 text-slate-500" />
          Price
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

        {/* Modal Window Container */}
        <Modal
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title="Edit event price"
          description="Set the ticket or entry price for this event. Enter 0 for free events."
        >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FieldGroup>
              <Controller
                control={form.control}
                name="price"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-foreground text-base"
                    >
                      Price (¥)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? 0 : parseFloat(val));
                      }}
                      className="placeholder:text-sm md:text-sm"
                      placeholder="e.g. 1000"
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

            <Field
              orientation={"horizontal"}
              className="flex justify-end gap-2 py-4"
            >
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

      {/* Card static preview */}
      <p className="mt-2 text-slate-700 dark:text-slate-300">
        {isPending ? (
          <IconLoader2 className="h-4 w-4 animate-spin" />
        ) : (
          formatPrice(initialData.price)
        )}
      </p>
    </div>
  );
};

export default EventPriceForm;
