export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  rating: number;
  reviewCount?: number;
  slug?: string;
  stockStatus?: "in-stock" | "out-of-stock" | "low-stock";
  /** 'pos' = synced from the POS system, 'website' = created manually in the admin panel. */
  source?: "pos" | "website";
  /** False when no price is set — hide Buy Now/Add to Cart, show only "Order on WhatsApp". */
  hasPrice?: boolean;
};

const baseProducts: Product[] = [
  {
    id: 1,
    name: "Synthetic Engine Oil 5W-30",
    category: "Engine Oil",
    price: 2800,
    image: "/images/placeholders/product.svg",
    badge: "Engine Oil",
    rating: 5,
    slug: "synthetic-engine-oil",
    stockStatus: "in-stock",
  },
  {
    id: 2,
    name: "Premium Brake Pad Set",
    category: "Brake Shoe",
    price: 4500,
    image: "/images/placeholders/product.svg",
    badge: "Brake Shoe",
    rating: 5,
    slug: "premium-brake-pad",
    stockStatus: "in-stock",
  },
  {
    id: 3,
    name: "High-Flow Air Filter",
    category: "Filters",
    price: 1800,
    oldPrice: 2200,
    image: "/images/placeholders/product.svg",
    badge: "Filters",
    rating: 5,
    slug: "high-flow-air-filter",
    stockStatus: "low-stock",
  },
  {
    id: 4,
    name: "LED Headlight Assembly",
    category: "Lighting",
    price: 6200,
    image: "/images/placeholders/product.svg",
    badge: "Lighting",
    rating: 4,
    slug: "led-headlight",
    stockStatus: "in-stock",
  },
  {
    id: 5,
    name: "Denso Spark Plug VFKBH",
    category: "Spark Plug",
    price: 8000,
    image: "/images/placeholders/product.svg",
    badge: "Spark Plug",
    rating: 5,
    slug: "denso-spark-plug-vfkbh",
    stockStatus: "out-of-stock",
  },
  {
    id: 6,
    name: "Heavy-Duty Oil Filter",
    category: "Filters",
    price: 1200,
    image: "/images/placeholders/product.svg",
    badge: "Filters",
    rating: 4,
    slug: "heavy-duty-oil-filter",
    stockStatus: "in-stock",
  },
  {
    id: 7,
    name: "Ceramic Clutch Kit",
    category: "Transmission",
    price: 12500,
    oldPrice: 14000,
    image: "/images/placeholders/product.svg",
    badge: "Transmission",
    rating: 5,
    slug: "ceramic-clutch-kit",
    stockStatus: "in-stock",
  },
  {
    id: 8,
    name: "Shock Absorber Pair",
    category: "Suspension",
    price: 9800,
    image: "/images/placeholders/product.svg",
    badge: "Suspension",
    rating: 4,
    slug: "shock-absorber-pair",
    stockStatus: "in-stock",
  },
];

export const featuredProducts = baseProducts;
export const bestSellerProducts = baseProducts;
export const newArrivalProducts = [...baseProducts.slice(2), ...baseProducts.slice(0, 2)];
export const discountedProducts = baseProducts.filter((p) => p.oldPrice);
export const featuredTabProducts = [...baseProducts].reverse();
export const onSaleProducts = discountedProducts;
export const popularProducts = featuredTabProducts;

export const brakeShoeProducts: Product[] = Array.from({ length: 15 }, (_, i) => ({
  id: 100 + i,
  name: `Brake Shoe Part ${i + 1}`,
  category: "Brake Shoe Collection",
  price: 3000,
  image: "/images/placeholders/product.svg",
  badge: "Brake Shoe Collection",
  rating: 5,
  slug: `brake-shoe-${i + 1}`,
  stockStatus: "in-stock" as const,
}));

export const relatedProducts: Product[] = [
  { ...baseProducts[0], stockStatus: "out-of-stock" },
  { ...baseProducts[1], stockStatus: "in-stock" },
  { ...baseProducts[2], stockStatus: "low-stock" },
];

export function getProductBySlug(slug: string): Product | undefined {
  return baseProducts.find((p) => p.slug === slug) ?? baseProducts[4];
}
