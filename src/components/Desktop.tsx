"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { HiUser, HiCode, HiTerminal, HiMail, HiCube } from "react-icons/hi";
import Window from "./Window";
import AboutApp from "./apps/AboutApp";
import ProjectsApp from "./apps/ProjectsApp";
import SkillsApp from "./apps/SkillsApp";
import TerminalApp from "./apps/TerminalApp";
import ContactApp from "./apps/ContactApp";

interface AppConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  component: React.ReactNode;
  defaultPos: { x: number; y: number };
  defaultSize: { w: number; h: number };
}

const apps: AppConfig[] = [
  {
    id: "about",
    title: "About Me",
    icon: <HiUser />,
    iconBg: "from-blue-500 to-cyan-500",
    component: <AboutApp />,
    defaultPos: { x: 80, y: 60 },
    defaultSize: { w: 520, h: 540 },
  },
  {
    id: "projects",
    title: "Projects",
    icon: <HiCode />,
    iconBg: "from-purple-500 to-pink-500",
    component: <ProjectsApp />,
    defaultPos: { x: 160, y: 80 },
    defaultSize: { w: 700, h: 480 },
  },
  {
    id: "skills",
    title: "Activity Monitor",
    icon: <HiCube />,
    iconBg: "from-emerald-500 to-green-500",
    component: <SkillsApp />,
    defaultPos: { x: 240, y: 100 },
    defaultSize: { w: 620, h: 520 },
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: <HiTerminal />,
    iconBg: "from-gray-600 to-gray-800",
    component: <TerminalApp />,
    defaultPos: { x: 320, y: 120 },
    defaultSize: { w: 600, h: 400 },
  },
  {
    id: "contact",
    title: "Contact",
    icon: <HiMail />,
    iconBg: "from-orange-500 to-red-500",
    component: <ContactApp />,
    defaultPos: { x: 200, y: 90 },
    defaultSize: { w: 420, h: 520 },
  },
];

function BootScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-dark-900 flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
          <span className="text-3xl font-bold text-white">D</span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white font-medium mb-6"
      >
        PortfolioOS
      </motion.p>

      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full animate-progress" />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1 }}
        className="mt-4 text-xs text-dark-500 font-mono"
      >
        Loading desktop environment...
      </motion.p>
    </motion.div>
  );
}

function TopBar({ activeAppTitle }: { activeAppTitle: string | null }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[25px] z-[60] flex items-center px-4 text-[13px]"
      style={{
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(50px) saturate(1.8)",
        WebkitBackdropFilter: "blur(50px) saturate(1.8)",
      }}
    >
      {/* Left: Apple logo + app name + menu */}
      <div className="flex items-center gap-4">
        <svg
          className="w-[14px] h-[17px] text-white/90"
          viewBox="0 0 384 512"
          fill="currentColor"
        >
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-62.1 24-72.5-24 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
        </svg>
        <span className="font-semibold text-white/90 text-[13px]">
          {activeAppTitle ?? "Finder"}
        </span>
        <span className="text-white/40 text-[13px]">File</span>
        <span className="text-white/40 text-[13px]">Edit</span>
        <span className="text-white/40 text-[13px]">View</span>
        <span className="text-white/40 text-[13px]">Window</span>
        <span className="text-white/40 text-[13px]">Help</span>
      </div>

      <div className="flex-1" />

      {/* Right: Status icons + date + time */}
      <div className="flex items-center gap-3 text-white/70 text-[12px]">
        {/* Battery */}
        <div className="flex items-center gap-1">
          <span className="text-[11px]">100%</span>
          <svg className="w-[22px] h-[11px]" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" strokeWidth="1" />
            <rect x="22" y="3.5" width="2" height="5" rx="1" fill="currentColor" opacity="0.4" />
            <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" opacity="0.5" />
          </svg>
        </div>
        {/* WiFi */}
        <svg className="w-[15px] h-[11px]" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" opacity="0.9" />
          <path d="M4.6 8.6a.75.75 0 011.05-.04 3.4 3.4 0 014.7 0 .75.75 0 11-1.01 1.1 1.9 1.9 0 00-2.68 0 .75.75 0 01-1.06-.05z" opacity="0.7" />
          <path d="M2.1 5.7a.75.75 0 011.06-.03 6.2 6.2 0 019.68 0 .75.75 0 11-1.03 1.09 4.7 4.7 0 00-7.62 0A.75.75 0 012.1 5.7z" opacity="0.5" />
          <path d="M0 3.1a.75.75 0 011.01-.04 9.5 9.5 0 0113.98 0 .75.75 0 01-1.01 1.08 8 8 0 00-11.96 0A.75.75 0 010 3.1z" opacity="0.4" />
        </svg>
        {/* Search / Spotlight */}
        <svg className="w-[13px] h-[13px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3.5 3.5" />
        </svg>
        {/* Control Center */}
        <svg className="w-[14px] h-[14px]" viewBox="0 0 16 16" fill="currentColor" opacity="0.8">
          <rect x="1" y="1" width="6" height="6" rx="1.5" />
          <rect x="9" y="1" width="6" height="6" rx="1.5" opacity="0.5" />
          <rect x="1" y="9" width="6" height="6" rx="1.5" opacity="0.5" />
          <rect x="9" y="9" width="6" height="6" rx="1.5" />
        </svg>
        <div className="w-px h-3 bg-white/20" />
        <span>{date}</span>
        <span className="font-medium">{time}</span>
      </div>
    </div>
  );
}

