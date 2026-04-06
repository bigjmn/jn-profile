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
    <div className="relative mx-auto max-w-4xl px-6 py-16 text-center">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-white mb-6">{widget.title}</h2>
        <div
          className="text-left whitespace-pre-line text-lg text-white/75"
          dangerouslySetInnerHTML={{ __html: widget.blurb }}
        />
      </div>

      <div className="mt-10 flex justify-center">
        <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-white/3 p-6 shadow-md">
          <WidgetRenderer slug={widget.slug} />
        </div>
      </div>
    </div>
  );
}
