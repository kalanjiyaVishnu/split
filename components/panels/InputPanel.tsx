"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type InputPanelProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  language: string;
};

export type InputPanelHandle = {
  scrollToLine: (line: number) => void;
};

export const InputPanel = forwardRef<InputPanelHandle, InputPanelProps>(({ label, value, onChange, language }, ref) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    scrollToLine: (line: number) => {
      if (editorRef.current) {
        editorRef.current.revealLineInCenter(line);
        editorRef.current.setSelection({
          startLineNumber: line,
          startColumn: 1,
          endLineNumber: line,
          endColumn: 1000
        });
      }
    }
  }));

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-background/50",
      isFullscreen ? "fixed inset-0 z-[100] bg-background p-6" : ""
    )}>
      <header className="flex items-center justify-between p-3 border-b border-white/5 bg-background/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{label}</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-50">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </header>
      <div className="flex-1 min-h-0 bg-black/5">
        <Editor
          theme="vs-dark"
          language={language === "json" ? "json" : "plaintext"}
          value={value}
          onChange={(v) => onChange(v || "")}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            lineHeight: 22,
            fontFamily: "'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
            padding: { top: 16 },
            renderLineHighlight: "all",
            scrollbar: {
              vertical: "hidden",
              horizontal: "hidden"
            }
          }}
        />
      </div>
    </div>
  );
});

InputPanel.displayName = "InputPanel";
