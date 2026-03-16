"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiUnity,
  SiGit,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiFigma,
} from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";
import type { IconType } from "react-icons";

interface Skill {
  name: string;
  icon: IconType;
  proficiency: number;
  category: string;
  status: "Active" | "Learning" | "Familiar";
  color: string;
  threads: number;
}

const skills: Skill[] = [
  { name: "Next.js", icon: SiNextdotjs, proficiency: 80, category: "Frontend", status: "Active", color: "#ffffff", threads: 4 },
  { name: "React", icon: SiReact, proficiency: 80, category: "Frontend", status: "Active", color: "#61dafb", threads: 5 },
  { name: "TypeScript", icon: SiTypescript, proficiency: 70, category: "Frontend", status: "Active", color: "#3178c6", threads: 3 },
  { name: "JavaScript", icon: SiJavascript, proficiency: 85, category: "Frontend", status: "Active", color: "#f7df1e", threads: 6 },
  { name: "Tailwind CSS", icon: SiTailwindcss, proficiency: 85, category: "Frontend", status: "Active", color: "#06b6d4", threads: 3 },
  { name: "HTML5", icon: SiHtml5, proficiency: 90, category: "Frontend", status: "Active", color: "#e34f26", threads: 2 },
  { name: "CSS3", icon: SiCss, proficiency: 85, category: "Frontend", status: "Active", color: "#1572b6", threads: 2 },
  { name: "Unity", icon: SiUnity, proficiency: 75, category: "Game Dev", status: "Active", color: "#ffffff", threads: 8 },
  { name: "C#", icon: TbBrandCSharp, proficiency: 70, category: "Game Dev", status: "Active", color: "#68217a", threads: 5 },
  { name: "Git", icon: SiGit, proficiency: 75, category: "Tools", status: "Active", color: "#f05032", threads: 2 },
  { name: "Node.js", icon: SiNodedotjs, proficiency: 65, category: "Tools", status: "Learning", color: "#339933", threads: 4 },
  { name: "Figma", icon: SiFigma, proficiency: 60, category: "Tools", status: "Familiar", color: "#f24e1e", threads: 2 },
];

type SortKey = "name" | "proficiency" | "category" | "status" | "threads";
type Tab = "cpu" | "memory" | "energy";

