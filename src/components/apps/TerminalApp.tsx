"use client";

import { useState, useRef, useEffect } from "react";
import { useDesktop } from "../DesktopContext";

interface Line {
  type: "input" | "output";
  text: string;
}

const HELP_TEXT = `Available commands:

  Portfolio
    about         Learn about me
    skills        List my tech stack
    projects      Show my projects
    contact       How to reach me
    experience    My work experience
    education     Education background
    games         Available games

  File System
    ls            List files
    cat <file>    Read a file
    tree          Show directory tree
    pwd           Print working directory
    cd <dir>      Change directory

  System
    neofetch      System info
    whoami        Current user
    hostname      Host name
    uname         OS info
    uptime        System uptime
    date          Current date & time
    history       Command history

  Utilities
    echo <text>   Print text
    open <app>    Open an app
    install <game> Install a game (alias: i)
    panic         Close all open apps
    help          Show this message
    clear         Clear the terminal

  Try: sudo, vim, nano, rm, exit 👀`;

const catFiles: Record<string, string> = {
  "about.txt":
    "┌─────────────────────────────────────┐\n│         Phạm Hoàng Long              │\n│    Web Developer & Game Developer    │\n└─────────────────────────────────────┘\n\nHi! I'm a passionate junior developer with 1 year of\nhands-on experience. I specialize in building modern\nweb applications with Next.js and crafting engaging\ngame experiences with Unity.\n\nMy approach combines clean code practices with\ncreative problem-solving. Every project is a chance\nto learn something new and push my limits further.\n\n📍 Ho Chi Minh City, Vietnam\n📧 marcoschronos@gmail.com",
  "skills.json":
    '{\n  "frontend": [\n    { "name": "HTML5",         "proficiency": 96 },\n    { "name": "CSS3",          "proficiency": 97 },\n    { "name": "Tailwind CSS",  "proficiency": 94 },\n    { "name": "JavaScript",    "proficiency": 92 },\n    { "name": "React",         "proficiency": 91 },\n    { "name": "Next.js",       "proficiency": 72 },\n    { "name": "TypeScript",    "proficiency": 69 }\n  ],\n  "gameDev": [\n    { "name": "Unity",         "proficiency": 76 },\n    { "name": "C#",            "proficiency": 68 }\n  ],\n  "tools": [\n    { "name": "Git",           "proficiency": 81 },\n    { "name": "Node.js",       "proficiency": 65 },\n    { "name": "Figma",         "proficiency": 60 }\n  ]\n}',
  "contact.md":
    "# Contact\n\n## Email\nmarcoschronos@gmail.com\n\n## Social\n- **GitHub**: [github.com/MarcoEvanz](https://github.com/MarcoEvanz)\n- **LinkedIn**: [Long Phạm](https://linkedin.com/in/long-pham-604272361)\n\n---\n_Feel free to reach out! I'm always open to new opportunities._",
  "resume.pdf":
    "[Permission denied: Binary file — use 'open about' to view my profile]",
};

const quotes = [
  '"The best way to predict the future is to invent it." — Alan Kay',
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"Talk is cheap. Show me the code." — Linus Torvalds',
  '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
  '"The only way to learn a new programming language is by writing programs in it." — Dennis Ritchie',
  '"Simplicity is the soul of efficiency." — Austin Freeman',
  '"Make it work, make it right, make it fast." — Kent Beck',
];

const builtInApps: Record<string, string> = {
  about: "about",
  projects: "projects",
  skills: "skills",
  terminal: "terminal",
  contact: "contact",
  appstore: "appstore",
  "app store": "appstore",
  store: "appstore",
};

const gameAliases: Record<string, { id: string; title: string }> = {
  flappybird: { id: "flappybird", title: "Flappy Bird" },
  "flappy bird": { id: "flappybird", title: "Flappy Bird" },
  flappy: { id: "flappybird", title: "Flappy Bird" },
  pvz2: { id: "pvz2", title: "PvZ2 Gardendless" },
  pvz: { id: "pvz2", title: "PvZ2 Gardendless" },
  snake: { id: "snake", title: "Snake" },
  dinojump: { id: "dinojump", title: "Dino Jump" },
  dino: { id: "dinojump", title: "Dino Jump" },
  "dino jump": { id: "dinojump", title: "Dino Jump" },
};

