/**
 * 🐜 ANT DESIGN MOBILE (Alibaba)
 * Design System Tokens
 * 
 * Référence: https://mobile.ant.design/
 */

export const AntMobile = {
  // Spacing (Ant uses 8px grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Typography
  typography: {
    heading1: {
      fontSize: 38,
      lineHeight: 48,
      fontWeight: '600' as const,
    },
    heading2: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '600' as const,
    },
    heading3: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600' as const,
    },
    heading4: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600' as const,
    },
    heading5: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600' as const,
    },
    paragraph: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
    },
    paragraphSmall: {
      fontSize: 14,
      lineHeight: 22,
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '400' as const,
    },
    button: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '500' as const,
    },
  },

  // Border Radius
  radius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  // Shadows
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
      shadowOpacity: 0.04,
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

  // Animation
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 450,
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Component Sizes
  components: {
    button: {
      height: 47,
      heightLarge: 54,
      heightSmall: 40,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    input: {
      height: 47,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    card: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
    },
    list: {
      itemHeight: 47,
      itemPaddingHorizontal: 16,
    },
  },

  // Ant Specific
  colors: {
    // Primary colors
    primary: '#1677FF',
    primaryLight: '#E6F4FF',
    primaryDark: '#0958D9',
    
    // Success
    success: '#52C41A',
    successLight: '#F6FFED',
    
    // Warning
    warning: '#FAAD14',
    warningLight: '#FFFBE6',
    
    // Error
    error: '#FF4D4F',
    errorLight: '#FFF2F0',
    
    // Info
    info: '#1677FF',
    infoLight: '#E6F4FF',
  },

  // Border
  border: {
    width: 1,
    color: '#D9D9D9',
    style: 'solid',
  },
};

export type AntMobileType = typeof AntMobile;
