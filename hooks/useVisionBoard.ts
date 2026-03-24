"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { VisionBoardItemType } from "@/types/vision-board";

const DEBOUNCE_MS = 600;

export function useVisionBoardItem(type: VisionBoardItemType) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["vision-board", type],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("vision_board_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("item_type", type)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as {
        id: string;
        content: string | null;
        title: string | null;
      } | null;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: { content?: string; title?: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: existing, error: fetchError } = await supabase
        .from("vision_board_items")
        .select("id")
        .eq("user_id", user.id)
        .eq("item_type", type)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing?.id) {
        const { error } = await supabase
          .from("vision_board_items")
          .update({
            content: payload.content ?? null,
            title: payload.title ?? null,
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("vision_board_items").insert({
          user_id: user.id,
          item_type: type,
          content: payload.content ?? null,
          title: payload.title ?? null,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vision-board", type] });
    },
  });

  return {
    row: query.data,
    isLoading: query.isLoading,
    save: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
  };
}

/** Single text field synced to vision_board_items.content with debounced save */
export function useVisionTextField(
  row: { content: string | null } | null,
  isLoading: boolean,
  save: (payload: { content: string }) => Promise<unknown>
) {
  const [text, setText] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const lastSaved = useRef<string | null>(null);
  const saveRef = useRef(save);
  saveRef.current = save;

  useEffect(() => {
    if (isLoading) return;
    if (!hydrated) {
      setText(row?.content ?? "");
      lastSaved.current = row?.content ?? "";
      setHydrated(true);
    }
  }, [row, isLoading, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (lastSaved.current === null) {
      lastSaved.current = text;
      return;
    }
    if (text === lastSaved.current) return;

    setSaveStatus("idle");
    const t = setTimeout(() => {
      void (async () => {
        setSaveStatus("saving");
        try {
          await saveRef.current({ content: text });
          lastSaved.current = text;
          setSaveStatus("saved");
        } catch {
          setSaveStatus("error");
        }
      })();
    }, DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [text, hydrated]);

  return { text, setText, saveStatus, hydrated };
}

/** Three text fields stored as JSON array in content */
export function useOdysseyFields(
  row: { content: string | null } | null,
  isLoading: boolean,
  save: (payload: { content: string }) => Promise<unknown>
) {
  const [paths, setPaths] = useState<[string, string, string]>(["", "", ""]);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const lastSaved = useRef<string | null>(null);
  const saveRef = useRef(save);
  saveRef.current = save;

  useEffect(() => {
    if (isLoading) return;
    if (!hydrated) {
      let parsed: [string, string, string] = ["", "", ""];
      if (row?.content) {
        try {
          const arr = JSON.parse(row.content) as unknown;
          if (Array.isArray(arr) && arr.length >= 3) {
            parsed = [String(arr[0] ?? ""), String(arr[1] ?? ""), String(arr[2] ?? "")];
          }
        } catch {
          parsed = ["", "", ""];
        }
      }
      setPaths(parsed);
      lastSaved.current = JSON.stringify(parsed);
      setHydrated(true);
    }
  }, [row, isLoading, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const serialized = JSON.stringify(paths);
    if (lastSaved.current === null) {
      lastSaved.current = serialized;
      return;
    }
    if (serialized === lastSaved.current) return;

    setSaveStatus("idle");
    const t = setTimeout(() => {
      void (async () => {
        setSaveStatus("saving");
        try {
          await saveRef.current({ content: serialized });
          lastSaved.current = serialized;
          setSaveStatus("saved");
        } catch {
          setSaveStatus("error");
        }
      })();
    }, DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [paths, hydrated]);

  return { paths, setPaths, saveStatus, hydrated };
}

export function useBucketListItems() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["vision-board", "bucket_list"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("vision_board_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("item_type", "bucket_list")
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data ?? []) as {
        id: string;
        title: string | null;
        is_done: boolean;
        position: number;
      }[];
    },
  });

  const addItem = useMutation({
    mutationFn: async (title: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const rows = query.data ?? [];
      const nextPos =
        rows.length === 0 ? 0 : Math.max(...rows.map((r) => r.position)) + 1;

      const { error } = await supabase.from("vision_board_items").insert({
        user_id: user.id,
        item_type: "bucket_list",
        title: title.trim(),
        position: nextPos,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vision-board", "bucket_list"] });
    },
  });

  const toggleDone = useMutation({
    mutationFn: async ({ id, isDone }: { id: string; isDone: boolean }) => {
      const { error } = await supabase
        .from("vision_board_items")
        .update({ is_done: isDone })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vision-board", "bucket_list"] });
    },
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    addItem,
    toggleDone,
  };
}

export function useStableSaveCallback(
  save: (payload: { content: string }) => Promise<unknown>
) {
  const ref = useRef(save);
  ref.current = save;
  return useCallback(async (payload: { content: string }) => {
    return ref.current(payload);
  }, []);
}
