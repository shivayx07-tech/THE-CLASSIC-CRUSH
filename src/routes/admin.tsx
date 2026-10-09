import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LayoutDashboard, UtensilsCrossed, Settings, LogOut, Loader2, Store } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Café Admin — The Classic Crush" },
      { name: "description", content: "Manage orders, menu and delivery settings." },
      { property: "og:title", content: "Café Admin — The Classic Crush" },
      { property: "og:description", content: "Staff dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  if (session === undefined || (session && isAdmin === null))
    return <div className="grid min-h-screen place-items-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  if (!session) return <AdminLogin />;
  if (!isAdmin)
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <h1 className="text-3xl font-semibold">No staff access</h1>
          <p className="mt-2 text-muted-foreground">{session.user.email} is not an admin account.</p>
          <Button className="mt-4" variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </div>
      </div>
    );

  const links = [
    { to: "/admin", label: "Orders", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Menu", icon: UtensilsCrossed, exact: false },
    { to: "/admin/settings", label: "Settings", icon: Settings, exact: false },
  ] as const;

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="bg-sidebar p-4 text-sidebar-foreground md:min-h-screen">
        <div className="mb-6 flex items-center justify-between md:block"><Logo light /></div>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: l.exact }} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent" activeProps={{ className: "bg-sidebar-accent text-sidebar-primary font-semibold" }}>
              <l.icon className="size-4" /> {l.label}
            </Link>
          ))}
          <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent"><Store className="size-4" /> View site</Link>
          <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-sidebar-accent"><LogOut className="size-4" /> Sign out</button>
        </nav>
      </aside>
      <div className="min-w-0 p-4 md:p-8"><Outlet /></div>
    </div>
  );
}

function AdminLogin() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    if (mode === "up" && !res.data.session) toast.success("Check your email to confirm your account, then sign in.");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-forest-gradient px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl bg-card p-8 shadow-lift">
        <Logo />
        <h1 className="text-3xl font-semibold">{mode === "in" ? "Staff sign in" : "Create staff account"}</h1>
        <div className="space-y-1.5"><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1.5"><Label>Password</Label><Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" variant="gold" className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}{mode === "in" ? "Sign in" : "Create account"}</Button>
        <button type="button" className="w-full text-center text-sm text-primary" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "First time? Create the staff account" : "Have an account? Sign in"}
        </button>
        <p className="text-xs text-muted-foreground">The first account created becomes the café admin.</p>
      </form>
    </div>
  );
}
