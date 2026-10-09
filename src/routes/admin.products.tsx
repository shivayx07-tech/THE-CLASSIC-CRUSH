import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { menuQuery, type Product } from "@/lib/menu";
import { foodImage, imageKeys } from "@/lib/food-images";
import { inr } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/products")({ component: AdminProducts });

type Draft = Partial<Product> & { name: string; price: number; category_id: string };

function AdminProducts() {
  const qc = useQueryClient();
  const { data } = useQuery(menuQuery);
  const [edit, setEdit] = useState<Draft | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["menu"] });

  async function patch(id: string, p: Partial<Product>) {
    const { error } = await supabase.from("products").update(p).eq("id", id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }
  async function save() {
    if (!edit) return;
    if (!edit.name.trim() || !(edit.price >= 0)) { toast.error("Name and price are required"); return; }
    const row = {
      name: edit.name.trim(), price: edit.price, category_id: edit.category_id, description: edit.description ?? null,
      subgroup: edit.subgroup || null, unit: edit.unit || null, image_key: edit.image_key || "desserts",
      is_available: edit.is_available ?? true, is_bestseller: edit.is_bestseller ?? false, is_veg: edit.is_veg ?? true,
    };
    const { error } = edit.id ? await supabase.from("products").update(row).eq("id", edit.id) : await supabase.from("products").insert(row);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    setEdit(null);
    refresh();
  }
  async function del(id: string) {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }

  if (!data) return null;
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-semibold">Menu</h1>
        <Button variant="gold" onClick={() => setEdit({ name: "", price: 0, category_id: data.categories[0]?.id ?? "", is_available: true, is_veg: true })}><Plus /> Add item</Button>
      </div>
      {data.categories.map((c) => (
        <section key={c.id} className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">{c.name}</h2>
          <div className="divide-y rounded-2xl bg-card shadow-card">
            {data.products.filter((p) => p.category_id === c.id).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3">
                <img src={foodImage(p.image_key)} alt="" width={48} height={48} loading="lazy" className="size-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{p.name}</div>
                  <div className="text-sm text-muted-foreground">{inr(p.price)}{p.is_bestseller ? " · Best seller" : ""}</div>
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch checked={p.is_available} onCheckedChange={(v) => patch(p.id, { is_available: v })} /> {p.is_available ? "Available" : "Sold out"}
                </label>
                <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEdit({ ...p })}><Pencil /></Button>
                <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => del(p.id)}><Trash2 /></Button>
              </div>
            ))}
          </div>
        </section>
      ))}

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display text-2xl">{edit?.id ? "Edit item" : "New item"}</DialogTitle></DialogHeader>
          {edit && (
            <div className="space-y-3">
              <div className="space-y-1"><Label>Name</Label><Input value={edit.name} maxLength={80} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Price (₹)</Label><Input type="number" min={0} value={edit.price} onChange={(e) => setEdit({ ...edit, price: Number(e.target.value) })} /></div>
                <div className="space-y-1"><Label>Unit (optional)</Label><Input value={edit.unit ?? ""} placeholder="per kg" onChange={(e) => setEdit({ ...edit, unit: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Category</Label>
                  <select className="h-10 w-full rounded-md border bg-card px-2 text-sm" value={edit.category_id} onChange={(e) => setEdit({ ...edit, category_id: e.target.value })}>
                    {data.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1"><Label>Sub-group</Label><Input value={edit.subgroup ?? ""} onChange={(e) => setEdit({ ...edit, subgroup: e.target.value })} /></div>
              </div>
              <div className="space-y-1"><Label>Description</Label><Textarea value={edit.description ?? ""} maxLength={300} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></div>
              <div className="space-y-1"><Label>Photo</Label>
                <div className="grid grid-cols-7 gap-2">
                  {imageKeys.filter((k) => k !== "quickbites").map((k) => (
                    <button key={k} type="button" onClick={() => setEdit({ ...edit, image_key: k })} className={`overflow-hidden rounded-lg border-2 ${edit.image_key === k ? "border-primary" : "border-transparent"}`}>
                      <img src={foodImage(k)} alt={k} width={48} height={48} loading="lazy" className="aspect-square w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-5 pt-2 text-sm">
                <label className="flex items-center gap-2"><Switch checked={edit.is_available ?? true} onCheckedChange={(v) => setEdit({ ...edit, is_available: v })} /> Available</label>
                <label className="flex items-center gap-2"><Switch checked={edit.is_bestseller ?? false} onCheckedChange={(v) => setEdit({ ...edit, is_bestseller: v })} /> Best seller</label>
                <label className="flex items-center gap-2"><Switch checked={edit.is_veg ?? true} onCheckedChange={(v) => setEdit({ ...edit, is_veg: v })} /> Veg</label>
              </div>
              <Button variant="gold" className="w-full" onClick={save}>Save</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
