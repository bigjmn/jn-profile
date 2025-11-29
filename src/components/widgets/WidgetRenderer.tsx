"use client";

import dynamic from 'next/dynamic';

import { widgets } from '@/lib/widgets';

const widgetComponents = widgets.reduce<Record<string, ReturnType<typeof dynamic>>>((acc, widget) => {
  acc[widget.slug] = dynamic(widget.load, { ssr: false });
  return acc;
}, {});

interface WidgetRendererProps {
  slug: string;
}

export function WidgetRenderer({ slug }: WidgetRendererProps) {
  const WidgetComponent = widgetComponents[slug];

  if (!WidgetComponent) {
    return null;
  }

  return <WidgetComponent />;
}

export default WidgetRenderer;
