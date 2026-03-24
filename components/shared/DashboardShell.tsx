"use client";

import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { getRankForLevel } from "@/lib/gamification/rank-config";
import { useSidebarStore } from "@/stores/sidebar-store";
import { DashboardStats } from "@/components/shared/DashboardStats";
import { Sidebar } from "@/components/shared/Sidebar";
import { XpBar } from "@/components/gamification/xp-bar/XpBar";
import type { DashboardDailyStats, DashboardUserProfile } from "@/types/dashboard";

const MD_MIN = 768;

interface DashboardShellProps {
  profile: DashboardUserProfile;
  stats: DashboardDailyStats;
  children: ReactNode;
}

export function DashboardShell({ profile, stats, children }: DashboardShellProps) {
  const close = useSidebarStore((s) => s.close);

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < MD_MIN) {
      close();
    }
  }, [close]);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MD_MIN}px)`);
    const apply = () => {
      if (!mq.matches) close();
    };
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [close]);

  const rankTier = getRankForLevel(profile.current_level);
  const rankName =
    typeof profile.current_rank === "string" && profile.current_rank
      ? profile.current_rank
      : rankTier.name;
  const rankColor = rankTier.color;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar userLevel={profile.current_level} profile={profile} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col pb-12">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-border/80 bg-background/95 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
            <DashboardStats
              streak={stats.streak}
              habitsToday={stats.habitsToday}
              tasksToday={stats.tasksToday}
              focusMinToday={stats.focusMinToday}
            />
          </div>

          <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </div>

      <XpBar
        totalXp={profile.total_xp}
        level={profile.current_level}
        rank={rankName}
        rankColor={rankColor}
      />
    </div>
  );
}
