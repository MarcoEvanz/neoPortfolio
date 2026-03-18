"use client";

import { useState } from "react";
import { useDesktop } from "../DesktopContext";

export default function PvZ2App() {
  const { isMobile } = useDesktop();
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full bg-black">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <div className="w-10 h-10 border-3 border-white/20 border-t-green-500 rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading PvZ2 Gardendless...</p>
          {isMobile && <p className="text-white/30 text-xs">Landscape mode</p>}
        </div>
      )}
      <iframe
        src="https://marcoevanz.github.io/pvzge_web/"
        className="w-full h-full border-0"
        onLoad={() => setLoaded(true)}
        allow="autoplay; fullscreen; gamepad"
        title="PvZ2 Gardendless"
      />
    </div>
  );
}
