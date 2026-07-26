"use client";

import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import {
  eventCategorySchema,
  eventCategorySchemaType,
} from "@/schema/event-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2, IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateEventCategory } from "@/lib/event";
import { Category } from "@/generated/prisma/client";

interface CategoryFormProps {
  initialData: {
    categoryId: string | undefined;
  };
  eventId: string;
  categories: Category[];
}

const EventCategoryForm = ({
  initialData,
  eventId,
  categories,
}: CategoryFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<eventCategorySchemaType>({
    resolver: zodResolver(eventCategorySchema),
    defaultValues: {
      categoryId: initialData.categoryId,
    },
  });
  const { isSubmitting, isValid } = form.formState;
  useEffect(() => {
    form.reset({ categoryId: initialData.categoryId || "" });
  }, [initialData.categoryId, form]);
  const onSubmit = async (values: eventCategorySchemaType) => {
    try {
      const response = await updateEventCategory({
        id: eventId,
        values: values,
      });
      if (response?.status === "success") {
        toast.success("Event category updated successfully!");
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
  const getCategoryNameById = (id: string | undefined): string => {
    if (!id) return "No category selected";
    return categories.find((cat) => cat.id === id)?.name ?? "Unknown category";
  };
  return (
    <div className="mt-6 rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between font-medium text-slate-900 dark:text-slate-100">
        <span className="text-lg">Category</span>
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
              {/* category */}
              <Controller
                control={form.control}
                name="categoryId"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-foreground text-base"
                    >
                      Category
                    </FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={getCategoryNameById(field.value)}
                    >
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category, idx) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            className="text-sm"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
      <div className="mt-2">
        {isPending ? (
          <IconLoader2 className="h-4 w-4 animate-spin" />
        ) : initialData.categoryId ? (
          categories.find((c) => c.id == initialData.categoryId)?.name
        ) : (
          <span className="mt-4 flex">No description</span>
        )}
      </div>
    </div>
  );
};

export default EventCategoryForm;
