import { createClient } from "@/lib/supabase/server";
import { getT } from "@/lib/i18n/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { ActivityFeed } from "@/components/gamification/leaderboard/ActivityFeed";
import { LeaderboardPodium } from "@/components/gamification/leaderboard/LeaderboardPodium";
import { LeaderboardTable } from "@/components/gamification/leaderboard/LeaderboardTable";
import type { LeaderboardProfile } from "@/types/leaderboard";

export default async function LeaderboardPage() {
  const t = await getT();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, total_xp, current_level")
    .eq("is_public", true)
    .order("total_xp", { ascending: false })
    .limit(20);

  const rows = (data ?? []) as LeaderboardProfile[];
  const topThree = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title={t.leaderboard.pageTitle}
        description={t.leaderboard.pageDesc}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-8">
          <section aria-label="Tres primeros">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">
              {t.leaderboard.monthlyLeaders}
            </h2>
            <LeaderboardPodium topThree={topThree} />
          </section>
          <section aria-label="Clasificación">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">
              {t.leaderboard.moreRankings}
            </h2>
            <LeaderboardTable entries={rest} startRank={4} />
          </section>
        </div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <ActivityFeed />
        </aside>
      </div>
    </div>
  );
}
