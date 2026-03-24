import type { Note } from "@/types/notes";

export type NotesRow = {
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

export function rowToNote(row: NotesRow): Note {
  return {
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
  };
}
