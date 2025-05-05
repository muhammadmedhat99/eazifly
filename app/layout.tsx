import "@/styles/globals.css";
import { Providers } from "@/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="light">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
