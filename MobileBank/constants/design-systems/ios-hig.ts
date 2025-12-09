/**
 * 🍎 iOS HUMAN INTERFACE GUIDELINES
 * Design System Tokens
 * 
 * Référence: https://developer.apple.com/design/human-interface-guidelines/
 */

export const iOSHIG = {
  // Spacing (iOS uses flexible spacing)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Typography (SF Pro)
  typography: {
    largeTitle: {
      fontSize: 34,
      lineHeight: 41,
      fontWeight: '700' as const,
      letterSpacing: 0.37,
    },
    title1: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700' as const,
      letterSpacing: 0.36,
    },
    title2: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '700' as const,
      letterSpacing: 0.35,
    },
    title3: {
      fontSize: 20,
      lineHeight: 25,
      fontWeight: '600' as const,
      letterSpacing: 0.38,
    },
    headline: {
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '600' as const,
      letterSpacing: -0.41,
    },
    body: {
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '400' as const,
      letterSpacing: -0.41,
    },
    callout: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: '400' as const,
      letterSpacing: -0.32,
    },
    subheadline: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '400' as const,
      letterSpacing: -0.24,
    },
    footnote: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '400' as const,
      letterSpacing: -0.08,
    },
    caption1: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    caption2: {
      fontSize: 11,
      lineHeight: 13,
      fontWeight: '400' as const,
      letterSpacing: 0.07,
    },
  },

  // Border Radius (iOS prefers subtle curves)
  radius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 10,
    lg: 12,
    xl: 16,
    xxl: 20,
    full: 9999,
  },

  // Shadows (iOS uses subtle shadows)
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
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 3,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
      elevation: 4,
    },
  },

  // Animation (iOS uses spring animations)
  animation: {
    duration: {
      instant: 100,
      fast: 200,
      normal: 300,
      slow: 400,
      verySlow: 500,
    },
    spring: {
      damping: 15,
      stiffness: 150,
      mass: 1,
    },
    easing: {
      easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
      easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
      spring: 'cubic-bezier(0.5, 1.5, 0.5, 1)',
    },
  },

  // Component Sizes
  components: {
    button: {
      height: 44, // iOS minimum touch target
      heightLarge: 50,
      heightSmall: 36,
      paddingHorizontal: 16,
      borderRadius: 10,
    },
    input: {
      height: 44,
      paddingHorizontal: 12,
      borderRadius: 10,
    },
    card: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
    },
    navigationBar: {
      height: 44,
      largeTitleHeight: 96,
    },
    tabBar: {
      height: 49,
    },
  },

  // iOS Specific
  blur: {
    light: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(0, 0, 0, 0.7)',
    ultraThin: 'rgba(255, 255, 255, 0.3)',
  },
};

export type iOSHIGType = typeof iOSHIG;
