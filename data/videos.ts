export type VideoItem = {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
};

export const videos: VideoItem[] = [
  { id: 1, title: "Brake Pad Replacement Guide", duration: "08:12", thumbnail: "/images/placeholders/video.svg" },
  { id: 2, title: "Top 5 Suspension Upgrades", duration: "06:45", thumbnail: "/images/placeholders/video.svg" },
  { id: 3, title: "How To Select Engine Filters", duration: "07:20", thumbnail: "/images/placeholders/video.svg" },
];