/* ─── Dock icon with magnification ─── */
function DockIcon({
  app,
  isOpen,
  mouseX,
  onClick,
  setRef,
}: {
  app: AppConfig;
  isOpen: boolean;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  onClick: () => void;
  setRef: (el: HTMLButtonElement | null) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    if (val === -1 || !ref.current) return 200;
    const rect = ref.current.getBoundingClientRect();
    return Math.abs(val - (rect.left + rect.width / 2));
  });

  const iconSize = useTransform(distance, [0, 80, 160], [64, 52, 48]);
  const y = useTransform(distance, [0, 80, 160], [-14, -4, 0]);

  return (
    <motion.button
      ref={(el) => {
        ref.current = el;
        setRef(el);
      }}
      onClick={onClick}
      className="group relative flex flex-col items-center"
      style={{ width: iconSize, height: iconSize, y }}
      whileTap={{ scale: 0.88 }}
    >
      <motion.div
        className={`w-full h-full rounded-[13px] bg-gradient-to-br ${app.iconBg} flex items-center justify-center text-white text-xl`}
        style={{
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        {app.icon}
      </motion.div>
      {/* Open indicator dot */}
      {isOpen && (
        <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-white/70" />
      )}
      {/* Tooltip */}
      <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div
          className="px-3 py-1 rounded-md text-[11px] text-white font-medium whitespace-nowrap"
          style={{
            background: "rgba(30,30,30,0.9)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {app.title}
        </div>
      </div>
    </motion.button>
  );
}

function Dock({
  apps: appList,
  openWindows,
  onOpen,
  onFocus,
  dockRefs,
}: {
  apps: AppConfig[];
  openWindows: string[];
  onOpen: (id: string) => void;
  onFocus: (id: string) => void;
  dockRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
}) {
  const mouseX = useMotionValue(-1);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" as const }}
      className="fixed bottom-1.5 left-1/2 -translate-x-1/2 z-[60]"
    >
      <div
        className="flex items-end gap-1 px-2 pb-1.5 pt-1 rounded-2xl"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(-1)}
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(50px) saturate(1.5)",
          WebkitBackdropFilter: "blur(50px) saturate(1.5)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 0 0 0.5px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {appList.map((app) => {
          const isOpen = openWindows.includes(app.id);
          return (
            <DockIcon
              key={app.id}
              app={app}
              isOpen={isOpen}
              mouseX={mouseX}
              onClick={() => (isOpen ? onFocus(app.id) : onOpen(app.id))}
              setRef={(el) => {
                dockRefs.current[app.id] = el;
              }}
            />
          );
        })}

        {/* Separator */}
        <div className="w-px h-8 bg-white/10 mx-1.5 self-center" />

        {/* Trash */}
        <motion.div
          className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-dark-600 to-dark-700 flex items-center justify-center text-dark-400 text-lg"
          style={{
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
          whileHover={{ y: -8, scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          🗑️
        </motion.div>
      </div>
    </motion.div>
  );
}

function DesktopIcons({
  apps: appList,
  onOpen,
}: {
  apps: AppConfig[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="absolute top-10 right-5 flex flex-col gap-1 z-10">
      {appList.map((app, i) => (
        <motion.button
          key={app.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.08 }}
          onDoubleClick={() => onOpen(app.id)}
          className="group flex flex-col items-center gap-1 w-[76px] py-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <div
            className={`w-14 h-14 rounded-[14px] bg-gradient-to-br ${app.iconBg} flex items-center justify-center text-white text-2xl`}
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {app.icon}
          </div>
          <span className="text-[11px] text-white text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {app.title}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

export default function Desktop() {
  const [booted, setBooted] = useState(false);
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [minimized, setMinimized] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [zCounter, setZCounter] = useState(10);
  const [zMap, setZMap] = useState<Record<string, number>>({});
  const dockRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Get dock icon center position for a given app (called at minimize time)
  const getDockTarget = useCallback((id: string) => {
    const el = dockRefs.current[id];
    if (!el) return undefined;
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }, []);

  const focusApp = useCallback(
    (id: string) => {
      const next = zCounter + 1;
      setZCounter(next);
      setZMap((prev) => ({ ...prev, [id]: next }));
      setActiveWindow(id);
      setMinimized((prev) => prev.filter((w) => w !== id));
    },
    [zCounter]
  );

  const openApp = useCallback(
    (id: string) => {
      if (openWindows.includes(id)) {
        setMinimized((prev) => prev.filter((w) => w !== id));
        focusApp(id);
        return;
      }
      setOpenWindows((prev) => [...prev, id]);
      setMinimized((prev) => prev.filter((w) => w !== id));
      const next = zCounter + 1;
      setZCounter(next);
      setZMap((prev) => ({ ...prev, [id]: next }));
      setActiveWindow(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openWindows, zCounter]
  );

  const closeApp = useCallback((id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w !== id));
    setMinimized((prev) => prev.filter((w) => w !== id));
    setActiveWindow((prev) => (prev === id ? null : prev));
  }, []);

  const minimizeApp = useCallback((id: string) => {
    setMinimized((prev) => [...prev, id]);
    setActiveWindow((prev) => (prev === id ? null : prev));
  }, []);

  // Auto-open About on first boot
  useEffect(() => {
    if (booted && openWindows.length === 0) {
      const timer = setTimeout(() => openApp("about"), 400);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted]);

  const activeTitle =
    activeWindow
      ? apps.find((a) => a.id === activeWindow)?.title ?? null
      : null;

  return (
    <div className="fixed inset-0 overflow-hidden">
      <AnimatePresence>
        {!booted && <BootScreen onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      {booted && (
        <>
          {/* Wallpaper - macOS Sonoma inspired */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 25% 0%, rgba(59, 130, 246, 0.18) 0%, transparent 60%), radial-gradient(ellipse at 75% 100%, rgba(139, 92, 246, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 40%, rgba(6, 182, 212, 0.06) 0%, transparent 60%), linear-gradient(to bottom, #0c1222 0%, #020617 100%)",
            }}
          />

          <TopBar activeAppTitle={activeTitle} />

          <DesktopIcons apps={apps} onOpen={openApp} />

          {/* Watermark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute top-1/3 left-12 z-0 pointer-events-none"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white/[0.04] leading-tight">
              My
              <br />
              Portfolio
            </h1>
            <p className="text-white/[0.08] text-sm mt-3 max-w-xs">
              Double-click icons or use the dock to explore.
            </p>
          </motion.div>

          {/* Windows — always rendered (minimized ones hidden via display:none) */}
          {openWindows.map((id) => {
            const app = apps.find((a) => a.id === id);
            if (!app) return null;
            return (
              <Window
                key={id}
                id={id}
                title={app.title}
                icon={app.icon}
                isActive={activeWindow === id}
                isMinimized={minimized.includes(id)}
                zIndex={zMap[id] ?? 10}
                defaultPosition={app.defaultPos}
                defaultSize={app.defaultSize}
                getDockTarget={() => getDockTarget(id)}
                onFocus={() => focusApp(id)}
                onClose={() => closeApp(id)}
                onMinimize={() => minimizeApp(id)}
              >
                {app.component}
              </Window>
            );
          })}

          <Dock
            apps={apps}
            openWindows={openWindows}
            onOpen={openApp}
            onFocus={focusApp}
            dockRefs={dockRefs}
          />
        </>
      )}
    </div>
  );
}
