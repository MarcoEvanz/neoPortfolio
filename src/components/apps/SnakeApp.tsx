"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDesktop } from "../DesktopContext";

const CELL = 20;
const COLS = 20;
const ROWS = 20;
const W = COLS * CELL;
const H = ROWS * CELL;
const TICK = 100;

type Dir = "up" | "down" | "left" | "right";
type Pos = { x: number; y: number };

function randomFood(snake: Pos[]): Pos {
  let pos: Pos;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export default function SnakeApp() {
  const { isMobile } = useDesktop();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "dead">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window !== "undefined") return parseInt(localStorage.getItem("snake-best") || "0", 10);
    return 0;
  });

  const snake = useRef<Pos[]>([{ x: 10, y: 10 }]);
  const dir = useRef<Dir>("right");
  const nextDir = useRef<Dir>("right");
  const food = useRef<Pos>({ x: 15, y: 10 });
  const scoreRef = useRef(0);
  const gameStateRef = useRef(gameState);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  gameStateRef.current = gameState;

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0f1623";
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, H);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(W, y * CELL);
      ctx.stroke();
    }

    // Food
    const f = food.current;
    ctx.fillStyle = "#ef4444";
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.current.forEach((seg, i) => {
      const isHead = i === 0;
      const alpha = 1 - (i / snake.current.length) * 0.5;
      ctx.fillStyle = isHead ? `rgba(52,211,153,${alpha})` : `rgba(16,185,129,${alpha})`;
      if (isHead) {
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 6;
      }
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 4);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Overlays
    if (gameStateRef.current === "idle") {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 24px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Snake", W / 2, H / 2 - 10);
      if (!isMobile) {
        ctx.font = "13px system-ui";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText("Press Space or Click to start", W / 2, H / 2 + 15);
        ctx.fillText("Arrow keys / WASD to move", W / 2, H / 2 + 35);
      }
    } else if (gameStateRef.current === "dead") {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 22px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", W / 2, H / 2 - 20);
      ctx.fillStyle = "#fff";
      ctx.font = "16px system-ui";
      ctx.fillText(`Score: ${scoreRef.current}`, W / 2, H / 2 + 10);
      if (!isMobile) {
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "12px system-ui";
        ctx.fillText(`Best: ${Math.max(scoreRef.current, best)}`, W / 2, H / 2 + 30);
        ctx.fillText("Click or Space to retry", W / 2, H / 2 + 55);
      }
    }
  }, [best, isMobile]);

  const tick = useCallback(() => {
    if (gameStateRef.current !== "playing") return;

    dir.current = nextDir.current;
    const head = { ...snake.current[0] };

    switch (dir.current) {
      case "up": head.y--; break;
      case "down": head.y++; break;
      case "left": head.x--; break;
      case "right": head.x++; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      gameStateRef.current = "dead";
      setGameState("dead");
      const b = Math.max(scoreRef.current, best);
      setBest(b);
      localStorage.setItem("snake-best", String(b));
      draw();
      return;
    }

    // Self collision
    if (snake.current.some((s) => s.x === head.x && s.y === head.y)) {
      gameStateRef.current = "dead";
      setGameState("dead");
      const b = Math.max(scoreRef.current, best);
      setBest(b);
      localStorage.setItem("snake-best", String(b));
      draw();
      return;
    }

    snake.current.unshift(head);

    // Eat food
    if (head.x === food.current.x && head.y === food.current.y) {
      scoreRef.current++;
      setScore(scoreRef.current);
      food.current = randomFood(snake.current);
    } else {
      snake.current.pop();
    }

    draw();
  }, [best, draw]);

  const startGame = useCallback(() => {
    snake.current = [{ x: 10, y: 10 }];
    dir.current = "right";
    nextDir.current = "right";
    food.current = randomFood(snake.current);
    scoreRef.current = 0;
    setScore(0);
    setGameState("playing");
  }, []);

  const handleAction = useCallback(() => {
    if (gameStateRef.current === "idle" || gameStateRef.current === "dead") {
      startGame();
    }
  }, [startGame]);

  const changeDir = useCallback((newDir: Dir) => {
    if (gameStateRef.current !== "playing") return;
    const d = dir.current;
    if (newDir === "up" && d !== "down") nextDir.current = "up";
    if (newDir === "down" && d !== "up") nextDir.current = "down";
    if (newDir === "left" && d !== "right") nextDir.current = "left";
    if (newDir === "right" && d !== "left") nextDir.current = "right";
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState === "playing") {
      tickRef.current = setInterval(tick, TICK);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [gameState, tick]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  // Keyboard
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleAction();
        return;
      }
      if (gameStateRef.current !== "playing") return;
      switch (e.key) {
        case "ArrowUp": case "w": case "W":
          changeDir("up"); break;
        case "ArrowDown": case "s": case "S":
          changeDir("down"); break;
        case "ArrowLeft": case "a": case "A":
          changeDir("left"); break;
        case "ArrowRight": case "d": case "D":
          changeDir("right"); break;
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [handleAction, changeDir]);

  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-[#0a0f1a] select-none">
        {/* Score bar */}
        <div className="flex items-center justify-between px-4 py-2 shrink-0">
          <span className="text-xs text-white/40 font-mono">Score: {score}</span>
          <span className="text-xs text-white/30 font-mono">Best: {best}</span>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center min-h-0 px-2">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="rounded-lg border border-white/10 w-full"
            style={{ aspectRatio: `${W}/${H}`, maxHeight: "100%" }}
          />
        </div>

        {/* Virtual D-Pad */}
        <div className="shrink-0 flex flex-col items-center gap-1 py-3 pb-4">
          {/* Start/Retry button — always reserve space to prevent layout shift */}
          <div className="mb-2 h-9 flex items-center justify-center">
            {gameState !== "playing" && (
              <button
                onTouchStart={(e) => { e.preventDefault(); handleAction(); }}
                className="px-8 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm font-semibold active:bg-emerald-500/40 transition-colors"
              >
                {gameState === "idle" ? "Start" : "Retry"}
              </button>
            )}
          </div>

          {/* D-Pad */}
          <div className="relative w-[180px] h-[180px]">
            {/* Up */}
            <button
              onTouchStart={(e) => { e.preventDefault(); changeDir("up"); }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[60px] rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center active:bg-white/20 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4L4 12h12L10 4z" fill="rgba(255,255,255,0.6)"/></svg>
            </button>
            {/* Down */}
            <button
              onTouchStart={(e) => { e.preventDefault(); changeDir("down"); }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60px] h-[60px] rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center active:bg-white/20 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 16L4 8h12l-6 8z" fill="rgba(255,255,255,0.6)"/></svg>
            </button>
            {/* Left */}
            <button
              onTouchStart={(e) => { e.preventDefault(); changeDir("left"); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center active:bg-white/20 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l8-6v12l-8-6z" fill="rgba(255,255,255,0.6)"/></svg>
            </button>
            {/* Right */}
            <button
              onTouchStart={(e) => { e.preventDefault(); changeDir("right"); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center active:bg-white/20 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16 10l-8 6V4l8 6z" fill="rgba(255,255,255,0.6)"/></svg>
            </button>
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full bg-white/[0.03] border border-white/5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0f1a] select-none">
      <div className="flex items-center justify-between w-[400px] mb-2 px-1">
        <span className="text-xs text-white/40 font-mono">Score: {score}</span>
        <span className="text-xs text-white/30 font-mono">Best: {best}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-lg border border-white/10 cursor-pointer"
        onClick={handleAction}
      />
    </div>
  );
}
