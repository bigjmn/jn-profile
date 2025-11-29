"use client";

import dynamic from 'next/dynamic';

import { WidgetDefinition, widgets } from '@/lib/widgets';

const widgetComponents = widgets.reduce<Record<string, ReturnType<typeof dynamic>>>((acc, widget) => {
  acc[widget.slug] = dynamic(widget.load, { ssr: false });
  return acc;
}, {});

interface WidgetRendererProps {
  widget: WidgetDefinition;
}

export function WidgetRenderer({ widget }: WidgetRendererProps) {
  const WidgetComponent = widgetComponents[widget.slug];

  return <WidgetComponent />;
}

export default WidgetRenderer;
