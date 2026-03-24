"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LockedFeatureGate } from "@/components/shared/LockedFeatureGate";
import { PageHeader } from "@/components/shared/PageHeader";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { NotesSidebar } from "@/components/notes/NotesSidebar";
import { rowToNote, type NotesRow } from "@/lib/notes/map-from-row";
import type { Note } from "@/types/notes";

export default function NotesPage() {
  const [userLevel, setUserLevel] = useState(1);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .order("position", { ascending: true });

    if (error) {
      setNotes([]);
      setLoading(false);
      return;
    }
    const list = (data as NotesRow[]).map(rowToNote);
    setNotes(list);
    setSelectedNoteId((prev) => {
      if (prev && list.some((n) => n.id === prev)) return prev;
      return list[0]?.id ?? null;
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadLevel() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const { data } = await supabase
        .from("profiles")
        .select("current_level")
        .eq("id", user.id)
        .maybeSingle();
      if (!cancelled) setUserLevel(data?.current_level ?? 1);
    }
    void loadLevel();
    void loadNotes();
    return () => {
      cancelled = true;
    };
  }, [loadNotes]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null;

  const handleNoteUpdated = useCallback((updated: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  }, []);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Notas"
        description="Captura ideas en un espacio sencillo — se desbloquea en el nivel 7."
      />

      <LockedFeatureGate featureKey="notes" userLevel={userLevel}>
        {loading ? (
          <p className="text-sm text-muted">Cargando notas…</p>
        ) : (
          <div className="flex min-h-[min(70vh,640px)] overflow-hidden rounded-xl border border-border bg-surface/50">
            <NotesSidebar
              notes={notes}
              selectedNoteId={selectedNoteId}
              onSelectNote={setSelectedNoteId}
              onNotesChange={setNotes}
            />
            <div className="min-h-0 min-w-0 flex-1 p-4 sm:p-6">
              <NoteEditor note={selectedNote} onNoteUpdated={handleNoteUpdated} />
            </div>
          </div>
        )}
      </LockedFeatureGate>
    </div>
  );
}
