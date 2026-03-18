"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { useDesktop } from "../DesktopContext";

export default function ContactApp() {
  const { isMobile } = useDesktop();
  return (
    <div className={`${isMobile ? "p-4" : "p-6"} space-y-5`}>
      <div>
        <h2 className="text-sm font-semibold text-white mb-1">Get In Touch</h2>
        <p className="text-xs text-dark-400">
          I&apos;m open to new opportunities. Let&apos;s connect!
        </p>
      </div>

      <div className="h-px bg-white/5" />

      {/* Email */}
      <a
        href="mailto:marcoschronos@gmail.com"
        className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-primary-500/10 border border-white/5 hover:border-primary-500/20 transition-all group"
      >
        <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
          <HiMail className="text-primary-400" />
        </div>
        <div>
          <p className="text-xs text-dark-200 font-medium group-hover:text-white transition-colors">
            marcoschronos@gmail.com
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
            handle: "@MarcoEvanz",
            href: "https://github.com/MarcoEvanz",
          },
          {
            icon: FaLinkedin,
            label: "LinkedIn",
            handle: "Long Phạm",
            href: "https://www.linkedin.com/in/long-ph%E1%BA%A1m-604272361/",
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
          className={`w-full px-3 ${isMobile ? "py-3 text-sm rounded-xl" : "py-2 text-xs rounded-lg"} bg-white/[0.03] border border-white/5 focus:border-primary-500/30 text-white placeholder-dark-600 outline-none transition-colors`}
        />
        <input
          type="email"
          placeholder="your@email.com"
          className={`w-full px-3 ${isMobile ? "py-3 text-sm rounded-xl" : "py-2 text-xs rounded-lg"} bg-white/[0.03] border border-white/5 focus:border-primary-500/30 text-white placeholder-dark-600 outline-none transition-colors`}
        />
        <textarea
          rows={3}
          placeholder="Your message..."
          className={`w-full px-3 ${isMobile ? "py-3 text-sm rounded-xl" : "py-2 text-xs rounded-lg"} bg-white/[0.03] border border-white/5 focus:border-primary-500/30 text-white placeholder-dark-600 outline-none transition-colors resize-none`}
        />
        <button className={`w-full ${isMobile ? "py-3 text-sm rounded-xl" : "py-2 text-xs rounded-lg"} bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors`}>
          Send Message
        </button>
      </form>
    </div>
  );
}
