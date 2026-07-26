"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Session } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { deleteCloudinaryImage, getCloudinarySignature } from "@/lib/upload";
import {
  updateAccountSchema,
  updateAccountSchemaType,
} from "@/schema/setting-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader, IconLoader2, IconUserCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdateAccountForm = ({ user }: { user: Session["user"] | null }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.image || "/user.svg"
  );
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<updateAccountSchemaType>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      image: user?.image || "",
      bio: user?.bio || "",
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const oldImageUrl = form.getValues("image") || user?.image;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setIsUploading(true);

    try {
      const { signature, timestamp, cloudName, apiKey, folder } =
        await getCloudinarySignature("user-profiles");
      // 3. Build the FormData payload for Cloudinary's API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp.toString());
      formData.append("api_key", apiKey || "");
      formData.append("folder", folder || "");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const data = await response.json();

      // 5. Update the form value with the permanent Cloudinary secure URL
      form.setValue("image", data.secure_url, { shouldValidate: true });
      setPreviewUrl(data.secure_url);
      toast.success("Image uploaded successfully");
      if (
        oldImageUrl &&
        !oldImageUrl.includes("/user.svg") &&
        !oldImageUrl.startsWith("blob:")
      ) {
        deleteCloudinaryImage(oldImageUrl).then((res) => {
          if (!res?.success)
            console.error("Old asset cleanup failed:", res?.message);
        });
      }
    } catch (error) {
      toast.error("Failed to upload image");
      setPreviewUrl(user?.image || "/user.svg");
      form.setValue("image", oldImageUrl || "");
    } finally {
      setIsUploading(false);
    }
  };
  const onSubmit = ({ image, name, bio }: updateAccountSchemaType) => {
    startTransition(async () => {
      await authClient.updateUser(
        {
          name,
          bio,
          image,
        },
        {
          onError: () => {
            toast.error("Failed to update profile");
          },
          onSuccess: () => {
            toast.success("Updated successfully");
            router.refresh();
          },
        }
      );
    });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col justify-between gap-20 md:flex-row">
        <div className="order-2 flex-3/4 space-y-4">
          <FieldGroup className="gap-6">
            {/* name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="name"
                    className="text-foreground text-base"
                  >
                    Name
                  </FieldLabel>
                  <Input
                    placeholder="Enter your name or nickname"
                    {...field}
                    className="px-2 text-lg placeholder:text-base"
                    disabled={pending}
                  />
                </Field>
              )}
            />
            {/* bio */}
            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="bio"
                    className="text-foreground text-base"
                  >
                    Bio
                  </FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="Write something that describes you."
                    className="h-40 px-2 text-lg placeholder:text-base"
                    disabled={pending}
                  />
                </Field>
              )}
            />
            <Field orientation={"horizontal"} className="mt-2">
              <Button
                type="submit"
                className={"cursor-pointer text-sm"}
                disabled={pending}
              >
                {pending ? (
                  <IconLoader className="animate-spin" />
                ) : (
                  <IconUserCheck className="size-4" />
                )}
                Save Changes
              </Button>
            </Field>
          </FieldGroup>
        </div>
        <div className="order-1 flex-1/4 md:order-2">
          <FieldGroup>
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="relative mx-auto flex max-w-40 cursor-pointer items-center justify-center rounded-full border"
                  >
                    {isUploading && (
                      <IconLoader2 className="absolute h-9 w-9 animate-spin" />
                    )}
                    <Avatar className={"h-40 w-40"}>
                      <AvatarImage
                        src={previewUrl || undefined}
                        alt={form.getValues("name")}
                        className={isUploading ? "opacity-50" : "opacity-100"}
                      />
                    </Avatar>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    hidden
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handleFileChange}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </div>
      </div>
    </form>
  );
};

export default UpdateAccountForm;
