import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/contexts/theme-context';
import { PremiumIcon } from './premium-icon';

interface PremiumStatProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  colors?: string[];
  variant?: 'horizontal' | 'vertical';
  style?: ViewStyle;
  delay?: number;
}

/**
 * 📈 PremiumStat - Composant statistique premium
 * 
 * Features:
 * - Icône avec container coloré
 * - Label et valeur
 * - Indicateur de tendance (up/down/neutral)
 * - Layouts: horizontal ou vertical
 * - Entrance animation
 */
export function PremiumStat({
  icon,
  label,
  value,
  trend,
  trendValue,
  colors = ['#0066FF', '#0052CC'],
  variant = 'vertical',
  style,
  delay = 0,
}: PremiumStatProps) {
  const { colors: themeColors } = useTheme();

  const trendConfig = {
    up: { icon: 'trending-up' as const, color: '#34C759' },
    down: { icon: 'trending-down' as const, color: '#FF3B30' },
    neutral: { icon: 'remove' as const, color: themeColors.textSecondary },
  };

  if (variant === 'horizontal') {
    return (
      <Animated.View 
        entering={FadeInDown.delay(delay).duration(400).springify()}
        style={[styles.horizontalContainer, style]}
      >
        <PremiumIcon 
          name={icon} 
          size={48} 
          iconSize={24} 
          colors={colors}
          shape="rounded"
        />
        <View style={styles.horizontalContent}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>
            {label}
          </Text>
          <View style={styles.valueRow}>
            <Text style={[styles.value, { color: themeColors.text }]}>
              {value}
            </Text>
            {trend && trendValue && (
              <View style={styles.trendContainer}>
                <Ionicons 
                  name={trendConfig[trend].icon} 
                  size={14} 
                  color={trendConfig[trend].color} 
                />
                <Text style={[styles.trendValue, { color: trendConfig[trend].color }]}>
                  {trendValue}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).duration(400).springify()}
      style={[styles.verticalContainer, style]}
    >
      <PremiumIcon 
        name={icon} 
        size={56} 
        iconSize={28} 
        colors={colors}
        shape="rounded"
      />
      <Text style={[styles.label, { color: themeColors.textSecondary, marginTop: 12 }]}>
        {label}
      </Text>
      <Text style={[styles.value, { color: themeColors.text, marginTop: 4 }]}>
        {value}
      </Text>
      {trend && trendValue && (
        <View style={[styles.trendContainer, { marginTop: 8 }]}>
          <Ionicons 
            name={trendConfig[trend].icon} 
            size={14} 
            color={trendConfig[trend].color} 
          />
          <Text style={[styles.trendValue, { color: trendConfig[trend].color }]}>
            {trendValue}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  horizontalContent: {
    flex: 1,
  },
  verticalContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendValue: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
