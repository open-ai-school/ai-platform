"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@open-ai-school/ai-ui-library";
import {
  GuestProfileContext,
  useGuestProfileState,
} from "@/hooks/useGuestProfile";

export function Providers({ children }: { children: React.ReactNode }) {
  const guestProfile = useGuestProfileState();

  return (
    <SessionProvider>
      <GuestProfileContext.Provider value={guestProfile}>
        <ThemeProvider>{children}</ThemeProvider>
      </GuestProfileContext.Provider>
    </SessionProvider>
  );
}
