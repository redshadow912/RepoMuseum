import React from 'react';

interface LoadingDisplayProps {
  loadingText: string;
}

export default function LoadingDisplay({ loadingText }: LoadingDisplayProps) {
  return (
    <section className="w-full max-w-3xl flex flex-col items-center text-center mt-20 mb-32 relative animate-[fadeIn_1s_ease-in]">
      <div className="mt-12 flex flex-col items-center gap-4 text-primary-fixed-dim">
        <span className="material-symbols-outlined animate-spin" style={{ fontSize: '48px' }}>hourglass_empty</span>
        <p className="font-code-sm text-code-sm italic text-xl mt-4">{loadingText}</p>
        <p className="font-label-sm text-label-sm text-outline-variant uppercase tracking-widest mt-2">Zero-backend execution • Browser memory only</p>
      </div>
    </section>
  );
}
