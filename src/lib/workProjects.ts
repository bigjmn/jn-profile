import { WorkProjectProps } from "@/components/WorkProject";

export const workProjects: WorkProjectProps[] = [
  {
    title: "AI Leadership Assessment Platform",
    company: "Leadership Mosaics",
    technologies: ["Next.js", "Firebase", "Google Cloud Platform", "OpenAI", "Firebase Functions"],
    description: "Built an end-to-end AI pipeline for characterizing leadership qualities based on academic research. Created a performant self-assessment UI and structured NoSQL database to categorize qualities and improve training efficiency. Leveraged Google's custom search API with Firebase Functions to schedule automated model updates."
  },
  {
    title: "Trading Platform Modernization",
    company: "BGC Partners",
    technologies: ["React", "Node.js", "Java", "Swing", "Ansible", "JWT", "Docker"],
    description: "Full-stack developer on trading platforms for front-office and middle-office operations. Modernized legacy Delphi codebase to React to improve broker efficiency. Implemented JWT-based authentication and role-based access control. Built internal pipeline management tool using Ansible and Next.js for version deployment and monitoring across single and multi-server environments. Designed LMAX architecture for Forex trading platform to increase speed, reliability, and fault tolerance."
  },
  {
    title: "Data Labeling Platform for Content Moderation",
    company: "Center for Democracy and Technology",
    technologies: ["React", "Firebase", "Python", "Firebase Authorization"],
    description: "Developed a data-labeling platform to classify 100,000+ tweets for machine learning purposes. Structured NoSQL database with fanout design to assign users to batches in many-to-many relationships, maximizing performance and minimizing costs. Implemented Firebase Authorization with role-based access and admin portal for live-monitoring batch progress. Created scheduling-based access restrictions to protect labelers from overexposure to abusive content."
  },
  {
    title: "Living Wage Calculator",
    company: "Sullivan Cotter",
    technologies: ["React", "Firebase", "Census Data APIs"],
    description: "Created a Living Wage Calculator web application to help companies ensure employee welfare. Integrated real-time local cost of living data using census data APIs. Implemented admin portal with Firebase Authorization for platform management."
  }
]