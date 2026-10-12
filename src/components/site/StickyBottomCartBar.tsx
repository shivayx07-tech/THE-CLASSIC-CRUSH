import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/pricing";

export function StickyBottomCartBar() {
  const { count, subtotal } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hide on cart, checkout, or admin routes
  const isHiddenPage =
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname.startsWith("/admin");

  const shouldShow = count > 0 && !isHiddenPage;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="fixed bottom-[calc(4.5rem+max(env(safe-area-inset-bottom),0.35rem))] left-3 right-3 z-40 md:bottom-6 md:left-auto md:right-6 md:w-96"
        >
          <Link
            to="/cart"
            className="group flex h-14 items-center justify-between rounded-2xl border border-gold/40 bg-[#0e3a23] px-4 py-2 text-forest-foreground shadow-[0_12px_36px_rgba(14,58,35,0.38)] transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
            aria-label="View your cart"
          >
            <div className="flex items-center gap-3">
              <div className="relative grid size-10 place-items-center rounded-xl bg-gold/20 text-gold">
                <ShoppingBag className="size-5" />
                <span className="absolute -right-1 -top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-gold px-1 text-[0.62rem] font-black text-gold-foreground">
                  {count}
                </span>
              </div>
              <div className="text-left leading-tight">
                <div className="text-[0.72rem] font-semibold uppercase tracking-wider text-gold">
                  {count} {count === 1 ? "item added" : "items added"}
                </div>
                <div className="font-display text-base font-bold text-cream">
                  {inr(subtotal)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-gold-gradient px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold-foreground shadow-sm transition-transform duration-300 group-hover:translate-x-0.5">
              <span>View Cart</span>
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
