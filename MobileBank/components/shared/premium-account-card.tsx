import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumAccountCardProps {
  name: string;
  number: string;
  balance: number;
  icon: keyof typeof Ionicons.glyphMap;
  colors?: string[];
  balanceVisible?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  delay?: number;
}

/**
 * 💳 PremiumAccountCard - Carte de compte bancaire premium
 * 
 * Features:
 * - Gradient personnalisable
 * - Icône glassmorphism
 * - Nom, numéro et solde
 * - Masquage du solde optionnel
 * - Animation au press
 * - Entrance animation
 */
export function PremiumAccountCard({
  name,
  number,
  balance,
  icon,
  colors = ['#0066FF', '#0052CC'],
  balanceVisible = true,
  onPress,
  style,
  delay = 0,
}: PremiumAccountCardProps) {
  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).duration(400).springify()}
      style={style}
    >
      <Pressable 
        style={({ pressed }) => [
          styles.container,
          { 
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          }
        ]}
        onPress={onPress}
      >
        <LinearGradient
          colors={colors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={24} color="#fff" />
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
          </View>
          
          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.number}>{number}</Text>
          </View>
          
          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.balance}>
              {balanceVisible 
                ? `${balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
                : '••••••'
              }
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  number: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
  },
  balance: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.8,
  },
});
