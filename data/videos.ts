export type VideoItem = {
  id: number;
  title: string;
  src: string;
};

// Real promo videos — files live in public/images/promo-video/.
// Thumbnails are generated client-side from the first frame (no static
// poster images needed) and duration is read from the video's own metadata
// once it loads, so this list only needs a title + source path per video.
export const videos: VideoItem[] = [
  {
    id: 1,
    title: "MotoVessel Promo Video 1",
    src: "/images/promo-video/hf_20260621_203009_fa16814b-7106-48eb-a3b5-25532e87adc4.mp4",
  },
  {
    id: 2,
    title: "MotoVessel Promo Video 2",
    src: "/images/promo-video/hf_20260711_083131_91488582-88ba-4cd6-9f11-8d460251f20f.mp4",
  },
  {
    id: 3,
    title: "MotoVessel Promo Video 3",
    src: "/images/promo-video/hf_20260713_035854_48455437-1ca5-4fa4-acb3-18d912bf3bb9.mp4",
  },
  {
    id: 4,
    title: "MotoVessel Promo Video 4",
    src: "/images/promo-video/hf_20260713_081709_f59d8259-22f0-4fae-ad0c-05b69fb5097a.mp4",
  },
  {
    id: 5,
    title: "MotoVessel Promo Video 5",
    src: "/images/promo-video/hf_20260713_130616_c06e462d-a643-4b8a-91ea-0e3c3f1c473f.mp4",
  },
];
