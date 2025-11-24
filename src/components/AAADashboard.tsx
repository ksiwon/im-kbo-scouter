import React from 'react';
import styled from 'styled-components';
import { Card, CardTitle, StatValue, StatLabel } from './Common';
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

interface AAADashboardProps {
    aaaData: Player[];
}

function AAADashboard({ aaaData }: AAADashboardProps) {
    const totalPlayers = aaaData.length;

    // Avg Age
    const avgAge = totalPlayers > 0
        ? (aaaData.reduce((sum, p) => sum + (p.age || 0), 0) / totalPlayers).toFixed(1)
        : 0;

    // Avg wRC+
    const playersWithWrc = aaaData.filter(p => p.wrc_plus);
    const avgWrcPlus = playersWithWrc.length > 0
        ? Math.round(
            playersWithWrc.reduce((sum, p) => sum + (p.wrc_plus || 0), 0) / playersWithWrc.length
        )
        : 0;

    // Avg PA
    const avgPA = totalPlayers > 0
        ? Math.round(
            aaaData.reduce((sum, p) => sum + (p.pa || 0), 0) / totalPlayers
        )
        : 0;

    return (
        <DashboardContainer>
            <Card>
                <CardTitle>🎯 스카우팅 대상</CardTitle>
                <StatValue>{totalPlayers}</StatValue>
                <StatLabel>2025 AAA 외국인 타자 풀</StatLabel>
            </Card>

            <Card>
                <CardTitle>📅 평균 나이</CardTitle>
                <StatValue>{avgAge}</StatValue>
                <StatLabel>전체 대상 선수 평균</StatLabel>
            </Card>

            <Card>
                <CardTitle>⚡ 평균 wRC+</CardTitle>
                <StatValue>{avgWrcPlus}</StatValue>
                <StatLabel>2025 AAA 시즌 성적</StatLabel>
            </Card>

            <Card>
                <CardTitle>⚾ 평균 타석</CardTitle>
                <StatValue>{avgPA}</StatValue>
                <StatLabel>충분한 표본 확보 여부</StatLabel>
            </Card>
        </DashboardContainer>
    );
}

export default AAADashboard;
