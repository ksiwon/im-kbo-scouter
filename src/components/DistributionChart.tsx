// src/components/DistributionChart.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.bg.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatItemLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const StatItemValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

interface DistributionChartProps {
  kboData: Player[];
  preKboData: Player[];
}

function DistributionChart({ kboData, preKboData }: DistributionChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<'hr' | 'pa' | 'wrc_plus' | 'avg'>('wrc_plus');

  const metrics = [
    { key: 'wrc_plus' as const, label: 'wRC+', description: '가중 득점 생산력' },
    { key: 'hr' as const, label: 'HR', description: '홈런' },
    { key: 'pa' as const, label: 'PA', description: '타석' },
    { key: 'avg' as const, label: 'AVG', description: '타율' },
  ];

  // 비교 데이터 생성
  const getComparisonData = () => {
    const preFiltered = preKboData.filter(p => p[selectedMetric] !== undefined);
    const kboFiltered = kboData.filter(p => p[selectedMetric] !== undefined);

    const preAvg = preFiltered.reduce((sum, p) => sum + (p[selectedMetric] || 0), 0) / preFiltered.length;
    const kboAvg = kboFiltered.reduce((sum, p) => sum + (p[selectedMetric] || 0), 0) / kboFiltered.length;

    return [
      {
        period: 'Pre-KBO',
        value: selectedMetric === 'avg' ? Number((preAvg).toFixed(3)) : Number(preAvg.toFixed(1)),
        count: preFiltered.length,
      },
      {
        period: 'KBO 첫 해',
        value: selectedMetric === 'avg' ? Number((kboAvg).toFixed(3)) : Number(kboAvg.toFixed(1)),
        count: kboFiltered.length,
      },
    ];
  };

  // 상세 통계 계산
  const getDetailedStats = () => {
    const preFiltered = preKboData.filter(p => p[selectedMetric] !== undefined);
    const kboFiltered = kboData.filter(p => p[selectedMetric] !== undefined);

    const preValues = preFiltered.map(p => p[selectedMetric] || 0).sort((a, b) => a - b);
    const kboValues = kboFiltered.map(p => p[selectedMetric] || 0).sort((a, b) => a - b);

    const getMedian = (arr: number[]) => {
      const mid = Math.floor(arr.length / 2);
      return arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
    };

    const getStd = (arr: number[], mean: number) => {
      const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
      return Math.sqrt(variance);
    };

    const preMean = preValues.reduce((a, b) => a + b, 0) / preValues.length;
    const kboMean = kboValues.reduce((a, b) => a + b, 0) / kboValues.length;

    const format = (val: number) => selectedMetric === 'avg' ? val.toFixed(3) : val.toFixed(1);

    return {
      pre: {
        mean: format(preMean),
        median: format(getMedian(preValues)),
        std: format(getStd(preValues, preMean)),
        min: format(Math.min(...preValues)),
        max: format(Math.max(...preValues)),
      },
      kbo: {
        mean: format(kboMean),
        median: format(getMedian(kboValues)),
        std: format(getStd(kboValues, kboMean)),
        min: format(Math.min(...kboValues)),
        max: format(Math.max(...kboValues)),
      },
      change: format(kboMean - preMean),
    };
  };

  const comparisonData = getComparisonData();
  const detailedStats = getDetailedStats();

  return (
    <ChartContainer>
      <ChartTitle>📊 {metrics.find(m => m.key === selectedMetric)?.label} 분포 변화</ChartTitle>
      
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

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={comparisonData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
          <XAxis dataKey="period" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e2749', 
              border: '1px solid #4285f4',
              borderRadius: '8px',
              color: '#ffffff',
            }}
            labelStyle={{ fontWeight: '700', color: '#ffffff' }}
            itemStyle={{ color: '#ffffff' }}
          />
          <Bar dataKey="value" name={metrics.find(m => m.key === selectedMetric)?.label}>
            {comparisonData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbc04' : '#4285f4'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <StatsGrid>
        <StatItem>
          <StatItemLabel>Pre-KBO 평균</StatItemLabel>
          <StatItemValue>{detailedStats.pre.mean}</StatItemValue>
        </StatItem>
        <StatItem>
          <StatItemLabel>KBO 평균</StatItemLabel>
          <StatItemValue>{detailedStats.kbo.mean}</StatItemValue>
        </StatItem>
        <StatItem>
          <StatItemLabel>변화량</StatItemLabel>
          <StatItemValue style={{ color: Number(detailedStats.change) > 0 ? '#34a853' : '#ea4335' }}>
            {Number(detailedStats.change) > 0 ? '+' : ''}{detailedStats.change}
          </StatItemValue>
        </StatItem>
        <StatItem>
          <StatItemLabel>Pre-KBO 중앙값</StatItemLabel>
          <StatItemValue>{detailedStats.pre.median}</StatItemValue>
        </StatItem>
        <StatItem>
          <StatItemLabel>KBO 중앙값</StatItemLabel>
          <StatItemValue>{detailedStats.kbo.median}</StatItemValue>
        </StatItem>
        <StatItem>
          <StatItemLabel>Pre-KBO 표준편차</StatItemLabel>
          <StatItemValue>{detailedStats.pre.std}</StatItemValue>
        </StatItem>
      </StatsGrid>
    </ChartContainer>
  );
}

export default DistributionChart;