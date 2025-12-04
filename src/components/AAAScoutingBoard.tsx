// src/components/AAAScoutingBoard.tsx
import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { Player } from '../types';
import { calculateRisk } from '../utils/sabermetrics';
import DeepDiveOverlay from './DeepDiveOverlay';

const Container = styled.div`
  display: flex;
  gap: 1.5rem;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative; /* For Overlay positioning context if needed, but we'll use fixed for overlay */

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
    overflow-y: auto;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  background: ${props => props.theme.colors.bg.tertiary};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
  min-width: 300px;
  max-width: 350px;
`;

const RightPanel = styled.div`
  flex: 2;
  background: ${props => props.theme.colors.bg.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  
  /* Ensure content fits or scrolls nicely */
  max-height: 100%;
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: ${props => props.theme.colors.bg.secondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SortContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SortButton = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: 0.5rem;
  background: ${props => props.active
    ? props.theme.colors.gradient.primary
    : props.theme.colors.bg.secondary
  };
  color: ${props => props.theme.colors.text.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s ease;
`;

const PlayerList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 0.5rem;

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

const CompactPlayerCard = styled.div<{ selected?: boolean; riskLevel: string }>`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.25rem;
  padding: 0.75rem;
  background: ${props => props.selected ? props.theme.colors.primary + '20' : props.theme.colors.bg.secondary};
  border: 1px solid ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  border-left: 4px solid ${props =>
    props.riskLevel === 'S' ? '#00d2d3' : // Cyan for Elite
    props.riskLevel === 'A' ? '#34a853' : // Green for Low Risk
    props.riskLevel === 'B' ? '#fbbc04' : // Yellow for Moderate
    props.riskLevel === 'C' ? '#ff9f43' : // Orange for High
    '#ea4335' // Red for Very High
  };
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.bg.hover};
    transform: translateX(4px);
  }
`;

const PlayerName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayerMeta = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
  grid-column: 1 / -1;
`;

const ScoreMiniBadge = styled.div<{ riskLevel: string }>`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${props =>
    props.riskLevel === 'S' ? '#00d2d3' :
    props.riskLevel === 'A' ? '#34a853' :
    props.riskLevel === 'B' ? '#fbbc04' :
    '#ff3f34'
  };
`;

// Right Panel Components
const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const DetailTitle = styled.h2`
  font-size: 2rem;
  margin: 0;
  background: ${props => props.theme.colors.gradient.primary};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const DetailSubtitle = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const StatBox = styled.div`
  background: ${props => props.theme.colors.bg.tertiary};
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255,255,255,0.1);
    border: 1px solid ${props => props.theme.colors.primary};
  }
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const PageButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    color: ${props => props.theme.colors.primary};
  }
`;

// Overlay Wrapper to ensure it's on top
const OverlayWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none; /* Let clicks pass through unless on the overlay itself */
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Inner Overlay that catches clicks
const InnerOverlay = styled.div`
  pointer-events: auto;
`;

interface AAAScoutingBoardProps {
  aaaData: Player[];
  kboData?: Player[];
  preKboData?: Player[];
}

