// src/components/SideNavigation.tsx
import React from 'react';
import styled from 'styled-components';

interface NavItem {
  id: string;
  label: string;
}

interface SideNavigationProps {
  items: NavItem[];
  activeIndex: number;
  onNavigate: (id: string) => void;
}

const NavContainer = styled.nav`
  position: fixed;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 1000;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavDot = styled.button<{ $active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$active 
    ? props.theme.colors.primary 
    : 'rgba(255, 255, 255, 0.2)'};
  border: 2px solid ${props => props.$active 
    ? props.theme.colors.primary 
    : 'rgba(255, 255, 255, 0.3)'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding: 0;
  
  &:hover {
    transform: scale(1.3);
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.3);
  }
`;

const Tooltip = styled.span`
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    border: 6px solid transparent;
    border-left-color: rgba(0, 0, 0, 0.9);
  }
  
  ${NavDot}:hover & {
    opacity: 1;
    visibility: visible;
    right: 28px;
  }
`;

const ProgressLine = styled.div<{ $progress: number }>`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-50%);
  z-index: -1;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: ${props => props.$progress}%;
    background: ${props => props.theme.colors.primary};
    transition: height 0.3s ease;
  }
`;

const SideNavigation: React.FC<SideNavigationProps> = ({
  items,
  activeIndex,
  onNavigate,
}) => {
  const progress = items.length > 1 
    ? (activeIndex / (items.length - 1)) * 100 
    : 0;

  const handleClick = (id: string) => {
    onNavigate(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <NavContainer>
      <ProgressLine $progress={progress} />
      {items.map((item, index) => (
        <NavDot
          key={item.id}
          $active={activeIndex === index}
          onClick={() => handleClick(item.id)}
          aria-label={`${item.label}로 이동`}
          aria-current={activeIndex === index ? 'step' : undefined}
        >
          <Tooltip>{item.label}</Tooltip>
        </NavDot>
      ))}
    </NavContainer>
  );
};

export default SideNavigation;
