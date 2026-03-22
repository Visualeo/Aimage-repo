"use client";

import { useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import StyleSelector from "@/components/StyleSelector";
import PromptInput from "@/components/PromptInput";
import ImageUpload from "@/components/ImageUpload";
import ResultGrid from "@/components/ResultGrid";

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  timestamp: number;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selectedStyle,
          imageBase64: referenceImage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Generation failed. Please try again.");
      }

      const newImage: GeneratedImage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        url: data.image,
        prompt: data.prompt ?? prompt,
        style: selectedStyle,
        timestamp: Date.now(),
      };

      setImages((prev) => [newImage, ...prev]);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedStyle, referenceImage, isGenerating]);

  return (
    <main className="relative min-h-screen">
      {/* Animated mesh background */}
      <div className="mesh-bg" aria-hidden="true" />

      {/* Decorative orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-[0.07] bg-[radial-gradient(circle,#8b5cf6_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06] bg-[radial-gradient(circle,#ec4899_0%,transparent_70%)]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <HeroSection />

        {/* Main controls */}
        <div className="mt-10 space-y-6">
          {/* Prompt input */}
          <PromptInput
            prompt={prompt}
            onChange={setPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          {/* Style selector */}
          <StyleSelector
            selectedStyle={selectedStyle}
            onSelect={setSelectedStyle}
          />

          {/* Reference image upload */}
          <ImageUpload
            referenceImage={referenceImage}
            onImageChange={setReferenceImage}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-6 glass rounded-2xl px-5 py-4 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Result grid */}
        <ResultGrid images={images} isGenerating={isGenerating} />

        {/* Footer */}
        <footer className="mt-20 pb-10 text-center text-[var(--text-muted)] text-sm">
          <p>
            Built with{" "}
            <span className="gradient-text font-medium">Hugging Face Flux</span>{" "}
            ·{" "}
            <a
              href="https://huggingface.co"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-secondary)] transition-colors"
            >
              Learn more →
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
