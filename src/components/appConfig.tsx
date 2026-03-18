"use client";

import { HiUser, HiCode, HiTerminal, HiMail, HiCube, HiShoppingCart } from "react-icons/hi";
import { IoGameController, IoLeaf, IoFlash } from "react-icons/io5";
import AboutApp from "./apps/AboutApp";
import ProjectsApp from "./apps/ProjectsApp";
import SkillsApp from "./apps/SkillsApp";
import TerminalApp from "./apps/TerminalApp";
import ContactApp from "./apps/ContactApp";
import AppStoreApp from "./apps/AppStoreApp";
import FlappyBirdApp from "./apps/FlappyBirdApp";
import PvZ2App from "./apps/PvZ2App";
import SnakeApp from "./apps/SnakeApp";
import DinoJumpApp from "./apps/DinoJumpApp";
import FlashPlayerApp from "./apps/FlashPlayerApp";

export interface AppConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  component: React.ReactNode;
  defaultPos: { x: number; y: number };
  defaultSize: { w: number; h: number };
  isGame?: boolean;
}

export const apps: AppConfig[] = [
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
    defaultSize: { w: 750, h: 540 },
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

export const downloadableApps: AppConfig[] = [
  {
    id: "flappybird",
    title: "Flappy Bird",
    icon: <IoGameController />,
    iconBg: "from-yellow-400 to-orange-500",
    component: <FlappyBirdApp />,
    defaultPos: { x: 200, y: 60 },
    defaultSize: { w: 440, h: 600 },
    isGame: true,
  },
  {
    id: "pvz2",
    title: "PvZ2 Gardendless",
    icon: <IoLeaf />,
    iconBg: "from-green-500 to-lime-400",
    component: <PvZ2App />,
    defaultPos: { x: 100, y: 40 },
    defaultSize: { w: 960, h: 640 },
    isGame: true,
  },
  {
    id: "snake",
    title: "Snake",
    icon: <IoGameController />,
    iconBg: "from-emerald-400 to-teal-600",
    component: <SnakeApp />,
    defaultPos: { x: 180, y: 70 },
    defaultSize: { w: 450, h: 520 },
    isGame: true,
  },
  {
    id: "dinojump",
    title: "Dino Jump",
    icon: <IoGameController />,
    iconBg: "from-slate-400 to-slate-600",
    component: <DinoJumpApp />,
    defaultPos: { x: 140, y: 50 },
    defaultSize: { w: 650, h: 400 },
    isGame: true,
  },
  {
    id: "flashplayer",
    title: "Flash Player",
    icon: <IoFlash />,
    iconBg: "from-red-500 to-orange-500",
    component: <FlashPlayerApp />,
    defaultPos: { x: 100, y: 40 },
    defaultSize: { w: 800, h: 600 },
  },
];
