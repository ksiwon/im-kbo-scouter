// src/App.tsx (최신 버전)
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from './styles/GlobalStyle';
import Hero from './components/Hero';
import ScrollProgress from './components/ScrollProgress';
import StatsOverview from './components/StatsOverview';
import DistributionChart from './components/DistributionChart';
import CorrelationChart from './components/CorrelationChart';
import ComparisonChart from './components/ComparisonChart';
import DeltaDistribution from './components/DeltaDistribution';
import PlayerList from './components/PlayerList';
import AAAScoutingBoard from './components/AAAScoutingBoard';
import Dashboard from './pages/Dashboard';
import PredictionModel from './pages/PredictionModel';
import CorrelationAnalysis from './pages/CorrelationAnalysis';

// 데이터 import (파일명은 실제 파일명에 맞게 조정하세요)
import kboFirstYearData from './data/kbo_first_year_stats_matched.json';
import preKboData from './data/pre_kbo_stats_matched.json';
import aaaData from './data/aaa_2025_stats.json';

const AppContainer = styled.div`
  background: ${props => props.theme.colors.bg.primary};
  color: ${props => props.theme.colors.text.primary};
  overflow-x: hidden;
`;

const Section = styled.section<{ dark?: boolean }>`
  min-height: 100vh;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${props => props.dark 
    ? props.theme.colors.bg.secondary 
    : props.theme.colors.bg.primary};
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    min-height: auto;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  -webkit-background-clip: text;
  background-clip: text;
  animation: fadeIn 0.8s ease;
  
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
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContentBox = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 2rem auto;
`;

const Footer = styled.footer`
  padding: 3rem 2rem;
  background: ${props => props.theme.colors.bg.secondary};
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  border-top: 1px solid ${props => props.theme.colors.bg.tertiary};
`;

const FooterText = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
`;

const NavigationBar = styled.nav`
  position: fixed;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(30, 39, 73, 0.98);
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid rgb(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  z-index: 100;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    gap: 0.25rem;
    padding: 0.5rem 0.25rem;
    justify-content: space-around;
  }
`;

const NavLink = styled.a`
  color: ${props => props.theme.colors.text.secondary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  flex-shrink: 0;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: rgba(66, 133, 244, 0.1);
  }
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }
`;

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <ScrollProgress progress={scrollProgress} />
        
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

        <Section dark id="correlation">
          <SectionTitle>🔗 상관관계 분석</SectionTitle>
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
            <DistributionChart 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
          <ContentBox>
            <DeltaDistribution 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
          <ContentBox>
            <ComparisonChart 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
        </Section>

        <Section dark id="players">
          <SectionTitle>🏆 톱 퍼포머 분석</SectionTitle>
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

        <Footer>
          <FooterText>
            📊 KBO Foreign Hitter Predictor / 2025 Siwon. All Rights Reserved.
            <br /><br />
            Data Source: FanGraphs.com
            <br /><br />
          </FooterText>
        </Footer>

        {/* 하단 고정 Navigation Bar */}
        <NavigationBar>
          <NavLink onClick={() => scrollToSection('overview')}>📊 개요</NavLink>
          <NavLink onClick={() => scrollToSection('aaa-scouting')}>🎯 AAA 스카우팅</NavLink>
          <NavLink onClick={() => scrollToSection('prediction')}>🔮 예측 모델</NavLink>
          <NavLink onClick={() => scrollToSection('correlation')}>🔗 상관관계</NavLink>
          <NavLink onClick={() => scrollToSection('analysis')}>📈 분석</NavLink>
          <NavLink onClick={() => scrollToSection('players')}>🏆 선수 비교</NavLink>
        </NavigationBar>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;