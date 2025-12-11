/**
 * 💳 BANKING MODERN (Revolut/N26 Style)
 * Design System Tokens
 * 
 * Inspiré par: Revolut, N26, Monzo
 */

export const BankingModern = {
  // Spacing (flexible, premium feel)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
  },

  // Typography (Modern, clean)
  typography: {
    displayLarge: {
      fontSize: 48,
      lineHeight: 56,
      fontWeight: '700' as const,
      letterSpacing: -1,
    },
    displayMedium: {
      fontSize: 40,
      lineHeight: 48,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
    },
    displaySmall: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
    },
    headingLarge: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700' as const,
      letterSpacing: -0.3,
    },
    headingMedium: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700' as const,
      letterSpacing: -0.2,
    },
    headingSmall: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600' as const,
      letterSpacing: -0.1,
    },
    bodyLarge: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    bodyMedium: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    bodySmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500' as const,
      letterSpacing: 0.5,
    },
    button: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600' as const,
      letterSpacing: 0.2,
    },
  },

  // Border Radius (Premium curves)
  radius: {
    none: 0,
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    xxl: 32,
    full: 9999,
  },

  // Shadows (Soft, premium)
  shadows: {
    none: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.14,
      shadowRadius: 20,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.18,
      shadowRadius: 28,
      elevation: 5,
    },
    colored: {
      shadowColor: '#0066FF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 6,
    },
  },

  // Animation (Smooth, premium)
  animation: {
    duration: {
      instant: 100,
      fast: 200,
      normal: 350,
      slow: 500,
      verySlow: 700,
    },
    easing: {
      easeIn: 'cubic-bezier(0.32, 0, 0.67, 0)',
      easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
      easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
      premium: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    spring: {
      damping: 20,
      stiffness: 200,
      mass: 0.8,
    },
  },

  // Component Sizes
  components: {
    button: {
      height: 56,
      heightLarge: 64,
      heightSmall: 48,
      paddingHorizontal: 24,
      borderRadius: 16,
    },
    input: {
      height: 56,
      paddingHorizontal: 16,
      borderRadius: 14,
    },
    card: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 20,
    },
    cardLarge: {
      paddingHorizontal: 24,
      paddingVertical: 24,
      borderRadius: 24,
    },
  },

  // Banking Specific
  glassmorphism: {
    light: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    dark: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(20px)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
  },

  // Gradients
  gradients: {
    primary: ['#0066FF', '#0052CC'],
    success: ['#00D68F', '#00B87A'],
    premium: ['#667EEA', '#0066FF'],
    sunset: ['#FF6B6B', '#FF8E53'],
    ocean: ['#00D4FF', '#0066FF'],
  },

  // Colors
  colors: {
    // Primary
    primary: '#0066FF',
    primaryLight: '#E6F0FF',
    primaryDark: '#0052CC',
    
    // Success
    success: '#00D68F',
    successLight: '#E6FFF9',
    
    // Warning
    warning: '#FFB800',
    warningLight: '#FFF8E6',
    
    // Error
    error: '#FF3B30',
    errorLight: '#FFE6E6',
    
    // Premium
    premium: '#667EEA',
    premiumLight: '#F0F2FF',
  },
};

export type BankingModernType = typeof BankingModern;
