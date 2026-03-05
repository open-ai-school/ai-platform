"use client";

import { ThemeProvider } from "./ThemeProvider";
import {
  GuestProfileContext,
  useGuestProfileState,
} from "@/hooks/useGuestProfile";

export function Providers({ children }: { children: React.ReactNode }) {
  const guestProfile = useGuestProfileState();

  return (
    <GuestProfileContext.Provider value={guestProfile}>
      <ThemeProvider>{children}</ThemeProvider>
    </GuestProfileContext.Provider>
  );
}
