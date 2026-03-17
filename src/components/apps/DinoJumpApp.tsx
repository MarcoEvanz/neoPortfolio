"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const W = 600;
const H = 200;
const GROUND_Y = H - 24;
const GRAVITY = 0.35;
const GRAVITY_FAST = 0.9; // when key released early or pressing down
const JUMP_VEL = -10;
const INITIAL_SPEED = 6;
const MAX_SPEED = 13;
const SPEED_INC = 0.001;
const PX = 2; // pixel scale
const NIGHT_TOGGLE_SCORE = 700; // toggle day/night every N points
const NIGHT_TRANSITION_FRAMES = 60; // frames to fade between day/night

// Original pixel-art dino sprite (each row is an array of [x,y] offsets at 1x scale)
// Standing frame - a small bipedal dinosaur
const DINO_STAND = [
  // head
  [4,0],[5,0],[6,0],[7,0],[8,0],
  [3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],
  [3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],
  [3,3],[4,3],[8,3],[9,3], // eye gap
  [3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],
  [3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],
  [3,6],[4,6],[5,6],[6,6],[7,6],
  // body
  [1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],
  [0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],
  [0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],
  [1,10],[2,10],[3,10],[4,10],[5,10],[6,10],[7,10],
  [2,11],[3,11],[4,11],[5,11],[6,11],
  [3,12],[4,12],[5,12],[6,12],
  // legs standing
  [3,13],[4,13],[6,13],[7,13],
  [3,14],[4,14],[6,14],[7,14],
  [2,15],[3,15],[6,15],[7,15],
];

// Run frame 1 - left leg forward
const DINO_RUN1 = [
  [4,0],[5,0],[6,0],[7,0],[8,0],
  [3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],
  [3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],
  [3,3],[4,3],[8,3],[9,3],
  [3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],
  [3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],
  [3,6],[4,6],[5,6],[6,6],[7,6],
  [1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],
  [0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],
  [0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],
  [1,10],[2,10],[3,10],[4,10],[5,10],[6,10],[7,10],
  [2,11],[3,11],[4,11],[5,11],[6,11],
  [3,12],[4,12],[5,12],[6,12],
  [3,13],[4,13],[7,13],
  [2,14],[3,14],[7,14],[8,14],
  [2,15],
];

// Run frame 2 - right leg forward
const DINO_RUN2 = [
  [4,0],[5,0],[6,0],[7,0],[8,0],
  [3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],
  [3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],
  [3,3],[4,3],[8,3],[9,3],
  [3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],
  [3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],
  [3,6],[4,6],[5,6],[6,6],[7,6],
  [1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],
  [0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],
  [0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],
  [1,10],[2,10],[3,10],[4,10],[5,10],[6,10],[7,10],
  [2,11],[3,11],[4,11],[5,11],[6,11],
  [3,12],[4,12],[5,12],[6,12],
  [4,13],[5,13],[6,13],[7,13],
  [3,14],[4,14],[7,14],[8,14],
  [8,15],
];

// Dead dino - eyes become X
const DINO_DEAD = [
  [4,0],[5,0],[6,0],[7,0],[8,0],
  [3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],
  [3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],
  [3,3],[4,3],[6,3],[8,3],[9,3], // X eye
  [3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],
  [3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],
  [3,6],[4,6],[5,6],[6,6],[7,6],
  [1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],
  [0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],
  [0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],
  [1,10],[2,10],[3,10],[4,10],[5,10],[6,10],[7,10],
  [2,11],[3,11],[4,11],[5,11],[6,11],
  [3,12],[4,12],[5,12],[6,12],
  [3,13],[4,13],[6,13],[7,13],
  [3,14],[4,14],[6,14],[7,14],
  [2,15],[3,15],[6,15],[7,15],
];

// Small cactus
const CACTUS_SM: [number, number][] = [
  [2,0],[3,0],
  [2,1],[3,1],
  [2,2],[3,2],[5,2],
  [2,3],[3,3],[5,3],
  [0,4],[1,4],[2,4],[3,4],[5,4],
  [0,5],[2,5],[3,5],[4,5],[5,5],
  [0,6],[1,6],[2,6],[3,6],
  [2,7],[3,7],
  [2,8],[3,8],
  [2,9],[3,9],
  [2,10],[3,10],
];

