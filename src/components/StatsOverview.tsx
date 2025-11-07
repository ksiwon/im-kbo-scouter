// src/components/StatsOverview.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Player } from '../types';

const OverviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  animation: fadeIn 0.8s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const StatCard = styled.div<{ active?: boolean }>`
  background: ${props => props.theme.colors.bg.tertiary};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  text-align: center;
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  transform: ${props => props.active ? 'scale(1.05)' : 'scale(1)'};
  box-shadow: ${props => props.active ? props.theme.shadows.xl : props.theme.shadows.md};

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: ${props => props.theme.shadows.xl};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 0.5rem;
`;

const StatDescription = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.disabled};
  margin-top: 0.5rem;
  line-height: 1.4;
`;

interface StatsOverviewProps {
  kboData: Player[];
  preKboData: Player[];
}

function StatsOverview({ kboData, preKboData }: StatsOverviewProps) {
  const [activeStat, setActiveStat] = useState<string | null>(null);

  const kboPlayers = kboData.filter(p => p.season && p.wrc_plus);
  const totalPlayers = kboPlayers.length;
  
  const avgWrcPlus = Math.round(
    kboPlayers.reduce((sum, p) => sum + (p.wrc_plus || 0), 0) / totalPlayers
  );
  
  const avgHR = Math.round(
    kboPlayers.reduce((sum, p) => sum + (p.hr || 0), 0) / totalPlayers
  );
  
  const successRate = Math.round(
    (kboPlayers.filter(p => (p.wrc_plus || 0) > 110).length / totalPlayers) * 100
  );
  
  const avgPA = Math.round(
    kboPlayers.reduce((sum, p) => sum + (p.pa || 0), 0) / totalPlayers
  );
  
  const stats = [
    {
      id: 'total',
      value: totalPlayers,
      label: '분석된 선수',
      description: '2010년 이후 KBO에 입단한 외국인 타자'
    },
    {
      id: 'wrc',
      value: avgWrcPlus,
      label: '평균 wRC+',
      description: 'KBO 첫 시즌 평균 공격력'
    },
    {
      id: 'hr',
      value: avgHR,
      label: '평균 홈런',
      description: 'KBO 첫 시즌 평균 홈런 개수'
    },
    {
      id: 'success',
      value: `${successRate}%`,
      label: '성공률',
      description: 'wRC+ 110 이상 달성 비율'
    },
    {
      id: 'pa',
      value: avgPA,
      label: '평균 타석',
      description: 'KBO 첫 시즌 평균 타석 수'
    },
  ];

  return (
    <OverviewContainer>
      {stats.map(stat => (
        <StatCard
          key={stat.id}
          active={activeStat === stat.id}
          onClick={() => setActiveStat(activeStat === stat.id ? null : stat.id)}
        >
          <StatValue>{stat.value}</StatValue>
          <StatLabel>{stat.label}</StatLabel>
          {activeStat === stat.id && (
            <StatDescription>{stat.description}</StatDescription>
          )}
        </StatCard>
      ))}
    </OverviewContainer>
  );
}

export default StatsOverview;