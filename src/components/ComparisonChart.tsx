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
  Rectangle,
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
  height: 500px;
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

// Box Plot 데이터 타입 정의
interface BoxPlotData {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

// Custom Shape for Box Plot
const BoxShape = (props: any) => {
  const { x, y, width, height, fill, payload, dataKey } = props;
  const stats: BoxPlotData = payload[dataKey];

  if (!stats) return <Rectangle {...props} />;

  const { min, q1, median, q3, max } = stats;
  
  // 데이터 범위가 0일 경우 처리
  if (max === min) return null;

  const pixelHeight = height;
  const valueRange = max - min;
  const scale = pixelHeight / valueRange;

  // 각 지점의 픽셀 위치 (Top(y) 기준 상대 좌표)
  // Recharts Bar의 [min, max] range에서 y는 max값의 위치, height는 (min - max)의 픽셀 높이
  const q3Pos = (max - q3) * scale;
  const medianPos = (max - median) * scale;
  const q1Pos = (max - q1) * scale;

  const boxWidth = width * 0.6; // 박스 너비
  const center = x + width / 2;

  return (
    <g>
      {/* Whisker Line (Min to Max) */}
      <line
        x1={center}
        y1={y}
        x2={center}
        y2={y + height}
        stroke={fill}
        strokeWidth={2}
      />
      {/* Top Whisker Cap (Max) */}
      <line
        x1={center - boxWidth / 4}
        y1={y}
        x2={center + boxWidth / 4}
        y2={y}
        stroke={fill}
        strokeWidth={2}
      />
      {/* Bottom Whisker Cap (Min) */}
      <line
        x1={center - boxWidth / 4}
        y1={y + height}
        x2={center + boxWidth / 4}
        y2={y + height}
        stroke={fill}
        strokeWidth={2}
      />
      {/* Box (Q1 to Q3) */}
      <rect
        x={center - boxWidth / 2}
        y={y + q3Pos}
        width={boxWidth}
        height={q1Pos - q3Pos}
        fill={fill}
        opacity={0.6}
        stroke={fill}
        strokeWidth={2}
      />
      {/* Median Line */}
      <line
        x1={center - boxWidth / 2}
        y1={y + medianPos}
        x2={center + boxWidth / 2}
        y2={y + medianPos}
        stroke="#fff" // 중앙값은 흰색으로 강조
        strokeWidth={2}
      />
    </g>
  );
};

// 통계 계산 헬퍼
const calculateStats = (values: number[]): BoxPlotData => {
  if (values.length === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0 };
  
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  
  const getPercentile = (p: number) => {
    const index = (sorted.length - 1) * p;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };

  return {
    min,
    q1: getPercentile(0.25),
    median: getPercentile(0.5),
    q3: getPercentile(0.75),
    max,
  };
};

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

    // 4. 차트 데이터 생성
    return METRICS.map(m => {
      const getValues = (players: Player[]) => players.map(p => {
        let val = Number(p[m.key as keyof Player] || 0);
        if (m.key === 'iso') {
          val = (Number(p.slg) || 0) - (Number(p.avg) || 0);
        }
        return val;
      });

      const bestValues = getValues(best10Pre);
      const worstValues = getValues(worst10Pre);

      const bestStats = calculateStats(bestValues);
      const worstStats = calculateStats(worstValues);

      // % 단위 변환 (BB%, K%)
      const isPercent = m.key.includes('pct');
      const format = (v: number) => isPercent ? Number((v / 100).toFixed(3)) : Number(v.toFixed(3));
      
      const formatStats = (stats: BoxPlotData) => ({
        min: format(stats.min),
        q1: format(stats.q1),
        median: format(stats.median),
        q3: format(stats.q3),
        max: format(stats.max),
      });

      return {
        metric: m.label,
        bestStats: formatStats(bestStats),
        worstStats: formatStats(worstStats),
        // BarChart의 range data ([min, max]) 설정
        bestRange: [formatStats(bestStats).min, formatStats(bestStats).max],
        worstRange: [formatStats(worstStats).min, formatStats(worstStats).max],
      };
    });
  }, [kboData, preKboData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#1e2749', 
          border: '1px solid #4285f4', 
          borderRadius: 8, 
          padding: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          color: '#e8eaed'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
          {payload.map((entry: any, index: number) => {
            const stats: BoxPlotData = entry.payload[entry.dataKey === 'bestRange' ? 'bestStats' : 'worstStats'];
            const name = entry.name;
            const color = entry.fill;
            return (
              <div key={index} style={{ marginBottom: '8px', fontSize: '0.8rem' }}>
                <p style={{ color, fontWeight: 'bold', marginBottom: '4px' }}>{name}</p>
                <div style={{ paddingLeft: '8px', borderLeft: `2px solid ${color}` }}>
                  <p>Max: {stats.max}</p>
                  <p>Q3: {stats.q3}</p>
                  <p>Median: {stats.median}</p>
                  <p>Q1: {stats.q1}</p>
                  <p>Min: {stats.min}</p>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartSection>
      <Title>🏆 성공 vs 실패 그룹의 Pre-KBO 스탯 분포 (Box Plot)</Title>
      <SubTitle>
        KBO 첫 해 wRC+ 상위 10명(Best)과 하위 10명(Worst)의 <strong>한국 오기 전(Pre-KBO) 성적 분포</strong>를 비교했습니다.
        <br />
        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
          (Box: 하위 25%~상위 25%, Line: 중앙값, Whiskers: 최소~최대)
        </span>
      </SubTitle>

      <ChartWrapper>
        <ResponsiveContainer>
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barGap={12}
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
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {/* Best 10 Box Plot */}
            <Bar 
              dataKey="bestRange" 
              name="Best 10 (Success)" 
              fill="#4285f4" 
              shape={<BoxShape dataKey="bestStats" />}
            />
            
            {/* Worst 10 Box Plot */}
            <Bar 
              dataKey="worstRange" 
              name="Worst 10 (Failure)" 
              fill="#ea4335" 
              shape={<BoxShape dataKey="worstStats" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </ChartSection>
  );
}

export default ComparisonChart;
