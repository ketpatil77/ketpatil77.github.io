import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

/** Reads system preference on first load if no stored preference exists. */
function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/**
 * Manages dark / light theme.
 * - Persists choice to localStorage
 * - Writes `data-theme` attribute on <html>
 * - Exposes `theme` string and `toggle()` callback
 */
export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

    return { theme, toggle } as const;
}
