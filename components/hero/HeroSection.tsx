"use client";

import { AnimatedName } from "./AnimatedName";
import { Globe } from "./Globe";
import { Shield, Smartphone, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-16 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
          {/* Left: Text Content */}
          <div className="relative z-10 flex flex-col items-start justify-center">
            {/* Animated Name */}
            <AnimatedName
              firstName="RAFET"
              lastName="ABBASLI"
              className="mb-8"
            />

            {/* Job Titles / Subtitle */}
            <div
              className={cn(
                "mb-8 flex flex-wrap items-center gap-x-6 gap-y-3",
                "text-sm md:text-base font-mono text-neutral-400",
                "opacity-0 animate-fade-in-up"
              )}
              style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
            >
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Offensive Security Researcher</span>
              </span>
              <span className="text-neutral-600">&</span>
              <span className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>Senior Software Engineer</span>
              </span>
            </div>

            {/* CTA Button */}
            <a
              href="https://drive.google.com/file/d/1AHXEIenZcIoPjwCh9Y56zp51CzN4XJ0s/view"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group relative flex items-center gap-2 rounded-full",
                "bg-white/5 border border-white/10 px-6 py-3",
                "text-sm font-bold tracking-wide text-white transition-all",
                "hover:bg-white/10 hover:scale-105 hover:border-white/20",
                "opacity-0 animate-fade-in-up"
              )}
              style={{ animationDelay: "800ms", animationFillMode: "forwards" }}
            >
              <div className="flex items-center justify-center rounded-full bg-white text-black p-1 mr-2">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                 </svg>
              </div>
              <span className="uppercase">View my Resume</span>
            </a>
          </div>

          {/* Right: 3D Globe */}
          <div
            className={cn(
              "relative flex items-center justify-center lg:justify-end h-[600px] w-full",
              "opacity-0 animate-fade-in",
              "hidden lg:flex"
            )}
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            <Globe />
          </div>
        </div>
      </div>
    </section>
  );
}
