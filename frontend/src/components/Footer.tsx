import React from 'react';

export default function Footer() {
  return (
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
  );
}
