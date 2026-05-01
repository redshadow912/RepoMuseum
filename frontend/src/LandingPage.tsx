import React, { useState, useRef, useEffect } from 'react';

/**
 * LandingPage.tsx
 * Orchestrates the isomorphic-git Web Worker and transitions to the Vanilla UI,
 * now powered by the Midnight Museum Design System.
 */

export default function LandingPage() {
  const [phase, setPhase] = useState<'FOYER' | 'LOADING' | 'MUSEUM'>('FOYER');
  const [url, setUrl] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(new URL('./gitWorker.ts', import.meta.url), { type: 'module' });
    
    workerRef.current.onmessage = (e) => {
      const { type, phase: msgPhase, payload, error } = e.data;
      
      if (type === 'PROGRESS') {
        setLoadingText(msgPhase);
      } else if (type === 'DONE') {
        (window as any).REPO_DATA = payload;
        setPhase('MUSEUM');
        
        if (typeof (window as any).render === 'function') {
          setTimeout(() => {
            (window as any).render(payload);
          }, 500); 
        }
      } else if (type === 'ERROR') {
        setLoadingText(`Exhibition Failed: ${error}`);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setPhase('LOADING');
    setLoadingText('Awakening the curator...');
    workerRef.current?.postMessage({ type: 'START', url });
  };

  if (phase === 'MUSEUM') {
    return null; // The Vanilla Museum UI takes over
  }

  return (
    <div className={`flex flex-col min-h-screen transition-opacity duration-1000 ${phase === 'MUSEUM' ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Top NavBar from Stitch Design */}
      <nav className="fixed top-0 w-full z-50 border-b border-stone-800 bg-black/90 backdrop-blur-md" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex justify-between items-center px-10 py-6 max-w-[1100px] mx-auto w-full">
          <div className="font-serif italic text-2xl text-primary-container tracking-widest">
            RepoMuseum
          </div>
          <div className="hidden md:flex space-x-8">
            <a className="text-stone-400 font-serif italic hover:text-secondary-fixed-dim transition-all duration-500 font-body-md text-body-md" href="#">The Collection</a>
            <a className="text-stone-400 font-serif italic hover:text-secondary-fixed-dim transition-all duration-500 font-body-md text-body-md" href="#">Exhibitions</a>
            <a className="text-stone-400 font-serif italic hover:text-secondary-fixed-dim transition-all duration-500 font-body-md text-body-md" href="#">Archives</a>
          </div>
          <button className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container border border-primary-container/50 px-4 py-2 hover:bg-primary-container/10 transition-colors">
            Exhibit Repository
          </button>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-40 pb-margin-page px-6 w-full max-w-[1100px] mx-auto flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 spotlight pointer-events-none -z-10"></div>
        
        {phase === 'FOYER' && (
          <section className="w-full max-w-3xl flex flex-col items-center text-center mt-20 mb-32 relative animate-[fadeIn_1s_ease-in]">
            <h1 className="font-display-xl text-display-xl text-on-background mb-8" style={{ fontFamily: '"Newsreader", serif' }}>
              Enter the Archives
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mb-16">
              Submit a repository to our curatorial engine. We synthesize commit history, branch architecture, and code strata into a curated exhibition of software craftsmanship.
            </p>
            
            <form onSubmit={handleGenerate} className="w-full relative group flex flex-col items-center">
              <div className="w-full relative">
                <label className="absolute -top-6 left-0 font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-widest" htmlFor="repo-url">
                  Provenance / Source URL
                </label>
                <input 
                  autoComplete="off" 
                  className="w-full bg-transparent border-0 border-b border-outline-variant text-on-background font-code-sm text-code-sm py-4 focus:ring-0 focus:border-primary-container placeholder:text-outline/50 transition-colors outline-none" 
                  id="repo-url" 
                  placeholder="https://github.com/owner/repository" 
                  spellCheck="false" 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <div className="mt-16">
                <button type="submit" className="font-label-sm text-label-sm uppercase bg-primary-container text-black px-12 py-4 tracking-widest hover:bg-primary transition-colors flex items-center gap-3">
                  <span className="material-symbols-outlined text-black" style={{ fontSize: '18px' }}>account_balance</span>
                  Begin Curation
                </button>
              </div>
            </form>
          </section>
        )}

        {phase === 'LOADING' && (
          <section className="w-full max-w-3xl flex flex-col items-center text-center mt-20 mb-32 relative animate-[fadeIn_1s_ease-in]">
             <div className="mt-12 flex flex-col items-center gap-4 text-primary-fixed-dim">
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: '48px' }}>hourglass_empty</span>
                <p className="font-code-sm text-code-sm italic text-xl mt-4">{loadingText}</p>
                <p className="font-label-sm text-label-sm text-outline-variant uppercase tracking-widest mt-2">Zero-backend execution • Browser memory only</p>
             </div>
          </section>
        )}

        {/* The Curator's Method (Only visible in FOYER to keep UI clean during loading) */}
        {phase === 'FOYER' && (
          <section className="w-full mt-margin-page pt-32 border-t border-white/5 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-primary-container/20 to-transparent"></div>
            <div className="flex flex-col md:flex-row gap-gutter-display items-start">
              <div className="w-full md:w-1/3">
                <h2 className="font-headline-lg text-headline-lg text-on-background mb-6">
                  The Curator's Method
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                  Our archival process treats code not as mere instructions, but as structural art. We extract the narrative embedded in version control.
                </p>
              </div>
              <div className="w-full md:w-2/3 grid grid-cols-1 gap-8">
                <div className="glass-case glass-case-hover p-8 relative flex gap-6">
                  <div className="w-12 h-12 flex-shrink-0 border border-primary-container/30 rounded-full flex items-center justify-center">
                    <span className="font-code-sm text-code-sm text-primary-fixed-dim">01</span>
                  </div>
                  <div>
                    <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container mb-3">Stratigraphy</h3>
                    <p className="font-body-md text-body-md text-on-background/80">
                      We excavate the commit history, mapping the tectonic shifts of architecture over time to reveal foundational decisions.
                    </p>
                  </div>
                </div>
                <div className="glass-case glass-case-hover p-8 relative flex gap-6 ml-0 md:ml-12">
                  <div className="w-12 h-12 flex-shrink-0 border border-primary-container/30 rounded-full flex items-center justify-center">
                    <span className="font-code-sm text-code-sm text-primary-fixed-dim">02</span>
                  </div>
                  <div>
                    <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container mb-3">Taxonomy</h3>
                    <p className="font-body-md text-body-md text-on-background/80">
                      Modules, classes, and functions are cataloged and mounted like rare specimens, their dependencies illuminated.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-stone-900 mt-auto bg-black relative" style={{ borderTop: '0.5px solid rgba(212, 175, 55, 0.3)' }}>
        <div className="flex flex-col md:flex-row justify-between items-center px-10 py-16 max-w-[1100px] mx-auto w-full opacity-80 hover:opacity-100 transition-opacity duration-300">
          <div className="font-serif text-stone-500 text-xs tracking-widest uppercase font-label-sm text-label-sm mb-8 md:mb-0">
            © 2026 RepoMuseum — All Rights Reserved. Curated for the Digital Archive.
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="font-serif text-stone-600 text-xs tracking-widest uppercase hover:text-primary-fixed-dim transition-colors duration-300 font-label-sm text-label-sm" href="#">Provenance</a>
            <a className="font-serif text-stone-600 text-xs tracking-widest uppercase hover:text-primary-fixed-dim transition-colors duration-300 font-label-sm text-label-sm" href="#">Acquisitions</a>
            <a className="font-serif text-stone-600 text-xs tracking-widest uppercase hover:text-primary-fixed-dim transition-colors duration-300 font-label-sm text-label-sm" href="#">Security</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
