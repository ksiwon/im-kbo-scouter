// src/pages/PlayerComparison.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, CardTitle, StatLabel, StatChip } from '../components/Common';
import { Player } from '../types';
import { theme } from '../styles/GlobalStyle';

const ComparisonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
`;

const PlayerCard = styled(Card)<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  cursor: pointer;
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  
  &:hover {
    background: ${props => props.theme.colors.bg.hover};
  }
`;

const PlayerName = styled.h4`
  font-size: 1.1rem;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const PlayerStats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const DetailCard = styled(Card)`
  background: ${props => props.theme.colors.gradient.info};
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const DetailItem = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.md};
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.md};
`;

const DetailValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
`;

interface PlayerComparisonProps {
  kboData: Player[];
  preKboData: Player[];
}

function PlayerComparison({ kboData }: PlayerComparisonProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  const topPerformers = kboData
    .filter((p: Player) => p.season && p['wrc+'])  // ← 수정!
    .sort((a: Player, b: Player) => (b['wrc+'] || 0) - (a['wrc+'] || 0))  // ← 수정!
    .slice(0, 10);

  return (
    <ComparisonContainer>
      <Card>
        <CardTitle>🏆 Top Performers (by wRC+)</CardTitle>
        <StatLabel>Click on a player to see detailed statistics</StatLabel>
      </Card>
      
      {selectedPlayer && (
        <DetailCard>
          <CardTitle style={{ color: 'white' }}>
            ⭐ {selectedPlayer.name} - Detailed Stats
          </CardTitle>
          <DetailGrid>
            <DetailItem>
              <DetailValue>{selectedPlayer['wrc+'] || 'N/A'}</DetailValue>
              <DetailLabel>wRC+</DetailLabel>
            </DetailItem>
            <DetailItem>
              <DetailValue>{selectedPlayer.hr || 0}</DetailValue>
              <DetailLabel>Home Runs</DetailLabel>
            </DetailItem>
            <DetailItem>
              <DetailValue>{selectedPlayer.avg?.toFixed(3) || 'N/A'}</DetailValue>
              <DetailLabel>Batting Avg</DetailLabel>
            </DetailItem>
            <DetailItem>
              <DetailValue>{selectedPlayer.obp?.toFixed(3) || 'N/A'}</DetailValue>
              <DetailLabel>OBP</DetailLabel>
            </DetailItem>
            <DetailItem>
              <DetailValue>{selectedPlayer.slg?.toFixed(3) || 'N/A'}</DetailValue>
              <DetailLabel>SLG</DetailLabel>
            </DetailItem>
            <DetailItem>
              <DetailValue>
                {((selectedPlayer.obp || 0) + (selectedPlayer.slg || 0)).toFixed(3)}
              </DetailValue>
              <DetailLabel>OPS</DetailLabel>
            </DetailItem>
            <DetailItem>
              <DetailValue>{selectedPlayer['bb%']?.toFixed(1) || 'N/A'}%</DetailValue>
              <DetailLabel>Walk Rate</DetailLabel>
            </DetailItem>
            <DetailItem>
              <DetailValue>{selectedPlayer['k%']?.toFixed(1) || 'N/A'}%</DetailValue>
              <DetailLabel>Strikeout Rate</DetailLabel>
            </DetailItem>
            <DetailItem>
              <DetailValue>{selectedPlayer.pa || 0}</DetailValue>
              <DetailLabel>Plate Appearances</DetailLabel>
            </DetailItem>
            <DetailItem>
              <DetailValue>{selectedPlayer.rbi_runs_batted_in || 0}</DetailValue>
              <DetailLabel>RBI</DetailLabel>
            </DetailItem>
            <DetailItem>
              <DetailValue>{selectedPlayer.r_runs || 0}</DetailValue>
              <DetailLabel>Runs</DetailLabel>
            </DetailItem>
            <DetailItem>
              <DetailValue>{selectedPlayer.sb_stolen_bases || 0}</DetailValue>
              <DetailLabel>Stolen Bases</DetailLabel>
            </DetailItem>
          </DetailGrid>
        </DetailCard>
      )}
      
      {topPerformers.map((player: Player, idx: number) => (
        <PlayerCard 
          key={idx}
          selected={selectedPlayer?.name === player.name}
          onClick={() => setSelectedPlayer(player)}
        >
          <div style={{ flex: 1 }}>
            <PlayerName>
              {idx + 1}. {player.name}
            </PlayerName>
            <StatLabel>{player.team} • {player.season}</StatLabel>
            <PlayerStats style={{ marginTop: '8px' }}>
              <StatChip color={theme.colors.chart.blue}>
                wRC+: {player['wrc+'] || 'N/A'}
              </StatChip>
              <StatChip color={theme.colors.chart.green}>
                HR: {player.hr || 0}
              </StatChip>
              <StatChip color={theme.colors.chart.yellow}>
                AVG: {player.avg?.toFixed(3) || 'N/A'}
              </StatChip>
              <StatChip color={theme.colors.chart.purple}>
                OPS: {((player.obp || 0) + (player.slg || 0)).toFixed(3)}
              </StatChip>
            </PlayerStats>
          </div>
        </PlayerCard>
      ))}
    </ComparisonContainer>
  );
}

export default PlayerComparison;