import ProductCard from "./ProductCard";
import type { Product } from "@/data/products";

export default function ProductRail({
  title,
  eyebrow,
  products,
  empty,
}: {
  title: string;
  eyebrow?: string;
  products: Product[];
  empty?: string;
}) {
  if (products.length === 0 && !empty) return null;
  return (
    <section className="container-pro py-12">
      {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-3xl font-semibold text-foreground">{title}</h2>
      </div>
      {products.length === 0 ? (
        <p className="text-muted-foreground">{empty}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