// Live graph canvas drawing
function LiveGraph({
  history,
  color,
  height,
  label,
  valueLabel,
}: {
  history: number[];
  color: string;
  height: number;
  label: string;
  valueLabel: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (let i = 1; i < 8; i++) {
      const x = (w / 8) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    if (history.length < 2) return;

    // Fill gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + "40");
    grad.addColorStop(1, color + "05");

    ctx.beginPath();
    ctx.moveTo(0, h);
    history.forEach((v, i) => {
      const x = (i / (history.length - 1)) * w;
      const y = h - (v / 100) * h;
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    history.forEach((v, i) => {
      const x = (i / (history.length - 1)) * w;
      const y = h - (v / 100) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.stroke();
  }, [history, color]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[10px] text-dark-400">{label}</span>
        <span
          className="text-[11px] font-mono font-semibold"
          style={{ color }}
        >
          {valueLabel}
        </span>
      </div>
      <div
        className="rounded-lg overflow-hidden border border-white/5"
        style={{ background: "rgba(0,0,0,0.3)" }}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={height}
          className="w-full"
          style={{ height }}
        />
      </div>
    </div>
  );
}

export default function SkillsApp() {
  const [tab, setTab] = useState<Tab>("cpu");
  const [sortKey, setSortKey] = useState<SortKey>("proficiency");
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  // Live usage data
  const [usageHistory, setUsageHistory] = useState<Record<string, number[]>>({});
  const [totalHistory, setTotalHistory] = useState<number[]>([]);

  useEffect(() => {
    // Initialize
    const init: Record<string, number[]> = {};
    skills.forEach((s) => {
      init[s.name] = Array.from({ length: 60 }, () =>
        clamp(s.proficiency + (Math.random() - 0.5) * 20)
      );
    });
    setUsageHistory(init);
    setTotalHistory(
      Array.from({ length: 60 }, () => clamp(75 + (Math.random() - 0.5) * 15))
    );

    const id = setInterval(() => {
      setUsageHistory((prev) => {
        const next = { ...prev };
        skills.forEach((s) => {
          const arr = [...(next[s.name] || [])];
          arr.push(clamp(s.proficiency + (Math.random() - 0.5) * 24));
          if (arr.length > 60) arr.shift();
          next[s.name] = arr;
        });
        return next;
      });
      setTotalHistory((prev) => {
        const arr = [...prev, clamp(75 + (Math.random() - 0.5) * 18)];
        if (arr.length > 60) arr.shift();
        return arr;
      });
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const sorted = [...skills].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
    if (sortKey === "category") return a.category.localeCompare(b.category) * dir;
    if (sortKey === "status") return a.status.localeCompare(b.status) * dir;
    if (sortKey === "threads") return (a.threads - b.threads) * dir;
    return (a.proficiency - b.proficiency) * dir;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const totalProf = Math.round(
    skills.reduce((a, s) => a + s.proficiency, 0) / skills.length
  );
  const totalThreads = skills.reduce((a, s) => a + s.threads, 0);
  const currentTotal = totalHistory.at(-1) ?? totalProf;

  const SortIndicator = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      <span className="text-primary-400 ml-0.5">{sortAsc ? "▲" : "▼"}</span>
    ) : null;

  return (
    <div className="h-full flex flex-col" style={{ background: "rgba(20,24,36,0.95)" }}>
      {/* macOS-style segmented tabs */}
      <div className="flex items-center justify-center py-2 px-3 shrink-0 border-b border-white/5">
        <div
          className="inline-flex rounded-md p-0.5"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          {(
            [
              { key: "cpu", label: "CPU (Skills)" },
              { key: "memory", label: "Memory" },
              { key: "energy", label: "Energy" },
            ] as { key: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1 rounded text-[11px] font-medium transition-all ${
                tab === t.key
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-dark-400 hover:text-dark-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "cpu" ? (
        /* ─── CPU (Process List) ─── */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Column headers */}
          <div className="flex items-center px-3 py-1 text-[10px] font-semibold text-dark-500 uppercase tracking-wider border-b border-white/5 shrink-0 bg-white/[0.02]">
            <ColHeader
              label="Process Name"
              className="flex-1"
              col="name"
              sortKey={sortKey}
              onSort={handleSort}
            >
              <SortIndicator col="name" />
            </ColHeader>
            <ColHeader
              label="Category"
              className="w-20"
              col="category"
              sortKey={sortKey}
              onSort={handleSort}
            >
              <SortIndicator col="category" />
            </ColHeader>
            <ColHeader
              label="Status"
              className="w-16"
              col="status"
              sortKey={sortKey}
              onSort={handleSort}
            >
              <SortIndicator col="status" />
            </ColHeader>
            <ColHeader
              label="% CPU"
              className="w-16 text-right"
              col="proficiency"
              sortKey={sortKey}
              onSort={handleSort}
            >
              <SortIndicator col="proficiency" />
            </ColHeader>
            <ColHeader
              label="Threads"
              className="w-16 text-right"
              col="threads"
              sortKey={sortKey}
              onSort={handleSort}
            >
              <SortIndicator col="threads" />
            </ColHeader>
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-auto">
            {sorted.map((skill) => {
              const live =
                usageHistory[skill.name]?.at(-1) ?? skill.proficiency;
              return (
                <button
                  key={skill.name}
                  onClick={() =>
                    setSelected(selected === skill.name ? null : skill.name)
                  }
                  className={`w-full flex items-center px-3 py-[7px] text-left transition-colors border-b border-white/[0.02] ${
                    selected === skill.name
                      ? "bg-primary-500/15"
                      : "hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <skill.icon
                      className="text-[13px] shrink-0"
                      style={{ color: skill.color }}
                    />
                    <span className="text-[12px] text-dark-200 truncate">
                      {skill.name}
                    </span>
                  </div>
                  <div className="w-20">
                    <span className="text-[11px] text-dark-500">
                      {skill.category}
                    </span>
                  </div>
                  <div className="w-16">
                    <span
                      className={`text-[11px] ${
                        skill.status === "Active"
                          ? "text-green-400"
                          : skill.status === "Learning"
                          ? "text-yellow-400"
                          : "text-dark-500"
                      }`}
                    >
                      {skill.status}
                    </span>
                  </div>
                  <div className="w-16 text-right">
                    <span
                      className="text-[12px] font-mono"
                      style={{
                        color:
                          live > 80
                            ? "#ef4444"
                            : live > 60
                            ? "#f59e0b"
                            : "#22c55e",
                      }}
                    >
                      {Math.round(live).toFixed(1)}
                    </span>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-[12px] text-dark-400 font-mono">
                      {skill.threads}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom summary bar */}
          <div className="shrink-0 flex items-center justify-between px-3 py-2 border-t border-white/5 bg-white/[0.02]">
            <div className="flex gap-5">
              <StatItem label="Processes" value={String(skills.length)} />
              <StatItem label="Threads" value={String(totalThreads)} />
            </div>
            <div className="flex gap-5">
              <StatItem
                label="System"
                value={`${Math.round(currentTotal * 0.35).toFixed(1)}%`}
                color="#ef4444"
              />
              <StatItem
                label="User"
                value={`${Math.round(currentTotal * 0.65).toFixed(1)}%`}
                color="#3b82f6"
              />
              <StatItem
                label="Idle"
                value={`${(100 - currentTotal).toFixed(1)}%`}
                color="#22c55e"
              />
            </div>
          </div>
        </div>
      ) : tab === "memory" ? (
        /* ─── Memory (Visual overview) ─── */
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <LiveGraph
            history={totalHistory}
            color="#8b5cf6"
            height={120}
            label="Memory Pressure"
            valueLabel={`${totalProf}% used`}
          />
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Frontend", val: "82%", color: "#3b82f6", sub: "7 skills" },
              { label: "Game Dev", val: "72%", color: "#a855f7", sub: "2 skills" },
              { label: "Tools", val: "67%", color: "#22c55e", sub: "3 skills" },
            ].map((c) => (
              <div
                key={c.label}
                className="p-3 rounded-lg border border-white/5"
                style={{ background: "rgba(0,0,0,0.2)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: c.color }}
                  />
                  <span className="text-[11px] text-dark-300 font-medium">
                    {c.label}
                  </span>
                </div>
                <p
                  className="text-xl font-mono font-bold"
                  style={{ color: c.color }}
                >
                  {c.val}
                </p>
                <p className="text-[10px] text-dark-600 mt-0.5">{c.sub}</p>
              </div>
            ))}
          </div>
          {/* Memory breakdown bar */}
          <div>
            <p className="text-[10px] text-dark-500 mb-2">Physical Memory</p>
            <div className="h-5 rounded-md overflow-hidden flex" style={{ background: "rgba(0,0,0,0.3)" }}>
              <div className="h-full bg-[#3b82f6]" style={{ width: "45%" }} />
              <div className="h-full bg-[#a855f7]" style={{ width: "20%" }} />
              <div className="h-full bg-[#22c55e]" style={{ width: "15%" }} />
              <div className="h-full bg-white/5" style={{ width: "20%" }} />
            </div>
            <div className="flex gap-4 mt-2">
              {[
                { label: "App Memory", color: "#3b82f6", val: "5.4 GB" },
                { label: "Wired", color: "#a855f7", val: "2.8 GB" },
                { label: "Compressed", color: "#22c55e", val: "1.9 GB" },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-sm"
                    style={{ background: m.color }}
                  />
                  <span className="text-[10px] text-dark-500">{m.label}</span>
                  <span className="text-[10px] text-dark-300 font-mono">
                    {m.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ─── Energy (Per-skill graphs) ─── */
        <div className="flex-1 overflow-auto p-4 space-y-3">
          <LiveGraph
            history={totalHistory.map((v) => v * 0.8)}
            color="#f59e0b"
            height={100}
            label="Energy Impact (Overall)"
            valueLabel={`${Math.round(currentTotal * 0.8)}W`}
          />
          <p className="text-[10px] text-dark-500 uppercase tracking-wider pt-2">
            Per Skill
          </p>
          {skills.slice(0, 8).map((skill) => (
            <div
              key={skill.name}
              className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-white/[0.02] transition-colors"
            >
              <skill.icon
                className="text-xs shrink-0"
                style={{ color: skill.color }}
              />
              <span className="text-[11px] text-dark-300 w-24 truncate">
                {skill.name}
              </span>
              {/* Mini inline spark */}
              <MiniSpark
                values={usageHistory[skill.name] || []}
                color={skill.color}
              />
              <span
                className="text-[11px] font-mono w-10 text-right"
                style={{ color: skill.color }}
              >
                {Math.round(
                  usageHistory[skill.name]?.at(-1) ?? skill.proficiency
                )}
                %
              </span>
              {/* Energy bar */}
              <div className="w-20 h-1.5 rounded-full overflow-hidden bg-white/5">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${skill.proficiency}%`,
                    background: skill.color,
                    opacity: 0.6,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helpers

function clamp(v: number) {
  return Math.max(5, Math.min(100, v));
}

function ColHeader({
  label,
  className,
  col,
  sortKey,
  onSort,
  children,
}: {
  label: string;
  className: string;
  col: SortKey;
  sortKey: SortKey;
  onSort: (k: SortKey) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onSort(col)}
      className={`${className} text-left hover:text-dark-300 transition-colors cursor-pointer flex items-center`}
    >
      {label}
      {children}
    </button>
  );
}

function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="text-[10px]">
      <span className="text-dark-500">{label}: </span>
      <span className="font-mono font-medium" style={{ color: color ?? "#94a3b8" }}>
        {value}
      </span>
    </div>
  );
}

function MiniSpark({
  values,
  color,
}: {
  values: number[];
  color: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || values.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    const recent = values.slice(-30);
    recent.forEach((v, i) => {
      const x = (i / (recent.length - 1)) * w;
      const y = h - (v / 100) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.lineJoin = "round";
    ctx.stroke();
  }, [values, color]);

  return (
    <canvas
      ref={canvasRef}
      width={80}
      height={20}
      className="shrink-0 opacity-60"
      style={{ width: 80, height: 20 }}
    />
  );
}
