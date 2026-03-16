"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { HiUser, HiCode, HiTerminal, HiMail, HiCube, HiShoppingCart } from "react-icons/hi";
import { IoGameController } from "react-icons/io5";
import Window, { type WindowHandle } from "./Window";
import { DesktopContext } from "./DesktopContext";
import AboutApp from "./apps/AboutApp";
import ProjectsApp from "./apps/ProjectsApp";
import SkillsApp from "./apps/SkillsApp";
import TerminalApp from "./apps/TerminalApp";
import ContactApp from "./apps/ContactApp";
import AppStoreApp from "./apps/AppStoreApp";
import FlappyBirdApp from "./apps/FlappyBirdApp";

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
  {
    id: "appstore",
    title: "App Store",
    icon: <HiShoppingCart />,
    iconBg: "from-[#1d8cf8] to-[#0070f3]",
    component: <AppStoreApp />,
    defaultPos: { x: 120, y: 50 },
    defaultSize: { w: 680, h: 500 },
  },
];

// Apps that can be downloaded from the App Store
const downloadableApps: AppConfig[] = [
  {
    id: "flappybird",
    title: "Flappy Bird",
    icon: <IoGameController />,
    iconBg: "from-yellow-400 to-orange-500",
    component: <FlappyBirdApp />,
    defaultPos: { x: 200, y: 60 },
    defaultSize: { w: 440, h: 600 },
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

/* ─── "About This Mac" modal ─── */
function AboutThisMac({ onClose }: { onClose: () => void }) {
  const [info, setInfo] = useState({
    os: "",
    browser: "",
    resolution: "",
    cores: "",
    memory: "",
    language: "",
    platform: "",
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    let os = "Unknown OS";
    if (ua.includes("Win")) os = ua.includes("Windows NT 10") ? "Windows 10/11" : "Windows";
    else if (ua.includes("Mac")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

    let browser = "Unknown Browser";
    if (ua.includes("Firefox/")) browser = `Firefox ${ua.split("Firefox/")[1]?.split(" ")[0]}`;
    else if (ua.includes("Edg/")) browser = `Edge ${ua.split("Edg/")[1]?.split(" ")[0]}`;
    else if (ua.includes("Chrome/")) browser = `Chrome ${ua.split("Chrome/")[1]?.split(" ")[0]}`;
    else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = `Safari ${ua.split("Version/")[1]?.split(" ")[0] ?? ""}`;

    setInfo({
      os: "PortfolioOS",
      browser,
      resolution: `${window.screen.width} x ${window.screen.height}`,
      cores: `${navigator.hardwareConcurrency ?? "Unknown"}`,
      memory: `${(navigator as unknown as Record<string, unknown>).deviceMemory ?? "Unknown"} GB`,
      language: navigator.language,
      platform: "pOS36",
    });
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        className="relative w-[340px] rounded-xl overflow-hidden"
        style={{
          background: "rgba(30,30,30,0.95)",
          backdropFilter: "blur(50px) saturate(1.5)",
          WebkitBackdropFilter: "blur(50px) saturate(1.5)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center pt-6 pb-4 px-6">
          {/* macOS-style logo */}
          <svg className="w-16 h-16 text-white/80 mb-3" viewBox="0 0 384 512" fill="currentColor">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-62.1 24-72.5-24 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
          </svg>
          <h2 className="text-xl font-light text-white mb-0.5">PortfolioOS</h2>
          <p className="text-[11px] text-white/40 mb-4">Version 1.0.0</p>

          <div className="w-full h-px bg-white/10 mb-3" />

          <div className="w-full text-[12px] space-y-1.5">
            {([
              ["OS", info.os],
              ["Platform", info.platform],
              ["Browser", info.browser],
              ["Display", info.resolution],
              ["CPU Cores", info.cores],
              ["Memory", info.memory],
              ["Language", info.language],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-white/50">{label}</span>
                <span className="text-white/80 font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-white/10 mt-3 mb-3" />

          <button
            onClick={onClose}
            className="px-6 py-1.5 rounded-md text-[13px] text-white/90 font-medium bg-[#3478f6] hover:bg-[#2563eb] transition-colors"
          >
            OK
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Power state overlays (Sleep / Restart / Shut Down) ─── */
type PowerState = "active" | "sleep" | "restarting" | "shuttingDown" | "off";

function SleepOverlay({ onWake }: { onWake: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[110] bg-black cursor-pointer flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      onClick={onWake}
      onKeyDown={onWake}
      tabIndex={0}
    >
      <motion.p
        className="text-white/20 text-sm"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        Click or press any key to wake
      </motion.p>
    </motion.div>
  );
}

function ShutDownOverlay({ onPowerOn }: { onPowerOn: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[110] bg-black cursor-pointer flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      onClick={onPowerOn}
      tabIndex={0}
    >
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <svg className="w-8 h-8 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v6" />
          <circle cx="12" cy="14" r="8" />
        </svg>
        <p className="text-white/20 text-xs">Click to power on</p>
      </motion.div>
    </motion.div>
  );
}

function RestartOverlay({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"fadeOut" | "boot">("fadeOut");

  useEffect(() => {
    const t = setTimeout(() => setPhase("boot"), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === "boot") {
      const t = setTimeout(onComplete, 2800);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[110] bg-dark-900 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {phase === "boot" && (
        <>
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
        </>
      )}
    </motion.div>
  );
}

/* ─── Menu bar helpers ─── */
interface MenuItem {
  label?: string;
  shortcut?: string;
  action?: () => void;
  disabled?: boolean;
  separator?: boolean;
  checked?: boolean;
}

function MenuRow({ item }: { item: MenuItem }) {
  if (item.separator) {
    return <div className="h-px bg-white/10 my-[3px] mx-2" />;
  }
  const disabled = item.disabled || !item.action;
  return (
    <button
      className={`w-full flex items-center justify-between px-3 py-[3px] text-[13px] text-left rounded-[4px] ${
        disabled
          ? "text-white/25 cursor-default"
          : "text-white/90 hover:bg-[#3478f6] hover:text-white"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) item.action?.();
      }}
      disabled={disabled}
    >
      <span className="flex items-center gap-2">
        {item.checked !== undefined && (
          <span className="w-3 text-center text-[11px]">{item.checked ? "✓" : ""}</span>
        )}
        {item.label}
      </span>
      {item.shortcut && (
        <span className={`ml-6 text-[12px] ${disabled ? "text-white/15" : "text-white/40"}`}>
          {item.shortcut}
        </span>
      )}
    </button>
  );
}

function MenuDropdown({
  items,
  onClose,
}: {
  items: MenuItem[];
  onClose: () => void;
}) {
  return (
    <div
      className="absolute top-[22px] left-0 min-w-[220px] py-1 px-[3px] rounded-md z-[70]"
      style={{
        background: "rgba(30,30,30,0.95)",
        backdropFilter: "blur(50px) saturate(1.5)",
        WebkitBackdropFilter: "blur(50px) saturate(1.5)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(0,0,0,0.3)",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {items.map((item, i) => (
        <MenuRow key={item.label ?? `sep-${i}`} item={{ ...item, action: item.action ? () => { item.action!(); onClose(); } : undefined }} />
      ))}
    </div>
  );
}

interface TopBarProps {
  activeAppTitle: string | null;
  activeWindow: string | null;
  openWindows: string[];
  appList: AppConfig[];
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onToggleMaximize: (id: string) => void;
  isMaximized: (id: string) => boolean;
  onOpenApp: (id: string) => void;
  onFocusApp: (id: string) => void;
  onAboutThisMac: () => void;
  onSleep: () => void;
  onRestart: () => void;
  onShutDown: () => void;
}

function TopBar({
  activeAppTitle,
  activeWindow,
  openWindows,
  appList,
  onCloseWindow,
  onMinimizeWindow,
  onToggleMaximize,
  isMaximized,
  onOpenApp,
  onFocusApp,
  onAboutThisMac,
  onSleep,
  onRestart,
  onShutDown,
}: TopBarProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

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

  // Click outside to close menu
  useEffect(() => {
    if (!openMenu) return;
    const handle = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [openMenu]);

  const hasWindow = activeWindow !== null;

  const menus: Record<string, { label: string; items: MenuItem[] }> = {
    apple: {
      label: "",
      items: [
        { label: "About This Mac", action: onAboutThisMac },
        { separator: true },
        { label: "System Preferences...", disabled: true },
        { separator: true },
        { label: "Sleep", action: onSleep },
        { label: "Restart...", action: onRestart },
        { label: "Shut Down...", action: onShutDown },
      ],
    },
    app: {
      label: activeAppTitle ?? "Finder",
      items: [
        { label: `About ${activeAppTitle ?? "Finder"}`, disabled: true },
        { separator: true },
        ...(hasWindow
          ? [
              { label: `Hide ${activeAppTitle}`, shortcut: "⌘H", action: () => onMinimizeWindow(activeWindow!) },
              { separator: true },
              { label: `Quit ${activeAppTitle}`, shortcut: "⌘Q", action: () => onCloseWindow(activeWindow!) },
            ]
          : []),
      ],
    },
    file: {
      label: "File",
      items: [
        { label: "New Window", disabled: true },
        { separator: true },
        {
          label: "Close Window",
          shortcut: "⌘W",
          action: hasWindow ? () => onCloseWindow(activeWindow!) : undefined,
          disabled: !hasWindow,
        },
      ],
    },
    edit: {
      label: "Edit",
      items: [
        { label: "Undo", shortcut: "⌘Z", action: () => document.execCommand("undo") },
        { label: "Redo", shortcut: "⇧⌘Z", action: () => document.execCommand("redo") },
        { separator: true },
        { label: "Cut", shortcut: "⌘X", action: () => document.execCommand("cut") },
        { label: "Copy", shortcut: "⌘C", action: () => document.execCommand("copy") },
        { label: "Paste", shortcut: "⌘V", action: () => document.execCommand("paste") },
        { separator: true },
        { label: "Select All", shortcut: "⌘A", action: () => document.execCommand("selectAll") },
      ],
    },
    view: {
      label: "View",
      items: [
        {
          label: hasWindow && isMaximized(activeWindow!) ? "Exit Full Screen" : "Enter Full Screen",
          shortcut: "⌃⌘F",
          action: hasWindow ? () => onToggleMaximize(activeWindow!) : undefined,
          disabled: !hasWindow,
        },
      ],
    },
    window: {
      label: "Window",
      items: [
        {
          label: "Minimize",
          shortcut: "⌘M",
          action: hasWindow ? () => onMinimizeWindow(activeWindow!) : undefined,
          disabled: !hasWindow,
        },
        {
          label: "Zoom",
          action: hasWindow ? () => onToggleMaximize(activeWindow!) : undefined,
          disabled: !hasWindow,
        },
        { separator: true },
        { label: "Bring All to Front", action: hasWindow ? () => onFocusApp(activeWindow!) : undefined, disabled: !hasWindow },
        ...(openWindows.length > 0
          ? [
              { separator: true } as MenuItem,
              ...openWindows.map((id) => {
                const app = appList.find((a) => a.id === id);
                return {
                  label: app?.title ?? id,
                  checked: id === activeWindow,
                  action: () => onFocusApp(id),
                } as MenuItem;
              }),
            ]
          : []),
      ],
    },
    help: {
      label: "Help",
      items: [
        { label: "Portfolio Help", disabled: true },
      ],
    },
  };

  const menuKeys = ["apple", "app", "file", "edit", "view", "window", "help"];

  const handleClick = (key: string) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  const handleHover = (key: string) => {
    if (openMenu !== null) setOpenMenu(key);
  };

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[25px] z-[60] flex items-center px-4 text-[13px]"
      style={{
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(50px) saturate(1.8)",
        WebkitBackdropFilter: "blur(50px) saturate(1.8)",
      }}
    >
      {/* Left: Apple logo + menus */}
      <div className="flex items-center h-full">
        {menuKeys.map((key) => {
          const menu = menus[key];
          const isApple = key === "apple";
          const isApp = key === "app";
          const isOpen = openMenu === key;

          return (
            <div
              key={key}
              className="relative h-full flex items-center"
              onClick={() => handleClick(key)}
              onMouseEnter={() => handleHover(key)}
            >
              <div
                className={`px-2 h-[20px] flex items-center rounded-[3px] cursor-default select-none ${
                  isOpen ? "bg-white/15" : "hover:bg-white/5"
                }`}
              >
                {isApple ? (
                  <svg
                    className="w-[14px] h-[17px] text-white/90"
                    viewBox="0 0 384 512"
                    fill="currentColor"
                  >
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-62.1 24-72.5-24 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                ) : (
                  <span
                    className={`text-[13px] ${
                      isApp ? "font-semibold text-white/90" : "text-white/80"
                    }`}
                  >
                    {menu.label}
                  </span>
                )}
              </div>
              {isOpen && <MenuDropdown items={menu.items} onClose={() => setOpenMenu(null)} />}
            </div>
          );
        })}
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
  const [powerState, setPowerState] = useState<PowerState>("active");
  const [showAboutMac, setShowAboutMac] = useState(false);
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [minimized, setMinimized] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [zCounter, setZCounter] = useState(10);
  const [zMap, setZMap] = useState<Record<string, number>>({});
  const [installedAppIds, setInstalledAppIds] = useState<string[]>([]);
  const dockRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const windowRefs = useRef<Record<string, WindowHandle | null>>({});

  // All available apps = built-in + installed downloadable apps
  const allApps = useMemo(() => {
    const installed = downloadableApps.filter((a) => installedAppIds.includes(a.id));
    return [...apps, ...installed];
  }, [installedAppIds]);

  const installApp = useCallback((id: string) => {
    setInstalledAppIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

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

  const toggleMaximizeApp = useCallback((id: string) => {
    windowRefs.current[id]?.toggleMaximize();
  }, []);

  const isAppMaximized = useCallback((id: string) => {
    return windowRefs.current[id]?.isMaximized() ?? false;
  }, []);

  const desktopActions = useMemo(() => ({ openApp, installApp, installedApps: installedAppIds }), [openApp, installApp, installedAppIds]);

  const activeTitle =
    activeWindow
      ? allApps.find((a) => a.id === activeWindow)?.title ?? null
      : null;

  return (
    <DesktopContext.Provider value={desktopActions}>
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

          <TopBar
            activeAppTitle={activeTitle}
            activeWindow={activeWindow}
            openWindows={openWindows}
            appList={allApps}
            onCloseWindow={closeApp}
            onMinimizeWindow={minimizeApp}
            onToggleMaximize={toggleMaximizeApp}
            isMaximized={isAppMaximized}
            onOpenApp={openApp}
            onFocusApp={focusApp}
            onAboutThisMac={() => setShowAboutMac(true)}
            onSleep={() => setPowerState("sleep")}
            onRestart={() => setPowerState("restarting")}
            onShutDown={() => setPowerState("shuttingDown")}
          />

          <DesktopIcons apps={allApps} onOpen={openApp} />

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
            const app = allApps.find((a) => a.id === id);
            if (!app) return null;
            return (
              <Window
                key={id}
                ref={(handle) => { windowRefs.current[id] = handle; }}
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
            apps={allApps}
            openWindows={openWindows}
            onOpen={openApp}
            onFocus={focusApp}
            dockRefs={dockRefs}
          />

          {/* About This Mac modal */}
          <AnimatePresence>
            {showAboutMac && <AboutThisMac onClose={() => setShowAboutMac(false)} />}
          </AnimatePresence>
        </>
      )}

      {/* Power state overlays */}
      <AnimatePresence>
        {powerState === "sleep" && (
          <SleepOverlay onWake={() => setPowerState("active")} />
        )}
        {powerState === "shuttingDown" && (
          <ShutDownOverlay onPowerOn={() => {
            setPowerState("active");
            setBooted(false);
            setTimeout(() => setBooted(true), 2800);
          }} />
        )}
        {powerState === "restarting" && (
          <RestartOverlay onComplete={() => setPowerState("active")} />
        )}
      </AnimatePresence>
    </div>
    </DesktopContext.Provider>
  );
}
