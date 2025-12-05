import React from 'react';
import styled from 'styled-components';
import { Card, CardTitle, StatLabel } from '../components/Common';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding-left: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
`;

const FormulaBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 1.2rem;
  line-height: 2;
  color: ${props => props.theme.colors.text.primary};
  
  span.highlight {
    color: ${props => props.theme.colors.primary};
    font-weight: bold;
  }
`;

const FactorCard = styled(Card)`
  background: ${props => props.theme.colors.bg.secondary};
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FactorTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WeightBadge = styled.span`
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border-radius: 20px;
  font-weight: 600;
`;

function KFSExplanation() {
  return (
    <Container>
      <Section>
        <SectionTitle>🎯 핵심 철학: "데이터가 말하는 성공의 조건"</SectionTitle>
        <Grid>
          <Card>
            <CardTitle>🚫 wRC+의 한계</CardTitle>
            <StatLabel>
              AAA에서의 wRC+는 KBO 성적과 상관관계가 매우 낮습니다 (r = -0.12).
              리그 환경 차이로 인해, 단순히 '미국에서 잘 쳤던 타자'가 한국에서도 잘 치는 것은 아닙니다.
            </StatLabel>
          </Card>
          <Card>
            <CardTitle>✅ 컨택의 질(Quality of Contact)</CardTitle>
            <StatLabel>
              데이터 분석 결과, BABIP(인플레이 타구 안타 확률)와 AVG(타율)가 KBO 성공과 가장 높은 상관관계를 보였습니다.
              이는 '공을 맞추는 능력'과 '좋은 타구를 만드는 능력'이 핵심임을 시사합니다.
            </StatLabel>
          </Card>
          <Card>
            <CardTitle>⚾ 파워와 출루의 조화</CardTitle>
            <StatLabel>
              순수한 파워(HR)와 출루 능력(OBP)은 여전히 중요한 성공 지표입니다.
              단순한 눈야구(Discipline)보다는, 적극적으로 타격하여 결과를 만들어내는 능력이 더 중요하게 작용합니다.
            </StatLabel>
          </Card>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>🧮 최적화(Optimization) 알고리즘</SectionTitle>
        <FormulaBox>
          <div style={{ marginBottom: '1rem', color: '#aaa', fontSize: '1rem' }}>
            KBO 외인들의 데이터 시뮬레이션을 통해 도출된 최적의 공식
          </div>
          KFS Score = (
          <span className="highlight">BABIP</span> × 22.4% + 
          <span className="highlight"> OBP</span> × 21.8% + 
          <span className="highlight"> HR</span> × 21.6% + 
          <span className="highlight"> GDP</span> × 19.8% + 
          <span className="highlight"> AVG</span> × 17.4%
          ) ...
        </FormulaBox>
      </Section>

      <Section>
        <SectionTitle>📊 5대 핵심 요소</SectionTitle>
        <Grid>
          <FactorCard>
            <FactorTitle>
              BABIP & AVG
              <WeightBadge>가중치 ~40%</WeightBadge>
            </FactorTitle>
            <StatLabel>
              인플레이 타구를 안타로 만드는 능력입니다.
              KBO 리그에서는 컨택의 정확도와 타구의 질이 성공의 가장 큰 열쇠입니다.
            </StatLabel>
          </FactorCard>

          <FactorCard>
            <FactorTitle>
              OBP (출루율)
              <WeightBadge>가중치 21.8%</WeightBadge>
            </FactorTitle>
            <StatLabel>
              살아서 나가는 능력은 리그를 불문하고 중요합니다.
              높은 출루율은 안정적인 득점 생산력의 기반이 됩니다.
            </StatLabel>
          </FactorCard>

          <FactorCard>
            <FactorTitle>
              HR (홈런)
              <WeightBadge>가중치 21.6%</WeightBadge>
            </FactorTitle>
            <StatLabel>
              순수한 장타력은 KBO에서도 통합니다.
              홈런 생산 능력은 리그 적응과 무관하게 유지되는 경향이 있습니다.
            </StatLabel>
          </FactorCard>

          <FactorCard>
            <FactorTitle>
              GDP (병살타)
              <WeightBadge>가중치 19.8%</WeightBadge>
            </FactorTitle>
            <StatLabel>
              놀랍게도 병살타는 뛰어난 선수일 수록 많은 경향을 보입니다.
              이는 강한 타구를 자주 만들어내고, 적극적인 타격을 하는 타자들이 성공할 확률이 높음을 의미합니다.
            </StatLabel>
          </FactorCard>

          <FactorCard>
            <FactorTitle>
              wOBA & wRC+
              <WeightBadge>가중치 ~15%</WeightBadge>
            </FactorTitle>
            <StatLabel>
              종합적인 공격 생산력 지표입니다.
              중요하지만, 환경 의존적인 특성 때문에 개별 스탯보다는 가중치가 낮게 책정되었습니다.
            </StatLabel>
          </FactorCard>
        </Grid>
      </Section>
    </Container>
  );
}

export default KFSExplanation;
