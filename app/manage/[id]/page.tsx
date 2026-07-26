import MainWrapper from "@/components/shared/main-wrapper";
import { getListedEventById } from "@/lib/event";
import prisma from "@/lib/prisma";
import {
  IconAlertTriangle,
  IconBrandDatabricks,
  IconCoinYen,
  IconLayout2,
} from "@tabler/icons-react";
import { notFound } from "next/navigation";
import React from "react";
import ChangeStatusButton from "../_components/change-status-button";
import EventTitleForm from "../_components/event-title-form";
import EventDescriptionForm from "../_components/event-description-form";
import EventCategory from "../_components/event-category-form";
import EventCategoryForm from "../_components/event-category-form";
import MediaUploader from "@/components/shared/media-uploader";
import EventImage from "../_components/event-image-form";
import EventVenue from "../_components/event-venue-form";
import EventScheduleForm from "../_components/event-schedule-form";
import EventOccupancyForm from "../_components/event-occupancy-form";
import EventPriceForm from "../_components/event-price-form";
import { cn } from "@/lib/utils";

const EventManagePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const event = await getListedEventById(id);
  if (!event) {
    return notFound();
  }
  const requiredFields = [
    event.title,
    event.description,
    event.price,
    event.imageUrl,
    event.categoryId,
    event.venue,
    event.schedule,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  const categories = await prisma.category.findMany();
  return (
    <MainWrapper>
      <div className="mt-2">
        <div className="mb-4 flex items-center justify-between">
          <div
            className={cn(
              "text-muted-foreground flex items-center gap-y-2 text-base"
            )}
          >
            <IconAlertTriangle
              className={cn("mr-1 size-4 text-red-600", {
                hidden: !event.isPublished,
              })}
            />
            {event.isPublished &&
              "This is event is unpublished. It will not be visible."}
            All complete fields {completionText}
          </div>
          <ChangeStatusButton
            disabled={!isComplete}
            eventId={id}
            isPublished={event.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconLayout2 className="h-5 w-5" />
              <h2 className="text-xl">Basic Information</h2>
            </div>
            {/* title */}
            <EventTitleForm
              initialData={{
                title: event.title,
              }}
              eventId={id}
            />
            {/* description */}
            <EventDescriptionForm
              initialData={{
                description: event.description ?? undefined,
              }}
              eventId={id}
            />
            {/* image */}
            <EventImage
              initialData={{
                imageKey: event.imageUrl ?? undefined,
              }}
              eventId={id}
            />
            {/* category */}
            <EventCategoryForm
              initialData={{
                categoryId: event.categoryId ?? undefined,
              }}
              eventId={id}
              categories={categories}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBrandDatabricks className="h-5 w-5" />
                <h2 className="text-xl">Releated Information</h2>
              </div>
              {/* event venue form */}
              <EventVenue
                venue={event.venue ?? undefined}
                longitude={event?.longitude ?? undefined}
                latitude={event?.latitude ?? undefined}
                eventId={id}
              />
              <EventScheduleForm
                initialData={{ schedule: event.schedule }}
                eventId={id}
              />
              <EventOccupancyForm
                initialData={{ occupancy: event.occupancy }}
                eventId={id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconCoinYen className="h-6 w-6" />
                <h2 className="text-xl">Sale your event</h2>
              </div>
              <EventPriceForm
                initialData={{ price: event.price }}
                eventId={id}
              />
            </div>
          </div>
        </div>
      </div>
    </MainWrapper>
  );
};

export default EventManagePage;
