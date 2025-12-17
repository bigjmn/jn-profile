import { notFound } from "next/navigation";

import ProjectRenderer from "@/components/projects/ProjectRenderer";
import { projects, projectsBySlug } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.slug,
  }));
}

interface ProjectPageProps {
  params: { id: string };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { id } = params;
  const project = projectsBySlug[id];

  if (!project) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="space-y-4 text-left">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          {project.title}
        </h1>
        {project.blurb ? (
          <p className="text-lg text-zinc-600 dark:text-zinc-400">{project.blurb}</p>
        ) : null}
      </div>

      <div className="mt-10 flex justify-center">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
          <ProjectRenderer slug={project.slug} />
        </div>
      </div>
    </div>
  );
}
