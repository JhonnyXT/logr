export interface LeaderboardProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  current_level: number;
}
