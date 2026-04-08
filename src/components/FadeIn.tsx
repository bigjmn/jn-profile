'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'left' | 'right';
}

export function FadeIn({ children, delay = 0, className = '', direction = 'up' }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transition = `opacity 1.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 1.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'none';
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const initialTransform =
    direction === 'up'
      ? 'translateY(66px)'
      : direction === 'left'
        ? 'translateX(-36px)'
        : 'translateX(36px)';

  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: 0, transform: initialTransform, willChange: 'opacity, transform' }}
    >
      {children}
    </div>
  );
}
