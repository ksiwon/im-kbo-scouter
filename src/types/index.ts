// src/types/index.ts

export interface Player {
  name: string;
  year: number;
  team?: string;
  level?: string;
  period: string;
  kbo_entry_year?: number;
  season?: number;
  
  // 기본 타격 지표
  g?: number;
  pa?: number;
  ab?: number;
  h?: number;
  '1b'?: number;
  '2b'?: number;
  '3b'?: number;
  hr?: number;
  r?: number;
  rbi?: number;
  sb?: number;
  cs?: number;
  
  // 볼넷/삼진
  bb?: number;
  ibb?: number;
  so?: number;
  hbp?: number;
  sf?: number;
  sh?: number;
  gdp?: number;
  
  // 비율 지표
  avg?: number;
  obp?: number;
  slg?: number;
  babip?: number;
  woba?: number;
  wrc_plus?: number;
  bb_pct?: number;
  k_pct?: number;
  
  // 타구 분포
  gb_pct?: number;
  ld_pct?: number;
  fb_pct?: number;
  iffb_pct?: number;
  
  // 방향성
  pull_pct?: number;
  cent_pct?: number;
  oppo_pct?: number;
  
  // 타구 강도 (일부 선수만)
  'soft%_percentage_of_balls_in_play_that_were_classified_as_hit_with_soft_speed_baseball_info_solutions'?: number;
  'med%_percentage_of_balls_in_play_that_were_classified_as_hit_with_medium_speed_baseball_info_solutions'?: number;
  'hard%_percentage_of_balls_in_play_that_were_classified_as_hit_with_hard_speed_baseball_info_solutions'?: number;
  
  // AAA 2025 추가 필드
  age?: number;
  swstr_pct?: number;
  playerid?: string | number;
  
  // 상황별 지표 (일부 선수만)
  wpa_win_probability_added?: number;
  wpa_wpa_loss_advancement?: number;
  '+wpa_win_advancement'?: number;
  re24_run_above_average_based_on_the_24_base_out_states?: number;
  rew_wins_above_average_based_on_the_24_base_out_states?: number;
  pli_average_leverage_index?: number;
  phli_average_leverage_index_while_pinch_hitting?: number;
  ph_pitch_hit_opportunities?: number;
  wpa_liwpa_li_situational_wins?: number;
  clutch_how_much_better_or_worse_a_player_does_in_high_leverage_situations_than_he_would_have_done_in_a_context_neutral_environment?: number;
  
  [key: string]: any;
}

export interface PlayerData {
  timestamp: string;
  total: number;
  players: Player[];
}

export interface KSuccessScore {
  score: number;
  predictedWrcPlus: number;
  successProbability: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  strengths: string[];
  concerns: string[];
}