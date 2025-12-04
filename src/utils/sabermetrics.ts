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
// ==========================================
// Deep Dive 분석 텍스트 생성 (Professional Ver.)
// ==========================================
export const generateDeepDiveAnalysis = (player: Player): {
  title: string;
  paragraphs: string[];
  verdict: string;
} => {
  const analysis = calculateRisk(player);
  const { playerType } = analysis;
  // KFS Score 구성 요소: BABIP, OBP, HR, GDP, AVG
  const { 
    babip = 0.300, 
    obp = 0.330, 
    hr = 10, 
    gdp = 8, 
    avg = 0.260 
  } = player;

  const paragraphs: string[] = [];

  // 1. Player Profile & Archetype Analysis
  paragraphs.push(`
    ${player.name} 선수는 <strong>${playerType.archetypeKorean} (${playerType.archetype})</strong> 유형으로 분류됩니다. 
    ${playerType.analysis}
  `);

  // 2. KFS Metrics Analysis (BABIP, OBP, HR, GDP, AVG)
  const kfsAnalysis: string[] = [];
  
  // BABIP (22.4%)
  if (babip >= 0.350) {
    kfsAnalysis.push(`
      <strong>BABIP (22.4%):</strong> ${babip.toFixed(3)}의 높은 BABIP는 KFS 스코어에 긍정적이나, 
      리그 이동 시 <strong>평균 회귀(Regression)</strong> 가능성을 경계해야 합니다.
    `);
  } else if (babip <= 0.280) {
    kfsAnalysis.push(`
      <strong>BABIP (22.4%):</strong> ${babip.toFixed(3)}의 낮은 수치는 불운했거나 타구 질이 좋지 않았음을 시사합니다. 
      KBO에서의 반등 여부가 핵심 변수입니다.
    `);
  } else {
    kfsAnalysis.push(`
      <strong>BABIP (22.4%):</strong> ${babip.toFixed(3)}로 지속 가능한 수준을 유지하고 있어, 
      KFS 예측의 신뢰도를 높여줍니다.
    `);
  }

  // OBP (21.8%)
  if (obp >= 0.380) {
    kfsAnalysis.push(`
      <strong>OBP (21.8%):</strong> ${obp.toFixed(3)}의 출루율은 KBO 투수들의 유인구 승부를 
      이겨낼 수 있는 <strong>가장 확실한 성공 보증 수표</strong>입니다.
    `);
  } else if (obp <= 0.320) {
    kfsAnalysis.push(`
      <strong>OBP (21.8%):</strong> ${obp.toFixed(3)}의 낮은 출루율은 리스크 요인입니다. 
      적극적인 타격 성향이 KBO의 스트라이크 존에 적응할 수 있을지 관건입니다.
    `);
  }

  // HR (21.6%)
  if (hr >= 20) {
    kfsAnalysis.push(`
      <strong>HR (21.6%):</strong> ${hr}개의 홈런은 확실한 파워 툴을 증명합니다. 
      컨택 리스크를 감수하더라도 영입할 가치가 있는 <strong>'Game Changer'</strong>입니다.
    `);
  }

  // GDP (19.8%) & AVG (17.4%)
  if (gdp >= 15) {
    kfsAnalysis.push(`
      <strong>GDP (19.8%):</strong> ${gdp}개의 병살타는 다소 우려되나, 
      이는 그만큼 <strong>적극적인 타격(Aggressiveness)</strong>을 했다는 반증이기도 합니다.
    `);
  }
  
  if (avg >= 0.300) {
    kfsAnalysis.push(`
      <strong>AVG (17.4%):</strong> ${avg.toFixed(3)}의 고타율은 
      KFS 모델에서 기본기(Fundamentals)가 탄탄함을 의미합니다.
    `);
  }

  if (kfsAnalysis.length > 0) {
    paragraphs.push(kfsAnalysis.join('<br/>'));
  }

  // 최종 판정 (Professional Tone) - KFS Score 기반
  const kfsScore = calculateSimpleKFS(player);
  let verdict: string;

  if (kfsScore >= 70) {
    verdict = `🏆 <strong>Scouting Grade: ${kfsScore.toFixed(1)} (Elite)</strong><br/>최적화 모델이 보증하는 최고 등급 자원입니다.`;
  } else if (kfsScore >= 60) {
    verdict = `✅ <strong>Scouting Grade: ${kfsScore.toFixed(1)} (Plus)</strong><br/>주요 지표들이 고르게 우수하여 안정적인 활약이 기대됩니다.`;
  } else if (kfsScore >= 50) {
    verdict = `⚖️ <strong>Scouting Grade: ${kfsScore.toFixed(1)} (Average)</strong><br/>준수한 점수이나, 일부 지표의 편차(Variance)가 존재합니다.`;
  } else if (kfsScore >= 40) {
    verdict = `⚠️ <strong>Scouting Grade: ${kfsScore.toFixed(1)} (Below Average)</strong><br/>모델상 리스크가 감지됩니다. 특정 툴(Tool)에 의존하는 경향이 있습니다.`;
  } else {
    verdict = `❌ <strong>Scouting Grade: ${kfsScore.toFixed(1)} (Poor)</strong><br/>최적화 기준에 미달하는 지표들이 다수 발견됩니다.`;
  }

  return {
    title: `${playerType.archetypeIcon} ${player.name} - ${playerType.archetypeKorean}`,
    paragraphs,
    verdict,
  };
};

// ==========================================
// 성공 요인 분석 (Success Factor Analysis)
// ==========================================
export const generateSuccessAnalysis = (player: Player, preData?: Player): {
  title: string;
  paragraphs: string[];
} => {
  // preData가 있으면 그것을 분석, 없으면 현재 데이터(player)를 분석
  const targetData = preData || player;
  
  const { 
    k_pct = 20, 
    bb_pct = 8, 
    babip = 0.300
  } = targetData;

  const paragraphs: string[] = [];
  const successFactors: string[] = [];

  // 1. 성공 요인 추출
  if (bb_pct >= 10) successFactors.push(`<strong>뛰어난 선구안(BB% ${bb_pct.toFixed(1)}%)</strong>`);
  if (k_pct <= 18) successFactors.push(`<strong>안정적인 컨택(K% ${k_pct.toFixed(1)}%)</strong>`);
  if (babip >= 0.320 && babip <= 0.360) successFactors.push(`<strong>우수한 인플레이 타구 생산(BABIP ${babip.toFixed(3)})</strong>`);

  // 2. 분석 텍스트 생성
  if (successFactors.length > 0) {
    paragraphs.push(`
      이 선수가 KBO에서 성공할 수 있었던 핵심 동력은 ${successFactors.join(', ')}입니다.
    `);
    
    paragraphs.push(`
      AAA 시절 기록한 이러한 지표들은 <strong>리그 변동성(League Volatility)</strong>에 영향을 덜 받는 
      <strong>'환경 독립적 변수'</strong>들이었기에, KBO 리그에서도 그대로 재현될 수 있었습니다.
    `);
  } else {
    paragraphs.push(`
      전반적인 지표가 리그 평균 이상으로 균형 잡혀 있었으며, 
      특정 약점이 없는 <strong>'육각형 타자'</strong>로서의 면모가 성공의 기반이 되었습니다.
    `);
  }

  return {
    title: `🏆 성공 요인 분석: ${player.name}`,
    paragraphs,
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
      return 'KFS Score는 단순한 통계의 합이 아닙니다. 수천 명의 데이터 시뮬레이션과 최적화(Optimization) 과정을 통해 도출된, KBO 리그 성공 확률을 가장 정확하게 예측하는 알고리즘 지표입니다.';
    
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
