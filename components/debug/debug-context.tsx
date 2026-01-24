"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type DebugValue = string | number | boolean | object | null | undefined;

interface DebugContextType {
  addDebugInfo: (key: string, value: DebugValue) => void;
  removeDebugInfo: (key: string) => void;
  clearDebugInfo: () => void;
  debugData: Record<string, DebugValue>;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: React.ReactNode }) {
  const [debugData, setDebugData] = useState<Record<string, DebugValue>>({});

  const addDebugInfo = useCallback((key: string, value: DebugValue) => {
    setDebugData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const removeDebugInfo = useCallback((key: string) => {
    setDebugData((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const clearDebugInfo = useCallback(() => {
    setDebugData({});
  }, []);

  return (
    <DebugContext.Provider
      value={{ addDebugInfo, removeDebugInfo, clearDebugInfo, debugData }}
    >
      {children}
    </DebugContext.Provider>
  );
}

export function useDebug() {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error("useDebug must be used within a DebugProvider");
  }
  return context;
}
