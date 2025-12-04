// src/components/DeepDiveOverlay.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Player } from '../types';
import { calculateRisk } from '../utils/sabermetrics';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const OverlayContainer = styled.div`
  /* Removed absolute positioning here as it's handled by wrapper in parent or fixed */
  width: 400px;
  background: rgba(20, 20, 30, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(75, 207, 250, 0.5); /* Cyan border */
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  animation: ${fadeIn} 0.3s ease-out;
  color: white;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.75rem;
`;

const PlayerName = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  color: #4bcffa;
`;

const RiskBadge = styled.span<{ level: string }>`
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  background: ${props => 
    props.level === 'S' ? '#00d2d3' : 
    props.level === 'A' ? '#34a853' : 
    props.level === 'B' ? '#fbbc04' : 
    '#ff3f34'};
  color: #1e272e;
`;

const AnalysisText = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #d2dae2;
  margin-bottom: 1.5rem;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  padding: 0.5rem;
  border-radius: 4px;
  
  &:hover {
    background: rgba(255,255,255,0.05);
  }
  
  span:first-child {
    color: #808e9b;
  }
  span:last-child {
    font-weight: bold;
    color: #fff;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #808e9b;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0.5rem;
  
  &:hover {
    color: white;
  }
`;

interface DeepDiveOverlayProps {
  player: Player | null;
  onClose: () => void;
}

const DeepDiveOverlay: React.FC<DeepDiveOverlayProps> = ({ player, onClose }) => {
  if (!player) return null;

  const analysis = calculateRisk(player);

  return (
    <OverlayContainer onClick={(e) => e.stopPropagation()}>
      <CloseButton onClick={onClose}>×</CloseButton>
      <Header>
        <PlayerName>{player.name}</PlayerName>
        <RiskBadge level={analysis.riskLevel}>{analysis.riskLevel}-Tier</RiskBadge>
      </Header>
      
      <AnalysisText>
        {analysis.summary}
      </AnalysisText>

      <div style={{ marginBottom: '1.5rem' }}>
        {analysis.details.map((detail, idx) => (
          <div key={idx} style={{ fontSize: '0.9rem', color: '#0fbcf9', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <span>•</span>
            <span>{detail}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
        <StatRow>
          <span>AAA wRC+</span>
          <span>{player.wrc_plus}</span>
        </StatRow>
        <StatRow>
          <span>K%</span>
          <span>{player.k_pct?.toFixed(1)}%</span>
        </StatRow>
        <StatRow>
          <span>BB%</span>
          <span>{player.bb_pct?.toFixed(1)}%</span>
        </StatRow>
        <StatRow>
          <span>BB/K</span>
          <span>{((player.bb_pct || 0) / (player.k_pct || 1)).toFixed(2)}</span>
        </StatRow>
      </div>
    </OverlayContainer>
  );
};

export default DeepDiveOverlay;
