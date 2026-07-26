import { z } from "zod";

export const createEventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(255, "Title is too long"),
});

export const eventTitleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, {
      message: "Title is required.",
    })
    .min(3, { message: "Title must be atleast 3 characters or more." })
    .max(255, { message: "Title must be less than 255 characters." }),
});

export const eventDescriptionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, {
      message: "Description is required.",
    })
    .min(20, { message: "Description must be atleast 20 characters or more." })
    .max(1500, { message: "Description must be less than 2500 characters." }),
});

export const eventImageSchema = z.object({
  imageUrl: z.string().trim().min(1, "Image key is required."),
});

export const eventCategorySchema = z.object({
  categoryId: z.string().trim().min(1, "Category is required."),
});

export const eventVenueSchema = z.object({
  venue: z
    .string()
    .min(3, { message: "Venue must be at least 3 characters long" })
    .max(500, { message: "Address is too long" }),
  latitude: z
    .number()
    .min(-90, { message: "Latitude must be between -90 and 90" })
    .max(90, { message: "Latitude must be between -90 and 90" })
    .optional(),
  longitude: z
    .number()
    .min(-180, { message: "Longitude must be between -180 and 180" })
    .max(180, { message: "Longitude must be between -180 and 180" })
    .optional(),
});

export const eventScheduleSchema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
});

export const eventOccupancySchema = z.object({
  occupancy: z
    .number({ message: "Occupancy must be a number" })
    .int("Occupancy must be a whole number")
    .min(0, "Occupancy cannot be negative"),
});

export const eventPriceSchema = z.object({
  price: z
    .number({ message: "Price must be a valid number" })
    .min(0, "Price cannot be negative"),
});

export type createEventSchemaType = z.infer<typeof createEventSchema>;
export type eventTitleSchemaType = z.infer<typeof eventTitleSchema>;
export type eventDescriptionSchemaType = z.infer<typeof eventDescriptionSchema>;
export type eventImageSchemaType = z.infer<typeof eventImageSchema>;
export type eventCategorySchemaType = z.infer<typeof eventCategorySchema>;
export type eventVenueSchemaType = z.infer<typeof eventVenueSchema>;
export type eventScheduleSchemaType = z.infer<typeof eventScheduleSchema>;
export type eventOccupancySchemaType = z.infer<typeof eventOccupancySchema>;
export type eventPriceSchemaType = z.infer<typeof eventPriceSchema>;
