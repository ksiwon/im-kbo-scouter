// src/components/ContextNote.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(-10px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
`;

const NoteContainer = styled.div`
  background: rgba(251, 197, 49, 0.08);
  border-left: 4px solid #fbc531;
  padding: 1.25rem;
  margin: 1.5rem 0;
  border-radius: 0 12px 12px 0;
  font-size: 0.9rem;
  color: #f5f6fa;
  line-height: 1.7;
  position: relative;
  animation: ${slideIn} 0.4s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 4px;
    background: #fbc531;
    border-radius: 2px;
  }
`;

const NoteTitle = styled.strong`
  color: #fbc531;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
`;

const NoteIcon = styled.span`
  font-size: 1rem;
`;

const NoteContent = styled.div`
  color: #e8eaed;
  
  em {
    color: #fbc531;
    font-style: normal;
    font-weight: 600;
  }
  
  strong {
    color: #fff;
  }
  
  code {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.85em;
    color: #4bcffa;
  }
`;

interface ContextNoteProps {
  title?: string;
  icon?: string;
  children: React.ReactNode;
}

const ContextNote: React.FC<ContextNoteProps> = ({ 
  title = "ANALYST NOTE", 
  icon = "📊",
  children 
}) => {
  return (
    <NoteContainer>
      <NoteTitle>
        <NoteIcon>{icon}</NoteIcon>
        {title}
      </NoteTitle>
      <NoteContent>
        {children}
      </NoteContent>
    </NoteContainer>
  );
};

export default ContextNote;
