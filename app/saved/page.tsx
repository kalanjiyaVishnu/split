"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  ExternalLink, 
  ArrowLeft,
  FileJson,
  FileText,
  History,
  Zap,
  CheckCircle2,
  Circle
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function SavedDiffs() {
  const [diffs, setDiffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();



  const fetchDiffs = useCallback(async () => {
    try {
      const res = await fetch("/api/diff");
      const data = await res.json();
      if (Array.isArray(data)) {
        setDiffs(data);
      } else {
        setDiffs([]);
        if (data.error) {
          toast({ title: "Error", description: data.error, variant: "destructive" });
        }
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to load diffs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDiffs();
  }, [fetchDiffs]);

  const handleDelete = async (shortId: string) => {
    if (!confirm("Are you sure you want to delete this diff?")) return;
    try {
      await fetch(`/api/diff/${shortId}`, { method: "DELETE" });
      setDiffs(diffs.filter(d => d.shortId !== shortId));
      toast({ title: "Deleted", description: "Diff deleted successfully" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete diff", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">
      <header className="flex items-center justify-between px-8 h-16 border-b shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/workbench">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-muted/50 hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <History className="w-4 h-4" />
             </div>
             <h1 className="text-lg font-bold tracking-tight">Saved History</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Zap className="w-4 h-4 text-primary opacity-20" />
           <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Split Premium Archive</span>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-auto scrollbar-hide">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-50">Indexing Diffs...</p>
            </div>
          ) : diffs.length === 0 ? (
            <div className="text-center py-32 rounded-3xl border border-dashed border-white/10 bg-muted/5 flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center opacity-20">
                 <FileJson className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold">No saved sessions found</p>
                <p className="text-sm text-muted-foreground opacity-60">Start diffing in the workbench to see your history here.</p>
              </div>
              <Link href="/workbench">
                <Button className="rounded-full px-8 bg-primary">Open Workbench</Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/5 bg-card/20 backdrop-blur-xl overflow-hidden shadow-2xl">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest pl-8">Workspace Label</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Type</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Created</TableHead>
                    <TableHead className="text-right pr-8 text-[10px] font-bold uppercase tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {diffs.map((diff) => (
                    <TableRow key={diff.shortId} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="font-bold pl-8">
                        <Link href={`/diff/${diff.shortId}`} className="hover:text-primary transition-colors flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                             {diff.fileType === 'json' ? <FileJson className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          {diff.label || `Session ${diff.shortId}`}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted/30 border-white/5 rounded-full px-3 py-0.5 text-[10px] font-mono uppercase">
                          {diff.fileType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {diff.isResolved ? (
                          <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
                             <CheckCircle2 className="w-3.5 h-3.5" />
                             Resolved
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-amber-500 font-bold text-[10px] uppercase tracking-wider">
                             <Circle className="w-3.5 h-3.5" />
                             Open
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground opacity-60">
                        {new Date(diff.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/diff/${diff.shortId}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <ExternalLink className="w-4 h-4 opacity-40 hover:opacity-100 transition-opacity" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full text-destructive/40 hover:text-destructive hover:bg-destructive/10 transition-all" 
                            onClick={() => handleDelete(diff.shortId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
