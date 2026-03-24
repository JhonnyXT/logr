/** TipTap / ProseMirror document JSON (avoid coupling to @tiptap/react when not installed). */
export type NoteContent = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: NoteContent[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
};

export interface Note {
  id: string;
  userId: string;
  parentId?: string;
  title: string;
  icon: string;
  content?: NoteContent;
  position: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteTreeItem extends Note {
  children: NoteTreeItem[];
}
