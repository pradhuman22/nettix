"use server";

import { v2 as cloudinary } from "cloudinary";
import { success } from "zod";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getCloudinarySignature(folder: string) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: paramsToSign.folder,
  };
}

export async function deleteCloudinaryImage(url: string) {
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) {
    return null;
  }
  let startIndex = uploadIndex + 1;
  if (parts[startIndex] && parts[startIndex].startsWith("v")) {
    startIndex++;
  }
  const publicIdParts = parts.slice(startIndex);
  const lastPart = publicIdParts[publicIdParts.length - 1];
  const dotIndex = lastPart.lastIndexOf(".");
  if (dotIndex !== -1) {
    publicIdParts[publicIdParts.length - 1] = lastPart.substring(0, dotIndex);
  }
  const publicId = publicIdParts.join("/");
  try {
    const data = await cloudinary.uploader.destroy(publicId);
    console.log(data);
    if (data.result == "ok") {
      return { success: true, message: "Deleted Successfully" };
    } else if (data.result == "not found") {
      return { success: true, message: "Image not found" };
    } else {
      return { success: false, message: "Failed to delete image" };
    }
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
    return { success: false, message: "Failed to delete image." };
  }
}
