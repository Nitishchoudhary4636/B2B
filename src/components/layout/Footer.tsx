import { Link } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/products";

const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid work email").max(255),
});

export default function Footer() {
  const [email, setEmail] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = newsletterSchema.safeParse({ email });
    if (!r.success) return toast.error(r.error.issues[0].message);
    toast.success("Subscribed. Check your inbox for a 10% off coupon.");
    setEmail("");
  };

  return (
    <footer className="bg-surface-dark text-surface-dark-foreground mt-24">
      {/* Top CTA strip */}
      <div className="bg-gradient-accent">
        <div className="container-pro flex flex-col items-start justify-between gap-4 py-6 md:flex-row md:items-center">
          <div>
            <div className="font-display text-xl font-bold text-accent-foreground">Looking for higher bulk discounts?</div>
            <div className="text-sm text-accent-foreground/90">Request a custom quote for large orders, contract pricing, and dedicated account management.</div>
          </div>
          <Button asChild variant="secondary" size="lg">
            <Link to="/contact">Request Quote</Link>
          </Button>
        </div>
      </div>

      <div className="container-pro grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-md bg-accent grid place-items-center">
              <span className="font-display font-bold text-accent-foreground text-lg">P</span>
            </div>
            <div className="font-display text-xl font-bold">ProMRO</div>
          </div>
          <p className="text-sm text-surface-dark-foreground/70 max-w-sm mb-6">
            Trusted by 40,000+ businesses for tools, safety, fasteners and MRO. Same-day shipping from 12 distribution centers.
          </p>
          <form onSubmit={submit} className="flex max-w-sm gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Work email"
              className="flex-1 rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm placeholder:text-surface-dark-foreground/40 outline-none focus:border-accent"
            />
            <Button type="submit" variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Subscribe
            </Button>
          </form>
          <p className="mt-2 text-[11px] text-surface-dark-foreground/50">Get a 10% off coupon + monthly product alerts.</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-accent">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}><Link to={`/shop/${c.slug}`} className="text-surface-dark-foreground/70 hover:text-accent transition-colors">{c.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-accent">Business</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/contact" className="text-surface-dark-foreground/70 hover:text-accent">Open an Account</Link></li>
            <li><Link to="/contact" className="text-surface-dark-foreground/70 hover:text-accent">Volume Pricing</Link></li>
            <li><Link to="/contact" className="text-surface-dark-foreground/70 hover:text-accent">Punch-out / Procurement</Link></li>
            <li><Link to="/contact" className="text-surface-dark-foreground/70 hover:text-accent">Net-30 Terms</Link></li>
            <li><Link to="/profile" className="text-surface-dark-foreground/70 hover:text-accent">Account Manager</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-accent">Contact</h4>
          <ul className="space-y-3 text-sm text-surface-dark-foreground/70">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-accent" /> 1-800-555-0199</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-accent" /> sales@promro.com</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-accent" /> 1200 Industrial Pkwy<br />Cleveland, OH 44114</li>
          </ul>
          <div className="mt-5 flex gap-3">
            {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded grid place-items-center bg-white/5 hover:bg-accent transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-pro flex flex-col gap-3 py-5 text-xs text-surface-dark-foreground/60 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} ProMRO Industrial Supply. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-accent">Privacy</a>
            <a href="#" className="hover:text-accent">Terms</a>
            <a href="#" className="hover:text-accent">Accessibility</a>
            <a href="#" className="hover:text-accent">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
