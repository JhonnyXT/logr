"use client";

import { Flame, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/contexts/locale-context";

type ActivityItem =
  | { id: string; icon: typeof Flame; type: "streak"; user: string; days: number }
  | { id: string; icon: typeof Sparkles; type: "level"; user: string; level: number };

const PLACEHOLDER_ITEMS: ActivityItem[] = [
  { id: "1", icon: Flame, type: "streak", user: "Alex", days: 14 },
  { id: "2", icon: Sparkles, type: "level", user: "Jordan", level: 12 },
  { id: "3", icon: Flame, type: "streak", user: "Sam", days: 7 },
  { id: "4", icon: Sparkles, type: "level", user: "Taylor", level: 8 },
];

export function ActivityFeed() {
  const { t } = useLocale();

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-base">{t.leaderboard.recentActivity}</CardTitle>
        <p className="text-xs text-muted">Feed en vivo próximamente — datos de ejemplo por ahora.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {PLACEHOLDER_ITEMS.map((item) => {
          const text =
            item.type === "streak"
              ? `${item.user} ${t.leaderboard.streakMsg1} ${item.days} ${t.leaderboard.streakMsg2}`
              : `${item.user} ${t.leaderboard.levelMsg} ${item.level}`;
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex gap-3 rounded-lg border border-border/80 bg-background/40 px-3 py-2.5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm leading-snug text-foreground">{text}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
