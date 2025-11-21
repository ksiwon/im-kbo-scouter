// src/data/analysisData.ts

export interface AnalysisContent {
  title: string;
  content: string[];
  insight: string;
}

export const ANALYSIS_DATA: Record<string, AnalysisContent> = {
  overview: {
    title: "📊 성공의 열쇠: ABS와 '통제 가능한 지표'",
    content: [
      "지난 15년간(2010-2024) KBO 리그를 거쳐간 65명의 외국인 타자 데이터를 분석한 결과, 성공의 패턴은 'Plate Discipline(선구안)'으로 귀결됩니다.",
      "특히 2024년 ABS(자동 투구 판정 시스템) 도입 이후, 심판 성향에 따른 변수가 사라지고 '일관된 존 설정 능력'이 더욱 중요해졌습니다.",
      "변화구 대처 능력과 스트라이크 존 적응력은 이제 선택이 아닌 생존의 필수 조건입니다."
    ],
    insight: "핵심 발견: ABS 환경에서는 Pre-KBO의 BB/K(볼넷/삼진 비율)가 성공의 가장 강력한 예측 인자입니다."
  },
  players: {
    title: "🏆 Top Players: 성공 사례 분석",
    content: [
      "에릭 테임즈(Eric Thames)는 KBO 역대 최고의 외국인 타자로, 압도적인 파워뿐만 아니라 40-40 클럽에 가입할 정도의 스피드와 정교함을 겸비했습니다.",
      "호세 미구엘 페르난데스(2019)는 AAA 시절부터 삼진(8.6%)과 볼넷(8.4%) 비율이 1:1에 가까운 완벽한 규율을 보여주며 '실패하지 않는 타자'임을 증명했습니다.",
      "이들은 단순히 공을 세게 치는 것이 아니라, '칠 수 있는 공'을 골라내는 능력이 탁월했습니다."
    ],
    insight: "성공 공식: 테임즈의 파괴력 + 페르난데스의 컨택 = 리그 지배"
  },
  correlation: {
    title: "📉 wRC+의 배신과 상관관계",
    content: [
      "많은 구단이 주목하는 AAA wRC+(조정 득점 생산력)는 놀랍게도 KBO 성적과 상관관계가 거의 없습니다 (r ≈ -0.12).",
      "이는 '작년 AAA에서 잘 쳤으니 한국에서도 잘 칠 것이다'라는 가설이 통계적으로 위험하다는 것을 의미합니다.",
      "반면, K%(삼진율)과 BB%(볼넷율) 같은 타석 접근법 지표는 리그 이동 간에도 높은 안정성을 보여줍니다."
    ],
    insight: "환경 의존적 지표(wRC+)보다 통제 가능 지표(K%, BB%)를 신뢰하세요."
  },
  analysis: {
    title: "📈 변화량 분포: 리그 적응 비용",
    content: [
      "선수들이 KBO로 이동했을 때, 평균적으로 삼진율(K%)은 소폭 감소하지만, 이는 KBO 투수들의 구속 차이에 기인할 수 있습니다.",
      "그러나 wRC+의 변화량 분포는 매우 큽니다. 이는 리그 수준 차이뿐만 아니라, 개인의 적응력 편차가 매우 크다는 것을 시사합니다.",
      "타석(PA)이 늘어날수록 지표는 안정화되지만, 초기 100타석에서의 삼진율 급증은 실패의 강력한 신호입니다."
    ],
    insight: "적응의 척도: 초기 삼진율 변화폭을 주시해야 합니다."
  },
  "aaa-scouting": {
    title: "🎯 2025 AAA 유망주 리포트",
    content: [
      "Danny Jansen(TOR)은 wRC+ 146과 함께 BB% 12.2%, K% 13.6%를 기록했습니다. 거의 1:1에 가까운 볼넷/삼진 비율은 ABS 환경의 KBO에서 강력한 무기가 될 것입니다.",
      "Michael Reed(ATL)는 wRC+ 183이라는 괴물 같은 스탯과 함께 리스크가 적은 타격 메커니즘을 보유했습니다.",
      "Eloy Jiménez(CHW)는 13.2%라는 놀라운 삼진율로 KBO 변화구 투수들에게 강점을 보일 것으로 예상됩니다."
    ],
    insight: "추천 픽: Danny Jansen (TOR) - ABS 맞춤형 '눈이 좋은 타자'"
  },
  prediction: {
    title: "🔮 K-Success Score 알고리즘",
    content: [
      "K-Success Score는 단순 성적 합산이 아닙니다. 상관관계 가중치를 적용한 예측 모델입니다.",
      "Plate Discipline(35%), Power & Quality(30%), Base & Contact(20%), Risk Adjust(15%)의 가중치를 적용합니다.",
      "특히 K%가 20% 미만이고 BB%가 10% 이상인 '완성형 타자'에게 높은 점수를 부여하여 실패 확률을 최소화했습니다."
    ],
    insight: "이 모델은 '대박'보다는 '실패하지 않을 선수'를 찾는 데 최적화되어 있습니다."
  }
};