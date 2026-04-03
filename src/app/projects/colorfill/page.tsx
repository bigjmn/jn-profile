import { ProjectPage } from '@/components/ProjectPage';
import { BsDiagram3, BsTrophy, BsNodePlus, BsArrowRepeat, BsBook } from "react-icons/bs";

const maindescript = "ColorFill is a graph theory puzzle game where strategy meets cascading color mechanics. Click a node to paint it—but here's the twist: any neighboring nodes of the same color reset to white. Your goal is to fill the entire graph with a single color in as few moves as possible. It's part logic puzzle, part strategic planning, with a dash of graph theory elegance."

const testProps: ProjectPageProps = {
  shots: [
    {
        src: "/projects/colorfill-game.png",
        alt: "A starting board for a ColorFill puzzle",
        title: "A starting board for a ColorFill puzzle",
        caption:
          "The wheel cycles through each color in turn. Clicking a node colors that node.",
      }
  ],

  techTags: ["Next.js", "Firebase", "Tailwind CSS", "Vercel"],
  projectTitle: "ColorFill",
  mainDescription: maindescript,
  topCard: {
    coreIdea: "Strategic graph coloring with cascading resets",
    greatFor: "puzzle enthusiasts and graph theory curious minds",
    outcome: "Think ahead, minimize moves, and master the color flood"
  },
  features: [
    {
      title: "Cascading color mechanics",
      description: "When you color a node, neighboring nodes of the same color automatically reset to white, creating strategic chain reactions that require planning ahead.",
      icon: <BsDiagram3 />
    },
    {
      title: "Par-based challenge system",
      description: "Each puzzle has a par score (moves to beat) and an optimal solution. Track your efficiency and aim for the perfect solve.",
      icon: <BsTrophy />
    },
    {
      title: "Interactive graph visualization",
      description: "Click nodes to color them, see connections light up, and watch the graph transform in real-time as you work toward a single-color solution.",
      icon: <BsNodePlus />
    },
    {
      title: "Move counter & reset",
      description: "Track every move and instantly restart the puzzle to try different strategies. Experiment freely to find the optimal path.",
      icon: <BsArrowRepeat />
    },
    {
      title: "Pure strategy, no time pressure",
      description: "Think as long as you need. This is about finding elegant solutions, not racing the clock.",
      icon: <BsBook />
    },
    {
      title: "Graph theory in action",
      description: "Learn fundamental graph concepts (nodes, edges, connectivity) while solving puzzles—education disguised as entertainment.",
      icon: <BsBook />
    }
  ]
}

export default function ColorFillPage() {
  return <ProjectPage {...testProps} />
}
