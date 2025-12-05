// src/components/ScrollyLayout.tsx
import React, { ReactNode, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  width: 30%;
  min-width: 300px;
  max-width: 400px;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  position: relative;
  pointer-events: auto;
  padding-bottom: 30vh;
  scroll-behavior: smooth;
  background: ${props => props.theme.colors.bg.secondary};
  
  /* 커스텀 스크롤바 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }
  
  @media (max-width: 1024px) {
    width: 100%;
    min-width: auto;
    max-width: none;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  height: 100vh;
  position: sticky;
  top: 0;
  right: 0;
  background: ${props => props.theme.colors.bg.primary};
  overflow-y: auto; /* Enable vertical scrolling */
  
  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 1024px) {
    position: fixed;
    width: 100%;
    z-index: 0;
    opacity: 0.15;
    pointer-events: none;
  }
`;

const VisualContainer = styled.div`
  width: 100%;
  min-height: 100%; /* Allow growth */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem; /* Increased padding */
`;

const StepContainer = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem 1rem;
  
  & > div {
    padding: 1rem 0.75rem;
    width: 100%;
    max-width: none;
    
    h2 {
      font-size: 1.3rem;
      line-height: 1.3;
      margin-bottom: 0.75rem;
      font-weight: 700;
      color: ${props => props.theme.colors.text.primary};
    }
    
    p {
      font-size: 0.85rem;
      line-height: 1.6;
      margin-bottom: 0.6rem;
      color: ${props => props.theme.colors.text.secondary};
    }
  }
  
  @media (max-width: 1024px) {
    padding: 1rem 0.75rem;
    min-height: 50vh;
  }
`;

const SectionIndicator = styled.div`
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${props => props.theme.colors.primary};
  opacity: 0.8;
  margin-bottom: 1rem;
`;

interface ScrollyLayoutProps {
  children: ReactNode;
  visual: ReactNode;
  onStepChange: (stepIndex: number) => void;
}

export const Step = ({ 
  children, 
  id, 
  sectionLabel 
}: { 
  children: ReactNode; 
  id: string;
  sectionLabel?: string;
}) => {
  return (
    <StepContainer id={id} className="scrolly-step" data-section={id}>
      <div>
        {sectionLabel && <SectionIndicator>{sectionLabel}</SectionIndicator>}
        {children}
      </div>
    </StepContainer>
  );
};

export const ScrollyLayout = ({ 
  children, 
  visual, 
  onStepChange 
}: ScrollyLayoutProps) => {
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const currentStepRef = useRef<number>(0);

  const handleStepChange = useCallback((index: number) => {
    if (currentStepRef.current !== index) {
      currentStepRef.current = index;
      onStepChange(index);
      
      // Auto-scroll RightPanel to top
      const rightPanel = document.getElementById('visual-panel');
      if (rightPanel) {
        rightPanel.scrollTop = 0;
      }
    }
  }, [onStepChange]);

  useEffect(() => {
    const leftPanel = leftPanelRef.current;
    if (!leftPanel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const steps = Array.from(leftPanel.querySelectorAll('.scrolly-step'));
            const index = steps.indexOf(entry.target as Element);
            if (index !== -1) {
              handleStepChange(index);
            }
          }
        });
      },
      {
        root: leftPanel,
        threshold: [0.5],
        rootMargin: '-20% 0px -30% 0px'
      }
    );

    const steps = leftPanel.querySelectorAll('.scrolly-step');
    steps.forEach((step) => observer.observe(step));

    return () => {
      steps.forEach((step) => observer.unobserve(step));
    };
  }, [handleStepChange]);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const leftPanel = leftPanelRef.current;
      if (!leftPanel) return;

      const steps = leftPanel.querySelectorAll('.scrolly-step');
      const currentIndex = currentStepRef.current;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
        steps[nextIndex]?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        steps[prevIndex]?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Container>
      <LeftPanel ref={leftPanelRef} id="narrative-panel">
        {children}
      </LeftPanel>
      <RightPanel id="visual-panel">
        <VisualContainer>
          {visual}
        </VisualContainer>
      </RightPanel>
    </Container>
  );
};
