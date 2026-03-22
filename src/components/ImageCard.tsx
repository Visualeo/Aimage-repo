"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageCardProps {
  url: string;
  prompt: string;
  style: string;
}

export default function ImageCard({ url, prompt, style }: ImageCardProps) {
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = prompt;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `aimage-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  return (
    <div className="masonry-item group">
      <div className="glass rounded-2xl overflow-hidden relative transition-all duration-300 hover:border-[rgba(139,92,246,0.3)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-[var(--border-subtle)]"
      >
        {/* Image */}
        <div className="relative w-full aspect-square">
          {!isLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          <Image
            src={url}
            alt={prompt}
            fill
            className={`object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setIsLoaded(true)}
            sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-2">
            <div className="flex gap-2">
              {/* Download */}
              <button
                onClick={handleDownload}
                title="Download image"
                aria-label="Download image"
                className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg px-3 py-2 text-xs font-medium text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>

              {/* Copy prompt */}
              <button
                onClick={handleCopyPrompt}
                title="Copy prompt"
                aria-label="Copy prompt"
                className={`flex-1 flex items-center justify-center gap-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${copied ? "text-[#34d399]" : "text-white"}`}
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Prompt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Style badge */}
        <div className="px-3 py-2 flex items-center gap-2">
          <span className="text-xs glass rounded-full px-2.5 py-0.5 text-[var(--text-muted)] capitalize">
            {style}
          </span>
          <p className="text-xs text-[var(--text-muted)] truncate flex-1">
            {prompt}
          </p>
        </div>
      </div>
    </div>
  );
}
