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
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumSuccessAnimationProps {
  size?: number;
  colors?: string[];
  delay?: number;
}

/**
 * ✅ PremiumSuccessAnimation - Animation de succès premium
 * 
 * Features:
 * - Animation scale + rotate du cercle
 * - Gradient personnalisable
 * - Animation du checkmark
 * - Effet de pulsation
 * - Délai personnalisable
 */
export function PremiumSuccessAnimation({ 
  size = 100,
  colors = ['#34C759', '#28A745'],
  delay = 0,
}: PremiumSuccessAnimationProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const rotate = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    // Circle animation
    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1.2, { damping: 8, stiffness: 150 }),
        withSpring(1, { damping: 10, stiffness: 180 })
      )
    );
    
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 300 })
    );
    
    rotate.value = withDelay(
      delay,
      withSequence(
        withTiming(360, { duration: 600 }),
        withTiming(0, { duration: 0 })
      )
    );

    // Checkmark animation
    checkScale.value = withDelay(
      delay + 300,
      withSequence(
        withSpring(1.3, { damping: 8 }),
        withSpring(1, { damping: 12 })
      )
    );

    // Pulse effect
    pulse.value = withDelay(
      delay + 600,
      withSequence(
        withSpring(1.1, { damping: 10 }),
        withSpring(1, { damping: 12 })
      )
    );
  }, [delay]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` }
    ],
    opacity: opacity.value,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(
      pulse.value,
      [1, 1.1],
      [0.3, 0],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <View style={styles.container}>
      {/* Pulse effect */}
      <Animated.View 
        style={[
          styles.pulse,
          pulseStyle,
          { 
            width: size * 1.4, 
            height: size * 1.4, 
            borderRadius: size * 0.7,
            backgroundColor: colors[0] + '40',
          }
        ]} 
      />
      
      {/* Main circle */}
      <Animated.View style={[circleStyle, { width: size, height: size }]}>
        <LinearGradient
          colors={colors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.circle, { borderRadius: size / 2 }]}
        >
          <Animated.View style={checkStyle}>
            <Ionicons name="checkmark" size={size * 0.5} color="#fff" />
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulse: {
    position: 'absolute',
  },
  circle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
});
