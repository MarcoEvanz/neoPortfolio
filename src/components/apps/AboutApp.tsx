"use client";

export default function AboutApp() {
  return (
    <div className="p-6 space-y-6">
      {/* Profile header */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shrink-0">
          D
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Your Name</h1>
          <p className="text-primary-400 text-sm font-medium">
            Web Developer & Game Developer
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-dark-400">
              Available for opportunities
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/5" />

      {/* Bio */}
      <div>
        <h2 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
          About
        </h2>
        <p className="text-sm text-dark-300 leading-relaxed">
          I&apos;m a passionate junior developer with 1 year of hands-on
          experience. I specialize in building modern web applications with{" "}
          <span className="text-primary-400">Next.js</span> and crafting
          engaging game experiences with{" "}
          <span className="text-primary-400">Unity</span>.
        </p>
        <p className="text-sm text-dark-300 leading-relaxed mt-3">
          My approach combines clean code practices with creative
          problem-solving. Every project is a chance to learn something new and
          push my limits further.
        </p>
      </div>

      {/* Quick info grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Experience", value: "1+ Year" },
          { label: "Projects", value: "10+" },
          { label: "Location", value: "Your City" },
          { label: "Focus", value: "Web & Games" },
        ].map((item) => (
          <div
            key={item.label}
            className="p-3 rounded-lg bg-white/[0.03] border border-white/5"
          >
            <p className="text-[10px] text-dark-500 uppercase tracking-wider">
              {item.label}
            </p>
            <p className="text-sm text-white font-semibold mt-0.5">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Education or extras */}
      <div>
        <h2 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
          What I Do
        </h2>
        <div className="space-y-2">
          {[
            {
              emoji: "🌐",
              title: "Web Development",
              desc: "Next.js, React, TypeScript, Tailwind",
            },
            {
              emoji: "🎮",
              title: "Game Development",
              desc: "Unity, C#, 2D & 3D games",
            },
            {
              emoji: "⚡",
              title: "Fast Learner",
              desc: "Quickly picking up new technologies",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-lg">{item.emoji}</span>
              <div>
                <p className="text-sm text-white font-medium">{item.title}</p>
                <p className="text-xs text-dark-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
