// src/components/PlayerList.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Player } from '../types';
import { calculateRisk, generateDeepDiveAnalysis } from '../utils/sabermetrics';

const Container = styled.div`
  display: flex;
  gap: 1rem;
  height: 100%;
  width: 100%;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
  }
`;

const LeftPanel = styled.div`
  flex: 0 0 280px;
  background: ${props => props.theme.colors.bg.tertiary};
  border-radius: ${props => props.theme.borderRadius.xl};
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

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
  flex: 1;
  background: ${props => props.theme.colors.bg.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  
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

const CompactPlayerCard = styled.div<{ selected?: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.2rem 0.5rem;
  padding: 0.5rem;
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
  width: 24px;
  height: 24px;
  background: ${props => props.theme.colors.gradient.primary};
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.7rem;
  color: white;
  align-self: center;
`;

const PlayerName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayerMeta = styled.div`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const DetailTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  background: ${props => props.theme.colors.gradient.primary};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const DetailSubtitle = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const ComparisonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const ComparisonSide = styled.div<{ type: 'pre' | 'kbo' }>`
  flex: 1;
  background: ${props => props.type === 'pre' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(100, 108, 255, 0.05)'};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 0.75rem;
  border: 1px solid ${props => props.type === 'pre' ? 'rgba(255, 255, 255, 0.05)' : props.theme.colors.primary + '40'};
`;

const SideHeader = styled.div`
  text-align: center;
  margin-bottom: 0.5rem;
  
  h3 {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    color: ${props => props.theme.colors.text.primary};
  }
  
  span {
    font-size: 0.7rem;
    color: ${props => props.theme.colors.text.secondary};
    background: rgba(255, 255, 255, 0.1);
    padding: 0.1rem 0.4rem;
    border-radius: 8px;
  }
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatName = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.8rem;
`;

const StatVal = styled.span<{ highlight?: boolean }>`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.highlight ? props.theme.colors.primary : props.theme.colors.text.primary};
`;

const Arrow = styled.div`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.secondary};
  opacity: 0.5;
  display: flex;
  align-items: center;
`;

// Deep Dive Section (inline)
const DeepDiveSection = styled.div`
  background: rgba(75, 207, 250, 0.05);
  border: 1px solid rgba(75, 207, 250, 0.2);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 0.75rem;
  margin-top: auto;
`;

const DeepDiveTitle = styled.h4`
  font-size: 0.85rem;
  color: #4bcffa;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DeepDiveContent = styled.div`
  font-size: 0.8rem;
  line-height: 1.5;
  color: ${props => props.theme.colors.text.secondary};
`;

const RiskBadge = styled.span<{ $level: string }>`
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  background: ${props => 
    props.$level === 'S' ? '#00d2d3' : 
    props.$level === 'A' ? '#34a853' : 
    props.$level === 'B' ? '#fbbc04' : 
    props.$level === 'C' ? '#ff9f43' :
    '#ea4335'};
  color: ${props => 
    props.$level === 'B' || props.$level === 'C' ? '#1e272e' : 'white'};
`;

const BulletList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
  font-size: 0.75rem;
`;

const BulletItem = styled.li<{ $type: 'risk' | 'strength' }>`
  color: ${props => props.$type === 'risk' ? '#ff6b6b' : '#51cf66'};
  margin-bottom: 0.25rem;
  padding-left: 1rem;
  position: relative;
  
  &::before {
    content: '${props => props.$type === 'risk' ? '⚠️' : '✓'}';
    position: absolute;
    left: 0;
  }
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

  // Deep Dive analysis for the selected player (using preData if available)
  const playerForAnalysis = preData || currentPlayer;
  const analysis = calculateRisk(playerForAnalysis);
  const deepDive = generateDeepDiveAnalysis(playerForAnalysis);

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
            <PlayerMeta>{player.team} '{player.season?.toString().slice(2)} • wRC+ {player.wrc_plus}</PlayerMeta>
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
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#646cff' }}>
              {currentPlayer.wrc_plus}
            </div>
            <div style={{ color: '#aaa', fontSize: '0.8rem' }}>KBO wRC+</div>
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
                <StatRow><StatName>wRC+</StatName><StatVal>{preData.wrc_plus}</StatVal></StatRow>
                <StatRow><StatName>AVG</StatName><StatVal>{preData.avg?.toFixed(3)}</StatVal></StatRow>
                <StatRow><StatName>OPS</StatName><StatVal>{((preData.obp || 0) + (preData.slg || 0)).toFixed(3)}</StatVal></StatRow>
                <StatRow><StatName>BB%</StatName><StatVal>{preData.bb_pct?.toFixed(1)}%</StatVal></StatRow>
                <StatRow><StatName>K%</StatName><StatVal>{preData.k_pct?.toFixed(1)}%</StatVal></StatRow>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#666', fontSize: '0.8rem' }}>데이터 없음</div>
            )}
          </ComparisonSide>

          <Arrow>➜</Arrow>

          {/* KBO Stats */}
          <ComparisonSide type="kbo">
            <SideHeader>
              <h3>KBO First Year</h3>
              <span>KBO {currentPlayer.season}</span>
            </SideHeader>
            <StatRow><StatName>wRC+</StatName><StatVal highlight>{currentPlayer.wrc_plus}</StatVal></StatRow>
            <StatRow><StatName>AVG</StatName><StatVal highlight>{currentPlayer.avg?.toFixed(3)}</StatVal></StatRow>
            <StatRow><StatName>OPS</StatName><StatVal highlight>{((currentPlayer.obp || 0) + (currentPlayer.slg || 0)).toFixed(3)}</StatVal></StatRow>
            <StatRow><StatName>BB%</StatName><StatVal>{currentPlayer.bb_pct?.toFixed(1)}%</StatVal></StatRow>
            <StatRow><StatName>K%</StatName><StatVal>{currentPlayer.k_pct?.toFixed(1)}%</StatVal></StatRow>
          </ComparisonSide>
        </ComparisonContainer>

        {/* Inline Deep Dive Analysis */}
        <DeepDiveSection>
          <DeepDiveTitle>
            📊 Deep Dive 분석
            <RiskBadge $level={analysis.riskLevel}>{analysis.riskLevel}-Tier</RiskBadge>
          </DeepDiveTitle>
          <DeepDiveContent>
            {deepDive.paragraphs[0]}
            {(analysis.playerType.riskFactors.length > 0 || analysis.playerType.strengths.length > 0) && (
              <BulletList>
                {analysis.playerType.riskFactors.slice(0, 2).map((factor, idx) => (
                  <BulletItem key={`risk-${idx}`} $type="risk">{factor}</BulletItem>
                ))}
                {analysis.playerType.strengths.slice(0, 2).map((strength, idx) => (
                  <BulletItem key={`strength-${idx}`} $type="strength">{strength}</BulletItem>
                ))}
              </BulletList>
            )}
          </DeepDiveContent>
        </DeepDiveSection>
      </RightPanel>
    </Container>
  );
}

export default PlayerList;