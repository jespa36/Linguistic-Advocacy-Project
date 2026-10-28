import { Languages, Github, Mail, Heart } from 'lucide-react';

interface FooterProps {
  onContribute: () => void;
}

export function Footer({ onContribute }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <Languages size={18} />
              </span>
              <span className="text-sm font-bold text-white">
                Chicago Linguistic Landscape Mapper
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              An open civic project documenting the multilingual signage of
              Chicago's public spaces. Built for residents, researchers, and
              language advocates.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                aria-label="GitHub"
              >
                <Github size={17} />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                aria-label="Email"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-white transition">About</a></li>
              <li><a href="#map" className="hover:text-white transition">Interactive map</a></li>
              <li><a href="#gallery" className="hover:text-white transition">Gallery</a></li>
              <li><a href="#method" className="hover:text-white transition">Methodology</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
              Participate
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={onContribute} className="hover:text-white transition text-left">
                  Contribute a sign
                </button>
              </li>
              <li><a href="#map" className="hover:text-white transition">Browse the map</a></li>
              <li><a href="#method" className="hover:text-white transition">How it works</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>An open civic mapping project. Inspired by LinguaSnapp (University of Hamburg).</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart size={12} className="text-rose-500" /> for Chicago's multilingual communities
          </p>
        </div>
      </div>
    </footer>
  );
}
