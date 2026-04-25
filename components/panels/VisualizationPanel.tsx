"use client";

import { useState } from "react";
import JSONCrackWidget from "@/components/JSONCrackWidget";
import PremiumVisualizer from "@/components/PremiumVisualizer";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, Split, Layout, Zap, Network } from "lucide-react";
import { cn } from "@/lib/utils";

type VisualizationPanelProps = {
  leftJson: any;
  rightJson: any;
  fileType: string;
  onNodeClick?: (path: string, side: 'left' | 'right') => void;
};

export function VisualizationPanel({ leftJson, rightJson, fileType, onNodeClick }: VisualizationPanelProps) {
  const [activeSide, setActiveSide] = useState<"left" | "right" | "both">("both");
  const [visualizerType, setVisualizerType] = useState<"classic" | "premium">("premium");
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (fileType !== "json") {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-xs uppercase tracking-widest font-mono p-12 text-center">
        Visualization only available for JSON data
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col h-full bg-black/20",
      isFullscreen ? "fixed inset-0 z-[100] bg-background p-6" : ""
    )}>
      <header className="flex items-center justify-between p-3 border-b border-white/5 bg-background/40 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex bg-muted/30 p-1 rounded-full border border-white/5">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 px-4 rounded-full text-[10px] font-bold uppercase tracking-wider", activeSide === 'left' ? "bg-background shadow-sm text-primary" : "text-muted-foreground")}
              onClick={() => setActiveSide('left')}
            >
              Left
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 px-4 rounded-full text-[10px] font-bold uppercase tracking-wider", activeSide === 'right' ? "bg-background shadow-sm text-primary" : "text-muted-foreground")}
              onClick={() => setActiveSide('right')}
            >
              Right
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 px-4 rounded-full text-[10px] font-bold uppercase tracking-wider", activeSide === 'both' ? "bg-background shadow-sm text-primary" : "text-muted-foreground")}
              onClick={() => setActiveSide('both')}
            >
              Both
            </Button>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex bg-primary/5 p-1 rounded-full border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.05)]">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 px-4 rounded-full text-[10px] font-bold uppercase tracking-wider gap-2", visualizerType === 'premium' ? "bg-primary text-primary-foreground shadow-lg" : "text-primary/60 hover:text-primary")}
              onClick={() => setVisualizerType('premium')}
              title="Switch to Premium Interactive Graph"
            >
              <Zap className="w-3 h-3 fill-current" />
              Premium
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 px-4 rounded-full text-[10px] font-bold uppercase tracking-wider gap-2", visualizerType === 'classic' ? "bg-muted shadow-sm text-foreground" : "text-muted-foreground")}
              onClick={() => setVisualizerType('classic')}
              title="Switch to Classic JSONCrack"
            >
              <Network className="w-3 h-3" />
              Classic
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full" 
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <div className="flex-1 min-h-0 relative">
        <div className={cn(
          "h-full grid gap-1 p-1",
          activeSide === 'both' ? "grid-rows-2" : "grid-rows-1"
        )}>
          {(activeSide === 'left' || activeSide === 'both') && (
            <div className="relative border border-white/5 rounded-xl overflow-hidden bg-black/40 group">
              <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[9px] font-bold text-white/40 uppercase tracking-widest pointer-events-none group-hover:text-primary transition-colors">Original</div>
              {visualizerType === 'premium' ? (
                <PremiumVisualizer 
                  json={leftJson} 
                  onNodeClick={(path) => onNodeClick?.(path, 'left')}
                />
              ) : (
                <JSONCrackWidget 
                  json={leftJson} 
                  onNodeClick={(path) => onNodeClick?.(path, 'left')} 
                />
              )}
            </div>
          )}
          {(activeSide === 'right' || activeSide === 'both') && (
            <div className="relative border border-white/5 rounded-xl overflow-hidden bg-black/40 group">
              <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[9px] font-bold text-white/40 uppercase tracking-widest pointer-events-none group-hover:text-primary transition-colors">Modified</div>
              {visualizerType === 'premium' ? (
                <PremiumVisualizer 
                  json={rightJson} 
                  onNodeClick={(path) => onNodeClick?.(path, 'right')}
                />
              ) : (
                <JSONCrackWidget 
                  json={rightJson} 
                  onNodeClick={(path) => onNodeClick?.(path, 'right')} 
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
