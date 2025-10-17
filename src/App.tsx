// src/App.tsx (업데이트)
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

import kboFirstYearData from './data/kbo_first_year_stats.json';
import preKboData from './data/pre_kbo_stats.json';

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

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <ScrollProgress progress={scrollProgress} />
        
        <Hero />

        <Section>
          <SectionTitle>📊 데이터 개요</SectionTitle>
          <SectionText>
            2010년부터 2024년까지 KBO에 입단한 65명의 외국인 타자들의 데이터를 분석했습니다.
            <br />
            각 선수의 KBO 입단 전 성적과 KBO 첫 해 성적을 비교하여 성공 패턴을 찾아냅니다.
          </SectionText>
          <ContentBox>
            <StatsOverview 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
        </Section>

        <Section dark>
          <SectionTitle>📈 성적 분포 변화</SectionTitle>
          <SectionText>
            KBO 입단 전후로 선수들의 주요 지표가 어떻게 변화하는지 살펴봅시다.
            <br />
            평균적으로 타석은 증가하지만, wRC+는 리그 환경 차이로 인해 변동이 큽니다.
          </SectionText>
          <ContentBox>
            <DistributionChart 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
        </Section>

        <Section>
          <SectionTitle>📉 변화량(Δ) 분석</SectionTitle>
          <SectionText>
            KBO 입단 전후 각 지표의 변화량 분포를 히스토그램으로 확인합니다.
            <br />
            평균, 중앙값, 표준편차를 통해 변화의 패턴을 파악할 수 있습니다.
          </SectionText>
          <ContentBox>
            <DeltaDistribution 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
        </Section>

        <Section dark>
          <SectionTitle>🔗 상관관계 분석</SectionTitle>
          <SectionText>
            KBO 입단 전 지표 중 어떤 것이 KBO에서의 성공을 예측할 수 있을까요?
            <br />
            K%와 BB% 같은 규율 지표는 안정적이지만, wRC+는 환경 의존적입니다.
          </SectionText>
          <ContentBox>
            <CorrelationChart 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
        </Section>

        <Section>
          <SectionTitle>⚖️ 입단 전후 비교</SectionTitle>
          <SectionText>
            주요 타격 지표들이 KBO 입단 전후로 어떻게 변화하는지 시각화했습니다.
          </SectionText>
          <ContentBox>
            <ComparisonChart 
              kboData={kboFirstYearData.players}
              preKboData={preKboData.players}
            />
          </ContentBox>
        </Section>

        <Section dark>
          <SectionTitle>🏆 톱 퍼포머 분석</SectionTitle>
          <SectionText>
            KBO 첫 해에 가장 뛰어난 성적을 기록한 선수들을 살펴봅시다.
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
            📊 KBO Foreign Hitter Predictor<br />
            DIKW 모델 기반 데이터 분석 시스템<br />
            2010-2024 시즌 • 65명의 외국인 타자 분석<br />
            <br />
            Data Source: FanGraphs.com
          </FooterText>
        </Footer>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;