interface WorkProjectProps {
  title: string;
  company: string;
  technologies: string[];
  description: string;
}

export function WorkProject({ title, company, technologies, description }: WorkProjectProps) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/3 p-6 shadow-sm transition-all hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5">
      <div className="mb-3">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm font-medium text-slate-600 dark:text-white/70">
          {company}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1 text-xs font-medium text-slate-700 dark:text-white/80"
          >
            {tech}
          </span>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-slate-600 dark:text-white/75">
        {description}
      </p>
    </div>
  );
}
