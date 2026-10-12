import { Link, useRouterState } from "@tanstack/react-router";
import { Home, UtensilsCrossed, ShoppingBag, Receipt } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home, exact: true, hasBadge: false },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed, exact: false, hasBadge: false },
  { to: "/cart", label: "Cart", icon: ShoppingBag, exact: true, hasBadge: true },
  { to: "/orders", label: "Orders", icon: Receipt, exact: false, hasBadge: false },
] as const;

export function MobileBottomNav() {
  const { count } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hide on admin routes
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed inset-x-0 bottom-0 z-50 block border-t border-border/80 bg-[#f8f5ee]/95 px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] shadow-[0_-4px_24px_rgba(14,58,35,0.07)] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.exact
            ? pathname === tab.to
            : pathname === tab.to || pathname.startsWith(`${tab.to}/`);

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                "group relative flex min-w-[4rem] flex-1 flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95",
                isActive ? "text-primary font-bold" : "text-muted-foreground/80 hover:text-primary",
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "size-5.5 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "stroke-[2.4] text-primary" : "stroke-[1.8]",
                  )}
                />
                {tab.hasBadge && count > 0 && (
                  <span className="absolute -right-2.5 -top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-gold px-1 text-[0.62rem] font-extrabold text-gold-foreground shadow-xs animate-in zoom-in-50 duration-200">
                    {count}
                  </span>
                )}
              </div>
              <span className="mt-1 text-[0.68rem] tracking-tight transition-colors duration-200">
                {tab.label}
              </span>
              {isActive ? (
                <span className="mt-0.5 h-1 w-3 rounded-full bg-gold transition-all duration-300" />
              ) : (
                <span className="mt-0.5 h-1 w-1 rounded-full bg-transparent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
