import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, ShoppingCart, Heart, User, Menu, X, Phone, Truck, FileText, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/products";
import { useCart, useWishlist, useUser } from "@/store/usePersonalisation";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { user } = useUser();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Utility bar */}
      <div className="bg-surface-utility text-surface-dark-foreground text-xs">
        <div className="container-pro flex h-9 items-center justify-between">
          <div className="hidden items-center gap-5 md:flex">
            <a href="tel:18005550199" className="flex items-center gap-1.5 hover:text-accent">
              <Phone className="h-3.5 w-3.5" /> 1-800-555-0199
            </a>
            <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Free shipping over ₹8,217</span>
            <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Bulk Orders • B2B Only</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Link to="/contact" className="hover:text-accent">Help</Link>
            <Link to="/profile" className="hover:text-accent flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> Business account</Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-border bg-background">
        <div className="container-pro flex h-20 items-center gap-4 lg:gap-8">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>

          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="h-9 w-9 rounded-md bg-primary grid place-items-center">
              <span className="font-display font-bold text-primary-foreground text-lg">P</span>
            </div>
            <div className="leading-none">
              <div className="font-display text-xl font-bold tracking-tight text-primary">ProMRO</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Industrial Supply</div>
            </div>
          </Link>

          <form onSubmit={submit} className="hidden flex-1 max-w-2xl lg:flex">
            <div className="flex w-full overflow-hidden rounded-md border-2 border-primary focus-within:ring-2 focus-within:ring-accent">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by SKU, brand, or product…"
                className="flex-1 bg-transparent px-4 text-sm outline-none"
              />
              <button type="submit" className="bg-primary px-5 text-primary-foreground hover:bg-primary-hover transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1 ml-auto">
            <Button asChild variant="ghost" size="sm" className="hidden md:flex">
              <Link to={user ? "/profile" : "/login"}>
                <User className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">{user ? user.firstName : "Sign in"}</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="relative">
              <Link to="/wishlist" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
                {wishCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-accent p-0 text-[10px] text-accent-foreground">
                    {wishCount}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="relative">
              <Link to="/cart" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {count > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-accent p-0 text-[10px] text-accent-foreground">
                    {count}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={submit} className="container-pro pb-3 lg:hidden">
          <div className="flex w-full overflow-hidden rounded-md border-2 border-primary">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
            />
            <button type="submit" className="bg-primary px-4 text-primary-foreground"><Search className="h-4 w-4" /></button>
          </div>
        </form>
      </div>

      {/* Category nav */}
      <nav className="hidden border-b border-border bg-background lg:block">
        <div className="container-pro flex h-11 items-center gap-1 overflow-x-auto">
          <NavLink
            to="/shop"
            end
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                isActive ? "text-accent" : "text-foreground hover:text-accent"
              }`
            }
          >
            All Products
          </NavLink>
          {categories.map((c) => (
            <NavLink
              key={c.slug}
              to={`/shop/${c.slug}`}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {c.name}
            </NavLink>
          ))}
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/contact" className="hover:text-accent">Request a Quote</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-accent">Bulk Orders</Link>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-background shadow-elevated animate-slide-in-right">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <span className="font-display text-lg font-bold text-primary">Menu</span>
              <button onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex flex-col p-2">
              <Link to="/" onClick={() => setMobileOpen(false)} className="rounded px-3 py-2.5 text-sm font-medium hover:bg-muted">Home</Link>
              <Link to="/shop" onClick={() => setMobileOpen(false)} className="rounded px-3 py-2.5 text-sm font-medium hover:bg-muted">All Products</Link>
              {categories.map((c) => (
                <Link key={c.slug} to={`/shop/${c.slug}`} onClick={() => setMobileOpen(false)} className="rounded px-3 py-2.5 text-sm hover:bg-muted">
                  {c.name}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded px-3 py-2.5 text-sm hover:bg-muted">My Account</Link>
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="rounded px-3 py-2.5 text-sm hover:bg-muted">Wishlist</Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="rounded px-3 py-2.5 text-sm hover:bg-muted">Contact</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
