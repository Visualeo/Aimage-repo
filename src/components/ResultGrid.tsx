"use client";

import { GeneratedImage } from "@/app/page";
import ImageCard from "./ImageCard";

interface ResultGridProps {
  images: GeneratedImage[];
  isGenerating: boolean;
}

function SkeletonCard() {
  return (
    <div className="masonry-item">
      <div
        className="glass rounded-2xl overflow-hidden border border-[var(--border-subtle)] aspect-square"
      >
        <div className="skeleton w-full h-full min-h-[250px]" />
        <div className="p-3 flex gap-2">
          <div className="skeleton h-4 w-16 rounded-full" />
          <div className="skeleton h-4 flex-1 rounded" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24">
      <div
        className="w-20 h-20 rounded-3xl glass flex items-center justify-center mx-auto mb-5 animate-[float_4s_ease-in-out_infinite]"
      >
        <svg
          className="w-10 h-10 text-[var(--text-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5M12 3v6m0 0l-3-3m3 3l3-3"
          />
        </svg>
      </div>
      <h3 className="text-[var(--text-secondary)] text-base font-medium mb-2">
        Your canvas is empty
      </h3>
      <p className="text-[var(--text-muted)] text-sm max-w-xs mx-auto">
        Describe an image above and hit Generate to bring your vision to life.
      </p>
    </div>
  );
}

export default function ResultGrid({ images, isGenerating }: ResultGridProps) {
  const showEmpty = images.length === 0 && !isGenerating;

  return (
    <section className="mt-14" aria-label="Generated images">
      {!showEmpty && (
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-lg font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]"
          >
            {isGenerating
              ? "Generating…"
              : `${images.length} image${images.length === 1 ? "" : "s"} created`}
          </h2>
          {images.length > 0 && (
            <span className="text-sm text-[var(--text-muted)]">
              Hover to download
            </span>
          )}
        </div>
      )}

      {showEmpty ? (
        <EmptyState />
      ) : (
        <div className="masonry-grid" id="results-grid">
          {isGenerating && <SkeletonCard />}
          {images.map((img) => (
            <ImageCard
              key={img.id}
              url={img.url}
              prompt={img.prompt}
              style={img.style}
            />
          ))}
        </div>
      )}
    </section>
  );
}
