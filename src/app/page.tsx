import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative mx-auto max-w-7xl px-6 py-32">
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          Jesse Nicholas
        </h1>
        <p className="mb-12 max-w-2xl text-xl text-slate-600 dark:text-white/75">
          I’m an engineer with a strong foundation in mathematics, machine learning, and systems design, focused on building technically rigorous and creatively ambitious products. My work spans full-stack development, real-time systems, and applied AI, with an emphasis on turning complex theoretical ideas into practical, scalable implementations.

I have experience designing and deploying applications using React Native, Next.js, Firebase, and GCP, including real-time multiplayer systems, data-driven interfaces, and production-ready mobile apps. I’m particularly interested in problems involving dynamic systems—such as reinforcement learning agents, game-theoretic models, and interactive simulations—and I often approach engineering challenges through a mathematical lens.

Beyond implementation, I enjoy exploring novel ideas at the intersection of theory and application. My recent work includes modeling strategic behavior in signaling games, building AlphaZero-style learning systems, and designing experimental platforms for understanding complex interactions. I’m motivated by projects that require both deep thinking and strong execution, especially those that push beyond standard patterns.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/projects"
            className="rounded-lg bg-slate-900 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
          >
            View Projects
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-slate-300 bg-slate-100 px-6 py-3 font-medium text-slate-900 transition-colors hover:bg-slate-200 dark:border-white/20 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
