// src/components/PlayerList.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Player } from '../types';

const Container = styled.div`
  display: flex;
  gap: 1.5rem;
  height: 600px;
  width: 100%;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
  }
`;

const LeftPanel = styled.div`
  flex: 1; /* 1/4 width roughly, but flex: 1 vs flex: 3 achieves 1:3 ratio */
  background: ${props => props.theme.colors.bg.tertiary};
  border-radius: ${props => props.theme.borderRadius.xl};
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
`;

const RightPanel = styled.div`
  flex: 3; /* 3/4 width */
  background: ${props => props.theme.colors.bg.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const CompactPlayerCard = styled.div<{ selected?: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  gap: 0.25rem 0.75rem;
  padding: 0.75rem;
  background: ${props => props.selected ? props.theme.colors.primary + '20' : props.theme.colors.bg.secondary};
  border: 1px solid ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.bg.hover};
    transform: translateX(4px);
  }
`;

const RankBadge = styled.div`
  grid-row: 1 / span 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: ${props => props.theme.colors.gradient.primary};
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.8rem;
  color: white;
  align-self: center;
`;

const PlayerName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: ${props => props.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayerMeta = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const CompactStats = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const CompactStatItem = styled.div`
  text-align: center;
`;

const CompactStatLabel = styled.div`
  font-size: 0.65rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 2px;
`;

const CompactStatValue = styled.div<{ highlight?: boolean }>`
  font-size: 0.8rem;
  font-weight: ${props => props.highlight ? '700' : '500'};
  color: ${props => props.highlight ? props.theme.colors.primary : props.theme.colors.text.primary};
`;

// Right Panel Components
const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const DetailTitle = styled.h2`
  font-size: 2.5rem;
  margin: 0;
  background: ${props => props.theme.colors.gradient.primary};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const DetailSubtitle = styled.div`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const ComparisonContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 2rem;
  align-items: center;
`;

const ComparisonSide = styled.div<{ type: 'pre' | 'kbo' }>`
  flex: 1;
  background: ${props => props.type === 'pre' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(100, 108, 255, 0.05)'};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  height: 100%;
  border: 1px solid ${props => props.type === 'pre' ? 'rgba(255, 255, 255, 0.05)' : props.theme.colors.primary + '40'};
  display: flex;
  flex-direction: column;
`;

const SideHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.text.primary};
  }
  
  span {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.text.secondary};
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
  }
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatName = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const StatVal = styled.span<{ highlight?: boolean }>`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.highlight ? props.theme.colors.primary : props.theme.colors.text.primary};
`;

const Arrow = styled.div`
  font-size: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  opacity: 0.5;
`;

interface PlayerListProps {
  kboData: Player[];
  preKboData: Player[];
}

function PlayerList({ kboData, preKboData }: PlayerListProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Top 10 선수 추출 (wRC+ 기준)
  const topPlayers = kboData
    .filter(p => p.season && p.wrc_plus)
    .sort((a, b) => (b.wrc_plus || 0) - (a.wrc_plus || 0))
    .slice(0, 10);

  // 초기 선택 설정
  useEffect(() => {
    if (topPlayers.length > 0 && !selectedPlayer) {
      setSelectedPlayer(topPlayers[0].name);
    }
  }, [topPlayers, selectedPlayer]);

  const currentPlayer = topPlayers.find(p => p.name === selectedPlayer) || topPlayers[0];
  const preData = preKboData.find(p => p.name === currentPlayer?.name);

  if (!currentPlayer) return null;

  return (
    <Container>
      <LeftPanel>
        {topPlayers.map((player, index) => (
          <CompactPlayerCard
            key={player.name}
            selected={selectedPlayer === player.name}
            onClick={() => setSelectedPlayer(player.name)}
          >
            <RankBadge>{index + 1}</RankBadge>
            <PlayerName>{player.name}</PlayerName>
            <PlayerMeta>{player.team} '{player.season?.toString().slice(2)}</PlayerMeta>

            <CompactStats>
              <CompactStatItem>
                <CompactStatLabel>wRC+</CompactStatLabel>
                <CompactStatValue highlight>{player.wrc_plus}</CompactStatValue>
              </CompactStatItem>
              <CompactStatItem>
                <CompactStatLabel>HR</CompactStatLabel>
                <CompactStatValue>{player.hr}</CompactStatValue>
              </CompactStatItem>
              <CompactStatItem>
                <CompactStatLabel>AVG</CompactStatLabel>
                <CompactStatValue>{player.avg?.toFixed(3)}</CompactStatValue>
              </CompactStatItem>
              <CompactStatItem>
                <CompactStatLabel>OPS</CompactStatLabel>
                <CompactStatValue>{((player.obp || 0) + (player.slg || 0)).toFixed(3)}</CompactStatValue>
              </CompactStatItem>
              <CompactStatItem>
                <CompactStatLabel>PA</CompactStatLabel>
                <CompactStatValue>{player.pa}</CompactStatValue>
              </CompactStatItem>
            </CompactStats>
          </CompactPlayerCard>
        ))}
      </LeftPanel>

      <RightPanel>
        <DetailHeader>
          <div>
            <DetailTitle>{currentPlayer.name}</DetailTitle>
            <DetailSubtitle>{currentPlayer.team} • {currentPlayer.season} Season</DetailSubtitle>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#646cff' }}>
              {currentPlayer.wrc_plus}
            </div>
            <div style={{ color: '#aaa' }}>KBO wRC+</div>
          </div>
        </DetailHeader>

        <ComparisonContainer>
          {/* Pre-KBO Stats */}
          <ComparisonSide type="pre">
            <SideHeader>
              <h3>Pre-KBO</h3>
              <span>{preData?.level} {preData?.year}</span>
            </SideHeader>
            {preData ? (
              <>
                <StatRow>
                  <StatName>wRC+</StatName>
                  <StatVal>{preData.wrc_plus}</StatVal>
                </StatRow>
                <StatRow>
                  <StatName>AVG</StatName>
                  <StatVal>{preData.avg?.toFixed(3)}</StatVal>
                </StatRow>
                <StatRow>
                  <StatName>OPS</StatName>
                  <StatVal>{((preData.obp || 0) + (preData.slg || 0)).toFixed(3)}</StatVal>
                </StatRow>
                <StatRow>
                  <StatName>BB%</StatName>
                  <StatVal>{preData.bb_pct?.toFixed(1)}%</StatVal>
                </StatRow>
                <StatRow>
                  <StatName>K%</StatName>
                  <StatVal>{preData.k_pct?.toFixed(1)}%</StatVal>
                </StatRow>
                <StatRow>
                  <StatName>HR</StatName>
                  <StatVal>{preData.hr}</StatVal>
                </StatRow>
              </>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
                데이터 없음
              </div>
            )}
          </ComparisonSide>

          <Arrow>➜</Arrow>

          {/* KBO Stats */}
          <ComparisonSide type="kbo">
            <SideHeader>
              <h3>KBO First Year</h3>
              <span>KBO {currentPlayer.season}</span>
            </SideHeader>
            <StatRow>
              <StatName>wRC+</StatName>
              <StatVal highlight>{currentPlayer.wrc_plus}</StatVal>
            </StatRow>
            <StatRow>
              <StatName>AVG</StatName>
              <StatVal highlight>{currentPlayer.avg?.toFixed(3)}</StatVal>
            </StatRow>
            <StatRow>
              <StatName>OPS</StatName>
              <StatVal highlight>{((currentPlayer.obp || 0) + (currentPlayer.slg || 0)).toFixed(3)}</StatVal>
            </StatRow>
            <StatRow>
              <StatName>BB%</StatName>
              <StatVal>{currentPlayer.bb_pct?.toFixed(1)}%</StatVal>
            </StatRow>
            <StatRow>
              <StatName>K%</StatName>
              <StatVal>{currentPlayer.k_pct?.toFixed(1)}%</StatVal>
            </StatRow>
            <StatRow>
              <StatName>HR</StatName>
              <StatVal>{currentPlayer.hr}</StatVal>
            </StatRow>
          </ComparisonSide>
        </ComparisonContainer>
      </RightPanel>
    </Container>
  );
}

export default PlayerList;