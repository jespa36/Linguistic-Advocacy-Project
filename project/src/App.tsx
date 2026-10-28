import { useCallback, useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { MapSection } from '@/components/MapSection';
import { Gallery } from '@/components/Gallery';
import { Methodology } from '@/components/Methodology';
import { Footer } from '@/components/Footer';
import { ContributeForm } from '@/components/ContributeForm';
import { supabase, type Sign } from '@/lib/supabase';

function App() {
  const [signs, setSigns] = useState<Sign[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const loadSigns = useCallback(async () => {
    const { data, error } = await supabase
      .from('signs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setLoadError(error.message);
    } else {
      setSigns((data ?? []) as Sign[]);
      setLoadError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSigns();
  }, [loadSigns]);

  const handleSelect = useCallback((id: string | null) => setActiveId(id), []);
  const handleSubmitted = useCallback(() => {
    loadSigns();
  }, [loadSigns]);
  const openForm = useCallback(() => setFormOpen(true), []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <NavBar onContribute={openForm} />

      <main>
        <Hero totalSigns={signs.length} onContribute={openForm} />
        <About />
        <MapSection
          signs={signs}
          loading={loading}
          loadError={loadError}
          activeId={activeId}
          onSelect={handleSelect}
          onContribute={openForm}
          onRetry={loadSigns}
        />
        <Gallery signs={signs} />
        <Methodology />
      </main>

      <Footer onContribute={openForm} />

      <ContributeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmitted={handleSubmitted}
      />
    </div>
  );
}

export default App;
