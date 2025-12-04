// src/utils/sabermetrics.ts
import { Player } from '../types';

// ==========================================
// 선수 유형 분류 시스템 (Player Archetype System)
// ==========================================

export type PlayerArchetype = 
  | 'TRAP'      // 함정 카드: 화려한 성적, 높은 실패 위험
  | 'SAFE'      // 안전 자산: 폭발력은 적지만 실패 확률 낮음
  | 'POWER'     // 복권형 거포: 파워는 확실, 컨택이 불안
  | 'ELITE'     // S-Tier: 모든 지표가 우수
  | 'AVERAGE';  // 평균형: 특별한 강점/약점 없음

export interface PlayerTypeAnalysis {
  archetype: PlayerArchetype;
  archetypeKorean: string;
  archetypeIcon: string;
  headline: string;
  analysis: string;
  riskFactors: string[];
  strengths: string[];
}

export interface AnalysisResult {
  riskLevel: 'S' | 'A' | 'B' | 'C' | 'D';
  summary: string;
  details: string[];
  recommendation: string;
  playerType: PlayerTypeAnalysis;
}

// ==========================================
// 데이터 기반 임계값 (AAA 2025 데이터 분석 결과)
// ==========================================
const THRESHOLDS = {
  // K% (삼진율) 기준 - 낮을수록 좋음
  K_PCT: {
    ELITE: 18,      // 상위 25%
    GOOD: 22,       // 평균
    RISKY: 25,      // 위험
    CRITICAL: 30,   // 매우 위험
  },
  // BB% (볼넷율) 기준 - 높을수록 좋음
  BB_PCT: {
    ELITE: 12,      // 상위 25%
    GOOD: 9,        // 평균
    POOR: 6,        // 미흡
  },
  // BB/K 비율 - 높을수록 좋음
  BB_K_RATIO: {
    ELITE: 0.8,     // 뛰어남
    GOOD: 0.5,      // 양호
    SAFE: 0.4,      // 안정적
  },
  // wRC+ 기준
  WRC_PLUS: {
    ELITE: 140,     // MVP급
    GOOD: 120,      // 우수
    AVERAGE: 100,   // 리그 평균
    POOR: 85,       // 미흡
  },
  // HR 기준 (시즌 기준, PA 조정 필요할 수 있음)
  HR: {
    POWER: 15,      // 파워 히터
    AVERAGE: 10,    // 평균
  },
  // BABIP 기준 - 지나치게 높으면 운
  BABIP: {
    LUCKY: 0.370,   // 행운 의존
    SUSTAINABLE: 0.320, // 지속 가능
  },
  // 나이 기준
  AGE: {
    YOUNG: 26,      // 적응력 높음
    PRIME: 30,      // 전성기
    OLD: 32,        // 하락세
  },
};

