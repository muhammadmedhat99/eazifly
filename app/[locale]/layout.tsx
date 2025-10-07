import "@/styles/globals.css";
import { Metadata } from "next";

import { Providers } from "./providers";
import { cn } from "@heroui/react";
import { ibmPlexSansArabic } from "./fonts";

import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import NextTopLoader from "@kfarwell/nextjs-toploader";

export const metadata: Metadata = {
  title: {
    default: "Eazifly",
    template: `%s - Eazifly`,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

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
        <NextTopLoader
          color="#3B82F6"
          height={3}
          showSpinner={false}
        />
        <NextIntlClientProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
