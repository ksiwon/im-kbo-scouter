// src/App.tsx
import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from './styles/GlobalStyle';

// Components
import Hero from './components/Hero';
import StatsOverview from './components/StatsOverview';
import DistributionChart from './components/DistributionChart';
import CorrelationChart from './components/CorrelationChart';
import ComparisonChart from './components/ComparisonChart';
import DeltaDistribution from './components/DeltaDistribution';
import PlayerList from './components/PlayerList';
import AAAScoutingBoard from './components/AAAScoutingBoard';
import DraggableModal from './components/DraggableModal';

// Pages
import Dashboard from './pages/Dashboard';
import PredictionModel from './pages/PredictionModel';
import CorrelationAnalysis from './pages/CorrelationAnalysis';

// Data
import kboFirstYearData from './data/kbo_first_year_stats_matched.json';
import preKboData from './data/pre_kbo_stats_matched.json';
import aaaData from './data/aaa_2025_stats.json';
import { ANALYSIS_DATA } from './data/analysisData';

// --- Styled Components ---

const AppContainer = styled.div`
  background: ${props => props.theme.colors.bg.primary};
  color: ${props => props.theme.colors.text.primary};
  overflow-y: hidden;
  overflow-x: auto;
  width: 100vw;
  height: 100vh;
  display: flex;
  scroll-snap-type: x mandatory;
  position: relative;
  
  /* 스크롤바 숨기기 (선택적) */
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

const Section = styled.section<{ dark?: boolean }>`
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  flex-shrink: 0;
  scroll-snap-align: start;
  overflow-y: auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: ${props => props.dark 
    ? props.theme.colors.bg.secondary 
    : props.theme.colors.bg.primary};
  position: relative;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  text-align: center;
  -webkit-background-clip: text;
  background-clip: text;
  animation: fadeIn 0.8s ease;
  flex-shrink: 0;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionText = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  max-width: 800px;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContentBox = styled.div`
  max-width: 80%;
  width: 100%;
  margin: 1rem auto;
`;

const NavigationBar = styled.nav`
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(30, 39, 73, 0.9);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.5rem;
  display: flex;
  gap: 1.5rem;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    gap: 0.5rem;
    width: 90%;
    justify-content: space-between;
  }
`;

const NavLink = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text.secondary};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

// --- Scroll Indicator Arrows ---

const bounceLeft = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-10px); }
`;

const bounceRight = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
`;

const ArrowButton = styled.div<{ direction: 'left' | 'right' }>`
  position: fixed;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: 20px;' : 'right: 20px;'}
  transform: translateY(-50%);
  background: transparent;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  animation: ${props => props.direction === 'left' ? bounceLeft : bounceRight} 2s infinite;

  @media (max-width: 768px) {
    display: none; /* 모바일에서는 화살표 숨김 (터치 스크롤이 직관적임) */
  }
`;

