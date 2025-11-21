// src/pages/CorrelationAnalysis.tsx
import React from 'react';
import styled from 'styled-components';
import { Card, CardTitle, StatLabel } from '../components/Common';
import { theme } from '../styles/GlobalStyle';
import { Player } from '../types';

const AnalysisContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${props => props.theme.spacing.xl};
  
  > * {
    flex: 1;
  }
`;

const FindingsList = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  line-height: 1.8;
  
  > div {
    margin-bottom: ${props => props.theme.spacing.sm};
    padding-left: ${props => props.theme.spacing.md};
    border-left: 3px solid ${props => props.theme.colors.primary};
  }
`;

const Highlight = styled.span`
  color: ${props => props.theme.colors.chart.green};
  font-weight: 600;
`;

interface CorrelationAnalysisProps {
  kboData: Player[];
  preKboData: Player[];
}

function CorrelationAnalysis({ kboData, preKboData }: CorrelationAnalysisProps) {
  return (
    <AnalysisContainer>
      <Card>
        <CardTitle>📊 상관관계 매트릭스 분석</CardTitle>
        <StatLabel style={{ marginTop: '16px' }}>
          DIKW Knowledge 레이어의 주요 발견:
        </StatLabel>
        <FindingsList>
          <div>
            <strong>K% 안정성:</strong> r ≈ 0.50 
            <br />
            <Highlight>→ Pre-KBO → KBO 중간 정도의 상관관계</Highlight>
          </div>
          <div>
            <strong>BB% 안정성:</strong> r ≈ 0.29 
            <br />
            <Highlight>→ K%보다 약한 상관관계</Highlight>
          </div>
          <div>
            <strong>wRC+ 전이:</strong> r ≈ -0.12 
            <br />
            <Highlight>→ 리그/구장/시대 효과로 인한 제한적 전이성</Highlight>
          </div>
          <div style={{ 
            marginTop: '16px', 
            color: theme.colors.chart.green,
            borderLeft: `3px solid ${theme.colors.chart.green}`
          }}>
            <strong>핵심 인사이트:</strong> 선구 관련 지표(K%, BB%)가 
            환경 의존적 지표(wRC+)보다 더 나은 안정성을 보임
          </div>
        </FindingsList>
      </Card>

      <Card>
        <CardTitle>📈 변화량 분포 (Δ, KBO − Pre)</CardTitle>
        <FindingsList>
          <div>
            <strong>ΔK%:</strong> 평균 -1.77 pp, 중앙값 -1.50 pp (표준편차 6.75)
            <br />
            <Highlight>→ 삼진율이 평균적으로 약간 감소</Highlight>
          </div>
          <div>
            <strong>ΔBB%:</strong> 평균 +0.48 pp, 중앙값 +0.60 pp (표준편차 5.61)
            <br />
            <Highlight>→ 볼넷율이 약간 증가</Highlight>
          </div>
          <div>
            <strong>ΔwRC+:</strong> 평균 -6.15, 중앙값 +3.0 (표준편차 65.27)
            <br />
            <Highlight>→ 높은 분산과 왜도 (큰 음수 이상치가 평균을 낮춤)</Highlight>
          </div>
          <div>
            <strong>ΔHR/600:</strong> 평균 +2.51 (표준편차 16.15)
            <br />
            <Highlight>→ PA 정규화 후 적당한 파워 상승</Highlight>
          </div>
          <div>
            <strong>ΔPA:</strong> 평균 +82.9, 중앙값 +102
            <br />
            <Highlight>→ KBO 첫 시즌이 더 많은 타석을 받는 경향</Highlight>
          </div>
        </FindingsList>
      </Card>
    </AnalysisContainer>
  );
}

export default CorrelationAnalysis;