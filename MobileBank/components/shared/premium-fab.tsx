import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumFABProps {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  colors?: string[];
  size?: number;
  iconSize?: number;
  badge?: number;
  delay?: number;
}

/**
 * 🎯 PremiumFAB - Floating Action Button premium
 * 
 * Features:
 * - Gradient personnalisable
 * - Animation scale au press
 * - Badge optionnel pour notifications
 * - Ombre colorée premium
 * - Entrance animation
 */
export function PremiumFAB({ 
  onPress, 
  icon,
  colors = ['#0066FF', '#0052CC'],
  size = 64,
  iconSize = 32,
  badge,
  delay = 0,
}: PremiumFABProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 200 }) }],
  }));

  const handlePressIn = () => {
    scale.value = 0.92;
  };

  const handlePressOut = () => {
    scale.value = 1;
  };

  return (
    <Animated.View 
      entering={FadeIn.delay(delay).duration(400).springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={colors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.fab, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2,
            }
          ]}
        >
          <Ionicons name={icon} size={iconSize} color="#fff" />
        </LinearGradient>
        
        {badge !== undefined && badge > 0 && (
          <View style={styles.badge}>
            <LinearGradient
              colors={['#FF3B30', '#FF1F1F']}
              style={styles.badgeGradient}
            >
              <Animated.Text style={styles.badgeText}>
                {badge > 99 ? '99+' : badge}
              </Animated.Text>
            </LinearGradient>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
