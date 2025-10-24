// src/components/Hero.tsx
import React from 'react';
import styled from 'styled-components';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
  
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
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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

const ScrollHint = styled.div`
  position: absolute;
  bottom: 2rem;
  animation: bounce 2s infinite;
  z-index: 1;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

function Hero() {
  return (
    <HeroSection>
      <HeroTitle>KBO Foreign Hitter Predictor</HeroTitle>
      <HeroSubtitle>
        데이터로 발견하는 성공의 패턴
        <br />
        DIKW 모델 기반 예측 시스템
      </HeroSubtitle>
      <HeroMeta>
        📊 65명의 외국인 타자 분석 | 🎯 2010-2024 시즌 | 🌟 2025 AAA 스카우팅
      </HeroMeta>
      <ScrollHint>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="white">
          <path d="M15 3 L15 20 M15 20 L9 14 M15 20 L21 14" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      </ScrollHint>
    </HeroSection>
  );
}

export default Hero;