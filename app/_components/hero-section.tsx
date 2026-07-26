"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/shared/animate-on-scroll";

const HeroSection = () => {
  return (
    <section className="relative grid items-center gap-10 overflow-hidden py-12 md:grid-cols-2 xl:pt-24">
      {/* content section */}
      <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
        <h1 className="text-5xl leading-tight font-black uppercase md:text-6xl">
          Find <span className="text-primary font-extrabold">Event </span>{" "}
          Ticket Here!
        </h1>
        <p className="text-muted-foreground text-base">
          Discover and secure tickets for the best online events. Easily browse,
          purchase, and manage your event tickets all in one seamless platform
          for event-goers and organizers.
        </p>
        <Button className="mt-4 h-10 px-4" size={"lg"}>
          <Link href={"/create"}>Create Your First Event</Link>
        </Button>
      </div>
      {/* image section */}
      <AnimateOnScroll>
        <div className="relative aspect-square w-auto md:h-105">
          <Image
            src={"/hero.png"}
            alt="hero"
            fill
            priority
            sizes="(min-width: 780px) 500px, calc(100vw - 24px)"
            className="object-cover"
          />
        </div>
      </AnimateOnScroll>
    </section>
  );
};

export default HeroSection;
