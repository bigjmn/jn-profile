interface WorkProjectProps {
  title: string;
  company: string;
  technologies: string[];
  description: string;
}

export function WorkProject({ title, company, technologies, description }: WorkProjectProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/3 p-6 shadow-sm transition-all hover:border-white/20 hover:bg-white/5">
      <div className="mb-3">
        <h3 className="text-xl font-semibold text-white">
          {title}
        </h3>
        <p className="text-sm font-medium text-white/70">
          {company}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80"
          >
            {tech}
          </span>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-white/75">
        {description}
      </p>
    </div>
  );
}
