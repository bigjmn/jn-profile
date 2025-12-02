import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { formatDate } from "@/lib/formatDate";
import { getAllMathArticles } from "@/lib/math-articles";

export const metadata = {
  title: "Math",
  description: "Math musings, puzzles, and explorations.",
};

export default async function MathPage() {
  const articles = await getAllMathArticles();

  return (
    <Container className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-12 max-w-3xl space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Math</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Crude Euler collects my favorite math essays, explorations, and interactive curiosities.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {articles.map((article) => (
          <Card key={article.slug} as="article">
            <Card.Eyebrow as="time" dateTime={article.date} decorate>
              {formatDate(article.date)}
            </Card.Eyebrow>
            <Card.Title href={`/math/${article.slug}`}>{article.title}</Card.Title>
            <Card.Description>{article.description}</Card.Description>
            <p className="relative z-10 mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              By {article.author}
            </p>
            <Card.Cta>Read article</Card.Cta>
          </Card>
        ))}
      </div>
    </Container>
  );
}
