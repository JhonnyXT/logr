"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useXpNotificationStore } from "@/stores/xp-notification-store";
import { xpProgress } from "@/lib/gamification/xp-engine";
import type { XpSource } from "@/types/gamification";

export function useXp() {
  const addNotification = useXpNotificationStore((s) => s.addNotification);

  const awardXp = useCallback(
    async (
      amount: number,
      source: XpSource,
      sourceId?: string,
      message = "¡Acción completada!"
    ) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("total_xp, current_level")
        .eq("id", user.id)
        .single();

      const oldLevel = profile?.current_level ?? 1;

      await supabase.from("xp_transactions").insert({
        user_id: user.id,
        amount,
        source,
        source_id: sourceId,
      });

      const newTotalXp = (profile?.total_xp ?? 0) + amount;
      const { currentLevel: newLevel } = xpProgress(newTotalXp);

      addNotification({
        amount,
        source,
        message,
        levelUp: newLevel > oldLevel ? newLevel : undefined,
      });
    },
    [addNotification]
  );

  return { awardXp };
}
