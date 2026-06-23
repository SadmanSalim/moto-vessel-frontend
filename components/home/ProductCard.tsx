import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
  revealClass?: string;
};

export function ProductCard({ product, revealClass = "" }: ProductCardProps) {
  return (
    <article className={`mv-card mv-card-hover flex h-full flex-col overflow-hidden ${revealClass}`}>
      <Link href={`/products/${product.slug ?? product.id}`} className="relative aspect-[4/3] bg-mv-bg p-5">
        <Image src={product.image} alt={product.name} width={240} height={180} className="h-full w-full object-contain" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="inline-block w-fit rounded-full bg-mv-blue-light px-2.5 py-0.5 text-[10px] font-semibold text-mv-primary">
          {product.category}
        </span>
        <h3 className="mt-2 line-clamp-2 min-h-[40px] text-[13px] font-semibold leading-snug text-mv-text">
          {product.name}
        </h3>
        <p className="mt-2 text-[17px] font-bold text-mv-text">৳{product.price.toLocaleString()}</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-xl border border-mv-primary py-2 text-[12px] font-semibold text-mv-primary transition hover:bg-mv-blue-light"
          >
            Add to Cart
          </button>
          <Link
            href={`/products/${product.slug ?? product.id}`}
            className="flex-1 rounded-xl bg-mv-primary py-2 text-center text-[12px] font-semibold text-white transition hover:bg-mv-primary-dark"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </article>
  );
}
