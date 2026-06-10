import type { LucideIcon } from "lucide-react";
import { Battery, CircleDot, Cog, Disc, Droplets, Filter, Lightbulb, Wrench } from "lucide-react";

export type CategoryItem = {
  id: number;
  name: string;
  icon: LucideIcon;
};

export const categories: CategoryItem[] = [
  { id: 1, name: "Engine Oil", icon: Droplets },
  { id: 2, name: "Brakes", icon: Disc },
  { id: 3, name: "Suspension", icon: Wrench },
  { id: 4, name: "Lighting", icon: Lightbulb },
  { id: 5, name: "Filters", icon: Filter },
  { id: 6, name: "Battery", icon: Battery },
  { id: 7, name: "Tires", icon: CircleDot },
  { id: 8, name: "Engine", icon: Cog },
];
