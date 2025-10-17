// src/types/index.ts

export interface Player {
  name: string;
  year: number;
  team?: string;
  level?: string;
  period: string;
  kbo_entry_year: number;
  season?: number;
  g_games_played?: number;
  pa?: number;
  hr?: number;
  r_runs?: number;
  rbi_runs_batted_in?: number;
  sb_stolen_bases?: number;
  bb?: number;
  k?: number;
  avg?: number;
  babip?: number;
  obp?: number;
  slg?: number;
  woba?: number;
  'wrc+'?: number;
  ab?: number;
  h?: number;
  '1b_singles'?: number;
  '2b_doubles'?: number;
  '3b_triples'?: number;
  b_walks?: number;
  ibb_intentional_walks?: number;
  so?: number;
  hbp_hit_by_pitch?: number;
  sf_sacrifice_fly?: number;
  sh_sacrifice_hit?: number;
  gdp_ground_into_double_play?: number;
  cs_caught_stealing?: number;
  'bb%'?: number;
  'k%'?: number;
  'gb%'?: number;
  'ld%'?: number;
  'fb%'?: number;
  'iffb%'?: number;
  'pull%'?: number;
  'cent%'?: number;
  'oppo%'?: number;
}

export interface PlayerData {
  timestamp: string;
  total: number;
  players: Player[];
}