"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type MapStore = {
  id: number;
  name: string;
  x: number;
  y: number;
  open: boolean;
};

type BangladeshMap3DProps = {
  stores: MapStore[];
  activeStoreId: number;
  onStoreSelect: (id: number) => void;
  closestLabel?: string;
};

const MAP_PATH =
  "M 198 18 C 228 22 258 38 278 62 C 298 86 312 118 318 152 C 324 186 328 218 332 252 C 336 286 342 318 348 348 C 354 378 358 402 352 424 C 346 446 328 458 306 462 C 284 466 262 458 244 446 C 226 434 212 416 198 398 C 184 380 168 362 148 352 C 128 342 108 338 92 328 C 76 318 68 302 72 284 C 76 266 88 248 102 232 C 116 216 128 198 138 178 C 148 158 158 136 168 114 C 178 92 186 68 198 18 Z";

const RIVER_PATHS = [
  "M 120 280 C 160 270 200 275 240 268 C 280 261 310 255 340 248",
  "M 145 180 C 185 190 225 185 265 192 C 305 199 330 205 355 210",
  "M 95 320 C 130 310 170 315 210 308 C 250 301 290 295 330 288",
];

export function BangladeshMap3D({
  stores,
  activeStoreId,
  onStoreSelect,
  closestLabel = "Closest to You: Dhaka Central Hub (2.4km)",
}: BangladeshMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [hoveredStore, setHoveredStore] = useState<number | null>(null);
  const [tiltEnabled, setTiltEnabled] = useState(false);

  useEffect(() => {
    setTiltEnabled(!window.matchMedia("(hover: none)").matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tiltEnabled || !containerRef.current || !mapRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / rect.height) * -15;
    const rotateY = ((e.clientX - centerX) / rect.width) * 15;
    mapRef.current.style.transition = "transform 0.15s ease-out";
    mapRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    if (!tiltEnabled || !mapRef.current) return;
    mapRef.current.style.transition = "transform 0.4s ease";
    mapRef.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-[400px] w-full"
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={mapRef}
        className="flex h-full min-h-[400px] w-full items-center justify-center will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg
          viewBox="0 0 400 480"
          className="h-full w-full max-h-[520px]"
          style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))" }}
          aria-label="Interactive map of Bangladesh"
        >
          <path d={MAP_PATH} fill="#1a5c38" />
          {RIVER_PATHS.map((d) => (
            <path key={d} d={d} fill="none" stroke="#2d7a50" strokeWidth="2.5" strokeOpacity="0.65" strokeLinecap="round" />
          ))}
          {stores.map((store) => {
            const isActive = activeStoreId === store.id;
            const isHovered = hoveredStore === store.id;
            const pinColor = store.open ? "#2563EB" : "#ef4444";

            return (
              <g
                key={store.id}
                className="cursor-pointer"
                onClick={() => onStoreSelect(store.id)}
                onMouseEnter={() => setHoveredStore(store.id)}
                onMouseLeave={() => setHoveredStore(null)}
              >
                <circle cx={store.x} cy={store.y} r="14" fill={pinColor} opacity="0.25">
                  <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle
                  cx={store.x}
                  cy={store.y}
                  r={isActive ? 9 : 7}
                  fill={pinColor}
                  stroke="white"
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />
                {(isHovered || isActive) && (
                  <foreignObject x={store.x - 70} y={store.y - 52} width="140" height="44">
                    <div className="rounded-lg bg-white px-2.5 py-1.5 text-center text-[10px] font-semibold text-[#111827] shadow-md">
                      {store.name}
                      <span className={cn("ml-1", store.open ? "text-[#22c55e]" : "text-[#ef4444]")}>
                        · {store.open ? "Open" : "Closed"}
                      </span>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="absolute bottom-4 left-4 flex gap-1">
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded bg-white text-[14px] font-bold shadow"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded bg-white text-[14px] font-bold shadow"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-[#111827] shadow-md">
        <span aria-hidden>📍</span>
        {closestLabel}
      </div>

    </div>
  );
}
