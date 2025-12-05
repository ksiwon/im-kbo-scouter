// src/components/ComparisonChart.tsx
import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Player } from '../types';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ChartSection = styled.div`
  background: ${(p) => p.theme.colors.bg.tertiary};
  padding: 24px;
  border-radius: 16px;
  box-shadow: ${(p) => p.theme.shadows.lg};
  width: 100%;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${(p) => p.theme.colors.text.primary};
`;

const SubTitle = styled.p`
  font-size: 0.9rem;
  color: ${(p) => p.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 400px;
`;

interface ComparisonChartProps {
  kboData: Player[];
  preKboData: Player[];
}

const METRICS = [
  { key: 'avg', label: 'AVG' },
  { key: 'obp', label: 'OBP' },
  { key: 'slg', label: 'SLG' },
  { key: 'bb_pct', label: 'BB%' },
  { key: 'k_pct', label: 'K%' },
  { key: 'iso', label: 'ISO' },
  { key: 'babip', label: 'BABIP' },
];

function ComparisonChart({ kboData, preKboData }: ComparisonChartProps) {
  const chartData = useMemo(() => {
    // 1. KBO 첫 해 wRC+ 기준 정렬
    const sortedKbo = [...kboData]
      .filter(p => p.wrc_plus !== undefined)
      .sort((a, b) => (b.wrc_plus || 0) - (a.wrc_plus || 0));

    // 2. Best 10 & Worst 10 선정
    const best10Kbo = sortedKbo.slice(0, 10);
    const worst10Kbo = sortedKbo.slice(-10);

    // 3. 해당 선수들의 Pre-KBO 데이터 매칭
    const getPreStats = (kboPlayers: Player[]) => {
      return kboPlayers
        .map(k => preKboData.find(p => p.name === k.name))
        .filter((p): p is Player => !!p);
    };

    const best10Pre = getPreStats(best10Kbo);
    const worst10Pre = getPreStats(worst10Kbo);

    // 4. 평균 계산 헬퍼
    const calcAvg = (players: Player[], key: string) => {
      if (!players.length) return 0;
      const sum = players.reduce((acc, p) => {
        let val = Number(p[key as keyof Player] || 0);
        // ISO 계산 (SLG - AVG)
        if (key === 'iso') {
          val = (Number(p.slg) || 0) - (Number(p.avg) || 0);
        }
        return acc + val;
      }, 0);
      return sum / players.length;
    };

    // 5. 차트 데이터 생성
    return METRICS.map(m => {
      const bestAvg = calcAvg(best10Pre, m.key);
      const worstAvg = calcAvg(worst10Pre, m.key);
      
      // % 단위 변환 (BB%, K%)
      const isPercent = m.key.includes('pct');
      const displayBest = isPercent ? Number((bestAvg / 100).toFixed(3)) : Number(bestAvg.toFixed(3));
      const displayWorst = isPercent ? Number((worstAvg / 100).toFixed(3)) : Number(worstAvg.toFixed(3));

      return {
        metric: m.label,
        'Best 10 (Pre-KBO)': displayBest,
        'Worst 10 (Pre-KBO)': displayWorst,
        gap: displayBest - displayWorst
      };
    });
  }, [kboData, preKboData]);

  return (
    <ChartSection>
      <Title>🏆 성공 vs 실패 그룹의 Pre-KBO 스탯 비교</Title>
      <SubTitle>
        KBO 첫 해 wRC+ 상위 10명(Best)과 하위 10명(Worst)의 
        <br />
        <strong>한국 오기 전(Pre-KBO) 평균 성적</strong>을 비교했습니다.
      </SubTitle>

      <ChartWrapper>
        <ResponsiveContainer>
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" vertical={false} />
            <XAxis 
              dataKey="metric" 
              stroke="#9aa0a6" 
              tick={{ fill: '#9aa0a6' }}
            />
            <YAxis 
              stroke="#9aa0a6" 
              tick={{ fill: '#9aa0a6' }}
              tickFormatter={(val) => val.toFixed(2)}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1e2749', 
                border: '1px solid #4285f4', 
                borderRadius: 8,
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
              }}
              labelStyle={{ color: '#e8eaed', fontWeight: 'bold', marginBottom: '0.5rem' }}
              itemStyle={{ padding: '2px 0' }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar 
              dataKey="Best 10 (Pre-KBO)" 
              name="Best 10 (wRC+ 상위)" 
              fill="#4285f4" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="Worst 10 (Pre-KBO)" 
              name="Worst 10 (wRC+ 하위)" 
              fill="#ea4335" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </ChartSection>
  );
}

export default ComparisonChart;
