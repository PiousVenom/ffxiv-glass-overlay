import { useEffect, useRef } from 'react';

import overlayPlugin from '../services/OverlayPlugin';

import type { RawCombatData, PrimaryPlayerData, AggroListData } from '../types';

interface UseOverlayPluginOptions {
  onCombatData: (data: RawCombatData) => void;
  onPrimaryPlayer?: (data: PrimaryPlayerData) => void;
  onAggroList?: (data: AggroListData) => void;
  onLogLine?: (data: { line: string[] }) => void;
}

interface UseOverlayPluginReturn {
  initError: string | null;
}

/**
 * Hook to initialize and manage OverlayPlugin connection
 */
export function useOverlayPlugin({
  onCombatData,
  onPrimaryPlayer,
  onAggroList,
  onLogLine,
}: UseOverlayPluginOptions): UseOverlayPluginReturn {
  const initErrorRef = useRef<string | null>(null);
  const logLineRef = useRef(onLogLine);

  // Keep logLine ref updated
  useEffect(() => {
    logLineRef.current = onLogLine;
  }, [onLogLine]);

  useEffect(() => {
    const stableLogLineHandler = (data: { line: string[] }) => {
      logLineRef.current?.(data);
    };

    try {
      overlayPlugin.initialize(onCombatData, undefined, {
        onPrimaryPlayer,
        onAggroList,
        onLogLine: onLogLine ? stableLogLineHandler : undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to initialize';
      initErrorRef.current = message;
    }

    return () => {
      overlayPlugin.cleanup();
    };
  }, [onCombatData, onPrimaryPlayer, onAggroList, onLogLine]);

  return { initError: initErrorRef.current };
}
