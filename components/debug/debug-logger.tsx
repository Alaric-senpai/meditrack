"use client";

import { useEffect } from "react";
import { useDebug } from "./debug-context";

interface DebugLoggerProps {
  data: any;
  label: string;
}

/**
 * A client component that adds server-side data to the client-side debug context.
 * Useful for logging data from server components to the DebugPanel.
 */
export function DebugLogger({ data, label }: DebugLoggerProps) {
  const { addDebugInfo } = useDebug();

  useEffect(() => {
    addDebugInfo(label, data);
  }, [addDebugInfo, label, data]);

  return null;
}
