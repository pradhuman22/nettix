"use client";
import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { eventImageSchema, eventImageSchemaType } from "@/schema/event-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import MediaUploader from "@/components/shared/media-uploader";
import { updateEventImage } from "@/lib/event";
import Image from "next/image";

interface EventImageFormProps {
  initialData: {
    imageKey: string | undefined;
  };
  eventId: string;
}

const EventImage = ({ initialData, eventId }: EventImageFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const form = useForm<eventImageSchemaType>({
    resolver: zodResolver(eventImageSchema),
    defaultValues: {
      imageUrl: initialData.imageKey,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    form.reset({ imageUrl: initialData.imageKey });
  }, [initialData.imageKey, form]);

  const onSubmit = async (values: eventImageSchemaType) => {
    try {
      const result = await updateEventImage({
        id: eventId,
        values: values,
      });
      if (result?.status === "success") {
        toast.success("Event title updated successfully");
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(result?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="mt-6 rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between font-medium text-slate-900 dark:text-slate-100">
        <span>Thumbnail</span>
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
          title="Edit course image"
          description="Make changes to your event image here. Click save when you're
                done."
        >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FieldGroup>
              <Controller
                control={form.control}
                name="imageUrl"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-foreground text-base"
                    >
                      Thumbnail
                    </FieldLabel>
                    <MediaUploader
                      onChange={field.onChange}
                      value={field.value}
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
      <div className="bg-muted relative mt-2 w-full overflow-hidden rounded-xl border p-2">
        <div className="relative h-64 w-full">
          {initialData.imageKey ? (
            <Image
              src={`${initialData.imageKey}`}
              alt="Preview"
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading={"eager"}
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              No Image
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventImage;
