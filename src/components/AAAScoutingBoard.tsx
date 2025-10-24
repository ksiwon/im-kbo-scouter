// src/components/AAAScoutingBoard.tsx
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Player, KSuccessScore } from '../types';

const ScoutingContainer = styled.div`
  background: ${props => props.theme.colors.bg.tertiary};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
`;

const Title = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active 
    ? props.theme.colors.gradient.primary 
    : props.theme.colors.bg.secondary};
  color: ${props => props.theme.colors.text.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.bg.secondary};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.disabled};
  }
`;

const PlayerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const PlayerCard = styled.div<{ riskLevel: string }>`
  background: ${props => props.theme.colors.bg.secondary};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  border-left: 4px solid ${props => 
    props.riskLevel === 'Low' ? '#34a853' :
    props.riskLevel === 'Moderate' ? '#fbbc04' :
    '#ea4335'
  };
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.xl};
  }
`;

const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const PlayerName = styled.h4`
  font-size: 1.3rem;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const PlayerInfo = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const ScoreBadge = styled.div<{ score: number }>`
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => 
    props.score >= 67 ? 'linear-gradient(135deg, #34a853 0%, #0f9d58 100%)' :
    props.score >= 33 ? 'linear-gradient(135deg, #fbbc04 0%, #f57c00 100%)' :
    'linear-gradient(135deg, #ea4335 0%, #d32f2f 100%)'
  };
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.md};
`;

const ScoreLabel = styled.div`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  opacity: 0.9;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin: 1rem 0;
`;

const StatBox = styled.div`
  text-align: center;
  padding: 0.5rem;
  background: ${props => props.theme.colors.bg.tertiary};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 0.25rem;
`;

const InsightSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.bg.card};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const InsightTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const InsightList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InsightItem = styled.li<{ type: 'strength' | 'concern' }>`
  font-size: 0.8rem;
  color: ${props => props.type === 'strength' 
    ? props.theme.colors.success 
    : props.theme.colors.warning};
  margin: 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: ${props => props.type === 'strength' ? '"✓"' : '"⚠"'};
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.disabled 
    ? props.theme.colors.bg.tertiary 
    : props.theme.colors.gradient.primary};
  color: ${props => props.disabled 
    ? props.theme.colors.text.disabled 
    : props.theme.colors.text.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 0.9rem;
  font-weight: 600;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const PageInfo = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.9rem;
  font-weight: 600;
`;

const PageNumbers = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageNumber = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.active 
    ? props.theme.colors.gradient.primary 
    : props.theme.colors.bg.secondary};
  color: ${props => props.theme.colors.text.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: ${props => props.active ? '700' : '500'};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.bg.secondary};
  padding: 2.5rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows.xl};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

interface AAAScoutingBoardProps {
  aaaData: Player[];
  kboData: Player[];
  preKboData: Player[];
}

