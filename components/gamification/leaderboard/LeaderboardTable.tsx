"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { LeaderboardProfile } from "@/types/leaderboard";

interface LeaderboardTableProps {
  entries: LeaderboardProfile[];
  startRank: number;
}

export function LeaderboardTable({ entries, startRank }: LeaderboardTableProps) {
  if (entries.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface/40">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Puesto</th>
            <th className="px-4 py-3 font-medium">Usuario</th>
            <th className="px-4 py-3 font-medium text-right">Nivel</th>
            <th className="px-4 py-3 font-medium text-right">XP</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((row, i) => {
            const rank = startRank + i;
            const label = row.full_name?.trim() || row.username;
            return (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-border/60 last:border-0",
                  "hover:bg-foreground/[0.03]"
                )}
              >
                <td className="px-4 py-3 align-middle">
                  <Badge variant="outline" className="font-mono">
                    #{rank}
                  </Badge>
                </td>
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-foreground">
                      {label.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{row.username}</p>
                      {row.full_name ? (
                        <p className="truncate text-xs text-muted">{row.full_name}</p>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right align-middle text-muted">{row.current_level}</td>
                <td className="px-4 py-3 text-right align-middle font-medium text-foreground tabular-nums">
                  {row.total_xp.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
