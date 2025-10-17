// src/pages/CorrelationAnalysis.tsx
import React from 'react';
import styled from 'styled-components';
import { Card, CardTitle, StatLabel } from '../components/Common';
import { theme } from '../styles/GlobalStyle';
import { Player } from '../types';

const AnalysisContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
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
        <CardTitle>📊 Correlation Matrix Analysis</CardTitle>
        <StatLabel style={{ marginTop: '16px' }}>
          Key Findings from DIKW Knowledge Layer:
        </StatLabel>
        <FindingsList>
          <div>
            <strong>K% Stability:</strong> r ≈ 0.50 
            <br />
            <Highlight>→ Moderate correlation Pre-KBO → KBO</Highlight>
          </div>
          <div>
            <strong>BB% Stability:</strong> r ≈ 0.29 
            <br />
            <Highlight>→ Weaker correlation than K%</Highlight>
          </div>
          <div>
            <strong>wRC+ Transfer:</strong> r ≈ -0.12 
            <br />
            <Highlight>→ Limited transferability due to league/park/era effects</Highlight>
          </div>
          <div style={{ 
            marginTop: '16px', 
            color: theme.colors.chart.green,
            borderLeft: `3px solid ${theme.colors.chart.green}`
          }}>
            <strong>Key Insight:</strong> Plate discipline metrics (K%, BB%) show better 
            stability than environment-dependent stats like wRC+
          </div>
        </FindingsList>
      </Card>

      <Card>
        <CardTitle>📈 Distribution of Changes (Δ, KBO − Pre)</CardTitle>
        <FindingsList>
          <div>
            <strong>ΔK%:</strong> mean -1.77 pp, median -1.50 pp (Std 6.75)
            <br />
            <Highlight>→ Strikeout rate slightly decreases on average</Highlight>
          </div>
          <div>
            <strong>ΔBB%:</strong> mean +0.48 pp, median +0.60 pp (Std 5.61)
            <br />
            <Highlight>→ Walk rate slightly increases</Highlight>
          </div>
          <div>
            <strong>ΔwRC+:</strong> mean -6.15, median +3.0 (Std 65.27)
            <br />
            <Highlight>→ High variance & skew (large negative outliers)</Highlight>
          </div>
          <div>
            <strong>ΔHR/600:</strong> mean +2.51 (Std 16.15)
            <br />
            <Highlight>→ Modest uptick in power production</Highlight>
          </div>
          <div>
            <strong>ΔPA:</strong> mean +82.9, median +102
            <br />
            <Highlight>→ First KBO seasons tend to have more plate appearances</Highlight>
          </div>
        </FindingsList>
      </Card>
    </AnalysisContainer>
  );
}

export default CorrelationAnalysis;