function AAAScoutingBoard({ aaaData, kboData, preKboData }: AAAScoutingBoardProps) {
  const [sortBy, setSortBy] = useState<'score' | 'wrc_plus' | 'age'>('score');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PLAYERS_PER_PAGE = 12;

  // 개선된 K-Success Score 계산 (더 많은 지표 활용)
  const calculateKSuccessScore = (player: Player): KSuccessScore => {
    const wrcPlus = player.wrc_plus || 100;
    const kPct = player.k_pct || 20;
    const bbPct = player.bb_pct || 8;
    const hr = player.hr || 10;
    const pa = player.pa || 300;
    const age = player.age || 28;
    const babip = player.babip || 0.300;
    const obp = player.obp || 0.320;
    const slg = player.slg || 0.400;
    
    // 타구 분포 지표
    const ldPct = player.ld_pct || 20;  // 라인드라이브 비율
    const gbPct = player.gb_pct || 45;  // 땅볼 비율
    const iffbPct = player.iffb_pct || 10; // 내야 플라이 비율
    
    // 스윙 지표
    const swstrPct = player.swstr_pct || 10; // 헛스윙 비율
    
    // DIKW 분석 기반 가중치
    // K% 안정성: r ≈ 0.50 (중간 상관관계) - 높은 가중치
    // BB% 안정성: r ≈ 0.29 (약한 상관관계) - 중간 가중치
    // wRC+ 전이: r ≈ -0.12 (제한적) - 낮은 가중치
    
    // 1. 기본 플레이트 디시플린 점수 (0-35점)
    const kScore = Math.max(0, (25 - kPct) * 1.2); // 삼진율이 낮을수록 높은 점수
    const bbScore = Math.max(0, (bbPct - 5) * 1.0); // 볼넷율이 높을수록 높은 점수
    const swstrScore = Math.max(0, (15 - swstrPct) * 0.8); // 헛스윙이 적을수록 높은 점수
    const disciplineScore = Math.min(35, kScore + bbScore + swstrScore);
    
    // 2. 파워 및 타구 품질 점수 (0-30점)
    const powerScore = Math.min(15, (hr / pa) * 1000 * 0.75); // HR/PA 비율
    const ldScore = Math.max(0, (ldPct - 18) * 0.4); // 라인드라이브는 좋은 타구
    const iffbPenalty = Math.max(0, (iffbPct - 8) * 0.5); // 내야플라이는 안좋은 타구
    const batQualityScore = Math.min(30, powerScore + ldScore - iffbPenalty);
    
    // 3. 출루 및 장타 능력 점수 (0-20점)
    const obpScore = Math.max(0, (obp - 0.300) * 50); // OBP가 높을수록
    const slgScore = Math.max(0, (slg - 0.350) * 30); // SLG가 높을수록
    const onBaseScore = Math.min(20, obpScore + slgScore);
    
    // 4. BABIP 안정성 점수 (0-10점)
    // BABIP이 너무 높으면 운이 좋았을 가능성 (감점)
    // BABIP이 적정 수준이면 진짜 실력 (가점)
    const babipScore = babip > 0.380 ? Math.max(0, 10 - (babip - 0.380) * 30) :
                       babip < 0.280 ? Math.max(0, (babip - 0.250) * 30) :
                       10; // 0.280-0.380 구간은 만점
    
    // 5. 나이 및 경험 점수 (0-10점)
    const ageScore = Math.max(0, Math.min(10, (32 - age) * 0.7)); // 젊을수록 가점
    const paScore = Math.min(5, (pa - 200) / 80); // 충분한 샘플 사이즈
    const experienceScore = ageScore + paScore;
    
    // 6. wRC+ 기반 점수 (0-15점) - 낮은 가중치 (환경 의존적)
    const wrcScore = Math.max(0, Math.min(15, (wrcPlus - 80) * 0.25));
    
    // 총점 계산 (0-100)
    const totalScore = Math.max(0, Math.min(100,
      disciplineScore + batQualityScore + onBaseScore + 
      babipScore + experienceScore + wrcScore
    ));
    
    // 예상 KBO wRC+ (더 보수적인 회귀)
    // 플레이트 디시플린 지표들을 더 반영
    const disciplineFactor = (100 - kPct * 2 + bbPct * 1.5) / 100;
    const predictedWrcPlus = Math.round(
      wrcPlus * 0.75 + 100 * 0.25 + disciplineFactor * 5
    );
    
    // 성공 확률 (wRC+ > 110 기준)
    const successProbability = Math.min(95, Math.max(5, 
      totalScore * 0.9 + (kPct < 20 ? 5 : 0) + (bbPct > 10 ? 5 : 0)
    ));
    
    // 리스크 레벨
    const riskLevel: 'Low' | 'Moderate' | 'High' = 
      totalScore >= 67 ? 'Low' :
      totalScore >= 33 ? 'Moderate' :
      'High';
    
    // 강점 분석 (더 상세하게)
    const strengths: string[] = [];
    if (kPct < 18) strengths.push(`엘리트 컨택 능력 (K% ${kPct.toFixed(1)})`);
    else if (kPct < 22) strengths.push(`우수한 컨택 능력 (K% ${kPct.toFixed(1)})`);
    
    if (bbPct > 12) strengths.push(`뛰어난 선구안 (BB% ${bbPct.toFixed(1)})`);
    else if (bbPct > 9) strengths.push(`좋은 선구안 (BB% ${bbPct.toFixed(1)})`);
    
    if ((hr / pa) > 0.06) strengths.push(`강력한 장타력 (${hr}HR, ${((hr/pa)*100).toFixed(1)}%)`);
    else if ((hr / pa) > 0.04) strengths.push(`준수한 파워 (${hr}HR)`);
    
    if (swstrPct < 9) strengths.push(`탁월한 스윙 컨택 (SwStr% ${swstrPct.toFixed(1)})`);
    
    if (ldPct > 22) strengths.push(`우수한 타구 품질 (LD% ${ldPct.toFixed(1)})`);
    
    if (age < 25) strengths.push(`매우 젊음 (${age}세)`);
    else if (age < 27) strengths.push(`젊은 나이 (${age}세)`);
    
    if (wrcPlus > 140) strengths.push(`AAA 엘리트급 (wRC+ ${wrcPlus})`);
    else if (wrcPlus > 120) strengths.push(`AAA 우수 성적 (wRC+ ${wrcPlus})`);
    
    if (pa > 450) strengths.push(`충분한 샘플 (${pa} PA)`);
    else if (pa > 350) strengths.push(`적정 샘플 (${pa} PA)`);
    
    if (obp > 0.380) strengths.push(`높은 출루율 (OBP ${obp.toFixed(3)})`);
    
    if (babip > 0.300 && babip < 0.370) strengths.push(`안정적인 BABIP (${babip.toFixed(3)})`);
    
    // 우려사항 (더 상세하게)
    const concerns: string[] = [];
    if (kPct > 28) concerns.push(`매우 높은 삼진율 (K% ${kPct.toFixed(1)})`);
    else if (kPct > 24) concerns.push(`높은 삼진율 (K% ${kPct.toFixed(1)})`);
    
    if (bbPct < 5) concerns.push(`매우 낮은 출루 능력 (BB% ${bbPct.toFixed(1)})`);
    else if (bbPct < 7) concerns.push(`낮은 출루 능력 (BB% ${bbPct.toFixed(1)})`);
    
    if ((hr / pa) < 0.025) concerns.push(`제한적 장타력 (${hr}HR, ${((hr/pa)*100).toFixed(1)}%)`);
    
    if (swstrPct > 12) concerns.push(`높은 헛스윙율 (SwStr% ${swstrPct.toFixed(1)})`);
    
    if (iffbPct > 12) concerns.push(`높은 내야플라이 비율 (IFFB% ${iffbPct.toFixed(1)})`);
    
    if (gbPct > 50) concerns.push(`높은 땅볼 비율 (GB% ${gbPct.toFixed(1)})`);
    
    if (age > 31) concerns.push(`높은 나이 (${age}세)`);
    else if (age > 29) concerns.push(`나이 고려 필요 (${age}세)`);
    
    if (pa < 250) concerns.push(`제한적 샘플 (${pa} PA)`);
    
    if (wrcPlus < 95) concerns.push(`AAA 평균 이하 (wRC+ ${wrcPlus})`);
    
    if (babip > 0.400) concerns.push(`과도하게 높은 BABIP (${babip.toFixed(3)}) - 운 요소 가능`);
    else if (babip < 0.270) concerns.push(`낮은 BABIP (${babip.toFixed(3)})`);
    
    if (obp < 0.310) concerns.push(`낮은 출루율 (OBP ${obp.toFixed(3)})`);
    
    return {
      score: Math.round(totalScore),
      predictedWrcPlus,
      successProbability: Math.round(successProbability),
      riskLevel,
      strengths,
      concerns
    };
  };

  // 선수 데이터에 K-Success Score 추가
  const playersWithScores = useMemo(() => {
    return aaaData
      .filter(p => p.pa && p.pa >= 200) // 최소 200 PA
      .map(player => ({
        ...player,
        kScore: calculateKSuccessScore(player)
      }));
  }, [aaaData]);

  // 필터링 및 정렬
  const filteredPlayers = useMemo(() => {
    let filtered = playersWithScores;
    
    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.team?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 정렬
    filtered.sort((a, b) => {
      if (sortBy === 'score') return b.kScore.score - a.kScore.score;
      if (sortBy === 'wrc_plus') return (b.wrc_plus || 0) - (a.wrc_plus || 0);
      if (sortBy === 'age') return (a.age || 30) - (b.age || 30);
      return 0;
    });
    
    return filtered;
  }, [playersWithScores, searchTerm, sortBy]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredPlayers.length / PLAYERS_PER_PAGE);
  const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
  const endIndex = startIndex + PLAYERS_PER_PAGE;
  const currentPlayers = filteredPlayers.slice(startIndex, endIndex);

  // 페이지 변경 시 최상단으로 스크롤
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 검색 또는 정렬 변경 시 첫 페이지로
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  // 페이지 번호 배열 생성 (최대 7개 표시)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <>
      <ScoutingContainer>
        <Title>🎯 2025 AAA 스카우팅 보드</Title>
        
        <FilterSection>
          <SearchInput
            type="text"
            placeholder="선수명 또는 팀으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <FilterButton 
            active={sortBy === 'score'} 
            onClick={() => setSortBy('score')}
          >
            K-Success Score
          </FilterButton>
          <FilterButton 
            active={sortBy === 'wrc_plus'} 
            onClick={() => setSortBy('wrc_plus')}
          >
            wRC+
          </FilterButton>
          <FilterButton 
            active={sortBy === 'age'} 
            onClick={() => setSortBy('age')}
          >
            나이
          </FilterButton>
        </FilterSection>

        <div style={{ 
          color: '#9aa0a6', 
          fontSize: '0.9rem',
          marginBottom: '1rem'
        }}>
          총 {filteredPlayers.length}명 | {startIndex + 1}-{Math.min(endIndex, filteredPlayers.length)} 표시
        </div>

        <PlayerGrid>
          {currentPlayers.map((player) => (
            <PlayerCard
              key={player.name}
              riskLevel={player.kScore.riskLevel}
              onClick={() => setSelectedPlayer(player)}
            >
              <PlayerHeader>
                <div>
                  <PlayerName>{player.name}</PlayerName>
                  <PlayerInfo>
                    {player.team} • {player.age}세 • {player.pa} PA
                  </PlayerInfo>
                </div>
                <ScoreBadge score={player.kScore.score}>
                  {player.kScore.score}
                  <ScoreLabel>K-Score</ScoreLabel>
                </ScoreBadge>
              </PlayerHeader>

              <StatsRow>
                <StatBox>
                  <StatValue>{player.wrc_plus || 0}</StatValue>
                  <StatLabel>wRC+</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{player.hr || 0}</StatValue>
                  <StatLabel>HR</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{player.k_pct?.toFixed(1) || '-'}%</StatValue>
                  <StatLabel>K%</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{player.bb_pct?.toFixed(1) || '-'}%</StatValue>
                  <StatLabel>BB%</StatLabel>
                </StatBox>
              </StatsRow>

              <InsightSection>
                <InsightTitle>
                  예상 KBO wRC+: {player.kScore.predictedWrcPlus} | 
                  성공률: {player.kScore.successProbability}%
                </InsightTitle>
                {player.kScore.strengths.length > 0 && (
                  <InsightList>
                    {player.kScore.strengths.slice(0, 2).map((s: string, i: number) => (
                      <InsightItem key={i} type="strength">{s}</InsightItem>
                    ))}
                  </InsightList>
                )}
              </InsightSection>
            </PlayerCard>
          ))}
        </PlayerGrid>

        {/* 페이지네이션 */}
        <PaginationContainer>
          <PaginationButton
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ← 이전
          </PaginationButton>
          
          <PageNumbers>
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <PageNumber
                  key={index}
                  active={currentPage === page}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PageNumber>
              ) : (
                <PageInfo key={index}>{page}</PageInfo>
              )
            ))}
          </PageNumbers>
          
          <PaginationButton
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            다음 →
          </PaginationButton>
        </PaginationContainer>

        <PageInfo style={{ textAlign: 'center', marginTop: '1rem' }}>
          {currentPage} / {totalPages} 페이지
        </PageInfo>
      </ScoutingContainer>

      {/* 상세 모달 */}
      {selectedPlayer && (
        <ModalOverlay onClick={() => setSelectedPlayer(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div style={{ position: 'relative' }}>
              <CloseButton onClick={() => setSelectedPlayer(null)}>×</CloseButton>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem',
                marginRight: '2rem'
              }}>
                <div>
                  <h2 style={{ 
                    fontSize: '2rem',
                    marginBottom: '0.5rem',
                    color: '#e8eaed'
                  }}>
                    {selectedPlayer.name}
                  </h2>
                  <div style={{ 
                    fontSize: '1rem',
                    color: '#9aa0a6'
                  }}>
                    {selectedPlayer.team} • {selectedPlayer.age}세 • {selectedPlayer.pa} PA
                  </div>
                </div>
                <ScoreBadge score={selectedPlayer.kScore.score}>
                  {selectedPlayer.kScore.score}
                  <ScoreLabel>K-Success Score</ScoreLabel>
                </ScoreBadge>
              </div>

              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(234, 67, 53, 0.1))',
                borderRadius: '12px',
                marginBottom: '2rem'
              }}>
                <h3 style={{ 
                  fontSize: '1.2rem',
                  marginBottom: '1rem',
                  color: '#e8eaed'
                }}>
                  📊 KBO 적응 예측
                </h3>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: '#4285f4'
                    }}>
                      {selectedPlayer.kScore.predictedWrcPlus}
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem',
                      color: '#9aa0a6',
                      marginTop: '0.25rem'
                    }}>
                      예상 KBO wRC+
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: '#34a853'
                    }}>
                      {selectedPlayer.kScore.successProbability}%
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem',
                      color: '#9aa0a6',
                      marginTop: '0.25rem'
                    }}>
                      성공 확률
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: selectedPlayer.kScore.riskLevel === 'Low' ? '#34a853' :
                             selectedPlayer.kScore.riskLevel === 'Moderate' ? '#fbbc04' :
                             '#ea4335'
                    }}>
                      {selectedPlayer.kScore.riskLevel}
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem',
                      color: '#9aa0a6',
                      marginTop: '0.25rem'
                    }}>
                      리스크 레벨
                    </div>
                  </div>
                </div>
              </div>

              <h3 style={{ 
                fontSize: '1.2rem',
                marginBottom: '1rem',
                color: '#e8eaed'
              }}>
                📈 2025 AAA 상세 성적
              </h3>
              <DetailGrid>
                <StatBox>
                  <StatValue>{selectedPlayer.avg?.toFixed(3) || '-'}</StatValue>
                  <StatLabel>AVG</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{selectedPlayer.obp?.toFixed(3) || '-'}</StatValue>
                  <StatLabel>OBP</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{selectedPlayer.slg?.toFixed(3) || '-'}</StatValue>
                  <StatLabel>SLG</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{((selectedPlayer.obp || 0) + (selectedPlayer.slg || 0)).toFixed(3)}</StatValue>
                  <StatLabel>OPS</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{selectedPlayer.wrc_plus || '-'}</StatValue>
                  <StatLabel>wRC+</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{selectedPlayer.hr || 0}</StatValue>
                  <StatLabel>홈런</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{selectedPlayer.rbi || 0}</StatValue>
                  <StatLabel>타점</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{selectedPlayer.r || 0}</StatValue>
                  <StatLabel>득점</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{selectedPlayer.sb || 0}</StatValue>
                  <StatLabel>도루</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{selectedPlayer.bb_pct?.toFixed(1) || '-'}%</StatValue>
                  <StatLabel>BB%</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{selectedPlayer.k_pct?.toFixed(1) || '-'}%</StatValue>
                  <StatLabel>K%</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{selectedPlayer.babip?.toFixed(3) || '-'}</StatValue>
                  <StatLabel>BABIP</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{selectedPlayer.ld_pct?.toFixed(1) || '-'}%</StatValue>
                  <StatLabel>LD%</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{selectedPlayer.gb_pct?.toFixed(1) || '-'}%</StatValue>
                  <StatLabel>GB%</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{selectedPlayer.fb_pct?.toFixed(1) || '-'}%</StatValue>
                  <StatLabel>FB%</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{selectedPlayer.swstr_pct?.toFixed(1) || '-'}%</StatValue>
                  <StatLabel>SwStr%</StatLabel>
                </StatBox>
              </DetailGrid>

              {selectedPlayer.kScore.strengths.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ 
                    fontSize: '1.2rem',
                    marginBottom: '1rem',
                    color: '#34a853'
                  }}>
                    ✓ 강점
                  </h3>
                  <InsightList>
                    {selectedPlayer.kScore.strengths.map((s: string, i: number) => (
                      <InsightItem key={i} type="strength">{s}</InsightItem>
                    ))}
                  </InsightList>
                </div>
              )}

              {selectedPlayer.kScore.concerns.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ 
                    fontSize: '1.2rem',
                    marginBottom: '1rem',
                    color: '#fbbc04'
                  }}>
                    ⚠ 우려사항
                  </h3>
                  <InsightList>
                    {selectedPlayer.kScore.concerns.map((c: string, i: number) => (
                      <InsightItem key={i} type="concern">{c}</InsightItem>
                    ))}
                  </InsightList>
                </div>
              )}
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}

export default AAAScoutingBoard;