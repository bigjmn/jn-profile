'use client'

import React from "react";

type Skill = {
  id: number;
  name: string;
  title: string;
  description: string;
};

const mockCatOne: Skill[] = [
    {
        id: 1,
        name: "NextJS (React)",
        title: "NextJS (React)",
        description:
            "Definitely my go-to for new web projects. The v13 change to server-side rendering was a game changer, and out-of-the-box support for typescript and Tailwind is also a big plus. The only issue is that the default Next server doesn't really support socket.io, so if I need websocket functionality I usually set up a separate Express service.",
    },
    {
        id: 2,
        name: "Node/Express",
        title: "Node/Express",
        description:
            "I love Express. I love how un-opinionated it is, and how easy it is to use. Definitely not surprising that Next seemed to model their backend APIs on Express. I've generally switched over to Next, so I don't use the traditional MVC architecture anymore (or the celebrated MERN stack) but if I'm working on a project that needs websockets, WebRTC for video streaming, or anything else fancy, Express is my go-to for a microservice.",
    },
    {
        id: 3,
        name: "Firebase/Supabase",
        title: "Firebase/Supabase",
        description:
            "I use Firebase a little more, but I like both. My go-to for authentication, and for a database. Supabase has had a SQL database forever - Firebase just added one recently, but I haven't tried it yet (I usually use Firestore). Firebase is a little more robust and easy to use, but Supabase seems to try harder at integrations, and they have a good community.",
    },
    {
        id: 4,
        name: "Java",
        title: "Java",
        description:
            "I'd be lying if I said Java was my favorite thing to work with. Some of my worst debugging sessions have involved dealing with Maven dependencies. Still, I like the finer-grain control it offers. For native applications, I've worked with Swing but generally prefer JavaFX. I've also used it for systems design, like implementing the LMAX architecture.",
    },
    {
        id: 5,
        name: "Tailwind",
        title: "Tailwind",
        description:
            "Tailwind all day. I've used pre-built components from Material UI and Chakra, but I much prefer Tailwind. MUI tends to make applications all look like Google. Chakra is a little better, but I still find prebuilt components a little too inflexible.",
    },
];

const mockCatTwo: Skill[] = [
    {
        id: 6,
        name: "Docker/Kubernetes",
        title: "Docker/Kubernetes",
        description:
            "I love distributed systems, and in that regard Kubernetes is King. It does have a steep learning curve, but in terms of scalability and cloud integrations, in my view it's the best.",
    },
    {
        id: 7,
        name: "Git/Gitlab",
        title: "Git/Gitlab",
        description:
            "Github is fine, but for larger projects with more development environments, Gitlab is the best for CI/CD.",
    },
    {
        id: 8,
        name: "Ansible",
        title: "Ansible",
        description:
            "A great tool for infrastructure management, especially for orchestration over a lot of hosts. Definitely a life saver for non-cloud (or hybrid) systems, and the pipelines are super flexible.",
    },
    
];
const mockSkillsThree = [
    {
        id: 9,
        name: "PyTorch",
        title: "PyTorch",
        description:
            "I've used both PyTorch and Tensorflow, but PyTorch has become my tool of choice for ML projects, especially for reinforcement learning. It's a little easier to use, and I find that it's better maintained as well - Tensorflow's update to v3 seemed to break a lot of its tooling.",
    },
    {
        id: 10,
        name: "MCP",
        title: "MCP",
        description:
            "Ansible's rollout of this architecture was a little shaky, but it does address a key LLM issue.",
    },
    {
        id: 11,
        name: "Copilot",
        title: "Copilot",
        description:
            "The elephant in the room - admittedly this should be under the 'Dev Ops' section, but I've found that an understanding of AI and its strengths and weaknesses is key to using it effectively. My own policy is to use the 'ask' mode if I need help with something I'm unfamiliar with, and agent/edit mode only for things I could do myself (and therefore can review its edits.)",
    },
]
const mockSkills = [...mockCatOne, ...mockCatTwo, ...mockSkillsThree];

