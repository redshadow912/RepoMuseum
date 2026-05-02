import React, { useState } from 'react';
import { ReportData } from '../../src/types';

interface MuseumReportProps {
  data: ReportData;
}

export default function MuseumReport({ data }: MuseumReportProps) {
  const [activeTab, setActiveTab] = useState<'EXHIBIT' | 'STRATA' | 'CRUCIBLE' | 'RELICS' | 'GUILDS' | 'ENTANGLEMENT' | 'CONFESSIONAL'>('EXHIBIT');

  const getTabClass = (tabName: 'EXHIBIT' | 'STRATA' | 'CRUCIBLE' | 'RELICS' | 'GUILDS' | 'ENTANGLEMENT' | 'CONFESSIONAL') => {
    return activeTab === tabName
      ? "flex items-center gap-4 font-serif tracking-widest text-xs uppercase bg-primary-container/10 text-primary-container border-l-2 border-primary-container px-6 py-4 cursor-pointer transition-all duration-300"
      : "flex items-center gap-4 font-serif tracking-widest text-xs uppercase text-stone-600 px-6 py-4 hover:text-stone-300 hover:bg-stone-900/50 cursor-pointer border-l-2 border-transparent transition-all duration-300";
  };

  const getGuilds = () => {
    if (!data?.ownership) return [];
    const authorMap = new Map<string, typeof data.ownership>();
    data.ownership.forEach(file => {
      if (file.topAuthors && file.topAuthors.length > 0) {
        const topAuthor = file.topAuthors[0].author;
        if (!authorMap.has(topAuthor)) authorMap.set(topAuthor, []);
        authorMap.get(topAuthor)!.push(file);
      }
    });
    return Array.from(authorMap.entries()).sort((a, b) => b[1].length - a[1].length);
  };

  const guilds = activeTab === 'GUILDS' ? getGuilds() : [];

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
          <div className={getTabClass('RELICS')} onClick={() => setActiveTab('RELICS')}>
            <span className="material-symbols-outlined">diamond</span>
            <span>The Relics</span>
          </div>
          <div className={getTabClass('GUILDS')} onClick={() => setActiveTab('GUILDS')}>
            <span className="material-symbols-outlined">groups</span>
            <span>The Guilds</span>
          </div>
          <div className={getTabClass('ENTANGLEMENT')} onClick={() => setActiveTab('ENTANGLEMENT')}>
            <span className="material-symbols-outlined">hub</span>
            <span>The Entanglement</span>
          </div>
          <div className={getTabClass('CONFESSIONAL')} onClick={() => setActiveTab('CONFESSIONAL')}>
            <span className="material-symbols-outlined">nightlight</span>
            <span>The Confessional</span>
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

        {/* The Relics */}
        {activeTab === 'RELICS' && (
        <section className="mb-32 animate-[fadeIn_0.5s_ease-out]">
          <div className="mb-12 border-b border-white/10 pb-4">
            <h2 className="font-display-xl text-3xl text-on-surface" style={{ fontFamily: '"Newsreader", serif' }}>The Relics</h2>
            <p className="font-label-sm text-xs text-outline tracking-widest uppercase mt-2">Peculiar anomalies and historical anchors</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Oldest Relic */}
            <div className="glass-case p-8 border border-white/10 bg-transparent backdrop-blur-md hover:bg-white/5 transition-colors duration-500">
               <div className="flex items-center gap-4 mb-6">
                 <span className="material-symbols-outlined text-4xl text-primary-container">hourglass_empty</span>
                 <div>
                   <h3 className="font-display-xl text-2xl text-on-surface" style={{ fontFamily: '"Newsreader", serif' }}>The Genesis Stone</h3>
                   <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest">Oldest Surviving File</p>
                 </div>
               </div>
               {data?.artifacts?.oldestFile ? (
                 <>
                   <p className="font-code-sm text-sm text-primary-container font-mono truncate mb-2">{data.artifacts.oldestFile.path}</p>
                   <p className="font-serif italic text-on-surface-variant opacity-80 text-sm leading-relaxed">First unearthed on <span className="text-on-surface">{data.artifacts.oldestFile.firstSeen.split('T')[0]}</span>. It has weathered every storm and refactor since the dawn of the archive.</p>
                 </>
               ) : (
                 <p className="font-serif italic text-on-surface-variant opacity-50 text-sm">No ancient relics survived the great rewrites.</p>
               )}
            </div>

            {/* Most Renamed */}
            <div className="glass-case p-8 border border-white/10 bg-transparent backdrop-blur-md hover:bg-white/5 transition-colors duration-500">
               <div className="flex items-center gap-4 mb-6">
                 <span className="material-symbols-outlined text-4xl text-primary-container">route</span>
                 <div>
                   <h3 className="font-display-xl text-2xl text-on-surface" style={{ fontFamily: '"Newsreader", serif' }}>The Shapeshifter</h3>
                   <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest">Most Renamed File</p>
                 </div>
               </div>
               {data?.artifacts?.mostRenamedFile ? (
                 <>
                   <p className="font-code-sm text-sm text-primary-container font-mono truncate mb-2">{data.artifacts.mostRenamedFile.path}</p>
                   <p className="font-serif italic text-on-surface-variant opacity-80 text-sm leading-relaxed">A restless artifact, changing its identity <span className="text-on-surface text-lg">{data.artifacts.mostRenamedFile.renames} times</span> across the epochs to evade obsolescence.</p>
                 </>
               ) : (
                 <p className="font-serif italic text-on-surface-variant opacity-50 text-sm">All artifacts have remained steadfast in their identities.</p>
               )}
            </div>

            {/* Zombie Directory */}
            <div className="glass-case p-8 border border-white/10 bg-transparent backdrop-blur-md hover:bg-white/5 transition-colors duration-500 md:col-span-2">
               <div className="flex items-center gap-4 mb-6">
                 <span className="material-symbols-outlined text-4xl text-primary-container">skull</span>
                 <div>
                   <h3 className="font-display-xl text-2xl text-on-surface" style={{ fontFamily: '"Newsreader", serif' }}>The Necropolis</h3>
                   <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest">Zombie Directory</p>
                 </div>
               </div>
               {data?.artifacts?.zombieDir ? (
                 <>
                   <p className="font-code-sm text-sm text-primary-container font-mono truncate mb-2">{data.artifacts.zombieDir.dir}</p>
                   <p className="font-serif italic text-on-surface-variant opacity-80 text-sm leading-relaxed max-w-3xl">
                     A massive graveyard of code. This directory saw explosive historical churn (<span className="text-on-surface">{data.artifacts.zombieDir.historicalChurn} modifications</span>) but has been entirely abandoned, with only <span className="text-on-surface">{data.artifacts.zombieDir.recentCommits} recent touches</span>. A monument to dead features.
                   </p>
                 </>
               ) : (
                 <p className="font-serif italic text-on-surface-variant opacity-50 text-sm">The archive is fully alive. No dead zones detected.</p>
               )}
            </div>
          </div>
        </section>
        )}

        {/* The Guilds (Ownership) */}
        {activeTab === 'GUILDS' && (
        <section className="mb-32 animate-[fadeIn_0.5s_ease-out]">
          <div className="mb-12 border-b border-white/10 pb-4">
            <h2 className="font-display-xl text-3xl text-on-surface" style={{ fontFamily: '"Newsreader", serif' }}>The Guilds</h2>
            <p className="font-label-sm text-xs text-outline tracking-widest uppercase mt-2">Territories and sovereign authors</p>
          </div>
          
          <div className="flex flex-col gap-8">
            {guilds.map(([author, files], idx) => (
              <div key={author} className="glass-case p-8 border border-white/10 bg-transparent backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary-container opacity-30 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-6">
                  <div>
                    <h3 className="font-display-xl text-2xl text-on-surface mb-2 flex items-center gap-3" style={{ fontFamily: '"Newsreader", serif' }}>
                      <span className="material-symbols-outlined text-primary-container">person</span>
                      {author}
                    </h3>
                    <p className="font-code-sm text-xs text-on-surface-variant font-mono">
                      Sovereign over {files.length} major artifacts
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {files.slice(0, 6).map(file => (
                    <div key={file.file} className="bg-white/5 p-4 border border-white/5 hover:border-primary-container/30 transition-colors">
                      <p className="font-code-sm text-xs text-primary-container font-mono truncate mb-2">{file.file}</p>
                      <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-primary-container h-full" style={{ width: `${file.concentration}%` }}></div>
                      </div>
                      <p className="font-label-sm text-[9px] text-outline uppercase tracking-widest mt-2 text-right">{Math.round(file.concentration)}% Ownership Control</p>
                    </div>
                  ))}
                  {files.length > 6 && (
                    <div className="bg-transparent p-4 flex items-center justify-center border border-dashed border-white/10">
                      <p className="font-serif italic text-sm text-on-surface-variant opacity-60">+ {files.length - 6} more artifacts in their domain</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {guilds.length === 0 && (
              <p className="text-on-surface-variant font-serif italic text-lg text-center mt-12">No sovereign territories established.</p>
            )}
          </div>
        </section>
        )}

        {/* The Entanglement (Co-change) */}
        {activeTab === 'ENTANGLEMENT' && (
        <section className="mb-32 animate-[fadeIn_0.5s_ease-out]">
          <div className="mb-12 border-b border-white/10 pb-4">
            <h2 className="font-display-xl text-3xl text-on-surface" style={{ fontFamily: '"Newsreader", serif' }}>The Entanglement</h2>
            <p className="font-label-sm text-xs text-outline tracking-widest uppercase mt-2">Quantum coupling: Artifacts inextricably linked in history</p>
          </div>
          
          <div className="flex flex-col gap-6">
            {data?.cochange?.filePairs?.slice(0, 15).map((pair, idx) => (
              <div key={`${pair.fileA}-${pair.fileB}`} className="glass-case p-6 border border-white/10 bg-transparent backdrop-blur-md relative overflow-hidden group hover:bg-white/5 transition-colors">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  
                  {/* File A */}
                  <div className="w-full md:w-2/5 flex flex-col items-start">
                    <span className="material-symbols-outlined text-primary-container/50 mb-2">description</span>
                    <p className="font-code-sm text-xs text-on-surface-variant font-mono truncate w-full" title={pair.fileA}>{pair.fileA}</p>
                  </div>

                  {/* Bond / Gravity */}
                  <div className="w-full md:w-1/5 flex flex-col items-center justify-center relative">
                    <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-30 group-hover:opacity-100 transition-opacity"></div>
                    <div className="bg-background border border-primary-container/30 px-4 py-2 rounded-full z-10 flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.1)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-shadow">
                      <span className="material-symbols-outlined text-[14px] text-primary-container group-hover:animate-spin">sync</span>
                      <span className="font-display-xl text-xl text-primary-container" style={{ fontFamily: '"Newsreader", serif' }}>{pair.count}</span>
                    </div>
                    <p className="font-label-sm text-[8px] text-outline uppercase tracking-widest mt-3 text-center">Co-mutations</p>
                  </div>

                  {/* File B */}
                  <div className="w-full md:w-2/5 flex flex-col items-end text-right">
                    <span className="material-symbols-outlined text-secondary/50 mb-2">description</span>
                    <p className="font-code-sm text-xs text-on-surface-variant font-mono truncate w-full" title={pair.fileB}>{pair.fileB}</p>
                  </div>

                </div>
              </div>
            ))}
            
            {(!data?.cochange?.filePairs || data.cochange.filePairs.length === 0) && (
              <p className="text-on-surface-variant font-serif italic text-lg text-center mt-12">No significant entanglements detected.</p>
            )}
          </div>
        </section>
        )}

        {/* The Confessional (Developer Psychology) */}
        {activeTab === 'CONFESSIONAL' && (
        <section className="mb-32 animate-[fadeIn_0.5s_ease-out]">
          <div className="mb-12 border-b border-white/10 pb-4">
            <h2 className="font-display-xl text-3xl text-on-surface" style={{ fontFamily: '"Newsreader", serif' }}>The Confessional</h2>
            <p className="font-label-sm text-xs text-outline tracking-widest uppercase mt-2">Circadian rhythms and psychological tolls</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Midnight Oil */}
            <div className="glass-case p-8 border border-white/10 bg-transparent backdrop-blur-md hover:bg-white/5 transition-colors duration-500 text-center">
               <span className="material-symbols-outlined text-5xl text-primary-container mb-4 opacity-80">routine</span>
               <h3 className="font-display-xl text-4xl text-on-surface mb-2" style={{ fontFamily: '"Newsreader", serif' }}>{data?.confessional?.midnightOil || 0}</h3>
               <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest mb-4">Midnight Oil</p>
               <p className="font-serif italic text-on-surface-variant opacity-80 text-sm">
                 Commits executed between Midnight and 4 AM. The silent hours where logic defies sleep.
               </p>
            </div>

            {/* Weekend Warriors */}
            <div className="glass-case p-8 border border-white/10 bg-transparent backdrop-blur-md hover:bg-white/5 transition-colors duration-500 text-center">
               <span className="material-symbols-outlined text-5xl text-primary-container mb-4 opacity-80">weekend</span>
               <h3 className="font-display-xl text-4xl text-on-surface mb-2" style={{ fontFamily: '"Newsreader", serif' }}>{data?.confessional?.weekendWarriors || 0}</h3>
               <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest mb-4">Weekend Commitments</p>
               <p className="font-serif italic text-on-surface-variant opacity-80 text-sm">
                 Saturdays and Sundays sacrificed to the archive. The unending march of progress.
               </p>
            </div>

            {/* Swear Count */}
            <div className="glass-case p-8 border border-white/10 bg-transparent backdrop-blur-md hover:bg-white/5 transition-colors duration-500 text-center">
               <span className="material-symbols-outlined text-5xl text-primary-container mb-4 opacity-80">mood_bad</span>
               <h3 className="font-display-xl text-4xl text-on-surface mb-2" style={{ fontFamily: '"Newsreader", serif' }}>{data?.confessional?.swearCount || 0}</h3>
               <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest mb-4">Profanity Events</p>
               <p className="font-serif italic text-on-surface-variant opacity-80 text-sm">
                 Raw frustration permanently etched into the repository ledger. 
               </p>
            </div>

            {/* Panic Count */}
            <div className="glass-case p-8 border border-white/10 bg-transparent backdrop-blur-md hover:bg-white/5 transition-colors duration-500 text-center">
               <span className="material-symbols-outlined text-5xl text-primary-container mb-4 opacity-80">warning</span>
               <h3 className="font-display-xl text-4xl text-on-surface mb-2" style={{ fontFamily: '"Newsreader", serif' }}>{data?.confessional?.panicCount || 0}</h3>
               <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest mb-4">Panic & Hotfixes</p>
               <p className="font-serif italic text-on-surface-variant opacity-80 text-sm">
                 "Urgent", "Hotfix", "Oops". Moments of sheer terror, frozen in time forever.
               </p>
            </div>

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
