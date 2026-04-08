import Link from 'next/link';
import Image from 'next/image';
import { Preview } from '@/types';

interface PreviewCardProps {
  preview: Preview;
  basePath: 'projects' | 'widgets';
}

export function PreviewCard({ preview, basePath }: PreviewCardProps) {
  return (
    <Link
      href={`/${basePath}/${preview.slug}`}
      className="group mx-auto w-1/4 relative overflow-hidden rounded-3xl border border-slate-200 dark:border-transparent bg-white dark:bg-white/3 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-black/20 rounded-lg">
        <Image
          src={preview.imageSrc}
          alt={preview.title}
          unoptimized={true}
          fill
          className="object-contain transition-all duration-300 group-hover:brightness-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 flex justify-center ">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {preview.title}
        </h3>
      </div>
    </Link>
  );
}
