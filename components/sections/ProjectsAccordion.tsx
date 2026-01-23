"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Shield, Bot, Database, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  number: string;
  icon: React.ReactNode;
  title: string;
  shortDescription: string;
  tags: string[];
  sections: {
    title: string;
    content: string;
  }[];
}

const projects: Project[] = [
  {
    id: "waf-evasion",
    number: "01",
    icon: <Shield className="h-5 w-5" />,
    title: "Advanced WAF Evasion & Anti-Fingerprinting",
    shortDescription:
      "Reverse engineering Cloudflare Turnstile, Google reCaptcha (v2/v3/invisible), and DDoS-Guard to automate data collection in hostile environments.",
    tags: ["Automation", "Reverse Engineering", "WAF Evasion", "CDP Injection", "Captcha Bypassing"],
    sections: [
      {
        title: "The Why",
        content:
          "Targeted threat communities actively weaponize anti-bot technology (CAPTCHAs, Proof-of-Work) to hide their data. Standard scrapers fail here; if you can't bypass the gate, you gain no intelligence.",
      },
      {
        title: "The How",
        content:
          "I moved beyond WebDriver to direct CDP (Chrome DevTools Protocol) injection for stealth automation. For reCAPTCHA, I built a standalone solver endpoint achieving 0.9+ confidence through behavioral pattern replication. The harder problem was proprietary obfuscated PoW challenges. I reverse engineered multiple cryptographic proof-of-work implementations to extract the validation logic and replicate it server-side.",
      },
      {
        title: "The Challenge",
        content:
          "Bypassing the check is only step one. The real hurdle is preventing chain-bans in a distributed system. I engineered a custom Session Rotator with distributed locking (Redis/ZooKeeper) that ensures accounts are only 'checked out' by one worker at a time, preventing concurrent usage flags.",
      },
    ],
  },
  {
    id: "malware-detection",
    number: "02",
    icon: <Bot className="h-5 w-5" />,
    title: "Automated Mobile Malware Detection Pipeline",
    shortDescription:
      "A high-concurrency watchdog for monitoring unauthorized application distribution across unregulated third-party stores.",
    tags: ["Malware Analysis", "MobSF", "APK Decompilation", "Pattern Matching", "FFI"],
    sections: [
      {
        title: "The Why",
        content:
          "When modified banking or telco apps circulate on grey markets, they bypass business logic and compromise users. We needed to detect these 'mods' the moment they were uploaded.",
      },
      {
        title: "The How",
        content:
          "I built a pipeline that scrapes 30+ shadow app stores for both APK/IPA binaries and structured metadata (version history, permissions, developer info). For official Play Store data, I ported EEF's rs-google-play (a Rust-based reverse-engineered Google Play API) to Python using PyO3 and Maturin. The collected files feed into an automated SAST engine (MobSF) for binary decompilation and diff analysis against official releases.",
      },
      {
        title: "The Challenge",
        content:
          "Ironically, poorly developed websites are harder to scrape than secure ones. Shadow stores often have broken HTML, non-standard DOMs, and anti-hotlinking measures. The difficulty wasn't just the scale; it was writing parsers robust enough to handle the chaos of the grey web.",
      },
    ],
  },
  {
    id: "threat-intel",
    number: "03",
    icon: <Database className="h-5 w-5" />,
    title: "Threat Intelligence Ingestion Infrastructure",
    shortDescription:
      "Processing terabytes of unstructured data from leak sites and dark web forums into structured, queryable intelligence.",
    tags: ["Dark Web Monitoring", "Data Normalization", "Protobuf", "OSINT"],
    sections: [
      {
        title: "The Why",
        content:
          "Raw data from the dark web is useless if it isn't searchable. We needed a way to correlate a handle on a Russian forum with a database leak on a file-sharing site instantly.",
      },
      {
        title: "The How",
        content:
          "I architected a modular ingestion engine using RabbitMQ and ZooKeeper to handle the throughput. Crucially, I enforced strict schema validation using Protocol Buffers (Protobuf). This forces unstructured forum HTML into a strict binary format, making the data immutable and typed before it hits our Data Lake.",
      },
      {
        title: "The Challenge",
        content:
          "Forums built on the same underlying frameworks (XenForo, phpBB, vBulletin) share DOM structures but implement custom anti-scraping logic. I wrote modular parsers that inherit base extraction logic per platform type, reducing code duplication significantly. The real challenge is handling unreliable data: missing fields, inconsistent encodings, malformed timestamps. The system validates and normalizes on ingestion, logging failures for manual review rather than silently corrupting the dataset.",
      },
    ],
  },
  {
    id: "secure-tooling",
    number: "04",
    icon: <Wrench className="h-5 w-5" />,
    title: "Secure Infrastructure Tooling (Golang)",
    shortDescription:
      "Developing secure, self-hosted alternatives for sensitive internal operations using Go.",
    tags: ["Golang", "Secure Coding", "Cryptography", "Clean Architecture"],
    sections: [
      {
        title: "The Why",
        content:
          "Using public tools (like Pastebin) for internal security operations is an OPSEC failure. We needed a fast, internal, air-gapped solution for sharing sensitive payloads and configs.",
      },
      {
        title: "The How",
        content:
          "I wrote 'Pasty', a high-performance storage engine in Go. To minimize maintenance, I architected it to be database-less; it uses S3 object metadata for state management. This allows us to spin up instances instantly via Docker without managing complex SQL migrations.",
      },
      {
        title: "The Challenge",
        content:
          "Simplicity shouldn't compromise functionality. I implemented a full GUI and API interface that supports advanced security features like 'Burn-After-Read', password protection, and auto-expiration purely via metadata logic.",
      },
    ],
  },
];

