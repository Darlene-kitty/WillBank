import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface PremiumHeaderProps {
  title: string;
  onBack: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  gradient?: string[];
}

export function PremiumHeader({ 
  title, 
  onBack, 
  rightIcon, 
  onRightPress,
  gradient = ['#0066FF', '#0052CC']
}: PremiumHeaderProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  return (
    <LinearGradient
      colors={gradient as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Animated.View style={[styles.header, animatedStyle]}>
        <Pressable 
          onPress={onBack}
          style={({ pressed }) => [
            styles.iconButton,
            { opacity: pressed ? 0.6 : 1 }
          ]}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </Pressable>
        
        <Text style={styles.title}>{title}</Text>
        
        {rightIcon ? (
          <Pressable 
            onPress={onRightPress}
            style={({ pressed }) => [
              styles.iconButton,
              { opacity: pressed ? 0.6 : 1 }
            ]}
          >
            <Ionicons name={rightIcon} size={24} color="#fff" />
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
});
