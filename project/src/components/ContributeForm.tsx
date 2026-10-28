import { useEffect, useRef, useState } from 'react';
import {
  Camera,
  X,
  MapPin,
  Check,
  Loader2,
  AlertCircle,
  Languages,
  Tag,
  Image as ImageIcon,
} from 'lucide-react';
import { supabase, COMMON_LANGUAGES, type SignCategory } from '@/lib/supabase';

interface ContributeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

type Status = 'idle' | 'locating' | 'uploading' | 'saving' | 'success' | 'error';

export function ContributeForm({ open, onClose, onSubmitted }: ContributeFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'done' | 'error'>('idle');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [customLanguage, setCustomLanguage] = useState('');
  const [category, setCategory] = useState<SignCategory | null>(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Reset everything when opened
  useEffect(() => {
    if (open) {
      setFile(null);
      setPreviewUrl(null);
      setLatitude(null);
      setLongitude(null);
      setLocationStatus('idle');
      setSelectedLanguages([]);
      setCustomLanguage('');
      setCategory(null);
      setNote('');
      setStatus('idle');
      setErrorMsg('');
      // auto-request location on open
      requestLocation();
    }
  }, [open]);

  // Auto-request geolocation
  function requestLocation() {
    if (!('geolocation' in navigator)) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocationStatus('done');
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  function toggleLanguage(lang: string) {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  }

  function addCustomLanguage() {
    const trimmed = customLanguage.trim();
    if (!trimmed) return;
    if (!selectedLanguages.includes(trimmed)) {
      setSelectedLanguages((prev) => [...prev, trimmed]);
    }
    setCustomLanguage('');
  }

  const allLanguages = Array.from(
    new Set([...COMMON_LANGUAGES, ...selectedLanguages])
  );

  const canSubmit =
    !!file &&
    latitude !== null &&
    longitude !== null &&
    selectedLanguages.length > 0 &&
    category !== null &&
    status !== 'uploading' &&
    status !== 'saving';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setStatus('uploading');
      const ext = file!.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `signs/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('sign-photos')
        .upload(path, file!, { cacheControl: '3600', upsert: false });
      if (upErr) throw new Error(upErr.message);

      const { data: pub } = supabase.storage.from('sign-photos').getPublicUrl(path);
      const photoUrl = pub.publicUrl;

      setStatus('saving');
      const { error: insErr } = await supabase.from('signs').insert({
        photo_url: photoUrl,
        latitude,
        longitude,
        languages: selectedLanguages,
        category,
        note: note.trim() || null,
      });
      if (insErr) throw new Error(insErr.message);

      setStatus('success');
      setTimeout(() => {
        onSubmitted();
        onClose();
      }, 900);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col justify-end sm:items-center sm:justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto animate-slide-up">
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="h-1.5 w-10 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white/95 backdrop-blur border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Contribute a Sign</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <Check className="text-emerald-600" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Sign submitted</h3>
            <p className="mt-1 text-sm text-slate-500">
              Your contribution is now live on the map.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-5 space-y-6">
            {/* Photo */}
            <section>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <ImageIcon size={16} className="text-slate-400" /> Photo of the sign
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              {previewUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200">
                  <img src={previewUrl} alt="Selected sign" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow hover:bg-white"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-10 text-slate-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <Camera size={28} />
                  <span className="text-sm font-medium">Snap or upload a photo</span>
                  <span className="text-xs text-slate-400">Tap to use your camera</span>
                </button>
              )}
            </section>

            {/* Geolocation */}
            <section>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <MapPin size={16} className="text-slate-400" /> Location
              </label>
              <div className="rounded-xl border border-slate-200 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      locationStatus === 'done'
                        ? 'bg-emerald-100 text-emerald-600'
                        : locationStatus === 'error'
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {locationStatus === 'locating' ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : locationStatus === 'done' ? (
                      <Check size={18} />
                    ) : locationStatus === 'error' ? (
                      <AlertCircle size={18} />
                    ) : (
                      <MapPin size={18} />
                    )}
                  </div>
                  <div>
                    {locationStatus === 'locating' && (
                      <p className="text-sm font-medium text-slate-700">Finding your location…</p>
                    )}
                    {locationStatus === 'done' && latitude !== null && longitude !== null && (
                      <>
                        <p className="text-sm font-semibold text-slate-800">Location captured</p>
                        <p className="text-xs text-slate-500 font-mono">
                          {latitude.toFixed(5)}, {longitude.toFixed(5)}
                        </p>
                      </>
                    )}
                    {locationStatus === 'error' && (
                      <p className="text-sm font-medium text-rose-600">Couldn't get your location</p>
                    )}
                    {locationStatus === 'idle' && (
                      <p className="text-sm text-slate-500">Ready to capture</p>
                    )}
                  </div>
                </div>
                {locationStatus !== 'locating' && (
                  <button
                    type="button"
                    onClick={requestLocation}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {locationStatus === 'done' ? 'Refresh' : 'Retry'}
                  </button>
                )}
              </div>
            </section>

            {/* Languages */}
            <section>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Languages size={16} className="text-slate-400" /> Language(s) on the sign
              </label>
              <div className="flex flex-wrap gap-2">
                {allLanguages.map((lang) => {
                  const active = selectedLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium border transition ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomLanguage();
                    }
                  }}
                  placeholder="Add another language…"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomLanguage}
                  className="rounded-lg bg-slate-100 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  Add
                </button>
              </div>
            </section>

            {/* Category */}
            <section>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Tag size={16} className="text-slate-400" /> Sign type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCategory('official')}
                  className={`flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition ${
                    category === 'official'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                    O
                  </span>
                  <span className="text-sm font-semibold text-slate-800">Official</span>
                  <span className="text-xs text-slate-500">Government, transit, city signage</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('grassroots')}
                  className={`flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition ${
                    category === 'grassroots'
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-600 text-white text-xs font-bold">
                    G
                  </span>
                  <span className="text-sm font-semibold text-slate-800">Grassroots</span>
                  <span className="text-xs text-slate-500">Storefronts, flyers, community</span>
                </button>
              </div>
            </section>

            {/* Note */}
            <section>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Notes <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Any context about this sign or neighborhood…"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
              />
            </section>

            {/* Error */}
            {status === 'error' && (
              <div className="flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg || 'Submission failed. Please try again.'}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {(status === 'uploading' || status === 'saving') && (
                <Loader2 size={18} className="animate-spin" />
              )}
              {status === 'uploading' && 'Uploading photo…'}
              {status === 'saving' && 'Saving sign…'}
              {status !== 'uploading' && status !== 'saving' && 'Submit sign'}
            </button>
            <p className="text-center text-xs text-slate-400">
              Your photo and location are shared publicly on this civic map.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}


