// src/components/ComparisonChart.tsx   (전체 교체)
import React, { useMemo } from 'react';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { Player } from '../types';

const ChartSection = styled.div`
  background: ${(p) => p.theme.colors.bg.tertiary};
  padding: 24px;
  border-radius: 16px;
  box-shadow: ${(p) => p.theme.shadows.lg};
  width: 100%;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
  color: ${(p) => p.theme.colors.text.primary};
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

interface ComparisonChartProps {
  kboData: Player[];
  preKboData: Player[];
}

/** 좌측(Rate)에서만 사용하는 지표 */
const RATE_METRICS = ['avg', 'obp', 'slg', 'bb_pct', 'k_pct'] as const;
/** 우측(Count/Value)에서만 사용하는 지표 */
const COUNT_METRICS = ['hr', 'pa', 'wrc_plus'] as const;

type RateMetric = typeof RATE_METRICS[number];

/** 상한을 보기 좋게 올림(예: 257 -> 280) */
function niceCeil(maxVal: number, step = 20) {
  if (!isFinite(maxVal) || maxVal <= 0) return step;
  return Math.ceil(maxVal / step) * step;
}

function ComparisonChart({ kboData, preKboData }: ComparisonChartProps) {
  /** 평균값 계산 유틸 */
  const avgOf = (arr: Player[], key: keyof Player) =>
    arr.reduce((s, p) => s + (Number(p[key]) || 0), 0) / (arr.length || 1);

  /** 좌측(Rate) 데이터 */
  const rateData = useMemo(() => {
    return RATE_METRICS.map((m) => {
      const pre = avgOf(preKboData, m as keyof Player);
      const kbo = avgOf(kboData, m as keyof Player);

      // AVG/OBP/SLG는 0.xxx, BB_PCT/K_PCT는 % -> 0.xxx로 변환
      const asRate = (metric: RateMetric, v: number) =>
        metric === 'bb_pct' || metric === 'k_pct' ? Number((v / 100).toFixed(3)) : Number(v.toFixed(3));

      return {
        metric: m.toUpperCase().replace('_', ' '),
        'Pre-KBO (Rate)': asRate(m, pre),
        'KBO 첫 해 (Rate)': asRate(m, kbo),
      };
    });
  }, [kboData, preKboData]);

  /** 우측(Count/Value) 데이터 */
  const countData = useMemo(() => {
    return COUNT_METRICS.map((m) => {
      const pre = avgOf(preKboData, m as keyof Player);
      const kbo = avgOf(kboData, m as keyof Player);
      return {
        metric: m.toUpperCase().replace('_', ' '),
        'Pre-KBO (Count)': Number(pre.toFixed(1)),
        'KBO 첫 해 (Count)': Number(kbo.toFixed(1)),
      };
    });
  }, [kboData, preKboData]);

  /** 우측 축 상한 자동 산정 */
  const countMax = useMemo(() => {
    const vals = countData.flatMap((d) => [d['Pre-KBO (Count)'], d['KBO 첫 해 (Count)']]);
    return niceCeil(Math.max(...vals), 20);
  }, [countData]);

  const chartMargin = { top: 8, right: 20, left: 16, bottom: 8 } as const;

  return (
    <ChartSection>
      <Title>⚖️ Pre-KBO vs KBO 첫 해 주요 지표 비교</Title>

      <TwoCol>
        {/* 좌측: Rate 전용 */}
        <div style={{ width: '100%', height: 440 }}>
          <ResponsiveContainer>
            <BarChart data={rateData} margin={chartMargin} barGap={4} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
              <XAxis dataKey="metric" stroke="#9aa0a6" />
              <YAxis
                domain={[0, 1.0]}
                ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                tickFormatter={(t) => t.toFixed(1)}
                stroke="#9aa0a6"
              >
                <Label value="Rate (0.xxx)" angle={-90} position="insideLeft" style={{ fill: '#9aa0a6' }} />
              </YAxis>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e2749', border: '1px solid #4285f4', borderRadius: 8 }}
                labelStyle={{ color: '#e8eaed' }}
              />
              <Legend />
              <Bar dataKey="Pre-KBO (Rate)" name="Pre-KBO (Rate)" fill="#fbbc04" />
              <Bar dataKey="KBO 첫 해 (Rate)" name="KBO 첫 해 (Rate)" fill="#6388ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 우측: Count/Value 전용 */}
        <div style={{ width: '100%', height: 440 }}>
          <ResponsiveContainer>
            <BarChart data={countData} margin={chartMargin} barGap={4} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
              <XAxis dataKey="metric" stroke="#9aa0a6" />
              <YAxis
                domain={[0, countMax]}
                ticks={[0, countMax * 0.25, countMax * 0.5, countMax * 0.75, countMax]}
                tickFormatter={(t) => (t % 1 === 0 ? t.toString() : t.toFixed(0))}
                stroke="#9aa0a6"
              >
                <Label value="Count / Value" angle={-90} position="insideLeft" style={{ fill: '#9aa0a6' }} />
              </YAxis>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e2749', border: '1px solid #4285f4', borderRadius: 8 }}
                labelStyle={{ color: '#e8eaed' }}
                formatter={(val: any) => (typeof val === 'number' ? val : '-')}
              />
              <Legend />
              <Bar dataKey="Pre-KBO (Count)" name="Pre-KBO (Count)" fill="#fbbc04" />
              <Bar dataKey="KBO 첫 해 (Count)" name="KBO 첫 해 (Count)" fill="#6388ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TwoCol>
    </ChartSection>
  );
}

export default ComparisonChart;
