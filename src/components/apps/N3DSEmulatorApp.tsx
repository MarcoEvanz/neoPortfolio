"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HiArrowLeft, HiLink, HiUpload, HiPlay, HiArrowsExpand } from "react-icons/hi";
import { useDesktop } from "../DesktopContext";

interface RomEntry {
  id: string;
  title: string;
  url: string;
  color: string;
}

type View = "library" | "player" | "loader";

export default function N3DSEmulatorApp() {
  const { isMobile } = useDesktop();
  const [view, setView] = useState<View>("library");
  const [bundledRoms, setBundledRoms] = useState<RomEntry[]>([]);
  const [activeRom, setActiveRom] = useState<{ title: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    fetch(`${base}/3ds/index.json`)
      .then((r) => r.json())
      .then((data: RomEntry[]) =>
        setBundledRoms(data.map((r) => ({ ...r, url: `${base}${r.url}` })))
      )
      .catch(() => {});
  }, []);

  const buildEmulatorHtml = useCallback((romUrl: string, gameName: string) => {
    return `<!DOCTYPE html>
<html><head>
<style>body{margin:0;overflow:hidden;background:#000}#game{width:100%;height:100vh}</style>
</head><body>
<div id="game"></div>
<script>
  EJS_player='#game';
  EJS_core='3ds';
  EJS_pathtodata='https://cdn.emulatorjs.org/stable/data/';
  EJS_gameUrl='${romUrl}';
  EJS_gameName='${gameName.replace(/'/g, "\\'")}';
  EJS_startOnLoaded=true;
  EJS_color='#e11d48';
  EJS_backgroundColor='#0a0f1a';
</script>
<script src="https://cdn.emulatorjs.org/stable/data/loader.js"><\/script>
</body></html>`;
  }, []);

  const loadRom = useCallback((url: string, title: string) => {
    setError(null);
    setActiveRom({ title, url });
    setView("player");
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    loadRom(url, file.name.replace(/\.[^.]+$/, ""));
  }, [loadRom]);

  const handleUrlLoad = useCallback(() => {
    const url = urlInput.trim();
    if (!url) return;
    const name = url.split("/").pop()?.replace(/\.[^.]+$/, "") || "3DS Game";
    loadRom(url, name);
  }, [urlInput, loadRom]);

  const goBack = useCallback(() => {
    setActiveRom(null);
    setError(null);
    setView("library");
  }, []);

  if (view === "player" && activeRom) {
    return (
      <div className="flex flex-col h-full bg-[#0a0f1a]">
        <div className="shrink-0 flex items-center gap-2 px-3 py-2 bg-black/40 border-b border-white/5">
          <button onClick={goBack} className="flex items-center gap-1 text-white/60 hover:text-white/90 transition-colors">
            <HiArrowLeft className="text-sm" />
            <span className="text-xs">Back</span>
          </button>
          <span className="text-xs text-white/40 truncate flex-1">{activeRom.title}</span>
          <button
            onClick={() => iframeRef.current?.requestFullscreen?.().catch(() => {})}
            className="flex items-center gap-1 text-white/40 hover:text-white/80 transition-colors"
            title="Fullscreen"
          >
            <HiArrowsExpand className="text-sm" />
          </button>
        </div>
        <div className="flex-1 min-h-0 relative bg-black">
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
              <p className="text-red-400 text-sm">{error}</p>
              <button onClick={goBack} className="text-xs text-white/50 underline">Go back</button>
            </div>
          )}
          <iframe
            ref={iframeRef}
            srcDoc={buildEmulatorHtml(activeRom.url, activeRom.title)}
            className="w-full h-full border-0"
            allow="autoplay; gamepad; fullscreen"
            title={activeRom.title}
          />
        </div>
      </div>
    );
  }

  if (view === "loader") {
    return (
      <div className="flex flex-col h-full bg-[#0a0f1a]">
        <div className="shrink-0 flex items-center gap-2 px-3 py-2 bg-black/40 border-b border-white/5">
          <button onClick={goBack} className="flex items-center gap-1 text-white/60 hover:text-white/90 transition-colors">
            <HiArrowLeft className="text-sm" />
            <span className="text-xs">Back</span>
          </button>
          <span className="text-xs text-white/40">Load Custom ROM</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
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
                placeholder="https://example.com/game.3ds"
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 outline-none focus:border-rose-500/50 transition-colors"
              />
              <button
                onClick={handleUrlLoad}
                disabled={!urlInput.trim()}
                className="px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-medium hover:bg-rose-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
          <div className="w-full max-w-md">
            <label className="text-xs text-white/50 font-medium flex items-center gap-1.5 mb-2">
              <HiUpload className="text-sm" /> Upload ROM file
            </label>
            <label className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-white/10 hover:border-rose-500/30 cursor-pointer transition-colors">
              <HiUpload className="text-2xl text-white/20" />
              <span className="text-xs text-white/30">Click to select a .3ds, .cci, or .zip file</span>
              <input
                type="file"
                accept=".3ds,.cci,.cxi,.zip,.7z"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0f1a]">
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-white/5">
        <h1 className="text-lg font-bold text-white mb-1">3DS Emulator</h1>
        <p className="text-[11px] text-white/30">Play Nintendo 3DS games with EmulatorJS</p>
      </div>
      <div className={`flex-1 min-h-0 overflow-y-auto px-4 py-3 ${isMobile ? "pb-6" : ""}`}>
        <button
          onClick={() => setView("loader")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-colors mb-4"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shrink-0">
            <HiUpload className="text-white text-lg" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white/80">Load Custom ROM</p>
            <p className="text-[11px] text-white/30">From URL or file upload</p>
          </div>
        </button>

        {bundledRoms.length > 0 ? (
          <>
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">ROM Library</h2>
            <div className={`grid gap-3 ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}>
              {bundledRoms.map((rom) => (
                <button
                  key={rom.id}
                  onClick={() => loadRom(rom.url, rom.title)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-colors"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${rom.color} flex items-center justify-center`}>
                    <HiPlay className="text-white text-xl" />
                  </div>
                  <span className="text-xs text-white/60 text-center leading-tight">{rom.title}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
              <HiPlay className="text-2xl text-white/10" />
            </div>
            <p className="text-sm text-white/30">No bundled ROMs yet</p>
            <p className="text-[11px] text-white/15 text-center max-w-[200px]">
              Add .3ds files to /public/3ds/ and restart, or use the custom loader above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
