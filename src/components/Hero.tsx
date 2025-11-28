// src/components/Hero.tsx
import React from 'react';
import styled from 'styled-components';

const HeroSection = styled.section`
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  flex-shrink: 0;
  scroll-snap-align: start;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: ${props => props.theme.colors.bg.secondary};
  text-align: center;
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>');
    opacity: 0.5;
  }
`;

const HeroTitle = styled.h1`
  font-size: 4.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  animation: fadeInUp 1s ease;
  z-index: 1;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.3);

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.8rem;
  opacity: 0.95;
  animation: fadeInUp 1s ease 0.2s both;
  z-index: 1;
  max-width: 800px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const HeroMeta = styled.div`
  margin-top: 2rem;
  font-size: 1.1rem;
  opacity: 0.85;
  animation: fadeInUp 1s ease 0.4s both;
  z-index: 1;
`;

// Footer를 Hero 하단에 배치
const FooterText = styled.div`
  position: absolute;
  bottom: 5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.disabled};
  line-height: 1.6;
  z-index: 1;
  opacity: 0.7;
  animation: fadeIn 2s ease;
`;

function Hero() {
  return (
    <HeroSection id="hero">
      <HeroTitle>KBO Foreign Hitter Predictor</HeroTitle>
      <HeroSubtitle>
        Sabermetrics, 데이터로 발견하는 성공의 패턴
        <br />
        KFS Score 기반 예측 시스템
      </HeroSubtitle>
      <HeroMeta>
        📊 65명의 외국인 타자 분석 | 🎯 2010-2024 시즌 | 🌟 2025 AAA 스카우팅
      </HeroMeta>
      
      <FooterText>
        📊 KBO Foreign Hitter Predictor / 2025 Siwon. All Rights Reserved.
        <br />
        Data Source: FanGraphs.com
      </FooterText>
    </HeroSection>
  );
}

export default Hero;