import Image from 'next/image';
import { ProjectPage } from '@/components/ProjectPage';
import { BsHouse } from "react-icons/bs";

const maindescript = "Shock and Draw is a team drawing-and-guessing game with a subversive twist. Both teams play simultaneously, and are able to sabotage the other with various attacks (losing the ability to use colors, guesses come in backwards, etc)"

// TODO - change to shock and draw pictures
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
    
  
  techTags: ["React", "Express", "Socket.IO"],
  projectTitle:"Shock and Draw",
  mainDescription: maindescript,
  topCard:{
    coreIdea:"Team drawing-and-guessing game with a subversive twist",
    greatFor:"small parties, remote hangouts",
    outcome:"outcome here"
    
  },
  features:[
    {
      title:"6 Unique Team Attacks",
      description:"Result is determined probabilistically, with weights determined by Yelp ranking, user preferences and order history.",
      icon:<BsHouse/>
    },
    {
      title:"Real-time player abandonment detection",
      description:"Gracefully handles players quitting mid-game regardless of team role (drawer or guesser) ",
      icon:<BsHouse/>
    },
    {
      title:"Multiple private game rooms/sessions",
      description:"Creating a game starts a session with a unique URL and room code, which players access directly or through the home page.",
      icon:<BsHouse/>
    },
    {
      title:"Inactive Session Cleanup",
      description:"Automaticaly deletes game rooms and sessions when all players leave, releasing server resources.",
      icon:<BsHouse/>
    },
    {
        title: "Real-time multiplayer powered by Socket.IO",
        description: "Low-latency, synchronized game state updates to optimize gameplay experience",
        icon:<BsHouse/>
    },
    {
        title: "Smooth Animated Transitions",
        description: "Synchronized, clean transitions between game states for improved UX",
        icon:<BsHouse/>
    }
  ]

}

export default function WelpPage(){
    return <ProjectPage {...testProps} />
}