// Large cactus
const CACTUS_LG: [number, number][] = [
  [3,0],[4,0],
  [3,1],[4,1],
  [3,2],[4,2],
  [0,3],[1,3],[3,3],[4,3],[7,3],[8,3],
  [0,4],[1,4],[3,4],[4,4],[7,4],[8,4],
  [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],
  [3,6],[4,6],
  [3,7],[4,7],
  [3,8],[4,8],
  [3,9],[4,9],
  [3,10],[4,10],
  [3,11],[4,11],
  [3,12],[4,12],
];

// Cloud sprite
const CLOUD: [number, number][] = [
  [4,0],[5,0],[6,0],[7,0],
  [2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],
  [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],
  [1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],
];

// 2 small cacti side by side
const CACTUS_SM2: [number, number][] = [
  ...CACTUS_SM,
  ...CACTUS_SM.map(([px, py]): [number, number] => [px + 5, py]),
];

// 3 small cacti side by side
const CACTUS_SM3: [number, number][] = [
  ...CACTUS_SM,
  ...CACTUS_SM.map(([px, py]): [number, number] => [px + 5, py]),
  ...CACTUS_SM.map(([px, py]): [number, number] => [px + 10, py]),
];

// 2 large cacti side by side
const CACTUS_LG2: [number, number][] = [
  ...CACTUS_LG,
  ...CACTUS_LG.map(([px, py]): [number, number] => [px + 8, py]),
];

type CactusType = "sm" | "sm2" | "sm3" | "lg" | "lg2";

const CACTUS_INFO: Record<CactusType, { sprite: [number, number][]; h: number; w: number }> = {
  sm:  { sprite: CACTUS_SM,  h: 11, w: 6 },
  sm2: { sprite: CACTUS_SM2, h: 11, w: 11 },
  sm3: { sprite: CACTUS_SM3, h: 11, w: 16 },
  lg:  { sprite: CACTUS_LG,  h: 13, w: 9 },
  lg2: { sprite: CACTUS_LG2, h: 13, w: 17 },
};

interface Obstacle {
  x: number;
  type: CactusType;
}

interface Cloud {
  x: number;
  y: number;
}

