import "@/styles/globals.css";
import { Metadata } from "next";

import { Providers } from "./providers";
import { cn } from "@heroui/react";
import { ibmPlexSansArabic } from "./fonts";

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
    <html
      lang="ar"
      dir="rtl"
      className="light"
      style={{ colorScheme: "light" }}
    >
      <head />
      <body
        className={cn(
          "min-h-screen bg-background",
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
