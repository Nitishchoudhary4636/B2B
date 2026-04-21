import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SiteLayout from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/usePersonalisation";
import ProductRail from "@/components/ProductRail";
import { useRecommended } from "@/store/usePersonalisation";

export default function Cart() {
  const { detailed, update, remove, subtotal, count } = useCart();
  const recommended = useRecommended();
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promo.trim().toUpperCase() === "B2B10") {
      setDiscount(subtotal * 0.1);
      toast.success("Promo applied — 10% off");
    } else {
      toast.error("Invalid promo code (try B2B10)");
    }
  };

  const shipping = subtotal >= 99 ? 0 : 14.99;
  const tax = (subtotal - discount) * 0.0825;
  const total = subtotal - discount + shipping + tax;

  return (
    <SiteLayout>
      <div className="border-b border-border bg-secondary/30">
        <div className="container-pro py-6">
          <h1 className="font-display text-3xl font-semibold">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground mt-1">{count} {count === 1 ? "item" : "items"} · prices in USD</p>
        </div>
      </div>

      {detailed.length === 0 ? (
        <div className="container-pro py-20 text-center">
          <ShoppingBag className="mx-auto h-14 w-14 text-muted-foreground/40" />
          <h2 className="font-display mt-4 text-2xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">Browse the catalog to get started.</p>
          <Button asChild className="mt-6"><Link to="/shop">Shop Catalog</Link></Button>
        </div>
      ) : (
        <div className="container-pro grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-3">
            {detailed.map(({ product, qty, lineTotal }) => (
              <div key={product.id} className="flex gap-4 rounded-lg border border-border bg-card p-4">
                <Link to={`/product/${product.slug}`} className="h-24 w-24 shrink-0 rounded bg-muted p-2">
                  <img src={product.image} alt={product.name} className="h-full w-full object-contain" loading="lazy" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">{product.brand} · {product.sku}</div>
                      <Link to={`/product/${product.slug}`} className="font-semibold text-sm hover:text-accent line-clamp-2">{product.name}</Link>
                    </div>
                    <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex items-center rounded-md border border-input">
                      <button onClick={() => update(product.id, qty - 1)} className="px-2 h-9 hover:bg-muted"><Minus className="h-3.5 w-3.5" /></button>
                      <input type="number" value={qty} onChange={(e) => update(product.id, Number(e.target.value) || 1)} className="w-12 h-9 bg-transparent text-center text-sm font-semibold outline-none tabular-nums" />
                      <button onClick={() => update(product.id, qty + 1)} className="px-2 h-9 hover:bg-muted"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg font-semibold tabular-nums">${lineTotal.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">${product.price.toFixed(2)} ea</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <aside className="self-start rounded-lg border border-border bg-card p-6 lg:sticky lg:top-32">
            <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>

            <form onSubmit={applyPromo} className="mb-5 flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code (try B2B10)" className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <Button type="submit" variant="outline">Apply</Button>
            </form>

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">${subtotal.toFixed(2)}</dd></div>
              {discount > 0 && (
                <div className="flex justify-between text-success"><dt>Promo (B2B10)</dt><dd className="tabular-nums">−${discount.toFixed(2)}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd className="tabular-nums">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Tax (est.)</dt><dd className="tabular-nums">${tax.toFixed(2)}</dd></div>
              <div className="border-t border-border pt-3 mt-3 flex justify-between font-display text-xl font-semibold">
                <dt>Total</dt><dd className="tabular-nums">${total.toFixed(2)}</dd>
              </div>
            </dl>

            {subtotal < 99 && (
              <p className="mt-3 text-xs text-accent">Add ${(99 - subtotal).toFixed(2)} more to unlock free shipping.</p>
            )}

            <Button asChild size="lg" className="mt-5 w-full bg-primary hover:bg-primary-hover">
              <Link to="/checkout">Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">Net-30 terms available at checkout for verified accounts.</p>
          </aside>
        </div>
      )}

      <ProductRail title="You might also need" eyebrow="Recommended" products={recommended} />
    </SiteLayout>
  );
}
