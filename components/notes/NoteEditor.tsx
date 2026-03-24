"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { noteContentToPlainText, plainTextToNoteContent } from "@/lib/notes/plain-content";
import { cn } from "@/lib/utils/cn";
import type { Note } from "@/types/notes";

interface NoteEditorProps {
  note: Note | null;
  onNoteUpdated: (note: Note) => void;
}

export function NoteEditor({ note, onNoteUpdated }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const titleRef = useRef(title);
  const bodyRef = useRef(body);
  titleRef.current = title;
  bodyRef.current = body;

  const lastSavedRef = useRef({ title: "", body: "" });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(
    async (noteId: string, nextTitle: string, nextBody: string) => {
      if (
        nextTitle === lastSavedRef.current.title &&
        nextBody === lastSavedRef.current.body
      ) {
        return;
      }

      setSaveStatus("saving");
      const supabase = createClient();
      const trimmed = nextTitle.trim() || "Sin título";
      const content = plainTextToNoteContent(nextBody);

      const { data, error } = await supabase
        .from("notes")
        .update({
          title: trimmed,
          content,
        })
        .eq("id", noteId)
        .select("*")
        .single();

      if (error) {
        setSaveStatus("idle");
        return;
      }

      lastSavedRef.current = { title: trimmed, body: nextBody };
      setSaveStatus("saved");
      const row = data as {
        id: string;
        user_id: string;
        parent_id: string | null;
        title: string;
        icon: string | null;
        content: unknown;
        position: number | null;
        is_archived: boolean | null;
        created_at: string;
        updated_at: string;
      };
      onNoteUpdated({
        id: row.id,
        userId: row.user_id,
        parentId: row.parent_id ?? undefined,
        title: row.title,
        icon: row.icon ?? "📄",
        content: row.content as Note["content"],
        position: row.position ?? 0,
        isArchived: row.is_archived ?? false,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
    [onNoteUpdated]
  );

  useEffect(() => {
    if (note) {
      const t = note.title;
      const b = noteContentToPlainText(note.content);
      setTitle(t);
      setBody(b);
      lastSavedRef.current = { title: t, body: b };
    } else {
      setTitle("");
      setBody("");
      lastSavedRef.current = { title: "", body: "" };
    }
  }, [note?.id]);

  useEffect(() => {
    const id = note?.id;
    return () => {
      if (!id) return;
      void persist(id, titleRef.current, bodyRef.current);
    };
  }, [note?.id, persist]);

  useEffect(() => {
    if (!note) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void persist(note.id, titleRef.current, bodyRef.current);
    }, 2000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [title, body, note, persist]);

  const handleBlur = () => {
    if (!note) return;
    void persist(note.id, titleRef.current, bodyRef.current);
  };

  if (!note) {
    return (
      <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background/40 p-8 text-center">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">Ninguna nota seleccionada</p>
          <p className="text-sm text-muted">Selecciona una nota del menú lateral</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          className={cn(
            "min-w-0 flex-1 border-none bg-transparent text-xl font-semibold text-foreground",
            "placeholder:text-muted focus:outline-none focus:ring-0"
          )}
          placeholder="Sin título"
          aria-label="Título de la nota"
        />
        <span className="shrink-0 text-xs text-muted" aria-live="polite">
          {saveStatus === "saving" ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Guardando…
            </span>
          ) : saveStatus === "saved" ? (
            "Guardado"
          ) : null}
        </span>
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onBlur={handleBlur}
        className={cn(
          "min-h-[min(60vh,520px)] w-full flex-1 resize-none rounded-lg border border-border bg-background/60 p-4",
          "text-sm leading-relaxed text-foreground placeholder:text-muted",
          "focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
        )}
        placeholder="Escribe algo… (texto plano por ahora; editor enriquecido más adelante)"
        aria-label="Contenido de la nota"
      />
    </div>
  );
}
