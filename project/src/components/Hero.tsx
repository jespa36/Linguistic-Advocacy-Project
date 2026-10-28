import { MapPin, ArrowDown, Camera } from 'lucide-react';

interface HeroProps {
  totalSigns: number;
  onContribute: () => void;
}

const HERO_IMG =
  'https://images.pexels.com/photos/2093329/pexels-photo-2093329.jpeg?auto=compress&cs=tinysrgb&w=1600';

export function Hero({ totalSigns, onContribute }: HeroProps) {
  return (
    <section id="top" className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Chicago skyline at dusk"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 w-full pt-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3.5 py-1.5 text-xs font-medium text-blue-50 ring-1 ring-white/20 mb-6">
            <MapPin size={13} className="text-blue-300" />
            A civic linguistic mapping project · Chicago, IL
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight">
            Mapping the languages of Chicago's public spaces.
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-200 leading-relaxed max-w-xl">
            Document and explore the official and grassroots signage that shapes
            our city's linguistic landscape — from government buildings to
            storefronts, community flyers to transit signs.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onContribute}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/40 transition hover:bg-blue-700 active:scale-95"
            >
              <Camera size={18} />
              Contribute a sign
            </button>
            <a
              href="#map"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/20"
            >
              Explore the map
              <ArrowDown size={16} />
            </a>
          </div>

          {/* Stat strip */}
          <div className="mt-12 flex gap-8">
            <div>
              <div className="text-3xl font-bold text-white tabular-nums">{totalSigns}</div>
              <div className="text-xs text-blue-200 mt-0.5">Signs mapped</div>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <div className="text-3xl font-bold text-white">2</div>
              <div className="text-xs text-blue-200 mt-0.5">Sign categories</div>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <div className="text-3xl font-bold text-white">77</div>
              <div className="text-xs text-blue-200 mt-0.5">Chicago neighborhoods</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1 text-blue-200/70">
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
}