// ==========================================
// 선수 유형 분류 함수
// ==========================================
export const classifyPlayerType = (player: Player): PlayerTypeAnalysis => {
  const {
    wrc_plus = 100,
    k_pct = 20,
    bb_pct = 8,
    hr = 10,
    babip = 0.300,
  } = player;

  const bbK = bb_pct / Math.max(k_pct, 1);

  // 💎 ELITE (S-Tier) - 약점이 없는 육각형 타자
  if (
    k_pct <= THRESHOLDS.K_PCT.ELITE &&
    bb_pct >= THRESHOLDS.BB_PCT.GOOD &&
    wrc_plus >= THRESHOLDS.WRC_PLUS.GOOD
  ) {
    return {
      archetype: 'ELITE',
      archetypeKorean: 'S-Tier 엘리트',
      archetypeIcon: '💎',
      headline: '완벽한 균형, 즉시 전력감',
      analysis: `선구안과 컨택, 파워가 완벽한 균형을 이룹니다. 삼진율 ${k_pct.toFixed(1)}%는 리그 상위권이며, 볼넷 비율 ${bb_pct.toFixed(1)}%는 투수와의 승부에서 결코 밀리지 않음을 증명합니다. 적응기 없이 즉시 전력감으로 활약할 확률이 매우 높습니다.`,
      riskFactors: [],
      strengths: [
        '뛰어난 선구안 (BB% ' + bb_pct.toFixed(1) + '%)',
        '안정적인 컨택 능력 (K% ' + k_pct.toFixed(1) + '%)',
        '검증된 종합 생산력 (wRC+ ' + wrc_plus + ')',
      ],
    };
  }

  // ⚠️ TRAP (함정 카드) - AAA 성적은 좋지만 KBO에서 실패할 확률 높음
  if (
    wrc_plus >= THRESHOLDS.WRC_PLUS.GOOD &&
    k_pct >= THRESHOLDS.K_PCT.RISKY
  ) {
    return {
      archetype: 'TRAP',
      archetypeKorean: '함정 카드',
      archetypeIcon: '⚠️',
      headline: '화려한 성적 이면의 위험 신호',
      analysis: `표면적인 성적(wRC+ ${wrc_plus})은 화려하지만, 위험 신호가 감지됩니다. 삼진율 ${k_pct.toFixed(1)}%는 KBO의 집요한 유인구 승부에 매우 취약할 수 있음을 시사합니다. AAA에서의 성공이 KBO에서 보장되지 않는 전형적인 사례입니다.`,
      riskFactors: [
        '높은 삼진율 (K% ' + k_pct.toFixed(1) + '%)은 KBO 변화구에 취약',
        'wRC+ 과대평가 가능성 - AAA 리그 환경 의존적 지표',
        babip >= THRESHOLDS.BABIP.LUCKY ? 'BABIP ' + babip.toFixed(3) + ' - 운에 의존한 성적 거품 가능성' : '',
      ].filter(Boolean),
      strengths: [
        'AAA 수준에서 검증된 파괴력',
      ],
    };
  }

  // ✅ SAFE (안전 자산) - 폭발력은 적어도 망하지 않는 유형
  if (
    bbK >= THRESHOLDS.BB_K_RATIO.SAFE &&
    k_pct <= THRESHOLDS.K_PCT.GOOD
  ) {
    return {
      archetype: 'SAFE',
      archetypeKorean: '안전 자산',
      archetypeIcon: '✅',
      headline: '눈야구의 달인, 실패 확률 극히 낮음',
      analysis: `뛰어난 볼삼비(BB/K ${bbK.toFixed(2)})를 보유했습니다. 슬럼프가 와도 눈야구로 1인분을 해줄 수 있는, 실패 확률이 극히 낮은 유형입니다. KBO 투수들의 유인구 승부에서 흔들리지 않고 자신의 존(zone)을 지킬 수 있습니다.`,
      riskFactors: [],
      strengths: [
        '뛰어난 볼삼비 (BB/K ' + bbK.toFixed(2) + ')',
        '안정적인 컨택율 (K% ' + k_pct.toFixed(1) + '%)',
        '리그 적응 실패 확률 낮음',
      ],
    };
  }

  // 💪 POWER (복권형 거포) - 파워는 확실하나 컨택이 불안
  if (
    hr >= THRESHOLDS.HR.POWER &&
    k_pct >= THRESHOLDS.K_PCT.CRITICAL
  ) {
    return {
      archetype: 'POWER',
      archetypeKorean: '복권형 거포',
      archetypeIcon: '💪',
      headline: '담장 넘기기 능력은 확실, 컨택이 변수',
      analysis: `확실한 담장 넘기기 능력(${hr}HR)을 보유했습니다. 하지만 높은 삼진율(K% ${k_pct.toFixed(1)}%)이 발목을 잡을 수 있습니다. 코칭스태프의 타격 교정 능력이 성공의 열쇠입니다. 터지면 대박, 안 터지면 "선풍기"가 될 리스크가 있습니다.`,
      riskFactors: [
        '매우 높은 삼진율 (K% ' + k_pct.toFixed(1) + '%)',
        'KBO 변화구에 적응 실패 시 "선풍기" 위험',
        '코칭스태프 역량에 성패가 달림',
      ],
      strengths: [
        '검증된 장타력 (' + hr + 'HR)',
        '터지면 리그 폭격 가능',
      ],
    };
  }

  // ⚖️ AVERAGE (평균형) - 특별한 강점/약점 없음
  return {
    archetype: 'AVERAGE',
    archetypeKorean: '평균형',
    archetypeIcon: '⚖️',
    headline: '무난한 성적, 적응이 변수',
    analysis: `특별히 돋보이는 강점도, 치명적인 약점도 없는 평균형 타자입니다. wRC+ ${wrc_plus}, K% ${k_pct.toFixed(1)}%의 지표는 리그 평균 수준입니다. KBO 리그 적응에 따라 성패가 갈릴 수 있으며, 안정적인 1인분보다는 기대 이하의 결과가 나올 확률도 존재합니다.`,
    riskFactors: [
      '차별화된 강점 부재',
      '적응 변수에 따른 성패 불확실',
    ],
    strengths: [
      '심각한 결격 사유 없음',
    ],
  };
};