function App() {
  const appContainerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');
  
  // 스크롤 화살표 상태
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const currentSection = document.getElementById(activeSection);
    if (currentSection) {
      currentSection.scrollTop = 0;
    }
  }, [activeSection]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // [수정] id가 있는 경우에만 activeSection을 업데이트하여 
          // 내부 컴포넌트(예: chart의 section)가 잡히는 것을 방지
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: appContainerRef.current,
        threshold: 0.5
      }
    );

    // appContainerRef 안의 직계 자식 section들만 관찰하도록 수정하는 것이 좋으나,
    // querySelectorAll('section')을 쓰되 위에서 id 체크를 추가함.
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // 스크롤 이벤트 핸들러 (화살표 표시 여부 결정)
  const handleScroll = () => {
    if (appContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = appContainerRef.current;
      
      // 맨 왼쪽인지 확인 (여유값 10px)
      setShowLeftArrow(scrollLeft > 10);
      
      // 맨 오른쪽인지 확인 (여유값 10px)
      // scrollWidth - clientWidth 가 최대 스크롤 가능 값
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // 초기 로드 및 리사이즈 시 스크롤 상태 체크
  useEffect(() => {
    const checkScroll = () => handleScroll();
    
    window.addEventListener('resize', checkScroll);
    // 초기 실행
    checkScroll();
    
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }
  };

  const scrollByDirection = (direction: 'left' | 'right') => {
    if (appContainerRef.current) {
      const { clientWidth } = appContainerRef.current;
      appContainerRef.current.scrollBy({
        left: direction === 'left' ? -clientWidth : clientWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      
      {/* 분석 모달 */}
      {activeSection !== 'hero' && (
        <DraggableModal data={ANALYSIS_DATA[activeSection]} />
      )}

      {/* 스크롤 화살표 */}
      {showLeftArrow && (
        <ArrowButton direction="left" onClick={() => scrollByDirection('left')}>
          ‹
        </ArrowButton>
      )}
      {showRightArrow && (
        <ArrowButton direction="right" onClick={() => scrollByDirection('right')}>
          ›
        </ArrowButton>
      )}

      <AppContainer ref={appContainerRef} onScroll={handleScroll}>        
        <Hero />

        <Section id="overview">
          <SectionTitle>📊 데이터 개요</SectionTitle>
          <SectionText>
            2010년부터 2024년까지 KBO에 입단한 65명의 외국인 타자들의 데이터를 분석했습니다.
            <br />
            각 선수의 KBO 입단 전 성적과 KBO 첫 해 성적을 비교하여 성공 패턴을 찾아냅니다.
          </SectionText>
          <ContentBox>
            <Dashboard 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
          <ContentBox>
            <StatsOverview 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
        </Section>

        <Section dark id="players">
          <SectionTitle>🏆 Top Players 분석</SectionTitle>
          <SectionText>
            KBO 첫 해에 가장 뛰어난 성적을 기록한 선수들을 살펴봅니다.
            <br />
            클릭하면 상세 정보를 볼 수 있습니다.
          </SectionText>
          <ContentBox>
            <PlayerList 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
        </Section>
     
        <Section dark id="correlation">
          <SectionTitle>🔗 상관 관계 분석</SectionTitle>
          <SectionText>
            KBO 입단 전 지표 중 어떤 것이 KBO에서의 성공을 예측할 수 있을까요?
            <br />
            K%와 BB% 같은 규율 지표는 안정적이지만, wRC+는 환경 의존적입니다.
          </SectionText>
          <ContentBox>
            <CorrelationAnalysis 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
          <ContentBox>
            <CorrelationChart 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
        </Section>

        <Section id="analysis">
          <SectionTitle>📈 성적 분포 변화</SectionTitle>
          <SectionText>
            KBO 입단 전후로 선수들의 주요 지표가 어떻게 변화하는지 살펴봅니다.
            <br />
            평균적으로 타석은 증가하지만, wRC+는 리그 환경 차이로 인해 변동이 큽니다.
          </SectionText>
          <ContentBox>
            <ComparisonChart 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
          <ContentBox>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <DistributionChart 
                kboData={kboFirstYearData.players}
                preKboData={preKboData.players}
              />
              <DeltaDistribution 
                kboData={kboFirstYearData.players}
                preKboData={preKboData.players}
              />
            </div>
          </ContentBox>
        </Section>

        <Section dark id="aaa-scouting">
          <SectionTitle>🎯 2025 AAA 스카우팅 보드</SectionTitle>
          <SectionText>
            158명의 2025 AAA 선수들을 K-Success Score로 평가합니다.
            <br />
            DIKW 분석 기반: K% 안정성(r≈0.50), BB% 안정성(r≈0.29), wRC+ 제한적 전이(r≈-0.12)
          </SectionText>
          <ContentBox>
            <AAAScoutingBoard 
              aaaData={aaaData.players}
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
        </Section>

        <Section id="prediction">
          <SectionTitle>🔮 K-Success Score 예측 모델</SectionTitle>
          <SectionText>
            선수의 Pre-KBO 통계를 입력하거나 AAA 선수를 선택하여 KBO 성적을 예측합니다.
            <br />
            플레이트 디시플린 지표가 환경 의존적 지표보다 더 나은 안정성을 보입니다.
          </SectionText>
          <ContentBox>
            <PredictionModel 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
              aaaData={aaaData.players}
            />
          </ContentBox>
        </Section>
        
        <NavigationBar>
          <NavLink active={activeSection === 'hero'} onClick={() => scrollToSection('hero')}>🏠 홈</NavLink>
          <NavLink active={activeSection === 'overview'} onClick={() => scrollToSection('overview')}>📊 개요</NavLink>
          <NavLink active={activeSection === 'players'} onClick={() => scrollToSection('players')}>🏆 Top Players</NavLink>
          <NavLink active={activeSection === 'correlation'} onClick={() => scrollToSection('correlation')}>🔗 상관 관계</NavLink>
          <NavLink active={activeSection === 'analysis'} onClick={() => scrollToSection('analysis')}>📈 분석</NavLink>
          <NavLink active={activeSection === 'aaa-scouting'} onClick={() => scrollToSection('aaa-scouting')}>🎯 AAA 스카우팅</NavLink>
          <NavLink active={activeSection === 'prediction'} onClick={() => scrollToSection('prediction')}>🔮 예측 모델</NavLink>
        </NavigationBar>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;