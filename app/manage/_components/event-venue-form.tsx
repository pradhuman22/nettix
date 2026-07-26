"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { eventVenueSchema, eventVenueSchemaType } from "@/schema/event-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IconPencil } from "@tabler/icons-react";
import { Modal } from "@/components/shared/modal";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { updateEventVenue } from "@/lib/event";
import { useRouter } from "next/navigation";

interface EventVenueProps {
  venue: string | undefined;
  longitude: number | undefined;
  latitude: number | undefined;
  eventId: string;
}

// Default center fallback (Tokyo, Japan)
const JAPAN_DEFAULT_CENTER = { lat: 35.6762, lng: 139.6503 };

declare global {
  interface Window {
    __googleMapsOptionsSet?: boolean;
  }
}

// 1. Initialize Google Maps loader ONCE at the module level
if (typeof window !== "undefined" && !window.__googleMapsOptionsSet) {
  setOptions({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    v: "weekly",
  });
  window.__googleMapsOptionsSet = true;
}

const EventVenue = ({
  venue: initialVenue,
  longitude: initialLng,
  latitude: initialLat,
  eventId,
}: EventVenueProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const googleMapInstanceRef = useRef<google.maps.Map | null>(null);
  const googleMarkerInstanceRef =
    useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const form = useForm<eventVenueSchemaType>({
    resolver: zodResolver(eventVenueSchema),
    defaultValues: {
      venue: initialVenue || "",
      longitude: initialLng,
      latitude: initialLat,
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { setValue, resetField, reset } = form;

  const watchedLat = useWatch({ control: form.control, name: "latitude" });
  const watchedLng = useWatch({ control: form.control, name: "longitude" });

  // 2. Synchronize form state immediately when server props refresh (router.refresh / revalidatePath)
  useLayoutEffect(() => {
    reset({
      venue: initialVenue || "",
      latitude: initialLat,
      longitude: initialLng,
    });
  }, [initialVenue, initialLat, initialLng, reset]);

  // 3. Render Map and update Marker dynamically
  useEffect(() => {
    if (!mapRef.current) return;

    const hasVenue =
      typeof watchedLat === "number" &&
      typeof watchedLng === "number" &&
      !isNaN(watchedLat) &&
      !isNaN(watchedLng);

    const centerPoint = hasVenue
      ? { lat: watchedLat, lng: watchedLng }
      : JAPAN_DEFAULT_CENTER;
    const zoomLevel = hasVenue ? 15 : 5;

    let isCancelled = false;

    importLibrary("maps")
      .then(async (library) => {
        if (isCancelled || !mapRef.current) return;

        const { Map } = library as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = (await importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;

        // Initialize Map canvas if missing, or update center
        if (!googleMapInstanceRef.current) {
          googleMapInstanceRef.current = new Map(mapRef.current, {
            center: centerPoint,
            zoom: zoomLevel,
            disableDefaultUI: true,
            zoomControl: true,
            mapId: "NETTIX_MAP_ID",
          });
        } else {
          googleMapInstanceRef.current.panTo(centerPoint);
          googleMapInstanceRef.current.setZoom(zoomLevel);
        }

        const mapInstance = googleMapInstanceRef.current;

        // Tear down old marker instance before attaching a new one
        if (googleMarkerInstanceRef.current) {
          googleMarkerInstanceRef.current.map = null;
          googleMarkerInstanceRef.current = null;
        }

        if (hasVenue) {
          googleMarkerInstanceRef.current = new AdvancedMarkerElement({
            position: centerPoint,
            map: mapInstance,
          });
        }
      })
      .catch((err) => console.error("Error loading Map view:", err));

    return () => {
      isCancelled = true;
    };
  }, [watchedLat, watchedLng]);

  // 4. Address Autocomplete bindings inside modal
  useEffect(() => {
    if (!isOpen) return;

    let autocomplete: google.maps.places.Autocomplete | null = null;

    importLibrary("places")
      .then((library) => {
        if (!inputRef.current) return;

        const { Autocomplete } = library as google.maps.PlacesLibrary;

        autocomplete = new Autocomplete(inputRef.current, {
          fields: ["formatted_address", "geometry", "name"],
          types: ["establishment", "geocode"],
          componentRestrictions: { country: "jp" },
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete?.getPlace();

          if (!place || !place.geometry || !place.geometry.location) {
            toast.error("No details available for the selected location.");
            return;
          }

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const venueAddress = place.formatted_address || place.name || "";

          setValue("venue", venueAddress, { shouldValidate: true });
          setValue("latitude", lat, { shouldValidate: true });
          setValue("longitude", lng, { shouldValidate: true });
        });
      })
      .catch((err) => {
        console.error("Error loading Google Places Autocomplete API:", err);
        toast.error("Failed to load address autocomplete library.");
      });

    return () => {
      if (autocomplete && typeof google !== "undefined") {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [isOpen, setValue]);

  // 5. Submit venue updates
  const onSubmit = async (values: eventVenueSchemaType) => {
    try {
      const response = await updateEventVenue({ id: eventId, values });
      if (response.status === "error" || !response.data) {
        toast.error(response.message);
        return;
      }

      // Commit new values immediately to form defaults
      reset({
        venue: response.data.venue || "",
        latitude: response.data.latitude ?? undefined,
        longitude: response.data.longitude ?? undefined,
      });

      router.refresh();
      toast.success("Venue successfully updated!");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while saving. Please try again.");
    }
  };

  const handleCancel = () => {
    reset({
      venue: initialVenue || "",
      latitude: initialLat,
      longitude: initialLng,
    });
    setIsOpen(false);
  };

  return (
    <div className="mt-4 rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-start justify-between font-medium">
        <div>
          <span className="block text-lg font-semibold">Event Venue</span>
          <span className="text-muted-foreground text-sm font-normal">
            {form.getValues("venue") || "No venue selected"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => setIsOpen(true)}
        >
          <IconPencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Real-time Embedded Map Canvas */}
      <div
        ref={mapRef}
        className="h-48 w-full overflow-hidden rounded-md border border-slate-300 bg-slate-200 dark:border-slate-700 dark:bg-slate-800"
      />

      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => (!open ? handleCancel() : setIsOpen(open))}
        title="Edit event venue"
        description="Make changes to your event venue here. Click save when you're done."
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <FieldGroup>
            <Controller
              control={form.control}
              name="venue"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-foreground text-base"
                  >
                    Event Venue
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      // Clear map coordinates if user types manually
                      resetField("latitude");
                      resetField("longitude");
                    }}
                    ref={(e) => {
                      field.ref(e);
                      inputRef.current = e;
                    }}
                    className="placeholder:text-sm md:text-sm"
                    placeholder="Search for your event venue..."
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

          <input type="hidden" {...form.register("latitude")} />
          <input type="hidden" {...form.register("longitude")} />

          <Field
            orientation={"horizontal"}
            className="flex justify-end gap-2 py-4"
          >
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
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
  );
};

export default EventVenue;
