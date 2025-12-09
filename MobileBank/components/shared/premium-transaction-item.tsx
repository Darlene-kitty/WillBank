import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/contexts/theme-context';
import { PremiumIcon } from './premium-icon';

interface PremiumTransactionItemProps {
  name: string;
  category: string;
  date: string;
  amount: number;
  icon: keyof typeof Ionicons.glyphMap;
  iconColors?: string[];
  onPress?: () => void;
  style?: ViewStyle;
  delay?: number;
}

/**
 * 💸 PremiumTransactionItem - Item de transaction premium
 * 
 * Features:
 * - Icône dans container coloré
 * - Nom, catégorie et date
 * - Montant avec couleur (vert/rouge)
 * - Animation au press
 * - Entrance animation
 */
export function PremiumTransactionItem({
  name,
  category,
  date,
  amount,
  icon,
  iconColors,
  onPress,
  style,
  delay = 0,
}: PremiumTransactionItemProps) {
  const { colors } = useTheme();
  
  const isPositive = amount > 0;
  const defaultIconColors = isPositive 
    ? ['#34C759', '#28A745'] 
    : [colors.primary, colors.primary];

  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).duration(400).springify()}
      style={style}
    >
      <Pressable 
        style={({ pressed }) => [
          styles.container,
          { 
            backgroundColor: colors.card,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          }
        ]}
        onPress={onPress}
      >
        <View style={styles.left}>
          <PremiumIcon
            name={icon}
            size={48}
            iconSize={24}
            colors={iconColors || defaultIconColors}
            backgroundColor={isPositive ? '#34C75915' : colors.backgroundSecondary}
            shape="rounded"
          />
          <View style={styles.info}>
            <Text style={[styles.name, { color: colors.text }]}>
              {name}
            </Text>
            <View style={styles.meta}>
              <Text style={[styles.category, { color: colors.textSecondary }]}>
                {category}
              </Text>
              <Text style={[styles.dot, { color: colors.textSecondary }]}> • </Text>
              <Text style={[styles.date, { color: colors.textSecondary }]}>
                {date}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={[
          styles.amount,
          { color: isPositive ? '#34C759' : colors.text }
        ]}>
          {isPositive ? '+' : ''}{amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 13,
    fontWeight: '500',
  },
  dot: {
    fontSize: 13,
    fontWeight: '500',
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
