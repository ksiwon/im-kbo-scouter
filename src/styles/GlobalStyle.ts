// src/styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#1a73e8',
    secondary: '#34a853',
    accent: '#fbbc04',
    danger: '#ea4335',
    success: '#34a853',
    warning: '#fbbc04',
    info: '#4285f4',
    
    // Background
    bg: {
      primary: '#0a0e27',
      secondary: '#131b3a',
      tertiary: '#1e2749',
      card: '#1a2238',
      hover: '#252f4a',
    },
    
    // Text
    text: {
      primary: '#e8eaed',
      secondary: '#9aa0a6',
      disabled: '#5f6368',
    },
    
    // Chart colors
    chart: {
      blue: '#4285f4',
      green: '#34a853',
      yellow: '#fbbc04',
      red: '#ea4335',
      purple: '#a142f4',
      cyan: '#24c1e0',
      orange: '#ff6d00',
      pink: '#f538a0',
    },
    
    // Gradients
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      success: 'linear-gradient(135deg, #667eea 0%, #34a853 100%)',
      warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
  },
  
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.15)',
    lg: '0 8px 16px rgba(0,0,0,0.2)',
    xl: '0 12px 24px rgba(0,0,0,0.25)',
  },
  
  transitions: {
    fast: '150ms ease',
    normal: '300ms ease',
    slow: '500ms ease',
  },
};

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${theme.colors.bg.primary};
    color: ${theme.colors.text.primary};
    overflow-x: hidden;
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${theme.colors.bg.secondary};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.bg.hover};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.text.disabled};
  }
`;