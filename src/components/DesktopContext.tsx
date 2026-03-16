"use client";

import { createContext, useContext } from "react";

interface DesktopActions {
  openApp: (id: string) => void;
  installApp: (id: string) => void;
  installedApps: string[];
}

export const DesktopContext = createContext<DesktopActions>({
  openApp: () => {},
  installApp: () => {},
  installedApps: [],
});

export function useDesktop() {
  return useContext(DesktopContext);
}
