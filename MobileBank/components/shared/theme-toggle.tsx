import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ThemeToggleProps {
  style?: ViewStyle;
  variant?: 'default' | 'compact';
}

/**
 * 🌓 ThemeToggle - Toggle premium pour dark/light mode
 * 
 * Features:
 * - Animation fluide du toggle
 * - Icônes soleil/lune
 * - Gradient sur le thumb
 * - Variants: default (avec label) ou compact
 * - Support dark mode
 */
export function ThemeToggle({ style, variant = 'default' }: ThemeToggleProps) {
  const { colorScheme, toggleTheme, colors } = useTheme();
  const isDark = colorScheme === 'dark';
  const toggleValue = useSharedValue(isDark ? 1 : 0);

  const handleToggle = () => {
    toggleValue.value = withSpring(isDark ? 0 : 1, { damping: 15, stiffness: 150 });
    toggleTheme();
  };

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        translateX: interpolate(
          toggleValue.value,
          [0, 1],
          [2, 34],
          Extrapolation.CLAMP
        )
      }
    ],
  }));

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolate(
      toggleValue.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ) === 1 ? colors.primary : '#E5E5EA',
  }));

  if (variant === 'compact') {
    return (
      <Pressable onPress={handleToggle} style={style}>
        <Animated.View style={[styles.track, trackStyle]}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <LinearGradient
              colors={isDark ? ['#667EEA', '#764BA2'] : ['#FFB800', '#FF9500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.thumbGradient}
            >
              <Ionicons 
                name={isDark ? 'moon' : 'sunny'} 
                size={16} 
                color="#fff" 
              />
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelContainer}>
        <Ionicons 
          name={isDark ? 'moon' : 'sunny'} 
          size={20} 
          color={colors.text} 
        />
        <Text style={[styles.label, { color: colors.text }]}>
          {isDark ? 'Mode Sombre' : 'Mode Clair'}
        </Text>
      </View>
      
      <Pressable onPress={handleToggle}>
        <Animated.View style={[styles.track, trackStyle]}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <LinearGradient
              colors={isDark ? ['#667EEA', '#764BA2'] : ['#FFB800', '#FF9500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.thumbGradient}
            >
              <Ionicons 
                name={isDark ? 'moon' : 'sunny'} 
                size={16} 
                color="#fff" 
              />
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  track: {
    width: 64,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  thumbGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
