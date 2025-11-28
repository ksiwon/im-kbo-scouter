// src/components/DraggableModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { AnalysisContent } from '../data/analysisData';

const ModalContainer = styled.div.attrs<{ x: number, y: number }>(props => ({
  style: {
    transform: `translate(${props.x}px, ${props.y}px)`,
  }
})) <{ x: number, y: number, isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 350px;
  background: rgba(30, 39, 73, 0.95);
  border: 1px solid rgba(66, 133, 244, 0.3);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 1000;
  overflow: hidden;
  transition: height 0.3s ease, opacity 0.3s ease;
  opacity: 0.95;
`;

const Header = styled.div`
  padding: 12px 16px;
  background: linear-gradient(90deg, rgba(26, 115, 232, 0.2) 0%, rgba(30, 39, 73, 0) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: grab;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

const Title = styled.h4`
  margin: 0;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.primary};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: 4px;
  font-size: 1.2rem;
  line-height: 1;
  
  &:hover {
    color: white;
  }
`;

const Content = styled.div<{ isOpen: boolean }>`
  padding: ${props => props.isOpen ? '16px' : '0'};
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow-y: auto;
  transition: all 0.3s ease;
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.9rem;
  line-height: 1.6;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
`;

const InsightBox = styled.div`
  margin-top: 12px;
  padding: 10px;
  background: rgba(52, 168, 83, 0.1);
  border-left: 3px solid ${props => props.theme.colors.success};
  border-radius: 4px;
  font-size: 0.85rem;
  color: #e8eaed;
`;

const List = styled.ul`
  padding-left: 20px;
  margin: 0;
  
  li {
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

interface DraggableModalProps {
  data: AnalysisContent | null;
}

const DraggableModal: React.FC<DraggableModalProps> = ({ data }) => {
  // 초기값을 0,0으로 설정 후 useEffect에서 화면 크기 계산
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // 우측 상단 위치 계산 (여백 20px, 상단 20px)
    setPosition({
      x: window.innerWidth - 370,
      y: 20
    });
  }, []);

  useEffect(() => {
    if (data) {
      setIsOpen(true);
    }
  }, [data]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!data) return null;

  return (
    <ModalContainer x={position.x} y={position.y} isOpen={isOpen}>
      <Header onMouseDown={handleMouseDown}>
        <Title>
          <span>Siwon's Note</span>
        </Title>
        <ToggleButton onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
          {isOpen ? '−' : '+'}
        </ToggleButton>
      </Header>
      <Content isOpen={isOpen}>
        <h4 style={{ marginBottom: '12px', color: '#fff' }}>{data.title}</h4>
        <List>
          {data.content.map((text, idx) => (
            <li key={idx}>{text}</li>
          ))}
        </List>
        <InsightBox>
          {data.insight}
        </InsightBox>
      </Content>
    </ModalContainer>
  );
};

export default DraggableModal;