import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import SiteLayout from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { useCart, useWishlist } from "@/store/usePersonalisation";
import ProductRail from "@/components/ProductRail";
import { useRecommended } from "@/store/usePersonalisation";

export default function Wishlist() {
  const { items, remove } = useWishlist();
  const { add } = useCart();
  const recommended = useRecommended();

  const moveAllToCart = () => {
    items.forEach((p) => add(p.id, 1));
    toast.success(`${items.length} items added to cart`);
  };

  return (
    <SiteLayout>
      <div className="border-b border-border bg-secondary/30">
        <div className="container-pro py-6 flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Wishlist</h1>
            <p className="text-sm text-muted-foreground mt-1">{items.length} saved {items.length === 1 ? "item" : "items"}</p>
          </div>
          {items.length > 0 && (
            <Button onClick={moveAllToCart} className="bg-primary hover:bg-primary-hover">
              <ShoppingCart className="h-4 w-4 mr-2" /> Add all to cart
            </Button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="container-pro py-20 text-center">
          <Heart className="mx-auto h-14 w-14 text-muted-foreground/40" />
          <h2 className="font-display mt-4 text-2xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-2 text-muted-foreground">Save products to compare and reorder later.</p>
          <Button asChild className="mt-6"><Link to="/shop">Shop Catalog</Link></Button>
        </div>
      ) : (
        <div className="container-pro py-10">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">SKU</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right hidden md:table-cell">Stock</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/40">
                    <td className="px-4 py-4">
                      <Link to={`/product/${p.slug}`} className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded bg-muted p-1.5 shrink-0">
                          <img src={p.image} alt={p.name} className="h-full w-full object-contain" loading="lazy" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground">{p.brand}</div>
                          <div className="font-semibold text-sm line-clamp-2 hover:text-accent">{p.name}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground font-mono hidden md:table-cell">{p.sku}</td>
                    <td className="px-4 py-4 text-right font-display font-semibold tabular-nums">${p.price.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right hidden md:table-cell">
                      <span className={p.stock === "low" ? "badge-low" : "badge-stock"}>
                        {p.stock === "low" ? "Low" : "In stock"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => { add(p.id, 1); toast.success("Added to cart"); }}>
                          <ShoppingCart className="h-4 w-4 md:mr-1" /><span className="hidden md:inline">Add</span>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(p.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ProductRail title="You might also like" eyebrow="Recommended" products={recommended} />
    </SiteLayout>
  );
}
