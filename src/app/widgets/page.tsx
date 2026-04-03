import { PreviewCard } from '@/components/preview-card';
import { widgets } from '@/lib/widgets';

export default function WidgetsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:18px_18px] opacity-30" />
      </div>
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Widgets
        </h1>
        <p className="max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
          These are some fun little interactives I have made. Most of them have a mathematical flair, and were made to help me visualize a problem. Some are also used in my math blog. Important note: while I worked hard to make these all mobile compatible, some are definitely better on desktop. 
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {widgets.map((widget) => (
          <PreviewCard key={widget.slug} preview={widget} basePath="widgets" />
        ))}
      </div>
    </div>
  );
}
