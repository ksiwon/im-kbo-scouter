// src/components/FailureArticle.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); rotate: 0deg; }
  to { opacity: 1; transform: translateY(0); rotate: -2deg; }
`;

const ArticleContainer = styled.article`
  background: #fefefe;
  color: #1a1a1a;
  max-width: 600px;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
  transform: rotate(-2deg);
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #c41e3a;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 100%;
    transform: rotate(0deg);
  }
`;

const Masthead = styled.div`
  text-align: center;
  border-bottom: 3px double #1a1a1a;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
`;

const MastheadTitle = styled.h1`
  font-family: 'Times New Roman', serif;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -1px;
  margin: 0;
  color: #1a1a1a;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const MastheadDate = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Headline = styled.h2`
  font-family: 'Times New Roman', serif;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Subheadline = styled.h3`
  font-family: 'Georgia', serif;
  font-size: 1.1rem;
  font-weight: 400;
  font-style: italic;
  color: #444;
  margin-bottom: 1.5rem;
  line-height: 1.4;
`;

const ArticleBody = styled.div`
  font-family: 'Georgia', serif;
  font-size: 0.95rem;
  line-height: 1.8;
  color: #333;
  
  p {
    margin-bottom: 1rem;
    text-align: justify;
  }
  
  .highlight {
    background: linear-gradient(to bottom, transparent 60%, #fff3cd 60%);
    padding: 0 2px;
    font-weight: 600;
  }
  
  .stat {
    font-family: 'Courier New', monospace;
    background: #f5f5f5;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.9em;
  }
  
  blockquote {
    border-left: 3px solid #c41e3a;
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: #555;
  }
`;

const PullQuote = styled.div`
  font-family: 'Georgia', serif;
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  border-top: 2px solid #1a1a1a;
  border-bottom: 2px solid #1a1a1a;
  color: #1a1a1a;
  line-height: 1.4;
`;

const ByLine = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ddd;
  
  span {
    font-weight: 600;
    color: #1a1a1a;
  }
`;

const StatBox = styled.div`
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
  
  .stat-number {
    font-family: 'Courier New', monospace;
    font-size: 2rem;
    font-weight: 700;
    color: #c41e3a;
    display: block;
  }
  
  .stat-label {
    font-size: 0.8rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 0.25rem;
  }
`;

const FailureArticle: React.FC = () => {
  return (
    <ArticleContainer>
      <Masthead>
        <MastheadTitle>KBO 스카우트 리포트</MastheadTitle>
        <MastheadDate>데이터 저널리즘 | 2025년 외국인 타자 분석</MastheadDate>
      </Masthead>
      
      <Headline>
        "30홈런 거포의 몰락"
        <br />
        왜 그들은 실패했는가
      </Headline>
      
      <Subheadline>
        AAA 리그 정복자들, KBO에서 2할대 타율에 허덕이다
      </Subheadline>
      
      <ByLine>
        <span>KFS 리서치팀</span> | 세이버메트릭스 분석
      </ByLine>
      
      <ArticleBody>
        <p>
          매년 수억 원의 연봉을 받고 KBO 리그에 입성하는 외국인 타자들. 
          그들의 이력서에는 <span className="highlight">AAA 리그 홈런왕</span>, 
          <span className="highlight">wRC+ 150 이상</span>의 화려한 수식어가 붙어 있다.
        </p>
        
        <p>
          하지만 현실은 냉혹하다. 지난 15년간 KBO를 거쳐간 외국인 타자 중 
          재계약에 성공한 비율은 <span className="stat">40% 미만</span>에 불과하다.
        </p>
        
        <PullQuote>
          "미국에서 잘 쳤으니 한국에서도 통한다"
          <br />
          — 이 가설은 데이터 앞에서 무너졌다.
        </PullQuote>
        
        <p>
          루크 스캇(Luke Scott)을 기억하는가. MLB 통산 82홈런, 강력한 좌타 파워를 
          갖춘 거포였다. 2014년 한화 이글스는 그에게 큰 기대를 걸었다. 
          결과는? <span className="stat">타율 .211</span>, 
          <span className="stat">11홈런</span>. 
          그는 1년도 채우지 못하고 한국을 떠났다.
        </p>
        
        <StatBox>
          <span className="stat-number">-0.12</span>
          <span className="stat-label">AAA wRC+와 KBO 성적의 상관계수</span>
        </StatBox>
        
        <p>
          충격적인 통계가 있다. AAA에서의 wRC+(조정 득점 생산력)와 
          KBO 1년차 성적 사이의 상관계수는 <span className="highlight">-0.12</span>에 
          불과하다. 이는 통계적으로 "거의 무관함"을 의미한다.
        </p>
        
        <p>
          반면, <span className="highlight">삼진율(K%)</span>은 다른 결과를 보여준다. 
          상관계수 <span className="stat">0.50</span>. AAA에서 삼진을 많이 당하던 
          타자는 KBO에서도 삼진을 많이 당한다. 선구안은 배신하지 않는다.
        </p>
        
        <blockquote>
          "KBO 투수들의 구속은 MLB보다 느리다. 하지만 그들의 변화구 구사율과 
          유인구 승부는 집요하다. 컨택 능력 없는 파워 히터는 선풍기가 될 뿐이다."
        </blockquote>
        
        <p>
          데이터는 명확한 메시지를 전달한다. <span className="highlight">
          화려한 AAA 성적에 속지 마라</span>. 진짜 중요한 것은 K%, BB%, 
          그리고 컨택의 질이다. 이것이 우리가 KFS Score를 개발한 이유다.
        </p>
      </ArticleBody>
    </ArticleContainer>
  );
};

export default FailureArticle;
