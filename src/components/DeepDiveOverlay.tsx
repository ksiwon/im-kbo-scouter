// src/components/DeepDiveOverlay.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Player } from '../types';
import { calculateRisk, generateDeepDiveAnalysis } from '../utils/sabermetrics';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const OverlayContainer = styled.div`
  width: 420px;
  max-height: 80vh;
  overflow-y: auto;
  background: rgba(18, 18, 28, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(75, 207, 250, 0.4);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.8);
  animation: ${fadeIn} 0.3s ease-out;
  color: white;
  position: relative;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const PlayerInfo = styled.div`
  flex: 1;
`;

const PlayerName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #4bcffa;
`;

const PlayerMeta = styled.div`
  font-size: 0.85rem;
  color: #9aa0a6;
`;

const ArchetypeBadge = styled.div<{ $archetype: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
`;

const ArchetypeIcon = styled.span`
  font-size: 2rem;
`;

const ArchetypeLabel = styled.span<{ $archetype: string }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.$archetype) {
      case 'ELITE': return 'rgba(0, 210, 211, 0.2)';
      case 'SAFE': return 'rgba(52, 168, 83, 0.2)';
      case 'TRAP': return 'rgba(255, 152, 0, 0.2)';
      case 'POWER': return 'rgba(156, 39, 176, 0.2)';
      default: return 'rgba(158, 158, 158, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.$archetype) {
      case 'ELITE': return '#00d2d3';
      case 'SAFE': return '#34a853';
      case 'TRAP': return '#ff9800';
      case 'POWER': return '#ce93d8';
      default: return '#9e9e9e';
    }
  }};
  border: 1px solid currentColor;
`;

const RiskBadge = styled.span<{ $level: string }>`
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: bold;
  background: ${props => 
    props.$level === 'S' ? '#00d2d3' : 
    props.$level === 'A' ? '#34a853' : 
    props.$level === 'B' ? '#fbbc04' : 
    props.$level === 'C' ? '#ff9f43' :
    '#ea4335'};
  color: ${props => 
    props.$level === 'B' || props.$level === 'C' ? '#1e272e' : 'white'};
  margin-top: 0.25rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h4`
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #4bcffa;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(75, 207, 250, 0.3);
  }
`;

const AnalysisText = styled.p`
  font-size: 0.95rem;
  line-height: 1.7;
  color: #d2dae2;
  margin-bottom: 1rem;
`;

const BulletList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BulletItem = styled.li<{ $type: 'risk' | 'strength' }>`
  font-size: 0.9rem;
  color: ${props => props.$type === 'risk' ? '#ff6b6b' : '#51cf66'};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  &::before {
    content: '${props => props.$type === 'risk' ? '⚠️' : '✓'}';
    flex-shrink: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  border-radius: 12px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: #808e9b;
  margin-top: 0.2rem;
`;

const Verdict = styled.div<{ $level: string }>`
  background: ${props => {
    switch (props.$level) {
      case 'S': return 'rgba(0, 210, 211, 0.1)';
      case 'A': return 'rgba(52, 168, 83, 0.1)';
      case 'B': return 'rgba(251, 188, 4, 0.1)';
      case 'C': return 'rgba(255, 152, 0, 0.1)';
      default: return 'rgba(234, 67, 53, 0.1)';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$level) {
      case 'S': return 'rgba(0, 210, 211, 0.3)';
      case 'A': return 'rgba(52, 168, 83, 0.3)';
      case 'B': return 'rgba(251, 188, 4, 0.3)';
      case 'C': return 'rgba(255, 152, 0, 0.3)';
      default: return 'rgba(234, 67, 53, 0.3)';
    }
  }};
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #e8eaed;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #808e9b;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

interface DeepDiveOverlayProps {
  player: Player | null;
  onClose: () => void;
}

const DeepDiveOverlay: React.FC<DeepDiveOverlayProps> = ({ player, onClose }) => {
  if (!player) return null;

  const analysis = calculateRisk(player);
  const deepDive = generateDeepDiveAnalysis(player);
  const { playerType } = analysis;

  return (
    <OverlayContainer onClick={(e) => e.stopPropagation()}>
      <CloseButton onClick={onClose} aria-label="닫기">×</CloseButton>
      
      <Header>
        <PlayerInfo>
          <PlayerName>{player.name}</PlayerName>
          <PlayerMeta>
            {player.team} • {player.age}세 • {player.pa}PA
          </PlayerMeta>
        </PlayerInfo>
        <ArchetypeBadge $archetype={playerType.archetype}>
          <ArchetypeIcon>{playerType.archetypeIcon}</ArchetypeIcon>
          <ArchetypeLabel $archetype={playerType.archetype}>
            {playerType.archetypeKorean}
          </ArchetypeLabel>
          <RiskBadge $level={analysis.riskLevel}>
            {analysis.riskLevel}-Tier
          </RiskBadge>
        </ArchetypeBadge>
      </Header>
      
      <Section>
        <SectionTitle>📊 심층 분석</SectionTitle>
        {deepDive.paragraphs.map((paragraph, idx) => (
          <AnalysisText key={idx}>{paragraph}</AnalysisText>
        ))}
      </Section>
      
      {(playerType.riskFactors.length > 0 || playerType.strengths.length > 0) && (
        <Section>
          <SectionTitle>⚖️ 리스크 & 강점</SectionTitle>
          <BulletList>
            {playerType.riskFactors.map((factor, idx) => (
              <BulletItem key={`risk-${idx}`} $type="risk">
                {factor}
              </BulletItem>
            ))}
            {playerType.strengths.map((strength, idx) => (
              <BulletItem key={`strength-${idx}`} $type="strength">
                {strength}
              </BulletItem>
            ))}
          </BulletList>
        </Section>
      )}
      
      <Section>
        <SectionTitle>📈 2025 AAA 핵심 스탯</SectionTitle>
        <StatsGrid>
          <StatItem>
            <StatValue>{player.avg?.toFixed(3) || '-'}</StatValue>
            <StatLabel>AVG</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{player.wrc_plus || '-'}</StatValue>
            <StatLabel>wRC+</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{player.k_pct?.toFixed(1)}%</StatValue>
            <StatLabel>K%</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{player.bb_pct?.toFixed(1)}%</StatValue>
            <StatLabel>BB%</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{player.hr || '-'}</StatValue>
            <StatLabel>HR</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{player.obp?.toFixed(3) || '-'}</StatValue>
            <StatLabel>OBP</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{player.slg?.toFixed(3) || '-'}</StatValue>
            <StatLabel>SLG</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>
              {player.bb_pct && player.k_pct 
                ? (player.bb_pct / player.k_pct).toFixed(2) 
                : '-'}
            </StatValue>
            <StatLabel>BB/K</StatLabel>
          </StatItem>
        </StatsGrid>
      </Section>
      
      <Verdict $level={analysis.riskLevel}>
        {deepDive.verdict}
      </Verdict>
    </OverlayContainer>
  );
};

export default DeepDiveOverlay;
