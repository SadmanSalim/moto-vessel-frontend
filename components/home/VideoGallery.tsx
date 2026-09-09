"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { videos, type VideoItem } from "@/data/videos";

export function VideoGallery() {
  const [main, ...rest] = videos;
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    if (!activeVideo) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveVideo(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  return (
    <section className="bg-white py-12 md:py-14" aria-labelledby="video-heading">
      <div className="mv-container">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 id="video-heading" className="section-title reveal">
            Video Gallery
          </h2>
          <Link href="#" className="shrink-0 text-[13px] font-semibold text-mv-primary transition hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-[1.15fr_1fr] md:gap-4">
          <VideoCard video={main} large onPlay={() => setActiveVideo(main)} />
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {rest.map((video) => (
              <VideoCard key={video.id} video={video} onPlay={() => setActiveVideo(video)} />
            ))}
          </div>
        </div>
      </div>

      {activeVideo ? (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 px-3 py-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveVideo(null);
          }}
        >
          <div className="relative w-full max-w-[900px]">
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close video"
            >
              <X size={18} />
            </button>
            <video
              key={activeVideo.id}
              src={activeVideo.src}
              controls
              autoPlay
              playsInline
              className="max-h-[80vh] w-full rounded-xl bg-black shadow-2xl"
            />
            <p className="mt-3 text-center text-[13px] font-medium text-white/80">{activeVideo.title}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function VideoCard({
  video,
  large = false,
  onPlay,
}: {
  video: VideoItem;
  large?: boolean;
  onPlay: () => void;
}) {
  const [duration, setDuration] = useState<string | null>(null);

  return (
    <button
      type="button"
      onClick={onPlay}
      className={`group relative w-full overflow-hidden rounded-[12px] bg-mv-navy text-left ${
        large ? "min-h-[200px] md:min-h-[280px]" : "min-h-[130px] md:min-h-[132px]"
      }`}
      aria-label={`Play video: ${video.title}`}
    >
      <video
        src={video.src}
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        onLoadedMetadata={(e) => setDuration(formatDuration(e.currentTarget.duration))}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-mv-navy/60 transition group-hover:bg-mv-navy/50">
        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-white/40 bg-white/15 backdrop-blur transition group-hover:scale-105 group-hover:bg-white/25">
          <Play size={20} className="ml-0.5 fill-white text-white" />
        </span>
        {large ? (
          <>
            <p className="mt-3 text-center text-[13px] font-semibold text-white">{video.title}</p>
            {duration ? <p className="mt-0.5 text-[11px] text-white/60">{duration}</p> : null}
          </>
        ) : null}
      </div>
      {!large && duration ? (
        <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
          {duration}
        </span>
      ) : null}
    </button>
  );
}

function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds)) return "";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
