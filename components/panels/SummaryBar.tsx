"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SummaryBarProps = {
  stats: {
    addedLines: number;
    removedLines: number;
    changedLines: number;
    similarity: number;
    keysAdded?: number;
    keysRemoved?: number;
    keysChanged?: number;
  };
};

export function SummaryBar({ stats }: SummaryBarProps) {
  return (
    <div className="flex items-center gap-6 p-2 px-6 bg-background/50 backdrop-blur-xl border-y border-white/5 overflow-x-auto whitespace-nowrap scrollbar-hide shadow-inner">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 group">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] group-hover:scale-125 transition-transform" />
          <span className="text-[11px] font-mono text-emerald-500/80 font-bold uppercase tracking-widest">+{stats.addedLines} Added</span>
        </div>
        <div className="flex items-center gap-2 group">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] group-hover:scale-125 transition-transform" />
          <span className="text-[11px] font-mono text-red-500/80 font-bold uppercase tracking-widest">-{stats.removedLines} Removed</span>
        </div>
        <div className="flex items-center gap-2 group">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] group-hover:scale-125 transition-transform" />
          <span className="text-[11px] font-mono text-amber-500/80 font-bold uppercase tracking-widest">~{stats.changedLines} Changed</span>
        </div>
        
        <div className="h-4 w-px bg-border/50 mx-2" />
        
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Match Score</span>
           <Badge variant="outline" className="h-5 text-[10px] font-mono border-primary/20 bg-primary/5 text-primary rounded-full px-2">
            {stats.similarity}%
           </Badge>
        </div>
      </div>

      {(stats.keysAdded !== undefined || stats.keysRemoved !== undefined || stats.keysChanged !== undefined) && (
        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-40">JSON Tree:</span>
          <div className="flex items-center gap-3">
             {stats.keysAdded !== undefined && (
               <span className="text-[10px] font-mono text-emerald-500/60 font-bold">+{stats.keysAdded}A</span>
             )}
             {stats.keysRemoved !== undefined && (
               <span className="text-[10px] font-mono text-red-500/60 font-bold">-{stats.keysRemoved}R</span>
             )}
             {stats.keysChanged !== undefined && (
               <span className="text-[10px] font-mono text-amber-500/60 font-bold">~{stats.keysChanged}C</span>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
