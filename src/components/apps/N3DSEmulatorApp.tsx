"use client";

import { HiPlay } from "react-icons/hi";

export default function N3DSEmulatorApp() {
  return (
    <div className="flex flex-col h-full bg-[#0a0f1a] items-center justify-center gap-4 px-6">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
        <HiPlay className="text-white text-3xl" />
      </div>
      <h2 className="text-xl font-bold text-white">3DS Emulator</h2>
      <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider">
        Coming Soon
      </span>
      <p className="text-sm text-white/40 text-center max-w-xs leading-relaxed">
        3DS emulation requires OpenGL 3.3+ which is not yet available in browsers.
        We&apos;re waiting for WebGPU support to make this possible.
      </p>
      <p className="text-[11px] text-white/20 text-center max-w-xs">
        In the meantime, try native emulators like Azahar, Lime3DS, or Panda3DS on your desktop.
      </p>
    </div>
  );
}
