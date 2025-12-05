// src/components/DeltaInsights.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const InsightContainer = styled.div`
  background: ${props => props.theme.colors.bg.tertiary};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  margin-top: 1rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InsightList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InsightItem = styled.li`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const Icon = styled.span`
  font-size: 1.5rem;
  line-height: 1;
  padding-top: 0.2rem;
`;

const Content = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const ItemText = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0;
  
  strong {
    color: ${props => props.theme.colors.text.primary};
    font-weight: 600;
  }
`;

function DeltaInsights() {
  return (
    <InsightContainer>
      <Title>
        <span>💡</span>
        <span>Data Insight: 무엇이 성공을 가르는가?</span>
      </Title>
      
      <InsightList>
        <InsightItem>
          <Icon>🎯</Icon>
          <Content>
            <ItemTitle>선구안(BB%)과 컨택(K%)의 중요성</ItemTitle>
            <ItemText>
              성공한 그룹(Best 10)은 실패한 그룹에 비해 <strong>월등히 높은 볼넷 비율(BB%)</strong>과 
              <strong> 낮은 삼진율(K%)</strong>을 기록했습니다. 
              이는 KBO 리그의 변화구 위주 투구 패턴에 적응하는 데 있어 
              <strong>'참을성'과 '컨택 능력'</strong>이 가장 중요한 자질임을 시사합니다.
            </ItemText>
          </Content>
        </InsightItem>

        <InsightItem>
          <Icon>📉</Icon>
          <Content>
            <ItemTitle>장타력(SLG, HR)의 함정</ItemTitle>
            <ItemText>
              반면, 장타율이나 홈런 개수는 두 그룹 간의 차이가 상대적으로 적거나, 
              오히려 실패한 그룹이 더 높은 경우도 있습니다. 
              AAA(특히 PCL)의 타고투저 환경에서 만들어진 <strong>'거품 낀 장타력'</strong>에 
              현혹되어서는 안 된다는 것을 보여줍니다.
            </ItemText>
          </Content>
        </InsightItem>

        <InsightItem>
          <Icon>🔑</Icon>
          <Content>
            <ItemTitle>결론: 환경 독립적 지표에 주목하라</ItemTitle>
            <ItemText>
              리그 이동 시 변동성이 큰 '결과 지표(AVG, HR)'보다는, 
              타자의 고유한 성향을 나타내는 <strong>'과정 지표(BB%, K%, Contact%)'</strong>가 
              KBO 적응 성공 여부를 예측하는 데 훨씬 더 신뢰할 수 있는 신호입니다.
            </ItemText>
          </Content>
        </InsightItem>
      </InsightList>
    </InsightContainer>
  );
}

export default DeltaInsights;