// ==========================================
// 리스크 레벨 계산 (기존 함수 개선)
// ==========================================
export const calculateRisk = (player: Player): AnalysisResult => {
  const {
    wrc_plus = 100,
    k_pct = 20,
    bb_pct = 8,
    age = 28,
    babip = 0.300,
    hr = 10,
  } = player;

  const bbK = bb_pct / Math.max(k_pct, 1);

  // 점수 계산 (0-100 스케일)
  let score = 50; // 기본 점수

  // K% 안정성 (가장 높은 가중치 - KBO 상관관계 0.50)
  if (k_pct < THRESHOLDS.K_PCT.ELITE) score += 25;
  else if (k_pct < THRESHOLDS.K_PCT.GOOD) score += 15;
  else if (k_pct < THRESHOLDS.K_PCT.RISKY) score += 5;
  else if (k_pct >= THRESHOLDS.K_PCT.CRITICAL) score -= 20;
  else score -= 10;

  // BB% 안정성 (중간 가중치)
  if (bb_pct >= THRESHOLDS.BB_PCT.ELITE) score += 15;
  else if (bb_pct >= THRESHOLDS.BB_PCT.GOOD) score += 8;
  else if (bb_pct < THRESHOLDS.BB_PCT.POOR) score -= 8;

  // BB/K 비율 보너스
  if (bbK >= THRESHOLDS.BB_K_RATIO.ELITE) score += 10;
  else if (bbK >= THRESHOLDS.BB_K_RATIO.GOOD) score += 5;

  // wRC+ (낮은 가중치 - KBO 상관관계 -0.12)
  if (wrc_plus >= THRESHOLDS.WRC_PLUS.ELITE) score += 8;
  else if (wrc_plus >= THRESHOLDS.WRC_PLUS.GOOD) score += 4;
  else if (wrc_plus < THRESHOLDS.WRC_PLUS.POOR) score -= 5;

  // 파워 보너스
  if (hr >= THRESHOLDS.HR.POWER) score += 5;

  // BABIP 페널티 (운 의존)
  if (babip >= THRESHOLDS.BABIP.LUCKY) score -= 8;

  // 나이 조정
  if (age < THRESHOLDS.AGE.YOUNG) score += 5;
  else if (age > THRESHOLDS.AGE.OLD) score -= 8;

  // 점수를 0-100 범위로 클램핑
  score = Math.max(0, Math.min(100, score));

  // 등급 결정
  let riskLevel: 'S' | 'A' | 'B' | 'C' | 'D';
  if (score >= 75) riskLevel = 'S';
  else if (score >= 60) riskLevel = 'A';
  else if (score >= 45) riskLevel = 'B';
  else if (score >= 30) riskLevel = 'C';
  else riskLevel = 'D';

  // 선수 유형 분석
  const playerType = classifyPlayerType(player);

  // 상세 분석 텍스트 생성
  const details: string[] = [];

  // K% 분석
  if (k_pct >= THRESHOLDS.K_PCT.CRITICAL) {
    details.push(`⚠️ 삼진율 ${k_pct.toFixed(1)}%는 심각한 위험 신호입니다. KBO의 유인구 승부에 매우 취약할 수 있습니다.`);
  } else if (k_pct >= THRESHOLDS.K_PCT.RISKY) {
    details.push(`⚠️ 삼진율 ${k_pct.toFixed(1)}%는 주의가 필요합니다. 적응기에 고전할 가능성이 있습니다.`);
  } else if (k_pct <= THRESHOLDS.K_PCT.ELITE) {
    details.push(`✅ 안정적인 컨택 능력(K% ${k_pct.toFixed(1)}%)은 리그 적응 실패 확률을 획기적으로 낮춥니다.`);
  }

  // BB/K 분석
  if (bbK >= THRESHOLDS.BB_K_RATIO.ELITE) {
    details.push(`✅ BB/K ${bbK.toFixed(2)}의 뛰어난 선구안은 투고타저 환경에서도 생존력을 보장합니다.`);
  } else if (bbK < 0.3) {
    details.push(`⚠️ BB/K ${bbK.toFixed(2)}는 공격적인 성향을 보여주나, 슬럼프 시 무너질 위험이 있습니다.`);
  }

  // BABIP 분석
  if (babip >= THRESHOLDS.BABIP.LUCKY) {
    details.push(`⚠️ BABIP ${babip.toFixed(3)}가 비정상적으로 높습니다. 성적 거품일 가능성을 배제할 수 없습니다.`);
  }

  // 나이 분석
  if (age > THRESHOLDS.AGE.OLD) {
    details.push(`⚠️ ${age}세는 새로운 리그 적응에 불리할 수 있습니다.`);
  } else if (age < THRESHOLDS.AGE.YOUNG) {
    details.push(`✅ ${age}세의 젊은 나이는 적응력과 성장 가능성 면에서 유리합니다.`);
  }

  // 요약 생성
  let summary: string;
  switch (riskLevel) {
    case 'S':
      summary = `💎 ${playerType.archetypeKorean} - ${playerType.headline}. 실패 확률이 극히 낮으며, 즉시 전력감으로 손색이 없습니다.`;
      break;
    case 'A':
      summary = `✅ ${playerType.archetypeKorean} - 안정적인 지표를 보유한 'Low Risk' 유형입니다. KBO 리그 적응에 큰 무리가 없을 것으로 예상됩니다.`;
      break;
    case 'B':
      summary = `⚖️ ${playerType.archetypeKorean} - 준수한 성적이 기대되나, 일부 불안 요소가 존재합니다. 코칭 스태프의 관리가 필요합니다.`;
      break;
    case 'C':
      summary = `⚠️ ${playerType.archetypeKorean} - 전형적인 'High Risk, High Return' 유형입니다. 파괴력은 있으나, 조기 퇴출될 위험이 큽니다.`;
      break;
    case 'D':
      summary = `❌ ${playerType.archetypeKorean} - 영입을 재고해야 합니다. AAA 성적의 대부분이 리그 환경이나 운(BABIP)에 기인했을 가능성이 높습니다.`;
      break;
  }

  return {
    riskLevel,
    summary,
    details,
    recommendation: riskLevel === 'S' || riskLevel === 'A' ? '적극 추천' : riskLevel === 'B' ? '신중 검토' : '비추천',
    playerType,
  };
};

