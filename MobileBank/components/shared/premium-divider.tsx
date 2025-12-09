import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/contexts/theme-context';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumDividerProps {
  text?: string;
  variant?: 'solid' | 'gradient' | 'dashed';
  colors?: string[];
  thickness?: number;
  spacing?: number;
  style?: ViewStyle;
  delay?: number;
}

/**
 * ➖ PremiumDivider - Séparateur premium
 * 
 * Features:
 * - Variants: solid, gradient, dashed
 * - Texte optionnel au centre
 * - Gradient personnalisable
 * - Épaisseur et espacement configurables
 * - Entrance animation
 */
export function PremiumDivider({
  text,
  variant = 'solid',
  colors = ['#0066FF', '#0052CC'],
  thickness = 1,
  spacing = 24,
  style,
  delay = 0,
}: PremiumDividerProps) {
  const { colors: themeColors } = useTheme();

  if (text) {
    return (
      <Animated.View 
        entering={FadeIn.delay(delay).duration(400)}
        style={[styles.container, { marginVertical: spacing }, style]}
      >
        <View style={[styles.line, { height: thickness, backgroundColor: themeColors.border }]} />
        <Text style={[styles.text, { color: themeColors.textSecondary }]}>{text}</Text>
        <View style={[styles.line, { height: thickness, backgroundColor: themeColors.border }]} />
      </Animated.View>
    );
  }

  if (variant === 'gradient') {
    return (
      <Animated.View 
        entering={FadeIn.delay(delay).duration(400)}
        style={[styles.fullWidth, { marginVertical: spacing }, style]}
      >
        <LinearGradient
          colors={colors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradientLine, { height: thickness }]}
        />
      </Animated.View>
    );
  }

  if (variant === 'dashed') {
    return (
      <Animated.View 
        entering={FadeIn.delay(delay).duration(400)}
        style={[styles.dashedContainer, { marginVertical: spacing }, style]}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <View 
            key={index}
            style={[
              styles.dash,
              { 
                height: thickness,
                backgroundColor: themeColors.border,
              }
            ]} 
          />
        ))}
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      entering={FadeIn.delay(delay).duration(400)}
      style={[
        styles.solidLine,
        { 
          height: thickness,
          backgroundColor: themeColors.border,
          marginVertical: spacing,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
  },
  text: {
    marginHorizontal: 16,
    fontSize: 13,
    fontWeight: '500',
  },
  fullWidth: {
    width: '100%',
  },
  gradientLine: {
    width: '100%',
    borderRadius: 2,
  },
  solidLine: {
    width: '100%',
  },
  dashedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dash: {
    width: 8,
    borderRadius: 2,
  },
});
