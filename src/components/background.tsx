/**
 * Consistent background gradient used across all pages
 * Features:
 * - Light mode: Soft gradient with subtle accents
 * - Dark mode: Deep blue-black with vibrant accents
 * - Dotted grid overlay
 */
export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Light mode gradients */}
      <div className="absolute -top-24 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-500/10" />
      <div className="absolute -bottom-24 left-1/4 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />

      {/* Grid overlay - different opacity for light/dark */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] bg-size-[18px_18px] opacity-40 dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] dark:opacity-30" />
    </div>
  );
}
