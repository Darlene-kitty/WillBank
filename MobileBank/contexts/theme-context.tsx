import { Colors, ColorScheme } from '@/constants/colors';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

interface ThemeContextType {
  colorScheme: ColorScheme;
  colors: typeof Colors.light;
  toggleTheme: () => void;
  setTheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(deviceColorScheme || 'dark');

  useEffect(() => {
    // Sync with device theme if needed
    if (deviceColorScheme) {
      setColorScheme(deviceColorScheme);
    }
  }, [deviceColorScheme]);

  const colors = Colors[colorScheme];

  const toggleTheme = () => {
    setColorScheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (scheme: ColorScheme) => {
    setColorScheme(scheme);
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
