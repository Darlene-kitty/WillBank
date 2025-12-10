import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export function AnimatedCard({ children, style }: AnimatedCardProps) {
  return (
    <Animated.View 
      entering={FadeInDown.duration(400).springify()}
      style={[styles.card, style]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
