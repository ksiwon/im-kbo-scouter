// src/App.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from './styles/GlobalStyle';

// Layout & Navigation
import { ScrollyLayout, Step } from './components/ScrollyLayout';
import SideNavigation from './components/SideNavigation';
import ContextNote from './components/ContextNote';

// Components
import Hero from './components/Hero';
import FailureArticle from './components/FailureArticle';
import PlayerList from './components/PlayerList';
import CorrelationChart from './components/CorrelationChart';
import ComparisonChart from './components/ComparisonChart';
import DistributionChart from './components/DistributionChart';
import KFSExplanation from './pages/KFSExplanation';
import AAAScoutingBoard from './components/AAAScoutingBoard';
import PredictionModel from './pages/PredictionModel';

// Data
import kboFirstYearData from './data/kbo_first_year_stats_matched.json';
import preKboData from './data/pre_kbo_stats_matched.json';
import aaaData from './data/aaa_2025_stats.json';
import { generateContextNote } from './utils/sabermetrics';

// Styled Components
const Title = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  font-weight: 700;
  line-height: 1.3;
  
  span.highlight {
    color: ${props => props.theme.colors.primary};
  }
`;

const Text = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.7;
`;

const Emphasis = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
`;

// Visual Container - 패딩 제거
const VisualWrapper = styled.div<{ $fullHeight?: boolean }>`
  width: 100%;
  height: ${props => props.$fullHeight ? '100%' : 'auto'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0;
  overflow: visible; /* Fixed double scroll */
`;

// 차트 컨테이너 - 전체 너비 사용
const ChartContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
`;

// 전체 컨테이너 - AAA Scouting 등
const FullContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0.5rem;
  box-sizing: border-box;
`;

// Navigation items
const NAV_ITEMS = [
  { id: 'intro', label: '인트로' },
  { id: 'failure', label: '실패의 역사' },
  { id: 'players', label: '성공 vs 실패' },
  { id: 'correlation', label: '상관관계 분석' },
  { id: 'distribution', label: '분포 & 델타' },
  { id: 'kfs', label: 'KFS 로직' },
  { id: 'scouting', label: '스카우팅 보드' },
  { id: 'prediction', label: '예측 계산기' },
];

function App() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render visual content based on active step
  const renderVisual = () => {
    switch (activeStep) {
      case 0: // Intro
        return (
          <VisualWrapper $fullHeight>
            <Hero />
          </VisualWrapper>
        );
        
      case 1: // Failure Article
        return (
          <VisualWrapper>
            <FailureArticle />
          </VisualWrapper>
        );
        
      case 2: // Top Players
        return (
          <VisualWrapper>
            <ChartContainer>
              <PlayerList 
                kboData={kboFirstYearData.players} 
                preKboData={preKboData.players} 
              />
            </ChartContainer>
          </VisualWrapper>
        );
        
      case 3: // Correlation
        return (
          <VisualWrapper>
            <ChartContainer>
              <CorrelationChart 
                kboData={kboFirstYearData.players} 
                preKboData={preKboData.players} 
              />
            </ChartContainer>
          </VisualWrapper>
        );
        
      case 4: // Distribution & Delta
        return (
          <VisualWrapper>
            <ChartContainer>
              <ComparisonChart 
                kboData={kboFirstYearData.players} 
                preKboData={preKboData.players} 
              />
            </ChartContainer>
            <ChartContainer>
              <DistributionChart 
                kboData={kboFirstYearData.players} 
                preKboData={preKboData.players} 
              />
            </ChartContainer>
          </VisualWrapper>
        );
        
      case 5: // KFS Explanation
        return (
          <VisualWrapper>
            <ChartContainer>
              <KFSExplanation />
            </ChartContainer>
          </VisualWrapper>
        );
        
      case 6: // AAA Scouting
        return (
          <FullContainer>
            <AAAScoutingBoard 
              aaaData={aaaData.players} 
              kboData={kboFirstYearData.players} 
              preKboData={preKboData.players} 
            />
          </FullContainer>
        );
        
      case 7: // Prediction
        return (
          <VisualWrapper>
            <ChartContainer>
              <PredictionModel 
                kboData={kboFirstYearData.players} 
                preKboData={preKboData.players} 
                aaaData={aaaData.players} 
              />
            </ChartContainer>
          </VisualWrapper>
        );
        
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      
      {/* Side Navigation */}
      <SideNavigation 
        items={NAV_ITEMS}
        activeIndex={activeStep}
        onNavigate={handleNavigate}
      />

      {/* Main Scrollytelling Layout */}
      <ScrollyLayout 
        onStepChange={setActiveStep}
        visual={renderVisual()}
      >
        
        {/* 1. Intro Section */}
        <Step id="intro" sectionLabel="01 • 인트로">
          <Title>
            왜 MLB의 거포들은
            <br />
            <span className="highlight">한국에서 실패하는가?</span>
          </Title>
          <Text>
            매년 수많은 외국인 타자들이 "코리안 드림"을 꿈꾸며 KBO 리그의 문을 두드립니다.
            하지만 그들 중 <Emphasis>절반 이상</Emphasis>은 1년도 채우지 못하고 짐을 쌉니다.
          </Text>
          <Text>
            AAA에서 30홈런을 쳤던 거포가 KBO에서는 2할 푼대에 허덕이는 미스터리.
            우리는 그 해답을 <Emphasis>데이터</Emphasis>에서 찾았습니다.
          </Text>
          <ContextNote title="KEY QUESTION" icon="🔍">
            {generateContextNote('intro')}
          </ContextNote>
        </Step>

        {/* 2. Failure Article Section */}
        <Step id="failure" sectionLabel="02 • 실패의 역사">
          <Title>
            잔혹한 기록,
            <br />
            <span className="highlight">wRC+의 배신</span>
          </Title>
          <Text>
            루크 스캇, 모터, 그리고 수많은 "거포"들의 실패 사례를 분석했습니다.
            그들의 공통점은 무엇이었을까요?
          </Text>
          <Text>
            2010년부터 2024년까지, KBO를 거쳐간 외국인 타자들의 데이터를 분석한 결과,
            <Emphasis> 성공(재계약) 확률은 40% 미만</Emphasis>이었습니다.
          </Text>
          <ContextNote title="DATA INSIGHT" icon="📊">
            {generateContextNote('failure')}
          </ContextNote>
        </Step>

        {/* 3. Top Players Section */}
        <Step id="players" sectionLabel="03 • 성공과 실패">
          <Title>
            성공과 실패의
            <br />
            <span className="highlight">갈림길</span>
          </Title>
          <Text>
            테임즈, 로사리오 같은 전설적인 성공 사례와
            팬들의 기억 속에서 잊혀진 실패 사례들.
          </Text>
          <Text>
            그들의 AAA 성적표에는 어떤 차이가 있었을까요?
            단순히 wRC+가 높다고 성공하는 것이 아닙니다.
            <Emphasis> 성공한 선수들에게는 공통적인 'DNA'</Emphasis>가 있습니다.
          </Text>
        </Step>

        {/* 4. Correlation Section */}
        <Step id="correlation" sectionLabel="04 • 상관관계 분석">
          <Title>
            wRC+의 배신,
            <br />
            <span className="highlight">K%의 진실</span>
          </Title>
          <Text>
            우리는 흔히 wRC+(조정 득점 생산력)를 타자의 능력을 보여주는 
            가장 완벽한 지표라고 믿습니다. 하지만 리그가 바뀌면 이야기는 달라집니다.
          </Text>
          <Text>
            데이터 분석 결과, <Emphasis>AAA wRC+와 KBO 성적의 상관관계는 극히 낮았습니다</Emphasis>.
            반면, 삼진율(K%)과 볼넷 비율(BB%)은 리그 이동 후에도 놀라운 일관성을 보입니다.
          </Text>
          <ContextNote title="STATISTICAL FACT" icon="📈">
            {generateContextNote('correlation')}
          </ContextNote>
        </Step>

        {/* 5. Distribution Section */}
        <Step id="distribution" sectionLabel="05 • 분포 & 델타">
          <Title>
            리그 적응 비용:
            <br />
            <span className="highlight">Delta Analysis</span>
          </Title>
          <Text>
            모든 선수는 리그를 옮길 때 '적응 비용'을 치릅니다.
            KBO 리그는 AAA보다 투수들의 구속은 느리지만, 
            <Emphasis>변화구 구사율이 높고 스트라이크 존이 다릅니다</Emphasis>.
          </Text>
          <Text>
            평균적으로 타자들의 성적은 어떻게 변했을까요?
            이 변화량(Delta)을 이해하는 것이 예측의 핵심입니다.
          </Text>
          <ContextNote title="DELTA INSIGHT" icon="📉">
            {generateContextNote('distribution')}
          </ContextNote>
        </Step>

        {/* 6. KFS Explanation Section */}
        <Step id="kfs" sectionLabel="06 • KFS 로직">
          <Title>
            KFS Score:
            <br />
            <span className="highlight">새로운 성공의 기준</span>
          </Title>
          <Text>
            기존의 스카우팅 방식은 한계에 부딪혔습니다.
            우리는 <Emphasis>환경 의존적인 지표(wRC+, HR)</Emphasis>의 가중치를 낮추고,
            <Emphasis> 환경 독립적인 지표(K%, BB%, Contact%)</Emphasis>의 가중치를 높인
            새로운 알고리즘 'KFS Score'를 개발했습니다.
          </Text>
          <ContextNote title="ALGORITHM" icon="🧮">
            {generateContextNote('kfs')}
          </ContextNote>
        </Step>

        {/* 7. AAA Scouting Section */}
        <Step id="scouting" sectionLabel="07 • 스카우팅 보드">
          <Title>
            2025 AAA
            <br />
            <span className="highlight">스카우팅 리포트</span>
          </Title>
          <Text>
            2025년, KBO 구단들이 주목해야 할 선수는 누구일까요?
            <Emphasis> 158명의 AAA 타자</Emphasis>들을 KFS Score로 분석했습니다.
          </Text>
          <Text>
            우측의 리스트에서 선수를 선택하여 상세 분석을 확인하세요.
            <Emphasis> 스탯 영역을 클릭</Emphasis>하면 심층 분석(Deep Dive)이 제공됩니다.
          </Text>
          <ContextNote title="SCOUTING TIP" icon="🎯">
            {generateContextNote('aaa-scouting')}
          </ContextNote>
        </Step>

        {/* 8. Prediction Section */}
        <Step id="prediction" sectionLabel="08 • 예측 계산기">
          <Title>
            직접 확인해보세요
          </Title>
          <Text>
            궁금한 선수가 있나요?
            AAA 성적을 입력하거나 선수를 선택하여
            <Emphasis> KBO 예상 성적과 성공 확률</Emphasis>을 시뮬레이션해보세요.
          </Text>
          <ContextNote title="TRY IT" icon="🔮">
            {generateContextNote('prediction')}
          </ContextNote>
        </Step>

      </ScrollyLayout>
    </ThemeProvider>
  );
}

export default App;