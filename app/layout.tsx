import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Nettix | Your one-stop event ticketing platform.",
  description:
    "We simplify the ticketing process for event organizers and event-goers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full font-sans antialiased", inter.variable)}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1 grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
