"use client";

import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getCloudinarySignature, deleteCloudinaryImage } from "@/lib/upload"; // Adjust path to your server action
import { IconLoader, IconUpload, IconX } from "@tabler/icons-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface MediaUploaderProps {
  value?: string | null; // Stores Cloudinary secure_url
  onChange?: (value: string) => void;
  folder?: string; // Optional Cloudinary folder
}

const MediaUploader = ({
  value,
  onChange,
  folder = "uploads",
}: MediaUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const mediaUrl = value || null;

  // Helper to check file type
  const isVideo =
    mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i) || mediaUrl?.includes("/video/");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);

      try {
        // 1. Get signed signature & params from Server Action
        const { signature, timestamp, cloudName, apiKey } =
          await getCloudinarySignature(folder);

        if (!signature || !apiKey || !cloudName) {
          throw new Error("Missing Cloudinary configuration parameters.");
        }

        // 2. Prepare Form Data for Cloudinary direct upload
        const resourceType = file.type.startsWith("video/") ? "video" : "image";
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("folder", folder);

        // 3. Direct Signed Upload to Cloudinary API
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Upload failed");
        }

        onChange?.(data.secure_url);
        toast.success("Media uploaded successfully");
      } catch (error) {
        console.error("Upload Error:", error);
        toast.error("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, folder]
  );

  const removeMedia = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!mediaUrl) return;

    setIsDeleting(true);
    try {
      const res = await deleteCloudinaryImage(mediaUrl);

      if (res?.success) {
        onChange?.("");
        toast.success(res.message);
      } else {
        toast.error(res?.message || "Failed to remove media");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Error removing media");
    } finally {
      setIsDeleting(false);
    }
  };

  const rejectedFiles = (fileRejections: FileRejection[]) => {
    fileRejections.forEach((rejection) => {
      const { errors } = rejection;
      if (errors[0]?.code === "too-many-files") {
        toast.error("Too many files selected.");
      } else if (errors[0]?.code === "file-too-large") {
        toast.error("File size exceeds 10MB.");
      } else {
        toast.error(errors[0]?.message || "File rejected.");
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      "video/*": [".mp4", ".webm", ".mov"],
    },
    multiple: false,
    maxSize: MAX_FILE_SIZE,
    onDropRejected: rejectedFiles,
    disabled: isUploading || isDeleting || !!mediaUrl,
  });

  return (
    <Card className="border-none p-0 shadow-none ring-0">
      <CardContent className="px-0">
        <div
          {...getRootProps()}
          className={cn(
            "group relative flex min-h-65 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all",
            "hover:bg-accent/50 hover:border-primary/50",
            isDragActive && "border-primary bg-primary/5",
            mediaUrl && "border-muted-foreground/20 cursor-default border-solid"
          )}
        >
          <Input {...getInputProps()} />

          {/* EMPTY STATE */}
          {!mediaUrl && !isUploading && (
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-full transition-colors",
                  isDragActive ? "bg-primary/10" : "bg-muted"
                )}
              >
                <IconUpload
                  className={cn(
                    "h-8 w-8 transition-colors",
                    isDragActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>
              <div>
                <p className="text-primary mb-1 text-base font-medium">
                  {isDragActive
                    ? "Drop here to upload"
                    : "Click to browse files or drag into this area."}
                </p>
                <p className="text-muted-foreground text-xs tracking-wider">
                  (Image or Video up to 10MB)
                </p>
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {isUploading && (
            <div className="flex flex-col items-center justify-center p-8">
              <IconLoader className="text-primary mb-2 h-10 w-10 animate-spin" />
              <p className="text-primary animate-pulse text-sm font-medium">
                Uploading to Cloudinary...
              </p>
            </div>
          )}

          {/* PREVIEW STATE */}
          {mediaUrl && !isUploading && (
            <div className="bg-muted relative w-full overflow-hidden rounded-xl border p-2">
              <div className="relative h-64 w-full">
                {isVideo ? (
                  <video
                    src={mediaUrl}
                    className="h-full w-full rounded-lg object-contain"
                    controls
                    autoPlay={false}
                    muted
                    loop
                  />
                ) : (
                  <Image
                    src={mediaUrl}
                    alt="Preview"
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8 rounded-full shadow-lg"
                onClick={removeMedia}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <IconLoader className="h-4 w-4 animate-spin" />
                ) : (
                  <IconX className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaUploader;
