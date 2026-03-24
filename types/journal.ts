export type JournalEntryType = "morning" | "evening";

export interface JournalEntry {
  id: string;
  userId: string;
  entryDate: string;
  entryType: JournalEntryType;
  moodScore?: number;
  content?: string;
  promptUsed?: string;
  xpReward: number;
  createdAt: string;
}

export const MOOD_EMOJIS: Record<number, string> = {
  1: "😞",
  2: "😔",
  3: "😕",
  4: "😐",
  5: "🙂",
  6: "😊",
  7: "😄",
  8: "😁",
  9: "🤩",
  10: "🥳",
};

export const MORNING_PROMPTS = [
  "¿Cuáles son tus 3 prioridades del día?",
  "¿Qué haría que hoy fuera un gran día?",
  "¿Por qué estás agradecido esta mañana?",
  "¿Cómo quieres sentirte al final del día?",
  "¿Qué puedes hacer hoy por tu yo del futuro?",
];

export const EVENING_PROMPTS = [
  "¿Qué salió bien hoy?",
  "¿Qué aprendiste hoy?",
  "¿Qué podrías haber hecho mejor?",
  "¿Por qué estás agradecido de hoy?",
  "¿Cómo creciste hoy?",
];
