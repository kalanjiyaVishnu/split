"use client";

import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft, Github, Heart, Globe, Box } from "lucide-react";
import Link from "next/link";

const dependencies = [
  {
    name: "JSON Crack",
    repo: "AykutSarac/jsoncrack.com",
    desc: "The core visualization engine for JSON graphs. Truly a revolutionary piece of technology.",
    icon: Globe
  },
  {
    name: "Monaco Editor",
    repo: "microsoft/monaco-editor",
    desc: "The powerhouse editor that brings VS Code's excellence to the web.",
    icon: Github
  },
  {
    name: "diff2html",
    repo: "rtfpessoa/diff2html",
    desc: "Pretty diff highlights and side-by-side visualization logic.",
    icon: Box
  },
  {
    name: "Lucide React",
    repo: "lucide-icons/lucide",
    desc: "Beautiful, consistent icons that bring our UI to life.",
    icon: Heart
  },
  {
    name: "Prisma",
    repo: "prisma/prisma",
    desc: "The next-generation ORM that keeps our data layer type-safe and fast.",
    icon: Box
  },
  {
    name: "Shadcn UI",
    repo: "shadcn-ui/ui",
    desc: "The foundation of our component library and design system.",
    icon: Github
  },
  {
    name: "Next.js",
    repo: "vercel/next.js",
    desc: "The framework that makes this high-performance experience possible.",
    icon: Globe
  }
];

export default function CreditsPage() {
  return (
    <div className="min-h-screen bg-background p-8 font-sans selection:bg-primary/30">
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2 rounded-full mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto space-y-16 animate-fade-in">
        <header className="space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
            <Zap className="w-6 h-6 text-primary-foreground fill-current" />
          </div>
          <h1 className="text-5xl md:text-7xl font-anthropic tracking-tight">Built on the <span className="text-primary italic">shoulders</span> of giants.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Split is possible because of the incredible open-source community. These are the core technologies and projects that power your premium diffing experience.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {dependencies.map((dep, i) => (
            <div key={i} className="p-8 rounded-3xl border border-white/5 bg-card/20 backdrop-blur-sm hover:border-primary/20 transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <dep.icon className="w-6 h-6" />
                   </div>
                   <Link href={`https://github.com/${dep.repo}`} target="_blank">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                         <Github className="w-5 h-5 opacity-40 hover:opacity-100" />
                      </Button>
                   </Link>
                </div>
                <h3 className="text-xl font-bold mb-3">{dep.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {dep.desc}
                </p>
              </div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                {dep.repo}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-20 pb-12 border-t border-white/5 text-center space-y-6">
           <Heart className="w-12 h-12 text-primary opacity-20 mx-auto animate-pulse" />
           <p className="text-sm font-bold uppercase tracking-widest opacity-40">Thank you to all contributors</p>
           <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
             The open-source ecosystem is the heartbeat of modern software. We encourage you to support these projects directly.
           </p>
        </div>
      </div>
    </div>
  );
}
