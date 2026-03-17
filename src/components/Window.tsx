"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

export interface WindowHandle {
  toggleMaximize: () => void;
  isMaximized: () => boolean;
}

interface WindowProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
  isMinimized: boolean;
  zIndex: number;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { w: number; h: number };
  getDockTarget?: () => { x: number; y: number } | undefined;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximizeChange?: (maximized: boolean) => void;
}

const Window = forwardRef<WindowHandle, WindowProps>(function Window({
  title,
  icon,
  children,
  isActive,
  isMinimized,
  zIndex,
  defaultPosition,
  defaultSize,
  getDockTarget,
  onFocus,
  onClose,
  onMinimize,
  onMaximizeChange,
}, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(defaultPosition ?? { x: 100, y: 60 });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const preMaxPos = useRef(posRef.current);
  const [maximized, setMaximized] = useState(false);
  const [opened, setOpened] = useState(false);
  const wasMinimized = useRef(false);
  const animating = useRef(false);
  const minimizeData = useRef({ tx: 0, ty: 0 });
  const currentAnim = useRef<Animation | null>(null);
  const toggleMaximizeRef = useRef<(() => void) | null>(null);
  const w = defaultSize?.w ?? 600;
  const h = defaultSize?.h ?? 440;

  useImperativeHandle(ref, () => ({
    toggleMaximize: () => toggleMaximizeRef.current?.(),
    isMaximized: () => maximized,
  }), [maximized]);

  // Set initial layout via DOM before first paint (prevents flash)
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.left = `${posRef.current.x}px`;
    el.style.top = `${posRef.current.y}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.style.borderRadius = "10px";
  }, [w, h]);

  // Mark opened after windowOpen animation finishes
  useEffect(() => {
    const timer = setTimeout(() => setOpened(true), 350);
    return () => clearTimeout(timer);
  }, []);

  // Handle minimize / restore with genie-like curve animation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Cancel any running animation
    if (currentAnim.current) {
      currentAnim.current.cancel();
      currentAnim.current = null;
    }

    if (isMinimized && !wasMinimized.current) {
      // === MINIMIZE: macOS genie effect using clip-path for funnel shape ===
      animating.current = true;
      const target = getDockTarget?.();
      const rect = el.getBoundingClientRect();

      const dockX = target ? target.x : rect.left + rect.width / 2;
      const dockY = target ? target.y : window.innerHeight;
      const tx = dockX - (rect.left + rect.width / 2);
      const ty = dockY - rect.bottom;
      minimizeData.current = { tx, ty };

      el.style.transformOrigin = "bottom center";

      currentAnim.current = el.animate(
        [
          {
            transform: "translate(0px, 0px) scale(1, 1)",
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            opacity: 1,
          },
          {
            transform: `translate(${tx * 0.08}px, ${ty * 0.12}px) scale(0.95, 0.72)`,
            clipPath: "polygon(0% 0%, 100% 0%, 82% 100%, 18% 100%)",
            opacity: 1,
            offset: 0.2,
          },
          {
            transform: `translate(${tx * 0.3}px, ${ty * 0.35}px) scale(0.7, 0.42)`,
            clipPath: "polygon(5% 0%, 95% 0%, 68% 100%, 32% 100%)",
            opacity: 0.9,
            offset: 0.42,
          },
          {
            transform: `translate(${tx * 0.65}px, ${ty * 0.62}px) scale(0.35, 0.18)`,
            clipPath: "polygon(12% 0%, 88% 0%, 58% 100%, 42% 100%)",
            opacity: 0.6,
            offset: 0.65,
          },
          {
            transform: `translate(${tx * 0.88}px, ${ty * 0.84}px) scale(0.12, 0.06)`,
            clipPath: "polygon(25% 0%, 75% 0%, 54% 100%, 46% 100%)",
            opacity: 0.25,
            offset: 0.84,
          },
          {
            transform: `translate(${tx}px, ${ty}px) scale(0.02, 0.01)`,
            clipPath: "polygon(42% 0%, 58% 0%, 52% 100%, 48% 100%)",
            opacity: 0,
          },
        ],
        {
          duration: 520,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards",
        }
      );

      currentAnim.current.onfinish = () => {
        el.style.display = "none";
        currentAnim.current?.cancel();
        currentAnim.current = null;
        animating.current = false;
      };

      wasMinimized.current = true;
    } else if (!isMinimized && wasMinimized.current) {
      // === RESTORE: reverse genie from dock icon ===
      animating.current = true;
      el.style.display = "";
      el.style.transformOrigin = "bottom center";

      const { tx, ty } = minimizeData.current;

      currentAnim.current = el.animate(
        [
          {
            transform: `translate(${tx}px, ${ty}px) scale(0.02, 0.01)`,
            clipPath: "polygon(42% 0%, 58% 0%, 52% 100%, 48% 100%)",
            opacity: 0,
          },
          {
            transform: `translate(${tx * 0.5}px, ${ty * 0.5}px) scale(0.4, 0.3)`,
            clipPath: "polygon(10% 0%, 90% 0%, 62% 100%, 38% 100%)",
            opacity: 0.8,
            offset: 0.35,
          },
          {
            transform: `translate(${tx * 0.12}px, ${ty * 0.12}px) scale(0.85, 0.8)`,
            clipPath: "polygon(1% 0%, 99% 0%, 92% 100%, 8% 100%)",
            opacity: 1,
            offset: 0.7,
          },
          {
            transform: "translate(0px, 0px) scale(1, 1)",
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            opacity: 1,
          },
        ],
        {
          duration: 400,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        }
      );

      currentAnim.current.onfinish = () => {
        currentAnim.current?.cancel();
        currentAnim.current = null;
        animating.current = false;
      };

      wasMinimized.current = false;
    }
  }, [isMinimized, getDockTarget]);

  // Drag handlers on document level for smoothness
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      posRef.current = {
        x: e.clientX - dragOffset.current.x,
        y: Math.max(28, e.clientY - dragOffset.current.y),
      };
      const el = containerRef.current;
      if (el) {
        el.style.left = `${posRef.current.x}px`;
        el.style.top = `${posRef.current.y}px`;
      }
    };

    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "";
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, []);

  const handleTitleBarDown = useCallback(
    (e: React.PointerEvent) => {
      if (maximized || animating.current) return;
      if ((e.target as HTMLElement).closest("button")) return;
      onFocus();
      dragging.current = true;
      dragOffset.current = {
        x: e.clientX - posRef.current.x,
        y: e.clientY - posRef.current.y,
      };
      document.body.style.cursor = "grabbing";
    },
    [maximized, onFocus]
  );

  const toggleMaximize = useCallback(() => {
    const el = containerRef.current;
    if (!el || animating.current) return;
    if (maximized) {
      // Restore to windowed
      posRef.current = preMaxPos.current;
      el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      el.style.left = `${posRef.current.x}px`;
      el.style.top = `${posRef.current.y}px`;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.borderRadius = "10px";
      setMaximized(false);
      onMaximizeChange?.(false);
      setTimeout(() => {
        if (el) el.style.transition = "";
      }, 300);
    } else {
      // Go fullscreen
      preMaxPos.current = { ...posRef.current };
      el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      el.style.left = "0px";
      el.style.top = "25px";
      el.style.width = "100vw";
      el.style.height = "calc(100vh - 25px)";
      el.style.borderRadius = "0px";
      setMaximized(true);
      onMaximizeChange?.(true);
      setTimeout(() => {
        if (el) el.style.transition = "";
      }, 300);
    }
    onFocus();
  }, [maximized, w, h, onFocus]);

  toggleMaximizeRef.current = toggleMaximize;

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      toggleMaximize();
    },
    [toggleMaximize]
  );

  // Clamp on resize
  useEffect(() => {
    const onResize = () => {
      if (maximized) return;
      posRef.current = {
        x: Math.min(posRef.current.x, window.innerWidth - 100),
        y: Math.max(28, Math.min(posRef.current.y, window.innerHeight - 100)),
      };
      const el = containerRef.current;
      if (el) {
        el.style.left = `${posRef.current.x}px`;
        el.style.top = `${posRef.current.y}px`;
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [maximized]);

  return (
    <div
      ref={containerRef}
      className="absolute"
      style={{
        zIndex,
        ...(opened
          ? {}
          : {
              opacity: 0,
              animation:
                "windowOpen 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }),
      }}
      onPointerDown={onFocus}
    >
      <div
        className={`w-full h-full overflow-hidden flex flex-col transition-shadow duration-200 ${
          isActive
            ? "shadow-2xl shadow-black/60 ring-1 ring-white/10"
            : "shadow-xl shadow-black/30 ring-1 ring-white/5 opacity-[0.92]"
        }`}
        style={{
          background: "rgba(30, 41, 59, 0.78)",
          backdropFilter: "blur(60px) saturate(1.8)",
          WebkitBackdropFilter: "blur(60px) saturate(1.8)",
          borderRadius: "inherit",
        }}
      >
        {/* Title bar */}
        <div
          className={`flex items-center h-12 px-3 shrink-0 ${
            maximized ? "cursor-default" : "cursor-grab"
          }`}
          onPointerDown={handleTitleBarDown}
          onDoubleClick={handleDoubleClick}
          style={{ touchAction: "none" }}
        >
          {/* Traffic lights — ~20px center-to-center like macOS */}
          <div className="flex items-center group/tl">
            {/* Close - Red */}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="relative w-[20px] h-[28px] flex items-center justify-center group"
            >
              <span className={`w-[13px] h-[13px] rounded-full transition-colors flex items-center justify-center ${isActive ? "bg-[#ff5f57]" : "bg-white/15 group-hover/tl:bg-[#ff5f57]"}`}>
                <svg className="w-[7px] h-[7px] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 8 8" fill="none" stroke="rgba(80,0,0,0.8)" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" />
                </svg>
              </span>
            </button>
            {/* Minimize - Yellow */}
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="relative w-[20px] h-[28px] flex items-center justify-center group"
            >
              <span className={`w-[13px] h-[13px] rounded-full transition-colors flex items-center justify-center ${isActive ? "bg-[#febc2e]" : "bg-white/15 group-hover/tl:bg-[#febc2e]"}`}>
                <svg className="w-[7px] h-[7px] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 8 8" fill="none" stroke="rgba(80,50,0,0.8)" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M1 4h6" />
                </svg>
              </span>
            </button>
            {/* Fullscreen / Restore - Green */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
              className="relative w-[20px] h-[28px] flex items-center justify-center group"
            >
              <span className={`w-[13px] h-[13px] rounded-full transition-colors flex items-center justify-center ${isActive ? "bg-[#28c840]" : "bg-white/15 group-hover/tl:bg-[#28c840]"}`}>
                <svg className="w-[7px] h-[7px] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10" fill="none" stroke="rgba(0,60,0,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {maximized ? (
                    <>
                      <path d="M1 1l3 3M4 4V1.5M4 4H1.5" />
                      <path d="M9 9l-3-3M6 6v2.5M6 6h2.5" />
                    </>
                  ) : (
                    <>
                      <path d="M4 4L1 1M1 1v2.5M1 1h2.5" />
                      <path d="M6 6l3 3M9 9V6.5M9 9H6.5" />
                    </>
                  )}
                </svg>
              </span>
            </button>
          </div>

          {/* Title */}
          <div className="flex-1 flex items-center justify-center gap-2 -ml-20">
            <span className="text-sm opacity-60">{icon}</span>
            <span className="text-[13px] text-dark-300 font-medium truncate">
              {title}
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-white/[0.06]" />

        {/* Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
});

export default Window;
