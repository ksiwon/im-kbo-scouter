import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { Player } from '../types';
import { calculateKFSScore } from '../utils/kfsScore';

const Container = styled.div`
  display: flex;
  gap: 1.5rem;
  max-height: 100vh;
  width: 100%;

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
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
`;

const RightPanel = styled.div`
  flex: 3;
  background: ${props => props.theme.colors.bg.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
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

const ScoreMiniBadge = styled.div<{ score: number }>`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${props =>
    props.score >= 50 ? props.theme.colors.success :
      props.score >= 35 ? props.theme.colors.warning :
        props.theme.colors.danger
  };
`;

// Right Panel Components
const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
  margin-top: 0.5rem;
`;

const ScoreBadge = styled.div<{ score: number }>`
  padding: 0.5rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props =>
    props.score >= 50 ? props.theme.colors.success :
      props.score >= 35 ? props.theme.colors.warning :
        props.theme.colors.danger
  };
  color: white;
  font-weight: 700;
  font-size: 2rem;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.lg};
  
  span {
    display: block;
    font-size: 0.8rem;
    font-weight: 400;
    opacity: 0.9;
  }
`;

const PredictionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(66, 133, 244, 0.05);
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid rgba(66, 133, 244, 0.1);
`;

const PredictionItem = styled.div`
  text-align: center;
`;

const PredictionValue = styled.div<{ color?: string }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.color || props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const PredictionLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatBox = styled.div`
  background: ${props => props.theme.colors.bg.tertiary};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const InsightsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const InsightBox = styled.div<{ type: 'strength' | 'concern' }>`
  padding: 1rem;
  background: ${props => props.type === 'strength'
    ? 'rgba(52, 168, 83, 0.05)'
    : 'rgba(234, 67, 53, 0.05)'
  };
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.type === 'strength'
    ? 'rgba(52, 168, 83, 0.1)'
    : 'rgba(234, 67, 53, 0.1)'
  };
`;

