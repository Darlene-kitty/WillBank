import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface PremiumButtonProps {
  title: string;
  onPress: () => void;
  gradient?: string[];
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function PremiumButton({ 
  title, 
  onPress, 
  gradient,
  icon,
  disabled = false,
  variant = 'primary'
}: PremiumButtonProps) {
  const scale = useSharedValue(1);

  const defaultGradients = {
    primary: ['#0066FF', '#0052CC'],
    secondary: ['#667EEA', '#764BA2'],
    danger: ['#FF3B30', '#CC2E26'],
  };

  const colors = gradient || defaultGradients[variant];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = 0.96)}
        onPressOut={() => (scale.value = 1)}
        disabled={disabled}
        style={({ pressed }) => [
          { opacity: disabled ? 0.5 : pressed ? 0.9 : 1 }
        ]}
      >
        <LinearGradient
          colors={colors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          {icon && <Ionicons name={icon} size={24} color="#fff" />}
          <Text style={styles.text}>{title}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  text: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
