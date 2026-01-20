import { useState, useEffect } from 'react';

/**
 * Hook to manage demo mode with keyboard shortcut (Ctrl+Shift+D)
 */
export function useDemoMode(): [boolean, () => void] {
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setDemoMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDemoMode = () => setDemoMode((prev) => !prev);

  return [demoMode, toggleDemoMode];
}
