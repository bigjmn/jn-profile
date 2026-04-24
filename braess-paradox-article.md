# Close a Road, Save an Hour

*Sometimes the best thing you can do for traffic is close a perfectly good road. Welcome to the weirdest result in game theory.*

---

A while back I [wrote about](https://www.jessenicholas.com/math/journey-through-ny-journeys) my brother's observation that any two points in New York City are either 20 minutes or 45 minutes apart. I stand by it. Any New Yorker does.

What I didn't mention at the time is that those exact two numbers - 20 and 45 - are enough to construct one of the strangest results in all of game theory. The kind of result that sounds wrong, feels wrong, and keeps feeling wrong even after you've written it down and checked the arithmetic twice. Here it is, as bluntly as I can put it:

> Adding a new road to a network can make everyone's commute longer.

Not a confusing road. Not a badly-designed road. A genuinely faster road, freely available to every driver. Build it, and everyone's drive gets worse. Close it, and everyone's drive gets better. This is Braess's paradox, and the really disturbing thing is that it doesn't require anyone to be dumb, or stubborn, or to misread a map. It only requires that everybody acts in their own rational self-interest. Which, yeah. They do.

Let's dive in.

## The Setup

Four nodes: **Start**, **A**, **B**, and **End**. Everybody wants to get from Start to End. There are two obvious ways to do that:

- **Top route**: Start → A → End
- **Bottom route**: Start → B → End

Now we give each route one "fast" leg and one "slow" leg. The slow legs are simple: they just take 45 minutes, no matter what. Think Broadway at rush hour, or the FDR on any given weekday - totally saturated, you're moving at crawl speed regardless of whether you're car #1 or car #10,000.

The fast legs are different. They're uncongested right up until they aren't. Specifically, if *t* cars per hour are using the fast leg, it takes *t/100* minutes. So 1000 cars per hour means a 10-minute leg. 4000 cars per hour means a 40-minute leg.

Here's the asymmetry that matters: we put the fast leg at the *start* of the top route, and at the *end* of the bottom route.

- **Top route**: fast leg (*t/100*) → 45 min constant
- **Bottom route**: 45 min constant → fast leg (*t/100*)

Now suppose 4000 cars per hour need to make this trip. In equilibrium, they split 50/50 between the two routes (by symmetry - no reason to prefer one over the other). So:

- 2000 cars on each route
- Fast leg: 2000/100 = **20 min**
- Slow leg: **45 min**
- Total: **65 minutes**

Everyone's moderately annoyed. As God intended.

## Enter the Shortcut

Somebody in the Department of Transportation has a bright idea. "What if," they say, "we connect A and B directly? With, like, a *really* fast road. We'll make it so fast it's essentially free - zero minutes."

(This is admittedly a bit of a cartoon assumption, but it makes the math pristine and doesn't change the qualitative result. If it bothers you, imagine a very fast road with a 1 or 2 minute travel time and redo the arithmetic. The paradox is robust to this.)

Now you're a selfish driver staring at your options. You could take the old top route: 20 + 45 = 65 minutes. You could take the old bottom route: 45 + 20 = 65 minutes. Or you could take the brand new **Start → A → B → End** route: two fast legs stitched together, no 45-minute penalty in sight. How could that not be better?

So you take it. And here's the thing - *so does everyone else*. Every single driver in the network has the same thought at the same time, and they all pile onto the same route.

Now all 4000 cars are on Start-A. And all 4000 are on B-End.

- Start → A: 4000/100 = **40 min**
- A → B: **0 min** (the shortcut)
- B → End: 4000/100 = **40 min**
- Total: **80 minutes**

Adding the shortcut made everyone's commute 15 minutes longer.

## Why Nobody Fixes It

The natural question is: okay, so it's worse - but why don't some drivers just go back to the old routes? If 2000 of them took the pure top route, wouldn't everybody be faster?

Let's check. Suppose one driver - call her Alice - decides to be a hero and defect. She takes the pure top route: Start → A → End.

- Her Start → A leg: she's on a road with 4000 cars (everyone else still uses it, plus her). That's 40 minutes.
- Her A → End leg: 45 minutes, always.
- Alice's total: **85 minutes.**

Alice just made her own commute *longer* by defecting. So she won't. Neither will any other individual driver, by exactly the same argument. The 80-minute configuration is a **Nash equilibrium** - nobody can improve by unilaterally switching. Everybody is optimally screwed.

This is the cursed heart of the paradox. It's not that drivers are being stupid. Every driver is making the correct decision given what everyone else is doing. The *collective* outcome is just worse than the *collective* outcome without the shortcut, and there's no individual move that fixes it. The only fix is coordination - or, you know, closing the road.

Worth noting: if the total volume is low enough, the shortcut actually does help everybody. If you solve for the crossover, you'll find that below about 3000 cars per hour the shortcut is a genuine improvement, at 3000 it's a wash, and above 3000 it starts hurting - more so the higher traffic gets. At 4500 cars per hour the shortcut costs you about 25 minutes per trip.

I built an interactive simulator for this one - a little four-node graph where you can drag a slider to change traffic volume and toggle the shortcut on and off. Cars flow continuously, edges fatten and redden as they get congested, and a live "paradox indicator" tells you whether the shortcut is currently helping or hurting. Go mess with it.

*[Widget goes here]*

## But Is It Real?

You might be thinking: sure, fine, this works on a four-node toy graph, but surely real road networks are too messy for this to actually happen. I'm afraid I have bad news.

The most famous case is Stuttgart, 1969. The city added a new road to alleviate downtown traffic. Travel times got worse. After extensive investigation and hand-wringing, they closed the new road. Travel times got better. (This is the example that inspired Dietrich Braess's original 1968 paper, which had been theoretical.)

The reverse direction is even cooler. In 2003, Seoul demolished the elevated Cheonggye Expressway - a six-lane highway carrying 160,000 cars a day - to restore a buried stream underneath. By every principle of common sense, this should have been a traffic apocalypse. It wasn't. Travel times through the area actually *improved* for drivers who used to rely on the highway. The city now has a beautiful public park where the highway used to be.

Similar (if less dramatic) effects have been documented in New York, Boston, London, and a bunch of other cities that have closed streets, removed highway segments, or pedestrianized thoroughfares. The pattern is remarkably consistent: traffic engineers brace for disaster, disaster doesn't come, sometimes things actively get better.

## And now for the twist...

Okay so one obvious question: if removing roads can make everyone faster, why don't we do it more? And here the answer is more social than mathematical. Braess-style configurations are hard to identify from the outside - you kind of have to model the network and simulate driver behavior. And even when you do identify one, the political problem of closing a perfectly good road is not trivial. "Your commute is hurting us, please give it up" is a tough sell. Nobody wants to be Alice.

There's also a deeper issue that I want to flag but not fully chase down here. The selfish routing result has a specific name - it's called the **Price of Anarchy**, and it measures how much worse the selfish equilibrium is than the socially optimal outcome. For networks with the kind of linear cost function I used above, the Price of Anarchy is bounded at 4/3: selfish routing can never be more than ~33% worse than optimal. That's a real theorem, due to Tim Roughgarden. It's also, in its own way, weirdly hopeful. The paradox is real, but it has a ceiling.

## What's next?

A few threads I want to pull on in future posts:

1. **The general Price of Anarchy story.** Roughgarden's 4/3 bound is one of those beautifully tight results that deserves its own full treatment. It's also a great entry point into thinking about when markets go wrong and by how much.
2. **Designing networks to be paradox-free.** There's a whole line of work on road networks where Braess-style effects are provably impossible. Turns out it's related to matroid theory, which is always fun.
3. **Braess's paradox in other domains.** The same math shows up in power grids, internet routing, and (I'm told) basketball offenses. If removing your team's best shooter makes the team better, there may be a Nash equilibrium reason.

Also, to be clear: I am not proposing we close any actual roads in New York City. I'm merely noting that if we did, the outcome might not be what you'd expect. Hit me up if you have strong opinions about the FDR.