function AAAScoutingBoard({ aaaData }: AAAScoutingBoardProps) {
  const [sortBy, setSortBy] = useState<'risk' | 'wrc_plus' | 'age'>('risk');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showOverlay, setShowOverlay] = useState(false);
  const PLAYERS_PER_PAGE = 20;

  const playersWithAnalysis = useMemo(() => {
    return aaaData
      .filter(p => p.pa && p.pa >= 200)
      .map(player => {
        const analysis = calculateRisk(player);
        return {
          ...player,
          analysis
        };
      });
  }, [aaaData]);

  const filteredPlayers = useMemo(() => {
    let filtered = playersWithAnalysis;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.team?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'risk') {
        const riskOrder = { 'S': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
        return riskOrder[b.analysis.riskLevel] - riskOrder[a.analysis.riskLevel];
      }
      if (sortBy === 'wrc_plus') return (b.wrc_plus || 0) - (a.wrc_plus || 0);
      if (sortBy === 'age') return (a.age || 30) - (b.age || 30);
      return 0;
    });

    return filtered;
  }, [playersWithAnalysis, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredPlayers.length / PLAYERS_PER_PAGE);
  const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
  const endIndex = startIndex + PLAYERS_PER_PAGE;
  const currentPlayers = filteredPlayers.slice(startIndex, endIndex);

  // Auto-select first player on load or filter change
  useEffect(() => {
    if (currentPlayers.length > 0 && !selectedPlayer) {
      setSelectedPlayer(currentPlayers[0]);
    }
  }, [currentPlayers, selectedPlayer]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  const handleStatClick = () => {
    setShowOverlay(true);
  };

  return (
    <Container>
      <LeftPanel>
        <FilterSection>
          <SearchInput
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SortContainer>
            <SortButton active={sortBy === 'risk'} onClick={() => setSortBy('risk')}>Tier</SortButton>
            <SortButton active={sortBy === 'wrc_plus'} onClick={() => setSortBy('wrc_plus')}>wRC+</SortButton>
            <SortButton active={sortBy === 'age'} onClick={() => setSortBy('age')}>Age</SortButton>
          </SortContainer>
        </FilterSection>

        <PlayerList>
          {currentPlayers.map((player) => (
            <CompactPlayerCard
              key={player.name}
              selected={selectedPlayer?.name === player.name}
              riskLevel={player.analysis.riskLevel}
              onClick={() => {
                setSelectedPlayer(player);
                setShowOverlay(false);
              }}
            >
              <PlayerName>{player.name}</PlayerName>
              <ScoreMiniBadge riskLevel={player.analysis.riskLevel}>{player.analysis.riskLevel}</ScoreMiniBadge>
              <PlayerMeta>
                {player.team} • {player.age}yo • {player.pa}PA
              </PlayerMeta>
            </CompactPlayerCard>
          ))}
        </PlayerList>

        <PaginationControls>
          <PageButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            ←
          </PageButton>
          <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
            {currentPage} / {totalPages}
          </span>
          <PageButton
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            →
          </PageButton>
        </PaginationControls>
      </LeftPanel>

      <RightPanel>
        {selectedPlayer ? (
          <>
            <DetailHeader>
              <div>
                <DetailTitle>{selectedPlayer.name}</DetailTitle>
                <DetailSubtitle>
                  {selectedPlayer.team} • {selectedPlayer.age} years old • {selectedPlayer.pa} PA
                </DetailSubtitle>
              </div>
              <div style={{ textAlign: 'right' }}>
                 <h3 style={{ margin: 0, color: '#4bcffa' }}>{selectedPlayer.analysis.riskLevel}-Tier</h3>
                 <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Risk Assessment</span>
              </div>
            </DetailHeader>

            <div style={{ marginBottom: '1.5rem', color: '#d2dae2', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {selectedPlayer.analysis.summary}
            </div>

            <h3 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
              📊 2025 AAA Stats <span style={{fontSize: '0.8rem', color: '#4bcffa', fontWeight: 'normal'}}>(Click for Deep Dive)</span>
            </h3>
            <StatsGrid onClick={handleStatClick}>
              <StatBox>
                <StatValue>{selectedPlayer.avg?.toFixed(3)}</StatValue>
                <StatLabel>AVG</StatLabel>
              </StatBox>
              <StatBox>
                <StatValue>{selectedPlayer.obp?.toFixed(3)}</StatValue>
                <StatLabel>OBP</StatLabel>
              </StatBox>
              <StatBox>
                <StatValue>{selectedPlayer.slg?.toFixed(3)}</StatValue>
                <StatLabel>SLG</StatLabel>
              </StatBox>
              <StatBox>
                <StatValue>{((selectedPlayer.obp || 0) + (selectedPlayer.slg || 0)).toFixed(3)}</StatValue>
                <StatLabel>OPS</StatLabel>
              </StatBox>
              <StatBox>
                <StatValue>{selectedPlayer.wrc_plus}</StatValue>
                <StatLabel>wRC+</StatLabel>
              </StatBox>
              <StatBox>
                <StatValue>{selectedPlayer.hr}</StatValue>
                <StatLabel>HR</StatLabel>
              </StatBox>
              <StatBox>
                <StatValue>{selectedPlayer.bb_pct?.toFixed(1)}%</StatValue>
                <StatLabel>BB%</StatLabel>
              </StatBox>
              <StatBox>
                <StatValue>{selectedPlayer.k_pct?.toFixed(1)}%</StatValue>
                <StatLabel>K%</StatLabel>
              </StatBox>
            </StatsGrid>

            {showOverlay && (
              <OverlayWrapper>
                <InnerOverlay>
                  <DeepDiveOverlay 
                    player={selectedPlayer} 
                    onClose={() => setShowOverlay(false)} 
                  />
                </InnerOverlay>
              </OverlayWrapper>
            )}
          </>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#666'
          }}>
            Select a player to view details
          </div>
        )}
      </RightPanel>
    </Container>
  );
}

export default AAAScoutingBoard;