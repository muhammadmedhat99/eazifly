"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const queryClient = new QueryClient();
  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <ToastProvider
          placement="top-center"
          toastOffset={20}
          toastProps={{
            radius: "lg",
            variant: "solid",
            shouldShowTimeoutProgress: true,
            timeout: 2000,
            classNames: {
              closeButton:
                "opacity-100 absolute end-4 start-[unset] top-1/2 -translate-y-1/2",
            },
          }}
        />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
