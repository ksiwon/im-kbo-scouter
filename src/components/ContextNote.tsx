// src/components/ContextNote.tsx
import React from 'react';
import styled from 'styled-components';

const NoteContainer = styled.div`
  background: rgba(255, 221, 89, 0.1); /* Yellow tint */
  border-left: 4px solid #fbc531;
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 0 8px 8px 0;
  font-size: 0.95rem;
  color: #f5f6fa;
  line-height: 1.6;
  
  strong {
    color: #fbc531;
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

interface ContextNoteProps {
  title?: string;
  children: React.ReactNode;
}

const ContextNote: React.FC<ContextNoteProps> = ({ title = "ANALYST NOTE", children }) => {
  return (
    <NoteContainer>
      <strong>{title}</strong>
      {children}
    </NoteContainer>
  );
};

export default ContextNote;
