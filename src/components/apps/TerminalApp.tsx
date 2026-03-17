"use client";

import { useState, useRef, useEffect } from "react";

interface Line {
  type: "input" | "output";
  text: string;
}

const HELP_TEXT = `Available commands:
  help          Show this message
  about         Learn about me
  skills        List my tech stack
  projects      Show my projects
  contact       How to reach me
  experience    My work experience
  clear         Clear the terminal`;

const commands: Record<string, string> = {
  help: HELP_TEXT,
  about:
    "Hi! I'm a junior Web & Game Developer with 1 year of experience.\nI build modern web apps with Next.js and immersive games with Unity.\nI'm passionate about clean code and creative problem-solving.",
  skills:
    "Frontend: Next.js, React, TypeScript, JavaScript, Tailwind CSS, HTML5, CSS3\nGame Dev: Unity, C#\nTools: Git, Node.js, Figma",
  projects:
    "01 Portfolio Website    [Next.js, TypeScript, Tailwind]\n02 E-Commerce Store     [Next.js, React, Tailwind]\n03 2D Platformer Game    [Unity, C#]\n04 3D Adventure Game     [Unity, C#]\n\nType 'open projects' in the Dock to view details.",
  contact:
    "Email: marcoschronos@gmail.com\nGitHub: github.com/MarcoEvanz\nLinkedIn: linkedin.com/in/long-phạm-604272361\n\nFeel free to reach out!",
  experience:
    "Timeline:\n  2024 - Present | Junior Developer\n  • Building web apps with Next.js & React\n  • Developing games with Unity & C#\n  • 10+ projects completed",
  whoami: "visitor@portfolio",
  pwd: "/home/visitor/portfolio",
  ls: "about.txt  projects/  skills.json  contact.md  resume.pdf",
  date: new Date().toLocaleString(),
  echo: "",
  neofetch: `
  ╔══════════════════════╗     visitor@portfolio
  ║   ██████╗ ██████╗    ║     ─────────────────
  ║   ██╔══██╗██╔═══╝    ║     OS: PortfolioOS 1.0
  ║   ██║  ██║█████╗     ║     Host: Next.js 15
  ║   ██║  ██║██╔══╝     ║     Shell: terminal-app
  ║   ██████╔╝██║        ║     Skills: 12
  ║   ╚═════╝ ╚═╝        ║     Projects: 4
  ╚══════════════════════╝     Uptime: 1 year`,
};

export default function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([
    {
      type: "output",
      text: 'Welcome to PortfolioOS Terminal v1.0\nType "help" for available commands.\n',
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    const newLines: Line[] = [
      ...lines,
      { type: "input", text: `visitor@portfolio:~$ ${input}` },
    ];

    if (cmd === "clear") {
      setLines([]);
      setInput("");
      return;
    }

    if (cmd.startsWith("echo ")) {
      newLines.push({ type: "output", text: input.slice(5) });
    } else if (cmd === "") {
      // empty line
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
      className="h-full flex flex-col bg-[#0a0e17] font-mono text-[13px]"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-1">
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
            className="flex-1 bg-transparent outline-none text-dark-200 caret-primary-400"
            autoFocus
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}
