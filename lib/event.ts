"use server";

import {
  createEventSchema,
  createEventSchemaType,
  eventCategorySchema,
  eventCategorySchemaType,
  eventDescriptionSchema,
  eventDescriptionSchemaType,
  eventImageSchema,
  eventImageSchemaType,
  eventOccupancySchemaType,
  eventPriceSchemaType,
  eventTitleSchema,
  eventTitleSchemaType,
  eventVenueSchema,
  eventVenueSchemaType,
} from "@/schema/event-schema";
import prisma from "./prisma";
import { getCurrentUser } from "./user";
import { revalidatePath } from "next/cache";
import { Event } from "@/generated/prisma/client";

export async function getListedEvent() {
  try {
    const { user } = await getCurrentUser();
    const listedEvents = await prisma.event.findMany({
      where: {
        instructorId: user?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return listedEvents;
  } catch (error) {
    console.log("[GET_EVENTS_ERROR]", error);
    return [];
  }
}

export async function getListedEventById(id: string) {
  try {
    const { user } = await getCurrentUser();
    const event = await prisma.event.findFirst({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
    if (event?.instructorId !== user?.id) {
      return null;
    }
    return event;
  } catch (error) {
    console.error("[GET_EVENTS_ERROR]", error);
    return null;
  }
}

export async function createEvent(values: createEventSchemaType): Promise<{
  status: "success" | "error";
  statusCode: number;
  message?: string;
  data?: Event;
}> {
  const { isLoggedIn, user } = await getCurrentUser();
  if (!isLoggedIn) {
    return {
      status: "error",
      statusCode: 401,
      message: "Unauthenticated user",
    };
  }
  try {
    const { data, success } = createEventSchema.safeParse(values);
    if (!success) {
      return {
        status: "error",
        statusCode: 422,
        message: "Invalid form data provided",
      };
    }
    const { title } = data;
    const event = await prisma.event.create({
      data: {
        title,
        instructorId: user?.id as string,
      },
    });
    return {
      status: "success",
      statusCode: 201,
      message: "Event created successfully.",
      data: event,
    };
  } catch (error) {
    console.error("Failed to create event:", error);
    return {
      status: "error",
      statusCode: 500,
      message: "An unexpected error occurred while creating the event",
    };
  }
}

export async function updateEventStatus({
  eventId,
  status,
}: {
  eventId: string;
  status: boolean;
}) {
  const { isLoggedIn } = await getCurrentUser();
  if (!isLoggedIn) {
    return {
      status: "error",
      statusCode: 401,
      message: "Unauthenticated user",
    };
  }
  try {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
      },
    });
    if (!event) {
      return {
        status: "error",
        statusCode: 400,
        message: "Event not found",
      };
    }
    const updateEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        isPublished: status,
      },
    });
    return {
      status: "success",
      statusCode: 201,
      message: "Event is published successfully.",
      data: updateEvent,
    };
  } catch (error) {
    console.error("[UPDATE_CHAPTER_PUBLISH_ERROR]:", error);
    return {
      status: "error",
      statusCode: 500,
      message: "An unexpected error occurred while publishing the event.",
    };
  }
}

export async function updateEventTitle({
  id,
  values,
}: {
  id: string;
  values: eventTitleSchemaType;
}) {
  const { isLoggedIn } = await getCurrentUser();

  if (!isLoggedIn) {
    return {
      status: "error",
      statusCode: 401,
      message: "Unauthenticated user",
    };
  }

  try {
    const parsed = eventTitleSchema.safeParse(values);
    if (!parsed.success) {
      return {
        status: "error",
        statusCode: 422,
        message: "Title has invalid data.",
      };
    }

    const { title } = parsed.data;

    const result = await prisma.event.update({
      where: { id },
      data: { title },
    });

    revalidatePath(`/manage/${id}`);

    return {
      status: "success",
      statusCode: 200,
      message: "Title has been successfully updated.",
      data: {
        title: result.title,
      },
    };
  } catch (error) {
    console.error("[UPDATE_EVENT_TITLE_ERROR]:", error);
    return {
      status: "error",
      statusCode: 500,
      message: "An unexpected error occurred while updating the title.",
    };
  }
}

export async function updateEventDescription({
  id,
  values,
}: {
  id: string;
  values: eventDescriptionSchemaType;
}) {
  const { isLoggedIn } = await getCurrentUser();
  if (!isLoggedIn) {
    return {
      status: "error",
      statusCode: 401,
      message: "Unauthenticated user",
    };
  }

  try {
    const parsed = eventDescriptionSchema.safeParse(values);
    if (!parsed.success) {
      return {
        status: "error",
        statusCode: 422,
        message: "Description has invalid data.",
      };
    }

    const result = await prisma.event.update({
      where: { id },
      data: { description: parsed.data.description },
    });

    revalidatePath(`/manage/${id}`);

    return {
      status: "success",
      statusCode: 200,
      message: "Description has been successfully updated.",
      data: result,
    };
  } catch (error) {
    console.error("[UPDATE_EVENT_DESCRIPTION_ERROR]:", error);
    return {
      status: "error",
      statusCode: 500,
      message: "An unexpected error occurred while updating the description.",
    };
  }
}

