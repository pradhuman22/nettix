import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { ThemeProvider } from "@/providers/theme-providers";
import { Toaster } from "sonner";

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
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute={"class"}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1 grow">{children}</main>
          <Footer />
          <Toaster
            toastOptions={{
              classNames: {
                error: "!bg-red-100 !text-red-600 !border-red-200",
                success: "!bg-green-100 !text-green-600 !border-green-200",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
