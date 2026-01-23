"use client";

import { 
  ShieldCheck, 
  Minimize2, 
  Cog, 
  Lightbulb, 
  Zap, 
  Boxes 
} from "lucide-react";

interface PhilosophyCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const philosophyCards: PhilosophyCard[] = [
  {
    id: "zero-trust",
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Zero Trust Security",
    description:
      "Assumptions are the mother of all mistakes. I design systems that verify everything, trust nothing, and minimize attack surfaces.",
  },
  {
    id: "complexity",
    icon: <Minimize2 className="h-5 w-5" />,
    title: "Complexity Reduction",
    description:
      "Complexity is where vulnerabilities hide. I fight bloat to keep systems auditable, maintainable, and inherently secure.",
  },
  {
    id: "automation",
    icon: <Cog className="h-5 w-5" />,
    title: "Automation First",
    description:
      "Human labor is error-prone. I automate repetitive tasks to ensure consistency, reduce mistakes, and free up time for creative problem-solving.",
  },
  {
    id: "evidence",
    icon: <Lightbulb className="h-5 w-5" />,
    title: "Evidence-Based Decisions",
    description:
      "Heuristics is exploitable. I trust logs, metrics, and Proof-of-Concepts (PoCs) over gut feelings to guide my architectural and security choices.",
  },
  {
    id: "performance",
    icon: <Zap className="h-5 w-5" />,
    title: "Performance is not Optional",
    description:
      "Whether I design for millions of users or a niche audience, I prioritize speed and efficiency to deliver seamless experiences.",
  },
  {
    id: "modular",
    icon: <Boxes className="h-5 w-5" />,
    title: "Modular Architecture",
    description:
      "Monoliths get messy. I build systems with interchangeable components to enhance flexibility, scalability, and ease of maintenance.",
  },
];

export function PhilosophyCards() {
  /* Removed unused state */

  return (
    <section className="relative z-10 py-32 w-full flex justify-center">
      <div className="w-full max-w-[1400px] px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-brachial-wide text-center uppercase tracking-wide">
            Philosophy behind my work
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Principles that guide my approach to security research and software engineering.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {philosophyCards.map((card) => (
            <div
              key={card.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#09090b] p-8 transition-all duration-300 hover:border-white/20 hover:bg-[#18181b]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                  {card.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-brachial text-xl tracking-wide text-white">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
