// src/styles/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      danger: string;
      success: string;
      warning: string;
      info: string;
      bg: {
        primary: string;
        secondary: string;
        tertiary: string;
        card: string;
        hover: string;
      };
      text: {
        primary: string;
        secondary: string;
        disabled: string;
      };
      chart: {
        blue: string;
        green: string;
        yellow: string;
        red: string;
        purple: string;
        cyan: string;
        orange: string;
        pink: string;
      };
      gradient: {
        primary: string;
        success: string;
        warning: string;
        info: string;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      round: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    transitions: {
      fast: string;
      normal: string;
      slow: string;
    };
  }
}