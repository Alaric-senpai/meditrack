"use client";

import React, { useState } from "react";
import { Cookie, Code2, X, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebug } from "./debug-context";

interface DebugPanelProps {
  cookies: Array<{ name: string; value: string }>;
}

export function DebugPanel({ cookies }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { debugData } = useDebug();

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="destructive"
        size="sm"
        className="fixed bottom-4 right-4 z-[9999] shadow-lg rounded-full h-12 w-12 p-0 flex items-center justify-center animate-in fade-in zoom-in duration-300 hover:scale-110 transition-transform"
      >
        <Code2 className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-[400px] max-w-[90vw] max-h-[80vh] bg-card border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50 shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="font-mono text-sm font-bold">Debug Console</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs Container */}
      <Tabs
        defaultValue="cookies"
        className="flex flex-col flex-1 min-h-0"
      >
        {/* Tabs Header */}
        <div className="px-3 pt-2 shrink-0">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="cookies" className="text-xs">
              <Cookie className="mr-2 h-3 w-3" />
              Cookies ({cookies.length})
            </TabsTrigger>
            <TabsTrigger value="context" className="text-xs">
              <Code2 className="mr-2 h-3 w-3" />
              App State ({Object.keys(debugData).length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Cookies Tab */}
        <TabsContent
          value="cookies"
          className="flex-1 min-h-0 p-0 m-0"
        >
          <ScrollArea className="h-full px-4 py-3">
            <div className="space-y-3">
              {cookies.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No cookies found
                </p>
              ) : (
                cookies.map((cookie) => (
                  <div
                    key={cookie.name}
                    className="p-2 rounded-md bg-muted/30 border border-transparent hover:border-border hover:bg-muted transition-all"
                  >
                    <p className="font-mono text-xs font-semibold text-primary break-all">
                      {cookie.name}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground break-all mt-1">
                      {cookie.value}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Context Tab */}
        <TabsContent
          value="context"
          className="flex-1 min-h-0 p-0 m-0"
        >
          <ScrollArea className="h-full px-4 py-3">
            <div className="space-y-3">
              {Object.keys(debugData).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-24 text-muted-foreground">
                  <p className="text-sm italic">No debug data recorded</p>
                  <p className="text-[10px]">
                    Use useDebug().addDebugInfo()
                  </p>
                </div>
              ) : (
                Object.entries(debugData).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-2 rounded-md bg-muted/30 border border-transparent hover:border-border hover:bg-muted transition-all"
                  >
                    <p className="font-mono text-xs font-semibold text-blue-500 break-all">
                      {key}
                    </p>
                    <pre className="mt-1 p-2 bg-background rounded border border-border font-mono text-[10px] overflow-x-auto">
                      {typeof value === "object"
                        ? JSON.stringify(value, null, 2)
                        : String(value)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
