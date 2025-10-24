// src/components/ComparisonChart.tsx
import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

interface ComparisonChartProps {
  kboData: Player[];
  preKboData: Player[];
}

function ComparisonChart({ kboData, preKboData }: ComparisonChartProps) {
  // 주요 지표 비교 데이터 생성
  const getComparisonData = () => {
    const metrics = ['hr', 'pa', 'avg', 'obp', 'slg', 'wrc_plus', 'bb_pct', 'k_pct'];
    
    return metrics.map(metric => {
      const preFiltered = preKboData.filter(p => p[metric as keyof Player] !== undefined);
      const kboFiltered = kboData.filter(p => p[metric as keyof Player] !== undefined);

      const preAvg = preFiltered.reduce((sum, p) => sum + (Number(p[metric as keyof Player]) || 0), 0) / preFiltered.length;
      const kboAvg = kboFiltered.reduce((sum, p) => sum + (Number(p[metric as keyof Player]) || 0), 0) / kboFiltered.length;

      // 타율, 출루율, 장타율은 소수점 3자리, 나머지는 1자리
      const isRate = ['avg', 'obp', 'slg'].includes(metric);
      const preValue = isRate ? Number(preAvg.toFixed(3)) : Number(preAvg.toFixed(1));
      const kboValue = isRate ? Number(kboAvg.toFixed(3)) : Number(kboAvg.toFixed(1));

      return {
        metric: metric.toUpperCase().replace('_', ' '),
        'Pre-KBO': preValue,
        'KBO 첫 해': kboValue,
      };
    });
  };

  const comparisonData = getComparisonData();

  return (
    <ChartContainer>
      <ChartTitle>⚖️ Pre-KBO vs KBO 첫 해 주요 지표 비교</ChartTitle>
      
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={comparisonData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
          <XAxis dataKey="metric" stroke="#9aa0a6" />
          <YAxis stroke="#9aa0a6" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e2749', 
              border: '1px solid #4285f4',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="Pre-KBO" fill="#fbbc04" />
          <Bar dataKey="KBO 첫 해" fill="#4285f4" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default ComparisonChart;