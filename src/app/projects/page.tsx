import { PreviewCard } from '@/components/preview-card';
import { WorkProject } from '@/components/WorkProject';
import { projects } from '@/lib/projects';
import { workProjects } from '@/lib/workProjects';

export default function ProjectsPage() {
  return (
    <div className="relative mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
          Personal Projects
        </h1>
        <p className="max-w-3xl text-lg text-slate-600 dark:text-white/75">
          I'm passionate about building interactive web and mobile experiences that solve real problems. From real-time multiplayer games to visual learning tools, these projects showcase my approach to full-stack development—combining thoughtful UX design with robust technical architecture. Explore some of my favorites below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <PreviewCard key={project.slug} preview={project} basePath="projects" />
        ))}
      </div>

      {/* Professional Work Section */}
      <div className="mt-24">
        <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
          Professional Work
        </h2>
        <p className="mb-8 max-w-3xl text-slate-600 dark:text-white/75">
          The projects below represent work completed for clients and employers. Code repositories and live links are not available, as all intellectual property rights belong to the respective organizations.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {workProjects.map((project, index) => (
            <WorkProject
              key={index}
              title={project.title}
              company={project.company}
              technologies={project.technologies}
              description={project.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
