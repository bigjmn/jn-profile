import { ComponentType } from "react";

import SampleProjectFive from "@/components/projects/SampleProjectFive";
import SampleProjectFour from "@/components/projects/SampleProjectFour";
import SampleProjectOne from "@/components/projects/SampleProjectOne";
import SampleProjectSix from "@/components/projects/SampleProjectSix";
import SampleProjectThree from "@/components/projects/SampleProjectThree";
import SampleProjectTwo from "@/components/projects/SampleProjectTwo";
import { Preview } from "@/types";

export interface ProjectDefinition extends Preview {
  component: ComponentType;
}

export const projects: ProjectDefinition[] = [
  {
    title: "Sample Project 1",
    slug: "sample-project-1",
    imageSrc: "/images/placeholder-1.svg",
    blurb: "A sample project showing off the first project slot.",
    component: SampleProjectOne,
  },
  {
    title: "Sample Project 2",
    slug: "sample-project-2",
    imageSrc: "/images/placeholder-2.svg",
    blurb: "A follow-up demo project.",
    component: SampleProjectTwo,
  },
  {
    title: "Sample Project 3",
    slug: "sample-project-3",
    imageSrc: "/images/placeholder-3.svg",
    blurb: "Another placeholder with room for real content.",
    component: SampleProjectThree,
  },
  {
    title: "Sample Project 4",
    slug: "sample-project-4",
    imageSrc: "/images/placeholder-4.svg",
    blurb: "Yet another project card.",
    component: SampleProjectFour,
  },
  {
    title: "Sample Project 5",
    slug: "sample-project-5",
    imageSrc: "/images/placeholder-5.svg",
    blurb: "Placeholder content for the fifth project.",
    component: SampleProjectFive,
  },
  {
    title: "Sample Project 6",
    slug: "sample-project-6",
    imageSrc: "/images/placeholder-6.svg",
    blurb: "Room for a sixth project write-up.",
    component: SampleProjectSix,
  },
];

export const projectsBySlug = projects.reduce<Record<string, ProjectDefinition>>((acc, project) => {
  acc[project.slug] = project;
  return acc;
}, {});
