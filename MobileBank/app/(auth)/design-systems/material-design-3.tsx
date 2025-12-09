import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

/**
 * 🎨 MATERIAL DESIGN 3 (Google)
 * 
 * Caractéristiques :
 * - Surface containers avec élévations
 * - Filled buttons avec états
 * - Text fields avec labels flottants
 * - Coins arrondis 16-20px
 * - Ombres douces et progressives
 * - Animations de ripple
 * - Espacements système 8dp (8, 16, 24, 32)
 */

export default function LoginMD3Screen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation states
  const emailFocused = useSharedValue(0);
  const passwordFocused = useSharedValue(0);

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

  // Animated styles for floating labels
  const emailLabelStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withSpring(emailFocused.value || email ? -24 : 0) },
      { scale: withSpring(emailFocused.value || email ? 0.85 : 1) },
    ],
  }));

  const passwordLabelStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withSpring(passwordFocused.value || password ? -24 : 0) },
      { scale: withSpring(passwordFocused.value || password ? 0.85 : 1) },
    ],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* MD3 Top App Bar */}
      <View style={[styles.topAppBar, { backgroundColor: colors.primary }]}>
        <View style={styles.topAppBarContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="wallet" size={32} color="#fff" />
          </View>
          <Text style={styles.brandName}>WillBank</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* MD3 Surface Container */}
        <View style={[styles.surfaceContainer, { backgroundColor: colors.card }]}>
          {/* Headline */}
          <Text style={[styles.headline, { color: colors.text }]}>Connexion</Text>
          <Text style={[styles.bodyLarge, { color: colors.textSecondary }]}>
            Accédez à votre espace bancaire
          </Text>

          {/* MD3 Filled Text Field - Email */}
          <View style={styles.textFieldContainer}>
            <View style={[styles.textField, { backgroundColor: colors.backgroundSecondary }]}>
              <Animated.Text 
                style={[
                  styles.floatingLabel, 
                  { color: emailFocused.value ? colors.primary : colors.textSecondary },
                  emailLabelStyle
                ]}
              >
                Email
              </Animated.Text>
              <View style={styles.textFieldContent}>
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => (emailFocused.value = 1)}
                  onBlur={() => (emailFocused.value = 0)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              <View style={[styles.indicator, { backgroundColor: emailFocused.value ? colors.primary : colors.border }]} />
            </View>
          </View>

          {/* MD3 Filled Text Field - Password */}
          <View style={styles.textFieldContainer}>
            <View style={[styles.textField, { backgroundColor: colors.backgroundSecondary }]}>
              <Animated.Text 
                style={[
                  styles.floatingLabel, 
                  { color: passwordFocused.value ? colors.primary : colors.textSecondary },
                  passwordLabelStyle
                ]}
              >
                Mot de passe
              </Animated.Text>
              <View style={styles.textFieldContent}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => (passwordFocused.value = 1)}
                  onBlur={() => (passwordFocused.value = 0)}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </Pressable>
              </View>
              <View style={[styles.indicator, { backgroundColor: passwordFocused.value ? colors.primary : colors.border }]} />
            </View>
          </View>

          {/* MD3 Text Button - Forgot Password */}
          <Pressable style={styles.textButton}>
            <Text style={[styles.textButtonLabel, { color: colors.primary }]}>
              Mot de passe oublié ?
            </Text>
          </Pressable>

          {/* MD3 Filled Button - Login */}
          <Pressable 
            style={[styles.filledButton, { backgroundColor: colors.primary, opacity: isLoading ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.filledButtonLabel}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>ou</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* MD3 Outlined Button - Biometric */}
          <Pressable 
            style={[styles.outlinedButton, { borderColor: colors.border }]}
            onPress={handleBiometric}
          >
            <Ionicons name="finger-print" size={20} color={colors.primary} />
            <Text style={[styles.outlinedButtonLabel, { color: colors.text }]}>
              Connexion biométrique
            </Text>
          </Pressable>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={[styles.bodyMedium, { color: colors.textSecondary }]}>
              Pas encore de compte ? 
            </Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text style={[styles.labelLarge, { color: colors.primary }]}> Créer un compte</Text>
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
  // MD3 Top App Bar
  topAppBar: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  topAppBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    marginTop: -16,
  },
  // MD3 Surface Container (Elevation 1)
  surfaceContainer: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  // MD3 Typography
  headline: {
    fontSize: 32,
    fontWeight: '400',
    marginBottom: 8,
    letterSpacing: 0,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  // MD3 Filled Text Field
  textFieldContainer: {
    marginBottom: 16,
  },
  textField: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
    position: 'relative',
  },
  floatingLabel: {
    fontSize: 16,
    position: 'absolute',
    top: 20,
    left: 48,
    transformOrigin: 'left',
  },
  textFieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    letterSpacing: 0.5,
  },
  indicator: {
    height: 2,
    marginTop: 4,
  },
  // MD3 Buttons
  filledButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  filledButtonLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
    textTransform: 'uppercase',
  },
  outlinedButton: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  outlinedButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  textButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  textButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    letterSpacing: 0.25,
  },
  // Register
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingBottom: 32,
  },
});
