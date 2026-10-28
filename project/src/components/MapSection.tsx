import { Camera, Plus, Loader2 } from 'lucide-react';
import { MapView } from '@/components/MapView';
import type { Sign } from '@/lib/supabase';

interface MapSectionProps {
  signs: Sign[];
  loading: boolean;
  loadError: string | null;
  activeId: string | null;
  onSelect: (id: string | null) => void;
  onContribute: () => void;
  onRetry: () => void;
}

export function MapSection({
  signs,
  loading,
  loadError,
  activeId,
  onSelect,
  onContribute,
  onRetry,
}: MapSectionProps) {
  const officialCount = signs.filter((s) => s.category === 'official').length;
  const grassrootsCount = signs.filter((s) => s.category === 'grassroots').length;
  const langSet = new Set<string>();
  signs.forEach((s) => s.languages.forEach((l) => langSet.add(l)));

  return (
    <section id="map" className="py-20 sm:py-28 bg-slate-50 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">
            The map
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
            Explore documented signs across the city.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Blue pins mark official signage; amber pins mark grassroots signage.
            Click any pin to view the photo, languages, and timestamp.
          </p>
        </div>

        {/* Legend bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span className="h-3 w-3 rounded-full bg-blue-600 ring-2 ring-white shadow" />
              Official <span className="text-slate-400 font-normal">({officialCount})</span>
            </span>
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span className="h-3 w-3 rounded-full bg-amber-600 ring-2 ring-white shadow" />
              Grassroots <span className="text-slate-400 font-normal">({grassrootsCount})</span>
            </span>
            <span className="hidden sm:inline text-sm text-slate-400">
              {langSet.size} {langSet.size === 1 ? 'language' : 'languages'} documented
            </span>
          </div>
          <button
            onClick={onContribute}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 active:scale-95"
          >
            <Plus size={16} /> Add a sign
          </button>
        </div>

        {/* Map */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-900/10 bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3" style={{ height: 600 }}>
              <Loader2 size={28} className="animate-spin text-blue-600" />
              <p className="text-sm text-slate-500">Loading the linguistic landscape…</p>
            </div>
          ) : loadError && signs.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4" style={{ height: 600 }}>
              <p className="text-sm font-semibold text-slate-800">Couldn't load signs</p>
              <p className="text-sm text-slate-500">{loadError}</p>
              <button
                onClick={onRetry}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          ) : signs.length === 0 ? (
            <div
              className="relative flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-slate-100 to-slate-50"
              style={{ height: 600 }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Camera size={28} className="text-blue-600" />
              </div>
              <div className="text-center max-w-xs px-6">
                <h3 className="text-lg font-semibold text-slate-900">No signs yet</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Be the first to document a sign in Chicago's linguistic landscape.
                </p>
              </div>
              <button
                onClick={onContribute}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
              >
                Contribute the first sign
              </button>
            </div>
          ) : (
            <MapView signs={signs} activeId={activeId} onSelect={onSelect} height={600} />
          )}
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          Tip: use the + / − controls to zoom. Scroll-wheel zoom is disabled to keep page scrolling smooth.
        </p>
      </div>
    </section>
  );
}
