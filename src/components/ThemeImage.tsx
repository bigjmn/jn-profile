'use client'

import { useEffect, useState } from 'react'

import Image, { type StaticImageData } from 'next/image'
import { useTheme } from 'next-themes'

interface ThemeImageProps {
  src: StaticImageData | string
  darkSrc: StaticImageData | string
  alt: string
  className?: string
  [key: string]: any
}

export function ThemeImage({ src, darkSrc, alt, className, ...props }: ThemeImageProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Image src={src} alt={alt} className={className} {...props} />
  }

  const imageSrc = resolvedTheme === 'dark' ? darkSrc : src

  return <Image src={imageSrc} alt={alt} className={className} {...props} />
}