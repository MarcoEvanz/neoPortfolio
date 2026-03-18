"use client";

import { createContext, useContext } from "react";

interface DesktopActions {
  openApp: (id: string) => void;
  installApp: (id: string) => void;
  closeAllApps: () => void;
  installedApps: string[];
  isMobile: boolean;
}

export const DesktopContext = createContext<DesktopActions>({
  openApp: () => {},
  installApp: () => {},
  closeAllApps: () => {},
  installedApps: [],
  isMobile: false,
});

export function useDesktop() {
  return useContext(DesktopContext);
}
