import { createContext, useContext } from 'react';
import type { Theme } from '@/hooks/useTheme';

export const ThemeContext = createContext<Theme>('dark');

export function useThemeContext(): Theme {
    return useContext(ThemeContext);
}

// Warm editorial color palette reference
export const warmColorPalette = {
  canvas: '#0a0a0a',
  cream: '#f5f1ed',
  accent: '#ff7043',
  gold: '#c9a961',
  warmGray: '#3a3430',
  warmBorder: '#4a4440',
  cardBg: '#1a1a1a',
} as const;
