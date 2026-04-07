"use client"
import React, { useMemo, useState } from "react";
import { GithubButton } from "@/components/GithubButton";
/**
 * Skills Page — React recreation of skillsample.html
 * Styling is aligned to the Backtrace project page component (rounded-3xl cards,
 * subtle borders, blurred radial accents, dotted grid overlay, etc).
 *
 * Source: skillsample.html :contentReference[oaicite:0]{index=0}
 */

type Importance = "feature" | "optional" | "deemphasize" | "leaveout";
type CategoryKey = "languages" | "frontend" | "backend" | "data" | "devops" | "ml";

type SkillCard = {
  key: CategoryKey;
  title: string;
  importance: Importance;
  desc: string;
  skills: string[];
  colSpan?: "col6" | "col4" | "col12"; // for future control
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const GIT_PROFILE = "https://github.com/bigjmn"

function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
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

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.3 16.3 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DotBadge() {
  return (
    <span className="relative inline-flex h-2.5 w-2.5 items-center justify-center">
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-400 to-sky-400" />
      <span className="absolute -inset-2 rounded-full bg-white/5" />
    </span>
  );
}

// function PillButton({
//   active,
//   children,
//   onClick,
// }: {
//   active: boolean;
//   children: React.ReactNode;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       aria-pressed={active}
//       onClick={onClick}
//       className={cn(
//         "select-none rounded-full border px-3.5 py-2 text-xs font-medium transition",
//         "border-white/10 bg-white/5 text-white/70",
//         "hover:-translate-y-0.5 hover:bg-white/10 hover:text-white/90 active:translate-y-0",
//         active &&
//           "border-white/20 bg-gradient-to-br from-fuchsia-400/20 to-sky-400/15 text-white/90"
//       )}
//     >
//       {children}
//     </button>
//   );
// }

function SkillTag({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15",
        "bg-slate-100 dark:bg-white/5 px-3 py-2 text-sm text-slate-700 dark:text-white/85",
        "transition hover:-translate-y-0.5 hover:border-slate-400 dark:hover:border-white/20 hover:bg-slate-200 dark:hover:bg-white/10"
      )}
    >
      {label}
    </span>
  );
}

function ImportanceBadge({ importance }: { importance: Importance }) {
  const map: Record<Importance, string> = {
    feature: "Feature",
    optional: "Optional",
    deemphasize: "De-emphasize",
    leaveout: "Leave out",
  };
  return (
    <span className="rounded-full border border-slate-300 dark:border-white/15 bg-slate-100 dark:bg-white/5 px-2 py-1 font-mono text-[11px] text-slate-600 dark:text-white/70">
      {map[importance]}
    </span>
  );
}

function normalize(s: string) {
  return (s || "").toLowerCase().trim();
}

