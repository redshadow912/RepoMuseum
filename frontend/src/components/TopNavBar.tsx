import React from 'react';

export default function TopNavBar() {
  return (
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
  );
}
