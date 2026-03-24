"use client";

import { useState } from "react";
import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { LeaderboardProfile } from "@/types/leaderboard";

interface LeaderboardPodiumProps {
  topThree: LeaderboardProfile[];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0] + parts[1]![0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "?";
}

function PodiumCard({
  profile,
  rank,
  className,
  barClass,
  crownClass,
}: {
  profile: LeaderboardProfile;
  rank: 1 | 2 | 3;
  className?: string;
  barClass: string;
  crownClass: string;
}) {
  const label = profile.full_name?.trim() || profile.username;
  const showImg = Boolean(profile.avatar_url && profile.avatar_url.length > 0);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 text-center",
        rank === 1 ? "order-2 sm:order-none" : rank === 2 ? "order-1 sm:order-none" : "order-3 sm:order-none",
        className
      )}
    >
      <div
        className={cn(
          "relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 text-lg font-semibold",
          crownClass
        )}
      >
        {rank === 1 ? (
          <Crown className="absolute -top-2 left-1/2 h-6 w-6 -translate-x-1/2 text-amber-400" />
        ) : null}
        {showImg && !imgError ? (
          <img
            src={profile.avatar_url!}
            alt=""
            width={64}
            height={64}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-foreground">{initials(label)}</span>
        )}
      </div>
      <Badge
        variant="outline"
        className={cn(
          "border-0 text-xs font-semibold",
          rank === 1 && "bg-amber-500/20 text-amber-300",
          rank === 2 && "bg-slate-400/20 text-slate-200",
          rank === 3 && "bg-amber-800/40 text-amber-200/90"
        )}
      >
        #{rank}
      </Badge>
      <p className="max-w-[140px] truncate text-sm font-medium text-foreground">{profile.username}</p>
      <p className="text-xs text-muted">{profile.total_xp.toLocaleString()} XP</p>
      <div
        className={cn(
          "mt-2 w-full rounded-t-lg transition-colors",
          barClass,
          rank === 1 ? "h-28" : rank === 2 ? "h-20" : "h-16"
        )}
        aria-hidden
      />
    </div>
  );
}

export function LeaderboardPodium({ topThree }: LeaderboardPodiumProps) {
  const [second, first, third] = [
    topThree[1],
    topThree[0],
    topThree[2],
  ] as const;

  if (!first) {
    return (
      <p className="rounded-xl border border-border bg-surface/60 px-4 py-8 text-center text-sm text-muted">
        Aún no hay perfiles públicos. Activa «Perfil público» en Ajustes para aparecer aquí.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:items-end sm:gap-4">
      {second ? (
        <PodiumCard
          key={second.id}
          profile={second}
          rank={2}
          barClass="bg-gradient-to-t from-slate-500/40 to-slate-400/20"
          crownClass="border-slate-300/80 bg-surface"
        />
      ) : (
        <div className="hidden sm:block" />
      )}
      <PodiumCard
        key={first.id}
        profile={first}
        rank={1}
        barClass="bg-gradient-to-t from-amber-500/50 to-amber-400/25"
        crownClass="border-amber-400/90 bg-surface ring-2 ring-amber-400/30"
      />
      {third ? (
        <PodiumCard
          key={third.id}
          profile={third}
          rank={3}
          barClass="bg-gradient-to-t from-amber-900/50 to-amber-800/25"
          crownClass="border-amber-700/80 bg-surface"
        />
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
}
