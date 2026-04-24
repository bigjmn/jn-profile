import Image from 'next/image';
import { ProjectPage } from '@/components/ProjectPage';
import {
  BsLightning,
  BsPersonDash,
  BsDoorOpen,
  BsTrash3,
  BsBroadcast,
  BsFilm,
} from "react-icons/bs";
const maindescript = "Shock and Draw is a team drawing-and-guessing game with a subversive twist. Both teams play simultaneously, and are able to sabotage the other with various attacks (losing the ability to use colors, guesses come in backwards, etc)"

// TODO - change to shock and draw pictures
const testProps:ProjectPageProps = {
  shots: [
      {
        src: "/projects/shockdraw-waitroom.png",
        alt: "Shock and Draw wait room",
        title: "Waiting Room",
        caption:
          "The game room screen before the game starts. Users select their usernames and teams",
      },
      {
        src: "/projects/shockdraw-fiftyshades.png",
        alt: "Fifty Shades attack",
        title: "Fifty Shades attack (drawer view)",
        caption:
          "An example of an attack. The drawer is unable to use colors until the attack ends",
      },
      {
        src: "/projects/shockdraw-mobile.png",
        alt: "Mobile view",
        title: "Mobile layout",
        caption:
          "A view of the mobile layout from a drawer's perspective. All canvas events touch-supported.",
      },
      {
        src: "/projects/shockdraw-peeptom.png",
        alt: "Peeping Tom attack",
        title: "Peeping Tom attack (guesser view)",
        caption:
          "Another example of an attack. The guessers must click (or press) the canvas to see a little cross-section of the drawing. Dragging moves the viewing window.",
      },
    ],
    
  
  techTags: ["React", "Express", "Socket.IO"],
  projectTitle:"Shock and Draw",
  mainDescription: maindescript,
  topCard:{
    coreIdea:"Team drawing-and-guessing game with a subversive twist",
    greatFor:"small parties, remote hangouts",
    outcome:"Web game (mobile friendly), native mobile app in development."
    
  },
  features:[
    {
      title:"6 Unique team Attacks",
      description:"Result is determined probabilistically, with weights determined by Yelp ranking, user preferences and order history.",
      icon:<BsLightning/>
    },
    {
      title:"Real-time player abandonment detection",
      description:"Gracefully handles players quitting mid-game regardless of team role (drawer or guesser) ",
      icon:<BsPersonDash/>
    },
    {
      title:"Multiple private game rooms/sessions",
      description:"Creating a game starts a session with a unique URL and room code, which players access directly or through the home page.",
      icon:<BsDoorOpen/>
    },
    {
      title:"Inactive session cleanup",
      description:"Automaticaly deletes game rooms and sessions when all players leave, releasing server resources.",
      icon:<BsTrash3/>
    },
    {
        title: "Real-time multiplayer powered by Socket.IO",
        description: "Low-latency, synchronized game state updates to optimize gameplay experience",
        icon:<BsBroadcast/>
    },
    {
        title: "Smooth animated transitions",
        description: "Synchronized, clean transitions between game states for improved UX",
        icon:<BsFilm/>
    }
  ],
  projectLinks: [
    {linkType: "website", linkUrl: "https://shockanddraw.xyz/"},
    {linkType:'github', linkUrl:"https://github.com/bigjmn/shock-and-draw"}
  ]

}

export default function ShockDrawPage(){
    return <ProjectPage {...testProps} />
}