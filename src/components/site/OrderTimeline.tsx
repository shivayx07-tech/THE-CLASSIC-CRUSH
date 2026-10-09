import { Check } from "lucide-react";
import { DELIVERY_FLOW, PICKUP_FLOW, STATUS_LABEL } from "@/lib/menu";
import { cn } from "@/lib/utils";

export function OrderTimeline({
  status,
  fulfillment,
  events,
}: {
  status: string;
  fulfillment: string;
  events: { status: string; created_at: string }[];
}) {
  if (status === "cancelled")
    return (
      <p className="rounded-xl bg-destructive/10 p-4 font-semibold text-destructive">
        This order was cancelled.
      </p>
    );
  const flow = fulfillment === "pickup" ? PICKUP_FLOW : DELIVERY_FLOW;
  const idx = flow.indexOf(status);
  return (
    <ol className="space-y-0">
      {flow.map((st, i) => {
        const done = i <= idx;
        const ev = events.find((e) => e.status === st);
        const label =
          st === "ready" && fulfillment === "pickup" ? "Ready for pickup" : STATUS_LABEL[st];
        return (
          <li key={st} className="relative flex gap-4 pb-6 last:pb-0">
            {i < flow.length - 1 && (
              <span
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5",
                  i < idx ? "bg-primary" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-full border-2",
                done
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card",
                i === idx && "ring-4 ring-gold/30",
              )}
            >
              {done ? (
                <Check className="size-4" />
              ) : (
                <span className="size-2 rounded-full bg-border" />
              )}
            </span>
            <div className="pt-1">
              <div className={cn("font-semibold", !done && "text-muted-foreground")}>{label}</div>
              {ev && (
                <div className="text-xs text-muted-foreground">
                  {new Date(ev.created_at).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
