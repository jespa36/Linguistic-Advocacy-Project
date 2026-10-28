import { useState, useEffect } from 'react';
import { Languages, Menu, X } from 'lucide-react';

interface NavBarProps {
  onContribute: () => void;
}

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Map', href: '#map' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Method', href: '#method' },
];

export function NavBar({ onContribute }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-[800] transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm ring-1 ring-slate-900/5'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <a href="#top" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-md group-hover:scale-105 transition">
              <Languages size={18} />
            </span>
            <span className={`text-sm font-bold leading-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              CLL Mapper
              <span className={`block text-[10px] font-medium ${scrolled ? 'text-slate-400' : 'text-blue-100'}`}>
                Chicago Linguistic Landscape
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                  scrolled
                    ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    : 'text-blue-50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onContribute}
              className="ml-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 active:scale-95"
            >
              Contribute
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-slate-700' : 'text-white'}`}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-1 space-y-1 animate-fade-in">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                onContribute();
              }}
              className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Contribute a sign
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
