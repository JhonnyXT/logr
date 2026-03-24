"use client";

import { useXpNotificationStore } from "@/stores/xp-notification-store";
import { cn } from "@/lib/utils/cn";
import { Sparkles, TrendingUp } from "lucide-react";

export function XpToastContainer() {
  const notifications = useXpNotificationStore((s) => s.notifications);
  const removeNotification = useXpNotificationStore((s) => s.removeNotification);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed right-4 top-4 z-[200] flex flex-col gap-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={cn(
            "flex items-center gap-3 rounded-xl border border-accent/30 bg-surface px-4 py-3 shadow-lg shadow-accent/10",
            "animate-in slide-in-from-right-5 fade-in-0 duration-300"
          )}
          role="status"
          aria-live="polite"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15">
            {notif.levelUp ? (
              <TrendingUp className="h-4 w-4 text-accent" />
            ) : (
              <Sparkles className="h-4 w-4 text-accent" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-accent">
              +{notif.amount} XP
            </p>
            <p className="truncate text-xs text-muted">{notif.message}</p>
            {notif.levelUp && (
              <p className="text-xs font-medium text-foreground">
                ¡Subiste de nivel! Llegaste al nivel {notif.levelUp}
              </p>
            )}
          </div>
          <button
            onClick={() => removeNotification(notif.id)}
            className="ml-2 text-muted hover:text-foreground"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
