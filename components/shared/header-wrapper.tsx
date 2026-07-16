"use client";
import { cn } from "@/lib/utils";
import { PropsWithChildren, useEffect, useState } from "react";

const HeaderWrapper = ({ children }: PropsWithChildren) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header
      className={cn(
        "bg-background sticky top-0 z-50 transition-all duration-150 ease-in-out",
        {
          "bg-background/95 border-b backdrop-blur-md": isScrolled,
        }
      )}
    >
      {children}
    </header>
  );
};

export default HeaderWrapper;
