import Link from 'next/link';
import { FadeIn } from '@/components/FadeIn';
import { PreviewCard } from '@/components/preview-card';
import { WorkProject } from '@/components/WorkProject';
import { projects } from '@/lib/projects';
import { widgets } from '@/lib/widgets';
import { workProjects } from '@/lib/workProjects';
import { getAllMathArticles } from '@/lib/math-articles';
import { formatDate } from '@/lib/formatDate';

const skills = [
  {
    title: 'Core Languages',
    desc: 'Strong foundation in multiple programming paradigms for robust, maintainable systems.',
    tags: ['Python', 'TypeScript', 'Java', 'Go', 'C++', 'Bash'],
  },
  {
    title: 'Frontend & Mobile',
    desc: 'Responsive, accessible interfaces and cross-platform mobile applications.',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'React Native', 'Flutter'],
  },
  {
    title: 'Backend & APIs',
    desc: 'Server-side development, RESTful architecture, and real-time communication.',
    tags: ['Node.js', 'Express', 'REST APIs', 'WebSockets', 'WebRTC'],
  },
  {
    title: 'Databases & Cloud',
    desc: 'Data persistence, cloud platform integration, and managed services.',
    tags: ['SQL / NoSQL', 'Firebase', 'Supabase', 'GCP'],
  },
  {
    title: 'DevOps & Infra',
    desc: 'Containerization, orchestration, and configuration management.',
    tags: ['Docker', 'Kubernetes', 'Ansible', 'Git'],
  },
  {
    title: 'Machine Learning',
    desc: 'ML frameworks and data analysis tools for building and training practical models.',
    tags: ['PyTorch', 'TensorFlow', 'NumPy / Pandas'],
  },
];

export default async function Home() {
  const articles = await getAllMathArticles();

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-16 py-32 text-center"
      >
        <p className="hero-anim hero-anim-d0 mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-white/40">
          Engineer · Builder · Mathematician
        </p>
        <h1 className="hero-anim hero-anim-d1 mb-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-7xl">
          Jesse Nicholas
        </h1>
        <p className="hero-anim hero-anim-d2 mb-12 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-white/65">
          I build technically rigorous and creatively ambitious products — spanning full-stack
          development, real-time systems, and applied AI, always through a mathematical lens.
        </p>
        <div className="hero-anim hero-anim-d3 flex flex-wrap justify-center gap-4">
          <a
            href="#projects"
            className="rounded-lg bg-slate-900 px-6 py-3 font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-slate-300 bg-slate-100 px-6 py-3 font-medium text-slate-900 transition-colors hover:bg-slate-200 dark:border-white/20 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
          >
            Get in Touch
          </a>
        </div>

        {/* Scroll cue */}
        <div className="hero-anim hero-anim-d4 absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-white/25">
            <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
            <svg
              className="h-4 w-4 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────── */}
      <section id="projects" className="bg-slate-900 px-16 py-24">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
              01 — Projects
            </p>
            <h2 className="mb-4 text-4xl font-bold text-white">Personal Projects</h2>
            <p className="mb-14 max-w-3xl text-slate-400">
              Interactive web and mobile experiences — from real-time multiplayer games to visual
              learning tools. Each project combines thoughtful UX with robust architecture.
            </p>
          </FadeIn>

          <div className="mx-auto w-5/6 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <FadeIn key={project.slug} delay={i * 80}>
                <PreviewCard preview={project} basePath="projects" />
              </FadeIn>
            ))}
          </div>

          {/* Professional Work */}
          <FadeIn className="mt-20">
            <h3 className="mb-3 text-2xl font-bold text-white">Professional Work</h3>
            <p className="mb-10 max-w-3xl text-sm text-slate-400">
              Client and employer work — code repositories and live links are not available as IP
              belongs to respective organizations.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {workProjects.map((project, i) => (
              <FadeIn key={i} delay={i * 80}>
                <WorkProject
                  title={project.title}
                  company={project.company}
                  technologies={project.technologies}
                  description={project.description}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Widgets ──────────────────────────────────────── */}
      <section id="widgets" className="bg-[#0d1525] px-16 py-24">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
              02 — Widgets
            </p>
            <h2 className="mb-4 text-4xl font-bold text-white">Interactive Demos</h2>
            <p className="mb-14 max-w-3xl text-slate-400">
              Mathematical visualizations and interactive curiosities — most made to help me
              understand a problem, some featured in my math writing.
            </p>
          </FadeIn>
            
          <div className="mx-auto w-5/6 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
            {widgets.map((widget, i) => (
              <FadeIn key={widget.slug} delay={i * 80}>
                <PreviewCard preview={widget} basePath="widgets" />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────────── */}
      <section id="skills" className="bg-[#0f172a] px-16 py-24">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
              03 — Skills
            </p>
            <h2 className="mb-4 text-4xl font-bold text-white">Engineering Skills</h2>
            <p className="mb-14 max-w-3xl text-slate-400">
              Full-stack systems, real-time applications, scalable infrastructure, and applied ML.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((card, i) => (
              <FadeIn key={card.title} delay={i * 70}>
                <article className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.05]">
                  <h3 className="mb-2 font-semibold text-white">{card.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-white/55">{card.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/75 transition-colors hover:border-white/20 hover:text-white/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Math ─────────────────────────────────────────── */}
      <section id="math" className="bg-slate-900 px-16 py-24">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
              04 — Math
            </p>
            <h2 className="mb-4 text-4xl font-bold text-white">Mathematics</h2>
            <p className="mb-14 max-w-3xl text-slate-400">
              Essays, explorations, and interactive curiosities from Crude Euler — my math writing
              and problem-solving journal.
            </p>
          </FadeIn>

          <div className="grid gap-0 lg:grid-cols-2 lg:gap-x-16">
            {articles.map((article, i) => (
              <FadeIn key={article.slug} delay={i * 60}>
                <article className="border-b border-white/10 py-7 last:border-0">
                  <time className="text-xs tracking-wide text-white/40">
                    {formatDate(article.date)}
                  </time>
                  <h3 className="mt-1.5 text-lg font-semibold text-white">
                    <Link
                      href={`/math/${article.slug}`}
                      className="transition-colors hover:text-white/75"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    {article.description}
                  </p>
                  <Link
                    href={`/math/${article.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-400 transition-colors hover:text-teal-300"
                  >
                    Read article
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 16 16">
                      <path
                        d="M6.75 5.75 9.25 8l-2.5 2.25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────── */}
      <section id="contact" className="bg-[#07090f] px-16 py-32">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
              05 — Contact
            </p>
            <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
              Let&apos;s Connect
            </h2>
            <p className="mb-14 max-w-xl text-lg leading-relaxed text-slate-400">
              I&apos;m open to engineering roles, research collaborations, and interesting
              problems. Reach out through any of the channels below.
            </p>
          </FadeIn>

          <FadeIn delay={120}>
            <div className="flex flex-col gap-5 sm:flex-row sm:gap-8">
              <a
                href="https://github.com/bigjmn"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
              >
                <svg className="h-5 w-5 text-white/60 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-white">GitHub</p>
                  <p className="text-xs text-white/45">github.com/bigjmn</p>
                </div>
              </a>

              <a
                href="mailto:jesse@example.com"
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
              >
                <svg className="h-5 w-5 text-white/60 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-white">Email</p>
                  <p className="text-xs text-white/45">Drop me a message</p>
                </div>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
