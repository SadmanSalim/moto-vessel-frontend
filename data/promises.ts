import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Headphones, Package, RefreshCw, ShieldCheck, Truck } from "lucide-react";

export type PromiseItem = {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const brandPromises: PromiseItem[] = [
  { id: 1, title: "Genuine Parts", description: "OEM & certified aftermarket", icon: BadgeCheck },
  { id: 2, title: "Same Day Delivery", description: "Fast nationwide shipping", icon: Truck },
  { id: 3, title: "Expert Support", description: "24/7 automotive specialists", icon: Headphones },
  { id: 4, title: "30 Days Return", description: "Hassle-free returns policy", icon: RefreshCw },
  { id: 5, title: "SSL Secure", description: "Encrypted checkout protection", icon: ShieldCheck },
  { id: 6, title: "SSL Secure", description: "Damage-free secure packaging", icon: Package },
];
