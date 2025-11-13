"use client";

import { ReactNode, useEffect } from "react";
import { useTheme } from "next-themes";

interface ThemeHandlerProps {
  children: ReactNode;
}

export function ThemeHandler({ children }: ThemeHandlerProps) {
  const { theme, systemTheme } = useTheme();
  
  // Set the theme when this component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Ensure theme is applied
      document.documentElement.classList.add('dark'); // Placeholder - will be handled by next-themes
    }
  }, [theme, systemTheme]);

  return <>{children}</>;
}