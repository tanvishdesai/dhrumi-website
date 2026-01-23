"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillCategory {
  name: string;
  skills: string[];
  direction: "left" | "right";
}

const skillCategories: SkillCategory[] = [
  {
    name: "ENGINEERING",
    skills: [
      "DISTRIBUTED SYSTEMS ARCHITECTURE",
      "HIGH-PERFORMANCE PYTHON",
      "RUST & GO",
      "THREAT INTELLIGENCE PIPELINES",
      "EVENT-DRIVEN INFRASTRUCTURE",
      "RABBITMQ",
      "REDIS",
      "DOCKER (PODMAN)",
      "KUBERNETES",
      "POSTGRESQL",
      "ELASTICSEARCH",
      "MONGODB",
      "AWS S3",
      "ANSIBLE",
      "GITHUB ACTIONS",
      "SECURE SDLC",
    ],
    direction: "left",
  },
  {
    name: "SECURITY",
    skills: [
      "OFFENSIVE SECURITY RESEARCH",
      "ADVANCED ANTI-BOT EVASION",
      "BURP SUITE",
      "FRIDA",
      "REVERSE ENGINEERING",
      "BROWSER INSTRUMENTATION (CDP)",
      "BINARY NINJA",
      "APK STATIC ANALYSIS",
      "CAIDO",
      "REQABLE",
      "WIRESHARK",
      "MITM PROXY",
      "DRISSIONPAGE",
      "KERNELSU & LSPOSED",
      "API SECURITY BYPASSING",
      "MOBSF",
      "OSINT & DIGITAL FOOTPRINTING",
    ],
    direction: "right",
  },
  {
    name: "TOOLS",
    skills: [
      "ARCH LINUX",
      "HYPRLAND",
      "ZSH + STARSHIP",
      "ALACRITTY",
      "ASTRO",
      "HTMX",
      "THREE.JS",
      "WEBGL & GLSL",
      "RIPGREP",
      "HTTPIE",
      "JQ",
      "YAAK",
      "BEEKEEPER STUDIO",
      "MACOS",
      "NOTESNOOK",
      "FX",
      "DMS",
      "SVG ANIMATION",
    ],
    direction: "left",
  },
];

function MarqueeRow({ category }: { category: SkillCategory }) {
  const Arrow = category.direction === "left" ? ArrowRight : ArrowLeft;
  
  // Double the skills for seamless loop
  const skills = [...category.skills, ...category.skills];

  return (
    <div className="mb-6">
      {/* Category Label */}
      <p className="mb-4 text-center">
        <span className="rounded-full border border-border bg-card/50 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em]">
          {category.name}
        </span>
      </p>

      {/* Marquee Container */}
      <div className="relative overflow-hidden">
        {/* Gradient Masks */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />

        {/* Scrolling Content */}
        <div
          className={cn(
            "flex items-center gap-4 whitespace-nowrap",
            category.direction === "left" ? "animate-marquee" : "animate-marquee-reverse"
          )}
          style={{
            animationDuration: "50s",
          }}
        >
          {skills.map((skill, index) => (
            <div key={`${skill}-${index}`} className="flex items-center gap-4">
              <span className="text-xs font-bold tracking-wider">
                {skill}
              </span>
              <Arrow className="h-3 w-3 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkillsMarquee() {
  return (
    <section className="relative z-10 py-32 w-full flex justify-center">
      <div className="w-full max-w-6xl px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="section-heading mb-3 text-2xl md:text-3xl">
            Summary of my technical skills
          </h2>
          <p className="text-sm text-muted-foreground">
            A quick overview of the tools, technologies, and methodologies I employ
            regularly.
          </p>
        </div>

        {/* Marquee Rows */}
        <div className="space-y-2">
          {skillCategories.map((category) => (
            <MarqueeRow key={category.name} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
