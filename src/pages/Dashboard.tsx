// src/pages/Dashboard.tsx
import React from 'react';
import styled from 'styled-components';
import { Card, CardTitle, StatValue, StatLabel } from '../components/Common';
import { Player } from '../types';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  
  // wrc+가 있는 선수들로만 평균 계산
  const playersWithWrc = playersWithSeason.filter((p: Player) => p['wrc+']);
  const avgWrcPlus = playersWithWrc.length > 0
    ? Math.round(
        playersWithWrc.reduce((sum: number, p: Player) => sum + (p['wrc+'] || 0), 0) / playersWithWrc.length
      )
    : 0;
  
  // HR 평균
  const avgHR = totalPlayers > 0
    ? Math.round(
        playersWithSeason.reduce((sum: number, p: Player) => sum + (p.hr || 0), 0) / totalPlayers
      )
    : 0;
  
  // 성공률 (wrc+ > 110)
  const successRate = playersWithWrc.length > 0
    ? Math.round(
        (playersWithWrc.filter((p: Player) => (p['wrc+'] || 0) > 110).length / playersWithWrc.length) * 100
      )
    : 0;

  return (
    <DashboardContainer>
      <Card>
        <CardTitle>👥 Total Players Analyzed</CardTitle>
        <StatValue>{totalPlayers}</StatValue>
        <StatLabel>Foreign hitters in KBO (2010+)</StatLabel>
      </Card>
      
      <Card>
        <CardTitle>⚡ Average wRC+</CardTitle>
        <StatValue>{avgWrcPlus}</StatValue>
        <StatLabel>First KBO season performance ({playersWithWrc.length} players)</StatLabel>
      </Card>
      
      <Card>
        <CardTitle>💪 Average Home Runs</CardTitle>
        <StatValue>{avgHR}</StatValue>
        <StatLabel>Per season in KBO debut year</StatLabel>
      </Card>
      
      <Card>
        <CardTitle>✅ Success Rate</CardTitle>
        <StatValue>{successRate}%</StatValue>
        <StatLabel>Players with wRC+ &gt; 110</StatLabel>
      </Card>
    </DashboardContainer>
  );
}

export default Dashboard;