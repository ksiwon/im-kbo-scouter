import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { Player } from '../types';
import { calculateRisk, calculateSimpleKFS, generateDeepDiveAnalysis } from '../utils/sabermetrics';

const Container = styled.div`
  display: flex;
  gap: 1rem;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  flex: 0 0 280px;
  background: ${props => props.theme.colors.bg.tertiary};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;
`;

const RightPanel = styled.div`
  flex: 1;
  background: ${props => props.theme.colors.bg.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 3px; }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem;
  background: ${props => props.theme.colors.bg.secondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.85rem;
  &::placeholder { color: ${props => props.theme.colors.text.disabled}; }
  &:focus { outline: none; border-color: ${props => props.theme.colors.primary}; }
`;

const SortContainer = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const SortButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 0.4rem;
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bg.secondary};
  color: ${props => props.theme.colors.text.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 600;
`;

const PlayerListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 3px; }
`;

const CompactPlayerCard = styled.div<{ $selected?: boolean }>`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.25rem;
  padding: 0.5rem;
  background: ${props => props.$selected ? props.theme.colors.primary + '20' : props.theme.colors.bg.secondary};
  border: 1px solid ${props => props.$selected ? props.theme.colors.primary : 'transparent'};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  &:hover { background: ${props => props.theme.colors.bg.hover}; }
`;

const PlayerName = styled.div`
  font-weight: 600;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text.primary};
`;

const PlayerMeta = styled.div`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.text.secondary};
  grid-column: 1 / -1;
`;

const KFSBadge = styled.div<{ $score: number }>`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  background: ${props => props.$score >= 70 ? 'rgba(0, 210, 211, 0.2)' : props.$score >= 50 ? 'rgba(52, 168, 83, 0.2)' : props.$score >= 30 ? 'rgba(251, 188, 4, 0.2)' : 'rgba(234, 67, 53, 0.2)'};
  color: ${props => props.$score >= 70 ? '#00d2d3' : props.$score >= 50 ? '#34a853' : props.$score >= 30 ? '#fbbc04' : '#ea4335'};
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const DetailTitle = styled.h2`
  font-size: 1.4rem;
  margin: 0;
  color: ${props => props.theme.colors.primary};
`;

const DetailSubtitle = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const AnalysisSummary = styled.div`
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  color: #d2dae2;
  line-height: 1.5;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  margin-bottom: 0.75rem;
`;

const StatBox = styled.div`
  text-align: center;
  padding: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: 0.6rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const PageButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  &:disabled { opacity: 0.3; }
`;

const PageInfo = styled.span`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.text.disabled};
`;

// KFS Score Breakdown Section
const KFSBreakdownSection = styled.div`
  background: rgba(100, 108, 255, 0.05);
  border: 1px solid rgba(100, 108, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
`;

const KFSBreakdownTitle = styled.h4`
  font-size: 0.8rem;
  color: #646cff;
  margin: 0 0 0.35rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const KFSFinalScore = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
`;

const KFSBreakdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.35rem;
`;

const KFSBreakdownItem = styled.div`
  text-align: center;
  padding: 0.3rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
`;

const KFSBreakdownValue = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
`;

const KFSBreakdownLabel = styled.div`
  font-size: 0.55rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.1rem;
`;

const KFSBreakdownWeight = styled.div`
  font-size: 0.5rem;
  color: #646cff;
  margin-top: 0.1rem;
`;

const DeepDiveSection = styled.div`
  background: rgba(75, 207, 250, 0.05);
  border: 1px solid rgba(75, 207, 250, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: auto;
`;

const DeepDiveTitle = styled.h4`
  font-size: 0.8rem;
  color: #4bcffa;
  margin: 0 0 0.35rem 0;
`;

const DeepDiveContent = styled.div`
  font-size: 0.75rem;
  line-height: 1.4;
  color: ${props => props.theme.colors.text.secondary};
`;

const Verdict = styled.div<{ $score: number }>`
  background: ${props => props.$score >= 70 ? 'rgba(0, 210, 211, 0.1)' : props.$score >= 50 ? 'rgba(52, 168, 83, 0.1)' : 'rgba(251, 188, 4, 0.1)'};
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.75rem;
  color: #e8eaed;
  margin-top: 0.35rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.text.disabled};
`;

interface AAAScoutingBoardProps {
  aaaData: Player[];
  kboData?: Player[];
  preKboData?: Player[];
}

// KFS Score 분해 계산 함수
const calculateKFSBreakdown = (player: Player) => {
  const normalize = (value: number, min: number, max: number): number => {
    const normalized = (value - min) / (max - min);
    return Math.max(0, Math.min(1, normalized));
  };

  const babip = player.babip || 0.300;
  const obp = player.obp || 0.330;
  const hr = player.hr || 10;
  const gdp = player.gdp || 8;
  const avg = player.avg || 0.260;

  const babipNorm = normalize(babip, 0.250, 0.380) * 100;
  const obpNorm = normalize(obp, 0.280, 0.420) * 100;
  const hrNorm = normalize(hr, 0, 35) * 100;
  const gdpNorm = normalize(gdp, 0, 20) * 100;
  const avgNorm = normalize(avg, 0.220, 0.320) * 100;

  const weights = { babip: 0.224, obp: 0.218, hr: 0.216, gdp: 0.198, avg: 0.174 };

  return {
    babip: { value: babip, normalized: babipNorm, weighted: babipNorm * weights.babip, weight: '22.4%' },
    obp: { value: obp, normalized: obpNorm, weighted: obpNorm * weights.obp, weight: '21.8%' },
    hr: { value: hr, normalized: hrNorm, weighted: hrNorm * weights.hr, weight: '21.6%' },
    gdp: { value: gdp, normalized: gdpNorm, weighted: gdpNorm * weights.gdp, weight: '19.8%' },
    avg: { value: avg, normalized: avgNorm, weighted: avgNorm * weights.avg, weight: '17.4%' },
  };
};

function AAAScoutingBoard({ aaaData }: AAAScoutingBoardProps) {
  const [sortBy, setSortBy] = useState<'kfs' | 'wrc_plus' | 'age'>('kfs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player & { analysis: ReturnType<typeof calculateRisk>; kfsScore: number } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PLAYERS_PER_PAGE = 8;

  const playersWithAnalysis = useMemo(() => {
    return aaaData
      .filter(p => p.pa && p.pa >= 200)
      .map(player => ({
        ...player,
        analysis: calculateRisk(player),
        kfsScore: calculateSimpleKFS(player)
      }));
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
      if (sortBy === 'kfs') return b.kfsScore - a.kfsScore;
      if (sortBy === 'wrc_plus') return (b.wrc_plus || 0) - (a.wrc_plus || 0);
      if (sortBy === 'age') return (a.age || 30) - (b.age || 30);
      return 0;
    });
    return filtered;
  }, [playersWithAnalysis, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredPlayers.length / PLAYERS_PER_PAGE);
  const currentPlayers = filteredPlayers.slice((currentPage - 1) * PLAYERS_PER_PAGE, currentPage * PLAYERS_PER_PAGE);

  useEffect(() => {
    if (currentPlayers.length > 0 && !selectedPlayer) {
      setSelectedPlayer(currentPlayers[0]);
    }
  }, [currentPlayers, selectedPlayer]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, sortBy]);

  const deepDive = selectedPlayer ? generateDeepDiveAnalysis(selectedPlayer) : null;
  const kfsBreakdown = selectedPlayer ? calculateKFSBreakdown(selectedPlayer) : null;

  return (
    <Container>
      <LeftPanel>
        <FilterSection>
          <SearchInput
            type="text"
            placeholder="선수 또는 팀 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SortContainer>
            <SortButton $active={sortBy === 'kfs'} onClick={() => setSortBy('kfs')}>KFS</SortButton>
            <SortButton $active={sortBy === 'wrc_plus'} onClick={() => setSortBy('wrc_plus')}>wRC+</SortButton>
            <SortButton $active={sortBy === 'age'} onClick={() => setSortBy('age')}>연령</SortButton>
          </SortContainer>
        </FilterSection>

        <PlayerListContainer>
          {currentPlayers.map((player) => (
            <CompactPlayerCard
              key={player.name}
              $selected={selectedPlayer?.name === player.name}
              onClick={() => setSelectedPlayer(player)}
            >
              <PlayerName>{player.name}</PlayerName>
              <KFSBadge $score={player.kfsScore}>{player.kfsScore.toFixed(1)}</KFSBadge>
              <PlayerMeta>{player.team} • {player.age}세 • {player.pa}PA</PlayerMeta>
            </CompactPlayerCard>
          ))}
        </PlayerListContainer>

        <PaginationControls>
          <PageButton disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>←</PageButton>
          <PageInfo>{currentPage} / {totalPages} ({filteredPlayers.length}명)</PageInfo>
          <PageButton disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>→</PageButton>
        </PaginationControls>
      </LeftPanel>

      <RightPanel>
        {selectedPlayer && kfsBreakdown ? (
          <>
            <DetailHeader>
              <div>
                <DetailTitle>{selectedPlayer.name}</DetailTitle>
                <DetailSubtitle>{selectedPlayer.team} • {selectedPlayer.age}세 • {selectedPlayer.pa} PA</DetailSubtitle>
              </div>
              <div style={{ textAlign: 'right' }}>
                <KFSBadge $score={selectedPlayer.kfsScore} style={{ fontSize: '1.1rem', padding: '0.3rem 0.6rem' }}>
                  KFS {selectedPlayer.kfsScore.toFixed(1)}
                </KFSBadge>
              </div>
            </DetailHeader>

            <AnalysisSummary>{selectedPlayer.analysis.summary}</AnalysisSummary>

            <h3 style={{ color: '#fff', marginBottom: '0.35rem', fontSize: '0.85rem' }}>📊 2025 AAA 핵심 스탯</h3>
            <StatsGrid>
              <StatBox><StatValue>{selectedPlayer.avg?.toFixed(3)}</StatValue><StatLabel>AVG</StatLabel></StatBox>
              <StatBox><StatValue>{selectedPlayer.obp?.toFixed(3)}</StatValue><StatLabel>OBP</StatLabel></StatBox>
              <StatBox><StatValue>{selectedPlayer.slg?.toFixed(3)}</StatValue><StatLabel>SLG</StatLabel></StatBox>
              <StatBox><StatValue>{((selectedPlayer.obp || 0) + (selectedPlayer.slg || 0)).toFixed(3)}</StatValue><StatLabel>OPS</StatLabel></StatBox>
              <StatBox><StatValue>{selectedPlayer.wrc_plus}</StatValue><StatLabel>wRC+</StatLabel></StatBox>
              <StatBox><StatValue>{selectedPlayer.hr}</StatValue><StatLabel>HR</StatLabel></StatBox>
              <StatBox><StatValue>{selectedPlayer.bb_pct?.toFixed(1)}%</StatValue><StatLabel>BB%</StatLabel></StatBox>
              <StatBox><StatValue>{selectedPlayer.k_pct?.toFixed(1)}%</StatValue><StatLabel>K%</StatLabel></StatBox>
            </StatsGrid>

            {/* KFS Score Breakdown */}
            <KFSBreakdownSection>
              <KFSBreakdownTitle>
                <span>🧮 KFS Score 산출</span>
                <KFSFinalScore>{selectedPlayer.kfsScore.toFixed(1)}</KFSFinalScore>
              </KFSBreakdownTitle>
              <KFSBreakdownGrid>
                <KFSBreakdownItem>
                  <KFSBreakdownLabel>BABIP</KFSBreakdownLabel>
                  <KFSBreakdownValue>{kfsBreakdown.babip.value.toFixed(3)}</KFSBreakdownValue>
                  <KFSBreakdownWeight>{kfsBreakdown.babip.weight}</KFSBreakdownWeight>
                </KFSBreakdownItem>
                <KFSBreakdownItem>
                  <KFSBreakdownLabel>OBP</KFSBreakdownLabel>
                  <KFSBreakdownValue>{kfsBreakdown.obp.value.toFixed(3)}</KFSBreakdownValue>
                  <KFSBreakdownWeight>{kfsBreakdown.obp.weight}</KFSBreakdownWeight>
                </KFSBreakdownItem>
                <KFSBreakdownItem>
                  <KFSBreakdownLabel>HR</KFSBreakdownLabel>
                  <KFSBreakdownValue>{kfsBreakdown.hr.value}</KFSBreakdownValue>
                  <KFSBreakdownWeight>{kfsBreakdown.hr.weight}</KFSBreakdownWeight>
                </KFSBreakdownItem>
                <KFSBreakdownItem>
                  <KFSBreakdownLabel>GDP</KFSBreakdownLabel>
                  <KFSBreakdownValue>{kfsBreakdown.gdp.value}</KFSBreakdownValue>
                  <KFSBreakdownWeight>{kfsBreakdown.gdp.weight}</KFSBreakdownWeight>
                </KFSBreakdownItem>
                <KFSBreakdownItem>
                  <KFSBreakdownLabel>AVG</KFSBreakdownLabel>
                  <KFSBreakdownValue>{kfsBreakdown.avg.value.toFixed(3)}</KFSBreakdownValue>
                  <KFSBreakdownWeight>{kfsBreakdown.avg.weight}</KFSBreakdownWeight>
                </KFSBreakdownItem>
              </KFSBreakdownGrid>
            </KFSBreakdownSection>

            {deepDive && (
              <DeepDiveSection>
                <DeepDiveTitle>{deepDive.title}</DeepDiveTitle>
                <DeepDiveContent>
                  {deepDive.paragraphs.map((p, idx) => (
                    <p key={idx} dangerouslySetInnerHTML={{ __html: p }} style={{ marginBottom: '0.5rem' }} />
                  ))}
                </DeepDiveContent>
                <Verdict $score={selectedPlayer.kfsScore} dangerouslySetInnerHTML={{ __html: deepDive.verdict }} />
              </DeepDiveSection>
            )}
          </>
        ) : (
          <EmptyState>
            <span style={{ fontSize: '1.5rem' }}>👈</span>
            <span>좌측에서 선수를 선택하세요</span>
          </EmptyState>
        )}
      </RightPanel>
    </Container>
  );
}

export default AAAScoutingBoard;