// src/components/DeltaDistribution.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Player } from '../types';

const ChartContainer = styled.div`
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

const StatsBox = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.bg.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div<{ positive?: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.positive ? props.theme.colors.success : props.theme.colors.danger};
`;

interface DeltaDistributionProps {
  kboData: Player[];
  preKboData: Player[];
}

function DeltaDistribution({ kboData, preKboData }: DeltaDistributionProps) {
  const [selectedMetric, setSelectedMetric] = useState<'wrc_plus' | 'k_pct' | 'bb_pct' | 'hr'>('wrc_plus');

  const metrics = [
    { key: 'wrc_plus' as const, label: 'wRC+' },
    { key: 'k_pct' as const, label: 'K%' },
    { key: 'bb_pct' as const, label: 'BB%' },
    { key: 'hr' as const, label: 'HR' },
  ];

  // 델타(변화량) 계산
  const getDeltaData = () => {
    const deltas: number[] = [];

    kboData.forEach(kboPlayer => {
      const prePlayer = preKboData.find(p => p.name === kboPlayer.name);
      if (prePlayer && kboPlayer[selectedMetric] !== undefined && prePlayer[selectedMetric] !== undefined) {
        const delta = (kboPlayer[selectedMetric] || 0) - (prePlayer[selectedMetric] || 0);
        deltas.push(delta);
      }
    });

    // 히스토그램 생성
    const min = Math.min(...deltas);
    const max = Math.max(...deltas);
    const binCount = 10;
    const binSize = (max - min) / binCount;
    
    const bins = Array.from({ length: binCount }, (_, i) => ({
      range: `${(min + i * binSize).toFixed(1)}~${(min + (i + 1) * binSize).toFixed(1)}`,
      count: 0,
      center: min + (i + 0.5) * binSize,
    }));

    deltas.forEach(delta => {
      const binIndex = Math.min(Math.floor((delta - min) / binSize), binCount - 1);
      if (binIndex >= 0 && binIndex < binCount) {
        bins[binIndex].count++;
      }
    });

    return { bins, deltas };
  };

  const { bins, deltas } = getDeltaData();

  // 통계 계산
  const mean = deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
  const sortedDeltas = [...deltas].sort((a, b) => a - b);
  const median = sortedDeltas.length % 2 
    ? sortedDeltas[Math.floor(sortedDeltas.length / 2)]
    : (sortedDeltas[sortedDeltas.length / 2 - 1] + sortedDeltas[sortedDeltas.length / 2]) / 2;
  
  const variance = deltas.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / deltas.length;
  const std = Math.sqrt(variance);

  const format = (val: number) => val.toFixed(2);

  return (
    <ChartContainer>
      <ChartTitle>📉 변화량 분포 (Δ = KBO - Pre)</ChartTitle>
      
      <MetricSelector>
        {metrics.map(metric => (
          <MetricButton
            key={metric.key}
            active={selectedMetric === metric.key}
            onClick={() => setSelectedMetric(metric.key)}
          >
            Δ{metric.label}
          </MetricButton>
        ))}
      </MetricSelector>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={bins}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
          <XAxis dataKey="range" stroke="#9aa0a6" angle={-45} textAnchor="end" height={100} />
          <YAxis stroke="#9aa0a6" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e2749', 
              border: '1px solid #4285f4',
              borderRadius: '8px',
            }}
            labelStyle={{ fontWeight: '700', color: '#ffffff' }}
            itemStyle={{ color: '#ffffff' }}
          />
          <ReferenceLine x={mean} stroke="#ea4335" strokeDasharray="5 5" label="평균" />
          <Bar dataKey="count" name="선수 수">
            {bins.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.center >= 0 ? '#34a853' : '#ea4335'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <StatsBox>
        <StatItem>
          <StatLabel>평균 변화량</StatLabel>
          <StatValue positive={mean >= 0}>
            {mean >= 0 ? '+' : ''}{format(mean)}
          </StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>중앙값</StatLabel>
          <StatValue positive={median >= 0}>
            {median >= 0 ? '+' : ''}{format(median)}
          </StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>표준편차</StatLabel>
          <StatValue>{format(std)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>최소값</StatLabel>
          <StatValue>{format(Math.min(...deltas))}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>최대값</StatLabel>
          <StatValue>{format(Math.max(...deltas))}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>샘플 수</StatLabel>
          <StatValue>{deltas.length}명</StatValue>
        </StatItem>
      </StatsBox>
    </ChartContainer>
  );
}

export default DeltaDistribution;