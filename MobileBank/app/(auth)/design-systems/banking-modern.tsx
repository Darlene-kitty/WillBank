import { useTheme } from '@/contexts/theme-context';
import { BankingModern } from '@/constants/design-systems/banking-modern';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

/**
 * 💳 BANKING MODERN (Revolut/N26 Style)
 * 
 * Caractéristiques :
 * - Glassmorphism (cartes translucides)
 * - Gradients premium
 * - Animations fluides et premium
 * - Micro-interactions
 * - Coins arrondis généreux (16-24px)
 * - Ombres colorées
 * - Espacements aérés
 * - Typographie moderne
 */

export default function LoginBankingModernScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Premium animation values
  const buttonScale = useSharedValue(1);
  const buttonRotate = useSharedValue(0);
  const cardScale = useSharedValue(0.95);
  const cardOpacity = useSharedValue(0);

  React.useEffect(() => {
    // Entrance animation
    cardScale.value = withSpring(1, BankingModern.animation.spring);
    cardOpacity.value = withTiming(1, { duration: BankingModern.animation.duration.slow });
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    buttonRotate.value = withSpring(360, BankingModern.animation.spring);
    setTimeout(() => {
      setIsLoading(false);
      buttonRotate.value = 0;
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

  // Premium animated styles
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(buttonScale.value, BankingModern.animation.spring) },
      { rotate: `${buttonRotate.value}deg` },
    ],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Premium Gradient Header */}
      <LinearGradient
        colors={BankingModern.gradients.ocean as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {/* Premium Logo */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)'] as any}
              style={styles.logoGradient}
            >
              <Ionicons name="diamond" size={32} color="#fff" />
            </LinearGradient>
          </View>
          
          <Text style={styles.brandName}>WillBank</Text>
          <Text style={styles.brandTagline}>Premium Banking Experience</Text>
        </View>

        {/* Decorative circles */}
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Glassmorphism Card */}
        <Animated.View style={[styles.glassCard, { backgroundColor: colors.card }, cardAnimatedStyle]}>
          {/* Title with gradient */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign in to access your premium account
            </Text>
          </View>

          {/* Premium Input - Email */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={[styles.inputIconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="mail" size={18} color={colors.primary} />
              </View>
              <View style={styles.inputContent}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email Address</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>
          </View>

          {/* Premium Input - Password */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={[styles.inputIconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="lock-closed" size={18} color={colors.primary} />
              </View>
              <View style={styles.inputContent}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Password</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                />
              </View>
              <Pressable 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </Pressable>
            </View>
          </View>

          {/* Forgot Password */}
          <Pressable style={styles.forgotButton}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>
              Forgot Password?
            </Text>
          </Pressable>

          {/* Premium Gradient Button */}
          <Animated.View style={buttonAnimatedStyle}>
            <Pressable 
              onPress={handleLogin}
              onPressIn={() => (buttonScale.value = 0.96)}
              onPressOut={() => (buttonScale.value = 1)}
              disabled={isLoading}
            >
              <LinearGradient
                colors={BankingModern.gradients.primary as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.primaryButton, { opacity: isLoading ? 0.7 : 1 }]}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Ionicons name="sync" size={20} color="#fff" />
                    <Text style={styles.primaryButtonText}>Signing in...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Sign In</Text>
                    <Ionicons name="arrow-forward-circle" size={24} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or continue with</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Biometric Button with gradient border */}
          <Pressable 
            style={[styles.biometricButton, { backgroundColor: colors.backgroundSecondary }]}
            onPress={handleBiometric}
          >
            <LinearGradient
              colors={BankingModern.gradients.premium as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.biometricGradient}
            >
              <View style={[styles.biometricContent, { backgroundColor: colors.backgroundSecondary }]}>
                <Ionicons name="finger-print" size={28} color={colors.primary} />
                <Text style={[styles.biometricText, { color: colors.text }]}>
                  Biometric Authentication
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: colors.textSecondary }]}>
              New to WillBank? 
            </Text>
            <Pressable onPress={() => router.push('/register')}>
              <LinearGradient
                colors={BankingModern.gradients.premium as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.registerLinkGradient}
              >
                <Text style={styles.registerLink}> Create Account</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Premium Badge */}
          <View style={styles.premiumBadge}>
            <LinearGradient
              colors={BankingModern.gradients.premium as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badgeGradient}
            >
              <Ionicons name="shield-checkmark" size={14} color="#fff" />
              <Text style={styles.badgeText}>Banking Modern Design System</Text>
            </LinearGradient>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Premium Header
  header: {
    height: 300,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: BankingModern.spacing.lg,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: BankingModern.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...BankingModern.shadows.lg,
  },
  brandName: {
    ...BankingModern.typography.displaySmall,
    color: '#fff',
    marginBottom: BankingModern.spacing.xs,
  },
  brandTagline: {
    ...BankingModern.typography.bodyMedium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  decorCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorCircle1: {
    top: -50,
    right: -50,
  },
  decorCircle2: {
    bottom: -80,
    left: -80,
  },
  content: {
    flex: 1,
    marginTop: -BankingModern.spacing.huge,
  },
  // Glassmorphism Card
  glassCard: {
    flex: 1,
    borderTopLeftRadius: BankingModern.radius.xxl,
    borderTopRightRadius: BankingModern.radius.xxl,
    paddingHorizontal: BankingModern.spacing.xl,
    paddingTop: BankingModern.spacing.xxxl,
    ...BankingModern.shadows.xl,
  },
  titleSection: {
    marginBottom: BankingModern.spacing.xxxl,
  },
  title: {
    ...BankingModern.typography.headingLarge,
    marginBottom: BankingModern.spacing.sm,
  },
  subtitle: {
    ...BankingModern.typography.bodyMedium,
    lineHeight: 24,
  },
  // Premium Inputs
  inputContainer: {
    marginBottom: BankingModern.spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BankingModern.components.input.borderRadius,
    paddingHorizontal: BankingModern.spacing.md,
    paddingVertical: BankingModern.spacing.sm,
    ...BankingModern.shadows.sm,
  },
  inputIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BankingModern.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContent: {
    flex: 1,
    marginLeft: BankingModern.spacing.md,
  },
  inputLabel: {
    ...BankingModern.typography.caption,
    marginBottom: 2,
  },
  input: {
    ...BankingModern.typography.bodyMedium,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: BankingModern.spacing.sm,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    paddingVertical: BankingModern.spacing.sm,
    marginBottom: BankingModern.spacing.xl,
  },
  forgotText: {
    ...BankingModern.typography.bodySmall,
    fontWeight: '600',
  },
  // Premium Buttons
  primaryButton: {
    height: BankingModern.components.button.height,
    borderRadius: BankingModern.components.button.borderRadius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: BankingModern.spacing.sm,
    ...BankingModern.shadows.colored,
  },
  primaryButtonText: {
    ...BankingModern.typography.button,
    color: '#fff',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BankingModern.spacing.sm,
  },
  biometricButton: {
    borderRadius: BankingModern.components.button.borderRadius,
    overflow: 'hidden',
  },
  biometricGradient: {
    padding: 2,
  },
  biometricContent: {
    height: BankingModern.components.button.heightSmall,
    borderRadius: BankingModern.components.button.borderRadius - 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: BankingModern.spacing.md,
  },
  biometricText: {
    ...BankingModern.typography.button,
  },
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: BankingModern.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    ...BankingModern.typography.bodySmall,
    marginHorizontal: BankingModern.spacing.md,
  },
  // Register
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: BankingModern.spacing.xl,
  },
  registerText: {
    ...BankingModern.typography.bodyMedium,
  },
  registerLinkGradient: {
    borderRadius: BankingModern.radius.sm,
  },
  registerLink: {
    ...BankingModern.typography.bodyMedium,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: BankingModern.spacing.sm,
    paddingVertical: 2,
  },
  // Premium Badge
  premiumBadge: {
    marginTop: BankingModern.spacing.xl,
    marginBottom: BankingModern.spacing.xxl,
    alignSelf: 'center',
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BankingModern.spacing.xs,
    paddingHorizontal: BankingModern.spacing.md,
    paddingVertical: BankingModern.spacing.sm,
    borderRadius: BankingModern.radius.full,
  },
  badgeText: {
    ...BankingModern.typography.caption,
    color: '#fff',
    fontWeight: '600',
  },
});
