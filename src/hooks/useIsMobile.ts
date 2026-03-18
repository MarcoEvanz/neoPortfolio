"use client";

import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Narrow viewport OR touch device with small screen (covers landscape phones)
    const narrow = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const touch = window.matchMedia("(pointer: coarse) and (max-height: 500px)");

    const update = () => setIsMobile(narrow.matches || touch.matches);
    update();

    narrow.addEventListener("change", update);
    touch.addEventListener("change", update);
    return () => {
      narrow.removeEventListener("change", update);
      touch.removeEventListener("change", update);
    };
  }, [breakpoint]);

  return isMobile;
}
