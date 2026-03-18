"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HiArrowLeft, HiLink, HiUpload, HiPlay, HiArrowsExpand } from "react-icons/hi";
import Script from "next/script";
import { useDesktop } from "../DesktopContext";

interface FlashGame {
  id: string;
  title: string;
  url: string;
  color: string;
}

type View = "library" | "player" | "loader";

export default function FlashPlayerApp() {
  const { isMobile } = useDesktop();
  const [view, setView] = useState<View>("library");
  const [bundledGames, setBundledGames] = useState<FlashGame[]>([]);
  const [activeGame, setActiveGame] = useState<{ title: string; url: string } | null>(null);
  const [ruffleReady, setRuffleReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLElement | null>(null);

  // Fetch game manifest from /flash/index.json (generated at build time)
  // Use basePath to support deployments under a subpath (e.g. /neoPortfolio)
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    fetch(`${base}/flash/index.json`)
      .then((r) => r.json())
      .then((data: FlashGame[]) =>
        setBundledGames(data.map((g) => ({ ...g, url: `${base}${g.url}` })))
      )
      .catch(() => {}); // no manifest = no bundled games
  }, []);

  // Check if Ruffle is already loaded
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).RufflePlayer?.newest) {
      setRuffleReady(true);
    }
  }, []);

  const cleanupPlayer = useCallback(() => {
    if (playerRef.current) {
      try { playerRef.current.remove(); } catch {}
      playerRef.current = null;
    }
  }, []);

  const loadSwf = useCallback((url: string, title: string) => {
    setError(null);
    setActiveGame({ title, url });
    setView("player");
  }, []);

  // Initialize Ruffle player when entering player view
  useEffect(() => {
    if (view !== "player" || !activeGame || !ruffleReady || !containerRef.current) return;

    cleanupPlayer();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ruffle = (window as any).RufflePlayer?.newest?.();
    if (!ruffle) {
      setError("Ruffle failed to initialize");
      return;
    }

    const player = ruffle.createPlayer();
    player.style.width = "100%";
    player.style.height = "100%";
    containerRef.current.appendChild(player);
    playerRef.current = player;

    player.ruffle().load({
      url: activeGame.url,
      autoplay: "on",
      scale: "showAll",
      letterbox: "on",
      allowScriptAccess: false,
      quality: "high",
    }).catch(() => {
      setError("Failed to load SWF file. Check the URL or file.");
    });

    return () => cleanupPlayer();
  }, [view, activeGame, ruffleReady, cleanupPlayer]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    loadSwf(url, file.name.replace(/\.swf$/i, ""));
  }, [loadSwf]);

  const handleUrlLoad = useCallback(() => {
    const url = urlInput.trim();
    if (!url) return;
    const name = url.split("/").pop()?.replace(/\.swf$/i, "") || "Flash Game";
    loadSwf(url, name);
  }, [urlInput, loadSwf]);

  const goBack = useCallback(() => {
    cleanupPlayer();
    setActiveGame(null);
    setError(null);
    setView("library");
  }, [cleanupPlayer]);

  /* ── Player View ── */
  if (view === "player") {
    return (
      <div className="flex flex-col h-full bg-[#1a1a2e]">
        <Script
          src="https://unpkg.com/@ruffle-rs/ruffle"
          onLoad={() => setRuffleReady(true)}
          strategy="afterInteractive"
        />
        {/* Header */}
        <div className="shrink-0 flex items-center gap-2 px-3 py-2 bg-black/40 border-b border-white/5">
          <button onClick={goBack} className="flex items-center gap-1 text-white/60 hover:text-white/90 transition-colors">
            <HiArrowLeft className="text-sm" />
            <span className="text-xs">Back</span>
          </button>
          <span className="text-xs text-white/40 truncate flex-1">{activeGame?.title}</span>
          <button
            onClick={() => containerRef.current?.requestFullscreen?.().catch(() => {})}
            className="flex items-center gap-1 text-white/40 hover:text-white/80 transition-colors"
            title="Fullscreen"
          >
            <HiArrowsExpand className="text-sm" />
          </button>
        </div>

        {/* Player area */}
        <div ref={containerRef} className="flex-1 min-h-0 relative bg-black">
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
              <p className="text-red-400 text-sm">{error}</p>
              <button onClick={goBack} className="text-xs text-white/50 underline">Go back</button>
            </div>
          )}
          {!ruffleReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
              <div className="w-8 h-8 border-2 border-white/20 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-white/40 text-xs">Loading Ruffle...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Loader View ── */
  if (view === "loader") {
    return (
      <div className="flex flex-col h-full bg-[#1a1a2e]">
        <Script
          src="https://unpkg.com/@ruffle-rs/ruffle"
          onLoad={() => setRuffleReady(true)}
          strategy="afterInteractive"
        />
        {/* Header */}
        <div className="shrink-0 flex items-center gap-2 px-3 py-2 bg-black/40 border-b border-white/5">
          <button onClick={goBack} className="flex items-center gap-1 text-white/60 hover:text-white/90 transition-colors">
            <HiArrowLeft className="text-sm" />
            <span className="text-xs">Back</span>
          </button>
          <span className="text-xs text-white/40">Load Custom SWF</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
          {/* URL input */}
          <div className="w-full max-w-md space-y-2">
            <label className="text-xs text-white/50 font-medium flex items-center gap-1.5">
              <HiLink className="text-sm" /> Load from URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlLoad()}
                placeholder="https://example.com/game.swf"
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 outline-none focus:border-orange-500/50 transition-colors"
              />
              <button
                onClick={handleUrlLoad}
                disabled={!urlInput.trim()}
                className="px-4 py-2 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-medium hover:bg-orange-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Load
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-white/30">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* File upload */}
          <div className="w-full max-w-md">
            <label className="text-xs text-white/50 font-medium flex items-center gap-1.5 mb-2">
              <HiUpload className="text-sm" /> Upload .swf file
            </label>
            <label className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-white/10 hover:border-orange-500/30 cursor-pointer transition-colors">
              <HiUpload className="text-2xl text-white/20" />
              <span className="text-xs text-white/30">Click to select a .swf file</span>
              <input
                type="file"
                accept=".swf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    );
  }

  /* ── Library View (default) ── */
  return (
    <div className="flex flex-col h-full bg-[#1a1a2e]">
      <Script
        src="https://unpkg.com/@ruffle-rs/ruffle"
        onLoad={() => setRuffleReady(true)}
        strategy="afterInteractive"
      />

      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg font-bold text-white">Flash Player</h1>
          <div className="flex items-center gap-1">
            {!ruffleReady && (
              <div className="w-3 h-3 border border-white/20 border-t-orange-500 rounded-full animate-spin mr-1" />
            )}
            {ruffleReady && (
              <span className="text-[10px] text-green-400/60 mr-1">Ruffle ready</span>
            )}
          </div>
        </div>
        <p className="text-[11px] text-white/30">Play classic Flash games with Ruffle emulator</p>
      </div>

      <div className={`flex-1 min-h-0 overflow-y-auto px-4 py-3 ${isMobile ? "pb-6" : ""}`}>
        {/* Load custom SWF button */}
        <button
          onClick={() => setView("loader")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-colors mb-4"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0">
            <HiUpload className="text-white text-lg" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white/80">Load Custom SWF</p>
            <p className="text-[11px] text-white/30">From URL or file upload</p>
          </div>
        </button>

        {/* Game library */}
        {bundledGames.length > 0 ? (
          <>
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Game Library</h2>
            <div className={`grid gap-3 ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}>
              {bundledGames.map((game) => (
                <button
                  key={game.id}
                  onClick={() => loadSwf(game.url, game.title)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-colors"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                    <HiPlay className="text-white text-xl" />
                  </div>
                  <span className="text-xs text-white/60 text-center leading-tight">{game.title}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
              <HiPlay className="text-2xl text-white/10" />
            </div>
            <p className="text-sm text-white/30">No bundled games yet</p>
            <p className="text-[11px] text-white/15 text-center max-w-[200px]">
              Add .swf files to /public/flash/ and register them in the bundledGames array, or use the custom loader above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
