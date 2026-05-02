import React from 'react';

interface ErrorDisplayProps {
  errorMsg: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ errorMsg, onRetry }: ErrorDisplayProps) {
  return (
    <section className="w-full max-w-3xl flex flex-col items-center text-center mt-20 mb-32 relative animate-[fadeIn_1s_ease-in]">
      <div className="w-full p-8 border border-red-900/50 bg-red-950/20 backdrop-blur-md text-red-200">
        <span className="material-symbols-outlined text-red-500 mb-4" style={{ fontSize: '48px' }}>error</span>
        <h2 className="font-display-xl text-3xl mb-4" style={{ fontFamily: '"Newsreader", serif' }}>Exhibition Failed</h2>
        <p className="font-code-sm text-code-sm text-red-300/80 mb-8 whitespace-pre-wrap">{errorMsg}</p>
        <button 
          onClick={onRetry} 
          className="font-label-sm text-label-sm uppercase bg-red-900/40 text-red-200 px-8 py-3 tracking-widest hover:bg-red-900/60 transition-colors border border-red-900/50"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}
