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
      className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={preview.imageSrc}
          alt={preview.title}
          fill
          className="object-cover transition-all duration-300 group-hover:brightness-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {preview.title}
        </h3>
      </div>
    </Link>
  );
}