const commands: Record<string, string> = {
  help: HELP_TEXT,
  about:
    "Hi! I'm a junior Web & Game Developer with 1 year of experience.\nI build modern web apps with Next.js and immersive games with Unity.\nI'm passionate about clean code and creative problem-solving.",
  skills:
    "Frontend: Next.js, React, TypeScript, JavaScript, Tailwind CSS, HTML5, CSS3\nGame Dev: Unity, C#\nTools: Git, Node.js, Figma",
  projects:
    "01 Portfolio Website              [Next.js, TypeScript, Tailwind]\n02 Website Đoàn Thanh Niên         [Next.js, React, Tailwind]\n03 Buffalo 5-Reel Deluxe Classic   [Unity, C#]\n04 Slots Vacation: Slot Machines   [Unity, C#]\n05 PvZ2 Gardenless                 [Cocos, TypeScript]\n\nTip: type 'open projects' to launch the Projects app.",
  contact:
    "Email: marcoschronos@gmail.com\nGitHub: github.com/MarcoEvanz\nLinkedIn: linkedin.com/in/long-pham-604272361\n\nFeel free to reach out!",
  experience:
    "Timeline:\n  2024 - Present | Junior Developer\n  • Building web apps with Next.js & React\n  • Developing games with Unity & C#\n  • 5+ projects completed",
  education:
    "🎓 Education:\n  • Self-taught Developer\n  • Continuous online learning\n  • Focus: Web Development & Game Development\n  • Learning platforms: Udemy, YouTube, Documentation",
  games: "", // handled dynamically
  whoami: "visitor@portfolio",
  pwd: "/home/visitor/portfolio",
  ls: "about.txt  projects/  skills.json  contact.md  resume.pdf  games/",
  hostname: "portfolio.local",
  uname: "PortfolioOS 1.0 x86_64 Next.js/16.1.6 TypeScript/5.x",
  uptime: "1 year, 0 days — 100% availability, 0 incidents",
  date: new Date().toLocaleString(),
  echo: "",
  tree: `📁 /home/visitor/portfolio
├── 📄 about.txt
├── 📁 projects/
│   ├── 🌐 portfolio-website/
│   ├── 🌐 doan-thanh-nien/
│   ├── 🎮 buffalo-5-reel/
│   ├── 🎮 slots-vacation/
│   └── 🎮 pvz2-gardenless/
├── 📄 skills.json
├── 📄 contact.md
├── 📄 resume.pdf
└── 📁 games/
    ├── 🕹️  flappy-bird/
    ├── 🕹️  pvz2/
    ├── 🕹️  snake/
    └── 🕹️  dino-jump/

6 directories, 4 files`,
  neofetch: `
  ╔══════════════════════╗     visitor@portfolio
  ║   ██████╗ ██████╗    ║     ─────────────────
  ║   ██╔══██╗██╔═══╝    ║     OS: PortfolioOS 1.0
  ║   ██║  ██║█████╗     ║     Host: Next.js 16
  ║   ██║  ██║██╔══╝     ║     Shell: terminal-app
  ║   ██████╔╝██║        ║     Skills: 12
  ║   ╚═════╝ ╚═╝        ║     Projects: 5
  ╚══════════════════════╝     Uptime: 1 year`,
  // Easter eggs
  sudo: "🔒 Nice try! You don't have root access on this portfolio.",
  "sudo rm -rf /": "🚫 Absolutely not. This portfolio is too beautiful to destroy.",
  vim: "😅 You've entered vim. Just kidding — there's no escape here either.\n\n(Type 'help' for available commands)",
  nano: "📝 nano: command not found. We use vim here... just kidding.\n\n(Type 'help' for available commands)",
  exit: "👋 Goodbye! Just kidding, you can't leave that easily.\nThis portfolio still has more to show you!",
  rm: "🚫 Permission denied. No files were harmed in the making of this portfolio.",
  "rm -rf": "🚫 Permission denied. No files were harmed in the making of this portfolio.",
  "rm -rf /": "🚫 Absolutely not. This portfolio is too beautiful to destroy.",
};

const allGames = [
  { id: "flappybird", name: "Flappy Bird", desc: "Tap to fly through pipes" },
  { id: "pvz2", name: "PvZ2 Gardenless", desc: "Plants vs Zombies web remake" },
  { id: "snake", name: "Snake", desc: "Classic arcade snake game" },
  { id: "dinojump", name: "Dino Jump", desc: "Endless runner dinosaur game" },
];

