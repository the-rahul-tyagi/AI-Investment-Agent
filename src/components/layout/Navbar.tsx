"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrainCircuit, Menu, X, PieChart, Layers, Star, History, Settings, ArrowRight } from "lucide-react";
import Container from "./Container";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/compare", label: "Compare", icon: Layers },
    { href: "/portfolio", label: "Portfolio", icon: PieChart },
    { href: "/watchlist", label: "Watchlist", icon: Star },
    { href: "/history", label: "History", icon: History },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030712]/75 backdrop-blur-xl transition-all duration-300">
      <Container className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-md shadow-emerald-500/25">
            <BrainCircuit
              size={20}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white sm:text-base leading-none">
              AI INVEST
            </h1>
            <p className="text-[10px] font-semibold text-emerald-400 tracking-wider">
              RESEARCH AGENT
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition duration-200 ${
                  isActive
                    ? "text-emerald-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon size={14} className={isActive ? "text-emerald-400" : "text-slate-500"} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button / Github */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href="https://github.com/the-rahul-tyagi/AI-Investment-Agent"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold text-white border border-white/10 hover:bg-white/10 transition duration-200"
          >
            GitHub <ArrowRight size={12} />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:text-white md:hidden"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-b border-white/5 bg-[#030712]/95 backdrop-blur-xl md:hidden animate-in slide-in-from-top duration-300">
          <Container className="flex flex-col py-6 gap-4">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-xl p-3 text-base font-semibold transition ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-slate-300 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-emerald-400" : "text-slate-400"} />
                  {link.label}
                </Link>
              );
            })}
            <a
              href="https://github.com/the-rahul-tyagi/AI-Investment-Agent"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/25"
            >
              GitHub Code
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}