import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRankForLevel } from "@/lib/gamification/rank-config";
import { DashboardShell } from "@/components/shared/DashboardShell";
import type { DashboardDailyStats, DashboardUserProfile } from "@/types/dashboard";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: row } = await supabase
    .from("profiles")
    .select(
      "id, username, full_name, avatar_url, total_xp, current_level, current_rank, current_streak"
    )
    .eq("id", user.id)
    .maybeSingle();

  const level = row?.current_level ?? 1;
  const rankTier = getRankForLevel(level);

  const profile: DashboardUserProfile = row
    ? {
        id: row.id,
        username: row.username,
        full_name: row.full_name,
        avatar_url: row.avatar_url,
        total_xp: row.total_xp ?? 0,
        current_level: row.current_level ?? 1,
        current_rank: row.current_rank ?? rankTier.name,
        current_streak: row.current_streak ?? 0,
      }
    : {
        id: user.id,
        username: null,
        full_name: null,
        avatar_url: null,
        total_xp: 0,
        current_level: 1,
        current_rank: rankTier.name,
        current_streak: 0,
      };

  const stats: DashboardDailyStats = {
    streak: profile.current_streak,
    habitsToday: 0,
    tasksToday: 0,
    focusMinToday: 0,
  };

  return (
    <DashboardShell profile={profile} stats={stats}>
      {children}
    </DashboardShell>
  );
}