export default function SkillsPage() {
  const cards: SkillCard[] = useMemo(
    () => [
      {
        key: "languages",
        title: "Core Languages",
        importance: "feature",
        desc: "Strong foundation in multiple programming paradigms for building robust, maintainable systems across different domains.",
        skills: ["Python", "JavaScript / TypeScript", "Java", "Go", "C++", "Bash"],
        colSpan: "col6",
      },
      {
        key: "frontend",
        title: "Frontend & Mobile",
        importance: "feature",
        desc: "Experience building responsive, accessible user interfaces and cross-platform mobile applications with modern frameworks.",
        skills: [
          "React",
          "Next.js",
          "HTML / CSS",
          "Tailwind CSS",
          "Framer",
          "React Native",
          "Flutter",
          "Dart",
        ],
        colSpan: "col6",
      },
      {
        key: "backend",
        title: "Backend & APIs",
        importance: "feature",
        desc: "Proficient in server-side development, RESTful architecture, and real-time communication protocols for scalable applications.",
        skills: ["Node.js", "Express", "REST APIs", "Socket.IO / WebSockets", "WebRTC"],
        colSpan: "col6",
      },
      {
        key: "data",
        title: "Databases & Cloud",
        importance: "feature",
        desc: "Skilled in data persistence, cloud platform integration, and leveraging managed services for efficient deployment.",
        skills: ["SQL / NoSQL", "Firebase", "Supabase", "GCP"],
        colSpan: "col6",
      },
      {
        key: "devops",
        title: "DevOps & Infra",
        importance: "feature",
        desc: "Familiar with containerization, orchestration, configuration management, and version control best practices.",
        skills: ["Docker", "Kubernetes", "Ansible", "Git"],
        colSpan: "col6",
      },
      {
        key: "ml",
        title: "Machine Learning & Data",
        importance: "optional",
        desc: "Working knowledge of ML frameworks and data analysis tools for building and training models on practical problems.",
        skills: ["PyTorch", "TensorFlow", "NumPy/Pandas"],
        colSpan: "col6",
      },
    ],
    []
  );

  const filterOptions: Array<{ key: "all" | Importance; label: string }> = [
    { key: "all", label: "All" },
    { key: "feature", label: "Feature" },
    { key: "optional", label: "Optional" },
    { key: "deemphasize", label: "De-emphasize" },
    { key: "leaveout", label: "Leave out" },
  ];

  const [activeFilter, setActiveFilter] = useState<"all" | Importance>("all");
  const [query, setQuery] = useState("");

  const filteredCards = useMemo(() => {
    const q = normalize(query);

    return cards.filter((card) => {
      const matchesFilter = activeFilter === "all" ? true : card.importance === activeFilter;

      if (!q) return matchesFilter;

      const title = normalize(card.title);
      const desc = normalize(card.desc);
      const tags = card.skills.map(normalize);

      const matchesSearch =
        title.includes(q) || desc.includes(q) || tags.some((t) => t.includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [cards, activeFilter, query]);

  const totalSkillsShown = useMemo(() => {
    return filteredCards.reduce((sum, c) => sum + c.skills.length, 0);
  }, [filteredCards]);

  return (
    <div className="min-h-screen text-slate-900 dark:text-white">
      <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <header className="grid gap-3">
          <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-white/60">
            <DotBadge />
            Portfolio Skills View
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Engineering Skills
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-white/70 sm:text-base">
                Organized for broad employer appeal. Use filters to scan categories and search
                to find specific tools.
              </p>
            </div>

            {/* Optional link area (handy if you want to point to resume/LinkedIn) */}
            {/* <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className={cn(
                "inline-flex items-center justify-center gap-2 self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5",
                "text-sm font-semibold text-white/85 hover:bg-white/10 active:bg-white/15"
              )}
              aria-label="Optional link (disabled)"
              title="Drop in a resume/LinkedIn link if you want"
            >
              Optional link
              <ExternalLinkIcon className="h-4 w-4 opacity-80" />
            </a> */}
            <GithubButton gLink={GIT_PROFILE} />
          </div>

          {/* Toolbar */}
          <div className="mt-2 grid gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {/* Search */}
              {/* <div
                role="search"
                className={cn(
                  "flex w-full items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3",
                  "shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur"
                )}
              >
                <SearchIcon className="h-5 w-5 text-white/60" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search skills (e.g., Kubernetes, React, PyTorch)..."
                  className={cn(
                    "w-full bg-transparent text-sm text-white/90 outline-none placeholder:text-white/45"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 hover:bg-white/10"
                  title="Clear search"
                >
                  Clear
                </button>
              </div> */}

              {/* Filter pills */}
              {/* <div className="flex flex-wrap gap-2" aria-label="Category filters">
                {filterOptions.map((opt) => (
                  <PillButton
                    key={opt.key}
                    active={activeFilter === opt.key}
                    onClick={() => setActiveFilter(opt.key)}
                  >
                    {opt.label}
                  </PillButton>
                ))}
              </div> */}
            </div>

            {/* <div className="text-xs text-white/50">
              Showing <span className="text-white/75">{filteredCards.length}</span> categories •{" "}
              <span className="text-white/75">{totalSkillsShown}</span> skills
            </div> */}
          </div>
        </header>

        {/* Cards grid */}
        <section className="mt-6 grid gap-4 lg:grid-cols-12">
          {filteredCards.map((card) => (
            <article
              key={card.key}
              className={cn(
                "relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03]",
                "shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
                // responsive spans similar to original: col6 at >=820px; we use lg breakpoint
                "lg:col-span-6"
              )}
            >
              {/* subtle highlight wash */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_260px_at_10%_0%,rgba(100,116,139,0.05),transparent_60%)] dark:bg-[radial-gradient(600px_260px_at_10%_0%,rgba(255,255,255,0.08),transparent_60%)]" />

              <div className="relative border-b border-slate-200 dark:border-white/10 px-5 pb-3 pt-4">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-base font-semibold tracking-tight text-slate-900 dark:text-white/95">
                    {card.title} <span className="ml-2 inline-block align-middle" />
                  </div>
                  <ImportanceBadge importance={card.importance} />
                </div>
              </div>

              <p className="relative px-5 pt-3 text-sm leading-relaxed text-slate-600 dark:text-white/65">
                {card.desc}
              </p>

              <div className="relative flex flex-wrap gap-2 px-5 pb-5 pt-4">
                {card.skills.map((s) => (
                  <SkillTag key={s} label={s} />
                ))}
              </div>
            </article>
          ))}
        </section>

        {/* Footer note */}
        <section className="mt-10">
          <div className="rounded-3xl border border-slate-300 dark:border-white/15 border-dashed bg-slate-50 dark:bg-white/[0.03] p-6 text-slate-600 dark:text-white/70">
            <div className="text-sm">
              <span className="font-semibold text-slate-900 dark:text-white/90">Suggested one-liner:</span>
              <br />
              Engineering Focus:{" "}
              <span className="text-slate-700 dark:text-white/85">
                Full-stack systems, real-time applications, scalable infrastructure, and
                applied ML.
              </span>
            </div>
            <div className="mt-3 text-xs text-slate-500 dark:text-white/50">
              Tip: If you're targeting non-ML roles, keep ML as "Optional" or compress it.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
