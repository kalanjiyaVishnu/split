"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { 
  Columns, 
  Rows, 
  Moon, 
  Sun,
  LayoutGrid,
  ArrowLeft,
  MessageSquare,
  CheckCircle2,
  Circle,
  Share2,
  Zap,
  Eye,
  EyeOff,
  Code2,
  FileDiff,
  Network,
  User as UserIcon,
  LogOut
} from "lucide-react";
import { InputPanel, type InputPanelHandle } from "@/components/panels/InputPanel";
import { DiffPanel } from "@/components/panels/DiffPanel";
import { VisualizationPanel } from "@/components/panels/VisualizationPanel";
import { SummaryBar } from "@/components/panels/SummaryBar";
import { computeUnifiedDiff, computeDiffStats } from "@/lib/diff";
import { findLineNumberForPath } from "@/lib/json-utils";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SavedDiffView({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [diffData, setDiffData] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [lineStatuses, setLineStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"side-by-side" | "line-by-line">("side-by-side");
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<{handle: string, name: string} | null>(null);
  const [visiblePanels, setVisiblePanels] = useState({
    editors: true,
    diff: true,
    visualizer: true
  });

  const leftEditorRef = useRef<InputPanelHandle>(null);
  const rightEditorRef = useRef<InputPanelHandle>(null);

  useEffect(() => {
    fetchDiff();
    fetchComments();
    fetchLineStatuses();
    fetchSession();
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const fetchSession = async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    if (data.user) setUser(data.user);
  };

  const fetchDiff = async () => {
    try {
      const res = await fetch(`/api/diff/${params.id}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDiffData(data);
    } catch (e) {
      toast({ title: "Error", description: "Failed to load diff", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/${params.id}`);
      const data = await res.json();
      setComments(data);
    } catch (e) {}
  };

  const fetchLineStatuses = async () => {
    try {
      const res = await fetch(`/api/diff/${params.id}/line-status`);
      const data = await res.json();
      if (Array.isArray(data)) setLineStatuses(data);
    } catch (e) {}
  };

  const handleNodeClick = useCallback((path: string, side: 'left' | 'right') => {
    if (!diffData) return;
    const jsonStr = side === 'left' ? diffData.leftContent : diffData.rightContent;
    const lineNum = findLineNumberForPath(jsonStr, path);
    
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
  }, [diffData, toast]);

  const toggleResolved = async () => {
    const newStatus = !diffData.isResolved;
    try {
      const res = await fetch(`/api/diff/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isResolved: newStatus })
      });
      const updated = await res.json();
      setDiffData(updated);
      toast({ title: newStatus ? "Resolved" : "Reopened" });
    } catch (e) {}
  };

  const handleToggleLineStatus = async (lineNumber: number, side: string, isResolved: boolean) => {
    try {
      const res = await fetch(`/api/diff/${params.id}/line-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineNumber, side, isResolved })
      });
      const updatedStatus = await res.json();
      setLineStatuses(prev => {
        const filtered = prev.filter(s => !(s.lineNumber === lineNumber && s.side === side));
        return [...filtered, updatedStatus];
      });
      
      handleAddComment(
        lineNumber, 
        side, 
        isResolved ? "✓ Line marked as resolved" : "↺ Line reopened", 
        localStorage.getItem("diff-author-name") || "System",
        localStorage.getItem("diff-author-handle") || "system",
        true
      );
    } catch (e) {}
  };

  const handleAddComment = async (lineNumber: number, side: string, content: string, author: string, authorHandle: string, isLineStatus = false) => {
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diffId: params.id,
          lineNumber,
          side,
          content,
          author,
          authorHandle,
          isLineStatus
        })
      });
      const newComment = await res.json();
      setComments(prev => [...prev, newComment]);
    } catch (e) {}
  };

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
    toast({ title: "Logged out" });
  };

  const togglePanel = (panel: keyof typeof visiblePanels) => {
    setVisiblePanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  const unifiedDiff = useMemo(() => {
    if (!diffData) return "";
    return computeUnifiedDiff(diffData.leftContent, diffData.rightContent, diffData.fileType);
  }, [diffData]);

  const stats = useMemo(() => {
    if (!diffData) return { addedLines: 0, removedLines: 0, changedLines: 0, matchPercentage: 0 };
    return computeDiffStats(unifiedDiff, diffData.leftContent, diffData.rightContent, diffData.fileType);
  }, [unifiedDiff, diffData]);

  const { leftJson, rightJson } = useMemo(() => {
    if (!diffData || diffData.fileType !== "json") return { leftJson: null, rightJson: null };
    let l = null, r = null;
    try { l = JSON.parse(diffData.leftContent); } catch (e) {}
    try { r = JSON.parse(diffData.rightContent); } catch (e) {}
    return { leftJson: l, rightJson: r };
  }, [diffData]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Zap className="w-10 h-10 text-primary animate-pulse" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Loading Workspace...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground font-sans">
      <header className="flex items-center justify-between px-6 h-16 border-b shrink-0 bg-background/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-muted/50 hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          
          <div className="h-6 w-px bg-border mx-2" />
          
          <div className="flex flex-col">
            <h2 className="text-sm font-bold tracking-tight leading-tight">{diffData.label}</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-muted-foreground opacity-60">{diffData.fileType}</span>
              <span className="text-[10px] text-muted-foreground opacity-40">•</span>
              <span className="text-[10px] text-muted-foreground opacity-60">{new Date(diffData.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-white/5 mx-2">
            <Button variant="ghost" size="icon" className={cn("h-7 w-7 rounded-full", visiblePanels.editors ? "bg-background shadow-sm text-primary" : "text-muted-foreground")} onClick={() => togglePanel('editors')} title="Toggle Editors">
              <Code2 className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className={cn("h-7 w-7 rounded-full", visiblePanels.diff ? "bg-background shadow-sm text-primary" : "text-muted-foreground")} onClick={() => togglePanel('diff')} title="Toggle Diff View">
              <FileDiff className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className={cn("h-7 w-7 rounded-full", visiblePanels.visualizer ? "bg-background shadow-sm text-primary" : "text-muted-foreground")} onClick={() => togglePanel('visualizer')} title="Toggle Visualizer">
              <Network className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={cn("h-9 gap-2 px-6 rounded-full border-primary/20", diffData.isResolved ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "hover:bg-primary/5")} 
            onClick={toggleResolved}
          >
            {diffData.isResolved ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            <span className="text-xs font-bold uppercase tracking-widest">{diffData.isResolved ? "Resolved" : "Mark Resolved"}</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full ml-2" onClick={toggleDarkMode}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <div className="h-6 w-px bg-border mx-2" />

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
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-2 bg-muted/5">
        <ResizablePanelGroup direction="vertical">
          {visiblePanels.editors && (
            <>
              <ResizablePanel defaultSize={35} minSize={5} className="p-1">
                <div className="h-full rounded-2xl overflow-hidden border bg-card/50 shadow-sm">
                  <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={50}>
                      <InputPanel ref={leftEditorRef} label="ORIGINAL" value={diffData.leftContent} onChange={() => {}} language={diffData.fileType} />
                    </ResizablePanel>
                    <ResizableHandle className="bg-border/30 w-1" />
                    <ResizablePanel defaultSize={50}>
                      <InputPanel ref={rightEditorRef} label="MODIFIED" value={diffData.rightContent} onChange={() => {}} language={diffData.fileType} />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>
              </ResizablePanel>
              {(visiblePanels.diff || visiblePanels.visualizer) && <ResizableHandle className="bg-transparent h-1.5" />}
            </>
          )}
          
          {(visiblePanels.diff || visiblePanels.visualizer) && (
            <ResizablePanel defaultSize={visiblePanels.editors ? 65 : 100} minSize={5} className="flex flex-col gap-1.5">
              <div className="shrink-0 z-10 px-1">
                <SummaryBar stats={stats} />
              </div>

              <div className="flex-1 min-h-0 p-1 pt-0">
                <div className="h-full rounded-2xl overflow-hidden border bg-card/50 shadow-sm flex flex-col">
                  <ResizablePanelGroup direction="horizontal">
                    {visiblePanels.diff && (
                      <ResizablePanel defaultSize={visiblePanels.visualizer ? 60 : 100} className="overflow-auto scrollbar-hide bg-black/5">
                        <DiffPanel 
                          unifiedDiff={unifiedDiff} 
                          viewType={viewMode} 
                          commentsEnabled={true} 
                          comments={comments} 
                          lineStatuses={lineStatuses}
                          onAddComment={handleAddComment} 
                          onToggleLineStatus={handleToggleLineStatus}
                        />
                      </ResizablePanel>
                    )}
                    
                    {visiblePanels.diff && visiblePanels.visualizer && <ResizableHandle className="bg-border/30 w-1" />}
                    
                    {visiblePanels.visualizer && (
                      <ResizablePanel defaultSize={visiblePanels.diff ? 40 : 100} className="bg-muted/10">
                        <VisualizationPanel 
                          leftJson={leftJson} 
                          rightJson={rightJson} 
                          fileType={diffData.fileType} 
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
      </main>
    </div>
  );
}
