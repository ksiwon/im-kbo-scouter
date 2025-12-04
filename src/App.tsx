// src/App.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from './styles/GlobalStyle';

// Layout & Shared
import { ScrollyLayout, Step } from './components/ScrollyLayout';
import ContextNote from './components/ContextNote';

// Components
import Hero from './components/Hero';
import Dashboard from './pages/Dashboard';
import PlayerList from './components/PlayerList';
import CorrelationChart from './components/CorrelationChart';
import ComparisonChart from './components/ComparisonChart';
import DistributionChart from './components/DistributionChart';
import DeltaDistribution from './components/DeltaDistribution';
import KFSExplanation from './pages/KFSExplanation';
import AAAScoutingBoard from './components/AAAScoutingBoard';
import PredictionModel from './pages/PredictionModel';

// Data
import kboFirstYearData from './data/kbo_first_year_stats_matched.json';
import preKboData from './data/pre_kbo_stats_matched.json';
import aaaData from './data/aaa_2025_stats.json';
import { generateContextNote } from './utils/sabermetrics';

const Title = styled.h2`
  background: ${props => props.theme.colors.gradient.primary};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Text = styled.p`
  color: ${props => props.theme.colors.text.secondary};
`;

// Side Navigation Component
const SideNav = styled.div`
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 100;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavDot = styled.div<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.2)'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.2);
    background: ${props => props.theme.colors.primary};
  }
  
  &:hover::after {
    content: attr(data-label);
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.8);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    white-space: nowrap;
    color: white;
  }
