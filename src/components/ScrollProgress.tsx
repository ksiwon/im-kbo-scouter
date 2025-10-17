// src/components/ScrollProgress.tsx
import React from 'react';
import styled from 'styled-components';

const ProgressBar = styled.div<{ progress: number }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.1s ease;
  z-index: 9999;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
`;

interface ScrollProgressProps {
  progress: number;
}

function ScrollProgress({ progress }: ScrollProgressProps) {
  return <ProgressBar progress={progress} />;
}

export default ScrollProgress;