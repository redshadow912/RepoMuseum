import React, { useState } from 'react';
import { ReportData } from '../../src/types';

interface MuseumReportProps {
  data: ReportData;
}

export default function MuseumReport({ data }: MuseumReportProps) {
  const [activeTab, setActiveTab] = useState<'EXHIBIT' | 'STRATA' | 'CRUCIBLE'>('EXHIBIT');

  const getTabClass = (tabName: 'EXHIBIT' | 'STRATA' | 'CRUCIBLE') => {
    return activeTab === tabName
      ? "flex items-center gap-4 font-serif tracking-widest text-xs uppercase bg-primary-container/10 text-primary-container border-l-2 border-primary-container px-6 py-4 cursor-pointer transition-all duration-300"
      : "flex items-center gap-4 font-serif tracking-widest text-xs uppercase text-stone-600 px-6 py-4 hover:text-stone-300 hover:bg-stone-900/50 cursor-pointer border-l-2 border-transparent transition-all duration-300";
  };

  return (
    <div className="antialiased min-h-screen flex flex-col pt-24 pl-64 bg-background">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 shadow-none bg-black/80 backdrop-blur-md flex justify-between items-center px-12 py-6 max-w-[1400px] mx-auto ml-64" style={{ width: 'calc(100% - 16rem)' }}>
        <div className="flex items-center gap-8">
          <span className="font-serif text-2xl tracking-tighter uppercase italic text-primary-container">RepoMuseum</span>
          <nav className="hidden md:flex gap-6">
            <a className="font-serif text-lg tracking-wide uppercase text-primary-container border-b border-primary-container pb-1 hover:bg-white/5 transition-all duration-500" href="#">The Archive</a>
            <a className="font-serif text-lg tracking-wide uppercase text-stone-500 hover:text-stone-300 transition-colors hover:bg-white/5 transition-all duration-500" href="#">Exhibitions</a>
            <a className="font-serif text-lg tracking-wide uppercase text-stone-500 hover:text-stone-300 transition-colors hover:bg-white/5 transition-all duration-500" href="#">Curator's Notes</a>
          </nav>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-stone-800 shadow-2xl bg-black flex flex-col pt-24 pb-12 z-40">
        <div className="px-6 mb-12 flex items-center gap-4">
          <div>
            <h2 className="font-serif tracking-widest text-xs uppercase text-primary-container italic text-xl">RepoMuseum</h2>
            <p className="font-serif tracking-widest text-xs uppercase text-primary-container/70 mt-1">Archival Git Reports</p>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <div className={getTabClass('EXHIBIT')} onClick={() => setActiveTab('EXHIBIT')}>
            <span className="material-symbols-outlined">museum</span>
            <span>Current Exhibit</span>
          </div>
          <div className={getTabClass('STRATA')} onClick={() => setActiveTab('STRATA')}>
            <span className="material-symbols-outlined">timeline</span>
            <span>Historical Strata</span>
          </div>
          <div className={getTabClass('CRUCIBLE')} onClick={() => setActiveTab('CRUCIBLE')}>
            <span className="material-symbols-outlined">humidity_high</span>
            <span>The Crucible</span>
          </div>
        </nav>
      </aside>

      <main className="flex-1 w-full max-w-[1100px] mx-auto px-10 py-16 pb-32">
        {/* Hero Plaque */}
        {activeTab === 'EXHIBIT' && (
        <section className="mb-32 relative group">
          <div className="absolute inset-0 spotlight-bg opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          <div className="glass-case p-12 md:p-16 flex flex-col items-center text-center relative z-10 border border-white/10 bg-transparent backdrop-blur-md">
            <div className="w-full flex justify-between items-start mb-12">
              <div className="text-left">
                <p className="font-label-sm text-xs text-outline tracking-widest uppercase mb-2">Exhibit 01</p>
                <h1 className="font-display-xl text-5xl md:text-6xl text-on-surface mb-4" style={{ fontFamily: '"Newsreader", serif' }}>
                  {data?.repo?.name || 'Unknown Repository'}
                </h1>
                <p className="font-code-sm text-sm text-on-surface-variant opacity-80 font-mono">
                  {data?.summary?.since ? data.summary.since.split('T')[0] : 'Dawn'} — {data?.summary?.until ? data.summary.until.split('T')[0] : 'Present'}
                </p>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto mb-16">
              <p className="font-headline-lg text-2xl italic text-primary-container leading-relaxed" style={{ fontFamily: '"Newsreader", serif' }}>
                {data?.artifacts?.largestCommit 
                  ? `"A masterful descent into brilliant chaos. On ${data.artifacts.largestCommit.date ? data.artifacts.largestCommit.date.split('T')[0] : 'an unknown date'}, ${data.artifacts.largestCommit.author || 'an unknown author'} forged the monumental '${data.artifacts.largestCommit.subject || 'commit'}', cementing their legacy."`
                  : `"An archival journey revealing an era where engineering bravado met rigid constraints."`}
              </p>
              <p className="mt-4 font-label-sm text-xs text-outline tracking-widest uppercase">— The Curator</p>
            </div>
            
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
              <div className="flex flex-col items-center">
                <span className="font-display-xl text-4xl text-on-surface mb-2" style={{ fontFamily: '"Newsreader", serif' }}>{data?.summary?.commits || 0}</span>
                <span className="font-label-sm text-xs text-outline uppercase tracking-widest">Commits</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-display-xl text-4xl text-on-surface mb-2" style={{ fontFamily: '"Newsreader", serif' }}>{data?.summary?.authors || 0}</span>
                <span className="font-label-sm text-xs text-outline uppercase tracking-widest">Curators</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-display-xl text-4xl text-on-surface mb-2" style={{ fontFamily: '"Newsreader", serif' }}>{data?.summary?.filesTouched || 0}</span>
                <span className="font-label-sm text-xs text-outline uppercase tracking-widest">Artifacts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-display-xl text-4xl text-on-surface mb-2" style={{ fontFamily: '"Newsreader", serif' }}>{data?.eras?.length || 0}</span>
                <span className="font-label-sm text-xs text-outline uppercase tracking-widest">Eras</span>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* The Crucible (Hotspots) */}
        {activeTab === 'CRUCIBLE' && (
        <section className="mb-32">
          <div className="mb-12 border-b border-white/10 pb-4">
            <h2 className="font-display-xl text-3xl text-on-surface" style={{ fontFamily: '"Newsreader", serif' }}>The Crucible</h2>
            <p className="font-label-sm text-xs text-outline tracking-widest uppercase mt-2">Sites of intense structural friction</p>
          </div>
          <div className="glass-case p-8 border border-white/10 bg-transparent backdrop-blur-md">
            <div className="flex flex-col">
              <div className="flex justify-between items-center pb-4 border-b border-white/20 mb-4">
                <span className="font-label-sm text-xs text-outline uppercase tracking-widest w-2/3">Artifact Path</span>
                <span className="font-label-sm text-xs text-outline uppercase tracking-widest w-1/3 text-right">Friction Index (Churn)</span>
              </div>
              {data?.hotspots?.byChurn?.slice(0, 10).map((file, idx) => (
                <div key={file.path} className="flex justify-between items-center py-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4 w-2/3">
                    <span className="font-label-sm text-[10px] text-outline opacity-50 w-6">{(idx + 1).toString().padStart(2, '0')}</span>
                    <span className="font-code-sm text-sm text-on-surface-variant truncate font-mono">{file?.path}</span>
                  </div>
                  <div className="w-1/3 text-right">
                    <span className="font-code-sm text-sm text-primary-container font-mono">{file?.churn}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Historical Strata */}
        {activeTab === 'STRATA' && (
        <section className="mb-32">
          <div className="mb-12 border-b border-white/10 pb-4">
            <h2 className="font-display-xl text-3xl text-on-surface" style={{ fontFamily: '"Newsreader", serif' }}>Historical Strata</h2>
            <p className="font-label-sm text-xs text-outline tracking-widest uppercase mt-2">Chronological eras of development</p>
          </div>
          <div className="flex flex-col gap-8">
            {data?.eras?.map((era, i) => (
              <div key={i} className="glass-case p-8 border border-white/10 bg-transparent backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary-container opacity-50"></div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-display-xl text-2xl text-on-surface mb-2" style={{ fontFamily: '"Newsreader", serif' }}>Era {era.index + 1}</h3>
                    <p className="font-code-sm text-xs text-on-surface-variant font-mono">
                      {era.startDate ? era.startDate.split('T')[0] : 'Unknown'} — {era.endDate ? era.endDate.split('T')[0] : 'Unknown'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-display-xl text-3xl text-primary-container" style={{ fontFamily: '"Newsreader", serif' }}>{era.commits}</span>
                    <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest mt-1">Commits</p>
                  </div>
                </div>
                
                {era.keywords && era.keywords.length > 0 && (
                  <div className="mb-6">
                    <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest mb-3">Key Themes</p>
                    <div className="flex flex-wrap gap-2">
                      {era.keywords.slice(0, 10).map(kw => (
                        <span key={kw.word} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-xs text-on-surface-variant">
                          {kw.word} <span className="opacity-50">({kw.count})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {era.topFiles && era.topFiles.length > 0 && (
                  <div>
                    <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest mb-3">Core Artifacts</p>
                    <div className="flex flex-col gap-2">
                      {era.topFiles.slice(0, 3).map(f => (
                        <div key={f.path} className="flex justify-between text-xs font-mono text-on-surface-variant opacity-80">
                          <span className="truncate w-3/4">{f.path}</span>
                          <span>{f.churn}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {(!data?.eras || data.eras.length === 0) && (
              <p className="text-on-surface-variant font-serif italic text-lg text-center mt-12">No strata recorded in the archives.</p>
            )}
          </div>
        </section>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-stone-900 bg-black flex flex-col items-center justify-center gap-4 text-center ml-64 z-50" style={{ width: 'calc(100% - 16rem)' }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">© 2026 RepoMuseum Archival Services. All commits reserved.</p>
        <div className="flex gap-6 mt-4">
          <a className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-700 hover:text-stone-300 transition-colors" href="#">Provenance</a>
          <a className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-700 hover:text-stone-300 transition-colors" href="#">Terms of Exhibition</a>
        </div>
      </footer>
    </div>
  );
}
