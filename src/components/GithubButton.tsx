import { GithubIcon, ExternalLinkIcon, cn } from "./ProjectPage";

export function GithubButton({gLink}:{gLink:string}){
    return (
    <a
            href={gLink}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5",
              "text-sm font-semibold text-white/90 hover:bg-white/10 active:bg-white/15"
            )}
          >
            <GithubIcon className="h-5 w-5" />
            Github Page
            <ExternalLinkIcon className="h-4 w-4 opacity-80" />
          </a>
          )
}