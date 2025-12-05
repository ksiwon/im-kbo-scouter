// src/components/Hero.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const HeroContainer = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  padding: 2rem;
  background: radial-gradient(ellipse at center, 
    rgba(26, 115, 232, 0.1) 0%, 
    transparent 70%);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="1" fill="rgba(255,255,255,0.03)"/></svg>');
    pointer-events: none;
  }
`;

const TagLine = styled.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const MainTitle = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 0.8s ease-out 0.1s both;
  color: ${props => props.theme.colors.text.primary};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Highlight = styled.span`
  color: ${props => props.theme.colors.primary};
  display: block;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.text.secondary};
  max-width: 600px;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.8s ease-out 0.3s both;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
    flex-wrap: wrap;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.25rem;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 1rem;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: ${props => props.theme.colors.text.disabled};
  opacity: 0.5;
  text-align: center;
  animation: ${fadeInUp} 1s ease-out 0.5s both;
`;

function Hero() {
  return (
    <HeroContainer>
      <TagLine>데이터 저널리즘 리포트</TagLine>
      
      <MainTitle>
        왜 MLB의 거포들은
        <Highlight>한국에서 실패하는가?</Highlight>
      </MainTitle>
      
      <Subtitle>
        AAA에서 30홈런을 쳤던 타자도 KBO에서는 2할 초반대에 허덕입니다.
        <br />
        우리는 그 해답을 데이터에서 찾았습니다.
      </Subtitle>
      
      <StatsRow>
        <StatItem>
          <StatNumber>65명</StatNumber>
          <StatLabel>분석된 외국인 타자</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>15년</StatNumber>
          <StatLabel>2010-2024 데이터</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>241명</StatNumber>
          <StatLabel>2025 AAA 스카우팅</StatLabel>
        </StatItem>
      </StatsRow>
      
      <Footer>
        KBO Foreign Hitter Predictor © 2025 Siwon at KAIST AEL | Data: FanGraphs.com
      </Footer>
    </HeroContainer>
  );
}

export default Hero;