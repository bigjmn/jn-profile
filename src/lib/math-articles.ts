import type React from "react";

import glob from "fast-glob";

export interface MathArticle {
  title: string;
  description: string;
  author: string;
  date: string;
}

export interface MathArticleWithSlug extends MathArticle {
  slug: string;
}

async function importArticle(articleFilename: string): Promise<MathArticleWithSlug> {
  const { article } = (await import(`@/app/math/${articleFilename}`)) as {
    default: React.ComponentType;
    article: MathArticle;
  };

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ""),
    ...article,
  };
}

export async function getAllMathArticles() {
  const articleFilenames = await glob("*/page.mdx", {
    cwd: "./src/app/math",
  });

  const articles = await Promise.all(articleFilenames.map(importArticle));

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date));
}
