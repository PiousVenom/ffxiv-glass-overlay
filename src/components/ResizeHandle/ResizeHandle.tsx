/**
 * Visual indicator that the overlay is unlocked and can be resized.
 * ACT handles the actual window resize when the overlay is unlocked.
 */
export function ResizeHandle() {
  return <div className="resize-handle" aria-label="Resize overlay" role="presentation" />;
}
