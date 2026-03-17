"use client";

import { useState } from "react";
import { HiExternalLink, HiCode } from "react-icons/hi";

const projects = [
  {
    title: "Portfolio Website",
    description:
      "Modern animated portfolio with OS desktop simulation. Built with Next.js and Framer Motion.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    category: "Web",
    color: "from-blue-500 to-cyan-500",
    demo: "https://marcoevanz.github.io/neoPortfolio/",
    code: "#",
  },
  {
    title: "Website Đoàn Thanh Niên",
    description:
      "Website for youth union organization with event management and information portal.",
    tags: ["Next.js", "React", "Tailwind"],
    category: "Web",
    color: "from-violet-500 to-purple-500",
    demo: "https://sanphamthanhphudt.vercel.app/",
    code: "#",
  },
  {
    title: "Buffalo 5-Reel Deluxe Classic",
    description:
      "Vegas-style slot game with progressive jackpots, stacked wilds, prize picks, live tournaments and daily bonus coins. Features classic buffalo-themed 5-reel machines.",
    tags: ["Unity", "C#"],
    category: "Game",
    color: "from-emerald-500 to-green-500",
    demo: "https://play.google.com/store/apps/details?id=com.foxcubgames.buffalobillionairecasino",
    code: "#",
  },
  {
    title: "Slots Vacation: Slot Machines",
    description:
      "Top-rated free slots game with a Billion Coin Giveaway every week. Features a huge variety of themed slot machines, live tournaments, powerful boosters, and hourly prizes.",
    tags: ["Unity", "C#"],
    category: "Game",
    color: "from-orange-500 to-amber-500",
    demo: "https://play.google.com/store/apps/details?id=com.scopely.slotsvacation",
    code: "#",
  },
  {
    title: "PvZ2 Gardenless",
    description:
      "Fan-made Plants vs Zombies 2 web game with garden-free gameplay and custom levels.",
    tags: ["Cocos", "TypeScript"],
    category: "Game",
    color: "from-lime-500 to-green-600",
    demo: "https://marcoevanz.github.io/pvzge_web/",
    code: "#",
  },
];

type Filter = "All" | "Web" | "Game";

export default function ProjectsApp() {
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-44 shrink-0 border-r border-white/5 p-3 space-y-1">
        <p className="text-[10px] text-dark-500 uppercase tracking-wider px-2 mb-2">
          Filter
        </p>
        {(["All", "Web", "Game"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setSelected(null);
            }}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all ${
              filter === f
                ? "bg-primary-500/15 text-primary-400"
                : "text-dark-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {f === "All" ? "All Projects" : `${f} Dev`}
            <span className="ml-1 text-dark-600">
              (
              {f === "All"
                ? projects.length
                : projects.filter((p) => p.category === f).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Main area */}
      <div className="flex-1 flex">
        {/* Project list */}
        <div className="flex-1 p-3 space-y-1.5 overflow-auto">
          {filtered.map((project, i) => (
            <button
              key={project.title}
              onClick={() => setSelected(i)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selected === i
                  ? "bg-primary-500/10 ring-1 ring-primary-500/20"
                  : "hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${project.color} opacity-80 shrink-0`}
                />
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {project.title}
                  </p>
                  <p className="text-[11px] text-dark-500">
                    {project.tags.join(" · ")}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="w-64 border-l border-white/5 p-4 overflow-auto">
          {selected !== null ? (
            <div className="space-y-4">
              <div
                className={`w-full h-28 rounded-xl bg-gradient-to-br ${filtered[selected].color} opacity-60`}
              />
              <div>
                <span className="text-[10px] font-semibold text-dark-500 uppercase tracking-wider">
                  {filtered[selected].category}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {filtered[selected].title}
                </h3>
              </div>
              <p className="text-xs text-dark-400 leading-relaxed">
                {filtered[selected].description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {filtered[selected].tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] text-dark-300 bg-white/5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <a
                  href={filtered[selected].demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                >
                  <HiExternalLink size={12} />
                  Demo
                </a>
                <a
                  href={filtered[selected].code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] border border-white/10 text-dark-300 hover:text-white rounded-lg transition-colors"
                >
                  <HiCode size={12} />
                  Code
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-xs text-dark-600 text-center">
                Select a project
                <br />
                to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
