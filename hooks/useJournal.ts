"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toDateString } from "@/lib/utils/date";
import type { JournalEntry, JournalEntryType } from "@/types/journal";

export function useJournal(date?: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const targetDate = date ?? toDateString(new Date());

  const entriesQuery = useQuery({
    queryKey: ["journal", targetDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("entry_date", targetDate)
        .order("entry_type", { ascending: true });
      if (error) throw error;
      return data as JournalEntry[];
    },
  });

  const saveEntry = useMutation({
    mutationFn: async (entry: {
      entryType: JournalEntryType;
      moodScore?: number;
      content: string;
      promptUsed?: string;
    }) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("journal_entries").upsert(
        {
          user_id: user.id,
          entry_date: targetDate,
          entry_type: entry.entryType,
          mood_score: entry.moodScore,
          content: entry.content,
          prompt_used: entry.promptUsed,
        },
        { onConflict: "user_id,entry_date,entry_type" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal", targetDate] });
    },
  });

  return {
    entries: entriesQuery.data ?? [],
    isLoading: entriesQuery.isLoading,
    saveEntry,
  };
}
