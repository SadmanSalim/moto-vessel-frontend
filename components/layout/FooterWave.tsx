type FooterWaveProps = {
  className?: string;
};

/**
 * Shallow symmetrical convex arc — seamless transition from page content into footer.
 * Elliptical SVG arc: peak at horizontal center, edges taper to sides (reference match).
 */
export function FooterWave({ className = "" }: FooterWaveProps) {
  return (
    <div
      className={`pointer-events-none relative -mt-[44px] w-full overflow-hidden leading-[0] sm:-mt-[52px] md:-mt-[60px] lg:-mt-[68px] ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        className="block h-[44px] w-full sm:h-[52px] md:h-[60px] lg:h-[68px]"
      >
        {/*
          Elliptical arc: edges at y=74, rx=720 ry=36 → peak at y=38 (center).
          Single smooth dome — no multi-peak ripples.
        */}
        <path
          d="M0,100 L0,74 A720,36 0 0 1 1440,74 L1440,100 Z"
          fill="var(--mv-navy)"
        />
      </svg>
    </div>
  );
}
