"use client";

import { useMemo } from "react";
import { FileText, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { buildNoteTree } from "@/lib/notes/tree";
import { rowToNote, type NotesRow } from "@/lib/notes/map-from-row";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { Note, NoteTreeItem } from "@/types/notes";

interface NotesSidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNotesChange: (notes: Note[]) => void;
}

function TreeRow({
  item,
  depth,
  selectedId,
  onSelect,
}: {
  item: NoteTreeItem;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const active = selectedId === item.id;
  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={() => onSelect(item.id)}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
          active
            ? "bg-accent/15 text-foreground ring-1 ring-accent/30"
            : "text-muted hover:bg-foreground/5 hover:text-foreground"
        )}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        <span className="shrink-0 text-base leading-none" aria-hidden>
          {item.icon || "📄"}
        </span>
        <span className="truncate font-medium">{item.title || "Sin título"}</span>
      </button>
      {item.children.length > 0 ? (
        <div className="mt-0.5 space-y-0.5 border-l border-border/60 pl-1">
          {item.children.map((child) => (
            <TreeRow
              key={child.id}
              item={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function NotesSidebar({
  notes,
  selectedNoteId,
  onSelectNote,
  onNotesChange,
}: NotesSidebarProps) {
  const tree = useMemo(() => buildNoteTree(notes), [notes]);

  async function handleNewPage() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const maxPos =
      notes.length > 0 ? Math.max(...notes.map((n) => n.position)) + 1 : 0;

    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        parent_id: null,
        title: "Sin título",
        icon: "📄",
        content: null,
        position: maxPos,
        is_archived: false,
      })
      .select("*")
      .single();

    if (error || !data) return;
    const created = rowToNote(data as NotesRow);
    onNotesChange([...notes, created]);
    onSelectNote(created.id);
  }

  return (
    <aside
      className="flex w-[240px] shrink-0 flex-col border-r border-border bg-surface/80"
      aria-label="Notas"
    >
      <div className="border-b border-border p-3">
        <Button
          type="button"
          variant="accent"
          size="sm"
          className="w-full gap-2"
          onClick={() => void handleNewPage()}
        >
          <Plus className="h-4 w-4" />
          Nueva página
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
        {tree.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-2 py-8 text-center">
            <FileText className="h-8 w-8 text-muted" />
            <p className="text-xs text-muted">Aún no hay páginas. Crea una para empezar.</p>
          </div>
        ) : (
          tree.map((item) => (
            <TreeRow
              key={item.id}
              item={item}
              depth={0}
              selectedId={selectedNoteId}
              onSelect={onSelectNote}
            />
          ))
        )}
      </div>
    </aside>
  );
}