// ==========================================
// Deep Dive 분석 텍스트 생성
// ==========================================
export const generateDeepDiveAnalysis = (player: Player): {
  title: string;
  paragraphs: string[];
  verdict: string;
} => {
  const analysis = calculateRisk(player);
  const { playerType } = analysis;
  const { wrc_plus = 100, k_pct = 20, bb_pct = 8, age = 28 } = player;

  const paragraphs: string[] = [];

  // 첫 번째 문단: 유형별 핵심 분석
  paragraphs.push(playerType.analysis);

  // 두 번째 문단: 리스크 요인 또는 강점
  if (playerType.riskFactors.length > 0) {
    paragraphs.push(`🚨 리스크 요인: ${playerType.riskFactors.join(' / ')}`);
  }
  if (playerType.strengths.length > 0) {
    paragraphs.push(`💪 강점: ${playerType.strengths.join(' / ')}`);
  }

  // 세 번째 문단: 맥락 분석
  const contextParagraph: string[] = [];
  if (wrc_plus >= 130 && k_pct >= 25) {
    contextParagraph.push(`wRC+ ${wrc_plus}의 화려한 성적에 현혹되기 쉽지만, 데이터는 냉정합니다. AAA wRC+와 KBO 성적의 상관계수는 -0.12에 불과합니다.`);
  }
  if (k_pct <= 18 && bb_pct >= 10) {
    contextParagraph.push(`K% ${k_pct.toFixed(1)}%, BB% ${bb_pct.toFixed(1)}%의 조합은 KBO에서 가장 성공 확률이 높은 프로필입니다. 삼진율과 KBO 성적의 상관계수는 0.50으로 매우 높습니다.`);
  }
  if (contextParagraph.length > 0) {
    paragraphs.push(contextParagraph.join(' '));
  }

  // 최종 판정
  let verdict: string;
  switch (analysis.riskLevel) {
    case 'S':
      verdict = `🏆 최종 판정: 적극 영입 추천. ${age}세의 ${player.name}은(는) KBO에서 즉시 전력감으로 활약할 것으로 예상됩니다.`;
      break;
    case 'A':
      verdict = `✅ 최종 판정: 영입 추천. 안정적인 활약이 기대되며, 실패 확률이 낮습니다.`;
      break;
    case 'B':
      verdict = `⚖️ 최종 판정: 조건부 추천. 코칭스태프의 역량에 따라 성패가 갈릴 수 있습니다.`;
      break;
    case 'C':
      verdict = `⚠️ 최종 판정: 신중한 검토 필요. 높은 리스크를 감수할 준비가 되어 있다면 도전해볼 만합니다.`;
      break;
    case 'D':
      verdict = `❌ 최종 판정: 영입 비추천. 다른 대안을 찾는 것이 현명합니다.`;
      break;
  }

  return {
    title: `${playerType.archetypeIcon} ${player.name} - ${playerType.archetypeKorean}`,
    paragraphs,
    verdict,
  };
};

