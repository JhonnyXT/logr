import { notFound } from "next/navigation";
import { ActivityGrid } from "@/components/gamification/activity-grid/ActivityGrid";
import { LevelBadge } from "@/components/gamification/xp-bar/LevelBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRankColor } from "@/lib/gamification/rank-config";
import { createClient } from "@/lib/supabase/server";
import { formatXp } from "@/lib/utils/format-xp";
import { cn } from "@/lib/utils/cn";
import type { ActivityDay } from "@/types/gamification";
import type { Metadata } from "next";

const BADGE_CATEGORY_LABEL: Record<string, string> = {
  habit: "Hábito",
  focus: "Enfoque",
  task: "Tarea",
  level: "Nivel",
  social: "Social",
  special: "Especial",
};

type ProfileRow = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  current_rank: string;
  current_level: number;
  total_xp: number;
};

type ActivityRow = {
  date: string;
  xp_earned: number;
  actions_count: number;
};

type BadgeRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  category: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("username, full_name, bio, is_public")
    .eq("username", username)
    .maybeSingle();

  if (!data?.is_public) {
    return { title: "Perfil" };
  }

  const title = data.full_name?.trim()
    ? `${data.full_name} (@${data.username})`
    : `@${data.username}`;
  return {
    title,
    description: data.bio ?? `Perfil público de ${data.username}`,
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "id, username, full_name, avatar_url, bio, current_rank, current_level, total_xp, is_public"
    )
    .eq("username", username)
    .maybeSingle();

  if (error || !profile || !profile.is_public) {
    notFound();
  }

  const p = profile as ProfileRow & { is_public: boolean };

  const [{ data: activityRows }, { data: userBadgeRows }] = await Promise.all([
    supabase
      .from("activity_logs")
      .select("date, xp_earned, actions_count")
      .eq("user_id", p.id)
      .order("date", { ascending: true }),
    supabase
      .from("user_badges")
      .select("badge_id, earned_at")
      .eq("user_id", p.id)
      .order("earned_at", { ascending: false }),
  ]);

  const badgeRows = userBadgeRows ?? [];
  const badgeIds = [...new Set(badgeRows.map((r) => r.badge_id))];
  let badges: BadgeRow[] = [];
  if (badgeIds.length > 0) {
    const { data: badgeData } = await supabase
      .from("badges")
      .select("id, slug, name, description, icon_url, category")
      .in("id", badgeIds);
    const byId = new Map(
      (badgeData ?? []).map((b) => [b.id as string, b as BadgeRow])
    );
    badges = badgeRows
      .map((ub) => byId.get(ub.badge_id))
      .filter((b): b is BadgeRow => Boolean(b));
  }

  const activityData: ActivityDay[] = (activityRows ?? []).map((row: ActivityRow) => ({
    date: row.date,
    xpEarned: row.xp_earned,
    actionsCount: row.actions_count,
  }));

  const rankColor = getRankColor(p.current_level);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <Card className="overflow-hidden border-border/60">
        <CardHeader className="flex flex-row items-start gap-6 pb-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-border bg-muted">
            {p.avatar_url ? (
              p.avatar_url.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.avatar_url}
                  alt=""
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-4xl">
                  {p.avatar_url}
                </span>
              )
            ) : (
              <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted">
                {p.username.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="text-2xl font-semibold">
                {p.full_name?.trim() || p.username}
              </CardTitle>
              <LevelBadge level={p.current_level} rankColor={rankColor} />
            </div>
            <p className="text-sm text-muted">@{p.username}</p>
            <p className="text-xs uppercase tracking-wide text-muted">
              {p.current_rank}
            </p>
            {p.bio ? (
              <p className="pt-1 text-sm leading-relaxed text-foreground/90">
                {p.bio}
              </p>
            ) : null}
            <p className="text-sm tabular-nums text-muted">
              <span className="font-medium text-foreground">
                {formatXp(p.total_xp)}
              </span>{" "}
              XP total
            </p>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <ActivityGrid data={activityData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Insignias</CardTitle>
        </CardHeader>
        <CardContent>
          {badges.length === 0 ? (
            <p className="text-sm text-muted">Aún no hay insignias públicas.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {badges.map((b) => (
                <li
                  key={b.slug}
                  className="flex gap-3 rounded-lg border border-border/60 bg-background/50 p-3"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-xl"
                    aria-hidden
                  >
                    {b.icon_url ?? "🏅"}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium leading-tight">{b.name}</p>
                    {b.description ? (
                      <p className="mt-0.5 text-xs text-muted">{b.description}</p>
                    ) : null}
                    <p
                      className={cn(
                        "mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide",
                        b.category === "habit" && "bg-emerald-500/15 text-emerald-600",
                        b.category === "focus" && "bg-sky-500/15 text-sky-600",
                        b.category === "task" && "bg-amber-500/15 text-amber-700",
                        b.category === "level" && "bg-violet-500/15 text-violet-600",
                        b.category === "social" && "bg-blue-500/15 text-blue-600",
                        b.category === "special" && "bg-fuchsia-500/15 text-fuchsia-600"
                      )}
                    >
                      {BADGE_CATEGORY_LABEL[b.category] ?? b.category}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
