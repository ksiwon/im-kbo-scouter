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
          <Icon>📊</Icon>
          <Content>
            <ItemTitle>클래식 지표의 배신 (AVG, OBP, SLG)</ItemTitle>
            <ItemText>
              놀랍게도 <strong>타율(AVG), 출루율(OBP), 장타율(SLG)</strong>과 같은 클래식 지표들은 
              성공 그룹과 실패 그룹 간에 <strong>유의미한 차이를 보이지 않습니다.</strong> 
              Box Plot의 중앙값(Median)이 거의 비슷하게 위치하며, 이는 AAA에서의 표면적인 성적이 
              KBO에서의 성공을 전혀 담보하지 못함을 의미합니다.
            </ItemText>
          </Content>
        </InsightItem>

        <InsightItem>
          <Icon>📉</Icon>
          <Content>
            <ItemTitle>실패 그룹의 극심한 편차 (High Variance)</ItemTitle>
            <ItemText>
              실패 그룹(Worst 10)의 가장 큰 특징은 <strong>Box와 Whiskers의 길이가 매우 길다는 점</strong>입니다. 
              이는 선수별로 성적 편차가 극심함을 보여줍니다. 어떤 선수는 매우 높은 수치를 기록했지만 실패했고, 
              어떤 선수는 낮은 수치임에도 실패했습니다. 즉, <strong>지표의 일관성(Consistency)이 결여</strong>되어 있어 
              예측 불확실성이 매우 높습니다.
            </ItemText>
          </Content>
        </InsightItem>

        <InsightItem>
          <Icon>🔑</Icon>
          <Content>
            <ItemTitle>결론: 숫자의 크기보다 '밀도'</ItemTitle>
            <ItemText>
              성공한 그룹은 지표가 <strong>좁은 범위 내에 밀집(Dense)</strong>되어 있는 반면, 
              실패한 그룹은 <strong>넓게 퍼져(Spread)</strong> 있습니다. 
              단순히 높은 숫자를 쫓기보다, 해당 지표가 얼마나 안정적으로 유지되는지 
              <strong>'분포의 밀도'</strong>를 확인하는 것이 스카우팅의 핵심입니다.
            </ItemText>
          </Content>
        </InsightItem>
      </InsightList>
    </InsightContainer>
  );
}

export default DeltaInsights;
