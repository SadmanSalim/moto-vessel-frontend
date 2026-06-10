import { ProductCard } from "./ProductCard";
import { SectionHeading } from "./SectionHeading";
import type { Product } from "@/data/products";

type ProductSectionProps = {
  title: string;
  subtitle: string;
  eyebrow: string;
  products: Product[];
  className?: string;
};

export function ProductSection({ title, subtitle, eyebrow, products, className }: ProductSectionProps) {
  return (
    <section className={`mx-auto w-full max-w-[1240px] px-4 py-12 md:px-6 ${className ?? ""}`}>
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {products.map((product) => (
          <ProductCard key={`${title}-${product.id}`} product={product} />
        ))}
      </div>
    </section>
  );
}
