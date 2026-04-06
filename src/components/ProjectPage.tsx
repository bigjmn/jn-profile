'use client'
import React, { useEffect, useRef, useState } from "react";

/**
 * Backtrace Learning Graph — Project Page (React + Tailwind)
 *
 * ✅ Setup
 * - Put these images in your site’s /public folder (or update the paths below):
 *   /public/projects/backtrace/screen-add-resource.png
 *   /public/projects/backtrace/screen-graph-view.png
 *   /public/projects/backtrace/screen-add-question.png
 *
 * - Tailwind required.
 * - Works in plain React, Next.js, Vite, etc.
 */

const GITHUB_URL = "https://github.com/bigjmn/backtrace-learning-graph";

type Shot = {
  src: string;
  alt: string;
  title: string;
  caption: string;
};

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14 3h7v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14 21 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.73.5.75 5.6.75 12c0 5.1 3.17 9.43 7.57 10.96.55.1.75-.25.75-.55v-2.1c-3.08.7-3.73-1.5-3.73-1.5-.5-1.32-1.23-1.67-1.23-1.67-1-.7.08-.69.08-.69 1.12.08 1.7 1.18 1.7 1.18.98 1.74 2.58 1.23 3.2.94.1-.73.38-1.23.69-1.51-2.46-.29-5.06-1.26-5.06-5.63 0-1.25.43-2.27 1.15-3.07-.12-.29-.5-1.47.11-3.06 0 0 .95-.31 3.11 1.17.9-.26 1.86-.39 2.82-.39.96 0 1.93.13 2.82.39 2.16-1.48 3.11-1.17 3.11-1.17.61 1.59.23 2.77.11 3.06.72.8 1.15 1.82 1.15 3.07 0 4.38-2.6 5.34-5.08 5.63.39.35.74 1.05.74 2.12v3.15c0 .3.2.66.76.55 4.39-1.53 7.55-5.86 7.55-10.96C23.25 5.6 18.27.5 12 .5Z" />
    </svg>
  );
}

function ArrowButton({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90",
        "hover:bg-white/10 active:bg-white/15 disabled:opacity-40 disabled:hover:bg-white/5",
        "backdrop-blur"
      )}
      aria-label={dir === "prev" ? "Previous screenshot" : "Next screenshot"}
    >
      <span className="sr-only">{dir}</span>
      <span className="text-base leading-none">{dir === "prev" ? "←" : "→"}</span>
    </button>
  );
}

