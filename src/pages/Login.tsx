import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, CheckCircle2 } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/store/usePersonalisation";

const loginSchema = z.object({
  email: z.string().trim().email("Valid email required").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name required").max(60),
  lastName: z.string().trim().min(1, "Last name required").max(60),
  email: z.string().trim().email("Valid work email required").max(255),
  password: z.string().min(8, "Min 8 characters").max(100),
  company: z.string().trim().min(1, "Company required").max(120),
  industry: z.string().min(1, "Industry required"),
  role: z.string().min(1, "Role required"),
  phone: z.string().trim().regex(/^[\d\s+()-]{10,20}$/, "Valid phone required"),
});

export default function Login() {
  const nav = useNavigate();
  const { login } = useUser();
  const [showPw, setShowPw] = useState(false);

  // Login state
  const [loginForm, setLoginForm] = useState({ email: "", password: "", remember: true });

  // Signup state — multi-step
  const [step, setStep] = useState(1);
  const [signup, setSignup] = useState({
    firstName: "", lastName: "", email: "", password: "",
    company: "", industry: "", role: "", phone: "",
    interests: [] as string[],
    newsletter: true,
  });
  const setS = (k: string, v: any) => setSignup((p) => ({ ...p, [k]: v }));
  const toggleInterest = (v: string) =>
    setS("interests", signup.interests.includes(v) ? signup.interests.filter((x) => x !== v) : [...signup.interests, v]);

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const r = loginSchema.safeParse(loginForm);
    if (!r.success) return toast.error(r.error.issues[0].message);
    login({
      email: loginForm.email,
      firstName: loginForm.email.split("@")[0].split(".")[0].replace(/^./, (c) => c.toUpperCase()),
      lastName: "",
      company: "Demo Co.",
    });
    toast.success("Signed in");
    nav("/profile");
  };

  const submitSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) return setStep(step + 1);
    const r = signupSchema.safeParse(signup);
    if (!r.success) return toast.error(r.error.issues[0].message);
    login({
      email: signup.email, firstName: signup.firstName, lastName: signup.lastName,
      company: signup.company, industry: signup.industry, role: signup.role, phone: signup.phone,
    });
    toast.success("Account created. Welcome to ProMRO!");
    nav("/profile");
  };

  return (
    <SiteLayout>
      <div className="container-pro grid gap-10 py-12 lg:grid-cols-[1fr_440px]">
        {/* Left: marketing panel */}
        <div className="hidden lg:flex flex-col justify-center pr-8">
          <div className="eyebrow mb-3">Business accounts</div>
          <h1 className="font-display text-4xl font-semibold mb-4">One account, every advantage.</h1>
          <p className="text-muted-foreground max-w-md">Open a free ProMRO business account to unlock volume pricing, Net-30 terms, dedicated reps and personalised reordering.</p>
          <ul className="mt-8 space-y-3 max-w-sm">
            {[
              "Save 10–25% with volume tiers",
              "Net-30 invoicing on approved accounts",
              "Multi-user with approval workflows",
              "Track shipments in real time",
            ].map((x) => (
              <li key={x} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                {x}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: forms */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-card lg:p-8">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <h2 className="font-display text-2xl font-semibold mb-1">Welcome back</h2>
              <p className="text-sm text-muted-foreground mb-5">Sign in to access your business account.</p>
              <form onSubmit={submitLogin} className="space-y-4">
                <div>
                  <label className="field-label">Email</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} placeholder="you@company.com"
                      className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div>
                  <label className="field-label">Password</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input type={showPw ? "text" : "password"} value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full rounded-md border border-input bg-background pl-10 pr-10 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={loginForm.remember} onCheckedChange={(v) => setLoginForm({ ...loginForm, remember: !!v })} /> Remember me
                  </label>
                  <Link to="#" className="text-sm text-primary hover:text-accent">Forgot password?</Link>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary-hover" size="lg">Sign in</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <div className="mb-5">
                <h2 className="font-display text-2xl font-semibold mb-1">Open a Business Account</h2>
                <div className="flex items-center gap-2 mt-3">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex-1">
                      <div className={`h-1.5 rounded-full ${s <= step ? "bg-accent" : "bg-muted"}`} />
                      <div className={`mt-1 text-[10px] uppercase tracking-wider ${s <= step ? "text-accent font-semibold" : "text-muted-foreground"}`}>
                        Step {s}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={submitSignup} className="space-y-4">
                {step === 1 && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="field-label">First name</label>
                        <input value={signup.firstName} onChange={(e) => setS("firstName", e.target.value)}
                          className="mt-1 w-full rounded-md border border-input px-3 py-2.5 text-sm outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="field-label">Last name</label>
                        <input value={signup.lastName} onChange={(e) => setS("lastName", e.target.value)}
                          className="mt-1 w-full rounded-md border border-input px-3 py-2.5 text-sm outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="field-label">Work email</label>
                      <input value={signup.email} onChange={(e) => setS("email", e.target.value)} placeholder="you@company.com"
                        className="mt-1 w-full rounded-md border border-input px-3 py-2.5 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="field-label">Password</label>
                      <input type="password" value={signup.password} onChange={(e) => setS("password", e.target.value)} placeholder="Min 8 characters"
                        className="mt-1 w-full rounded-md border border-input px-3 py-2.5 text-sm outline-none focus:border-primary" />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <label className="field-label">Company</label>
                      <input value={signup.company} onChange={(e) => setS("company", e.target.value)}
                        className="mt-1 w-full rounded-md border border-input px-3 py-2.5 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="field-label">Industry</label>
                      <Select value={signup.industry} onValueChange={(v) => setS("industry", v)}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select industry" /></SelectTrigger>
                        <SelectContent>
                          {["Manufacturing", "Construction", "Facility Management", "Energy & Utilities", "Logistics", "Other"].map((i) => (
                            <SelectItem key={i} value={i}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="field-label">Your role</label>
                      <Select value={signup.role} onValueChange={(v) => setS("role", v)}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>
                          {["Procurement / Buyer", "Operations Manager", "Maintenance Lead", "Engineer", "Owner / Executive"].map((i) => (
                            <SelectItem key={i} value={i}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="field-label">Phone</label>
                      <input value={signup.phone} onChange={(e) => setS("phone", e.target.value)} placeholder="(555) 555-1234"
                        className="mt-1 w-full rounded-md border border-input px-3 py-2.5 text-sm outline-none focus:border-primary" />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div>
                      <label className="field-label mb-2 block">What categories matter most?</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Power Tools", "Safety & PPE", "Fasteners", "Electrical", "Cleaning", "Hand Tools"].map((c) => (
                          <label key={c} className={`flex items-center gap-2 rounded-md border p-3 cursor-pointer text-sm ${signup.interests.includes(c) ? "border-primary bg-secondary/40" : "border-border"}`}>
                            <Checkbox checked={signup.interests.includes(c)} onCheckedChange={() => toggleInterest(c)} />
                            {c}
                          </label>
                        ))}
                      </div>
                    </div>
                    <label className="flex items-start gap-2 text-sm">
                      <Checkbox checked={signup.newsletter} onCheckedChange={(v) => setS("newsletter", !!v)} className="mt-0.5" />
                      <span>Email me weekly deals and new product alerts in my categories.</span>
                    </label>
                    <p className="text-xs text-muted-foreground">By creating an account you agree to our Terms and Privacy Policy.</p>
                  </>
                )}

                <div className="flex gap-2 pt-2">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1">Back</Button>
                  )}
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary-hover" size="lg">
                    {step < 3 ? "Continue" : "Create Account"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SiteLayout>
  );
}
