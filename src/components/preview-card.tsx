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
      className="group mx-auto w-1/4 relative overflow-hidden rounded-3xl border-transparent dark:border-transparent bg-white dark:bg-white/3 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-transparent dark:hover:border-transparent"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.1]">
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
        <h3 className="text-lg font-semibold text-white">
          {preview.title}
        </h3>
      </div>
    </Link>
  );
}
