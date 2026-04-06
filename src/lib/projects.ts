import { ComponentType } from "react";

import SampleProjectFive from "@/components/projects/SampleProjectFive";
import SampleProjectFour from "@/components/projects/SampleProjectFour";
import SampleProjectOne from "@/components/projects/SampleProjectOne";
import SampleProjectSix from "@/components/projects/SampleProjectSix";
import SampleProjectThree from "@/components/projects/SampleProjectThree";
import SampleProjectTwo from "@/components/projects/SampleProjectTwo";
import BacktraceLearning from "@/components/projects/BacktraceLearning";
// import { Preview, ProjectPageProps } from "@/types";
import { BsHouse } from "react-icons/bs";
const maindescript="A visual way to map how you learn: track questions you’re trying to answer, attach the resources you used, and grow a dependency graph of ideas so you can see what to study next."
const testProps:ProjectPageProps = {
  shots: [
      {
        src: "/projects/add-resource.png",
        alt: "Add Resource modal connecting a resource to a question",
        title: "Attach resources to questions",
        caption:
          "Add a resource (video/article/etc.) and automatically connect it to the learning question it supports.",
      },
      {
        src: "/projects/graph-view.png",
        alt: "Graph view showing question nodes and resource nodes connected",
        title: "Visual learning dependency graph",
        caption:
          "A node-based map of what you’re learning: questions → resources → follow-up questions.",
      },
      {
        src: "/projects/add-resource.png",
        alt: "Add Question modal with topic tag and understood slider",
        title: "Track understanding over time",
        caption:
          "Create question nodes with topic tags + an “understood” slider to measure progress and identify gaps.",
      },
    ],
    
  
  techTags: ["NextJS", "Firebase", "ReactFlow"],
  projectTitle:"Learning Backtrace",
  mainDescription: maindescript,
  topCard:{
    coreIdea:"Make learning dependencies visible",
    greatFor:"self-study",
    outcome:"outcome here"
    
  },
  features:[
    {
      title:"project first workflow blahblah",
      description:"hello first feature",
      icon:BsHouse
    },
    {
      title:"project first workflow blahblah",
      description:"hello first feature",
      icon:BsHouse
    },
    {
      title:"project first workflow blahblah",
      description:"hello first feature",
      icon:BsHouse
    },
    {
      title:"project first workflow blahblah",
      description:"hello first feature",
      icon:BsHouse
    }
  ]

}
// export interface ProjectDefinition extends Preview {
//   pageProps: ProjectPageProps;
// }

export const projects: ProjectDefinition[] = [
  {
    title: "Trio Jam",
    slug: "trio-jam",
    imageSrc: "/projects/trioicon.png",
    blurb: "A sample project showing off the first project slot.",
    pageProps: testProps,
  },
  {
    title: "Backtrace Learning",
    slug: "learning-backtrace",
    imageSrc: "/projects/backtrace-cover.png",
    blurb: "A follow-up demo project.",
    pageProps: testProps,
  },
  {
    title: "Welp",
    slug: "welp",
    imageSrc: "/projects/welpicon.png",
    blurb: "Another placeholder with room for real content.",
    pageProps: testProps,
  },
  {
    title: "ColorFill",
    slug: "colorfill",
    imageSrc: "/projects/colorfill-previewpic.png",
    blurb: "A graph theory puzzle game with cascading color mechanics and strategic challenges.",
    pageProps: testProps,
  },
  {
    title: "Shock and Draw",
    slug: "shock-and-draw",
    imageSrc: "/projects/shock-draw.png",
    blurb: "A team drawing-and-guessing game with a chaotic twist.",
    pageProps: testProps,
  },
  {
    title: "Sample Project 6",
    slug: "sample-project-6",
    imageSrc: "/images/placeholder-6.svg",
    blurb: "Room for a sixth project write-up.",
    pageProps: testProps,
  },
];

export const projectsBySlug = projects.reduce<Record<string, ProjectDefinition>>((acc, project) => {
  acc[project.slug] = project;
  return acc;
}, {});
