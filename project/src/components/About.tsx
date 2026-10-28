import { Building2, Store, Globe2, Users } from 'lucide-react';

const ABOUT_IMG =
  'https://images.pexels.com/photos/9384020/pexels-photo-9384020.jpeg?auto=compress&cs=tinysrgb&w=900';

const PILLARS = [
  {
    icon: Building2,
    title: 'Official signage',
    text: 'Government buildings, transit stations, street signs, and municipal notices — the languages the city chooses to communicate in.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Store,
    title: 'Grassroots signage',
    text: 'Storefronts, community flyers, murals, and neighborhood notices — the languages Chicagoans actually use day to day.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Globe2,
    title: 'Multilingual record',
    text: 'Over 130 languages are spoken across Chicagoland. This project builds a living archive of where and how they appear in public.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Users,
    title: 'Community-driven',
    text: 'Anyone can contribute. Every photo and location pin helps researchers, educators, and advocates understand our city better.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
];

export function About() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">
              About the project
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
              A living record of Chicago's linguistic diversity.
            </h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              Inspired by the{' '}
              <a
                href="https://map.linguasnapp.uni-hamburg.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:underline"
              >
                LinguaSnapp
              </a>{' '}
              project, the Chicago Linguistic Landscape Mapper invites residents,
              students, and researchers to photograph and tag the public signage
              that surrounds us — revealing which languages thrive in our
              neighborhoods and which remain invisible.
            </p>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Every contribution becomes a data point on an open, interactive map,
              helping us see the gap between official multilingualism and the
              grassroots linguistic reality of the city.
            </p>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-900/10">
              <img
                src={ABOUT_IMG}
                alt="Multilingual storefront signs"
                className="w-full h-72 sm:h-80 object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden sm:block rounded-xl bg-white shadow-lg ring-1 ring-slate-900/10 px-5 py-3.5">
              <div className="text-2xl font-bold text-slate-900">130+</div>
              <div className="text-xs text-slate-500">languages in Chicagoland</div>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="mt-16 sm:mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 hover:shadow-md hover:border-slate-200 transition"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${p.bg} mb-4`}>
                <p.icon size={20} className={p.color} />
              </div>
              <h3 className="text-base font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
