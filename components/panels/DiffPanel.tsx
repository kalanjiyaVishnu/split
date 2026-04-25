"use client";

import { useEffect, useRef, useState } from "react";
import * as Diff2Html from "diff2html";
import "diff2html/bundles/css/diff2html.min.css";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, CheckCircle2, MessageSquare, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Comment = {
  id: string;
  lineNumber: number | null;
  side: string | null;
  content: string;
  author: string;
  authorHandle?: string;
  isLineStatus?: boolean;
  createdAt: string;
};

type LineStatus = {
  lineNumber: number;
  side: string;
  isResolved: boolean;
};

type DiffPanelProps = {
  unifiedDiff: string;
  viewType: "side-by-side" | "line-by-line";
  commentsEnabled: boolean;
  comments: Comment[];
  lineStatuses?: LineStatus[];
  onAddComment: (lineNumber: number, side: string, content: string, author: string, handle: string) => void;
  onToggleLineStatus?: (lineNumber: number, side: string, isResolved: boolean) => void;
};

export function DiffPanel({ 
  unifiedDiff, 
  viewType, 
  commentsEnabled, 
  comments, 
  lineStatuses = [],
  onAddComment,
  onToggleLineStatus 
}: DiffPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCommentLine, setActiveCommentLine] = useState<{line: number, side: string} | null>(null);
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorHandle, setAuthorHandle] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const savedAuthor = localStorage.getItem("diff-author-name");
    const savedHandle = localStorage.getItem("diff-author-handle");
    if (savedAuthor) setAuthorName(savedAuthor);
    if (savedHandle) setAuthorHandle(savedHandle);
  }, []);

  const html = Diff2Html.html(unifiedDiff, {
    drawFileList: false,
    matching: 'lines',
    outputFormat: viewType,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Clean up previous injections
    const existingInjected = container.querySelectorAll('.custom-line-actions, .custom-comment-row');
    existingInjected.forEach(el => el.remove());

    const rows = container.querySelectorAll('.d2h-diff-tbody > tr');
    
    rows.forEach(row => {
      const lineCells = row.querySelectorAll('.d2h-code-linenumber, .d2h-code-side-linenumber');
      
      lineCells.forEach((cell, index) => {
        const lineNum = parseInt(cell.textContent || "0");
        if (!lineNum || lineNum <= 0) return;

        let side = 'left';
        if (viewType === 'side-by-side') {
          side = index === 0 ? 'left' : 'right';
        } else {
          side = cell.classList.contains('d2h-ins') ? 'right' : 'left';
        }

        const status = lineStatuses.find(s => s.lineNumber === lineNum && s.side === side);
        const isResolved = status?.isResolved || false;

        if (isResolved) {
           const codeCell = cell.nextElementSibling as HTMLElement;
           if (codeCell) codeCell.style.opacity = '0.2';
           cell.classList.add('resolved-cell');
        }

        const actions = document.createElement('div');
        actions.className = 'custom-line-actions';
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = `action-btn resolve-btn ${isResolved ? 'active' : ''}`;
        toggleBtn.innerHTML = isResolved ? '✓' : '';
        toggleBtn.onclick = (e) => {
          e.stopPropagation();
          onToggleLineStatus?.(lineNum, side, !isResolved);
        };
        
        const commentBtn = document.createElement('button');
        commentBtn.className = 'action-btn comment-btn';
        commentBtn.innerHTML = '+';
        commentBtn.onclick = (e) => {
          e.stopPropagation();
          setActiveCommentLine({ line: lineNum, side: side });
        };

        actions.appendChild(toggleBtn);
        actions.appendChild(commentBtn);
        cell.appendChild(actions);
        (cell as HTMLElement).classList.add('has-actions');

        const lineComments = comments.filter(c => c.lineNumber === lineNum && c.side === side);
        if (lineComments.length > 0) {
          const commentRow = document.createElement('tr');
          commentRow.className = 'custom-comment-row';
          commentRow.innerHTML = `<td colspan="4" class="comment-cell-container">
            <div class="comment-thread ${side === 'right' && viewType === 'side-by-side' ? 'ml-auto' : ''}">
              ${lineComments.map(c => `
                <div class="comment-item animate-fade-in">
                  <div class="comment-header">
                    <span class="author">${c.author}</span>
                    <span class="handle">@${c.authorHandle || 'anon'}</span>
                    <span class="time">${new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p class="content">${c.content}</p>
                </div>
              `).join('')}
            </div>
          </td>`;
          row.parentNode?.insertBefore(commentRow, row.nextSibling);
        }
      });
    });
  }, [html, comments, lineStatuses, viewType]);

  const handleSubmitComment = () => {
    if (!commentText.trim() || !activeCommentLine) return;
    onAddComment(activeCommentLine.line, activeCommentLine.side, commentText, authorName || "Anonymous", authorHandle || "anon");
    if (authorName) localStorage.setItem("diff-author-name", authorName);
    if (authorHandle) localStorage.setItem("diff-author-handle", authorHandle);
    setCommentText("");
    setActiveCommentLine(null);
  };

  return (
    <div className={cn(
      "relative bg-transparent h-full",
      isFullscreen ? "fixed inset-0 z-[100] bg-background animate-fade-in p-6" : ""
    )}>
      <div className="absolute top-4 right-8 z-10">
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-8 w-8 glass rounded-full shadow-lg border-white/10" 
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      <div 
        ref={containerRef}
        className="diff2html-container overflow-auto scrollbar-hide h-full"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      
      {activeCommentLine && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-background/60 backdrop-blur-md animate-fade-in">
          <div className="bg-card border shadow-2xl rounded-2xl w-full max-w-md p-6 glass-card">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MessageSquare className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest">Add Comment</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">Line {activeCommentLine.line} • {activeCommentLine.side} side</p>
               </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Identity</label>
                  <input 
                    className="flex h-10 w-full rounded-xl border bg-muted px-3 py-1 text-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none border-white/5" 
                    value={authorName} 
                    onChange={e => setAuthorName(e.target.value)} 
                    placeholder="Name" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Handle</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm opacity-50">@</span>
                    <input 
                      className="flex h-10 w-full rounded-xl border bg-muted pl-7 pr-3 py-1 text-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none border-white/5" 
                      value={authorHandle} 
                      onChange={e => setAuthorHandle(e.target.value)} 
                      placeholder="handle" 
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Comment</label>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-xl border bg-muted px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none font-anthropic border-white/5 resize-none"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" className="rounded-full px-6" onClick={() => setActiveCommentLine(null)}>Cancel</Button>
                <Button onClick={handleSubmitComment} className="px-10 rounded-full bg-primary font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20">Post</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        /* FORCE READABILITY ACROSS MODES */
        .d2h-file-header { display: none !important; }
        .d2h-file-wrapper { border: none !important; background: transparent !important; }
        
        /* LINENUMBERS - NO BACKGROUNDS IN EITHER MODE */
        .d2h-code-linenumber, .d2h-code-side-linenumber { 
          background-color: transparent !important;
          border-right: 1px solid var(--border) !important;
          color: var(--muted-foreground) !important;
          width: 50px !important;
          position: relative !important;
          padding: 0 10px !important;
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 12px !important;
          opacity: 0.6;
        }

        /* TEXT COLOR FIX */
        .d2h-code-line-ctn { 
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 13px !important;
          padding-left: 10px !important;
          line-height: 24px !important;
          color: inherit !important; /* Let parent or standard mode decide */
        }

        /* Normal text in diff lines */
        .d2h-code-line-ctn span { color: inherit !important; }

        /* Mode-aware base text */
        .diff2html-container { color: #111; }
        .dark .diff2html-container { color: rgba(255,255,255,0.9); }

        /* ADDED/REMOVED BACKGROUNDS */
        .d2h-ins { background-color: rgba(16, 185, 129, 0.08) !important; }
        .d2h-del { background-color: rgba(239, 68, 68, 0.08) !important; }

        /* TEXT COLORS FOR DIFFS */
        .d2h-ins .d2h-code-line-ctn { color: #065f46 !important; }
        .d2h-del .d2h-code-line-ctn { color: #991b1b !important; }
        
        .dark .d2h-ins .d2h-code-line-ctn { color: #34d399 !important; }
        .dark .d2h-del .d2h-code-line-ctn { color: #f87171 !important; }

        /* WORD FRAGMENTS - THE STICKERS */
        .d2h-ins mark {
          background-color: rgba(16, 185, 129, 0.25) !important;
          color: #064e3b !important;
          border-radius: 4px;
          padding: 0 2px;
        }
        .d2h-del mark {
          background-color: rgba(239, 68, 68, 0.25) !important;
          color: #7f1d1d !important;
          border-radius: 4px;
          padding: 0 2px;
        }

        .dark .d2h-ins mark { background-color: rgba(16, 185, 129, 0.4) !important; color: #fff !important; }
        .dark .d2h-del mark { background-color: rgba(239, 68, 68, 0.4) !important; color: #fff !important; }

        /* ACTIONS */
        .has-actions:hover .custom-line-actions { opacity: 1; }
        .custom-line-actions {
          position: absolute;
          left: 0; top: 0; bottom: 0; right: 0;
          display: flex; align-items: center; justify-content: center;
          gap: 4px; background: var(--muted);
          opacity: 0; transition: opacity 0.2s; z-index: 10;
        }

        /* COMMENTS */
        .comment-item {
          background: var(--card); border: 1px solid var(--border);
          padding: 16px; border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .dark .comment-item { background: #000; border-color: rgba(255,255,255,0.1); }
      `}} />
    </div>
  );
}
