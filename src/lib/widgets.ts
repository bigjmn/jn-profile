import { ComponentType } from 'react';

// import { Preview } from '@/types';

export interface WidgetDefinition extends Preview {
  blurb: string;
  load: () => Promise<{ default: ComponentType }>;
}

const wilsonDescriber = `How do we make a maze? It’s not a trivial question. We could start by taking an NxN grid and randomly add walls between squares. Then I suppose we could start at a random square and do a breadth-first search to check that all squares are reachable (assuming we want our maze to be fully connected) and if not, start over. But this kind of brute-force approach quickly runs into problems. The long and short of it is: if your wall-adding rate is conservative enough to build a connected maze in a reasonable amount of time, you can be sure your maze won’t really be a maze per se, more of a wide open grid with a few walls scattered here and there. Thankfully, Wilson’s Algorithm comes to the rescue. 

The algorithm itself is as follows:

Pick a random square to declare as the beginning to the maze. 
Pick a random square not yet connected to the maze and start a random walk until you hit a square that’s already part of the maze. 
If the walk forms a loop, erase that loop and continue.
Once the walk connects to the maze, add that path to the maze   
Repeat until all squares connect to the maze. 

The process is kind of tough to follow by just reading the steps, but seeing it in action makes things a lot clearer. 

Recently I’ve been exploring mazes and maze algorithms from a topological perspective. What maze-solving and maze-generating algorithms work well on a torus? Or double-torus? Projective plane? I’m nowhere near ready to say, but my implementation of Wilson’s Algorithm below will let you see how it works on the surface of a torus (the left edge of the grid connects to the right, and the top to the bottom.) 

`
const stochasticDescriber = `This one was just a random idea (in every sense of the term) inspired by some research I was doing on martingales and other stochastic processes. 

I deployed this clock on October 20, 2025 at 8 p.m. EST, it showed the correct time. Every second, the clock has a 50/50 chance of ticking forward 3 seconds, otherwise it goes backwards 1 second. So “on average” it moves correctly (it also adjusts for daylight savings) but inevitably it will sometimes be way off. The fact that an analogue clock can’t be off by more than 6 hours adds an interesting dynamic. 

I think it would be cool to build a physical version at some point, but that’s a project for another day. 
`

const angelDescriber = `This one comes to us from my favorite mathematician, John Conway.

<em>Can the Devil, who removes one square per move from an infinite chessboard, strand the Angel, who can jump up to 1000 squares per move? It seems unlikely, but the answer is unknown. Andreas Blass and I have proved that the Devil can strand an Angel who's handicapped in one of several ways. I end with a challenge for the solution the general problem.</em>

Needless to say, the answer now IS known, at least for the general problem posed by Conway at the end of the paper - can an angel of sufficiently high power (jumping range) win?

Yes he can! In fact, an angel of power 2 or greater can escape the devil indefinitely. The angel of power 1 loses (as noted by Conway) as does the angel of any power who always increases his distance from the origin.

I've implemented the game below, as well as some of the angel variants Conway examines in his paper.
`
const epicycleDescriber = `Any curve can be decomposed into a series of periodic functions. I’ve implemented the fast fourier transform (Cooley-Turkey algorithm) so you can try it yourself!`
export const widgets: WidgetDefinition[] = [
  {
    title: 'Epicycles',
    slug: 'epicycles',
    imageSrc: '/gifs/ampersand_epi.gif',
    blurb:
      epicycleDescriber,
    load: () => import('@/components/widgets/Epicycles'),
  },
  {
    title: "Wilson's Algorithm",
    slug: 'wilsons-algorithm',
    imageSrc: '/gifs/wilsonvid.gif',
    blurb:
      wilsonDescriber,
    load: () => import('@/components/widgets/WilsonAlgo'),
  },
  {
    title: 'Stochastic Clock',
    slug: 'stochastic-clock',
    imageSrc: '/gifs/stochasticvid.gif',
    blurb:
      stochasticDescriber,
    load: () => import('@/components/widgets/StochasticClock'),
  },
  {
    title: "Conway's Angel Problem",
    slug: 'angel-problem',
    imageSrc: '/gifs/angeldemo.gif',
    blurb:
      angelDescriber,
    load: () => import('@/components/widgets/AngelProblem'),
  },
];

export const widgetsBySlug = widgets.reduce<Record<string, WidgetDefinition>>((acc, widget) => {
  acc[widget.slug] = widget;
  return acc;
}, {});
