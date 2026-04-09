"use client";

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

import { widgets } from '@/lib/widgets';

const widgetComponents = widgets.reduce<Record<string, ComponentType>>((acc, widget) => {
  acc[widget.slug] = dynamic(
    () => widget.load() as Promise<{ default: ComponentType }>,
    { ssr: false }
  );
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
