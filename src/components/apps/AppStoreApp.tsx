"use client";

import { useState, useEffect, useRef } from "react";
import { HiUser, HiCode, HiTerminal, HiMail, HiCube, HiStar, HiDownload, HiSearch } from "react-icons/hi";
import { IoGameController, IoLeaf } from "react-icons/io5";
import { useDesktop } from "../DesktopContext";

interface StoreApp {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  category: string;
  rating: number;
  reviews: string;
  size: string;
  builtIn: boolean; // always installed, can't be downloaded
}

const storeApps: StoreApp[] = [
  {
    id: "about",
    name: "About Me",
    subtitle: "Personal Profile",
    description: "Get to know the developer behind this portfolio. View skills, experience, and background info.",
    icon: <HiUser className="text-2xl" />,
    iconBg: "from-blue-500 to-cyan-500",
    category: "Productivity",
    rating: 4.8,
    reviews: "2.1K",
    size: "12 MB",
    builtIn: true,
  },
  {
    id: "projects",
    name: "Projects",
    subtitle: "Portfolio Showcase",
    description: "Browse through a curated collection of web and game development projects with live demos.",
    icon: <HiCode className="text-2xl" />,
    iconBg: "from-purple-500 to-pink-500",
    category: "Developer Tools",
    rating: 4.9,
    reviews: "3.4K",
    size: "24 MB",
    builtIn: true,
  },
  {
    id: "skills",
    name: "Activity Monitor",
    subtitle: "Skills & Stats",
    description: "Real-time activity monitor showing technical skills, frameworks, and proficiency levels.",
    icon: <HiCube className="text-2xl" />,
    iconBg: "from-emerald-500 to-green-500",
    category: "Utilities",
    rating: 4.7,
    reviews: "1.8K",
    size: "8 MB",
    builtIn: true,
  },
  {
    id: "terminal",
    name: "Terminal",
    subtitle: "Command Line",
    description: "Interactive terminal emulator. Run commands to explore the developer's background and projects.",
    icon: <HiTerminal className="text-2xl" />,
    iconBg: "from-gray-600 to-gray-800",
    category: "Developer Tools",
    rating: 4.6,
    reviews: "956",
    size: "4 MB",
    builtIn: true,
  },
  {
    id: "contact",
    name: "Contact",
    subtitle: "Get in Touch",
    description: "Send a message, find social links, or grab contact information to start a conversation.",
    icon: <HiMail className="text-2xl" />,
    iconBg: "from-orange-500 to-red-500",
    category: "Social Networking",
    rating: 4.5,
    reviews: "1.2K",
    size: "6 MB",
    builtIn: true,
  },
  {
    id: "flappybird",
    name: "Flappy Bird",
    subtitle: "Tap to Fly",
    description: "The classic addictive game! Navigate your bird through pipes by tapping to flap. How far can you go? Compete for the highest score.",
    icon: <IoGameController className="text-2xl" />,
    iconBg: "from-yellow-400 to-orange-500",
    category: "Games",
    rating: 4.9,
    reviews: "12.5K",
    size: "2 MB",
    builtIn: false,
  },
  {
    id: "pvz2",
    name: "PvZ2 Gardendless",
    subtitle: "Plants vs Zombies",
    description: "A full rewrite of Plants vs Zombies 2 built entirely with web technologies. Defend your garden from waves of zombies with an arsenal of plants. Powered by the Cocos engine.",
    icon: <IoLeaf className="text-2xl" />,
    iconBg: "from-green-500 to-lime-400",
    category: "Games",
    rating: 4.8,
    reviews: "8.3K",
    size: "48 MB",
    builtIn: false,
  },
];

const categories = ["Discover", "Games", "Developer Tools", "Productivity", "Utilities", "Social Networking"];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <HiStar
          key={i}
          className={`w-3 h-3 ${i <= Math.round(rating) ? "text-yellow-400" : "text-white/10"}`}
        />
      ))}
    </div>
  );
}

function InstallButton({
  app,
  onInstall,
  onOpen,
  isInstalled,
  small,
}: {
  app: StoreApp;
  onInstall: (id: string) => void;
  onOpen: (id: string) => void;
  isInstalled: boolean;
  small?: boolean;
}) {
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleGet = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (app.builtIn || isInstalled) {
      onOpen(app.id);
      return;
    }
    setInstalling(true);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => {
            setInstalling(false);
            onInstall(app.id);
          }, 200);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);
  };

  if (installing) {
    const pct = Math.min(progress, 100);
    if (small) {
      return (
        <div className="relative w-[60px] h-[26px] shrink-0 flex items-center justify-center">
          <svg className="w-6 h-6" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15" fill="none" stroke="#3478f6" strokeWidth="3"
              strokeDasharray={`${pct * 0.942} 94.2`}
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
              style={{ transition: "stroke-dasharray 0.15s" }}
            />
          </svg>
        </div>
      );
    }
    return (
      <div className="relative w-[80px] h-[30px] shrink-0 flex items-center justify-center">
        <svg className="w-7 h-7" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15" fill="none" stroke="#3478f6" strokeWidth="3"
            strokeDasharray={`${pct * 0.942} 94.2`}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
            style={{ transition: "stroke-dasharray 0.15s" }}
          />
        </svg>
      </div>
    );
  }

  const isOpen = app.builtIn || isInstalled;

  if (small) {
    return (
      <div
        className={`px-4 py-1 rounded-full text-[12px] font-semibold transition-colors shrink-0 cursor-pointer ${
          isOpen
            ? "bg-white/10 text-[#3478f6] hover:bg-white/15"
            : "bg-[#3478f6] text-white hover:bg-[#2563eb]"
        }`}
        onClick={handleGet}
      >
        {isOpen ? "Open" : "Get"}
      </div>
    );
  }

  return (
    <button
      onClick={handleGet}
      className="px-5 py-1.5 rounded-full text-[13px] font-semibold transition-colors shrink-0 bg-[#3478f6] text-white hover:bg-[#2563eb]"
    >
      {isOpen ? "Open" : "Get"}
    </button>
  );
}

