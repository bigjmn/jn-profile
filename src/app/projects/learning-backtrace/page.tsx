import Image from 'next/image';
import { ProjectPage } from '@/components/ProjectPage';
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
      icon:<BsHouse/>
    },
    {
      title:"project first workflow blahblah",
      description:"hello first feature",
      icon:<BsHouse/>
    },
    {
      title:"project first workflow blahblah",
      description:"hello first feature",
      icon:<BsHouse/>
    },
    {
      title:"project first workflow blahblah",
      description:"hello first feature",
      icon:<BsHouse/>
    }
  ]

}

export default function HardPage(){
    return <ProjectPage {...testProps} />
}