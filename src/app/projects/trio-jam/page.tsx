import Image from 'next/image';
import { ProjectPage } from '@/components/ProjectPage';
import { BsHouse } from "react-icons/bs";
const maindescript="A one player strategy word game, available free in the App Store or to play online."

// TODO - update Trio Jame pictures
const testProps:ProjectPageProps = {
  shots: [
      {
        src: "/projects/tj1.png",
        alt: "Add Resource modal connecting a resource to a question",
        title: "Attach resources to questions",
        caption:
          "Add a resource (video/article/etc.) and automatically connect it to the learning question it supports.",
      },
      {
        src: "/projects/tj6.png",
        alt: "Graph view showing question nodes and resource nodes connected",
        title: "Visual learning dependency graph",
        caption:
          "A node-based map of what you’re learning: questions → resources → follow-up questions.",
      },
      {
        src: "/projects/tj7.png",
        alt: "Add Question modal with topic tag and understood slider",
        title: "Track understanding over time",
        caption:
          "Create question nodes with topic tags + an “understood” slider to measure progress and identify gaps.",
      },
    ],
    
  
  techTags: ["React Native", "Firebase", "ReactFlow"],
  projectTitle:"Trio Jam",
  mainDescription: maindescript,
  topCard:{
    coreIdea:"Tetris meets Bananagrams",
    greatFor:"Lovers of strategy word games",
    outcome:"outcome here"
    
  },
  features:[
    {
      title: "High-quality, Responsive UX",
      description: "Includes animated transitions, sound effects, dark mode, and a clean UI that works across multiple screen sizes.",
      icon:<BsHouse/>

    },
    {
      title:"Offline support",
      description:"No internet connection required. Great for plane trips or on the subway.",
      icon:<BsHouse/>
    },
    {
      title:"Leaderboard",
      description:"Tracks user high scores and displays top 10. User also sees their own rank (even if not in top 10.)",
      icon:<BsHouse/>
    },
    {
      title:"Levels and Achievements",
      description:"Score milestones and novelty game achievements earn points which let users level up.",
      icon:<BsHouse/>
    },
    {
      title: "Unlockable Variants",
      description: "Three unique game variants that unlock at different levels.",
      icon: <BsHouse />

    },
    {
      title: "mid-game stat tracking and achievement notifications",
      description: "Word and tile histories viewable during the game, as well as remaining tile distributions. Achievements scored during the game trigger toast notifications.",
      icon: <BsHouse />

    },
    {
      title: "Word of the Day",
      description: "A new daily challenge that updates automatically at midnight.",
      icon: <BsHouse />

    },
    {
      title:"Browser mode",
      description:"Playable in the browser, with mobile-first design and full touch support.",
      icon:<BsHouse/>
    }
  ]

}

export default function TrioJamPage(){
    return <ProjectPage {...testProps} />
}