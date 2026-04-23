import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Phone, MessageSquare, Building2, Send } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMcpDataLayer } from "@/lib/dataLayer";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name required").max(60),
  lastName: z.string().trim().min(1, "Last name required").max(60),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().regex(/^[\d\s+()-]{10,20}$/, "Valid phone required"),
  company: z.string().trim().min(1, "Company required").max(120),
  employees: z.string().min(1, "Select size"),
  topic: z.string().min(1, "Select topic"),
  estimatedSpend: z.string().min(1, "Estimated spend required"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

export default function Contact() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    company: "", employees: "", topic: "", estimatedSpend: "", message: "",
    consent: true,
  });
  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  useMcpDataLayer({
    pageName: "Contact",
    pageType: "Contact",
    currency: "USD",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = contactSchema.safeParse(form);
    if (!r.success) return toast.error(r.error.issues[0].message);
    if (!form.consent) return toast.error("Please accept the privacy policy");
    toast.success("Thanks — a specialist will reach out within 1 business hour.");
    setForm({ firstName: "", lastName: "", email: "", phone: "", company: "", employees: "", topic: "", estimatedSpend: "", message: "", consent: true });
  };

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground">
        <div className="container-pro py-14">
          <div className="eyebrow text-accent mb-3">Contact us</div>
          <h1 className="font-display text-4xl font-semibold lg:text-5xl">Let's talk supply.</h1>
          <p className="mt-3 max-w-xl text-primary-foreground/80">Whether you're sourcing for one site or fifty, our team responds within an hour to every business inquiry.</p>
        </div>
      </section>

      <div className="container-pro grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="rounded-lg border border-border bg-card p-6 lg:p-8 shadow-card">
          <h2 className="font-display text-2xl font-semibold mb-6">Tell us about your needs</h2>

          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="First name" value={form.firstName} onChange={(v) => set("firstName", v)} />
              <Field label="Last name" value={form.lastName} onChange={(v) => set("lastName", v)} />
              <Field label="Work email" value={form.email} onChange={(v) => set("email", v)} placeholder="you@company.com" />
              <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} placeholder="(555) 555-1234" />
              <Field label="Company" value={form.company} onChange={(v) => set("company", v)} className="md:col-span-2" />
              <div>
                <label className="field-label">Company size</label>
                <Select value={form.employees} onValueChange={(v) => set("employees", v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["1–10", "11–50", "51–250", "251–1,000", "1,000+"].map((s) => <SelectItem key={s} value={s}>{s} employees</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="field-label">Estimated annual spend</label>
                <Select value={form.estimatedSpend} onValueChange={(v) => set("estimatedSpend", v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["Under $10k", "$10k – $50k", "$50k – $250k", "$250k – $1M", "$1M+"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="field-label">How can we help?</label>
                <Select value={form.topic} onValueChange={(v) => set("topic", v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select topic" /></SelectTrigger>
                  <SelectContent>
                    {["Open a business account", "Bulk / volume quote", "Punch-out integration", "Net-30 terms", "Existing order question", "Other"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Message</label>
                <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={5} placeholder="Share SKUs, quantities, deadlines, or anything else…"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]" />
              <span>I agree to ProMRO's privacy policy and consent to be contacted about this inquiry.</span>
            </label>

            <Button type="submit" size="lg" className="bg-primary hover:bg-primary-hover">
              <Send className="h-4 w-4 mr-2" /> Send message
            </Button>
          </div>
        </form>

        <aside className="space-y-4">
          <ContactCard Icon={Phone} title="Call sales" body="1-800-555-0199" sub="Mon–Fri 7 AM – 8 PM ET" />
          <ContactCard Icon={Mail} title="Email" body="sales@promro.com" sub="Response within 1 hour" />
          <ContactCard Icon={MessageSquare} title="Live chat" body="Start a conversation" sub="Available 24/5" />
          <ContactCard Icon={Building2} title="HQ" body="1200 Industrial Pkwy" sub="Cleveland, OH 44114" />
        </aside>
      </div>
    </SiteLayout>
  );
}

function Field({ label, value, onChange, placeholder, className }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="field-label">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}

function ContactCard({ Icon, title, body, sub }: { Icon: any; title: string; body: string; sub: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 hover:border-accent transition-colors">
      <div className="grid h-10 w-10 place-items-center rounded-md bg-accent-soft text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="mt-1 font-semibold text-foreground">{body}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
