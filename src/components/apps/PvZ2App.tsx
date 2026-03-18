"use client";

import { useEffect, useRef, useState } from "react";
import { HiArrowsExpand } from "react-icons/hi";
import { useDesktop } from "../DesktopContext";

export default function PvZ2App() {
  const { isMobile } = useDesktop();
  const [loaded, setLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <div className="w-10 h-10 border-3 border-white/20 border-t-green-500 rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading PvZ2 Gardendless...</p>
          {isMobile && <p className="text-white/30 text-xs">Landscape mode</p>}
        </div>
      )}
      {/* Fullscreen button — desktop only, hidden when already fullscreen */}
      {loaded && !isFullscreen && !isMobile && (
        <button
          onClick={() => containerRef.current?.requestFullscreen?.().catch(() => {})}
          className="absolute top-2 right-2 z-20 p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white/50 hover:text-white/90 transition-colors"
          title="Fullscreen"
        >
          <HiArrowsExpand className="text-base" />
        </button>
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
