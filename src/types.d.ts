interface Preview {
    title: string;
    slug: string;
    imageSrc: string;
    blurb?: string;
}
interface TopcardsProps{
  coreIdea:string,
  greatFor:string,
  outcome:string
}
interface ProjectPageProps {
  shots:Shot[]
  techTags:string[]
  projectTitle:string;
  mainDescription:string;
  topCard:TopcardsProps;
  features:FeatureCardProps[]

}
interface ProjectDefinition extends Preview {
  pageProps: ProjectPageProps;
}