import { Link } from "react-router-dom";
import { Heart, Star, ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart, useWishlist } from "@/store/usePersonalisation";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

export default function ProductCard({ product, compact }: { product: Product; compact?: boolean }) {
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const wished = has(product.id);

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add(product.id, 1);
    toast.success(`Added ${product.name.split(" ").slice(0, 4).join(" ")}…`, {
      description: `SKU ${product.sku}`,
      action: { label: "View cart", onClick: () => (window.location.href = "/cart") },
    });
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all hover:shadow-card-hover hover:border-primary/30"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
        {product.badges?.[0] && (
          <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground hover:bg-accent">
            {product.badges[0]}
          </Badge>
        )}
        {product.listPrice && (
          <Badge variant="outline" className="absolute right-3 top-3 bg-card border-success text-success">
            Save ${(product.listPrice - product.price).toFixed(0)}
          </Badge>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
            toast(wished ? "Removed from wishlist" : "Added to wishlist");
          }}
          className={cn(
            "absolute bottom-3 right-3 h-9 w-9 rounded-full grid place-items-center border bg-card transition-colors",
            wished ? "border-accent text-accent" : "border-border text-muted-foreground hover:text-accent"
          )}
          aria-label="Toggle wishlist"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-current")} />
        </button>
      </div>

      <div className={cn("flex flex-1 flex-col gap-2 p-4", compact && "p-3 gap-1.5")}>
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>{product.brand}</span>
          <span className="font-mono">{product.sku}</span>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn("h-3 w-3", i < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted")}
              />
            ))}
          </div>
          <span>({product.reviews})</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-semibold text-foreground tabular-nums">${product.price.toFixed(2)}</span>
              {product.listPrice && (
                <span className="text-xs text-muted-foreground line-through tabular-nums">${product.listPrice.toFixed(2)}</span>
              )}
            </div>
            <div className="text-[11px] text-muted-foreground">/ {product.uom}</div>
          </div>
          <span className={product.stock === "low" ? "badge-low" : "badge-stock"}>
            {product.stock === "low" ? "Low stock" : <><Check className="h-3 w-3" /> In stock</>}
          </span>
        </div>
        <Button onClick={onAdd} size="sm" className="mt-2 w-full bg-primary hover:bg-primary-hover">
          <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
        </Button>
      </div>
    </Link>
  );
}
