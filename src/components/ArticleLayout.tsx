import Link from "next/link";

import { Container } from "@/components/Container";
import { Prose } from "@/components/Prose";
import { formatDate } from "@/lib/formatDate";
import { type MathArticleWithSlug } from "@/lib/math-articles";

export function ArticleLayout({
  article,
  children,
}: {
  article: MathArticleWithSlug;
  children: React.ReactNode;
}) {
  return (
    <Container className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
      <article className="max-w-3xl">
        <header className="flex flex-col gap-3">
          <Link
            href="/math"
            className="group inline-flex w-fit items-center text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 transition group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="h-4 w-4 stroke-current"
              >
                <path
                  d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Back to Math
          </Link>
          <time
            dateTime={article.date}
            className="order-first flex items-center text-base text-zinc-500 dark:text-zinc-400"
          >
            <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
            <span className="ml-3">{formatDate(article.date)}</span>
          </time>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
            {article.title}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">{article.description}</p>
        </header>
        <Prose className="mt-10" data-mdx-content>
          {children}
        </Prose>
      </article>
    </Container>
  );
}
