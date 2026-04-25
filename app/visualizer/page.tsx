"use client";

import { useState, useMemo } from "react";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Network, 
  Maximize2, 
  Minimize2, 
  ArrowLeft,
  Settings,
  Code2,
  FileJson
} from "lucide-react";
import { InputPanel } from "@/components/panels/InputPanel";
import PremiumVisualizer from "@/components/PremiumVisualizer";
import JSONCrackWidget from "@/components/JSONCrackWidget";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function VisualizerPage() {
  const [json, setJson] = useState(JSON.stringify({
    "project": "Split Premium",
    "module": "Visualizer Studio",
    "config": {
      "mode": "standalone",
      "interactive": true,
      "engine": "ReactFlow"
    },
    "nodes": [
      { "id": 1, "label": "Start" },
      { "id": 2, "label": "Process" },
      { "id": 3, "label": "End" }
    ]
  }, null, 2));

  const [visualizerType, setVisualizerType] = useState<"classic" | "premium">("premium");
  const [showEditor, setShowEditor] = useState(true);

  const parsedJson = useMemo(() => {
    try {
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }, [json]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30">
      {/* Header */}
      <header className="flex items-center justify-between px-6 h-16 border-b shrink-0 bg-background/80 backdrop-blur-md z-30 sticky top-0">
        <div className="flex items-center gap-6">
          <Link href="/workbench">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <FileJson className="w-4 h-4 text-primary" />
             </div>
             <h1 className="font-bold text-sm uppercase tracking-[0.2em]">Visualizer Studio</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex bg-muted/30 p-1 rounded-full border border-white/5">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-8 px-6 rounded-full text-[10px] font-bold uppercase tracking-widest gap-2", visualizerType === 'premium' ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground")}
                onClick={() => setVisualizerType('premium')}
              >
                <Zap className="w-3 h-3 fill-current" />
                Premium
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-8 px-6 rounded-full text-[10px] font-bold uppercase tracking-widest gap-2", visualizerType === 'classic' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
                onClick={() => setVisualizerType('classic')}
              >
                <Network className="w-3 h-3" />
                Classic
              </Button>
           </div>
           
           <div className="h-6 w-px bg-border mx-2" />
           
           <Button 
             variant="outline" 
             size="sm" 
             className={cn("h-9 gap-2 rounded-full border-primary/20", showEditor && "bg-primary/5")}
             onClick={() => setShowEditor(!showEditor)}
           >
             <Code2 className="w-4 h-4" />
             <span className="text-[10px] font-bold uppercase tracking-widest">{showEditor ? "Hide Editor" : "Show Editor"}</span>
           </Button>
        </div>
      </header>

      <main className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal">
          {showEditor && (
            <>
              <ResizablePanel defaultSize={30} minSize={10} className="p-2">
                <div className="h-full rounded-2xl overflow-hidden border bg-card/40 shadow-sm">
                   <InputPanel 
                     label="JSON SOURCE" 
                     value={json} 
                     onChange={setJson} 
                     language="json" 
                   />
                </div>
              </ResizablePanel>
              <ResizableHandle className="bg-transparent w-1.5" />
            </>
          )}

          <ResizablePanel defaultSize={showEditor ? 70 : 100} className="p-2">
             <div className="h-full rounded-3xl overflow-hidden border bg-card/40 shadow-2xl relative">
                {parsedJson ? (
                  visualizerType === 'premium' ? (
                    <PremiumVisualizer json={parsedJson} onNodeClick={(path) => console.log("Path:", path)} />
                  ) : (
                    <JSONCrackWidget json={parsedJson} />
                  )
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-background/50 backdrop-blur-md">
                     <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                        <Settings className="w-8 h-8 text-red-500 animate-spin" />
                     </div>
                     <p className="font-mono text-xs uppercase tracking-widest">Invalid JSON Input</p>
                  </div>
                )}
             </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
