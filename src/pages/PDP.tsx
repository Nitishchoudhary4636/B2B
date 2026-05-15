import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { ChevronRight, Heart, Minus, Plus, ShoppingCart, Truck, Shield, Award, Check, Star, FileText } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";
import ProductRail from "@/components/ProductRail";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getProduct, getRelated } from "@/data/products";
import { useCart, useWishlist, useRecentlyViewed, useRecommended } from "@/store/usePersonalisation";
import { cn } from "@/lib/utils";
import { useMcpDataLayer, toMcpProductItem } from "@/lib/dataLayer";

const quoteSchema = z.object({
  qty: z.coerce.number().int().min(1).max(100000),
  email: z.string().trim().email("Valid work email required").max(255),
  notes: z.string().trim().max(500).optional(),
});

export default function PDP() {
  const { slug } = useParams();
  const product = slug ? getProduct(slug) : undefined;
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const { trackView, items: recent } = useRecentlyViewed();
  const recommended = useRecommended(product?.id);

  const [qty, setQty] = useState(product?.minOrder ?? 1);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quote, setQuote] = useState({ qty: "50", email: "", notes: "" });

  useEffect(() => {
    if (product) trackView(product.id);
  }, [product]);

  if (!product) return <Navigate to="/shop" replace />;

  const wished = has(product.id);
  const related = getRelated(product);
  const effectivePrice = product.bulkPrice && qty >= product.bulkPrice.qty ? product.bulkPrice.price : product.price;

  useMcpDataLayer({
    pageName: product.name,
    pageType: "Product",
    currency: "INR",
    Item: {
      ...toMcpProductItem(product),
      price: effectivePrice,
    },
  }, [product.id, product.name, effectivePrice]);

  const submitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const r = quoteSchema.safeParse(quote);
    if (!r.success) return toast.error(r.error.issues[0].message);
    toast.success("Quote requested", { description: `We'll respond within 1 hour for SKU ${product.sku}.` });
    setQuoteOpen(false);
    setQuote({ qty: "50", email: "", notes: "" });
  };

  return (
    <SiteLayout>
      <div className="border-b border-border bg-secondary/30">
        <div className="container-pro py-4">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/shop" className="hover:text-accent">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/shop/${product.category}`} className="hover:text-accent">{product.categoryName}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="container-pro grid gap-10 py-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border border-border bg-card">
            <img src={product.image} alt={product.name} className="h-full w-full object-contain p-8" width={800} height={800} />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[product.image, product.image, product.image, product.image].map((src, i) => (
              <div key={i} className={cn("aspect-square rounded border bg-card cursor-pointer", i === 0 ? "border-primary" : "border-border")}>
                <img src={src} alt="" className="h-full w-full object-contain p-2" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand} · SKU {product.sku}</div>
          <h1 className="font-display mt-2 text-3xl font-semibold lg:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("h-4 w-4", i < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted")} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} · {product.reviews} reviews</span>
            {product.badges?.map((b) => (
              <Badge key={b} className="bg-accent text-accent-foreground hover:bg-accent">{b}</Badge>
            ))}
          </div>

          <p className="mt-5 text-muted-foreground">{product.description}</p>

          {/* Price block */}
          <div className="mt-6 rounded-lg border border-border bg-secondary/40 p-5">
            <div className="mb-2 text-xs font-semibold text-accent uppercase">B2B Wholesale Pricing</div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-semibold tabular-nums">₹{effectivePrice.toFixed(0)}</span>
              <span className="text-sm text-muted-foreground">/ {product.uom}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="bg-primary/10 text-primary font-semibold px-2 py-1 rounded text-xs">Min order: {product.minOrder} {product.uom}</span>
            </div>
            {product.bulkPrice && product.bulkPrice.qty > product.minOrder && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-accent" />
                <span className="text-foreground">Buy {product.bulkPrice.qty}+ at <strong>₹{product.bulkPrice.price.toFixed(0)}/{product.uom}</strong> — save {(((product.price - product.bulkPrice.price) / product.price) * 100).toFixed(0)}%</span>
              </div>
            )}
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className={product.stock === "low" ? "badge-low" : "badge-stock"}>
                {product.stock === "low" ? `Only ${product.stockCount} left` : <><Check className="h-3 w-3" /> {product.stockCount} in stock</>}
              </span>
              <span className="text-muted-foreground">· {product.shipsIn}</span>
            </div>
          </div>

          {/* Add to cart row */}
          <div className="mt-5 flex items-stretch gap-3">
            <div className="flex items-center rounded-md border border-input">
              <button onClick={() => setQty((q) => Math.max(product.minOrder, q - product.minOrder))} className="px-3 h-12 hover:bg-muted" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
              <input
                type="number"
                min={product.minOrder}
                value={qty}
                onChange={(e) => {
                  const val = Number(e.target.value) || product.minOrder;
                  const remainder = val % product.minOrder;
                  setQty(val - remainder);
                }}
                className="w-16 h-12 bg-transparent text-center text-base font-semibold outline-none tabular-nums"
              />
              <button onClick={() => setQty((q) => q + product.minOrder)} className="px-3 h-12 hover:bg-muted" aria-label="Increase"><Plus className="h-4 w-4" /></button>
            </div>
            <Button
              size="lg"
              className="flex-1 h-12 bg-primary hover:bg-primary-hover"
              onClick={() => {
                add(product.id, qty);
                toast.success(`${qty} × ${product.name.split(" ").slice(0, 4).join(" ")}… added`, { description: `SKU ${product.sku}` });
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12"
              onClick={() => { toggle(product.id); toast(wished ? "Removed from wishlist" : "Saved to wishlist"); }}
              aria-label="Toggle wishlist"
            >
              <Heart className={cn("h-5 w-5", wished && "fill-accent text-accent")} />
            </Button>
          </div>

          <Button variant="link" className="px-0 mt-2 text-primary" onClick={() => setQuoteOpen((v) => !v)}>
            <FileText className="h-4 w-4 mr-1" /> Need a custom quote for {qty}+ units?
          </Button>

          {quoteOpen && (
            <form onSubmit={submitQuote} className="mt-3 space-y-3 rounded-lg border border-border bg-card p-5 animate-fade-up">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Quantity</label>
                  <input type="number" value={quote.qty} onChange={(e) => setQuote({ ...quote, qty: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="field-label">Work email</label>
                  <input value={quote.email} onChange={(e) => setQuote({ ...quote, email: e.target.value })} placeholder="you@company.com"
                    className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="field-label">Notes (optional)</label>
                <textarea value={quote.notes} onChange={(e) => setQuote({ ...quote, notes: e.target.value })} rows={2}
                  className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:border-primary"
                  placeholder="Delivery date, packaging, etc." />
              </div>
              <Button type="submit" className="w-full">Request Quote</Button>
            </form>
          )}

          {/* Trust */}
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5 text-xs">
            <div className="flex items-start gap-2"><Truck className="h-4 w-4 text-primary shrink-0" /> Free ship over ₹8,217</div>
            <div className="flex items-start gap-2"><Shield className="h-4 w-4 text-primary shrink-0" /> 1-yr warranty</div>
            <div className="flex items-start gap-2"><Award className="h-4 w-4 text-primary shrink-0" /> Net-30 available</div>
          </div>
        </div>
      </section>

      <section className="container-pro pb-12">
        <Tabs defaultValue="specs">
          <TabsList>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="docs">Compliance & Docs</TabsTrigger>
          </TabsList>
          <TabsContent value="specs" className="mt-6">
            <div className="grid grid-cols-1 gap-0 rounded-lg border border-border bg-card md:grid-cols-2">
              {product.specs.map((s, i) => (
                <div key={s.label} className={cn("flex justify-between border-border px-5 py-3 text-sm", i < product.specs.length - 1 && "border-b", i % 2 === 0 && "md:border-r")}>
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-medium text-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="features" className="mt-6">
            <ul className="space-y-2 text-sm">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5 text-success" /> {f}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="docs" className="mt-6">
            <ul className="space-y-3 text-sm">
              {["Safety Data Sheet (SDS).pdf", "Product Spec Sheet.pdf", "Manufacturer Warranty.pdf"].map((d) => (
                <li key={d}>
                  <a href="#" className="flex items-center gap-2 text-primary hover:text-accent">
                    <FileText className="h-4 w-4" /> {d}
                  </a>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </section>

      <ProductRail title="Related products" eyebrow={product.categoryName} products={related} />
      {recent.length > 1 && <ProductRail title="Recently viewed" eyebrow="For you" products={recent.filter((r) => r.id !== product.id).slice(0, 4)} />}
      <ProductRail title="Customers also bought" eyebrow="Recommended" products={recommended} />
    </SiteLayout>
  );
}
