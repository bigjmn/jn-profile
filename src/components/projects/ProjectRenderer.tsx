"use client";

import dynamic from "next/dynamic";

import { projects } from "@/lib/projects";

const projectComponents = projects.reduce<Record<string, ReturnType<typeof dynamic>>>((acc, project) => {
  acc[project.slug] = dynamic(project.load, { ssr: false });
  return acc;
}, {});

interface ProjectRendererProps {
  slug: string;
}

export function ProjectRenderer({ slug }: ProjectRendererProps) {
  const ProjectComponent = projectComponents[slug];

  if (!ProjectComponent) {
    return null;
  }

  return <ProjectComponent />;
}

export default ProjectRenderer;
