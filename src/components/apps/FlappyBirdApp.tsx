"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CANVAS_W = 400;
const CANVAS_H = 500;
const BIRD_SIZE = 24;
const PIPE_W = 52;
const GAP = 130;
const GRAVITY = 0.18;
const JUMP = -4.2;
const PIPE_SPEED = 1.8;
const PIPE_INTERVAL = 2000;

interface Pipe {
  x: number;
  topH: number;
  scored: boolean;
}

export default function FlappyBirdApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "dead">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("flappybird-best") || "0", 10);
    }
    return 0;
  });

  const birdY = useRef(CANVAS_H / 2 - BIRD_SIZE / 2);
  const birdVel = useRef(0);
  const pipes = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const frameRef = useRef(0);
  const lastPipe = useRef(0);
  const gameStateRef = useRef(gameState);

  gameStateRef.current = gameState;

  const jump = useCallback(() => {
    if (gameStateRef.current === "idle") {
      birdY.current = CANVAS_H / 2 - BIRD_SIZE / 2;
      birdVel.current = 0;
      pipes.current = [];
      scoreRef.current = 0;
      lastPipe.current = 0;
      setScore(0);
      setGameState("playing");
      birdVel.current = JUMP;
    } else if (gameStateRef.current === "playing") {
      birdVel.current = JUMP;
    } else {
      // dead -> restart
      birdY.current = CANVAS_H / 2 - BIRD_SIZE / 2;
      birdVel.current = 0;
      pipes.current = [];
      scoreRef.current = 0;
      lastPipe.current = 0;
      setScore(0);
      setGameState("idle");
    }
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      grad.addColorStop(0, "#1a1a2e");
      grad.addColorStop(0.6, "#16213e");
      grad.addColorStop(1, "#0f3460");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Ground
      ctx.fillStyle = "#2a5e3f";
      ctx.fillRect(0, CANVAS_H - 40, CANVAS_W, 40);
      ctx.fillStyle = "#3a7e4f";
      ctx.fillRect(0, CANVAS_H - 40, CANVAS_W, 4);

      if (gameStateRef.current === "playing") {
        // Physics
        birdVel.current += GRAVITY;
        birdY.current += birdVel.current;

        // Spawn pipes
        frameRef.current++;
        if (frameRef.current - lastPipe.current > PIPE_INTERVAL / 16.67) {
          const topH = 60 + Math.random() * (CANVAS_H - GAP - 140);
          pipes.current.push({ x: CANVAS_W, topH, scored: false });
          lastPipe.current = frameRef.current;
        }

        // Move pipes
        for (const p of pipes.current) {
          p.x -= PIPE_SPEED;

          // Score
          if (!p.scored && p.x + PIPE_W < CANVAS_W / 2 - BIRD_SIZE / 2) {
            p.scored = true;
            scoreRef.current++;
            setScore(scoreRef.current);
          }
        }

        // Remove off-screen
        pipes.current = pipes.current.filter((p) => p.x + PIPE_W > -10);

        // Collision detection
        const bx = CANVAS_W / 2 - BIRD_SIZE / 2;
        const by = birdY.current;

        // Ground / ceiling
        if (by + BIRD_SIZE > CANVAS_H - 40 || by < 0) {
          setGameState("dead");
          setBest((prev) => { const n = Math.max(prev, scoreRef.current); localStorage.setItem("flappybird-best", String(n)); return n; });
        }

        // Pipes
        for (const p of pipes.current) {
          if (
            bx + BIRD_SIZE > p.x &&
            bx < p.x + PIPE_W &&
            (by < p.topH || by + BIRD_SIZE > p.topH + GAP)
          ) {
            setGameState("dead");
            setBest((prev) => { const n = Math.max(prev, scoreRef.current); localStorage.setItem("flappybird-best", String(n)); return n; });
          }
        }
      }

      // Draw pipes
      for (const p of pipes.current) {
        // Top pipe
        ctx.fillStyle = "#38b764";
        ctx.fillRect(p.x, 0, PIPE_W, p.topH);
        ctx.fillStyle = "#2a9d50";
        ctx.fillRect(p.x - 3, p.topH - 24, PIPE_W + 6, 24);

        // Bottom pipe
        const bottomY = p.topH + GAP;
        ctx.fillStyle = "#38b764";
        ctx.fillRect(p.x, bottomY, PIPE_W, CANVAS_H - bottomY - 40);
        ctx.fillStyle = "#2a9d50";
        ctx.fillRect(p.x - 3, bottomY, PIPE_W + 6, 24);
      }

      // Draw bird
      const bx = CANVAS_W / 2 - BIRD_SIZE / 2;
      const by = birdY.current;

      ctx.save();
      ctx.translate(bx + BIRD_SIZE / 2, by + BIRD_SIZE / 2);
      const angle = Math.min(Math.max(birdVel.current * 3, -30), 70) * (Math.PI / 180);
      ctx.rotate(angle);

      // Body
      ctx.fillStyle = "#f7d51d";
      ctx.beginPath();
      ctx.ellipse(0, 0, BIRD_SIZE / 2, BIRD_SIZE / 2.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(6, -4, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1a1a2e";
      ctx.beginPath();
      ctx.arc(7, -4, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = "#e74c3c";
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(17, -2);
      ctx.lineTo(17, 4);
      ctx.closePath();
      ctx.fill();

      // Wing
      ctx.fillStyle = "#e8c410";
      ctx.beginPath();
      ctx.ellipse(-4, 3, 7, 4, -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Score display
      ctx.fillStyle = "white";
      ctx.font = "bold 36px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText(String(scoreRef.current), CANVAS_W / 2, 60);
      ctx.shadowBlur = 0;

      // Overlay text
      if (gameStateRef.current === "idle") {
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "white";
        ctx.font = "bold 28px -apple-system, sans-serif";
        ctx.fillText("Flappy Bird", CANVAS_W / 2, CANVAS_H / 2 - 30);
        ctx.font = "16px -apple-system, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fillText("Click or press Space to start", CANVAS_W / 2, CANVAS_H / 2 + 10);
      }

      if (gameStateRef.current === "dead") {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "#e74c3c";
        ctx.font = "bold 32px -apple-system, sans-serif";
        ctx.fillText("Game Over", CANVAS_W / 2, CANVAS_H / 2 - 40);
        ctx.fillStyle = "white";
        ctx.font = "20px -apple-system, sans-serif";
        ctx.fillText(`Score: ${scoreRef.current}`, CANVAS_W / 2, CANVAS_H / 2);
        ctx.font = "16px -apple-system, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText("Click to try again", CANVAS_W / 2, CANVAS_H / 2 + 35);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Keyboard input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0f0f1a] select-none">
      <div className="flex items-center justify-between w-[400px] mb-2 px-1">
        <span className="text-[12px] text-white/40">Score: {score}</span>
        <span className="text-[12px] text-yellow-400/60">Best: {best}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="rounded-lg cursor-pointer"
        style={{ imageRendering: "pixelated" }}
        onClick={jump}
      />
    </div>
  );
}