// ==========================================
// 섹션별 Context Note 생성 (기존 함수 확장)
// ==========================================
export const generateContextNote = (sectionId: string): string => {
  switch (sectionId) {
    case 'intro':
      return '매년 수억 원의 연봉을 받고 KBO에 오는 외국인 타자들. 하지만 그들 중 절반 이상이 1년을 채우지 못하고 짐을 쌉니다. 왜일까요?';
    
    case 'overview':
      return '지난 15년간 KBO를 거쳐간 외국인 타자 중 재계약에 성공한 비율은 40% 미만입니다. 우리가 믿었던 "미국에서 잘 쳤으니 한국에서도 통한다"는 가설은 틀렸습니다.';
    
    case 'failure':
      return '루크 스캇, 모터, 그리고 수많은 "거포들"의 실패. 그들의 공통점은 무엇이었을까요? AAA에서 30홈런을 쳤던 타자도 KBO에서는 2할 푼대에 그칠 수 있습니다.';
    
    case 'correlation':
      return '충격적인 사실: AAA wRC+와 KBO 성적의 상관계수는 -0.12에 불과합니다. 이는 "미국에서 잘 쳤으니 한국에서도 통한다"는 가설이 통계적으로 기각됨을 의미합니다. 반면, 삼진율(K%)은 0.50의 높은 상관관계를 보입니다. "선구안은 배신하지 않는다"는 격언은 데이터로 입증됩니다.';
    
    case 'distribution':
      return '리그 이동에 따른 성적 변화(Delta)를 주목하십시오. KBO 투수들의 평균 구속은 낮지만, 변화구 구사율과 유인구 승부는 집요합니다. 컨택율이 뒷받침되지 않는 파워는 KBO에서 "선풍기"로 전락할 위험이 큽니다.';
    
    case 'kfs':
      return 'KFS Score는 환경 의존적인 지표(wRC+, HR)의 가중치를 낮추고, 환경 독립적인 지표(K%, BB%, Contact%)의 가중치를 높인 새로운 알고리즘입니다.';
    
    case 'aaa-scouting':
      return '2025년 AAA 타자들 중 "S-Tier" 등급을 받은 선수는 손에 꼽습니다. 숫자에 속지 마세요. wRC+가 높다고 해서 성공이 보장되는 것은 아닙니다.';
    
    case 'prediction':
      return '궁금한 선수가 있나요? 직접 AAA 성적을 입력하여 KFS Score를 확인해보세요. 데이터는 거짓말을 하지 않습니다.';
    
    default:
      return '통계는 거짓말을 하지 않습니다. 하지만 해석은 신중해야 합니다.';
  }
};

// ==========================================
// 유틸리티: KFS Score 계산 (가중치 기반)
// ==========================================
export const calculateSimpleKFS = (player: Player): number => {
  // 정규화를 위한 기준값 (AAA 평균/상위권 기준)
  const normalize = (value: number, min: number, max: number): number => {
    const normalized = (value - min) / (max - min);
    return Math.max(0, Math.min(1, normalized)); // 0~1 사이로 제한
  };

  // 각 지표 정규화 (0~100 스케일)
  const babipScore = normalize(player.babip || 0.300, 0.250, 0.380) * 100;
  const obpScore = normalize(player.obp || 0.330, 0.280, 0.420) * 100;
  const hrScore = normalize(player.hr || 10, 0, 35) * 100;
  const avgScore = normalize(player.avg || 0.260, 0.220, 0.320) * 100;
  
  // GDP는 양의 상관관계이므로 높을수록 좋음 (적극적 타격 지표)
  const gdpScore = normalize(player.gdp || 8, 0, 20) * 100;
  
  // 가중치 적용 (KFSExplanation 참조)
  const weights = {
    babip: 0.224,  // 22.4%
    obp: 0.218,    // 21.8%
    hr: 0.216,     // 21.6%
    gdp: 0.198,    // 19.8%
    avg: 0.174,    // 17.4% (wOBA/wRC+ 대신 AVG 사용)
  };

  // 가중 합산
  const rawScore = 
    babipScore * weights.babip +
    obpScore * weights.obp +
    hrScore * weights.hr +
    gdpScore * weights.gdp +
    avgScore * weights.avg;
  
  // 최종 점수 (소수점 한 자리)
  return Math.round(rawScore * 10) / 10;
};
