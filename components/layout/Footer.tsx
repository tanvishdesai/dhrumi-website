import Link from "next/link";
import { Rss, FileText, Shield, Clock, Cloud } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const buildDate = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";

  return (
    <footer className="relative z-10 border-t border-border bg-card/30 backdrop-blur-sm w-full flex justify-center">
      <div className="w-full max-w-4xl px-4 py-10 md:px-8">
        {/* Copyright */}
        <div className="mb-5 text-center text-xs text-muted-foreground">
          © {currentYear} RVFET. All rights reserved.
        </div>

        {/* Tech Stack */}
        <div className="mb-5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <span>Built using</span>
          <span className="flex items-center gap-1 font-medium text-foreground">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            Astro
          </span>
          <span>styled using</span>
          <span className="flex items-center gap-1 font-medium text-foreground">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Tailwind
          </span>
          <span>and</span>
          <span className="flex items-center gap-1 font-medium text-foreground">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            Basecoat
          </span>
          <span>Hosted by</span>
          <span className="flex items-center gap-1 font-medium text-foreground">
            <Cloud className="h-3 w-3" />
            Cloudflare
          </span>
        </div>

        {/* Links */}
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/rss.xml"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1.5 text-[10px] transition-colors hover:bg-muted"
          >
            <Rss className="h-3 w-3" />
            RSS Feed
          </Link>
          <Link
            href="/sitemap.xml"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1.5 text-[10px] transition-colors hover:bg-muted"
          >
            <FileText className="h-3 w-3" />
            Sitemap
          </Link>
          <Link
            href="/privacy"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1.5 text-[10px] transition-colors hover:bg-muted"
          >
            <Shield className="h-3 w-3" />
            Privacy Policy
          </Link>
        </div>

        {/* Build Info */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <Clock className="h-2.5 w-2.5" />
          <span>Last build: {buildDate} BLD:#1028</span>
        </div>
      </div>
    </footer>
  );
}
