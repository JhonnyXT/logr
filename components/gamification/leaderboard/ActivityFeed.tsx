"use client";

import { Flame, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PLACEHOLDER_ITEMS = [
  { id: "1", icon: Flame, text: "Alex logró una racha de 14 días" },
  { id: "2", icon: Sparkles, text: "Jordan alcanzó el Nivel 12" },
  { id: "3", icon: Flame, text: "Sam logró una racha de 7 días" },
  { id: "4", icon: Sparkles, text: "Taylor alcanzó el Nivel 8" },
] as const;

export function ActivityFeed() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-base">Actividad Reciente</CardTitle>
        <p className="text-xs text-muted">Feed en vivo próximamente — datos de ejemplo por ahora.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {PLACEHOLDER_ITEMS.map(({ id, icon: Icon, text }) => (
          <div
            key={id}
            className="flex gap-3 rounded-lg border border-border/80 bg-background/40 px-3 py-2.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-sm leading-snug text-foreground">{text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
