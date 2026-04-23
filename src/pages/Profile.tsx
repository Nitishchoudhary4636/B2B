import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Building2, LogOut, Package, MapPin, User as UserIcon, Settings, CreditCard } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrders, useUser } from "@/store/usePersonalisation";
import { useLocation } from "react-router-dom";
import { useMcpDataLayer } from "@/lib/dataLayer";

const profileSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(255),
  company: z.string().trim().min(1).max(120),
  phone: z.string().trim().regex(/^[\d\s+()-]{10,20}$/, "Valid phone required"),
});

export default function Profile() {
  const { user, logout, update } = useUser();
  const { orders } = useOrders();
  const nav = useNavigate();
  const { pathname } = useLocation();

  useMcpDataLayer({
    pageName: pathname === "/orders" ? "Orders" : "Profile",
    pageType: pathname === "/orders" ? "orders" : "profile",
    currency: "USD",
  });

  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    company: user?.company ?? "",
    phone: user?.phone ?? "",
    industry: user?.industry ?? "",
    role: user?.role ?? "",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const [address, setAddress] = useState({
    nickname: "Headquarters", line1: "", city: "", state: "", zip: "",
  });
  const [addresses, setAddresses] = useState<typeof address[]>([]);

  if (!user) {
    return (
      <SiteLayout>
        <div className="container-pro py-20 text-center">
          <UserIcon className="mx-auto h-14 w-14 text-muted-foreground/40" />
          <h2 className="mt-4 font-display text-2xl font-semibold">Sign in to view your account</h2>
          <Button asChild className="mt-6"><Link to="/login">Sign In</Link></Button>
        </div>
      </SiteLayout>
    );
  }

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const r = profileSchema.safeParse(form);
    if (!r.success) return toast.error(r.error.issues[0].message);
    update(form);
    toast.success("Profile updated");
  };

  const addAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.line1 || !address.city || !address.zip) return toast.error("Fill required fields");
    setAddresses((p) => [...p, address]);
    setAddress({ nickname: "Site", line1: "", city: "", state: "", zip: "" });
    toast.success("Address added");
  };

  return (
    <SiteLayout>
      <div className="bg-primary text-primary-foreground">
        <div className="container-pro py-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-accent grid place-items-center font-display text-2xl font-bold text-accent-foreground">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <div className="text-sm text-primary-foreground/70">Signed in as</div>
              <div className="font-display text-2xl font-semibold">{user.firstName} {user.lastName}</div>
              <div className="text-sm text-primary-foreground/80 flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {user.company}</div>
            </div>
          </div>
          <Button variant="outline" className="border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20" onClick={() => { logout(); toast("Signed out"); nav("/"); }}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </div>

      <div className="container-pro py-10">
        <Tabs defaultValue="overview">
          <TabsList className="flex w-full overflow-x-auto justify-start lg:justify-center">
            <TabsTrigger value="overview"><UserIcon className="h-4 w-4 mr-2" /> Overview</TabsTrigger>
            <TabsTrigger value="orders"><Package className="h-4 w-4 mr-2" /> Orders</TabsTrigger>
            <TabsTrigger value="addresses"><MapPin className="h-4 w-4 mr-2" /> Addresses</TabsTrigger>
            <TabsTrigger value="payment"><CreditCard className="h-4 w-4 mr-2" /> Payment</TabsTrigger>
            <TabsTrigger value="prefs"><Settings className="h-4 w-4 mr-2" /> Preferences</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="mt-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <Stat label="Lifetime orders" value={orders.length.toString()} />
              <Stat label="This year spend" value={`$${orders.reduce((s, o) => s + o.total, 0).toFixed(2)}`} />
              <Stat label="Account status" value="Approved · Net-30" tone="success" />
            </div>

            <form onSubmit={saveProfile} className="mt-8 rounded-lg border border-border bg-card p-6">
              <h3 className="font-display text-xl font-semibold mb-5">Personal Information</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="First name" value={form.firstName} onChange={(v) => set("firstName", v)} />
                <Field label="Last name" value={form.lastName} onChange={(v) => set("lastName", v)} />
                <Field label="Email" value={form.email} onChange={(v) => set("email", v)} className="md:col-span-2" />
                <Field label="Company" value={form.company} onChange={(v) => set("company", v)} />
                <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
                <div>
                  <label className="field-label">Industry</label>
                  <Select value={form.industry} onValueChange={(v) => set("industry", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["Manufacturing", "Construction", "Facility Management", "Energy & Utilities", "Logistics", "Other"].map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="field-label">Role</label>
                  <Select value={form.role} onValueChange={(v) => set("role", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["Procurement / Buyer", "Operations Manager", "Maintenance Lead", "Engineer", "Owner / Executive"].map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="mt-6 bg-primary hover:bg-primary-hover">Save Changes</Button>
            </form>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders" className="mt-8">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              {orders.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground">
                  No orders yet. <Link to="/shop" className="text-primary hover:text-accent">Browse the catalog →</Link>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left">Order</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Items</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-secondary/40">
                        <td className="px-4 py-4 font-mono text-sm">{o.id}</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">{new Date(o.date).toLocaleDateString()}</td>
                        <td className="px-4 py-4 text-sm">{o.items.length} item{o.items.length !== 1 && "s"}</td>
                        <td className="px-4 py-4 text-right font-semibold tabular-nums">${o.total.toFixed(2)}</td>
                        <td className="px-4 py-4"><span className="badge-stock">{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>

          {/* Addresses */}
          <TabsContent value="addresses" className="mt-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <form onSubmit={addAddress} className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-display text-xl font-semibold mb-4">Add ship-to address</h3>
                <div className="space-y-3">
                  <Field label="Nickname (e.g. HQ, Plant 2)" value={address.nickname} onChange={(v) => setAddress({ ...address, nickname: v })} />
                  <Field label="Street address" value={address.line1} onChange={(v) => setAddress({ ...address, line1: v })} />
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
                    <Field label="State" value={address.state} onChange={(v) => setAddress({ ...address, state: v })} />
                    <Field label="ZIP" value={address.zip} onChange={(v) => setAddress({ ...address, zip: v })} />
                  </div>
                </div>
                <Button type="submit" className="mt-5">Add Address</Button>
              </form>
              <div className="space-y-3">
                {addresses.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">No saved addresses yet.</div>
                ) : (
                  addresses.map((a, i) => (
                    <div key={i} className="rounded-lg border border-border bg-card p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-accent" /> {a.nickname}</div>
                      <div className="mt-2 text-sm text-muted-foreground">{a.line1}, {a.city}, {a.state} {a.zip}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="mt-8">
            <div className="rounded-lg border border-border bg-card p-6 max-w-2xl">
              <h3 className="font-display text-xl font-semibold mb-4">Payment Methods</h3>
              <div className="rounded-md border border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Visa ending in 4242</div>
                    <div className="text-xs text-muted-foreground">Expires 12/27</div>
                  </div>
                </div>
                <span className="badge-stock">Default</span>
              </div>
              <div className="mt-3 rounded-md border border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Net-30 Account</div>
                    <div className="text-xs text-muted-foreground">Approved · $25,000 limit</div>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="mt-4">+ Add payment method</Button>
            </div>
          </TabsContent>

          <TabsContent value="prefs" className="mt-8">
            <div className="rounded-lg border border-border bg-card p-6 max-w-2xl">
              <h3 className="font-display text-xl font-semibold mb-4">Communication preferences</h3>
              <div className="space-y-3 text-sm">
                {[
                  "Weekly deals & new arrivals",
                  "Order status & shipping notifications",
                  "Industry alerts & compliance updates",
                  "Account manager outreach",
                ].map((p, i) => (
                  <label key={p} className="flex items-center justify-between rounded-md border border-border p-4 cursor-pointer">
                    <span>{p}</span>
                    <input type="checkbox" defaultChecked={i < 2} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                  </label>
                ))}
              </div>
              <Button className="mt-5">Save Preferences</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SiteLayout>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-3xl font-semibold ${tone === "success" ? "text-success" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function Field({ label, value, onChange, className }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={className}>
      <label className="field-label">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}
