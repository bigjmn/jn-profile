import Image from 'next/image';
import { ProjectPage } from '@/components/ProjectPage';
import {
  BsMagic,
  BsSliders,
  BsCarFront,
  BsChatSquareText,
  BsGeoAlt,
  BsClockHistory,
} from "react-icons/bs";
const maindescript = "Welp is a search and decision app, designed to combat choice paralysis. No one wants to scroll through a million options when deciding where to go out or what to order in. With Welp, we give you one option, and welp... that's what you're doing!"

const testProps:ProjectPageProps = {
  shots: [
      {
        src: "/projects/welp_homescreen.png",
        alt: "Welp home screen",
        title: "Home Screen",
        caption:
          "Supports four types of services, including keyword search.",
      },
      {
        src: "/projects/welp_preferences.png",
        alt: "welp preferences",
        title: "Preference Page",
        caption:
          "Set your preferences. We'll do the rest.",
      },
      {
        src: "/projects/welp_result.png",
        alt: "welp result",
        title: "Result card",
        caption:
          "Shows restaurant info, as well as deep link into Uber.",
      },
    ],
    
  
  techTags: ["Expo", "React Native", "Firebase support", "Yelp, Uber, and Google API integrations", "works on iPhone + iPad"],
  projectTitle:"Welp...",
  mainDescription: maindescript,
  topCard:{
    coreIdea:"A search-and-decision app",
    greatFor:"Narrowing down your choices (to one.)",
    outcome:"Fully deployed on the App store."
    
  },
  features:[
    {
      title:"Smart search",
      description:"Result is determined probabilistically, with weights determined by Yelp ranking, user preferences and order history.",
      icon:<BsMagic/>
    },
    {
      title:"Preference setting",
      description:"Filters and sliders let you customize the algorithm to better fit your tastes and budget. ",
      icon:<BsSliders/>
    },
    {
      title:"Uber integration",
      description:"Opens the result in your Uber app for seamless user flow.",
      icon:<BsCarFront/>
    },
    {
      title:"Reviews and order history",
      description:"Optional private review of restaurant to further fine-tune the algorithm to fit your tastes.",
      icon:<BsChatSquareText/>
    },
    {
        title: "Location aware",
        description: "Usess built-in location services to find places near you. Or chooes a location using the Google Places API.",
        icon:<BsGeoAlt/>
    },
    {
        title: "Up to date business info for best results.",
        description: "Uses Yelp's business API to guarantee your result is open and (if relevant) delivering.",
        icon:<BsClockHistory/>
    }
  ],
  projectLinks: [
    {linkType:'github',linkUrl:"https://github.com/bigjmn/welp-app"}
  ]

}

export default function WelpPage(){
    return <ProjectPage {...testProps} />
}