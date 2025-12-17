import { projectsBySlug } from "@/lib/projects";

interface ProjectRendererProps {
  slug: string;
}

export function ProjectRenderer({ slug }: ProjectRendererProps) {
  const project = projectsBySlug[slug];
  const ProjectComponent = project?.component;

  if (!ProjectComponent) {
    return null;
  }

  return <ProjectComponent />;
}

export default ProjectRenderer;