export default function DinoJumpApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "dead">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window !== "undefined") return parseInt(localStorage.getItem("dino-best") || "0", 10);
    return 0;
  });

  const dinoY = useRef(GROUND_Y - 16 * PX);
  const dinoVel = useRef(0);
  const isJumping = useRef(false);
  const holdingJump = useRef(false); // true while jump key is held
  const obstacles = useRef<Obstacle[]>([]);
  const clouds = useRef<Cloud[]>([]);
  const speed = useRef(INITIAL_SPEED);
  const frameCount = useRef(0);
  const scoreRef = useRef(0);
  const gameStateRef = useRef(gameState);
  const animRef = useRef(0);
  const lastObstacle = useRef(0);
  const groundOffset = useRef(0);
  const isNight = useRef(false);
  const nightAlpha = useRef(0); // 0 = day, 1 = full night
  const lastNightToggle = useRef(0); // score at last toggle

  gameStateRef.current = gameState;

  const drawPixels = useCallback((ctx: CanvasRenderingContext2D, pixels: [number, number][] | number[][], ox: number, oy: number, color: string) => {
    ctx.fillStyle = color;
    for (const [px, py] of pixels) {
      ctx.fillRect(ox + px * PX, oy + py * PX, PX, PX);
    }
  }, []);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const n = nightAlpha.current;
    // Interpolate colors between day and night
    const lerp = (a: number, b: number) => Math.round(a + (b - a) * n);
    const bgR = lerp(247, 30), bgG = lerp(247, 30), bgB = lerp(247, 35);
    const fgR = lerp(83, 230), fgG = lerp(83, 230), fgB = lerp(83, 230);
    const subR = lerp(176, 100), subG = lerp(176, 100), subB = lerp(176, 100);
    const cloudR = lerp(224, 60), cloudG = lerp(224, 60), cloudB = lerp(224, 65);

    const bgColor = `rgb(${bgR},${bgG},${bgB})`;
    const fgColor = `rgb(${fgR},${fgG},${fgB})`;
    const subColor = `rgb(${subR},${subG},${subB})`;
    const cloudColor = `rgb(${cloudR},${cloudG},${cloudB})`;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    // Stars (only visible at night)
    if (n > 0.1) {
      ctx.fillStyle = `rgba(255,255,255,${n * 0.6})`;
      for (let i = 0; i < 20; i++) {
        const sx = (i * 97 + 13) % W;
        const sy = (i * 53 + 7) % (GROUND_Y - 30);
        ctx.fillRect(sx, sy, 2, 2);
      }
      // Moon
      ctx.fillStyle = `rgba(255,255,255,${n * 0.4})`;
      ctx.beginPath();
      ctx.arc(W - 60, 35, 12, 0, Math.PI * 2);
      ctx.fill();
      // Moon crater
      ctx.fillStyle = `rgba(${bgR},${bgG},${bgB},${n * 0.5})`;
      ctx.beginPath();
      ctx.arc(W - 55, 33, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Clouds
    clouds.current.forEach((c) => {
      drawPixels(ctx, CLOUD, c.x, c.y, cloudColor);
    });

    // Ground line
    ctx.fillStyle = fgColor;
    ctx.fillRect(0, GROUND_Y, W, 1);

    // Ground texture - bumpy dots
    const go = Math.floor(groundOffset.current) % 24;
    ctx.fillStyle = subColor;
    for (let x = -go; x < W; x += 12) {
      ctx.fillRect(x, GROUND_Y + 4, 3, 1);
      ctx.fillRect(x + 6, GROUND_Y + 8, 2, 1);
      ctx.fillRect(x + 3, GROUND_Y + 12, 4, 1);
    }

    // Obstacles
    obstacles.current.forEach((obs) => {
      const info = CACTUS_INFO[obs.type];
      drawPixels(ctx, info.sprite, obs.x, GROUND_Y - info.h * PX, fgColor);
    });

    // Dino
    const dinoX = 44;
    let dinoSprite: number[][];
    if (gameStateRef.current === "dead") {
      dinoSprite = DINO_DEAD;
    } else if (isJumping.current) {
      dinoSprite = DINO_STAND;
    } else if (gameStateRef.current === "playing") {
      dinoSprite = Math.floor(frameCount.current / 5) % 2 === 0 ? DINO_RUN1 : DINO_RUN2;
    } else {
      dinoSprite = DINO_STAND;
    }
    drawPixels(ctx, dinoSprite, dinoX, dinoY.current, fgColor);

    // Score
    ctx.fillStyle = fgColor;
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "right";
    ctx.fillText(String(scoreRef.current).padStart(5, "0"), W - 12, 20);

    // HI score
    if (best > 0 || scoreRef.current > 0) {
      ctx.fillStyle = subColor;
      ctx.font = "bold 14px monospace";
      ctx.fillText("HI " + String(Math.max(best, scoreRef.current)).padStart(5, "0") + "  ", W - 90, 20);
    }

    // Overlays
    if (gameStateRef.current === "idle") {
      ctx.fillStyle = `rgba(${bgR},${bgG},${bgB},0.7)`;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = fgColor;
      ctx.font = "bold 18px monospace";
      ctx.textAlign = "center";
      ctx.fillText("DINO JUMP", W / 2, H / 2 - 16);
      ctx.font = "12px monospace";
      ctx.fillStyle = subColor;
      ctx.fillText("Press Space or Click to start", W / 2, H / 2 + 8);
    } else if (gameStateRef.current === "dead") {
      ctx.fillStyle = fgColor;
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "center";
      ctx.fillText("G A M E  O V E R", W / 2, H / 2 - 20);

      // Restart icon (circular arrow)
      const cx = W / 2;
      const cy = H / 2 + 10;
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0.3, Math.PI * 1.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 10, cy - 7);
      ctx.lineTo(cx + 12, cy - 1);
      ctx.lineTo(cx + 5, cy - 2);
      ctx.closePath();
      ctx.fillStyle = fgColor;
      ctx.fill();
    }
  }, [best, drawPixels]);

  const gameLoop = useCallback(() => {
    if (gameStateRef.current !== "playing") return;

    frameCount.current++;
    speed.current = Math.min(speed.current + SPEED_INC, MAX_SPEED);
    groundOffset.current += speed.current;

    // Dino physics — hold key for high jump, release for short jump
    if (isJumping.current) {
      const grav = holdingJump.current && dinoVel.current < 0 ? GRAVITY : GRAVITY_FAST;
      dinoVel.current += grav;
      dinoY.current += dinoVel.current;
      if (dinoY.current >= GROUND_Y - 16 * PX) {
        dinoY.current = GROUND_Y - 16 * PX;
        dinoVel.current = 0;
        isJumping.current = false;
        holdingJump.current = false;
      }
    }

    // Spawn clouds
    if (frameCount.current % 200 === 0) {
      clouds.current.push({ x: W + 10, y: 20 + Math.random() * 50 });
    }
    clouds.current.forEach((c) => { c.x -= speed.current * 0.3; });
    clouds.current = clouds.current.filter((c) => c.x > -30);

    // Spawn obstacles — more variety as speed increases
    const minGap = Math.max(50, 100 - speed.current * 4);
    if (frameCount.current - lastObstacle.current > minGap) {
      const r = Math.random();
      let type: CactusType;
      if (speed.current < 8) {
        type = r < 0.5 ? "sm" : "lg";
      } else {
        if (r < 0.2) type = "sm";
        else if (r < 0.35) type = "sm2";
        else if (r < 0.5) type = "sm3";
        else if (r < 0.75) type = "lg";
        else type = "lg2";
      }
      obstacles.current.push({ x: W + 10, type });
      lastObstacle.current = frameCount.current;
    }

    // Move obstacles
    obstacles.current.forEach((obs) => { obs.x -= speed.current; });
    obstacles.current = obstacles.current.filter((obs) => obs.x > -40);

    // Score
    scoreRef.current = Math.floor(frameCount.current / 6);
    setScore(scoreRef.current);

    // Day/night cycle — toggle every NIGHT_TOGGLE_SCORE points
    const sinceToggle = scoreRef.current - lastNightToggle.current;
    if (sinceToggle >= NIGHT_TOGGLE_SCORE) {
      isNight.current = !isNight.current;
      lastNightToggle.current = scoreRef.current;
    }
    // Smooth transition
    const targetAlpha = isNight.current ? 1 : 0;
    if (nightAlpha.current < targetAlpha) {
      nightAlpha.current = Math.min(nightAlpha.current + 1 / NIGHT_TRANSITION_FRAMES, 1);
    } else if (nightAlpha.current > targetAlpha) {
      nightAlpha.current = Math.max(nightAlpha.current - 1 / NIGHT_TRANSITION_FRAMES, 0);
    }

    // Collision
    const dLeft = 44 + 4 * PX;
    const dRight = 44 + 9 * PX;
    const dBottom = dinoY.current + 16 * PX;

    for (const obs of obstacles.current) {
      const info = CACTUS_INFO[obs.type];
      const oLeft = obs.x + PX;
      const oRight = obs.x + info.w * PX - PX;
      const oTop = GROUND_Y - info.h * PX;

      if (dRight > oLeft && dLeft < oRight && dBottom > oTop) {
        gameStateRef.current = "dead";
        setGameState("dead");
        const b = Math.max(scoreRef.current, best);
        setBest(b);
        localStorage.setItem("dino-best", String(b));
        draw();
        return;
      }
    }

    draw();
    animRef.current = requestAnimationFrame(gameLoop);
  }, [best, draw]);

  const jump = useCallback(() => {
    if (!isJumping.current && gameStateRef.current === "playing") {
      isJumping.current = true;
      holdingJump.current = true;
      dinoVel.current = JUMP_VEL;
    }
  }, []);

  const startGame = useCallback(() => {
    dinoY.current = GROUND_Y - 16 * PX;
    dinoVel.current = 0;
    isJumping.current = false;
    holdingJump.current = false;
    isNight.current = false;
    nightAlpha.current = 0;
    lastNightToggle.current = 0;
    obstacles.current = [];
    clouds.current = [{ x: 100, y: 30 }, { x: 300, y: 50 }, { x: 480, y: 25 }];
    speed.current = INITIAL_SPEED;
    frameCount.current = 0;
    lastObstacle.current = 0;
    scoreRef.current = 0;
    groundOffset.current = 0;
    setScore(0);
    setGameState("playing");
  }, []);

  const handleAction = useCallback(() => {
    if (gameStateRef.current === "idle" || gameStateRef.current === "dead") {
      startGame();
    } else {
      jump();
    }
  }, [startGame, jump]);

  // Game loop
  useEffect(() => {
    if (gameState === "playing") {
      animRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [gameState, gameLoop]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  // Keyboard — hold for high jump, release for short jump, down for fast fall
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        handleAction();
      }
      if (e.code === "ArrowDown" && isJumping.current) {
        holdingJump.current = false;
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        holdingJump.current = false;
      }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [handleAction]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#f7f7f7] select-none" style={{ background: "#f7f7f7" }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="cursor-pointer"
        onClick={handleAction}
      />
    </div>
  );
}