export async function updateEventImage({
  id,
  values,
}: {
  id: string;
  values: eventImageSchemaType;
}) {
  const { isLoggedIn } = await getCurrentUser();
  if (!isLoggedIn) {
    return {
      status: "error",
      statusCode: 401,
      message: "Unauthenticated user",
    };
  }
  try {
    const parsed = eventImageSchema.safeParse(values);
    if (!parsed.success) {
      return {
        status: "error",
        statusCode: 422,
        message: "Image url is invalid.",
      };
    }

    const imageValue = parsed.data.imageUrl ? parsed.data.imageUrl : null;

    const event = await prisma.event.update({
      where: { id },
      data: { imageUrl: imageValue },
    });

    revalidatePath(`/manage/${id}`);

    return {
      status: "success",
      statusCode: 200,
      message: imageValue
        ? "Event image has been successfully updated."
        : "Event image removed successfully.",
      data: event,
    };
  } catch (error) {
    console.error("[UPDATE_EVENT_IMAGE_ERROR]:", error);
    return {
      status: "error",
      statusCode: 500,
      message: "An unexpected error occurred while updating the image.",
    };
  }
}

export async function updateEventCategory({
  id,
  values,
}: {
  id: string;
  values: eventCategorySchemaType;
}) {
  const { isLoggedIn } = await getCurrentUser();
  if (!isLoggedIn) {
    return {
      status: "error",
      statusCode: 401,
      message: "Unauthenticated user",
    };
  }

  try {
    const parsed = eventCategorySchema.safeParse(values);
    if (!parsed.success) {
      return {
        status: "error",
        statusCode: 422,
        message: "Category identity data is invalid.",
      };
    }

    const result = await prisma.event.update({
      where: { id },
      data: { categoryId: parsed.data.categoryId },
    });

    revalidatePath(`/manage/${id}`);

    return {
      status: "success",
      statusCode: 200,
      message: "Event category has been successfully updated.",
      data: result,
    };
  } catch (error) {
    console.error("[UPDATE_EVENT_CATEGORY_ERROR]:", error);
    return {
      status: "error",
      statusCode: 500,
      message: "An unexpected error occurred while updating the category.",
    };
  }
}

export async function updateEventVenue({
  id,
  values,
}: {
  id: string;
  values: eventVenueSchemaType;
}) {
  const { isLoggedIn } = await getCurrentUser();
  if (!isLoggedIn) {
    return {
      status: "error",
      statusCode: 401,
      message: "Unauthenticated user",
    };
  }

  try {
    const parsed = eventVenueSchema.safeParse(values);
    if (!parsed.success) {
      return {
        status: "error",
        statusCode: 422,
        message: "Venue contains invalid data configurations.",
      };
    }

    const result = await prisma.event.update({
      where: { id },
      data: {
        venue: parsed.data.venue,
        latitude: parsed.data.latitude ?? null,
        longitude: parsed.data.longitude ?? null,
      },
    });

    revalidatePath(`/manage/${id}`);

    // Explicitly convert Decimal or null values into JS numbers / nulls
    const safeData = {
      ...result,
      latitude:
        result.latitude !== null && result.latitude !== undefined
          ? Number(result.latitude)
          : null,
      longitude:
        result.longitude !== null && result.longitude !== undefined
          ? Number(result.longitude)
          : null,
    };

    return {
      status: "success",
      statusCode: 200,
      message: "Venue has been successfully updated.",
      data: safeData,
    };
  } catch (error) {
    console.error("[UPDATE_EVENT_VENUE_ERROR]:", error);
    return {
      status: "error",
      statusCode: 500,
      message:
        "An unexpected error occurred while updating the venue coordinates.",
    };
  }
}

export async function updateEventSchedule({
  id,
  schedule,
}: {
  id: string;
  schedule: Date;
}) {
  try {
    await prisma.event.update({
      where: { id },
      data: { schedule },
    });

    return { status: "success", message: "Schedule updated successfully" };
  } catch (error) {
    console.error("[UPDATE_EVENT_SCHEDULE]", error);
    return { status: "error", message: "Something went wrong" };
  }
}

export async function updateEventOccupancy({
  id,
  values,
}: {
  id: string;
  values: eventOccupancySchemaType;
}) {
  try {
    await prisma.event.update({
      where: { id },
      data: {
        occupancy: values.occupancy,
      },
    });

    return { status: "success", message: "Occupancy updated successfully" };
  } catch (error) {
    console.error("[UPDATE_EVENT_OCCUPANCY]", error);
    return { status: "error", message: "Failed to update occupancy" };
  }
}

export async function updateEventPrice({
  id,
  values,
}: {
  id: string;
  values: eventPriceSchemaType;
}) {
  try {
    await prisma.event.update({
      where: { id },
      data: {
        price: values.price,
      },
    });

    return { status: "success", message: "Price updated successfully" };
  } catch (error) {
    console.error("[UPDATE_EVENT_PRICE]", error);
    return { status: "error", message: "Failed to update event price" };
  }
}
