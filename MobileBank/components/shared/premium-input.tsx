import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/theme-context';

interface PremiumInputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

/**
 * 📝 PremiumInput - Input field premium avec animations
 * 
 * Features:
 * - Label flottant animé
 * - Icône gauche dans container coloré
 * - Icône droite optionnelle (ex: eye pour password)
 * - Animation de focus (border + scale)
 * - Message d'erreur
 * - Support dark mode
 */
export function PremiumInput({
  label,
  icon,
  error,
  rightIcon,
  onRightIconPress,
  value,
  ...props
}: PremiumInputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusValue = useSharedValue(0);

  const handleFocus = () => {
    setIsFocused(true);
    focusValue.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusValue.value = withSpring(0, { damping: 15, stiffness: 150 });
  };

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolate(
      focusValue.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ) === 1 ? colors.primary : colors.border,
    borderWidth: interpolate(
      focusValue.value,
      [0, 1],
      [1.5, 2],
      Extrapolation.CLAMP
    ),
  }));

  const iconContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolate(
      focusValue.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ) === 1 ? colors.primary + '20' : colors.primary + '15',
    transform: [{ 
      scale: interpolate(
        focusValue.value,
        [0, 1],
        [1, 1.05],
        Extrapolation.CLAMP
      )
    }],
  }));

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      
      <Animated.View 
        style={[
          styles.inputContainer,
          { backgroundColor: colors.backgroundSecondary },
          borderStyle,
        ]}
      >
        {icon && (
          <Animated.View style={[styles.iconContainer, iconContainerStyle]}>
            <Ionicons name={icon} size={18} color={colors.primary} />
          </Animated.View>
        )}
        
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {rightIcon && onRightIconPress && (
          <Animated.View style={styles.rightIconContainer}>
            <Ionicons 
              name={rightIcon} 
              size={20} 
              color={colors.textSecondary}
              onPress={onRightIconPress}
            />
          </Animated.View>
        )}
      </Animated.View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  rightIconContainer: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#FF3B30',
    fontWeight: '500',
  },
});
