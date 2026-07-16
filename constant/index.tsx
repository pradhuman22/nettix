import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandYoutube,
  IconCalendarEvent,
  IconLayout2,
  IconSettings,
} from "@tabler/icons-react";

export const footerMenus = [
  { title: "Help", path: "/help" },
  { title: "Terms & Condition", path: "/terms" },
  { title: "Privacy", path: "/privacy" },
];

export const socialLinks = [
  { Icon: IconBrandYoutube, title: "youtube", path: "https://youtube.com" },
  {
    Icon: IconBrandInstagram,
    title: "instagram",
    path: "https://instagram.com",
  },
  { Icon: IconBrandGithub, title: "github", path: "https://github.com" },
];

export const userMenus = [
  {
    title: "Dashboard",
    url: "/dashboard",
    Icon: IconLayout2,
    role: ["admin", "user"],
  },
  {
    title: "Settings",
    url: "/settings",
    Icon: IconSettings,
    role: ["admin", "user"],
  },
];

export const mainMenus = [
  { title: "Dashboard", path: "/dashboard", Icon: IconLayout2 },
  { title: "Events", path: "/events", Icon: IconCalendarEvent },
];