export default function TerminalApp() {
  const { isMobile, openApp, installApp, closeAllApps, installedApps } = useDesktop();
  const [lines, setLines] = useState<Line[]>([
    {
      type: "output",
      text: 'Welcome to PortfolioOS Terminal v1.0\nType "help" for available commands.\n',
    },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isInstalling, setIsInstalling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = historyIdx < cmdHistory.length - 1 ? historyIdx + 1 : historyIdx;
      setHistoryIdx(next);
      setInput(cmdHistory[cmdHistory.length - 1 - next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx <= 0) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        const next = historyIdx - 1;
        setHistoryIdx(next);
        setInput(cmdHistory[cmdHistory.length - 1 - next]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInstalling) return;
    const raw = input.trim();
    const cmd = raw.toLowerCase();
    const newLines: Line[] = [
      ...lines,
      { type: "input", text: `visitor@portfolio:~$ ${raw}` },
    ];

    if (raw) {
      setCmdHistory((prev) => [...prev, raw]);
      setHistoryIdx(-1);
    }

    if (cmd === "clear") {
      setLines([]);
      setInput("");
      return;
    }

    if (cmd === "") {
      // empty line
    } else if (cmd.startsWith("echo ")) {
      newLines.push({ type: "output", text: raw.slice(5) });
    } else if (cmd.startsWith("cat ")) {
      const file = cmd.slice(4).trim();
      if (file in catFiles) {
        newLines.push({ type: "output", text: catFiles[file] });
      } else if (file === "projects/" || file === "games/") {
        newLines.push({ type: "output", text: `cat: ${file}: Is a directory. Try 'ls' or 'tree' instead.` });
      } else {
        newLines.push({ type: "output", text: `cat: ${file}: No such file or directory` });
      }
    } else if (cmd === "open" || cmd === "open -ls") {
      const builtInList = Object.entries(builtInApps)
        .filter(([, v], i, arr) => arr.findIndex(([, v2]) => v2 === v) === i)
        .map(([key]) => `  ${key}`);
      const gameList = allGames.map((g) => {
        const installed = installedApps.includes(g.id);
        return `  ${g.id.padEnd(14)} ${installed ? "✅ installed" : "⬇️  not installed"}`;
      });
      newLines.push({ type: "output", text: `Usage: open <app>\n\n📱 Built-in Apps:\n${builtInList.join("\n")}\n\n🎮 Games:\n${gameList.join("\n")}\n\nTip: install games from 'open appstore'` });
    } else if (cmd.startsWith("open ")) {
      const appName = cmd.slice(5).trim();
      if (appName in builtInApps) {
        openApp(builtInApps[appName]);
        newLines.push({ type: "output", text: `Opening ${appName}...` });
      } else if (appName in gameAliases) {
        const game = gameAliases[appName];
        if (installedApps.includes(game.id)) {
          openApp(game.id);
          newLines.push({ type: "output", text: `Opening ${game.title}...` });
        } else {
          newLines.push({ type: "output", text: `${game.title} is not installed yet.\nType 'open appstore' to install it.` });
        }
      } else {
        newLines.push({ type: "output", text: `open: ${appName}: Application not found.\nType 'open -ls' to see available apps.` });
      }
    } else if (cmd === "install" || cmd === "i" || cmd === "install -ls") {
      const gameLines = allGames.map((g) => {
        const installed = installedApps.includes(g.id);
        return `  ${g.id.padEnd(14)} ${installed ? "✅ already installed" : "available"}`;
      });
      newLines.push({ type: "output", text: `Usage: install <game>  (or: i <game>)\n\n🎮 Games:\n${gameLines.join("\n")}\n\nAliases: ${Object.keys(gameAliases).join(", ")}` });
    } else if (cmd.startsWith("install ") || cmd.startsWith("i ")) {
      const arg = cmd.startsWith("install ") ? cmd.slice(8).trim() : cmd.slice(2).trim();
      if (arg in gameAliases) {
        const game = gameAliases[arg];
        if (installedApps.includes(game.id)) {
          newLines.push({ type: "output", text: `${game.title} is already installed.\nType 'open ${arg}' to launch it.` });
        } else {
          // Animated install sequence
          newLines.push({ type: "output", text: `📦 install: resolving ${game.title}...` });
          setLines(newLines);
          setInput("");
          setIsInstalling(true);
          const steps = [
            { delay: 400, text: `📡 Fetching ${game.title} from PortfolioOS Store...` },
            { delay: 800, text: `⬇️  Downloading... [##                  ]  10%` },
            { delay: 1100, text: `⬇️  Downloading... [######              ]  30%` },
            { delay: 1400, text: `⬇️  Downloading... [############        ]  60%` },
            { delay: 1700, text: `⬇️  Downloading... [##################  ]  90%` },
            { delay: 2000, text: `⬇️  Downloading... [####################] 100%` },
            { delay: 2300, text: `📂 Unpacking ${game.title}...` },
            { delay: 2700, text: `⚙️  Setting up ${game.title}...` },
            { delay: 3200, text: `✅ ${game.title} installed successfully!\n\nType 'open ${arg}' to play.` },
          ];
          steps.forEach(({ delay, text }) => {
            setTimeout(() => {
              setLines((prev) => [...prev, { type: "output", text }]);
            }, delay);
          });
          setTimeout(() => {
            installApp(game.id);
            setIsInstalling(false);
          }, 3200);
          return;
        }
      } else {
        newLines.push({ type: "output", text: `install: ${arg}: Package not found.\nType 'install -ls' to see available games.` });
      }
    } else if (cmd.startsWith("cd ")) {
      const dir = cmd.slice(3).trim();
      if (dir === "~" || dir === "/" || dir === ".." || dir === ".") {
        newLines.push({ type: "output", text: "📁 You're already home. This is a single-page portfolio!" });
      } else {
        newLines.push({ type: "output", text: `cd: ${dir}: Permission denied — but feel free to explore with 'ls' and 'cat'` });
      }
    } else if (cmd === "history") {
      const hist = cmdHistory.map((c, i) => `  ${String(i + 1).padStart(4)}  ${c}`).join("\n");
      newLines.push({ type: "output", text: hist || "No commands in history yet." });
    } else if (cmd === "fortune" || cmd === "quote") {
      newLines.push({ type: "output", text: quotes[Math.floor(Math.random() * quotes.length)] });
    } else if (cmd === "games") {
      const gameLines = allGames.map((g) => {
        const installed = installedApps.includes(g.id);
        const status = installed ? "✅ Installed" : "⬇️  Not installed";
        return `  ${(installed ? "• " : "  ") + g.name.padEnd(20)} ${g.desc.padEnd(32)} ${status}`;
      });
      newLines.push({ type: "output", text: `🎮 Games:\n${gameLines.join("\n")}\n\nInstalled games can be opened with 'open <game>'.\nInstall more from 'open appstore'.` });
    } else if (cmd === "panic") {
      closeAllApps();
      newLines.push({ type: "output", text: "🚨 PANIC! All applications have been terminated.\n\n  Killed all running processes.\n  Freed memory.\n  Desktop cleared.\n\nCalm restored. Type 'open <app>' to start fresh." });
    } else if (cmd.startsWith("sudo ") && !(cmd in commands)) {
      newLines.push({ type: "output", text: commands["sudo"] });
    } else if (cmd.startsWith("rm ") && !(cmd in commands)) {
      newLines.push({ type: "output", text: commands["rm"] });
    } else if (cmd in commands) {
      newLines.push({
        type: "output",
        text: cmd === "date" ? new Date().toLocaleString() : commands[cmd],
      });
    } else {
      newLines.push({
        type: "output",
        text: `Command not found: ${cmd}. Type "help" for available commands.`,
      });
    }

    setLines(newLines);
    setInput("");
  };

  return (
    <div
      className={`h-full flex flex-col bg-[#0a0e17] font-mono ${isMobile ? "text-[12px]" : "text-[13px]"}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className={`flex-1 overflow-auto ${isMobile ? "p-3" : "p-4"} space-y-1`}>
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line.type === "input" ? (
              <span>
                <span className="text-green-400">visitor</span>
                <span className="text-dark-500">@</span>
                <span className="text-primary-400">portfolio</span>
                <span className="text-dark-500">:~$ </span>
                <span className="text-dark-200">
                  {line.text.replace("visitor@portfolio:~$ ", "")}
                </span>
              </span>
            ) : (
              <span className="text-dark-400">{line.text}</span>
            )}
          </div>
        ))}

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-green-400">visitor</span>
          <span className="text-dark-500">@</span>
          <span className="text-primary-400">portfolio</span>
          <span className="text-dark-500">:~$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isInstalling}
            className="flex-1 bg-transparent outline-none text-dark-200 caret-primary-400 disabled:opacity-40"
            autoFocus
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}
