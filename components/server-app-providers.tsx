import { ReactNode } from "react";
import { AppProviders } from "@/components/app-providers";

export function ServerAppProviders({ children }: { children: ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}