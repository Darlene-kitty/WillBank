import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedSuccessIconProps {
  size?: number;
  color?: string;
}

export function AnimatedSuccessIcon({ size = 80, color = '#34C759' }: AnimatedSuccessIconProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      100,
      withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 10 })
      )
    );
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.circle, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]}>
        <Ionicons name="checkmark" size={size * 0.6} color="#fff" />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
