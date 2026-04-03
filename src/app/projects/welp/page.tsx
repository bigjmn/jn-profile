import Image from 'next/image';
import { ProjectPage } from '@/components/ProjectPage';
import { BsHouse } from "react-icons/bs";

const maindescript = "Welp is a search and decision app, designed to combat choice paralysis. No one wants to scroll through a million options when deciding where to go out or what to order in. With Welp, we give you one option, and welp... that's what you're doing!"

const testProps:ProjectPageProps = {
  shots: [
      {
        src: "/projects/welp_homescreen.png",
        alt: "Add Resource modal connecting a resource to a question",
        title: "Attach resources to questions",
        caption:
          "Add a resource (video/article/etc.) and automatically connect it to the learning question it supports.",
      },
      {
        src: "/projects/welp_preferences.png",
        alt: "Graph view showing question nodes and resource nodes connected",
        title: "Visual learning dependency graph",
        caption:
          "A node-based map of what you’re learning: questions → resources → follow-up questions.",
      },
      {
        src: "/projects/welp_result.png",
        alt: "Add Question modal with topic tag and understood slider",
        title: "Track understanding over time",
        caption:
          "Create question nodes with topic tags + an “understood” slider to measure progress and identify gaps.",
      },
    ],
    
  
  techTags: ["Expo", "React Native", "Firebase support", "Yelp, Uber, and Google API integrations", "works on iPhone + iPad"],
  projectTitle:"Learning Backtrace",
  mainDescription: maindescript,
  topCard:{
    coreIdea:"Tetris meets Bananagrams",
    greatFor:"self-study",
    outcome:"outcome here"
    
  },
  features:[
    {
      title:"Smart search",
      description:"Result is determined probabilistically, with weights determined by Yelp ranking, user preferences and order history.",
      icon:<BsHouse/>
    },
    {
      title:"Preference setting",
      description:"Filters and sliders let you customize the algorithm to better fit your tastes and budget. ",
      icon:<BsHouse/>
    },
    {
      title:"Uber integration",
      description:"Opens the result in your Uber app for seamless user flow.",
      icon:<BsHouse/>
    },
    {
      title:"Reviews and order history",
      description:"Optional private review of restaurant to further fine-tune the algorithm to fit your tastes.",
      icon:<BsHouse/>
    },
    {
        title: "Location aware",
        description: "Usess built-in location services to find places near you. Or chooes a location using the Google Places API.",
        icon:<BsHouse/>
    },
    {
        title: "Up to date business info for best results.",
        description: "Uses Yelp's business API to guarantee your result is open and (if relevant) delivering.",
        icon:<BsHouse/>
    }
  ]

}

export default function WelpPage(){
    return <ProjectPage {...testProps} />
}