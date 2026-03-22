"use client";

const STYLES = [
  {
    id: "cinematic",
    label: "Cinematic",
    emoji: "🎬",
    description: "Dramatic lighting, film grain",
    selectedCardClass: "border-[#94a3b8] shadow-[0_0_20px_rgba(148,163,184,0.3),0_4px_16px_rgba(0,0,0,0.4)] -translate-y-[2px] scale-[1.02]",
    dotClass: "bg-[#94a3b8]",
    textClass: "text-[#94a3b8]",
  },
  {
    id: "anime",
    label: "Anime",
    emoji: "✨",
    description: "Vibrant, cel-shaded illustration",
    selectedCardClass: "border-[#f472b6] shadow-[0_0_20px_rgba(244,114,182,0.35),0_4px_16px_rgba(0,0,0,0.4)] -translate-y-[2px] scale-[1.02]",
    dotClass: "bg-[#f472b6]",
    textClass: "text-[#f472b6]",
  },
  {
    id: "realistic",
    label: "Realistic",
    emoji: "📷",
    description: "Photorealistic, 8K detail",
    selectedCardClass: "border-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.3),0_4px_16px_rgba(0,0,0,0.4)] -translate-y-[2px] scale-[1.02]",
    dotClass: "bg-[#38bdf8]",
    textClass: "text-[#38bdf8]",
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    emoji: "⚡",
    description: "Neon lights, futuristic city",
    selectedCardClass: "border-[#a78bfa] shadow-[0_0_20px_rgba(139,92,246,0.4),0_4px_16px_rgba(0,0,0,0.4)] -translate-y-[2px] scale-[1.02]",
    dotClass: "bg-[#a78bfa]",
    textClass: "text-[#a78bfa]",
  },
  {
    id: "oil painting",
    label: "Oil Painting",
    emoji: "🎨",
    description: "Textured brush strokes, classical",
    selectedCardClass: "border-[#fbbf24] shadow-[0_0_20px_rgba(251,191,36,0.3),0_4px_16px_rgba(0,0,0,0.4)] -translate-y-[2px] scale-[1.02]",
    dotClass: "bg-[#fbbf24]",
    textClass: "text-[#fbbf24]",
  },
  {
    id: "fantasy",
    label: "Fantasy",
    emoji: "🔮",
    description: "Magical, epic atmosphere",
    selectedCardClass: "border-[#34d399] shadow-[0_0_20px_rgba(52,211,153,0.3),0_4px_16px_rgba(0,0,0,0.4)] -translate-y-[2px] scale-[1.02]",
    dotClass: "bg-[#34d399]",
    textClass: "text-[#34d399]",
  },
];

interface StyleSelectorProps {
  selectedStyle: string;
  onSelect: (style: string) => void;
}

export default function StyleSelector({
  selectedStyle,
  onSelect,
}: StyleSelectorProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
        Art Style
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <button
              key={style.id}
              id={`style-${style.id.replace(/\s+/g, "-")}`}
              onClick={() => onSelect(style.id)}
              aria-label={`Select ${style.label} style`}
              className={`glass glass-hover relative rounded-2xl p-4 text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-purple)] ${isSelected ? style.selectedCardClass : ""}`}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div
                  className={`absolute top-2 right-2 w-2 h-2 rounded-full ${style.dotClass}`}
                />
              )}

              <div className="text-2xl mb-2">{style.emoji}</div>
              <div
                className={`text-sm font-semibold leading-tight ${isSelected ? style.textClass : "text-[var(--text-primary)]"}`}
              >
                {style.label}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1 leading-snug hidden sm:block">
                {style.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
