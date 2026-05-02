import React, { useState } from 'react';

interface DropzoneProps {
  onDataLoaded: (parsedJson: any) => void;
}

export default function Dropzone({ onDataLoaded }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMsg('');

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setErrorMsg('Invalid dossier.json file. Please upload a valid JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsedJson = JSON.parse(text);
        if (!parsedJson || !parsedJson.repo || !parsedJson.summary) {
           setErrorMsg('Invalid dossier structure. Please upload a valid RepoMuseum dossier.');
           return;
        }
        onDataLoaded(parsedJson);
      } catch (err) {
        setErrorMsg('Invalid JSON file format. Could not parse dossier.');
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read the file.');
    };
    reader.readAsText(file);
  };

  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setErrorMsg('');
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const parsedJson = JSON.parse(text);
          if (!parsedJson || !parsedJson.repo || !parsedJson.summary) {
             setErrorMsg('Invalid dossier structure. Please upload a valid RepoMuseum dossier.');
             return;
          }
          onDataLoaded(parsedJson);
        } catch (err) {
          setErrorMsg('Invalid JSON file format. Could not parse dossier.');
        }
      };
      reader.onerror = () => {
        setErrorMsg('Failed to read the file.');
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="w-full mt-12 flex flex-col items-center">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`w-full max-w-lg p-12 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group
          ${isDragging 
            ? 'border-primary-container bg-primary-container/10 scale-105' 
            : 'border-white/10 bg-black/40 hover:border-primary-container/50 hover:bg-white/5'
          }
        `}
      >
        <div className="absolute inset-0 spotlight opacity-20 group-hover:opacity-100 transition-opacity pointer-events-none z-0"></div>
        <span className={`material-symbols-outlined text-4xl mb-4 transition-colors duration-300 ${isDragging ? 'text-primary-container' : 'text-stone-500 group-hover:text-primary-container'}`}>
          upload_file
        </span>
        <h3 className={`font-serif tracking-widest uppercase text-sm transition-colors duration-300 ${isDragging ? 'text-primary-container' : 'text-stone-400 group-hover:text-stone-200'}`}>
          Upload JSON Dossier
        </h3>
        <p className="font-serif italic text-xs text-stone-600 mt-2 text-center">
          {isDragging ? 'Drop it here...' : 'Drag and drop your dossier.json here, or click to browse.'}
        </p>
      </div>
      
      {errorMsg && (
        <div className="mt-4 inline-flex items-center gap-2 border border-red-900/40 bg-red-900/10 px-4 py-1.5 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.1)]">
           <span className="material-symbols-outlined text-[14px] text-red-500">error</span>
           <span className="font-serif text-xs uppercase tracking-widest text-red-400">{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
