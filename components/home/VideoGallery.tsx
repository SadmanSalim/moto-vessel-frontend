import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { videos } from "@/data/videos";

export function VideoGallery() {
  const [main, ...rest] = videos;

  return (
    <section className="bg-white py-12 md:py-14" aria-labelledby="video-heading">
      <div className="mv-container">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 id="video-heading" className="section-title">
            Video Gallery
          </h2>
          <Link href="#" className="shrink-0 text-[13px] font-semibold text-mv-primary transition hover:underline">
            View All →
          </Link>
        </div>

        <div className="relative mb-5 flex justify-center gap-4 md:mb-6 md:gap-6">
          <div className="relative z-10 h-[72px] w-[100px] overflow-hidden rounded-lg shadow-md md:h-[88px] md:w-[120px]">
            <Image src="/images/placeholders/video.svg" alt="" fill className="object-cover" aria-hidden />
          </div>
          <div className="relative z-10 -mt-2 h-[72px] w-[130px] overflow-hidden rounded-lg shadow-md md:-mt-3 md:h-[88px] md:w-[160px]">
            <Image src="/images/placeholders/hero.svg" alt="" fill className="object-cover" aria-hidden />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1.15fr_1fr] md:gap-4">
          <VideoCard video={main} large />
          <div className="grid gap-3 md:gap-4">
            {rest.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoCard({
  video,
  large = false,
}: {
  video: (typeof videos)[number];
  large?: boolean;
}) {
  return (
    <button
      type="button"
      className={`group relative w-full overflow-hidden rounded-[12px] bg-mv-navy text-left ${
        large ? "min-h-[200px] md:min-h-[280px]" : "min-h-[130px] md:min-h-[132px]"
      }`}
      aria-label={`Play video: ${video.title}`}
    >
      <Image src={video.thumbnail} alt="" fill className="object-cover opacity-30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-mv-navy/70 transition group-hover:bg-mv-navy/60">
        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-white/40 bg-white/15 backdrop-blur transition group-hover:scale-105 group-hover:bg-white/25">
          <Play size={20} className="ml-0.5 fill-white text-white" />
        </span>
        {large ? (
          <>
            <p className="mt-3 text-center text-[13px] font-semibold text-white">{video.title}</p>
            <p className="mt-0.5 text-[11px] text-white/60">{video.duration}</p>
          </>
        ) : null}
      </div>
    </button>
  );
}
