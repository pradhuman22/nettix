import React from "react";
import HeaderWrapper from "./header-wrapper";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { mainMenus } from "@/constant";
import { Button } from "../ui/button";

const Header = async () => {
  const { isLoggedIn, user } = {
    isLoggedIn: false,
    user: {
      name: "Shrestha Pradhuman",
      email: "shresthapradhuman2020@gmail.com",
    },
  };
  return (
    <HeaderWrapper>
      <div className="flex h-20 items-center justify-between gap-4 px-4">
        {/* logo section */}
        <Link href={"/"}>
          <Image
            src={"/logo.png"}
            alt="nettix"
            height={40}
            width={40}
            priority
            aria-label="nettix"
            quality={75}
            className="h-10 w-10 object-contain"
          />
        </Link>
        {/* navigation section */}
        <nav className="flex w-full max-w-[calc(50vw+435px)] items-center justify-between">
          {/* right navigation section */}
          <div>
            <ul
              className={cn("flex items-center gap-3 md:gap-6", {
                hidden: !isLoggedIn,
              })}
            >
              {mainMenus.map((menu, idx) => (
                <li key={idx}>
                  <Link
                    href={menu.path}
                    className="hover:text-primary flex items-center gap-1 text-base font-medium"
                  >
                    <menu.Icon className="size-5 md:size-4" />
                    <span className="sr-only md:not-sr-only">{menu.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* left navigation section */}
          <div className="flex items-center">
            <Link
              href={"/create"}
              className={cn("hover:text-primary mr-4 text-base font-medium", {
                hidden: !isLoggedIn,
              })}
            >
              Create Events
            </Link>
            <Link
              href={"/events"}
              className={cn("hover:text-primary mr-4 text-lg font-medium", {
                hidden: isLoggedIn,
              })}
            >
              Discover Events
            </Link>
            <Button
              className={cn("px-2.5 text-base font-medium capitalize", {
                hidden: isLoggedIn,
              })}
            >
              <Link href={"/signin"}>Sign In</Link>
            </Button>
          </div>
        </nav>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
