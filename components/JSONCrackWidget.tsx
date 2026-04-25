"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

type JSONCrackWidgetProps = {
  json: any;
  theme?: "light" | "dark";
  direction?: "DOWN" | "RIGHT";
  onNodeClick?: (path: string) => void;
};

export default function JSONCrackWidget({ json, theme = "dark", direction = "RIGHT", onNodeClick }: JSONCrackWidgetProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hasSentData, setHasSentData] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handshake - standard JSONCrack sends 'json-crack-ready'
      // but cross-origin issues can make data 'undefined'
      if (event.origin.includes("jsoncrack.com")) {
        if (event.data === "json-crack-ready" || event.data === undefined) {
          setIsReady(true);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    const send = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          json: typeof json === 'string' ? json : JSON.stringify(json),
          options: { theme, direction }
        }, "*");
        setHasSentData(true);
      }
    };

    const initialTimer = setTimeout(send, 1000);
    const interval = setInterval(() => {
      if (!isReady) send();
    }, 4000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [json, theme, direction, isReady]);

  const handleReload = () => {
    setIsReady(false);
    setHasSentData(false);
    if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
  };

  return (
    <div className={cn(
      "relative bg-transparent group transition-all duration-300",
      isFullscreen ? "fixed inset-4 z-[100] bg-background rounded-2xl shadow-2xl border p-4" : "w-full h-full"
    )}>
      <iframe
        ref={iframeRef}
        src="https://jsoncrack.com/widget"
        className="w-full h-full bg-transparent border-none"
        allow="clipboard-write"
      />
      
      {!isReady && !hasSentData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[2px] pointer-events-none transition-opacity duration-1000">
           <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
           <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary font-bold">Connecting to JSONCrack...</p>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
        <Button variant="secondary" size="icon" className="h-8 w-8 glass rounded-full" onClick={() => setIsFullscreen(!isFullscreen)}>
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
        <Button variant="secondary" size="icon" className="h-8 w-8 glass rounded-full" onClick={handleReload}>
          <RefreshCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
