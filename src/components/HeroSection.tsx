export default function HeroSection() {
  return (
    <section className="pt-20 pb-8 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 text-xs font-medium tracking-wider text-[var(--text-secondary)] uppercase">
        <span
          className="w-2 h-2 rounded-full bg-emerald-400 animate-[glow-pulse_2s_ease-in-out_infinite]"
        />
        Powered by Stable Diffusion XL
      </div>

      {/* Heading */}
      <h1
        className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-5 [font-family:var(--font-display)]"
      >
        Create Anything{" "}
        <span className="block gradient-text">with AI</span>
      </h1>

      {/* Subtitle */}
      <p className="text-[var(--text-secondary)] text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
        Turn your imagination into stunning visuals.
        <br className="hidden sm:block" />
        Just describe what you see in your mind.
      </p>

      {/* Stats row */}
      <div className="mt-10 flex items-center justify-center gap-8 sm:gap-12">
        {[
          { value: "6", label: "Art Styles" },
          { value: "SDXL", label: "AI Model" },
          { value: "1024px", label: "Resolution" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div
              className="text-xl sm:text-2xl font-bold gradient-text [font-family:var(--font-display)]"
            >
              {stat.value}
            </div>
            <div className="text-[var(--text-muted)] text-xs mt-0.5 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
