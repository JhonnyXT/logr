export type VisionBoardItemType =
  | "eulogy"
  | "bucket_list"
  | "mission_statement"
  | "definition_of_success"
  | "odyssey_plan"
  | "future_calendar";

export interface VisionBoardItem {
  id: string;
  userId: string;
  itemType: VisionBoardItemType;
  title?: string;
  content?: string;
  imageUrl?: string;
  isDone: boolean;
  position: number;
  createdAt: string;
}
