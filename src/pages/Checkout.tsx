import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { CreditCard, FileText, Lock, Truck } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart, useOrders, useUser } from "@/store/usePersonalisation";
import { useMcpDataLayer, toMcpCartItem } from "@/lib/dataLayer";

const checkoutSchema = z.object({
  email: z.string().trim().email("Valid email required").max(255),
  firstName: z.string().trim().min(1, "First name required").max(60),
  lastName: z.string().trim().min(1, "Last name required").max(60),
  company: z.string().trim().min(1, "Company required").max(120),
  address1: z.string().trim().min(1, "Address required").max(200),
  address2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(1, "City required").max(80),
  state: z.string().trim().min(2, "State required").max(40),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Valid ZIP required"),
  phone: z.string().trim().regex(/^[\d\s+()-]{10,20}$/, "Valid phone required"),
  poNumber: z.string().trim().max(40).optional(),
  shipMethod: z.enum(["standard", "expedited", "overnight"]),
  payMethod: z.enum(["card", "po"]),
  cardNumber: z.string().optional(),
  cardExp: z.string().optional(),
  cardCvc: z.string().optional(),
});

export default function Checkout() {
  const { detailed, subtotal, clear, count } = useCart();
  const { addOrder } = useOrders();
  const { user } = useUser();
  const nav = useNavigate();

  const [form, setForm] = useState({
    email: user?.email ?? "",
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    company: user?.company ?? "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: user?.phone ?? "",
    poNumber: "",
    shipMethod: "standard" as "standard" | "expedited" | "overnight",
    payMethod: "card" as "card" | "po",
    cardNumber: "",
    cardExp: "",
    cardCvc: "",
    sameAsBilling: true,
  });

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const shipCost = { standard: subtotal >= 99 ? 0 : 14.99, expedited: 24.99, overnight: 49.99 }[form.shipMethod];
  const tax = subtotal * 0.0825;
  const total = subtotal + shipCost + tax;

  useMcpDataLayer({
    pageName: "Checkout",
    pageType: "view_checkout",
    currency: "USD",
    items: detailed.map(({ product, qty }) => toMcpCartItem(product, qty)),
  }, [detailed.length, subtotal, count, form.shipMethod, form.payMethod]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (count === 0) return toast.error("Your cart is empty");
    const r = checkoutSchema.safeParse(form);
    if (!r.success) return toast.error(r.error.issues[0].message);
    if (form.payMethod === "card") {
      if (!/^\d{14,19}$/.test(form.cardNumber.replace(/\s/g, ""))) return toast.error("Valid card number required");
      if (!/^\d{2}\/\d{2}$/.test(form.cardExp)) return toast.error("Card expiry MM/YY required");
      if (!/^\d{3,4}$/.test(form.cardCvc)) return toast.error("Valid CVC required");
    }
    if (form.payMethod === "po" && !form.poNumber) return toast.error("PO number required");

    const orderId = "PO-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    addOrder({
      id: orderId,
      date: new Date().toISOString(),
      total,
      status: "Processing",
      items: detailed.map((d) => ({ name: d.product.name, qty: d.qty, price: d.product.price, sku: d.product.sku })),
    });
    clear();
    nav(`/thank-you?id=${orderId}&total=${total.toFixed(2)}&email=${encodeURIComponent(form.email)}`);
  };

  return (
    <SiteLayout>
      <div className="border-b border-border bg-secondary/30">
        <div className="container-pro py-6">
          <h1 className="font-display text-3xl font-semibold">Checkout</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Secure 256-bit SSL encryption</p>
        </div>
      </div>

      <form onSubmit={submit} className="container-pro grid gap-8 py-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          {/* Contact */}
          <Section title="Contact Information">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Work email" className="col-span-2" value={form.email} onChange={(v) => set("email", v)} placeholder="you@company.com" />
              <Field label="First name" value={form.firstName} onChange={(v) => set("firstName", v)} />
              <Field label="Last name" value={form.lastName} onChange={(v) => set("lastName", v)} />
              <Field label="Company" className="col-span-2" value={form.company} onChange={(v) => set("company", v)} />
              <Field label="Phone" className="col-span-2" value={form.phone} onChange={(v) => set("phone", v)} placeholder="(555) 555-1234" />
            </div>
          </Section>

          {/* Shipping address */}
          <Section title="Shipping Address">
            <div className="grid grid-cols-6 gap-4">
              <Field label="Address line 1" className="col-span-6" value={form.address1} onChange={(v) => set("address1", v)} />
              <Field label="Address line 2 (optional)" className="col-span-6" value={form.address2} onChange={(v) => set("address2", v)} />
              <Field label="City" className="col-span-3" value={form.city} onChange={(v) => set("city", v)} />
              <Field label="State" className="col-span-2" value={form.state} onChange={(v) => set("state", v)} placeholder="OH" />
              <Field label="ZIP" className="col-span-1" value={form.zip} onChange={(v) => set("zip", v)} />
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <Checkbox checked={form.sameAsBilling} onCheckedChange={(v) => set("sameAsBilling", !!v)} />
              Billing address same as shipping
            </label>
          </Section>

          {/* Shipping method */}
          <Section title="Shipping Method">
            <RadioGroup value={form.shipMethod} onValueChange={(v) => set("shipMethod", v)} className="space-y-2">
              {[
                { v: "standard", label: "Standard (3-5 business days)", price: subtotal >= 99 ? "FREE" : "$14.99" },
                { v: "expedited", label: "Expedited (2 business days)", price: "$24.99" },
                { v: "overnight", label: "Overnight", price: "$49.99" },
              ].map((o) => (
                <label key={o.v} className={`flex items-center justify-between rounded-md border p-4 cursor-pointer ${form.shipMethod === o.v ? "border-primary bg-secondary/40" : "border-border"}`}>
                  <span className="flex items-center gap-3">
                    <RadioGroupItem value={o.v} id={o.v} />
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor={o.v} className="cursor-pointer">{o.label}</Label>
                  </span>
                  <span className="font-semibold tabular-nums">{o.price}</span>
                </label>
              ))}
            </RadioGroup>
          </Section>

          {/* Payment */}
          <Section title="Payment Method">
            <RadioGroup value={form.payMethod} onValueChange={(v) => set("payMethod", v)} className="grid gap-2 md:grid-cols-2 mb-4">
              <label className={`flex items-center gap-3 rounded-md border p-4 cursor-pointer ${form.payMethod === "card" ? "border-primary bg-secondary/40" : "border-border"}`}>
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="h-4 w-4" /> <Label htmlFor="card" className="cursor-pointer">Credit / Debit Card</Label>
              </label>
              <label className={`flex items-center gap-3 rounded-md border p-4 cursor-pointer ${form.payMethod === "po" ? "border-primary bg-secondary/40" : "border-border"}`}>
                <RadioGroupItem value="po" id="po" />
                <FileText className="h-4 w-4" /> <Label htmlFor="po" className="cursor-pointer">Purchase Order (Net-30)</Label>
              </label>
            </RadioGroup>

            {form.payMethod === "card" ? (
              <div className="grid grid-cols-6 gap-4">
                <Field label="Card number" className="col-span-6" value={form.cardNumber} onChange={(v) => set("cardNumber", v)} placeholder="4242 4242 4242 4242" />
                <Field label="Expires (MM/YY)" className="col-span-3" value={form.cardExp} onChange={(v) => set("cardExp", v)} placeholder="12/27" />
                <Field label="CVC" className="col-span-3" value={form.cardCvc} onChange={(v) => set("cardCvc", v)} placeholder="123" />
              </div>
            ) : (
              <Field label="PO Number" value={form.poNumber} onChange={(v) => set("poNumber", v)} placeholder="PO-2024-0042" />
            )}
          </Section>
        </div>

        {/* Order summary */}
        <aside className="self-start rounded-lg border border-border bg-card p-6 lg:sticky lg:top-32">
          <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {detailed.map((d) => (
              <div key={d.product.id} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 rounded bg-muted p-1.5">
                  <img src={d.product.image} alt="" className="h-full w-full object-contain" loading="lazy" />
                  <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">{d.qty}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">{d.product.brand}</div>
                  <div className="text-xs font-medium line-clamp-2">{d.product.name}</div>
                </div>
                <div className="text-sm font-semibold tabular-nums">${d.lineTotal.toFixed(2)}</div>
              </div>
            ))}
          </div>
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">${subtotal.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd className="tabular-nums">{shipCost === 0 ? "FREE" : `$${shipCost.toFixed(2)}`}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Tax (est.)</dt><dd className="tabular-nums">${tax.toFixed(2)}</dd></div>
            <div className="flex justify-between border-t border-border pt-3 mt-3 font-display text-xl font-semibold">
              <dt>Total</dt><dd className="tabular-nums">${total.toFixed(2)}</dd>
            </div>
          </dl>
          <Button type="submit" size="lg" className="mt-5 w-full bg-primary hover:bg-primary-hover">
            <Lock className="h-4 w-4 mr-2" /> Place Order
          </Button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">By placing this order you agree to ProMRO's Terms of Sale.</p>
        </aside>
      </form>
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="font-display text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, className,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="field-label">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
