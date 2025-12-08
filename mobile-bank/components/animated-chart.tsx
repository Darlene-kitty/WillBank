import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export function AnimatedChart({ data, color = '#3B9EFF', height = 150 }: AnimatedChartProps) {
  const maxValue = Math.max(...data);

  return (
    <View style={[styles.container, { height }]}>
      {data.map((value, index) => (
        <ChartBar
          key={index}
          value={value}
          maxValue={maxValue}
          color={color}
          delay={index * 50}
        />
      ))}
    </View>
  );
}

interface ChartBarProps {
  value: number;
  maxValue: number;
  color: string;
  delay: number;
}

function ChartBar({ value, maxValue, color, delay }: ChartBarProps) {
  const heightValue = useSharedValue(0);

  useEffect(() => {
    heightValue.value = withDelay(
      delay,
      withTiming((value / maxValue) * 100, { duration: 800 })
    );
  }, [value, maxValue, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: `${heightValue.value}%`,
  }));

  return (
    <View style={styles.barContainer}>
      <Animated.View style={[styles.bar, { backgroundColor: color }, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  barContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
});