export function ScreenshotCarousel({ shots }: { shots: Shot[] }) {
  const [index, setIndex] = useState(0);

  const current = shots[index];
  const canPrev = index > 0;
  const canNext = index < shots.length - 1;

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        {/* Image */}
        <img
          src={current.src}
          alt={current.alt}
          className="absolute inset-0 h-full w-full select-none object-contain"
          loading="lazy"
        />
      </div>

      {/* Title and caption below image */}
      <div className="mt-3 px-1">
        <div className="text-sm font-semibold text-white">{current.title}</div>
        <div className="mt-1 text-xs text-white/80">{current.caption}</div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ArrowButton
            dir="prev"
            disabled={!canPrev}
            onClick={() => canPrev && setIndex((i) => i - 1)}
          />
          <ArrowButton
            dir="next"
            disabled={!canNext}
            onClick={() => canNext && setIndex((i) => i + 1)}
          />
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {shots.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2.5 w-2.5 rounded-full border border-white/20",
                i === index ? "bg-white/80" : "bg-white/15 hover:bg-white/25"
              )}
              aria-label={`Go to screenshot ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
interface FeatureCardProps{
  title: string;
  description: string;
  icon: React.ReactNode;
}
export function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/3 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white/90">
          {icon}
        </div>
        <div>
          <div className="text-base font-semibold text-white">{title}</div>
          <p className="mt-1 text-sm leading-relaxed text-white/75">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
      {children}
    </span>
  );
}
interface TopcardsProps{
  coreIdea:string,
  greatFor:string,
  outcome:string
}
interface ProjectPageProps {
  shots:Shot[]
  techTags:string[]
  projectTitle:string;
  mainDescription:string;
  topCard:TopcardsProps;
  features:FeatureCardProps[]

}

const maindescript="A visual way to map how you learn: track questions you’re trying to answer, attach the resources you used, and grow a dependency graph of ideas so you can see what to study next."
const testProps:ProjectPageProps = {
  shots: [
      {
        src: "/projects/add-resource.png",
        alt: "Add Resource modal connecting a resource to a question",
        title: "Attach resources to questions",
        caption:
          "Add a resource (video/article/etc.) and automatically connect it to the learning question it supports.",
      },
      {
        src: "/projects/graph-view.png",
        alt: "Graph view showing question nodes and resource nodes connected",
        title: "Visual learning dependency graph",
        caption:
          "A node-based map of what you’re learning: questions → resources → follow-up questions.",
      },
      {
        src: "/projects/add-resource.png",
        alt: "Add Question modal with topic tag and understood slider",
        title: "Track understanding over time",
        caption:
          "Create question nodes with topic tags + an “understood” slider to measure progress and identify gaps.",
      },
    ],
    
  
  techTags: ["NextJS", "Firebase", "ReactFlow"],
  projectTitle:"Learning Backtrace",
  mainDescription: maindescript,
  topCard:{
    coreIdea:"Make learning dependencies visible",
    greatFor:"self-study",
    outcome:"outcome here"
    
  },
  features:[
    {
      title:"project first workflow blahblah",
      description:"hello first feature",
      icon:<span>?</span>
    },
    {
      title:"project first workflow blahblah",
      description:"hello first feature",
      icon:<span>?</span>
    },
    {
      title:"project first workflow blahblah",
      description:"hello first feature",
      icon:<span>?</span>
    },
    {
      title:"project first workflow blahblah",
      description:"hello first feature",
      icon:<span>?</span>
    }
  ]

}
export default function ProjectPageTest(){
  return (
    <ProjectPage {...testProps}/>
  )
}
export function ProjectPage({shots,techTags,projectTitle,mainDescription, topCard, features}:ProjectPageProps) {
  const leftColRef = useRef<HTMLDivElement>(null);
  const [leftColHeight, setLeftColHeight] = useState<number | null>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (leftColRef.current) {
        setLeftColHeight(leftColRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className="min-h-screen text-white">
      <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Top bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
              Portfolio Project
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              React • Graph UI
            </span>
          </div>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5",
              "text-sm font-semibold text-white/90 hover:bg-white/10 active:bg-white/15"
            )}
          >
            <GithubIcon className="h-5 w-5" />
            View on GitHub
            <ExternalLinkIcon className="h-4 w-4 opacity-80" />
          </a>
        </div>

        {/* Hero */}
        <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div ref={leftColRef} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:p-8">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {projectTitle}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-white/75 sm:text-lg">
              {mainDescription}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {techTags.map((t, i) => (
                <Pill key={i}>
                  {t}
                </Pill>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3",
                  "text-sm font-semibold text-black hover:opacity-95 active:opacity-90"
                )}
              >
                <GithubIcon className="h-5 w-5" />
                GitHub Repo
                <ExternalLinkIcon className="h-4 w-4 opacity-80" />
              </a>

              <a
                href="#screens"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3",
                  "text-sm font-semibold text-white/90 hover:bg-white/10 active:bg-white/15"
                )}
              >
                See screenshots ↓
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs font-semibold text-white/70">Core Idea</div>
                <div className="mt-1 text-sm font-semibold">
                  {topCard.coreIdea}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs font-semibold text-white/70">Great for</div>
                <div className="mt-1 text-sm font-semibold">{topCard.greatFor}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs font-semibold text-white/70">Outcome</div>
                <div className="mt-1 text-sm font-semibold">{topCard.outcome}</div>
              </div>
            </div>
          </div>

          {/* Right column: carousel (mobile + desktop) */}
          <div
            id="screens"
            className="flex flex-col overflow-hidden"
            style={leftColHeight ? { height: leftColHeight } : undefined}
          >
            <ScreenshotCarousel shots={shots} />
          </div>
        </section>

        {/* Features */}
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold sm:text-2xl">Highlights</h2>
            <div className="text-xs text-white/60">Designed to be clean on desktop + mobile</div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <FeatureCard 
              key={i}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              />
            ))}
            {/* <FeatureCard
              title="Question-first workflow"
              description="Start from what you don’t know yet. Add questions, tag them by topic, and track your understanding as it improves."
              icon={<span className="text-lg">?</span>}
            />
            <FeatureCard
              title="Resources that connect automatically"
              description="Add a resource (video, article, paper) and connect it to the question it helps answer—building a navigable trail of learning."
              icon={<span className="text-lg">⛓️</span>}
            />
            <FeatureCard
              title="Graph view for “what leads to what”"
              description="See dependencies at a glance: which resources support which questions, and which questions unlock other questions."
              icon={<span className="text-lg">🕸️</span>}
            />
            <FeatureCard
              title="Progress you can feel"
              description="The “understood” slider turns vague learning into a measurable signal so you can prioritize efficiently."
              icon={<span className="text-lg">📈</span>}
            />
            <FeatureCard
              title="Fast capture, low friction"
              description="Quick modals keep the loop tight: add nodes, connect, move on—without getting lost in UI overhead."
              icon={<span className="text-lg">⚡</span>}
            />
            <FeatureCard
              title="Portfolio-friendly architecture"
              description="A clean, extensible pattern for nodes + edges—easy to grow into search, suggestions, and richer metadata later."
              icon={<span className="text-lg">🧩</span>}
            /> */}
          </div>
        </section>

        {/* Screenshot grid (extra, desktop-friendly) */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold sm:text-2xl">Screenshots</h2>
          <p className="mt-2 text-sm text-white/70">
            A few UI moments from the app—node creation, tagging, and graph navigation.
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {shots.map((s, idx) => (
              <figure
                key={idx}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
              >
                <img
                  src={s.src}
                  alt={s.alt}
                  className="h-auto w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="p-4">
                  <div className="text-sm font-semibold text-white">{s.title}</div>
                  <div className="mt-1 text-xs text-white/70">{s.caption}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-14">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold sm:text-xl">
                  Want the code / implementation details?
                </h3>
                <p className="mt-1 text-sm text-white/75">
                  Check out the repo for setup, structure, and ongoing improvements.
                </p>
              </div>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3",
                  "text-sm font-semibold text-black hover:opacity-95 active:opacity-90"
                )}
              >
                <GithubIcon className="h-5 w-5" />
                Open GitHub
                <ExternalLinkIcon className="h-4 w-4 opacity-80" />
              </a>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-white/45">
            © {new Date().getFullYear()} • Backtrace Learning Graph
          </div>
        </section>
      </main>
    </div>
  );
}
