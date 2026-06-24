import Image from "next/image";

export function AuthLeftPanel() {
  return (
    <>
      {/* Mobile banner */}
      <section
        className="relative flex h-[200px] flex-col justify-center overflow-hidden px-6 lg:hidden"
        style={{
          background: "linear-gradient(135deg, #0d1117 0%, #1a2332 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent, transparent 24px, rgba(37,99,235,0.06) 24px, rgba(37,99,235,0.06) 25px)",
          }}
          aria-hidden
        />
        <div className="relative">
          <Image
            src="/images/logo.png"
            alt="MotoVessel"
            width={140}
            height={40}
            className="h-auto w-[120px] brightness-0 invert"
            priority
          />
          <p className="mt-3 max-w-[280px] text-[14px] leading-snug text-white/80">
            Redefining the <span className="font-semibold text-[#2563EB]">Digital Cockpit</span> experience.
          </p>
        </div>
      </section>

      {/* Desktop panel */}
      <section
        className="relative hidden overflow-hidden px-8 py-10 lg:flex lg:flex-col lg:justify-between xl:px-14"
        style={{
          background: "linear-gradient(135deg, #0d1117 0%, #1a2332 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent, transparent 28px, rgba(37,99,235,0.05) 28px, rgba(37,99,235,0.05) 29px), linear-gradient(160deg, rgba(37,99,235,0.08) 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative pt-8">
          <Image
            src="/images/logo.png"
            alt="MotoVessel"
            width={160}
            height={44}
            className="h-auto w-[140px] brightness-0 invert"
            priority
          />
          <h1 className="mt-10 max-w-[430px] text-[38px] font-extrabold leading-[1.1] text-white xl:text-[40px]">
            Redefining the <span className="text-[#2563EB]">Digital Cockpit</span> experience.
          </h1>
          <p className="mt-5 max-w-[420px] text-[15px] italic leading-relaxed text-[#9CA3AF]">
            Access your personalized fleet dashboard, real-time performance telemetry, and exclusive engineering
            insights.
          </p>
          <div className="mt-12 flex gap-10">
            <div>
              <p className="text-[32px] font-extrabold text-white">0.18s</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
                Latency Response
              </p>
            </div>
            <div>
              <p className="text-[32px] font-extrabold text-white">256-bit</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
                Encrypted Tunnel
              </p>
            </div>
          </div>
        </div>
        <div className="relative font-mono text-[9px] uppercase tracking-[0.25em] text-[#4B5563]">
          <p>Protocol Active</p>
          <p className="mt-1">Est. 2024 Precision Unit</p>
        </div>
      </section>
    </>
  );
}
