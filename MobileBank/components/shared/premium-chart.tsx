import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumChartProps {
  data: number[];
  colors?: string[];
  height?: number;
  barWidth?: number;
  gap?: number;
  delay?: number;
  showGradient?: boolean;
}

/**
 * 📊 PremiumChart - Graphique animé avec gradient
 * 
 * Features:
 * - Animations fluides avec spring
 * - Gradient optionnel sur les barres
 * - Délai d'animation personnalisable
 * - Hauteur minimale pour visibilité
 * - Responsive et flexible
 */
export function PremiumChart({ 
  data, 
  colors = ['#0066FF', '#0052CC'],
  height = 180,
  barWidth = 32,
  gap = 12,
  delay = 0,
  showGradient = true,
}: PremiumChartProps) {
  const maxValue = Math.max(...data);

  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).duration(400).springify()}
      style={[styles.container, { height }]}
    >
      {data.map((value, index) => (
        <ChartBar
          key={index}
          value={value}
          maxValue={maxValue}
          colors={colors}
          delay={index * 80}
          barWidth={barWidth}
          showGradient={showGradient}
        />
      ))}
    </Animated.View>
  );
}

interface ChartBarProps {
  value: number;
  maxValue: number;
  colors: string[];
  delay: number;
  barWidth: number;
  showGradient: boolean;
}

function ChartBar({ value, maxValue, colors, delay, barWidth, showGradient }: ChartBarProps) {
  const heightValue = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    heightValue.value = withDelay(
      delay,
      withSpring((value / maxValue) * 100, { damping: 15, stiffness: 150 })
    );
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 180 })
    );
  }, [value, maxValue, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: `${heightValue.value}%`,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.barContainer, { width: barWidth }]}>
      <Animated.View style={[styles.bar, animatedStyle]}>
        {showGradient ? (
          <LinearGradient
            colors={colors as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.barGradient}
          />
        ) : (
          <View style={[styles.barSolid, { backgroundColor: colors[0] }]} />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  barContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 12,
    minHeight: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  barGradient: {
    flex: 1,
    borderRadius: 12,
  },
  barSolid: {
    flex: 1,
    borderRadius: 12,
  },
});
