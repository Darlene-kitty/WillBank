import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumIconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  iconSize?: number;
  colors?: string[];
  backgroundColor?: string;
  shape?: 'circle' | 'rounded' | 'square';
  gradient?: boolean;
  style?: ViewStyle;
  delay?: number;
}

/**
 * 🎨 PremiumIcon - Icône dans container premium
 * 
 * Features:
 * - Container avec gradient ou couleur unie
 * - Formes: circle, rounded, square
 * - Tailles personnalisables
 * - Entrance animation
 * - Ombres premium
 */
export function PremiumIcon({
  name,
  size = 48,
  iconSize = 24,
  colors = ['#0066FF', '#0052CC'],
  backgroundColor,
  shape = 'rounded',
  gradient = false,
  style,
  delay = 0,
}: PremiumIconProps) {
  const borderRadius = 
    shape === 'circle' ? size / 2 :
    shape === 'rounded' ? size * 0.3 :
    size * 0.15;

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius,
    },
    style,
  ];

  if (gradient) {
    return (
      <Animated.View 
        entering={FadeIn.delay(delay).duration(400)}
        style={containerStyle}
      >
        <LinearGradient
          colors={colors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius }]}
        >
          <Ionicons name={name} size={iconSize} color="#fff" />
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      entering={FadeIn.delay(delay).duration(400)}
      style={[
        containerStyle,
        { backgroundColor: backgroundColor || colors[0] + '15' }
      ]}
    >
      <Ionicons name={name} size={iconSize} color={colors[0]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
