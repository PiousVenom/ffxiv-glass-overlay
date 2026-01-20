import { useState, useEffect } from 'react';

/**
 * Hook to track overlay lock state from ACT
 */
export function useOverlayLock(): boolean {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const handleOverlayStateUpdate = (e: CustomEvent<{ isLocked: boolean }>) => {
      setIsLocked(e.detail.isLocked);
    };

    document.addEventListener('onOverlayStateUpdate', handleOverlayStateUpdate as EventListener);
    return () => {
      document.removeEventListener(
        'onOverlayStateUpdate',
        handleOverlayStateUpdate as EventListener
      );
    };
  }, []);

  return isLocked;
}
