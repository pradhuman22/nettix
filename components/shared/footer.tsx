import Link from "next/link";
import { footerMenus, socialLinks } from "@/constant";

const Footer = () => {
  return (
    <footer className="mx-auto w-full max-w-4xl border-t py-4">
      <nav className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <ul className="flex items-center gap-6 text-base">
          {footerMenus.map((menu, idx) => (
            <li key={idx}>
              <Link href={menu.path}>{menu.title}</Link>
            </li>
          ))}
        </ul>
        <ul className="flex items-center gap-4">
          {socialLinks.map((social, idx) => (
            <li key={idx}>
              <Link
                href={social.path}
                rel="noopener noreferrer"
                target="_blank"
              >
                <social.Icon className="size-4 md:size-5" />
                <span className="sr-only">{social.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
