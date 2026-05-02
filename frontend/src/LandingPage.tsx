import React, { useState, useRef, useEffect } from 'react';
import MuseumReport from './MuseumReport';
import Dropzone from './Dropzone';
import TopNavBar from './components/TopNavBar';
import Footer from './components/Footer';
import CuratorMethod from './components/CuratorMethod';
import LoadingDisplay from './components/LoadingDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import { ReportData } from '../../src/types';

/**
 * LandingPage.tsx
 * Orchestrates the isomorphic-git Web Worker and transitions to the Vanilla UI,
 * now powered by the Midnight Museum Design System.
 */

export default function LandingPage() {
  const [phase, setPhase] = useState<'FOYER' | 'LOADING' | 'MUSEUM' | 'ERROR'>('FOYER');
  const [url, setUrl] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(new URL('./gitWorker.ts', import.meta.url), { type: 'module' });
    
    workerRef.current.onmessage = (e) => {
      const { type, phase: msgPhase, payload, message } = e.data;
      
      if (type === 'PROGRESS') {
        setLoadingText(msgPhase);
      } else if (type === 'DONE') {
        setReportData(payload);
        setPhase('MUSEUM');
      } else if (type === 'ERROR') {
        setPhase('ERROR');
        setErrorMsg(message || 'An unknown error occurred.');
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setErrorMsg('');
    setPhase('LOADING');
    setLoadingText('Awakening the curator...');
    workerRef.current?.postMessage({ type: 'START', url });
  };

  const handleDossierLoaded = (parsedJson: any) => {
    setReportData(parsedJson as ReportData);
    setPhase('MUSEUM');
  };

  // We do not return null early here, because we want the fade-out transition 
  // to run for 1000ms as it fades to black before the Museum UI takes over.

  return (
    <>
      {phase === 'MUSEUM' && reportData && (
        <div className="absolute inset-0 z-0">
          <MuseumReport data={reportData} />
        </div>
      )}

      <div className={`flex flex-col min-h-screen transition-opacity duration-1000 relative z-10 bg-background ${phase === 'MUSEUM' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        <TopNavBar />

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
              <div className="mt-16 mb-8">
                <button type="submit" className="font-label-sm text-label-sm uppercase bg-primary-container text-black px-12 py-4 tracking-widest hover:bg-primary transition-colors flex items-center gap-3">
                  <span className="material-symbols-outlined text-black" style={{ fontSize: '18px' }}>account_balance</span>
                  Begin Curation
                </button>
              </div>
            </form>
            
            <div className="w-full flex items-center justify-center my-4 opacity-50">
               <div className="h-px w-32 bg-white/20"></div>
               <span className="font-serif italic text-xs mx-4 uppercase tracking-widest text-stone-500">OR</span>
               <div className="h-px w-32 bg-white/20"></div>
            </div>

            <Dropzone onDataLoaded={handleDossierLoaded} />
          </section>
        )}

        {phase === 'LOADING' && <LoadingDisplay loadingText={loadingText} />}

        {phase === 'ERROR' && <ErrorDisplay errorMsg={errorMsg} onRetry={() => setPhase('FOYER')} />}

        {phase === 'FOYER' && <CuratorMethod />}
      </main>

      <Footer />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
    </>
  );
}
