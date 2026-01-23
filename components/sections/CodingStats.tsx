"use client";

import { cn } from "@/lib/utils";

interface CodingStat {
  language: string;
  timeSpent: string;
  percentage: number;
  color: string;
}

const codingStats: CodingStat[] = [
  { language: "Python", timeSpent: "911 hrs 10 mins", percentage: 55.5, color: "#3572A5" },
  { language: "Go", timeSpent: "192 hrs 51 mins", percentage: 11.7, color: "#00ADD8" },
  { language: "Other", timeSpent: "107 hrs 13 mins", percentage: 6.5, color: "#4CAF50" },
  { language: "Astro", timeSpent: "104 hrs 35 mins", percentage: 6.4, color: "#FF5D01" },
  { language: "JavaScript", timeSpent: "61 hrs 12 mins", percentage: 3.7, color: "#F7DF1E" },
  { language: "YAML", timeSpent: "56 hrs 31 mins", percentage: 3.4, color: "#CB171E" },
  { language: "Markdown", timeSpent: "45 hrs 10 mins", percentage: 2.8, color: "#083FA1" },
  { language: "JSON", timeSpent: "31 hrs 32 mins", percentage: 1.9, color: "#808080" },
  { language: "HTML", timeSpent: "20 hrs 15 mins", percentage: 1.2, color: "#E34C26" },
  { language: "Bash", timeSpent: "18 hrs 28 mins", percentage: 1.1, color: "#89E051" },
];

const totalHours = "1643 hours & 15 minutes";
const totalLanguages = 64;

export function CodingStats() {
  return (
    <section className="relative z-10 py-32 w-full flex justify-center">
      <div className="w-full max-w-3xl px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="section-heading mb-3 text-2xl md:text-3xl flex items-center justify-center gap-3 flex-wrap">
            <span>Coded for</span>
            <span className="rounded-lg bg-foreground px-3 py-1.5 text-background text-lg md:text-xl">
              {totalHours}
            </span>
            <span>this year</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            I&apos;m a polyglot developer. Here&apos;s a breakdown of the top programming
            languages I&apos;ve used this year.
          </p>
        </div>

        {/* Stats Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-semibold">Language</th>
                <th className="px-5 py-3 text-center text-xs font-semibold">Time spent</th>
                <th className="px-5 py-3 text-right text-xs font-semibold">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {codingStats.map((stat, index) => (
                <tr
                  key={stat.language}
                  className={cn(
                    "transition-colors hover:bg-muted/20",
                    index !== codingStats.length - 1 && "border-b border-border/50"
                  )}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: stat.color }}
                      />
                      <span className="text-xs font-medium">{stat.language}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center text-xs text-muted-foreground">
                    {stat.timeSpent}
                  </td>
                  <td className="px-5 py-3 text-right text-xs font-medium">
                    {stat.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/30">
                <td colSpan={3} className="px-5 py-3 text-center text-xs text-muted-foreground">
                  {totalLanguages} languages in total
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}
