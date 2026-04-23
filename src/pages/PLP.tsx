import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { products, categories, brands } from "@/data/products";
import { useMcpDataLayer } from "@/lib/dataLayer";

export default function PLP() {
  const { category } = useParams();
  const [params] = useSearchParams();
  const q = params.get("q")?.toLowerCase() ?? "";

  const cat = categories.find((c) => c.slug === category);
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [stockOnly, setStockOnly] = useState(false);
  const [priceMax, setPriceMax] = useState(500);
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => (cat ? p.category === cat.slug : true));
    if (q) list = list.filter((p) => `${p.name} ${p.brand} ${p.sku} ${p.categoryName}`.toLowerCase().includes(q));
    if (brandFilter.length) list = list.filter((p) => brandFilter.includes(p.brand));
    if (stockOnly) list = list.filter((p) => p.stock !== "out");
    list = list.filter((p) => p.price <= priceMax);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [cat, q, brandFilter, stockOnly, priceMax, sort]);

  const toggleBrand = (b: string) =>
    setBrandFilter((p) => (p.includes(b) ? p.filter((x) => x !== b) : [...p, b]));

  useMcpDataLayer({
    pageName: cat ? cat.name : q ? `Search: ${q}` : "All Products",
    pageType: q ? "Search" : "Category",
    currency: "USD",
    itemListId: q ? `search:${q}` : cat?.slug ?? "all-products",
    itemListName: cat?.name ?? (q ? `Search: ${q}` : "All Products"),
  }, [cat?.slug, cat?.name, q]);

  const FiltersInner = (
    <div className="space-y-7">
      <div>
        <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">Brand</div>
        <div className="space-y-2.5">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox checked={brandFilter.includes(b)} onCheckedChange={() => toggleBrand(b)} />
              {b}
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between text-sm font-semibold uppercase tracking-wider text-foreground">
          Price <span className="text-xs text-muted-foreground normal-case font-normal">Up to ${priceMax}</span>
        </div>
        <Slider value={[priceMax]} max={500} min={20} step={10} onValueChange={(v) => setPriceMax(v[0])} />
      </div>
      <div>
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
          <Checkbox checked={stockOnly} onCheckedChange={(v) => setStockOnly(!!v)} />
          In stock only
        </label>
      </div>
      <div>
        <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">Categories</div>
        <ul className="space-y-1.5 text-sm">
          <li><Link to="/shop" className="text-muted-foreground hover:text-accent">All Products</Link></li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={`/shop/${c.slug}`} className={`hover:text-accent ${c.slug === cat?.slug ? "text-accent font-semibold" : "text-muted-foreground"}`}>
                {c.name} <span className="text-xs text-muted-foreground">({c.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <SiteLayout>
      {/* Breadcrumb + header */}
      <div className="border-b border-border bg-secondary/40">
        <div className="container-pro py-6">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Link to="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/shop" className="hover:text-accent">Shop</Link>
            {cat && (<>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{cat.name}</span>
            </>)}
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-4xl font-semibold">{cat ? cat.name : q ? `Search: "${q}"` : "All Products"}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{cat?.description || `${filtered.length} products available · industrial grade · ships from 12 locations`}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters(true)}>
                <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
              </Button>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="container-pro grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">{FiltersInner}</aside>

        {/* Mobile filter drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute inset-y-0 right-0 w-80 bg-background p-6 overflow-y-auto animate-slide-in-right">
              <div className="mb-5 flex items-center justify-between">
                <span className="font-display text-xl font-semibold">Filters</span>
                <button onClick={() => setShowFilters(false)}><X className="h-5 w-5" /></button>
              </div>
              {FiltersInner}
              <Button className="mt-6 w-full" onClick={() => setShowFilters(false)}>Show {filtered.length} results</Button>
            </div>
          </div>
        )}

        <div>
          <div className="mb-4 text-sm text-muted-foreground">{filtered.length} results</div>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">No products match your filters.</p>
              <Button onClick={() => { setBrandFilter([]); setStockOnly(false); setPriceMax(500); }} className="mt-4" variant="outline">
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Bulk order CTA */}
          <div className="mt-12 rounded-lg border border-border bg-gradient-to-br from-secondary/60 to-background p-6 lg:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="eyebrow mb-1">Bulk ordering</div>
                <h3 className="font-display text-2xl font-semibold">Need 50+ units?</h3>
                <p className="text-sm text-muted-foreground mt-1">Upload a SKU list and our team configures pricing within the hour.</p>
              </div>
              <Button asChild size="lg"><Link to="/contact">Submit a Bulk Quote</Link></Button>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
