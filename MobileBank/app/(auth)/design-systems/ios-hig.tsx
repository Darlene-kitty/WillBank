import { useTheme } from '@/contexts/theme-context';
import { iOSHIG } from '@/constants/design-systems/ios-hig';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

/**
 * 🍎 iOS HUMAN INTERFACE GUIDELINES (Apple)
 * 
 * Caractéristiques :
 * - Navigation bar avec large title
 * - Blur effects (frosted glass)
 * - Spring animations naturelles
 * - Touch targets 44px minimum
 * - SF Pro typography
 * - Coins arrondis subtils (10-12px)
 * - Ombres légères
 * - Espacements flexibles
 */

export default function LoginIOSScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Spring animation values
  const buttonScale = useSharedValue(1);
  const biometricScale = useSharedValue(1);

  const handleLogin = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/' as any);
    }, 500);
  };

  const handleBiometric = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/' as any);
    }, 500);
  };

  // Animated button styles with spring
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(buttonScale.value, iOSHIG.animation.spring) }],
  }));

  const biometricAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(biometricScale.value, iOSHIG.animation.spring) }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* iOS Navigation Bar with Large Title */}
      <View style={[styles.navigationBar, { backgroundColor: colors.primary }]}>
        <View style={styles.navContent}>
          <View style={styles.logoRow}>
            <View style={styles.logoContainer}>
              <Ionicons name="wallet" size={28} color="#fff" />
            </View>
            <Text style={styles.brandName}>WillBank</Text>
          </View>
          <Text style={styles.largeTitle}>Connexion</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* iOS Card with subtle shadow */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Accédez à votre espace bancaire en toute sécurité
          </Text>

          {/* iOS Text Field - Email */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Email</Text>
            <View style={[styles.textField, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
              <Ionicons name="mail" size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={email}
                onChangeText={setEmail}
                placeholder="exemple@email.com"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* iOS Text Field - Password */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Mot de passe</Text>
            <View style={[styles.textField, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
              <Ionicons name="lock-closed" size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={18} 
                  color={colors.textSecondary} 
                />
              </Pressable>
            </View>
          </View>

          {/* iOS Link Button */}
          <Pressable style={styles.linkButton}>
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Mot de passe oublié ?
            </Text>
          </Pressable>

          {/* iOS Primary Button with spring animation */}
          <Animated.View style={buttonAnimatedStyle}>
            <Pressable 
              style={[styles.primaryButton, { backgroundColor: colors.primary, opacity: isLoading ? 0.6 : 1 }]}
              onPress={handleLogin}
              onPressIn={() => (buttonScale.value = 0.96)}
              onPressOut={() => (buttonScale.value = 1)}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>ou</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* iOS Secondary Button - Biometric */}
          <Animated.View style={biometricAnimatedStyle}>
            <Pressable 
              style={[styles.secondaryButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
              onPress={handleBiometric}
              onPressIn={() => (biometricScale.value = 0.96)}
              onPressOut={() => (biometricScale.value = 1)}
            >
              <Ionicons name="finger-print" size={22} color={colors.primary} />
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                Face ID / Touch ID
              </Text>
            </Pressable>
          </Animated.View>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
              Nouveau sur WillBank ? 
            </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={[styles.linkText, { color: colors.primary }]}> Créer un compte</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // iOS Navigation Bar
  navigationBar: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: iOSHIG.spacing.lg,
  },
  navContent: {
    gap: iOSHIG.spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: iOSHIG.spacing.sm,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: iOSHIG.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    ...iOSHIG.typography.headline,
    color: '#fff',
  },
  largeTitle: {
    ...iOSHIG.typography.largeTitle,
    color: '#fff',
  },
  content: {
    flex: 1,
    marginTop: -iOSHIG.spacing.lg,
  },
  // iOS Card
  card: {
    flex: 1,
    borderTopLeftRadius: iOSHIG.radius.xxl,
    borderTopRightRadius: iOSHIG.radius.xxl,
    paddingHorizontal: iOSHIG.spacing.lg,
    paddingTop: iOSHIG.spacing.xl,
    ...iOSHIG.shadows.md,
  },
  subtitle: {
    ...iOSHIG.typography.subheadline,
    marginBottom: iOSHIG.spacing.xl,
    lineHeight: 20,
  },
  // iOS Text Fields
  fieldContainer: {
    marginBottom: iOSHIG.spacing.lg,
  },
  fieldLabel: {
    ...iOSHIG.typography.footnote,
    fontWeight: '600',
    marginBottom: iOSHIG.spacing.sm,
  },
  textField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: iOSHIG.components.input.height,
    paddingHorizontal: iOSHIG.components.input.paddingHorizontal,
    borderRadius: iOSHIG.components.input.borderRadius,
    borderWidth: 1,
    gap: iOSHIG.spacing.sm,
  },
  input: {
    flex: 1,
    ...iOSHIG.typography.body,
  },
  // iOS Buttons
  linkButton: {
    alignSelf: 'flex-end',
    paddingVertical: iOSHIG.spacing.sm,
    marginBottom: iOSHIG.spacing.lg,
  },
  linkText: {
    ...iOSHIG.typography.subheadline,
    fontWeight: '600',
  },
  primaryButton: {
    height: iOSHIG.components.button.height,
    borderRadius: iOSHIG.components.button.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    ...iOSHIG.shadows.sm,
  },
  primaryButtonText: {
    ...iOSHIG.typography.headline,
    color: '#fff',
  },
  secondaryButton: {
    height: iOSHIG.components.button.height,
    borderRadius: iOSHIG.components.button.borderRadius,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: iOSHIG.spacing.sm,
  },
  secondaryButtonText: {
    ...iOSHIG.typography.headline,
  },
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: iOSHIG.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
  },
  dividerText: {
    ...iOSHIG.typography.footnote,
    marginHorizontal: iOSHIG.spacing.md,
  },
  // Register
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: iOSHIG.spacing.xl,
    paddingBottom: iOSHIG.spacing.xxxl,
  },
  bodyText: {
    ...iOSHIG.typography.body,
  },
});
