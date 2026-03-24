import type { NoteContent } from "@/types/notes";

/** Almacena texto plano como documento mínimo compatible con NoteContent (sin TipTap). */
export function plainTextToNoteContent(text: string): NoteContent {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: text ? [{ type: "text", text }] : [],
      },
    ],
  };
}

export function noteContentToPlainText(content: unknown): string {
  if (content == null) return "";
  if (typeof content === "object" && content !== null && "plain" in content) {
    const p = (content as { plain?: unknown }).plain;
    if (typeof p === "string") return p;
  }
  function walk(node: unknown): string {
    if (node == null) return "";
    if (typeof node === "object" && node !== null) {
      const o = node as Record<string, unknown>;
      if (typeof o.text === "string") return o.text;
      if (Array.isArray(o.content)) return o.content.map(walk).join("");
    }
    return "";
  }
  return walk(content);
}
