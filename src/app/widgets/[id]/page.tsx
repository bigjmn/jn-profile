import { notFound } from 'next/navigation';

import { widgets, widgetsBySlug } from '@/lib/widgets';
import WidgetRenderer from '@/components/widgets/WidgetRenderer';

export function generateStaticParams() {
  return widgets.map((widget) => ({
    id: widget.slug,
  }));
}

interface WidgetPageProps {
  params: Promise<{ id: string }>;
}

export default async function WidgetPage({ params }: WidgetPageProps) {
  const { id } = await params;
  const widget = widgetsBySlug[id];

  if (!widget) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{widget.title}</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{widget.blurb}</p>
      </div>

      <div className="mt-10 flex justify-center">
        <div className="w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
          <WidgetRenderer slug={widget.slug} />
        </div>
      </div>
    </div>
  );
}
