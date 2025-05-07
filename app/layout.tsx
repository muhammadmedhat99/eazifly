import "@/styles/globals.css";

import { Metadata } from "next";

import { Providers } from "./providers";
import clsx from "clsx";
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
    <html suppressHydrationWarning lang="ar" dir="rtl" className="light">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background antialiased",
          ibmPlexSansArabic.className
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
