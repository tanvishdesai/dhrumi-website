import Link from "next/link";
import { cn } from "@/lib/utils";

export function AboutSection() {
  return (
    <section className="relative z-10 py-24 md:py-32 flex flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-[1024px] px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16 text-center">
           {/* Stylized Logo/Header */}
           <div className="flex flex-col items-center justify-center">
              <h2 className="font-brachial-wide text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-4 text-white relative">
                 <span className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 border-l-2 border-t-2 border-white/50 skew-x-12 opacity-50 hidden md:block"></span>
                 WHO IS RVFET?
                 <span className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 border-r-2 border-b-2 border-white/50 skew-x-12 opacity-50 hidden md:block"></span>
              </h2>
           </div>
          <p className="text-sm md:text-base text-zinc-500 tracking-wider font-mono">
            Everything you need to know about me.
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 text-lg md:text-xl leading-relaxed text-zinc-400 font-sans">
          <p>
            I&apos;m a <strong className="text-white">Senior Software Engineer</strong> and{" "}
            <strong className="text-white">Offensive Security Researcher</strong> from Baku, Azerbaijan.
          </p>

          <p>
            I hold <strong className="text-white">Bachelor&apos;s degree in Information Technologies</strong> (IT) and{" "}
            <strong className="text-white">Master&apos;s degree in Management Information Systems</strong> (MIS).
          </p>

          <p>
            I currently have an active <strong className="text-white">IELTS</strong> CEFR-C1 with a score of 7.5
            (2025-2027), and previously had a score of 7.0 (2023-2025).
          </p>

          <p>
            With over 6+ years of hands-on experience, I acquired an extremely diverse
            skill set that spans{" "}
            <strong className="text-white">
              Full-Stack Development, Reverse engineering, Vulnerability Research, Cloud
              Infrastructure, Offensive Tooling Development, DevSecOps, and my main
              expertise - Secure Software Development.
            </strong>
          </p>

          <p>
            My first job in the tech industry was as a graphic designer, where I designed
            logos, banners, and various marketing materials for local businesses. I
            realized I could learn stuff rather quickly on my own, so I tried web
            development next. After hitting the complexity ceiling of standard web
            development, I decided to focus on professions that are more challenging and
            impactful, switching to Software Engineering and Security Research.
          </p>

          <p>
            Over the years, while doing my Software Engineering job, I voluntarily
            secured millions of people&apos;s PII (Personally Identifiable Information) and
            corporate assets by finding and responsibly disclosing critical security
            vulnerabilities in popular software products used by millions worldwide. Most
            of my research findings are sensitive and I&apos;m not allowed to disclose them
            publicly. Some of my public research can be found in the{" "}
            <Link
              href="/blog/tags/writeups"
              className="text-white underline decoration-zinc-600 underline-offset-4 hover:decoration-white transition-all"
            >
              Write-ups page
            </Link>
            .
          </p>

          <p>
            I&apos;m a natural{" "}
            <a
              href="https://en.wikipedia.org/wiki/Multipotentiality"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white border-b border-dashed border-zinc-500 hover:border-white transition-colors pb-0.5"
            >
              multipotentialite
            </a>
            . I love doing research and learning new things. I find complex problems
            exciting to solve, especially those deemed impossible by conventional
            standards or that require a deep understanding of multiple domains.
          </p>
        </div>
      </div>
    </section>
  );
}