export const SkillPanels: React.FC = () => {
  const [selectedId, setSelectedId] = React.useState<number | null>(
    mockSkills[0]?.id ?? null
  );
  const [showDetailsOnMobile, setShowDetailsOnMobile] = React.useState(false);

  const selectedSkill = mockSkills.find((s) => s.id === selectedId) ?? null;

  const handleSelectSkill = (id: number) => {
    setSelectedId(id);
    // On mobile, selecting a skill opens the details panel
    setShowDetailsOnMobile(true);
  };

  const handleCollapse = () => {
    setShowDetailsOnMobile(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="relative flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Skill list panel */}
        <div
          className={[
            "z-10 flex flex-col border-r border-slate-200 bg-slate-50/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80",
            "transition-all duration-300 ease-in-out",
            "overflow-y-auto",
            // Mobile width behavior
            showDetailsOnMobile ? "w-1/3" : "w-full",
            // Desktop/tablet width
            "md:relative md:w-full",
          ].join(" ")}
        >
          <div className="px-4 pt-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Full Stack Development
            </h2>
          </div>
          <ul className="flex-1 px-2 py-2 space-y-1">
            {mockCatOne.map((skill) => {
              const isActive = skill.id === selectedId;
              return (
                <li key={skill.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectSkill(skill.id)}
                    className={[
                      "w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition",
                      "flex items-center justify-between gap-2",
                      isActive
                        ? "bg-sky-500 text-white shadow-sm"
                        : "bg-transparent text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/60",
                    ].join(" ")}
                  >
                    <span>{skill.name}</span>
                    {isActive && (
                      <span className="text-xs uppercase tracking-wide opacity-80">
                        Selected
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="px-4 pt-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Dev Ops
            </h2>
          </div>
          <ul className="flex-1 px-2 py-2 space-y-1">
            {mockCatTwo.map((skill) => {
              const isActive = skill.id === selectedId;
              return (
                <li key={skill.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectSkill(skill.id)}
                    className={[
                      "w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition",
                      "flex items-center justify-between gap-2",
                      isActive
                        ? "bg-sky-500 text-white shadow-sm"
                        : "bg-transparent text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/60",
                    ].join(" ")}
                  >
                    <span>{skill.name}</span>
                    {isActive && (
                      <span className="text-xs uppercase tracking-wide opacity-80">
                        Selected
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <div>
          <div className="px-4 pt-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Machine Learning
            </h2>
          </div>
          <ul className="flex-1 px-2 py-2 space-y-1">
            {mockSkillsThree.map((skill) => {
              const isActive = skill.id === selectedId;
              return (
                <li key={skill.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectSkill(skill.id)}
                    className={[
                      "w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition",
                      "flex items-center justify-between gap-2",
                      isActive
                        ? "bg-sky-500 text-white shadow-sm"
                        : "bg-transparent text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/60",
                    ].join(" ")}
                  >
                    <span>{skill.name}</span>
                    {isActive && (
                      <span className="text-xs uppercase tracking-wide opacity-80">
                        Selected
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          </div>
        </div>

        {/* Details panel */}
        {/* <div
          className={[
            "h-full bg-white px-5 py-4 dark:bg-slate-950",
            "transition-transform duration-300 ease-in-out",
            // Desktop/tablet: static, always visible, part of flex layout
            "md:static md:flex md:w-2/3 md:translate-x-0",
            "md:flex-col",
            // Mobile: slide in from the right
            "absolute top-0 right-0 w-2/3",
            showDetailsOnMobile ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="mb-3 flex items-center justify-between md:mb-4">
            <button
              type="button"
              onClick={handleCollapse}
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-100 md:hidden"
            >
              <span className="inline-block -ml-1">&#8592;</span>
              Back to skills
            </button>
            <span className="hidden text-xs font-semibold uppercase tracking-wide text-slate-500 md:inline-block">
              Details
            </span>
          </div>

          {selectedSkill ? (
            <div className="flex h-full flex-col">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {selectedSkill.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {selectedSkill.description}
                </p>
              </div>

              <div className="mt-6 rounded-lg border border-dashed border-slate-200 p-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <p className="font-semibold mb-1">
                  Placeholder extra content for "{selectedSkill.name}"
                </p>
                <p>
                  This is where you might show proficiency levels, projects,
                  links, or sub-skills related to the selected skill.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
              Select a skill from the list to see more details.
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};
