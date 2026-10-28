import { Camera, MapPin, Languages, Tag, ClipboardCheck } from 'lucide-react';

const STEPS = [
  {
    icon: Camera,
    title: 'Photograph a sign',
    text: 'Snap a photo of any public signage — a transit notice, storefront window, community flyer, or street sign. Your camera works directly in the browser.',
  },
  {
    icon: MapPin,
    title: 'Capture location',
    text: 'Your browser geolocation is automatically captured when you open the contribution form, so each sign is pinned exactly where you found it.',
  },
  {
    icon: Languages,
    title: 'Tag the languages',
    text: 'Select from common Chicago languages — Spanish, Polish, Urdu, Arabic, Mandarin, and more — or type any language you see on the sign.',
  },
  {
    icon: Tag,
    title: 'Classify the type',
    text: 'Mark the sign as Official (government, transit, municipal) or Grassroots (storefront, community, independent) to enable category analysis.',
  },
  {
    icon: ClipboardCheck,
    title: 'Submit & it appears live',
    text: 'Your contribution saves instantly and appears on the public map for everyone — researchers, neighbors, and visitors alike.',
  },
];

export function Methodology() {
  return (
    <section id="method" className="py-20 sm:py-28 bg-slate-900 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400 mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
            From sidewalk to data point in five steps.
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            The methodology mirrors established linguistic landscape research:
            photograph, locate, tag, classify, and share.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl bg-slate-800/50 ring-1 ring-white/10 p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 mb-4">
                <step.icon size={20} className="text-blue-400" />
              </div>
              <div className="text-[11px] font-bold text-blue-400/70 mb-1">
                STEP {i + 1}
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600/20 to-blue-800/10 ring-1 ring-blue-500/20 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-white mb-2">Research framework</h3>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            This project follows the linguistic landscape methodology pioneered by
            Landry & Bourhis (1997) and extended by the{' '}
            <a
              href="https://map.linguasnapp.uni-hamburg.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              LinguaSnapp
            </a>{' '}
            project at the University of Hamburg. By distinguishing official from
            grassroots signage, we can analyze the gap between institutional
            language policy and the lived linguistic reality of Chicago's
            neighborhoods — a key indicator for civic language advocacy.
          </p>
        </div>
      </div>
    </section>
  );
}
