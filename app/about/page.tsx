"use client";

import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft, Heart, Sparkles, Code2 } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
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
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
            <Zap className="w-6 h-6 text-primary-foreground fill-current" />
          </div>
          <h1 className="text-5xl md:text-7xl font-anthropic tracking-tight">The Vision for <span className="text-primary italic">Split</span>.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Split was born out of a frustration with generic diffing tools that hide the logic behind the layout. We believe that understanding changes in code—especially structured data like JSON—requires more than just red and green lines.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-12 border-y border-white/5 py-16">
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Surgical Precision
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our diffing engine doesn&apos;t just look for text changes. It understands the underlying structure of your data, allowing you to visualize movements, deletions, and updates with absolute clarity.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Developer Experience
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every pixel in Split is tuned for the developer. From the JetBrains Mono typography to the Instrument Serif discussion threads, we&apos;ve built a workbench that feels premium because your work is premium.
            </p>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">The Team</h2>
          <p className="text-muted-foreground leading-relaxed">
            Split is maintained by a global community of developers who value privacy, performance, and beautiful design. Our goal is to build the ultimate collaborative workbench for code and data review.
          </p>
          <div className="p-8 rounded-3xl bg-muted/20 border border-white/5 flex items-center gap-6">
             <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Code2 className="w-8 h-8 text-primary" />
             </div>
             <div>
                <p className="text-sm font-bold uppercase tracking-widest">Built with Purpose</p>
                <p className="text-xs text-muted-foreground opacity-60">Split Premium v0.1.0 • Built on Next.js 14</p>
             </div>
          </div>
        </section>

        <footer className="pt-20 pb-12 text-center text-xs text-muted-foreground opacity-40 uppercase tracking-[0.3em]">
          Designed for the 1% of developers who care about the tools they use.
        </footer>
      </div>
    </div>
  );
}
