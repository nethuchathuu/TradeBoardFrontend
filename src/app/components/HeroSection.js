"use client";

import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function HeroSection({ onScrollToBoard }) {
  const { user } = useContext(AuthContext);
  return (
    <section id="hero" className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a1a0f] to-slate-900">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-emerald-700/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connecting homeowners with skilled tradespeople
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.06] tracking-tight mb-6">
              {user ? (
                <>
                  Welcome back,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400">
                    {user.name.split(" ")[0]}
                  </span>!
                </>
              ) : (
                <>
                  Find the right{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400">
                    tradesperson
                  </span>{" "}
                  for any job.
                </>
              )}
            </h1>

            {/* Subtext */}
            <p className="text-lg text-white/50 max-w-lg mb-10 leading-relaxed">
              {user ? "Ready to post your next service request? Our tradespeople are waiting." : "Post a service request in minutes. Browse open jobs from homeowners across the country. Quality work, trusted professionals."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <Link
                href="/new"
                id="hero-cta-post"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-base transition-all duration-200 hover:scale-[1.02] shadow-xl shadow-emerald-500/30"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Post a Request
              </Link>
              <button
                onClick={onScrollToBoard}
                id="hero-cta-browse"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 font-semibold text-base transition-all duration-200 backdrop-blur-sm"
              >
                Browse Jobs
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>

            {/* Stats row */}
            <div className="flex gap-10">
              {[
                { value: "500+", label: "Jobs Posted" },
                { value: "200+", label: "Tradespeople" },
                { value: "4.9★", label: "Avg Rating" },
              ].map((stat, i) => (
                <div key={i} className="border-r border-white/10 pr-10 last:border-0">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/40 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Image */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-3xl border border-emerald-500/10 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

              {/* Main image */}
              <div className="relative z-10 w-full max-w-lg xl:max-w-xl">
                <Image
                  src="/homeImg.png"
                  alt="Skilled tradesperson at work"
                  width={500}
                  height={500}
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={onScrollToBoard}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors cursor-pointer group"
        aria-label="Scroll to job board"
      >
        <span className="text-xs font-medium tracking-widest uppercase group-hover:text-emerald-300 transition-colors">SCROLL</span>
        <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center pt-1.5 shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] group-hover:border-emerald-400 transition-all duration-300">
          <span className="w-1 h-2 rounded-full bg-current animate-bounce" />
        </div>
      </button>
    </section>
  );
}