const InsightList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InsightItem = styled.li<{ type: 'strength' | 'concern' }>`
  font-size: 0.9rem;
  color: ${props => props.type === 'strength'
    ? props.theme.colors.success
    : props.theme.colors.warning
  };
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: ${props => props.type === 'strength' ? '"✓"' : '"⚠"'};
    font-weight: bold;
  }
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

interface AAAScoutingBoardProps {
  aaaData: Player[];
  kboData: Player[];
  preKboData: Player[];
}

function AAAScoutingBoard({ aaaData }: AAAScoutingBoardProps) {
  const [sortBy, setSortBy] = useState<'score' | 'wrc_plus' | 'age'>('score');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PLAYERS_PER_PAGE = 20;

  const playersWithScores = useMemo(() => {
    return aaaData
      .filter(p => p.pa && p.pa >= 200)
      .map(player => {
        const result = calculateKFSScore({
          wrcPlus: player.wrc_plus || 100,
          kPct: player.k_pct || 20,
          bbPct: player.bb_pct || 8,
          hr: player.hr || 10,
          pa: player.pa || 300,
          babip: player.babip || 0.300,
          obp: player.obp || 0.320,
          slg: player.slg || 0.400,
          gdp: player.gdp || 10,
        });

        let riskLevel: 'S' | 'A' | 'B' | 'C' | 'D' = 'D';
        if (result.score >= 65) riskLevel = 'S';
        else if (result.score >= 50) riskLevel = 'A';
        else if (result.score >= 35) riskLevel = 'B';
        else if (result.score >= 20) riskLevel = 'C';

        const strengths: string[] = [];
        const kPct = player.k_pct || 20;
        const bbPct = player.bb_pct || 8;
        const hr = player.hr || 10;
        const pa = player.pa || 300;
        const age = player.age || 28;
        const swstrPct = player.swstr_pct || 10;
        const ldPct = player.ld_pct || 20;
        const wrcPlus = player.wrc_plus || 100;
        const obp = player.obp || 0.320;
        const babip = player.babip || 0.300;

        if (kPct < 18) strengths.push(`엘리트 컨택 능력(K% ${kPct.toFixed(1)})`);
        else if (kPct < 22) strengths.push(`우수한 컨택 능력(K% ${kPct.toFixed(1)})`);
        if (bbPct > 12) strengths.push(`뛰어난 선구안(BB% ${bbPct.toFixed(1)})`);
        else if (bbPct > 9) strengths.push(`좋은 선구안(BB% ${bbPct.toFixed(1)})`);
        if ((hr / pa) > 0.06) strengths.push(`강력한 장타력(${hr}HR, ${((hr / pa) * 100).toFixed(1)}%)`);
        else if ((hr / pa) > 0.04) strengths.push(`준수한 파워(${hr}HR)`);
        if (swstrPct < 9) strengths.push(`탁월한 스윙 컨택(SwStr% ${swstrPct.toFixed(1)})`);
        if (ldPct > 22) strengths.push(`우수한 타구 품질(LD% ${ldPct.toFixed(1)})`);
        if (age < 25) strengths.push(`매우 젊음(${age}세)`);
        else if (age < 27) strengths.push(`젊은 나이(${age}세)`);
        if (wrcPlus > 140) strengths.push(`AAA 엘리트급(wRC+ ${wrcPlus})`);
        else if (wrcPlus > 120) strengths.push(`AAA 우수 성적(wRC+ ${wrcPlus})`);
        if (pa > 450) strengths.push(`충분한 샘플(${pa} PA)`);
        else if (pa > 350) strengths.push(`적정 샘플(${pa} PA)`);
        if (obp > 0.380) strengths.push(`높은 출루율(OBP ${obp.toFixed(3)})`);
        if (babip > 0.300 && babip < 0.370) strengths.push(`안정적인 BABIP(${babip.toFixed(3)})`);

        const concerns: string[] = [];
        const gbPct = player.gb_pct || 45;
        const iffbPct = player.iffb_pct || 10;

        if (kPct > 28) concerns.push(`매우 높은 삼진율(K% ${kPct.toFixed(1)})`);
        else if (kPct > 24) concerns.push(`높은 삼진율(K% ${kPct.toFixed(1)})`);
        if (bbPct < 5) concerns.push(`매우 낮은 출루 능력(BB% ${bbPct.toFixed(1)})`);
        else if (bbPct < 7) concerns.push(`낮은 출루 능력(BB% ${bbPct.toFixed(1)})`);
        if ((hr / pa) < 0.025) concerns.push(`제한적 장타력(${hr}HR, ${((hr / pa) * 100).toFixed(1)}%)`);
        if (swstrPct > 12) concerns.push(`높은 헛스윙율(SwStr% ${swstrPct.toFixed(1)})`);
        if (iffbPct > 12) concerns.push(`높은 내야플라이 비율(IFFB% ${iffbPct.toFixed(1)})`);
        if (gbPct > 50) concerns.push(`높은 땅볼 비율(GB% ${gbPct.toFixed(1)})`);
        if (age > 31) concerns.push(`높은 나이(${age}세)`);
        else if (age > 29) concerns.push(`나이 고려 필요(${age}세)`);
        if (pa < 250) concerns.push(`제한적 샘플(${pa} PA)`);
        if (wrcPlus < 95) concerns.push(`AAA 평균 이하(wRC+ ${wrcPlus})`);
        if (babip > 0.400) concerns.push(`과도하게 높은 BABIP(${babip.toFixed(3)}) - 운 요소 가능`);
        else if (babip < 0.270) concerns.push(`낮은 BABIP(${babip.toFixed(3)})`);
        if (obp < 0.310) concerns.push(`낮은 출루율(OBP ${obp.toFixed(3)})`);

        return {
          ...player,
          kScore: {
            score: result.score,
            predictedWrcPlus: result.predictedWrcPlus,
            successProbability: result.successProbability,
            riskLevel,
            strengths,
            concerns
          }
        };
      });
  }, [aaaData]);

  const filteredPlayers = useMemo(() => {
    let filtered = playersWithScores;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.team?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'score') return b.kScore.score - a.kScore.score;
      if (sortBy === 'wrc_plus') return (b.wrc_plus || 0) - (a.wrc_plus || 0);
      if (sortBy === 'age') return (a.age || 30) - (b.age || 30);
      return 0;
    });

    return filtered;
  }, [playersWithScores, searchTerm, sortBy]);

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
            <SortButton active={sortBy === 'score'} onClick={() => setSortBy('score')}>KFS</SortButton>
            <SortButton active={sortBy === 'wrc_plus'} onClick={() => setSortBy('wrc_plus')}>wRC+</SortButton>
            <SortButton active={sortBy === 'age'} onClick={() => setSortBy('age')}>Age</SortButton>
          </SortContainer>
        </FilterSection>

        <PlayerList>
          {currentPlayers.map((player) => (
            <CompactPlayerCard
              key={player.name}
              selected={selectedPlayer?.name === player.name}
              riskLevel={player.kScore.riskLevel}
              onClick={() => setSelectedPlayer(player)}
            >
              <PlayerName>{player.name}</PlayerName>
              <ScoreMiniBadge score={player.kScore.score}>{player.kScore.score}</ScoreMiniBadge>
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
              <ScoreBadge score={selectedPlayer.kScore.score}>
                {selectedPlayer.kScore.score}
                <span>KFS Score</span>
              </ScoreBadge>
            </DetailHeader>

            <SectionTitle>📊 KBO Adaptation Prediction</SectionTitle>
            <PredictionGrid>
              <PredictionItem>
                <PredictionValue color="#4285f4">{selectedPlayer.kScore.predictedWrcPlus}</PredictionValue>
                <PredictionLabel>Predicted wRC+</PredictionLabel>
              </PredictionItem>
              <PredictionItem>
                <PredictionValue color="#34a853">{selectedPlayer.kScore.score}</PredictionValue>
                <PredictionLabel>KFS Score</PredictionLabel>
              </PredictionItem>
              <PredictionItem>
                <PredictionValue
                  color={
                    selectedPlayer.kScore.riskLevel === 'S' ? '#00d2d3' :
                    selectedPlayer.kScore.riskLevel === 'A' ? '#34a853' :
                    selectedPlayer.kScore.riskLevel === 'B' ? '#fbbc04' :
                    selectedPlayer.kScore.riskLevel === 'C' ? '#ff9f43' :
                    '#ea4335'
                  }
                >
                  {selectedPlayer.kScore.riskLevel} (
                  {selectedPlayer.kScore.riskLevel === 'S' ? 'Elite' :
                   selectedPlayer.kScore.riskLevel === 'A' ? 'Low Risk' :
                   selectedPlayer.kScore.riskLevel === 'B' ? 'Moderate' :
                   selectedPlayer.kScore.riskLevel === 'C' ? 'High Risk' : 'Critical'}
                  )
                </PredictionValue>
                <PredictionLabel>Risk Level</PredictionLabel>
              </PredictionItem>
            </PredictionGrid>

            <SectionTitle>📈 2025 AAA Stats</SectionTitle>
            <StatsGrid>
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

            <InsightsContainer>
              <div>
                <SectionTitle>✅ Strengths</SectionTitle>
                <InsightBox type="strength">
                  {selectedPlayer.kScore.strengths.length > 0 ? (
                    <InsightList>
                      {selectedPlayer.kScore.strengths.map((s: string, i: number) => (
                        <InsightItem key={i} type="strength">{s}</InsightItem>
                      ))}
                    </InsightList>
                  ) : (
                    <div style={{ color: '#aaa', fontSize: '0.9rem' }}>No specific strengths detected</div>
                  )}
                </InsightBox>
              </div>
              <div>
                <SectionTitle>⚠️ Concerns</SectionTitle>
                <InsightBox type="concern">
                  {selectedPlayer.kScore.concerns.length > 0 ? (
                    <InsightList>
                      {selectedPlayer.kScore.concerns.map((s: string, i: number) => (
                        <InsightItem key={i} type="concern">{s}</InsightItem>
                      ))}
                    </InsightList>
                  ) : (
                    <div style={{ color: '#aaa', fontSize: '0.9rem' }}>No major concerns detected</div>
                  )}
                </InsightBox>
              </div>
            </InsightsContainer>
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