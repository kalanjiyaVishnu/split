"use client";

import { Button } from "@/components/ui/button";
import { 
  Zap, 
  ArrowRight, 
  FileDiff, 
  Network, 
  MessageSquare, 
  ShieldCheck,
  Code2,
  Share2,
  Terminal,
  MousePointer2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 h-20 sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
            <Zap className="w-6 h-6 text-primary-foreground fill-current" />
          </div>
          <span className="font-bold text-xl tracking-tight">Split</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/visualizer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Visualizer</Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link href="/releases" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Releases</Link>
          <Link href="/credits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Credits</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="rounded-full px-6">Sign In</Button>
          </Link>
          <Link href="/workbench">
            <Button className="rounded-full bg-primary hover:bg-primary/90 px-8 shadow-xl shadow-primary/10">
              Open Workbench
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Abstract Background Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -z-10 animate-pulse" />

        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-white/5 text-[11px] font-bold uppercase tracking-widest text-primary animate-fade-in">
            <Terminal className="w-3.5 h-3.5" />
            The Premium Diffing Suite for Modern Teams
          </div>
          
          <h1 className="text-6xl md:text-8xl font-anthropic tracking-tight leading-[0.9] max-w-4xl mx-auto">
            Visualizing <span className="text-primary italic">changes</span> with surgical precision.
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A high-performance workbench for JSON diffing, graph visualization, and collaborative code reviews. Built for developers who demand excellence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/workbench">
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold uppercase tracking-widest shadow-2xl shadow-primary/20 gap-3 group">
                Go to Workbench
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-white/10 text-lg font-bold uppercase tracking-widest hover:bg-muted/50">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Mockup Panel */}
        <div className="max-w-6xl mx-auto mt-24 relative animate-fade-in">
           <div className="rounded-3xl border border-white/10 bg-card/40 backdrop-blur-3xl shadow-[0_32px_120px_rgba(0,0,0,0.4)] aspect-[16/9] overflow-hidden group">
              <div className="flex items-center gap-2 px-6 h-12 bg-muted/20 border-b border-white/5">
                 <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                 </div>
                 <div className="mx-auto text-[10px] font-mono text-muted-foreground uppercase tracking-widest opacity-40">split.premium.app</div>
              </div>
              <div className="p-8 grid grid-cols-2 gap-8 h-full opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                 <div className="rounded-xl border border-white/5 bg-black/40 p-4 font-mono text-[11px] space-y-2">
                    <div className="h-3 w-3/4 bg-white/5 rounded" />
                    <div className="h-3 w-1/2 bg-white/5 rounded" />
                    <div className="h-3 w-2/3 bg-red-500/20 rounded" />
                    <div className="h-3 w-full bg-white/5 rounded" />
                 </div>
                 <div className="rounded-xl border border-white/5 bg-black/40 p-4 font-mono text-[11px] space-y-2">
                    <div className="h-3 w-3/4 bg-white/5 rounded" />
                    <div className="h-3 w-1/2 bg-white/5 rounded" />
                    <div className="h-3 w-2/3 bg-emerald-500/20 rounded" />
                    <div className="h-3 w-full bg-white/5 rounded" />
                 </div>
              </div>
           </div>
           
           {/* Floating Action Badge */}
           <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary/20 blur-[60px] -z-10 animate-pulse" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-3xl bg-background border shadow-2xl animate-bounce duration-[3000ms]">
              <MousePointer2 className="w-12 h-12 text-primary" />
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 bg-muted/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: Network, title: "Graph Visualization", desc: "Instantly transform complex JSON into interactive, navigable 3D-style graphs powered by JSONCrack technology." },
            { icon: MessageSquare, title: "Collaborative Context", desc: "Mark lines as resolved and start discussions directly on the diff. Persistence is built into every layer." },
            { icon: ShieldCheck, title: "Local First", desc: "Your data stays in your workbench. Privacy is not a feature; it's our foundation for premium workflows." }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-3xl border border-white/5 bg-card/20 backdrop-blur-sm hover:border-primary/20 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5 text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary fill-current" />
            <span className="font-bold tracking-tight">Split Premium</span>
          </div>
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/releases" className="hover:text-primary transition-colors">Releases</Link>
            <Link href="/credits" className="hover:text-primary transition-colors">Credits</Link>
          </div>
          <p className="text-xs text-muted-foreground opacity-50">© 2026 Split Tool. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
