// src/App.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from './styles/GlobalStyle';
import Dashboard from './pages/Dashboard';
import PlayerComparison from './pages/PlayerComparison';
import CorrelationAnalysis from './pages/CorrelationAnalysis';
import PredictionModel from './pages/PredictionModel';

// Import JSON data
import kboFirstYearData from './data/kbo_first_year_stats.json';
import preKboData from './data/pre_kbo_stats.json';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.bg.primary};
`;

const Header = styled.header`
  background: ${props => props.theme.colors.bg.secondary};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  background: ${props => props.theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
  overflow-x: auto;
  padding-bottom: ${props => props.theme.spacing.sm};
  
  &::-webkit-scrollbar {
    height: 4px;
  }
`;

const NavButton = styled.button<{ active?: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: ${props => props.active 
    ? props.theme.colors.gradient.primary 
    : props.theme.colors.bg.tertiary};
  color: ${props => props.theme.colors.text.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all ${props => props.theme.transitions.normal};
  box-shadow: ${props => props.active ? props.theme.shadows.md : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.md};
  }
`;

const pages = [
  { id: 'dashboard', name: '📊 Dashboard', component: Dashboard },
  { id: 'comparison', name: '⚖️ Player Comparison', component: PlayerComparison },
  { id: 'correlation', name: '📈 Correlation Analysis', component: CorrelationAnalysis },
  { id: 'prediction', name: '🔮 Prediction Model', component: PredictionModel },
];

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  
  const ActiveComponent = pages.find(p => p.id === activePage)?.component || Dashboard;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Title>KBO Foreign Hitter Predictor</Title>
          <Subtitle>Data-Driven Scouting with DIKW Model</Subtitle>
          <Nav>
            {pages.map(page => (
              <NavButton
                key={page.id}
                active={activePage === page.id}
                onClick={() => setActivePage(page.id)}
              >
                {page.name}
              </NavButton>
            ))}
          </Nav>
        </Header>
        <MainContent>
          <ActiveComponent 
            kboData={kboFirstYearData.players}
            preKboData={preKboData.players}
          />
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;