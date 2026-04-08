import Image from 'next/image';
import { ProjectPage } from '@/components/ProjectPage';
import {
  BsPhone,
  BsWifiOff,
  BsTrophy,
  BsStars,
  BsUnlock,
  BsBarChart,
  BsCalendarDay,
  BsGlobe,
} from "react-icons/bs";
const maindescript="A one player strategy word game, available free in the App Store or to play online."

// TODO - update Trio Jame pictures
const testProps:ProjectPageProps = {
  shots: [
      {
        src: "/projects/triojam-0.png",
        alt: "Trio Jam home screen",
        title: "Trio Jam home screen",
        caption:
          "Game card, word of the day, and variants showing locked status",
      },
      {
        src: "/projects/triojam-2.png",
        alt: "Trio Jam Position",
        title: "In-game view",
        caption:
          "Responsive colors showing accepted words, as well as movable tiles (the top A and the G)",
      },
      {
        src: "/projects/triojam-1.png",
        alt: "Mid-game Stats",
        title: "Mid-game Stats",
        caption:
          "Track the letters/words cleared during the game, and the distribution of letters remaining",
      },
    ],
    
  
  techTags: ["React Native", "Firebase", "ReactFlow"],
  projectTitle:"Trio Jam",
  mainDescription: maindescript,
  topCard:{
    coreIdea:"Tetris meets Bananagrams",
    greatFor:"Lovers of strategy word games",
    outcome:"Deployed on the App store, functional browser game"
    
  },
  features:[
    {
      title: "High-quality, Responsive UX",
      description: "Includes animated transitions, sound effects, dark mode, and a clean UI that works across multiple screen sizes.",
      icon:<BsPhone/>

    },
    {
      title:"Offline support",
      description:"No internet connection required. Great for plane trips or on the subway.",
      icon:<BsWifiOff/>
    },
    {
      title:"Leaderboard",
      description:"Tracks user high scores and displays top 10. User also sees their own rank (even if not in top 10.)",
      icon:<BsTrophy/>
    },
    {
      title:"Levels and achievements",
      description:"Score milestones and novelty game achievements earn points which let users level up.",
      icon:<BsStars/>
    },
    {
      title: "Unlockable variants",
      description: "Three unique game variants that unlock at different levels.",
      icon: <BsUnlock />

    },
    {
      title: "Stat-tracking and achievement notifications",
      description: "Word and tile histories viewable during the game, as well as remaining tile distributions. Achievements scored during the game trigger toast notifications.",
      icon: <BsBarChart />

    },
    {
      title: "Word of the Day",
      description: "A new daily challenge that updates automatically at midnight.",
      icon: <BsCalendarDay />

    },
    {
      title:"Browser mode",
      description:"Playable in the browser, with mobile-first design and full touch support.",
      icon:<BsGlobe/>
    }
  ],
  projectLinks: [
    {linkType:'website', linkUrl: "triojam.com"},
    {linkType:'github', linkUrl:"https://github.com/bigjmn/tjam-v2"}
  ]

}

export default function TrioJamPage(){
    return <ProjectPage {...testProps} />
}