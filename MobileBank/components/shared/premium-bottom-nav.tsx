import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/theme-context';
import { LinearGradient } from 'expo-linear-gradient';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface PremiumBottomNavProps {
  items: BottomNavItem[];
  activeId: string;
  style?: ViewStyle;
  variant?: 'default' | 'floating';
}

/**
 * 📱 PremiumBottomNav - Navigation bottom bar premium
 * 
 * Features:
 * - Animation scale au press
 * - Indicateur actif avec gradient
 * - Variants: default (fixe) ou floating (avec marge)
 * - Support dark mode
 * - Safe area pour iOS
 */
export function PremiumBottomNav({
  items,
  activeId,
  style,
  variant = 'default',
}: PremiumBottomNavProps) {
  const { colors } = useTheme();

  const containerStyle = [
    styles.container,
    variant === 'floating' && styles.floating,
    { 
      backgroundColor: colors.card,
      borderTopColor: variant === 'default' ? colors.border : 'transparent',
    },
    style,
  ];

  return (
    <Animated.View 
      entering={FadeInDown.duration(400).springify()}
      style={containerStyle}
    >
      {variant === 'floating' && (
        <View style={[styles.floatingBorder, { backgroundColor: colors.border }]} />
      )}
      
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={item.id === activeId}
            delay={index * 50}
          />
        ))}
      </View>
    </Animated.View>
  );
}

interface NavItemProps {
  item: BottomNavItem;
  isActive: boolean;
  delay: number;
}

function NavItem({ item, isActive, delay }: NavItemProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).duration(400).springify()}
      style={styles.navItem}
    >
      <Pressable
        onPress={item.onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.navButton}
      >
        <Animated.View style={animatedStyle}>
          {isActive ? (
            <LinearGradient
              colors={['#0066FF', '#0052CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.activeIconContainer}
            >
              <Ionicons name={item.icon} size={22} color="#fff" />
            </LinearGradient>
          ) : (
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={22} color={colors.textSecondary} />
            </View>
          )}
        </Animated.View>
        
        <Text 
          style={[
            styles.navText,
            { 
              color: isActive ? colors.primary : colors.textSecondary,
              fontWeight: isActive ? '600' : '500',
            }
          ]}
        >
          {item.label}
        </Text>
        
        {isActive && (
          <Animated.View 
            entering={FadeInDown.duration(300).springify()}
            style={styles.activeIndicator}
          >
            <LinearGradient
              colors={['#0066FF', '#0052CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.activeIndicatorGradient}
            />
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  floating: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    borderTopWidth: 0,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  floatingBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.3,
  },
  itemsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
  },
  navButton: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    position: 'relative',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  navText: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  activeIndicatorGradient: {
    flex: 1,
  },
});
