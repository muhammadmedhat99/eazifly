import "@/styles/globals.css";
import { Metadata } from "next";

import { Providers } from "./providers";
import { ibmPlexSansArabic } from "./fonts";
import { cn } from "@heroui/react";

export const metadata: Metadata = {
  title: {
    default: "Eazifly",
    template: `%s - Eazifly`,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head />
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          ibmPlexSansArabic.className
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
