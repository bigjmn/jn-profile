import { PreviewCard } from '@/components/preview-card';
import { WorkProject } from '@/components/WorkProject';
import { projects } from '@/lib/projects';

export default function ProjectsPage() {
  return (
    <div className="relative mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-white">
          Projects
        </h1>
        <p className="max-w-3xl text-lg text-white/75">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <PreviewCard key={project.slug} preview={project} basePath="projects" />
        ))}
      </div>

      {/* Professional Work Section */}
      <div className="mt-24">
        <h2 className="mb-4 text-3xl font-bold text-white">
          Professional Work
        </h2>
        <p className="mb-8 max-w-3xl text-white/75">
          The projects below represent work completed for clients and employers. Code repositories and live links are not available, as all intellectual property rights belong to the respective organizations.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Example work projects - replace with actual data */}
          <WorkProject
            title="Example Project"
            company="Example Company"
            technologies={["React", "TypeScript", "Node.js"]}
            description="This is a placeholder description. Replace this with actual professional work descriptions. Each description should be 3-5 sentences explaining the project scope, your role, and key technical achievements."
          />
        </div>
      </div>
    </div>
  );
}
