"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useUserLevel() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["user-level"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return 1;

      const { data, error } = await supabase
        .from("profiles")
        .select("current_level")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data?.current_level ?? 1;
    },
  });
}
