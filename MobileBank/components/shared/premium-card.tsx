import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  FadeInDown 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  gradient?: string[];
  delay?: number;
  onPress?: () => void;
  elevated?: boolean;
}

/**
 * 💎 PremiumCard - Carte premium avec animations et gradient optionnel
 * 
 * Features:
 * - Entrance animation (FadeInDown)
 * - Gradient optionnel
 * - Ombres premium
 * - Hover effect (scale)
 * - Hauteur personnalisable
 */
export function PremiumCard({ 
  children, 
  style, 
  gradient,
  delay = 0,
  onPress,
  elevated = true
}: PremiumCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 150 }) }],
  }));

  const handlePressIn = () => {
    if (onPress) scale.value = 0.98;
  };

  const handlePressOut = () => {
    if (onPress) scale.value = 1;
  };

  const cardStyle = [
    styles.card,
    elevated && styles.elevated,
    style
  ];

  if (gradient) {
    return (
      <Animated.View 
        entering={FadeInDown.delay(delay).duration(400).springify()}
        style={[animatedStyle, cardStyle]}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
      >
        <LinearGradient
          colors={gradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).duration(400).springify()}
      style={[animatedStyle, cardStyle]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  gradient: {
    flex: 1,
  },
});