export function ProjectsAccordion() {
  return (
    <section className="relative z-10 py-32 w-full flex justify-center">
      <div className="w-full max-w-5xl px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
            {/* Decorative line/icon roughly similar to screenshot if possible, or just the text */}
            <div className="flex items-center justify-center gap-4 mb-2">
                 <div className="h-2 w-12 bg-white skew-x-[-30deg]" />
                 <div className="h-2 w-24 bg-white/20 skew-x-[-30deg]" />
            </div>

          <h2 className="font-brachial-wide text-4xl md:text-5xl font-black uppercase text-white tracking-wide mb-3 flex items-center justify-center gap-3">
             STUFF I&apos;VE BUILT & RESEARCHED
          </h2>
          <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">
            Security research, infrastructure engineering, and the occasional rabbit hole.
          </p>
        </div>

        {/* Accordion */}
        <Accordion.Root type="single" collapsible className="space-y-4">
          {projects.map((project) => (
            <Accordion.Item
              key={project.id}
              value={project.id}
              className="group overflow-hidden rounded-xl border border-white/5 bg-[#080808] transition-all hover:border-white/10"
            >
              <Accordion.Trigger className="flex w-full items-start md:items-center gap-6 p-6 text-left transition-colors [&[data-state=open]>svg]:rotate-180">
                {/* Icon Box */}
                <div className="hidden md:flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                  {project.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <h3 className="flex flex-col md:flex-row md:items-center gap-2 text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                    <span className="font-mono text-zinc-500 text-base">{project.number}</span>
                    <span className="font-mono text-zinc-700 text-base hidden md:inline">//</span>
                    <span>{project.title}</span>
                  </h3>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-2xl">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Chevron */}
                <ChevronDown className="h-5 w-5 flex-shrink-0 text-zinc-600 transition-transform duration-300 group-hover:text-white mt-1 md:mt-0" />
              </Accordion.Trigger>

              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="border-t border-white/5 bg-white/[0.02] px-6 py-6 md:pl-[88px]">
                  {/* Tags */}
                  <div className="mb-8 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-400 border border-white/10 bg-black/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Sections */}
                  <div className="space-y-8 max-w-3xl">
                    {project.sections.map((section) => (
                      <div key={section.title}>
                        <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/70 flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-sm" />
                            {section.title}
                        </h4>
                        <p className="text-sm text-zinc-400 leading-7 font-light">
                          {section.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
