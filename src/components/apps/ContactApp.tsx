"use client";

import { FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
import { HiMail } from "react-icons/hi";

export default function ContactApp() {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-white mb-1">Get In Touch</h2>
        <p className="text-xs text-dark-400">
          I&apos;m open to new opportunities. Let&apos;s connect!
        </p>
      </div>

      <div className="h-px bg-white/5" />

      {/* Email */}
      <a
        href="mailto:your.email@example.com"
        className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-primary-500/10 border border-white/5 hover:border-primary-500/20 transition-all group"
      >
        <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
          <HiMail className="text-primary-400" />
        </div>
        <div>
          <p className="text-xs text-dark-200 font-medium group-hover:text-white transition-colors">
            your.email@example.com
          </p>
          <p className="text-[10px] text-dark-500">Email</p>
        </div>
      </a>

      {/* Social links */}
      <div className="space-y-2">
        <p className="text-[10px] text-dark-500 uppercase tracking-wider">
          Socials
        </p>
        {[
          {
            icon: FaGithub,
            label: "GitHub",
            handle: "@yourusername",
            href: "#",
          },
          {
            icon: FaLinkedin,
            label: "LinkedIn",
            handle: "in/yourname",
            href: "#",
          },
          {
            icon: FaDiscord,
            label: "Discord",
            handle: "yourname",
            href: "#",
          },
        ].map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors group"
          >
            <social.icon className="text-dark-500 group-hover:text-primary-400 transition-colors" />
            <span className="text-xs text-dark-300 group-hover:text-white transition-colors">
              {social.label}
            </span>
            <span className="text-[10px] text-dark-600 font-mono ml-auto">
              {social.handle}
            </span>
          </a>
        ))}
      </div>

      <div className="h-px bg-white/5" />

      {/* Quick message form */}
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <p className="text-[10px] text-dark-500 uppercase tracking-wider">
          Quick Message
        </p>
        <input
          type="text"
          placeholder="Your name"
          className="w-full px-3 py-2 bg-white/[0.03] border border-white/5 focus:border-primary-500/30 rounded-lg text-xs text-white placeholder-dark-600 outline-none transition-colors"
        />
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full px-3 py-2 bg-white/[0.03] border border-white/5 focus:border-primary-500/30 rounded-lg text-xs text-white placeholder-dark-600 outline-none transition-colors"
        />
        <textarea
          rows={3}
          placeholder="Your message..."
          className="w-full px-3 py-2 bg-white/[0.03] border border-white/5 focus:border-primary-500/30 rounded-lg text-xs text-white placeholder-dark-600 outline-none transition-colors resize-none"
        />
        <button className="w-full py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium rounded-lg transition-colors">
          Send Message
        </button>
      </form>
    </div>
  );
}
