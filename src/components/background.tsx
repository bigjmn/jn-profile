/**
 * Consistent background gradient used across all pages
 * Features:
 * - Dark base color #070A13
 * - Fuchsia and sky gradient blobs
 * - Dotted grid overlay
 */
export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-24 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[18px_18px] opacity-30" />
    </div>
  );
}
