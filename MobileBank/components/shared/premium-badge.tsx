import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface PremiumBadgeProps {
  text: string | number;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  gradient?: boolean;
  style?: ViewStyle;
  delay?: number;
}

/**
 * 🏷️ PremiumBadge - Badge premium pour notifications et status
 * 
 * Features:
 * - Variants: primary, success, warning, error, info
 * - Tailles: small, medium, large
 * - Icône optionnelle
 * - Gradient optionnel
 * - Entrance animation
 */
export function PremiumBadge({
  text,
  variant = 'primary',
  size = 'medium',
  icon,
  gradient = false,
  style,
  delay = 0,
}: PremiumBadgeProps) {
  const variantColors = {
    primary: { colors: ['#0066FF', '#0052CC'], bg: '#E6F0FF', text: '#0066FF' },
    success: { colors: ['#34C759', '#28A745'], bg: '#E6FFF9', text: '#34C759' },
    warning: { colors: ['#FFB800', '#FF9500'], bg: '#FFF8E6', text: '#FFB800' },
    error: { colors: ['#FF3B30', '#FF1F1F'], bg: '#FFE6E6', text: '#FF3B30' },
    info: { colors: ['#667EEA', '#764BA2'], bg: '#F0F2FF', text: '#667EEA' },
  };

  const sizeStyles = {
    small: { paddingH: 8, paddingV: 4, fontSize: 10, iconSize: 12, borderRadius: 8 },
    medium: { paddingH: 12, paddingV: 6, fontSize: 12, iconSize: 14, borderRadius: 12 },
    large: { paddingH: 16, paddingV: 8, fontSize: 14, iconSize: 16, borderRadius: 16 },
  };

  const config = variantColors[variant];
  const sizeConfig = sizeStyles[size];

  if (gradient) {
    return (
      <Animated.View 
        entering={FadeIn.delay(delay).duration(400)}
        style={[styles.container, style]}
      >
        <LinearGradient
          colors={config.colors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradient,
            {
              paddingHorizontal: sizeConfig.paddingH,
              paddingVertical: sizeConfig.paddingV,
              borderRadius: sizeConfig.borderRadius,
            }
          ]}
        >
          {icon && (
            <Ionicons name={icon} size={sizeConfig.iconSize} color="#fff" style={styles.icon} />
          )}
          <Text style={[styles.text, { fontSize: sizeConfig.fontSize, color: '#fff' }]}>
            {text}
          </Text>
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      entering={FadeIn.delay(delay).duration(400)}
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          paddingHorizontal: sizeConfig.paddingH,
          paddingVertical: sizeConfig.paddingV,
          borderRadius: sizeConfig.borderRadius,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons name={icon} size={sizeConfig.iconSize} color={config.text} style={styles.icon} />
      )}
      <Text style={[styles.text, { fontSize: sizeConfig.fontSize, color: config.text }]}>
        {text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
