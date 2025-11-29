import { PreviewCard } from '@/components/preview-card';
import { Preview } from '@/types';

const widgets: Preview[] = [
  {
    title: 'Sample Widget 1',
    slug: 'sample-widget-1',
    imageSrc: '/images/dps.gif',
  },
  {
    title: 'Sample Widget 2',
    slug: 'sample-widget-2',
    imageSrc: '/images/placeholder-2.svg',
  },
  {
    title: 'Sample Widget 3',
    slug: 'sample-widget-3',
    imageSrc: '/images/placeholder-3.svg',
  },
  {
    title: 'Sample Widget 4',
    slug: 'sample-widget-4',
    imageSrc: '/images/placeholder-4.svg',
  },
  {
    title: 'Sample Widget 5',
    slug: 'sample-widget-5',
    imageSrc: '/images/placeholder-5.svg',
  },
  {
    title: 'Sample Widget 6',
    slug: 'sample-widget-6',
    imageSrc: '/images/placeholder-6.svg',
  },
];

export default function WidgetsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Widgets
        </h1>
        <p className="max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
          These are some fun little interactives I've made. Most of them have a mathematical flair, and were made to help me visualize a problem. Some are also used in my math blog. Important note: while I worked hard to make these all mobile compatible, some are definitely better on desktop. 
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
