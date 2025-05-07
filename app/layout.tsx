import "@/styles/globals.css";

import { Metadata } from "next";

import { Providers } from "./providers";

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
    <html suppressHydrationWarning lang="ar" dir="rtl">
      <head />
      <body className="min-h-screen bg-background antialiased">
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
