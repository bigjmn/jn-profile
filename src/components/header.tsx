'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'Projects', anchor: 'projects', subPath: '/projects' },
  { name: 'Widgets', anchor: 'widgets', subPath: '/widgets' },
  { name: 'Skills', anchor: 'skills', subPath: '/skills' },
  { name: 'Math', anchor: 'math', subPath: '/math' },
  { name: 'Contact', anchor: 'contact', subPath: '/contact' },
];

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // When navigating to home with a hash, scroll smoothly after render
  useEffect(() => {
    if (pathname !== '/') return;
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80);
    }
  }, [pathname]);

  const isActive = (subPath: string) => {
    if (pathname === '/') return false;
    return pathname.startsWith(subPath);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    setMobileMenuOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
    }
    // Otherwise, the Link href="/#anchor" handles navigation naturally
  };

  const ThemeToggle = () =>
    mounted ? (
      <button
        type="button"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? (
          <svg className="h-5 w-5 text-slate-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-white dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    ) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#070A13]/80">
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-semibold text-slate-900 transition-colors hover:text-slate-600 dark:text-white dark:hover:text-white/80"
          >
            Jesse Nicholas
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={pathname === '/' ? `#${item.anchor}` : `/#${item.anchor}`}
                onClick={(e) => handleNavClick(e, item.anchor)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.subPath)
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white'
                }`}
              >
                {item.name}
              </a>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile */}
          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-5 w-5 text-slate-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-slate-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 dark:border-white/10 md:hidden">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={pathname === '/' ? `#${item.anchor}` : `/#${item.anchor}`}
                onClick={(e) => handleNavClick(e, item.anchor)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.subPath)
                    ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
