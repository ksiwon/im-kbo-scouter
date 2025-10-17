// src/components/PlayerList.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Player } from '../types';

const ListContainer = styled.div`
  background: ${props => props.theme.colors.bg.tertiary};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
`;

const ListTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const PlayerCard = styled.div<{ selected?: boolean }>`
  background: ${props => props.theme.colors.bg.secondary};
  padding: 1.5rem;
  margin: 1rem 0;
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  
  &:hover {
    transform: translateX(10px);
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PlayerName = styled.h4`
  font-size: 1.3rem;
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PlayerRank = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${props => props.theme.colors.gradient.primary};
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.9rem;
`;

const PlayerInfo = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: ${props => props.theme.colors.bg.tertiary};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const StatValue = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 0.25rem;
`;

const DetailedStats = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.bg.card};
  border-radius: ${props => props.theme.borderRadius.md};
  animation: slideDown 0.3s ease;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DetailedStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`;

const ComparisonSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.bg.hover};
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 4px solid ${props => props.theme.colors.accent};
`;

const ComparisonTitle = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.75rem;
  font-weight: 600;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

interface PlayerListProps {
  kboData: Player[];
  preKboData: Player[];
}

function PlayerList({ kboData, preKboData }: PlayerListProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Top 10 선수 추출 (wRC+ 기준)
  const topPlayers = kboData
    .filter(p => p.season && p['wrc+'])
    .sort((a, b) => (b['wrc+'] || 0) - (a['wrc+'] || 0))
    .slice(0, 10);

  // Pre-KBO 데이터 찾기
  const getPreKboData = (playerName: string) => {
    return preKboData.find(p => p.name === playerName);
  };

  return (
    <ListContainer>
      <ListTitle>🏆 Top 10 Performers (wRC+ 기준)</ListTitle>
      
      {topPlayers.map((player, index) => {
        const preData = getPreKboData(player.name);
        const isSelected = selectedPlayer === player.name;
        
        return (
          <PlayerCard
            key={player.name}
            selected={isSelected}
            onClick={() => setSelectedPlayer(isSelected ? null : player.name)}
          >
            <PlayerHeader>
              <PlayerName>
                <PlayerRank>{index + 1}</PlayerRank>
                {player.name}
              </PlayerName>
              <PlayerInfo>
                {player.team} • {player.season}년
              </PlayerInfo>
            </PlayerHeader>

            <StatsGrid>
              <StatItem>
                <StatValue>{player['wrc+']}</StatValue>
                <StatLabel>wRC+</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{player.hr}</StatValue>
                <StatLabel>HR</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{player.avg?.toFixed(3)}</StatValue>
                <StatLabel>AVG</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{((player.obp || 0) + (player.slg || 0)).toFixed(3)}</StatValue>
                <StatLabel>OPS</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{player.pa}</StatValue>
                <StatLabel>PA</StatLabel>
              </StatItem>
            </StatsGrid>

            {isSelected && (
              <DetailedStats>
                <ComparisonTitle>⚾ KBO 첫 해 상세 기록</ComparisonTitle>
                <DetailedStatsGrid>
                  <StatItem>
                    <StatValue>{player.rbi_runs_batted_in}</StatValue>
                    <StatLabel>RBI</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{player.r_runs}</StatValue>
                    <StatLabel>득점</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{player.sb_stolen_bases}</StatValue>
                    <StatLabel>도루</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{player.obp?.toFixed(3)}</StatValue>
                    <StatLabel>OBP</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{player.slg?.toFixed(3)}</StatValue>
                    <StatLabel>SLG</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{player['bb%']?.toFixed(1)}%</StatValue>
                    <StatLabel>BB%</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{player['k%']?.toFixed(1)}%</StatValue>
                    <StatLabel>K%</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{player.g_games_played}</StatValue>
                    <StatLabel>경기</StatLabel>
                  </StatItem>
                </DetailedStatsGrid>

                {preData && (
                  <ComparisonSection>
                    <ComparisonTitle>
                      📊 Pre-KBO 기록 ({preData.level} • {preData.year}년)
                    </ComparisonTitle>
                    <ComparisonGrid>
                      <StatItem>
                        <StatValue>{preData['wrc+']}</StatValue>
                        <StatLabel>wRC+</StatLabel>
                      </StatItem>
                      <StatItem>
                        <StatValue>{preData.hr}</StatValue>
                        <StatLabel>HR</StatLabel>
                      </StatItem>
                      <StatItem>
                        <StatValue>{preData.avg?.toFixed(3)}</StatValue>
                        <StatLabel>AVG</StatLabel>
                      </StatItem>
                      <StatItem>
                        <StatValue>{((preData.obp || 0) + (preData.slg || 0)).toFixed(3)}</StatValue>
                        <StatLabel>OPS</StatLabel>
                      </StatItem>
                      <StatItem>
                        <StatValue>{preData['bb%']?.toFixed(1)}%</StatValue>
                        <StatLabel>BB%</StatLabel>
                      </StatItem>
                      <StatItem>
                        <StatValue>{preData['k%']?.toFixed(1)}%</StatValue>
                        <StatLabel>K%</StatLabel>
                      </StatItem>
                      <StatItem>
                        <StatValue>{preData.pa}</StatValue>
                        <StatLabel>PA</StatLabel>
                      </StatItem>
                    </ComparisonGrid>
                  </ComparisonSection>
                )}
              </DetailedStats>
            )}
          </PlayerCard>
        );
      })}
    </ListContainer>
  );
}

export default PlayerList;