"use client";

import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft, Calendar, Tag, Terminal } from "lucide-react";
import Link from "next/link";

const releases = [
  {
    version: "v0.1.0-alpha",
    date: "April 2026",
    title: "Premium Refresh",
    changes: [
      "Initial launch of the Premium Workbench UI",
      "Interactive JSONCrack integration with node-sync",
      "Line-level resolution and collaborative comments",
      "Persistent SQLite storage for diffs and discussions",
      "Global Search & History management"
    ]
  },
  {
    version: "v0.0.9",
    date: "March 2026",
    title: "The Engine Update",
    changes: [
      "Optimized diffing algorithm for large JSON payloads",
      "Integrated JetBrains Mono for all code contexts",
      "Enhanced glassmorphism theme system"
    ]
  }
];

export default function ReleasesPage() {
  return (
    <div className="min-h-screen bg-background p-8 font-sans selection:bg-primary/30">
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2 rounded-full mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>

      <div className="max-w-3xl mx-auto space-y-16 animate-fade-in">
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary">
            Changelog
          </div>
          <h1 className="text-5xl md:text-7xl font-anthropic tracking-tight">The <span className="text-primary italic">Evolution</span>.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Every update is a step towards the perfect developer workbench. We ship fast, but we polish even faster.
          </p>
        </header>

        <div className="space-y-12">
          {releases.map((release, i) => (
            <div key={i} className="relative pl-8 border-l border-white/5 space-y-6 group">
              <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] group-hover:scale-150 transition-transform" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{release.version}</span>
                  <span className="text-sm font-mono text-primary opacity-60">{release.title}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-40">
                  <Calendar className="w-3.5 h-3.5" />
                  {release.date}
                </div>
              </div>

              <ul className="space-y-3">
                {release.changes.map((change, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                    <Terminal className="w-4 h-4 mt-1 text-primary opacity-30 shrink-0" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-12 rounded-3xl bg-muted/20 border border-dashed border-white/10 text-center space-y-4">
           <Tag className="w-12 h-12 text-muted-foreground opacity-20 mx-auto" />
           <p className="text-sm font-bold uppercase tracking-widest opacity-40">More updates coming soon</p>
           <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
             We are working on real-time collaboration and direct Git integration.
           </p>
        </div>
      </div>
    </div>
  );
}
