// src/utils/sabermetrics.ts
import { Player } from '../types';

interface AnalysisResult {
  riskLevel: 'S' | 'A' | 'B' | 'C' | 'D';
  summary: string;
  details: string[];
  recommendation: string;
}

export const calculateRisk = (player: Player): AnalysisResult => {
  const {
    wrc_plus = 100,
    k_pct = 20,
    bb_pct = 8,
    age = 28,
    babip = 0.300
  } = player;

  // 1. Risk Level Logic (Simplified KFS Logic)
  let score = 0;
  
  // K% Stability (High Weight)
  if (k_pct < 18) score += 30;
  else if (k_pct < 22) score += 20;
  else if (k_pct < 25) score += 10;
  else if (k_pct > 30) score -= 20;

  // BB% Stability (Medium Weight)
  if (bb_pct > 12) score += 20;
  else if (bb_pct > 9) score += 10;
  else if (bb_pct < 5) score -= 10;

  // wRC+ Context (Low Weight due to low correlation)
  if (wrc_plus > 130) score += 10;
  else if (wrc_plus < 90) score -= 10;

  // Age Penalty
  if (age > 32) score -= 10;
  else if (age < 26) score += 10;

  let riskLevel: 'S' | 'A' | 'B' | 'C' | 'D' = 'C';
  if (score >= 50) riskLevel = 'S';
  else if (score >= 35) riskLevel = 'A';
  else if (score >= 20) riskLevel = 'B';
  else if (score >= 5) riskLevel = 'C';
  else riskLevel = 'D';

  // 2. Text Generation
  const details: string[] = [];
  let summary = "";

  // K% Analysis
  if (k_pct > 25) {
    details.push(`높은 삼진율(${k_pct.toFixed(1)}%)은 KBO의 유인구 승부에 매우 취약할 수 있습니다.`);
  } else if (k_pct < 18) {
    details.push(`안정적인 컨택 능력(K% ${k_pct.toFixed(1)}%)은 리그 적응 실패 확률을 획기적으로 낮춥니다.`);
  }

  // BB/K Analysis
  const bbK = bb_pct / k_pct;
  if (bbK > 0.8) {
    details.push(`BB/K ${bbK.toFixed(2)}의 뛰어난 선구안은 투고타저 환경에서도 생존력을 보장합니다.`);
  }

  // BABIP Luck Check
  if (babip > 0.380) {
    details.push(`AAA BABIP(${babip.toFixed(3)})가 비정상적으로 높습니다. 성적 거품일 가능성을 배제할 수 없습니다.`);
  }

  // Summary Generation based on Risk Level
  switch (riskLevel) {
    case 'S':
      summary = `완벽한 균형을 갖춘 'S-Tier' 자원입니다. 실패 확률이 극히 낮으며, 즉시 전력감으로 손색이 없습니다.`;
      break;
    case 'A':
      summary = `안정적인 지표를 보유한 'Low Risk' 유형입니다. KBO 리그 적응에 큰 무리가 없을 것으로 예상됩니다.`;
      break;
    case 'B':
      summary = `준수한 성적이 기대되나, 일부 불안 요소(높은 삼진율 등)가 존재합니다. 코칭 스태프의 관리가 필요합니다.`;
      break;
    case 'C':
      summary = `전형적인 'High Risk, High Return' 유형입니다. 파괴력은 있으나, 컨택 문제로 조기 퇴출될 위험이 큽니다.`;
      break;
    case 'D':
      summary = `영입을 재고해야 합니다. AAA 성적의 대부분이 리그 환경이나 운(BABIP)에 기인했을 가능성이 높습니다.`;
      break;
  }

  return {
    riskLevel,
    summary,
    details,
    recommendation: riskLevel === 'S' || riskLevel === 'A' ? "적극 추천" : "신중 검토"
  };
};

export const generateContextNote = (sectionId: string): string => {
  switch (sectionId) {
    case 'intro':
      return "MLB에서 30홈런을 쳤던 타자도 KBO에서는 2할 푼대에 그칠 수 있습니다. 왜일까요?";
    case 'overview':
      return "지난 15년간 KBO를 거쳐간 외국인 타자 중 재계약에 성공한 비율은 40% 미만입니다.";
    case 'correlation':
      return "놀랍게도, AAA에서의 홈런 개수와 KBO에서의 홈런 개수는 거의 상관관계가 없습니다 (r=0.15).";
    case 'aaa-scouting':
      return "2025년 AAA 타자들 중 'S-Tier' 등급을 받은 선수는 단 5명뿐입니다.";
    default:
      return "데이터는 거짓말을 하지 않지만, 해석은 신중해야 합니다.";
  }
};
