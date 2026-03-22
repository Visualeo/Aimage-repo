"use client";

import { useRef, KeyboardEvent } from "react";

interface PromptInputProps {
  prompt: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const MAX_CHARS = 500;

export default function PromptInput({
  prompt,
  onChange,
  onGenerate,
  isGenerating,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (!isGenerating && prompt.trim()) onGenerate();
    }
  };

  const charCount = prompt.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canGenerate = prompt.trim().length > 0 && !isGenerating && !isOverLimit;

  return (
    <div className="glass rounded-2xl p-1.5 transition-all duration-300 focus-within:border-[var(--border-glow)]">
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="prompt-input"
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the image you want to create..."
          rows={3}
          aria-label="Image prompt"
          className="w-full bg-transparent px-5 pt-4 pb-2 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-base resize-none outline-none leading-relaxed"
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-4 pb-3 pt-1 gap-4">
          <div className="flex items-center gap-3">
            {/* Char count */}
            <span
              className={`text-xs transition-colors ${
                isOverLimit
                  ? "text-red-400"
                  : charCount > MAX_CHARS * 0.8
                  ? "text-amber-400"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {charCount}/{MAX_CHARS}
            </span>
            <span className="hidden sm:block text-[var(--text-muted)] text-xs">
              Ctrl+Enter to generate
            </span>
          </div>

          <button
            id="generate-button"
            onClick={onGenerate}
            disabled={!canGenerate}
            className="btn-primary relative z-10 flex items-center gap-2.5 px-7 py-2.5 rounded-xl text-sm font-semibold tracking-wide"
          >
            {isGenerating ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>Generating…</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                  />
                </svg>
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
