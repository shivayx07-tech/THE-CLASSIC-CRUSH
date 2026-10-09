import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery, type Settings, type Zone } from "@/lib/menu";
import type { DeliverySlab } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [s, setS] = useState<Settings | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [newZone, setNewZone] = useState({ name: "", distance_km: "" });

  useEffect(() => { if (data) { setS(data.settings); setZones(data.zones); } }, [data]);
  if (!s) return null;

  const refresh = () => qc.invalidateQueries({ queryKey: ["settings"] });
  const num = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => setS({ ...s, [k]: Number(e.target.value) });
  const txt = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => setS({ ...s, [k]: e.target.value });

  async function save() {
    const slabs = [...s!.delivery_slabs].sort((a, b) => a.max_km - b.max_km);
    const { error } = await supabase.from("settings").update({
      cafe_name: s!.cafe_name, phone_primary: s!.phone_primary, phone_secondary: s!.phone_secondary, address: s!.address,
      opening_hours: s!.opening_hours, is_open: s!.is_open, delivery_slabs: slabs, max_radius_km: s!.max_radius_km,
      free_delivery_threshold: s!.free_delivery_threshold, min_order_value: s!.min_order_value, tax_percent: s!.tax_percent,
      prep_minutes: s!.prep_minutes, delivery_minutes: s!.delivery_minutes, instagram_url: s!.instagram_url,
    }).eq("id", 1);
    if (error) { toast.error(error.message); return; }
    toast.success("Settings saved");
    refresh();
  }
  const setSlab = (i: number, p: Partial<DeliverySlab>) => setS({ ...s, delivery_slabs: s.delivery_slabs.map((x, j) => (j === i ? { ...x, ...p } : x)) });

  async function addZone() {
    const d = Number(newZone.distance_km);
    if (!newZone.name.trim() || !(d > 0)) { toast.error("Enter area name and distance"); return; }
    const { error } = await supabase.from("delivery_zones").insert({ name: newZone.name.trim(), distance_km: d });
    if (error) { toast.error(error.message); return; }
    setNewZone({ name: "", distance_km: "" });
    refresh();
  }
  async function zonePatch(id: string, p: Partial<Zone>) {
    const { error } = await supabase.from("delivery_zones").update(p).eq("id", id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }
  async function zoneDel(id: string) {
    const { error } = await supabase.from("delivery_zones").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-4xl font-semibold">Settings</h1>

      <Card title="Café">
        <label className="flex items-center gap-3"><Switch checked={s.is_open} onCheckedChange={(v) => setS({ ...s, is_open: v })} /> Accepting orders</label>
        <div className="grid gap-3 sm:grid-cols-2">
          <F l="Café name"><Input value={s.cafe_name} onChange={txt("cafe_name")} /></F>
          <F l="Opening hours"><Input value={s.opening_hours} onChange={txt("opening_hours")} /></F>
          <F l="Phone 1"><Input value={s.phone_primary} onChange={txt("phone_primary")} /></F>
          <F l="Phone 2"><Input value={s.phone_secondary ?? ""} onChange={txt("phone_secondary")} /></F>
        </div>
        <F l="Address"><Input value={s.address} onChange={txt("address")} /></F>
        <F l="Instagram link"><Input value={s.instagram_url ?? ""} onChange={txt("instagram_url")} /></F>
      </Card>

      <Card title="Delivery & pricing">
        <div className="grid gap-3 sm:grid-cols-3">
          <F l="Max radius (km)"><Input type="number" value={s.max_radius_km} onChange={num("max_radius_km")} /></F>
          <F l="Minimum order (₹)"><Input type="number" value={s.min_order_value} onChange={num("min_order_value")} /></F>
          <F l="Free delivery above (₹)"><Input type="number" value={s.free_delivery_threshold} onChange={num("free_delivery_threshold")} /></F>
          <F l="Tax %"><Input type="number" value={s.tax_percent} onChange={num("tax_percent")} /></F>
          <F l="Prep time (min)"><Input type="number" value={s.prep_minutes} onChange={num("prep_minutes")} /></F>
          <F l="Delivery time (min)"><Input type="number" value={s.delivery_minutes} onChange={num("delivery_minutes")} /></F>
        </div>
        <div>
          <Label>Delivery fee by distance</Label>
          <div className="mt-2 space-y-2">
            {s.delivery_slabs.map((sl, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                up to <Input className="w-20" type="number" value={sl.max_km} onChange={(e) => setSlab(i, { max_km: Number(e.target.value) })} /> km →
                ₹<Input className="w-20" type="number" value={sl.fee} onChange={(e) => setSlab(i, { fee: Number(e.target.value) })} />
                <Button size="icon" variant="ghost" aria-label="Remove" onClick={() => setS({ ...s, delivery_slabs: s.delivery_slabs.filter((_, j) => j !== i) })}><Trash2 /></Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => setS({ ...s, delivery_slabs: [...s.delivery_slabs, { max_km: Number(s.max_radius_km), fee: 50 }] })}><Plus /> Add slab</Button>
          </div>
        </div>
      </Card>
      <Button variant="gold" size="lg" onClick={save}>Save settings</Button>

      <Card title="Delivery areas">
        <p className="text-sm text-muted-foreground">Customers pick one of these areas at checkout; its distance decides the fee.</p>
        <div className="divide-y">
          {zones.map((z) => (
            <div key={z.id} className="flex items-center gap-3 py-2 text-sm">
              <span className="flex-1">{z.name}</span>
              <span>{z.distance_km} km</span>
              <Switch checked={z.is_active} onCheckedChange={(v) => zonePatch(z.id, { is_active: v })} />
              <Button size="icon" variant="ghost" aria-label="Delete area" onClick={() => zoneDel(z.id)}><Trash2 /></Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="Area name" value={newZone.name} onChange={(e) => setNewZone({ ...newZone, name: e.target.value })} />
          <Input className="w-28" type="number" placeholder="km" value={newZone.distance_km} onChange={(e) => setNewZone({ ...newZone, distance_km: e.target.value })} />
          <Button onClick={addZone}><Plus /> Add</Button>
        </div>
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-4 rounded-2xl bg-card p-6 shadow-card"><h2 className="text-2xl font-semibold">{title}</h2>{children}</section>;
}
function F({ l, children }: { l: string; children: React.ReactNode }) {
  return <div className="space-y-1"><Label>{l}</Label>{children}</div>;
}
