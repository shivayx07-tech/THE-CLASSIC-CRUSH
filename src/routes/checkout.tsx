import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Bike, Store, Smartphone, CreditCard, Banknote, Wallet, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { settingsQuery } from "@/lib/menu";
import { useCart, rememberOrder } from "@/lib/cart";
import { computeTotals, inr, quoteDelivery } from "@/lib/pricing";
import { placeOrder } from "@/lib/orders.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — The Classic Crush" },
      { name: "description", content: "Choose delivery or pickup and pay securely." },
      { property: "og:title", content: "Checkout — The Classic Crush" },
      { property: "og:description", content: "Choose delivery or pickup and pay securely." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: Checkout,
});

type Pay = "upi" | "card" | "cod" | "pay_at_cafe";

function Checkout() {
  const { data } = useSuspenseQuery(settingsQuery);
  const { settings: s, zones } = data;
  const cart = useCart();
  const navigate = useNavigate();
  const place = useServerFn(placeOrder);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [zoneId, setZoneId] = useState<string>("");
  const [line1, setLine1] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");
  const [pay, setPay] = useState<Pay>("upi");
  const [busy, setBusy] = useState(false);
  const [gateway, setGateway] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const zone = zones.find((z) => z.id === zoneId);
  const t = computeTotals(cart.subtotal, mode, mode === "delivery" ? (zone ? Number(zone.distance_km) : null) : null, s);
  const outOfRange = mode === "delivery" && zone && !quoteDelivery(Number(zone.distance_km), cart.subtotal, s).ok;

  const payOptions: { id: Pay; label: string; icon: typeof Bike; show: boolean }[] = [
    { id: "upi", label: "UPI", icon: Smartphone, show: true },
    { id: "card", label: "Card", icon: CreditCard, show: true },
    { id: "cod", label: "Cash on Delivery", icon: Banknote, show: mode === "delivery" },
    { id: "pay_at_cafe", label: "Pay at Café", icon: Wallet, show: mode === "pickup" },
  ];
  const payValid = payOptions.find((p) => p.id === pay)?.show;

  if (cart.items.length === 0)
    return (
      <div className="py-24 text-center">
        <h1 className="text-4xl font-semibold">Nothing to check out</h1>
        <Link to="/menu" className="mt-4 inline-block text-primary">Browse the menu</Link>
      </div>
    );

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e["name"] = "Please enter your name";
    if (!/^[6-9]\d{9}$/.test(phone.trim())) e["phone"] = "Enter a valid 10-digit mobile number";
    if (mode === "delivery") {
      if (!zoneId) e["zone"] = "Select your area";
      if (line1.trim().length < 3) e["line1"] = "Enter your address";
      if (!/^\d{6}$/.test(pincode.trim())) e["pincode"] = "6-digit pincode";
    }
    if (!payValid) e["pay"] = "Choose a payment method";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (!validate() || t.error) return;
    if (pay === "upi" || pay === "card") { setGateway(true); return; }
    await finalize();
  }

  async function finalize() {
    setBusy(true);
    try {
      const res = await place({
        data: {
          customer_name: name, phone, fulfillment: mode,
          zone_id: mode === "delivery" ? zoneId : null,
          address: mode === "delivery" ? { line1, landmark, pincode } : null,
          notes, payment_method: pay,
          items: cart.items.map((i) => ({ product_id: i.productId, quantity: i.qty })),
        },
      });
      if (!res.ok) { toast.error(res.error); setGateway(false); return; }
      rememberOrder(res.token);
      cart.clear();
      navigate({ to: "/order/$token", params: { token: res.token }, search: { placed: true } });
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <h1 className="text-5xl font-semibold">Checkout</h1>

        <Section n={1} title="Your details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors["name"]}><Input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></Field>
            <Field label="Mobile number" error={errors["phone"]}><Input value={phone} inputMode="numeric" maxLength={10} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile" /></Field>
          </div>
        </Section>

        <Section n={2} title="Delivery or pickup">
          <div className="grid gap-3 sm:grid-cols-2">
            <Choice active={mode === "delivery"} onClick={() => { setMode("delivery"); if (pay === "pay_at_cafe") setPay("upi"); }} icon={Bike} title="Home delivery" sub={`Within ${s.max_radius_km} km · ~${s.prep_minutes + s.delivery_minutes} min`} />
            <Choice active={mode === "pickup"} onClick={() => { setMode("pickup"); if (pay === "cod") setPay("upi"); }} icon={Store} title="Pickup from café" sub={`Ready in ~${s.prep_minutes} min`} />
          </div>
          {mode === "delivery" ? (
            <div className="mt-5 grid gap-4">
              <Field label="Your area" error={errors["zone"]}>
                <select value={zoneId} onChange={(e) => setZoneId(e.target.value)} className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm">
                  <option value="">Select area…</option>
                  {zones.filter((z) => z.is_active).map((z) => (
                    <option key={z.id} value={z.id}>{z.name} · {z.distance_km} km</option>
                  ))}
                </select>
              </Field>
              {outOfRange && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
                  Sorry, this address is outside our delivery area.
                  <Button size="sm" variant="outline" className="ml-3" onClick={() => setMode("pickup")}>Order for pickup</Button>
                </div>
              )}
              <Field label="House / street / building" error={errors["line1"]}><Input value={line1} maxLength={160} onChange={(e) => setLine1(e.target.value)} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Landmark (optional)"><Input value={landmark} maxLength={120} onChange={(e) => setLandmark(e.target.value)} /></Field>
                <Field label="Pincode" error={errors["pincode"]}><Input value={pincode} inputMode="numeric" maxLength={6} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))} /></Field>
              </div>
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-accent p-4 text-sm">Collect from <b>{s.address}</b>. We'll have it ready in about {s.prep_minutes} minutes.</p>
          )}
          <div className="mt-4"><Field label="Notes for the kitchen (optional)"><Textarea value={notes} maxLength={300} onChange={(e) => setNotes(e.target.value)} placeholder="Less spicy, cake message, etc." /></Field></div>
        </Section>

        <Section n={3} title="Payment">
          <div className="grid gap-3 sm:grid-cols-3">
            {payOptions.filter((p) => p.show).map((p) => (
              <Choice key={p.id} active={pay === p.id} onClick={() => setPay(p.id)} icon={p.icon} title={p.label} />
            ))}
          </div>
          {errors["pay"] && <p className="mt-2 text-sm text-destructive">{errors["pay"]}</p>}
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" /> Online payments run in test mode — no real money is charged.</p>
        </Section>
      </div>

      <aside className="h-fit space-y-3 rounded-2xl bg-card p-6 shadow-card lg:sticky lg:top-24">
        <h2 className="text-2xl font-semibold">Order summary</h2>
        <div className="max-h-56 space-y-2 overflow-y-auto text-sm">
          {cart.items.map((i) => (
            <div key={i.productId} className="flex justify-between"><span>{i.qty} × {i.name}</span><span>{inr(i.qty * i.price)}</span></div>
          ))}
        </div>
        <div className="gold-rule" />
        <Row l="Subtotal" r={inr(t.subtotal)} />
        {mode === "delivery" && <Row l="Delivery fee" r={zone ? (t.deliveryFee === 0 && !outOfRange ? "Free" : inr(t.deliveryFee)) : "—"} />}
        <Row l={`Taxes (${s.tax_percent}%)`} r={inr(t.tax)} />
        <div className="flex justify-between pt-2 text-xl font-bold"><span>Total</span><span>{inr(t.total)}</span></div>
        {t.error && zoneId !== "" && <p className="text-sm text-destructive">{t.error}</p>}
        {!s.is_open && <p className="text-sm text-destructive">The café is not taking orders right now.</p>}
        <Button variant="gold" size="lg" className="w-full" disabled={busy || !s.is_open || (!!t.error && (mode === "pickup" || !!zoneId))} onClick={submit}>
          {busy ? <Loader2 className="animate-spin" /> : null} Place order · {inr(t.total)}
        </Button>
      </aside>

      <Dialog open={gateway} onOpenChange={(o) => !busy && setGateway(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{pay === "upi" ? "Pay with UPI" : "Pay by card"}</DialogTitle>
            <DialogDescription>Test-mode payment for {inr(t.total)}. No money will be charged.</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-muted p-4 text-sm">
            {pay === "upi" ? <>UPI ID: <b>classiccrush@upi</b> (simulated)</> : <>Card ending •••• 4242 (simulated)</>}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" disabled={busy} onClick={() => { setGateway(false); toast.error("Payment cancelled"); }}>Cancel</Button>
            <Button variant="gold" className="flex-1" disabled={busy} onClick={finalize}>{busy && <Loader2 className="animate-spin" />} Pay {inr(t.total)}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-card p-6 shadow-card">
      <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold"><span className="grid size-8 place-items-center rounded-full bg-primary font-sans text-sm text-primary-foreground">{n}</span>{title}</h2>
      {children}
    </section>
  );
}
function Field({ label, error, children }: { label: string; error?: string | undefined; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}{error && <p className="text-xs text-destructive">{error}</p>}</div>;
}
function Choice({ active, onClick, icon: Icon, title, sub }: { active: boolean; onClick: () => void; icon: typeof Bike; title: string; sub?: string }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex items-center gap-3 rounded-xl border-2 p-4 text-left transition", active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
      <Icon className={cn("size-5", active ? "text-primary" : "text-muted-foreground")} />
      <div><div className="font-semibold">{title}</div>{sub && <div className="text-xs text-muted-foreground">{sub}</div>}</div>
    </button>
  );
}
function Row({ l, r }: { l: string; r: string }) {
  return <div className="flex justify-between text-sm"><span className="text-muted-foreground">{l}</span><span>{r}</span></div>;
}
