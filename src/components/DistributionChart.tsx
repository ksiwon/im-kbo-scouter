// src/components/DistributionChart.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Player } from '../types';

const ChartContainer = styled.div`
  background: ${props => props.theme.colors.bg.tertiary};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
`;

const TabContainer = styled.div`
  display: flex;
  background: ${props => props.theme.colors.bg.secondary};
  padding: 0.25rem;
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const TabButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? props.theme.colors.bg.tertiary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text.secondary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
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
  const [activeTab, setActiveTab] = useState<'comparison' | 'delta'>('comparison');
  const [selectedMetric, setSelectedMetric] = useState<'hr' | 'pa' | 'wrc_plus' | 'avg' | 'k_pct' | 'bb_pct'>('wrc_plus');

  const metrics = [
    { key: 'wrc_plus' as const, label: 'wRC+', description: '가중 득점 생산력' },
    { key: 'hr' as const, label: 'HR', description: '홈런' },
    { key: 'avg' as const, label: 'AVG', description: '타율' },
    { key: 'k_pct' as const, label: 'K%', description: '삼진율' },
    { key: 'bb_pct' as const, label: 'BB%', description: '볼넷율' },
  ];

  // 1. Comparison Data Logic
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

  // 2. Delta Data Logic
  const getDeltaData = () => {
    const deltas: number[] = [];

    kboData.forEach(kboPlayer => {
      const prePlayer = preKboData.find(p => p.name === kboPlayer.name);
      if (prePlayer && kboPlayer[selectedMetric] !== undefined && prePlayer[selectedMetric] !== undefined) {
        const delta = (kboPlayer[selectedMetric] || 0) - (prePlayer[selectedMetric] || 0);
        deltas.push(delta);
      }
    });

    if (deltas.length === 0) return { bins: [], deltas: [] };

    const min = Math.min(...deltas);
    const max = Math.max(...deltas);
    const binCount = 10;
    const binSize = (max - min) / binCount;
    
    const bins = Array.from({ length: binCount }, (_, i) => ({
      range: `${(min + i * binSize).toFixed(1)} ~ ${(min + (i + 1) * binSize).toFixed(1)}`,
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

  // Detailed Stats Calculation
  const getDetailedStats = () => {
    const preFiltered = preKboData.filter(p => p[selectedMetric] !== undefined);
    const kboFiltered = kboData.filter(p => p[selectedMetric] !== undefined);

    const preValues = preFiltered.map(p => p[selectedMetric] || 0).sort((a, b) => a - b);
    const kboValues = kboFiltered.map(p => p[selectedMetric] || 0).sort((a, b) => a - b);

    const getMedian = (arr: number[]) => {
      if (arr.length === 0) return 0;
      const mid = Math.floor(arr.length / 2);
      return arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
    };

    const getStd = (arr: number[], mean: number) => {
      if (arr.length === 0) return 0;
      const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
      return Math.sqrt(variance);
    };

    const preMean = preValues.length ? preValues.reduce((a, b) => a + b, 0) / preValues.length : 0;
    const kboMean = kboValues.length ? kboValues.reduce((a, b) => a + b, 0) / kboValues.length : 0;

    const format = (val: number) => selectedMetric === 'avg' ? val.toFixed(3) : val.toFixed(1);

    return {
      pre: {
        mean: format(preMean),
        median: format(getMedian(preValues)),
        std: format(getStd(preValues, preMean)),
      },
      kbo: {
        mean: format(kboMean),
        median: format(getMedian(kboValues)),
        std: format(getStd(kboValues, kboMean)),
      },
      change: format(kboMean - preMean),
    };
  };

  const comparisonData = getComparisonData();
  const { bins, deltas } = getDeltaData();
  const detailedStats = getDetailedStats();
  
  const deltaMean = deltas.length ? deltas.reduce((sum, d) => sum + d, 0) / deltas.length : 0;

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>📊 {metrics.find(m => m.key === selectedMetric)?.label} 분석</ChartTitle>
        <TabContainer>
          <TabButton 
            active={activeTab === 'comparison'} 
            onClick={() => setActiveTab('comparison')}
          >
            평균 비교
          </TabButton>
          <TabButton 
            active={activeTab === 'delta'} 
            onClick={() => setActiveTab('delta')}
          >
            변화량(Delta) 분포
          </TabButton>
        </TabContainer>
      </ChartHeader>
      
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
        {activeTab === 'comparison' ? (
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
            <Bar dataKey="value" name={metrics.find(m => m.key === selectedMetric)?.label} barSize={100}>
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbc04' : '#4285f4'} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <BarChart data={bins}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
            <XAxis 
              dataKey="range" 
              stroke="#9aa0a6" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              tick={{ fontSize: 10 }}
            />
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
            <ReferenceLine x={deltaMean} stroke="#ea4335" strokeDasharray="5 5" label="평균" />
            <Bar dataKey="count" name="선수 수">
              {bins.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.center >= 0 ? '#34a853' : '#ea4335'} />
              ))}
            </Bar>
          </BarChart>
        )}
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
          <StatItemLabel>평균 변화량</StatItemLabel>
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