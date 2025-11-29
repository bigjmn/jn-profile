import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

import { Preview } from '@/types';

export interface WidgetDefinition extends Preview {
  blurb: string;
  component: ComponentType;
}

export const widgets: WidgetDefinition[] = [
  {
    title: 'Epicycles',
    slug: 'epicycles',
    imageSrc: '/images/placeholder-1.svg',
    blurb:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    component: dynamic(() => import('@/components/widgets/Epicycles'), { ssr: false }),
  },
  {
    title: "Wilson's Algorithm",
    slug: 'wilsons-algorithm',
    imageSrc: '/images/placeholder-2.svg',
    blurb:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    component: dynamic(() => import('@/components/widgets/WilsonAlgo'), { ssr: false }),
  },
  {
    title: 'Stochastic Clock',
    slug: 'stochastic-clock',
    imageSrc: '/images/placeholder-3.svg',
    blurb:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    component: dynamic(() => import('@/components/widgets/StochasticClock'), { ssr: false }),
  },
  {
    title: "Conway's Angel Problem",
    slug: 'angel-problem',
    imageSrc: '/images/placeholder-4.svg',
    blurb:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    component: dynamic(() => import('@/components/widgets/AngelProblem'), { ssr: false }),
  },
];

export const widgetsBySlug = widgets.reduce<Record<string, WidgetDefinition>>((acc, widget) => {
  acc[widget.slug] = widget;
  return acc;
}, {});
