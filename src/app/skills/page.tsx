import { SkillPanels } from "@/components/skills/SkillsPanel";
export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Skills
        </h1>
        {/* <p className="max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p> */}
      </div>

      <SkillPanels />
    </div>
  );
}
