import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative mx-auto max-w-7xl px-6 py-32">
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Welcome to My Portfolio
        </h1>
        <p className="mb-12 max-w-2xl text-xl text-white/75">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Explore
          my work and get in touch.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/projects"
            className="rounded-lg bg-white px-6 py-3 font-medium text-black transition-opacity hover:opacity-90"
          >
            View Projects
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-medium text-white/90 transition-colors hover:bg-white/10"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
