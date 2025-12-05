// src/components/CorrelationChart.tsx
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { Player } from '../types';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ChartContainer = styled.div`
  animation: ${fadeIn} 0.6s ease-out;
  background: ${props => props.theme.colors.bg.tertiary};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
`;

const ChartTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const MetricSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const MetricButton = styled.button<{ active?: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active 
    ? props.theme.colors.gradient.primary 
    : props.theme.colors.bg.secondary};
  color: ${props => props.theme.colors.text.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const CorrelationInfo = styled.div`
  margin-top: 2rem;
  padding: 1rem 2.5rem;
  background: ${props => props.theme.colors.bg.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const InfoItem = styled.div`
  text-align: center;
`;

const InfoLabel = styled.div`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.3rem;
`;

const InfoValue = styled.div<{ color?: string }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.color || props.theme.colors.primary};
`;

const ChartsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
`;

interface CorrelationChartProps {
  kboData: Player[];
  preKboData: Player[];
}

function CorrelationChart({ kboData, preKboData }: CorrelationChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<'wrc_plus' | 'k_pct' | 'bb_pct' | 'hr' | 'gdp' | 'babip' | 'obp' | 'slg'>('wrc_plus');

  const metrics = [
    { key: 'wrc_plus' as const, label: 'wRC+', description: '가중 득점 생산력' },
    { key: 'k_pct' as const, label: 'K%', description: '삼진율' },
    { key: 'bb_pct' as const, label: 'BB%', description: '볼넷율' },
    { key: 'hr' as const, label: 'HR', description: '홈런' },
    { key: 'gdp' as const, label: 'GDP', description: '병살타' },
    { key: 'babip' as const, label: 'BABIP', description: '인플레이 타구 타율' },
    { key: 'obp' as const, label: 'OBP', description: '출루율' },
    { key: 'slg' as const, label: 'SLG', description: '장타율' },
  ];

  // 상관관계 데이터 생성
  const getCorrelationData = () => {
    const matchedData: Array<{ pre: number; kbo: number; wrc_plus: number; name: string }> = [];

    kboData.forEach(kboPlayer => {
      const prePlayer = preKboData.find(p => p.name === kboPlayer.name);
      if (prePlayer && kboPlayer[selectedMetric] !== undefined && prePlayer[selectedMetric] !== undefined && kboPlayer.wrc_plus) {
        matchedData.push({
          pre: prePlayer[selectedMetric] || 0,
          kbo: kboPlayer[selectedMetric] || 0,
          wrc_plus: kboPlayer.wrc_plus || 0,
          name: kboPlayer.name,
        });
      }
    });

    return matchedData;
  };

  // 상관계수 계산
  const calculateCorrelation = (data: Array<any>, xKey: string, yKey: string) => {
    if (data.length < 2) return 0;

    const n = data.length;
    const sumX = data.reduce((sum, d) => sum + d[xKey], 0);
    const sumY = data.reduce((sum, d) => sum + d[yKey], 0);
    const sumXY = data.reduce((sum, d) => sum + d[xKey] * d[yKey], 0);
    const sumX2 = data.reduce((sum, d) => sum + d[xKey] * d[xKey], 0);
    const sumY2 = data.reduce((sum, d) => sum + d[yKey] * d[yKey], 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const correlationData = getCorrelationData();
  const consistencyCorrelation = calculateCorrelation(correlationData, 'pre', 'kbo');
  const predictiveCorrelation = calculateCorrelation(correlationData, 'pre', 'wrc_plus');

  const getCorrelationColor = (r: number) => {
    const absR = Math.abs(r);
    if (absR >= 0.7) return '#34a853';
    if (absR >= 0.4) return '#fbbc04';
    return '#ea4335';
  };

  const getCorrelationStrength = (r: number) => {
    const absR = Math.abs(r);
    if (absR >= 0.3) return '강한 상관관계';
    if (absR >= 0.2) return '중간 상관관계';
    if (absR >= 0.1) return '약한 상관관계';
    return '거의 무상관';
  };

  return (
    <ChartContainer>
      <MetricSelector>
        {metrics.map(metric => (
          <MetricButton
            key={metric.key}
            active={selectedMetric === metric.key}
            onClick={() => setSelectedMetric(metric.key)}
          >
            {metric.label}
          </MetricButton>
        ))}
      </MetricSelector>

      <ChartsWrapper>
        <ChartSection>
          <ChartTitle>🔗 Pre-KBO vs KBO 지표별 상관관계 (Consistency)</ChartTitle>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
              <XAxis 
                type="number" 
                dataKey="pre" 
                name={`Pre-KBO ${metrics.find(m => m.key === selectedMetric)?.label}`}
                stroke="#9aa0a6"
              >
                <Label value={`Pre-KBO ${metrics.find(m => m.key === selectedMetric)?.label}`} position="bottom" style={{ fill: '#9aa0a6' }} />
              </XAxis>
              <YAxis 
                type="number" 
                dataKey="kbo" 
                name={`KBO 첫 해 ${metrics.find(m => m.key === selectedMetric)?.label}`}
                stroke="#9aa0a6"
              >
                <Label value={`KBO 첫 해 ${metrics.find(m => m.key === selectedMetric)?.label}`} angle={-90} position="left" style={{ fill: '#9aa0a6', textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e2749', 
                  border: '1px solid #4285f4',
                  borderRadius: '8px',
                }}
                content={({ payload }) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload;
                    return (
                      <div style={{ padding: '10px', backgroundColor: '#1e2749', borderRadius: '8px' }}>
                        <p style={{ color: '#e8eaed', fontWeight: 'bold' }}>{data.name}</p>
                        <p style={{ color: '#9aa0a6' }}>Pre-KBO {metrics.find(m => m.key === selectedMetric)?.label}: {data.pre}</p>
                        <p style={{ color: '#9aa0a6' }}>KBO {metrics.find(m => m.key === selectedMetric)?.label}: {data.kbo}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={correlationData} fill="#4285f4" />
              <ReferenceLine 
                stroke="#fbbc04" 
                strokeDasharray="5 5" 
                segment={[
                  { x: Math.min(...correlationData.map(d => d.pre)), y: Math.min(...correlationData.map(d => d.kbo)) },
                  { x: Math.max(...correlationData.map(d => d.pre)), y: Math.max(...correlationData.map(d => d.kbo)) }
                ]}
              />
            </ScatterChart>
          </ResponsiveContainer>

          <CorrelationInfo>
            <InfoItem>
              <InfoLabel>상관계수 (r)</InfoLabel>
              <InfoValue color={getCorrelationColor(consistencyCorrelation)}>
                {consistencyCorrelation.toFixed(3)}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>데이터 포인트</InfoLabel>
              <InfoValue>{correlationData.length}명</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>상관 강도</InfoLabel>
              <InfoValue color={getCorrelationColor(consistencyCorrelation)}>
                {getCorrelationStrength(consistencyCorrelation)}
              </InfoValue>
            </InfoItem>
          </CorrelationInfo>
        </ChartSection>

        <ChartSection>
          <ChartTitle>🔮 Pre-KBO 지표 vs KBO wRC+ (Predictive Power)</ChartTitle>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
              <XAxis 
                type="number" 
                dataKey="pre" 
                name={`Pre-KBO ${metrics.find(m => m.key === selectedMetric)?.label}`}
                stroke="#9aa0a6"
              >
                <Label value={`Pre-KBO ${metrics.find(m => m.key === selectedMetric)?.label}`} position="bottom" style={{ fill: '#9aa0a6' }} />
              </XAxis>
              <YAxis 
                type="number" 
                dataKey="wrc_plus" 
                name="KBO 첫 해 wRC+"
                stroke="#9aa0a6"
              >
                <Label value="KBO 첫 해 wRC+" angle={-90} position="left" style={{ fill: '#9aa0a6', textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e2749', 
                  border: '1px solid #4285f4',
                  borderRadius: '8px',
                }}
                content={({ payload }) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload;
                    const metricLabel = metrics.find(m => m.key === selectedMetric)?.label;
                    return (
                      <div style={{ padding: '10px', backgroundColor: '#1e2749', borderRadius: '8px' }}>
                        <p style={{ color: '#e8eaed', fontWeight: 'bold' }}>{data.name}</p>
                        <p style={{ color: '#9aa0a6' }}>Pre-KBO {metricLabel}: {data.pre}</p>
                        <p style={{ color: '#9aa0a6' }}>KBO wRC+: {data.wrc_plus}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={correlationData} fill="#fbbc04" />
              <ReferenceLine 
                stroke="#4285f4" 
                strokeDasharray="5 5" 
                segment={[
                  { x: Math.min(...correlationData.map(d => d.pre)), y: Math.min(...correlationData.map(d => d.wrc_plus)) },
                  { x: Math.max(...correlationData.map(d => d.pre)), y: Math.max(...correlationData.map(d => d.wrc_plus)) }
                ]}
              />
            </ScatterChart>
          </ResponsiveContainer>

          <CorrelationInfo>
            <InfoItem>
              <InfoLabel>상관계수 (r)</InfoLabel>
              <InfoValue color={getCorrelationColor(predictiveCorrelation)}>
                {predictiveCorrelation.toFixed(3)}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>데이터 포인트</InfoLabel>
              <InfoValue>{correlationData.length}명</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>상관 강도</InfoLabel>
              <InfoValue color={getCorrelationColor(predictiveCorrelation)}>
                {getCorrelationStrength(predictiveCorrelation)}
              </InfoValue>
            </InfoItem>
          </CorrelationInfo>
        </ChartSection>
      </ChartsWrapper>
    </ChartContainer>
  );
}

export default CorrelationChart;