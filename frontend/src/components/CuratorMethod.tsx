import React from 'react';

export default function CuratorMethod() {
  return (
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
  );
}
