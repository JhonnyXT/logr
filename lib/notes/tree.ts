import type { Note, NoteTreeItem } from "@/types/notes";

export function buildNoteTree(notes: Note[]): NoteTreeItem[] {
  const map = new Map<string, NoteTreeItem>();
  for (const n of notes) {
    map.set(n.id, { ...n, children: [] });
  }
  const roots: NoteTreeItem[] = [];
  for (const n of map.values()) {
    const parentId = n.parentId;
    if (parentId && map.has(parentId)) {
      map.get(parentId)!.children.push(n);
    } else {
      roots.push(n);
    }
  }
  function sortTree(items: NoteTreeItem[]) {
    items.sort((a, b) => a.position - b.position || a.title.localeCompare(b.title));
    for (const item of items) sortTree(item.children);
  }
  sortTree(roots);
  return roots;
}
