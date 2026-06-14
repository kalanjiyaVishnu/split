"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Share2, 
  Save, 
  History, 
  Moon, 
  Sun,
  Zap,
  Code2,
  FileDiff,
  Network,
  Maximize2,
  User as UserIcon,
  LogOut
} from "lucide-react";
import { InputPanel, type InputPanelHandle } from "@/components/panels/InputPanel";
import { DiffPanel } from "@/components/panels/DiffPanel";
import { VisualizationPanel } from "@/components/panels/VisualizationPanel";
import { SummaryBar } from "@/components/panels/SummaryBar";
import { computeUnifiedDiff, computeDiffStats } from "@/lib/diff";
import { encodeConfig, decodeConfig, type DiffConfig } from "@/lib/encode";
import { findLineNumberForPath } from "@/lib/json-utils";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [left, setLeft] = useState(JSON.stringify({
    "project": "Split Premium",
    "version": "1.0.0",
    "status": "stable",
    "features": [
      "Side-by-side diffing",
      "JSON Visualization",
      "Collaborative Comments",
      "Local History"
    ],
    "author": {
      "name": "Antigravity",
      "role": "Lead Architect"
    },
    "settings": {
      "theme": "dark",
      "notifications": true
    }
  }, null, 2));
  const [right, setRight] = useState(JSON.stringify({
    "project": "Split Premium",
    "version": "1.1.0",
    "status": "beta",
    "features": [
      "Side-by-side diffing",
      "3D Graph Visualization",
      "Line Resolution",
      "Local History",
      "Deep Path Navigation"
    ],
    "author": {
      "name": "Antigravity",
      "role": "Principal Engineer"
    },
    "settings": {
      "theme": "premium-dark",
      "notifications": true,
      "autoSave": true
    }
  }, null, 2));
  const [fileType, setFileType] = useState<"json" | "text" | "yaml" | "markdown">("json");
  const [viewMode, setViewMode] = useState<"side-by-side" | "line-by-line">("side-by-side");
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<{handle: string, name: string} | null>(null);
  const [visiblePanels, setVisiblePanels] = useState({
    editors: true,
    diff: true,
    visualizer: true
  });

  const leftEditorRef = useRef<InputPanelHandle>(null);
  const rightEditorRef = useRef<InputPanelHandle>(null);

  // Parse JSON for visualization safety
  const { leftJson, rightJson } = useMemo(() => {
    if (fileType !== "json") return { leftJson: null, rightJson: null };
    let l = null, r = null;
    try { if (left.trim()) l = JSON.parse(left); } catch (e) {}
    try { if (right.trim()) r = JSON.parse(right); } catch (e) {}
    return { leftJson: l, rightJson: r };
  }, [left, right, fileType]);

  const unifiedDiff = useMemo(() => computeUnifiedDiff(left, right, fileType), [left, right, fileType]);
  const stats = useMemo(() => computeDiffStats(unifiedDiff, left, right, fileType), [unifiedDiff, left, right, fileType]);

  useEffect(() => {
    setIsMounted(true);
    fetch("/api/auth/me").then(res => res.json()).then(data => {
      if (data.user) setUser(data.user);
    });

    if (window.location.hash.startsWith("#diff=")) {
      const hash = window.location.hash.replace("#diff=", "");
      const config = decodeConfig(hash);
      if (config) {
        setLeft(config.left);
        setRight(config.right);
        setFileType(config.fileType);
      }
    }

    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.refresh();
    toast({ title: "Logged out" });
  };

  const togglePanel = (panel: keyof typeof visiblePanels) => {
    setVisiblePanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  const soloPanel = (panel: keyof typeof visiblePanels) => {
    // If only the target panel is visible, restore all
    const othersHidden = Object.keys(visiblePanels)
      .filter(p => p !== panel)
      .every(p => !visiblePanels[p as keyof typeof visiblePanels]);

    if (othersHidden) {
      setVisiblePanels({ editors: true, diff: true, visualizer: true });
    } else {
      setVisiblePanels({
        editors: panel === 'editors',
        diff: panel === 'diff',
        visualizer: panel === 'visualizer'
      });
    }
  };

  const handleNodeClick = useCallback((path: string, side: 'left' | 'right') => {
    console.log(`[Workbench] Node clicked on ${side}:`, path);
    const jsonStr = side === 'left' ? left : right;
    const lineNum = findLineNumberForPath(jsonStr, path);
    
    console.log(`[Workbench] Mapping path to line:`, lineNum);
    
    if (side === 'left') {
      leftEditorRef.current?.scrollToLine(lineNum);
    } else {
      rightEditorRef.current?.scrollToLine(lineNum);
    }

    toast({
      title: "Navigated to Path",
      description: `Mapped "${path}" to line ${lineNum} in ${side} editor.`,
      duration: 2000,
    });
  }, [left, right, toast]);

  const handleShare = () => {
    const config: DiffConfig = {
      left,
      right,
      fileType,
      commentsEnabled: false,
      createdAt: new Date().toISOString()
    };
    const encoded = encodeConfig(config);
    if (encoded.length > 8000) {
      toast({
        title: "URL too long",
        description: "Your content is too large for a share link. Try saving instead.",
        variant: "destructive"
      });
      return;
    }
    const url = `${window.location.origin}${window.location.pathname}#diff=${encoded}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link Copied" });
  };

  const handleSave = async () => {
    if (!left && !right) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/diff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leftContent: left,
          rightContent: right,
          fileType,
          label: `Diff ${new Date().toLocaleString()}`,
          commentsEnabled: true
        })
      });
      const data = await res.json();
      if (data.shortId) {
        window.location.href = `/diff/${data.shortId}`;
      }
    } catch (e) {
      toast({ title: "Error Saving", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground font-sans">
      <header className="flex items-center justify-between px-6 h-16 border-b shrink-0 bg-background/80 backdrop-blur-md z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            <span className="font-bold tracking-tight text-lg">Split</span>
          </div>
          
          <Select value={fileType} onValueChange={(v: any) => setFileType(v)}>
            <SelectTrigger className="w-[100px] h-8 text-[10px] font-mono uppercase bg-muted/30 border-none rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="text">TEXT</SelectItem>
              <SelectItem value="yaml">YAML</SelectItem>
              <SelectItem value="markdown">MD</SelectItem>
            </SelectContent>
          </Select>

          {/* Panel Toggles */}
          <div className="flex items-center gap-1 bg-muted/30 p-1.5 rounded-full border border-white/5 mx-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-8 gap-2 px-3 rounded-full transition-all", visiblePanels.editors ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-white/5")} 
              onClick={() => togglePanel('editors')}
              onDoubleClick={() => soloPanel('editors')}
              title="Click to Toggle, Double-Click to Solo"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden xl:inline-block">Editors</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-8 gap-2 px-3 rounded-full transition-all", visiblePanels.diff ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-white/5")} 
              onClick={() => togglePanel('diff')}
              onDoubleClick={() => soloPanel('diff')}
              title="Click to Toggle, Double-Click to Solo"
            >
              <FileDiff className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden xl:inline-block">Diff</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-8 gap-2 px-3 rounded-full transition-all", visiblePanels.visualizer ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-white/5")} 
              onClick={() => togglePanel('visualizer')}
              onDoubleClick={() => soloPanel('visualizer')}
              title="Click to Toggle, Double-Click to Solo"
            >
              <Network className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden xl:inline-block">Visualizer</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/visualizer">
            <Button variant="ghost" size="sm" className="h-9 gap-2 px-4 rounded-full hover:bg-primary/10 text-primary">
              <Network className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest hidden lg:inline-block">Studio</span>
            </Button>
          </Link>
          <div className="h-6 w-px bg-border mx-1" />
          <Link href="/saved">
            <Button variant="ghost" size="sm" className="h-9 gap-2 px-4 rounded-full hover:bg-muted">
              <History className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest hidden md:inline-block">History</span>
            </Button>
          </Link>
          <div className="h-6 w-px bg-border mx-1" />
          <Button variant="outline" size="sm" className="h-9 gap-2 rounded-full border-primary/20 hover:bg-primary/5" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline-block">Share</span>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="h-9 gap-2 px-6 rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/10" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{isSaving ? "Saving..." : "Save Diff"}</span>
          </Button>
          
          <div className="h-6 w-px bg-border mx-1" />
          
          {user ? (
            <div className="flex items-center gap-3 pl-2">
               <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[11px] font-bold leading-tight">{user.name}</span>
                  <span className="text-[9px] text-muted-foreground font-mono opacity-60">@{user.handle}</span>
               </div>
               <div className="relative group">
                 <div className="w-9 h-9 rounded-full bg-muted border border-white/10 flex items-center justify-center overflow-hidden">
                    <UserIcon className="w-4 h-4" />
                 </div>
                 <Button 
                   variant="destructive" 
                   size="icon" 
                   className="absolute -top-1 -right-1 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                   onClick={handleLogout}
                 >
                   <LogOut className="w-2.5 h-2.5" />
                 </Button>
               </div>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="h-9 gap-2 px-4 rounded-full border border-primary/10 hover:bg-primary/5">
                <UserIcon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest hidden md:inline-block">Sign In</span>
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full ml-2" onClick={toggleDarkMode}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-2 bg-muted/5">
        {!visiblePanels.editors && !visiblePanels.diff && !visiblePanels.visualizer ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-6 opacity-20">
               <Zap className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2 opacity-60">Workspace Hidden</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto opacity-40">
              Use the layout controls in the header to re-enable your workspace components.
            </p>
          </div>
        ) : (
          <ResizablePanelGroup direction="vertical" className="transition-all duration-500 ease-in-out">
            {visiblePanels.editors && (
              <>
                <ResizablePanel defaultSize={35} minSize={5} className="p-1 relative group/panel animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover/panel:opacity-100 transition-opacity">
                     <Button 
                       variant="secondary" 
                       size="icon" 
                       className="h-7 w-7 rounded-full glass border-white/10 shadow-xl"
                       onClick={() => soloPanel('editors')}
                       title="Solo Mode"
                     >
                        <Maximize2 className="w-3.5 h-3.5" />
                     </Button>
                  </div>
                  <div className="h-full rounded-2xl overflow-hidden border bg-card/50 shadow-sm transition-all duration-300">
                    <ResizablePanelGroup direction="horizontal">
                      <ResizablePanel defaultSize={50}>
                        <InputPanel ref={leftEditorRef} label="ORIGINAL" value={left} onChange={setLeft} language={fileType} />
                      </ResizablePanel>
                      <ResizableHandle className="bg-border/30 w-1" />
                      <ResizablePanel defaultSize={50}>
                        <InputPanel ref={rightEditorRef} label="MODIFIED" value={right} onChange={setRight} language={fileType} />
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </div>
                </ResizablePanel>
                {(visiblePanels.diff || visiblePanels.visualizer) && <ResizableHandle className="bg-transparent h-1.5" />}
              </>
            )}
            
            {(visiblePanels.diff || visiblePanels.visualizer) && (
              <ResizablePanel defaultSize={visiblePanels.editors ? 65 : 100} minSize={5} className="flex flex-col gap-1.5 relative group/panel animate-in fade-in slide-in-from-bottom-4 duration-500">


                <div className="shrink-0 z-10 px-1">
                  <SummaryBar stats={stats} />
                </div>

                <div className="flex-1 min-h-0 p-1 pt-0">
                  <div className="h-full rounded-2xl overflow-hidden border bg-card/50 shadow-sm flex flex-col transition-all duration-300">
                    <ResizablePanelGroup direction="horizontal">
                      {visiblePanels.diff && (
                        <ResizablePanel defaultSize={visiblePanels.visualizer ? 60 : 100} className="overflow-auto scrollbar-hide bg-black/5 relative group/subpanel">
                          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover/subpanel:opacity-100 transition-opacity">
                             <Button 
                               variant="secondary" 
                               size="icon" 
                               className="h-7 w-7 rounded-full glass border-white/10 shadow-xl"
                               onClick={() => soloPanel('diff')}
                               title="Solo Mode"
                             >
                                <Maximize2 className="w-3.5 h-3.5" />
                             </Button>
                          </div>
                          <DiffPanel 
                            unifiedDiff={unifiedDiff} 
                            viewType={viewMode} 
                            commentsEnabled={false} 
                            comments={[]} 
                            onAddComment={() => {}} 
                            hideFullscreenButton={true}
                          />
                        </ResizablePanel>
                      )}
                      
                      {visiblePanels.diff && visiblePanels.visualizer && <ResizableHandle className="bg-border/30 w-1" />}
                      
                      {visiblePanels.visualizer && (
                        <ResizablePanel defaultSize={visiblePanels.diff ? 40 : 100} className="bg-muted/10 relative group/subpanel">
                          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover/subpanel:opacity-100 transition-opacity">
                             <Button 
                               variant="secondary" 
                               size="icon" 
                               className="h-7 w-7 rounded-full glass border-white/10 shadow-xl"
                               onClick={() => soloPanel('visualizer')}
                               title="Solo Mode"
                             >
                                <Maximize2 className="w-3.5 h-3.5" />
                             </Button>
                          </div>
                          <VisualizationPanel 
                            leftJson={leftJson} 
                            rightJson={rightJson} 
                            fileType={fileType} 
                            onNodeClick={handleNodeClick}
                          />
                        </ResizablePanel>
                      )}
                    </ResizablePanelGroup>
                  </div>
                </div>
              </ResizablePanel>
            )}
          </ResizablePanelGroup>
        )}
      </main>
    </div>
  );
}
