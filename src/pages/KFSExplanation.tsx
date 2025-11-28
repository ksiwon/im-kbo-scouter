import React from 'react';
import styled from 'styled-components';
import { Card, CardTitle, StatLabel } from '../components/Common';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.text.primary};
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding-left: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FormulaBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-family: 'Fira Code', monospace;
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
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WeightBadge = styled.span`
  font-size: 0.9rem;
  padding: 0.25rem 0.75rem;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border-radius: 20px;
  font-weight: 600;
`;

function KFSExplanation() {
  return (
    <Container>
      <Section>
        <SectionTitle>🎯 핵심 철학: "통제 가능한 지표에 집중하라"</SectionTitle>
        <Grid>
          <Card>
            <CardTitle>🚫 wRC+의 함정</CardTitle>
            <StatLabel>
              AAA에서의 wRC+는 KBO 성적과 상관관계가 매우 낮습니다 (r = -0.12).
              리그 환경, 공인구, 스트라이크 존의 차이로 인해 타격 성적은 쉽게 변동됩니다.
            </StatLabel>
          </Card>
          <Card>
            <CardTitle>✅ 선구안의 불변성</CardTitle>
            <StatLabel>
              반면, 타자의 선구안(BB%, K%)은 리그가 바뀌어도 유지되는 경향이 강합니다.
              KFS Score는 이러한 '변하지 않는 능력'에 더 큰 가중치를 둡니다.
            </StatLabel>
          </Card>
          <Card>
            <CardTitle>⚾ ABS 시대의 도래</CardTitle>
            <StatLabel>
              2024년 ABS(자동 투구 판정 시스템) 도입으로 '존 설정 능력'이 더욱 중요해졌습니다.
              심판 성향이라는 변수가 사라지면서, 타자의 순수한 규율(Discipline)이 성공의 열쇠가 되었습니다.
            </StatLabel>
          </Card>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>🧮 계산 알고리즘</SectionTitle>
        <FormulaBox>
          <div style={{ marginBottom: '1rem', color: '#aaa', fontSize: '1rem' }}>Total Score (Normalized to 100)</div>
          KFS Score = (
          <span className="highlight">Power</span> × 48% + 
          <span className="highlight"> Discipline</span> × 37% + 
          <span className="highlight"> GDP</span> × 34% + 
          <span className="highlight"> wRC+</span> × 24% + 
          <span className="highlight"> BABIP</span> × 25%
          ) / 1.596
        </FormulaBox>
      </Section>

      <Section>
        <SectionTitle>📊 5대 핵심 요소</SectionTitle>
        <Grid>
          <FactorCard>
            <FactorTitle>
              Power
              <WeightBadge>가중치 48%</WeightBadge>
            </FactorTitle>
            <StatLabel>
              홈런 생산 능력과 타구 품질(Line Drive%)을 평가합니다.
              장타력은 리그 이동 간에도 비교적 잘 유지되는 지표입니다.
            </StatLabel>
          </FactorCard>

          <FactorCard>
            <FactorTitle>
              Discipline
              <WeightBadge>가중치 37%</WeightBadge>
            </FactorTitle>
            <StatLabel>
              삼진율(K%), 볼넷율(BB%), 헛스윙률(SwStr%)을 종합하여 평가합니다.
              KBO 성공의 가장 강력한 예측 인자입니다.
            </StatLabel>
          </FactorCard>

          <FactorCard>
            <FactorTitle>
              GDP (병살타)
              <WeightBadge>가중치 34%</WeightBadge>
            </FactorTitle>
            <StatLabel>
              흥미롭게도 병살타는 KBO 성공과 양의 상관관계를 보입니다.
              이는 '인플레이 타구를 만드는 능력'과 '강한 타구 생산'의 대리 지표로 해석됩니다.
            </StatLabel>
          </FactorCard>

          <FactorCard>
            <FactorTitle>
              BABIP
              <WeightBadge>가중치 25%</WeightBadge>
            </FactorTitle>
            <StatLabel>
              인플레이 타구의 안타 확률입니다.
              지나치게 높거나 낮은 BABIP는 운의 요소가 작용했을 가능성을 시사하므로 보정합니다.
            </StatLabel>
          </FactorCard>

          <FactorCard>
            <FactorTitle>
              wRC+
              <WeightBadge>가중치 24%</WeightBadge>
            </FactorTitle>
            <StatLabel>
              조정 득점 생산력입니다.
              중요한 지표지만, 리그 적응 변수를 고려하여 가중치를 상대적으로 낮게 설정했습니다.
            </StatLabel>
          </FactorCard>
        </Grid>
      </Section>
    </Container>
  );
}

export default KFSExplanation;
