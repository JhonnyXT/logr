"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Brain,
  Check,
  DollarSign,
  Dumbbell,
  Home,
  Monitor,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useXp } from "@/hooks/useXp";
import { getWeekStartDateString } from "@/lib/weekly-reset/week";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";

const CATEGORIES = [
  {
    key: "home",
    title: "Hogar",
    description: "Organiza y limpia tu espacio",
    icon: Home,
  },
  {
    key: "mind",
    title: "Mente",
    description: "Lee, aprende o medita",
    icon: Brain,
  },
  {
    key: "body",
    title: "Cuerpo",
    description: "Haz ejercicio y aliméntate bien",
    icon: Dumbbell,
  },
  {
    key: "digital",
    title: "Digital",
    description: "Limpia tu bandeja, actualiza apps",
    icon: Monitor,
  },
  {
    key: "finances",
    title: "Finanzas",
    description: "Revisa tu presupuesto y gastos",
    icon: DollarSign,
  },
  {
    key: "social",
    title: "Social",
    description: "Comunícate con alguien",
    icon: Users,
  },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

const initialChecks = (): Record<CategoryKey, boolean> => ({
  home: false,
  mind: false,
  body: false,
  digital: false,
  finances: false,
  social: false,
});

export function WeeklyResetWizard() {
  const { awardXp } = useXp();
  const [checks, setChecks] = useState<Record<CategoryKey, boolean>>(initialChecks);
  const [weekStart, setWeekStart] = useState(() => getWeekStartDateString());
  const [completedThisWeek, setCompletedThisWeek] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doneCount = useMemo(
    () => CATEGORIES.filter((c) => checks[c.key]).length,
    [checks]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const ws = getWeekStartDateString();
    setWeekStart(ws);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("weekly_resets")
      .select("id, categories, xp_awarded")
      .eq("user_id", user.id)
      .eq("week_start", ws)
      .maybeSingle();

    if (data) {
      setCompletedThisWeek(true);
      const cats = data.categories as Record<string, boolean> | null;
      if (cats && typeof cats === "object") {
        setChecks((prev) => {
          const next = { ...prev };
          for (const k of CATEGORIES) {
            if (typeof cats[k.key] === "boolean") next[k.key] = cats[k.key]!;
          }
          return next;
        });
      }
    } else {
      setCompletedThisWeek(false);
      setChecks(initialChecks());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleComplete() {
    if (doneCount < 6 || completedThisWeek) return;
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSubmitting(false);
      return;
    }

    const categories = Object.fromEntries(
      CATEGORIES.map((c) => [c.key, true])
    ) as Record<CategoryKey, boolean>;

    const { error: insertError } = await supabase.from("weekly_resets").insert({
      user_id: user.id,
      week_start: weekStart,
      categories,
      xp_awarded: 50,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    await awardXp(50, "weekly_reset", undefined, "¡Reinicio semanal completado!");
    setCompletedThisWeek(true);
    setSubmitting(false);
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted">Cargando…</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reinicio Semanal</CardTitle>
        <p className="text-sm text-muted">
          Revisa seis áreas. Completa las seis para ganar{" "}
          <span className="font-medium text-accent">50 XP</span>.
        </p>
        <div className="pt-2">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>Progreso</span>
            <span>
              {doneCount}/6 completadas
            </span>
          </div>
          <Progress value={doneCount} max={6} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {completedThisWeek ? (
          <p className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-foreground">
            Ya completado esta semana. Reinicio registrado para la semana que empieza el{" "}
            <span className="font-medium">{weekStart}</span>.
          </p>
        ) : null}

        {CATEGORIES.map(({ key, title, description, icon: Icon }) => (
          <label
            key={key}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors",
              checks[key] ? "border-accent/40 bg-accent/5" : "hover:bg-foreground/[0.03]"
            )}
          >
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
              checked={checks[key]}
              disabled={completedThisWeek}
              onChange={(e) =>
                setChecks((prev) => ({ ...prev, [key]: e.target.checked }))
              }
            />
            <div className="flex min-w-0 flex-1 gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background/80 text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-sm text-muted">{description}</p>
              </div>
            </div>
            {checks[key] ? (
              <Check className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden />
            ) : null}
          </label>
        ))}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button
          type="button"
          variant="accent"
          className="w-full sm:w-auto"
          disabled={doneCount < 6 || completedThisWeek || submitting}
          onClick={() => void handleComplete()}
        >
          {submitting ? "Guardando…" : "Completar reinicio"}
        </Button>
      </CardContent>
    </Card>
  );
}
