// src/components/ScrollyLayout.tsx
import React, { ReactNode, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  position: relative;
`;

const LeftPanel = styled.div`
  width: 30%;
  min-width: 320px; /* Slightly reduced min-width */
  z-index: 10;
  position: relative;
  pointer-events: auto; 
  padding-bottom: 50vh;
  
  @media (max-width: 1024px) {
    width: 100%;
    min-width: auto;
    background: rgba(10, 14, 39, 0.95);
  }
`;

const RightPanel = styled.div`
  width: 70%;
  height: 100vh;
  position: sticky;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.bg.primary};
  overflow: hidden;
  
  @media (max-width: 1024px) {
    position: fixed;
    width: 100%;
    z-index: 0;
    opacity: 0.2;
  }
`;

const StepContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem; /* Reduced padding */
  
  & > div {
    background: rgba(20, 20, 30, 0.9);
    backdrop-filter: blur(10px);
    padding: 1.5rem; /* Reduced padding */
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    transition: transform 0.3s ease, opacity 0.3s ease;
    
    /* Font size adjustments */
    h2 {
      font-size: 1.8rem; /* Reduced from 2.5rem */
      margin-bottom: 1rem;
    }
    
    p {
      font-size: 1rem; /* Reduced from 1.1rem */
      line-height: 1.6;
      margin-bottom: 1rem;
    }
  }
`;

interface ScrollyLayoutProps {
  children: ReactNode;
  visual: ReactNode;
  onStepChange: (stepIndex: number) => void;
}

export const Step = ({ children, id }: { children: ReactNode, id: string }) => {
  return (
    <StepContainer id={id} className="scrolly-step">
      <div>{children}</div>
    </StepContainer>
  );
};

export const ScrollyLayout = ({ children, visual, onStepChange }: ScrollyLayoutProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(document.querySelectorAll('.scrolly-step')).indexOf(entry.target);
            if (index !== -1) {
              onStepChange(index);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    const steps = document.querySelectorAll('.scrolly-step');
    steps.forEach((step) => observer.observe(step));

    return () => {
      steps.forEach((step) => observer.unobserve(step));
    };
  }, [onStepChange]);

  return (
    <Container>
      <LeftPanel>
        {children}
      </LeftPanel>
      <RightPanel id="sticky-visual">
        {visual}
      </RightPanel>
    </Container>
  );
};