`;

// Intro Visual Component (Article Style)
const ArticleVisual = styled.div`
  width: 80%;
  max-width: 600px;
  background: white;
  color: black;
  padding: 2rem;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  transform: rotate(-2deg);
  
  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid black;
    padding-bottom: 0.5rem;
  }
  
  p {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .highlight {
    background: yellow;
    font-weight: bold;
  }
`;

function App() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 'intro', label: 'Intro & Overview' },
    { id: 'players', label: 'Top Players' },
    { id: 'correlation', label: 'Correlation' },
    { id: 'distribution', label: 'Distribution' },
    { id: 'kfs', label: 'KFS Logic' },
    { id: 'scouting', label: 'Scouting Board' },
    { id: 'prediction', label: 'Prediction' },
  ];

  const scrollToStep = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderVisual = () => {
    switch (activeStep) {
      case 0: // Intro & Overview
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
             <div style={{ position: 'relative', width: '100%', height: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Hero />
                <div style={{ position: 'absolute', top: '50%', right: '10%', transform: 'translateY(-50%) rotate(5deg)', zIndex: 0, opacity: 0.8 }}>
                   <ArticleVisual>
                     <h1>[기획] "왜 그들은 실패했나"</h1>
                     <p>
                       <span className="highlight">30홈런 거포의 몰락.</span><br/>
                       AAA 홈런왕 출신 A선수가 KBO 리그에서 타율 0.210을 기록하며 짐을 쌌다.
                     </p>
                   </ArticleVisual>
                </div>
             </div>
             <div style={{ width: '90%', height: '40%', overflow: 'auto' }}>
                <Dashboard kboData={kboFirstYearData.players} preKboData={preKboData.players} />
             </div>
          </div>
        );
      case 1: // Top Players
        return (
          <div style={{ width: '90%', height: '90%', overflow: 'auto' }}>
             <PlayerList kboData={kboFirstYearData.players} preKboData={preKboData.players} />
          </div>
        );
      case 2: // Correlation
        return (
          <div style={{ width: '90%' }}>
            <CorrelationChart kboData={kboFirstYearData.players} preKboData={preKboData.players} />
          </div>
        );
      case 3: // Distribution & Delta
        return (
          <div style={{ width: '90%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ComparisonChart kboData={kboFirstYearData.players} preKboData={preKboData.players} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <DistributionChart kboData={kboFirstYearData.players} preKboData={preKboData.players} />
               <DeltaDistribution kboData={kboFirstYearData.players} preKboData={preKboData.players} />
            </div>
          </div>
        );
      case 4: // KFS Explanation
        return (
          <div style={{ width: '90%' }}>
            <KFSExplanation />
          </div>
        );
      case 5: // AAA Scouting
        return (
          <div style={{ width: '95%', height: '95%' }}>
            <AAAScoutingBoard 
              aaaData={aaaData.players} 
              kboData={kboFirstYearData.players} 
              preKboData={preKboData.players} 
            />
          </div>
        );
      case 6: // Prediction
        return (
          <div style={{ width: '90%' }}>
            <PredictionModel 
              kboData={kboFirstYearData.players} 
              preKboData={preKboData.players} 
              aaaData={aaaData.players} 
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      
      <SideNav>
        {steps.map((step, index) => (
          <NavDot 
            key={step.id} 
            active={activeStep === index} 
            data-label={step.label}
            onClick={() => scrollToStep(step.id)}
          />
        ))}
      </SideNav>

      <ScrollyLayout 
        onStepChange={setActiveStep}
        visual={renderVisual()}
      >
        
        {/* 1. Intro & Overview */}
        <Step id="intro">
          <Title>왜 MLB의 거포들은<br />한국에서 실패하는가?</Title>
          <Text>
            매년 수많은 외국인 타자들이 "코리안 드림"을 꿈꾸며 KBO 리그의 문을 두드립니다.
            하지만 그들 중 절반 이상은 1년도 채우지 못하고 짐을 쌉니다.
          </Text>
          <Text>
            AAA에서 30홈런을 쳤던 거포가 KBO에서는 2할 푼대에 허덕이는 미스터리.
            우리는 그 해답을 데이터에서 찾았습니다.
          </Text>
          <ContextNote title="KEY QUESTION">
            {generateContextNote('intro')}
          </ContextNote>
          <br />
          <Title>KBO 외국인 타자,<br />잔혹사의 기록</Title>
          <Text>
            2010년부터 2024년까지, KBO를 거쳐간 외국인 타자들의 데이터를 분석했습니다.
            성공(재계약) 확률은 40% 미만.
            우리가 흔히 믿었던 '성공 공식'은 틀렸을지도 모릅니다.
          </Text>
          <ContextNote title="DATA INSIGHT">
            {generateContextNote('overview')}
          </ContextNote>
        </Step>

        {/* 2. Top Players */}
        <Step id="players">
          <Title>성공과 실패의<br />갈림길</Title>
          <Text>
            테임즈, 로사리오 같은 전설적인 성공 사례와
            팬들의 기억 속에서 잊혀진 실패 사례들.
            그들의 AAA 성적표에는 어떤 차이가 있었을까요?
          </Text>
          <Text>
            단순히 wRC+가 높다고 성공하는 것이 아닙니다.
            성공한 선수들에게는 공통적인 'DNA'가 있습니다.
          </Text>
        </Step>

        {/* 3. Correlation */}
        <Step id="correlation">
          <Title>wRC+의 배신,<br />K%의 진실</Title>
          <Text>
            우리는 흔히 wRC+(조정 득점 생산력)를 타자의 능력을 보여주는 가장 완벽한 지표라고 믿습니다.
            하지만 리그가 바뀌면 이야기는 달라집니다.
          </Text>
          <Text>
            데이터 분석 결과, AAA wRC+와 KBO 성적의 상관관계는 매우 낮았습니다.
            반면, 삼진율(K%)과 볼넷 비율(BB%)은 리그 이동 후에도 놀라운 일관성을 보입니다.
          </Text>
          <ContextNote title="STATISTICAL FACT">
            {generateContextNote('correlation')}
          </ContextNote>
        </Step>

        {/* 4. Distribution */}
        <Step id="distribution">
          <Title>리그 적응 비용:<br />Delta Analysis</Title>
          <Text>
            모든 선수는 리그를 옮길 때 '적응 비용'을 치릅니다.
            KBO 리그는 AAA보다 투수들의 구속은 느리지만, 변화구 구사율이 높고 스트라이크 존이 다릅니다.
          </Text>
          <Text>
            평균적으로 타자들의 성적은 어떻게 변했을까요?
            이 변화량(Delta)을 이해하는 것이 예측의 핵심입니다.
          </Text>
        </Step>

        {/* 5. KFS Explanation */}
        <Step id="kfs">
          <Title>KFS Score:<br />새로운 성공의 기준</Title>
          <Text>
            기존의 스카우팅 방식은 한계에 부딪혔습니다.
            우리는 환경 의존적인 지표(wRC+, HR)의 가중치를 낮추고,
            환경 독립적인 지표(K%, BB%, Contact%)의 가중치를 높인
            새로운 알고리즘 'KFS Score'를 개발했습니다.
          </Text>
        </Step>

        {/* 6. AAA Scouting */}
        <Step id="scouting">
          <Title>2025 AAA<br />스카우팅 리포트</Title>
          <Text>
            2025년, KBO 구단들이 주목해야 할 선수는 누구일까요?
            158명의 AAA 타자들을 KFS Score로 분석했습니다.
          </Text>
          <Text>
            우측의 리스트에서 선수를 선택하여 상세 분석을 확인하세요.
            데이터를 클릭하면 심층 분석(Deep Dive)이 제공됩니다.
          </Text>
          <ContextNote title="SCOUTING TIP">
            {generateContextNote('aaa-scouting')}
          </ContextNote>
        </Step>

        {/* 7. Prediction */}
        <Step id="prediction">
          <Title>직접 확인해보세요</Title>
          <Text>
            궁금한 선수가 있나요?
            AAA 성적을 입력하거나 선수를 선택하여
            KBO 예상 성적과 성공 확률을 시뮬레이션해보세요.
          </Text>
        </Step>

      </ScrollyLayout>
    </ThemeProvider>
  );
}

export default App;