export default function AppStoreApp() {
  const { openApp, installApp, installedApps } = useDesktop();
  const [activeCategory, setActiveCategory] = useState("Discover");
  const [selectedApp, setSelectedApp] = useState<StoreApp | null>(null);
  const [search, setSearch] = useState("");

  const filtered = storeApps.filter((app) => {
    const matchesCategory = activeCategory === "Discover" || app.category === activeCategory;
    const matchesSearch =
      search === "" ||
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      app.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div
        className="w-[170px] shrink-0 p-3 pt-2 space-y-0.5 border-r border-white/[0.06] overflow-y-auto"
        style={{ background: "rgba(0,0,0,0.15)" }}
      >
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-2 mb-1">
          Categories
        </p>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setSelectedApp(null); setSearch(""); }}
            className={`w-full text-left px-2 py-1 rounded-md text-[12px] transition-colors ${
              activeCategory === cat
                ? "bg-[#3478f6] text-white"
                : "text-white/60 hover:bg-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {selectedApp ? (
          /* App detail view */
          <div className="p-5">
            <button
              onClick={() => setSelectedApp(null)}
              className="text-[#3478f6] text-[13px] mb-4 hover:underline"
            >
              &larr; Back
            </button>

            <div className="flex items-start gap-4 mb-5">
              <div
                className={`w-20 h-20 rounded-[18px] bg-gradient-to-br ${selectedApp.iconBg} flex items-center justify-center text-white shrink-0`}
                style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
              >
                {selectedApp.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-white">{selectedApp.name}</h2>
                <p className="text-[12px] text-white/40">{selectedApp.subtitle}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Stars rating={selectedApp.rating} />
                  <span className="text-[11px] text-white/30">{selectedApp.rating}</span>
                  <span className="text-[11px] text-white/20">({selectedApp.reviews})</span>
                </div>
              </div>
              <InstallButton
                app={selectedApp}
                onInstall={installApp}
                onOpen={openApp}
                isInstalled={installedApps.includes(selectedApp.id)}
              />
            </div>

            <div className="h-px bg-white/[0.06] mb-4" />

            <div className="grid grid-cols-3 gap-4 mb-5 text-center">
              <div>
                <p className="text-[11px] text-white/30 mb-0.5">Rating</p>
                <p className="text-sm font-semibold text-white">{selectedApp.rating}</p>
              </div>
              <div>
                <p className="text-[11px] text-white/30 mb-0.5">Category</p>
                <p className="text-sm font-semibold text-white">{selectedApp.category}</p>
              </div>
              <div>
                <p className="text-[11px] text-white/30 mb-0.5">Size</p>
                <p className="text-sm font-semibold text-white">{selectedApp.size}</p>
              </div>
            </div>

            <div className="h-px bg-white/[0.06] mb-4" />

            <h3 className="text-[13px] font-semibold text-white mb-2">Description</h3>
            <p className="text-[13px] text-white/60 leading-relaxed">
              {selectedApp.description}
            </p>
          </div>
        ) : (
          /* Browse view */
          <div className="p-5">
            {/* Search bar */}
            <div className="relative mb-4">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search apps..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/[0.08] text-[13px] text-white placeholder-white/30 outline-none focus:border-[#3478f6]/50 focus:bg-white/[0.07] transition-colors"
              />
            </div>

            {/* Featured banner (Discover only, no search) */}
            {activeCategory === "Discover" && search === "" && (
              <div
                className="rounded-xl p-5 mb-5 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(52,120,246,0.3) 0%, rgba(139,92,246,0.2) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-[11px] font-semibold text-[#3478f6] uppercase tracking-wider mb-1">
                  Featured
                </p>
                <h2 className="text-xl font-bold text-white mb-1">PortfolioOS Apps</h2>
                <p className="text-[13px] text-white/50 max-w-xs">
                  Explore the apps that power this portfolio experience. Download games and tools from the store.
                </p>
              </div>
            )}

            <h3 className="text-[13px] font-semibold text-white/40 uppercase tracking-wider mb-3">
              {search ? `Results for "${search}"` : activeCategory === "Discover" ? "All Apps" : activeCategory}
            </h3>

            {/* App list */}
            <div className="space-y-0.5">
              {filtered.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <div
                    className={`w-12 h-12 rounded-[12px] bg-gradient-to-br ${app.iconBg} flex items-center justify-center text-white shrink-0`}
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
                  >
                    {app.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white truncate">{app.name}</p>
                    <p className="text-[11px] text-white/30 truncate">{app.subtitle}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Stars rating={app.rating} />
                      <span className="text-[10px] text-white/20">{app.reviews}</span>
                    </div>
                  </div>
                  <InstallButton
                    app={app}
                    onInstall={installApp}
                    onOpen={openApp}
                    isInstalled={installedApps.includes(app.id)}
                    small
                  />
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="py-12 text-center">
                  <HiDownload className="w-8 h-8 text-white/10 mx-auto mb-2" />
                  <p className="text-[13px] text-white/30">
                    {search ? "No apps match your search" : "No apps in this category yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
