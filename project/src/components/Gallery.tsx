import { useState } from 'react';
import { ChevronRight, ImageIcon } from 'lucide-react';
import type { Sign } from '@/lib/supabase';

interface GalleryProps {
  signs: Sign[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function Gallery({ signs }: GalleryProps) {
  const [filter, setFilter] = useState<'all' | 'official' | 'grassroots'>('all');
  const [selected, setSelected] = useState<Sign | null>(null);

  const filtered = signs.filter((s) => filter === 'all' || s.category === filter);
  const display = filtered.slice(0, 12);

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-white scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">
              Gallery
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
              Recently documented signs.
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            {(['all', 'official', 'grassroots'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition ${
                  filter === f
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {display.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 mb-3">
              <ImageIcon size={24} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">No signs in this category yet.</p>
            <p className="text-xs text-slate-400 mt-1">Contributions will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {display.map((sign) => (
              <button
                key={sign.id}
                onClick={() => setSelected(sign)}
                className="group relative rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-900/10 aspect-[4/5] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <img
                  src={sign.photo_url}
                  alt={sign.languages.join(', ')}
                  className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
                <span
                  className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${
                    sign.category === 'official' ? 'bg-blue-600' : 'bg-amber-600'
                  }`}
                >
                  {sign.category}
                </span>
                <div className="absolute bottom-0 inset-x-0 p-3 text-left">
                  <p className="text-xs font-semibold text-white truncate">
                    {sign.languages.join(', ')}
                  </p>
                  <p className="text-[10px] text-slate-300 mt-0.5">{formatDate(sign.created_at)}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {filtered.length > display.length && (
          <p className="mt-6 text-center text-sm text-slate-400">
            Showing {display.length} of {filtered.length} signs — explore the map for all.
          </p>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.photo_url}
              alt={selected.languages.join(', ')}
              className="w-full max-h-[60vh] object-contain bg-slate-900"
            />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${
                    selected.category === 'official' ? 'bg-blue-600' : 'bg-amber-600'
                  }`}
                >
                  {selected.category}
                </span>
                <span className="text-xs text-slate-400">{formatDate(selected.created_at)}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {selected.languages.join(', ')}
              </h3>
              {selected.note && (
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{selected.note}</p>
              )}
              <p className="mt-3 text-xs text-slate-400 font-mono">
                {selected.latitude.toFixed(5)}, {selected.longitude.toFixed(5)}
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white hover:bg-slate-900/80"
              aria-label="Close"
            >
              <ChevronRight size={18} className="rotate-180" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
