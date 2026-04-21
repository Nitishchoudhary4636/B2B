import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, Package, FileText, ArrowRight } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import ProductRail from "@/components/ProductRail";
import { useRecommended } from "@/store/usePersonalisation";

export default function ThankYou() {
  const [params] = useSearchParams();
  const id = params.get("id") ?? "PO-XXXX";
  const total = params.get("total") ?? "0.00";
  const email = params.get("email") ?? "you@company.com";
  const recommended = useRecommended();

  return (
    <SiteLayout>
      <section className="container-pro py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <div className="eyebrow mt-5">Order confirmed</div>
          <h1 className="font-display mt-2 text-4xl font-semibold lg:text-5xl">Thank you for your order</h1>
          <p className="mt-3 text-muted-foreground">
            Order <strong className="text-foreground font-mono">{id}</strong> has been received. A confirmation has been sent to <strong className="text-foreground">{email}</strong>.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-border bg-card p-6 shadow-card">
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="text-center">
              <Mail className="mx-auto h-6 w-6 text-primary" />
              <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Confirmation</div>
              <div className="font-semibold mt-0.5 text-sm">Sent to inbox</div>
            </div>
            <div className="text-center border-x border-border">
              <Package className="mx-auto h-6 w-6 text-primary" />
              <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Ships</div>
              <div className="font-semibold mt-0.5 text-sm">Today, by 6 PM ET</div>
            </div>
            <div className="text-center">
              <FileText className="mx-auto h-6 w-6 text-primary" />
              <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Total charged</div>
              <div className="font-semibold mt-0.5 text-sm tabular-nums">${total}</div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild><Link to="/profile">View Order Details</Link></Button>
            <Button asChild variant="outline"><Link to="/shop">Continue Shopping <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">What happens next?</strong> Your order moves to our nearest distribution center within minutes. You'll receive a shipping notification with tracking once it's on the way. Need anything urgent? Reply to your confirmation email and your account manager will respond directly.
        </div>
      </section>

      <ProductRail title="Customers commonly reorder" eyebrow="Quick reorder" products={recommended} />
    </SiteLayout>
  );
}
