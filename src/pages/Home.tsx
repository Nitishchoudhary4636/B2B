import { Link } from "react-router-dom";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Truck, Shield, Package, Headset, FileText, CheckCircle2 } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";
import ProductRail from "@/components/ProductRail";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/products";
import { useRecentlyViewed, useRecommended, useUser } from "@/store/usePersonalisation";
import hero from "@/assets/hero-warehouse.jpg";

const quickQuoteSchema = z.object({
  email: z.string().trim().email("Valid work email required").max(255),
  sku: z.string().trim().min(1, "SKU or product needed").max(60),
  qty: z.coerce.number().int().min(1, "Min qty 1").max(100000),
});

export default function Home() {
  const { user } = useUser();
  const { items: recent } = useRecentlyViewed();
  const recommended = useRecommended();

  const [qq, setQq] = useState({ email: "", sku: "", qty: "" });
  const submitQQ = (e: React.FormEvent) => {
    e.preventDefault();
    const r = quickQuoteSchema.safeParse(qq);
    if (!r.success) return toast.error(r.error.issues[0].message);
    toast.success("Quote request received", { description: "An account specialist will reply within 1 business hour." });
    setQq({ email: "", sku: "", qty: "" });
  };

  const bestSellers = products.slice(0, 4);
  const newArrivals = [...products].reverse().slice(0, 4);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container-pro relative grid gap-8 py-20 lg:grid-cols-2 lg:py-28">
          <div className="text-primary-foreground animate-fade-up">
            <div className="eyebrow mb-4 text-accent">{user ? `Welcome back, ${user.firstName}` : "Trusted by 40,000+ businesses"}</div>
            <h1 className="font-display text-4xl font-bold md:text-5xl lg:text-6xl">
              The supply partner<br />your operation runs on.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-primary-foreground/80">
              Tools, safety, fasteners and MRO — shipped same-day from 12 distribution centers. Net-30 terms, dedicated reps, zero downtime.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/shop">Shop Catalog <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20">
                <Link to="/contact">Open a Business Account</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 text-primary-foreground/80 max-w-md">
              {[
                { n: "40k+", l: "Active accounts" },
                { n: "1.2M", l: "SKUs in stock" },
                { n: "98.7%", l: "On-time shipping" },
              ].map((s) => (
                <div key={s.n}>
                  <div className="font-display text-3xl font-bold text-accent">{s.n}</div>
                  <div className="text-xs uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick quote form */}
          <div className="lg:justify-self-end w-full max-w-md self-center animate-fade-up">
            <div className="rounded-lg border border-white/20 bg-white p-6 shadow-elevated">
              <div className="eyebrow">Fast Quote</div>
              <h3 className="font-display text-2xl font-semibold mt-1 mb-1">Need pricing in a hurry?</h3>
              <p className="text-sm text-muted-foreground mb-5">Drop a SKU or product name. We'll come back with volume pricing in under an hour.</p>
              <form onSubmit={submitQQ} className="space-y-3">
                <div>
                  <label className="field-label">Work email</label>
                  <input
                    value={qq.email}
                    onChange={(e) => setQq({ ...qq, email: e.target.value })}
                    placeholder="you@company.com"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="field-label">SKU or product</label>
                    <input
                      value={qq.sku}
                      onChange={(e) => setQq({ ...qq, sku: e.target.value })}
                      placeholder="PMR-PD-2401 or hammer drill"
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="field-label">Qty</label>
                    <input
                      type="number"
                      value={qq.qty}
                      onChange={(e) => setQq({ ...qq, qty: e.target.value })}
                      placeholder="100"
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary-hover" size="lg">Get My Quote</Button>
                <p className="text-[11px] text-muted-foreground text-center">No obligation · Avg response 47 min</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container-pro grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
          {[
            { Icon: Truck, t: "Same-day shipping", s: "Order by 4pm local" },
            { Icon: FileText, t: "Net-30 terms", s: "Approved in 24 hrs" },
            { Icon: Shield, t: "OSHA compliant", s: "Cert docs on every PDP" },
            { Icon: Headset, t: "Dedicated reps", s: "1:1 account managers" },
          ].map(({ Icon, t, s }) => (
            <div key={t} className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{t}</div>
                <div className="text-xs text-muted-foreground">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-pro py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="eyebrow mb-2">Shop by Department</div>
            <h2 className="font-display text-3xl font-semibold">Browse 12,000+ products</h2>
          </div>
          <Link to="/shop" className="hidden text-sm font-semibold text-primary hover:text-accent md:flex items-center gap-1">
            All categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/shop/${c.slug}`}
              className="group rounded-lg border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:border-accent"
            >
              <div className="grid h-12 w-12 place-items-center rounded-md bg-primary/5 text-primary group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Package className="h-6 w-6" />
              </div>
              <div className="mt-4 font-semibold text-sm text-foreground">{c.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.count.toLocaleString()} SKUs</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Personalised: Recently viewed */}
      {recent.length > 0 && (
        <ProductRail eyebrow="For you" title="Recently viewed" products={recent.slice(0, 4)} />
      )}

      {/* Personalised: Recommended */}
      <ProductRail
        eyebrow={recent.length ? "Based on your activity" : "Most popular"}
        title="Recommended for your operation"
        products={recommended}
      />

      {/* Best sellers */}
      <ProductRail eyebrow="Customers reorder weekly" title="Best sellers" products={bestSellers} />

      {/* Why ProMRO band */}
      <section className="bg-surface-dark text-surface-dark-foreground">
        <div className="container-pro grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="eyebrow text-accent mb-3">Why teams choose ProMRO</div>
            <h2 className="font-display text-4xl font-semibold mb-4">Built for the way you really order.</h2>
            <p className="text-surface-dark-foreground/80 max-w-xl">
              Punch-out integrations, scheduled reorders, multi-site shipping and a single invoice across every department. We make procurement boring — in the best possible way.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Instant volume discounts at 6, 12, 25+",
                "Multi-user accounts with approval workflows",
                "Real-time inventory across 12 warehouses",
                "Compliance & cert documents on every PDP",
              ].map((x) => (
                <li key={x} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" /> {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {newArrivals.slice(0, 2).map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`} className="rounded-lg bg-white p-4 text-foreground shadow-elevated hover:scale-[1.02] transition-transform">
                <img src={p.image} alt={p.name} className="aspect-square w-full object-contain" loading="lazy" />
                <div className="mt-3 text-xs text-muted-foreground">{p.brand}</div>
                <div className="line-clamp-2 text-sm font-semibold">{p.name}</div>
                <div className="mt-2 font-display text-lg font-semibold">${p.price.toFixed(2)}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
