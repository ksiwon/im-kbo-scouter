// src/pages/Dashboard.tsx
import React from 'react';
import styled from 'styled-components';
import { Card, CardTitle, StatValue, StatLabel } from '../components/Common';
import { Player } from '../types';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

interface DashboardProps {
  kboData: Player[];
  preKboData: Player[];
}

function Dashboard({ kboData, preKboData }: DashboardProps) {
  // season이 있는 선수들만 필터링
  const playersWithSeason = kboData.filter((p: Player) => p.season);
  const totalPlayers = playersWithSeason.length;
  
  // wrc_plus가 있는 선수들로만 평균 계산
  const playersWithWrc = playersWithSeason.filter((p: Player) => p.wrc_plus);
  const avgWrcPlus = playersWithWrc.length > 0
    ? Math.round(
        playersWithWrc.reduce((sum: number, p: Player) => sum + (p.wrc_plus || 0), 0) / playersWithWrc.length
      )
    : 0;
  
  // HR 평균
  const avgHR = totalPlayers > 0
    ? Math.round(
        playersWithSeason.reduce((sum: number, p: Player) => sum + (p.hr || 0), 0) / totalPlayers
      )
    : 0;
  
  // 성공률 (wrc_plus > 110)
  const successRate = playersWithWrc.length > 0
    ? Math.round(
        (playersWithWrc.filter((p: Player) => (p.wrc_plus || 0) > 110).length / playersWithWrc.length) * 100
      )
    : 0;

  return (
    <DashboardContainer>
      <Card>
        <CardTitle>👥 분석 선수 수</CardTitle>
        <StatValue>{totalPlayers}</StatValue>
        <StatLabel>2010년 이후 KBO 외국인 타자</StatLabel>
      </Card>
      
      <Card>
        <CardTitle>⚡ 평균 wRC+</CardTitle>
        <StatValue>{avgWrcPlus}</StatValue>
        <StatLabel>KBO 첫 시즌 성적 ({playersWithWrc.length}명)</StatLabel>
      </Card>
      
      <Card>
        <CardTitle>💪 평균 홈런</CardTitle>
        <StatValue>{avgHR}</StatValue>
        <StatLabel>KBO 데뷔 시즌 기준</StatLabel>
      </Card>
      
      <Card>
        <CardTitle>✅ 성공률</CardTitle>
        <StatValue>{successRate}%</StatValue>
        <StatLabel>wRC+ &gt; 110 달성 선수</StatLabel>
      </Card>
    </DashboardContainer>
  );
}

export default Dashboard;