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
        "inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-2 text-sm text-slate-700 dark:text-white/90",
        "hover:bg-slate-200 dark:hover:bg-white/10 active:bg-slate-300 dark:active:bg-white/15 disabled:opacity-40 disabled:hover:bg-slate-100 dark:disabled:hover:bg-white/5",
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
    <div className="flex h-full flex-col rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/3 p-3 shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/20">
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
        <div className="text-sm font-semibold text-slate-900 dark:text-white">{current.title}</div>
        <div className="mt-1 text-xs text-slate-600 dark:text-white/80">{current.caption}</div>
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
                "h-2.5 w-2.5 rounded-full border border-slate-300 dark:border-white/20",
                i === index ? "bg-slate-700 dark:bg-white/80" : "bg-slate-300 dark:bg-white/15 hover:bg-slate-400 dark:hover:bg-white/25"
              )}
              aria-label={`Go to screenshot ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/3 p-5 shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-white/10 dark:to-white/5 text-slate-600 dark:text-white/80 shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>
      <div className="text-base font-semibold text-slate-900 dark:text-white">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-white/75">{description}</p>
    </div>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1 text-xs font-medium text-slate-700 dark:text-white/80">
      {children}
    </span>
  );
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
    },
    
  ],
  projectLinks:[]

}
export default function ProjectPageTest(){
  return (
    <ProjectPage {...testProps}/>
  )
}
function AppStoreIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04l-.08.27zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 3c-2.4 2.8-3.8 5.7-3.8 9s1.4 6.2 3.8 9M12 3c2.4 2.8 3.8 5.7 3.8 9s-1.4 6.2-3.8 9M3 12h18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function ProjectLink({ linkType, linkUrl }: ProjectLinkProps) {
  const configs = {
    github: {
      label: 'View on GitHub',
      icon: <GithubIcon className="h-5 w-5" />,
      style: cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-white px-5 py-3',
        'text-sm font-semibold text-white dark:text-black hover:opacity-90 active:opacity-80'
      ),
    },
    'app store': {
      label: 'App Store',
      icon: <AppStoreIcon className="h-5 w-5" />,
      style: cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0071e3] px-5 py-3',
        'text-sm font-semibold text-white hover:opacity-90 active:opacity-80'
      ),
    },
    website: {
      label: 'Visit Website',
      icon: <GlobeIcon className="h-5 w-5" />,
      style: cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-5 py-3',
        'text-sm font-semibold text-slate-700 dark:text-white/90 hover:bg-slate-200 dark:hover:bg-white/10 active:bg-slate-300 dark:active:bg-white/15'
      ),
    },
  };

  const { label, icon, style } = configs[linkType];

  return (
    <a href={linkUrl} target="_blank" rel="noreferrer" className={style}>
      {icon}
      {label}
      <ExternalLinkIcon className="h-4 w-4 opacity-70" />
    </a>
  );
}

export function ProjectPage({shots,techTags,projectTitle,mainDescription, topCard, features, projectLinks = []}:ProjectPageProps) {
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
    <div className="min-h-screen text-slate-900 dark:text-white">
      <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Top bar */}
        {/* <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-white/80">
              Portfolio Project
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1 text-xs text-slate-600 dark:text-white/70">
              React • Graph UI
            </span>
          </div>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-2.5",
              "text-sm font-semibold text-slate-700 dark:text-white/90 hover:bg-slate-200 dark:hover:bg-white/10 active:bg-slate-300 dark:active:bg-white/15"
            )}
          >
            <GithubIcon className="h-5 w-5" />
            View on GitHub
            <ExternalLinkIcon className="h-4 w-4 opacity-80" />
          </a>
        </div> */}

        {/* Hero */}
        <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div ref={leftColRef} className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/3 p-6 shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:p-8">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {projectTitle}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-white/75 sm:text-lg">
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
              {/* <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-white px-4 py-3",
                  "text-sm font-semibold text-white dark:text-black hover:opacity-95 active:opacity-90"
                )}
              >
                <GithubIcon className="h-5 w-5" />
                GitHub Repo
                <ExternalLinkIcon className="h-4 w-4 opacity-80" />
              </a> */}

              <a
                href="#screens"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-3",
                  "text-sm font-semibold text-slate-700 dark:text-white/90 hover:bg-slate-200 dark:hover:bg-white/10 active:bg-slate-300 dark:active:bg-white/15"
                )}
              >
                See screenshots ↓
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-4">
                <div className="text-xs font-semibold text-slate-500 dark:text-white/70">Core Idea</div>
                <div className="mt-1 text-sm font-semibold">
                  {topCard.coreIdea}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-4">
                <div className="text-xs font-semibold text-slate-500 dark:text-white/70">Great for</div>
                <div className="mt-1 text-sm font-semibold">{topCard.greatFor}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-4">
                <div className="text-xs font-semibold text-slate-500 dark:text-white/70">Outcome</div>
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
            <div className="text-xs text-slate-500 dark:text-white/60">Designed to be clean on desktop + mobile</div>
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
          <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
            A few UI moments from the app—node creation, tagging, and graph navigation.
          </p>

          <div className="mt-5 columns-1 sm:columns-2 lg:columns-3 gap-4">
            {shots.map((s, idx) => (
              <figure
                key={idx}
                className="break-inside-avoid mb-4 overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/3"
              >
                <img
                  src={s.src}
                  alt={s.alt}
                  className="h-auto w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="p-4">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{s.title}</div>
                  <div className="mt-1 text-xs text-slate-600 dark:text-white/70">{s.caption}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-14">
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-white/[0.06] dark:to-white/[0.02] p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold sm:text-xl">
                  Want the code / implementation details?
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-white/75">
                  Check out the repo for setup, structure, and ongoing improvements.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {projectLinks.map((link: ProjectLinkProps, i: number) => (
                  <ProjectLink key={i} linkType={link.linkType} linkUrl={link.linkUrl} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400 dark:text-white/45">
            © {new Date().getFullYear()} • J Nicks Productions
          </div>
        </section>
      </main>
    </div>
  );
}
