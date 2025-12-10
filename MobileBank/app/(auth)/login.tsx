import { useTheme } from '@/contexts/theme-context';
import { useAuthContext } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  withSequence,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login, isAuthenticated } = useAuthContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Animation values
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);
  const cardOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const emailFocused = useSharedValue(0);
  const passwordFocused = useSharedValue(0);

  // Entrance animations
  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    logoRotate.value = withSequence(
      withTiming(360, { duration: 800 }),
      withTiming(0, { duration: 0 })
    );
    cardTranslateY.value = withSpring(0, { damping: 20, stiffness: 150 });
    cardOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  // Redirection si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/' as any);
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!email.includes('@')) {
      setError('Email invalide');
      return;
    }

    setIsLoading(true);
    setError('');
    buttonScale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );

    try {
      await login(email, password);
      // La redirection se fera automatiquement via le useEffect ci-dessus
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Identifiants incorrects';
      setError(errorMessage);
      Alert.alert('Erreur de connexion', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometric = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/' as any);
    }, 500);
  };

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` }
    ],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
    opacity: cardOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const emailBorderStyle = useAnimatedStyle(() => ({
    borderColor: interpolate(
      emailFocused.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    ) === 1 ? colors.primary : colors.border,
    borderWidth: interpolate(
      emailFocused.value,
      [0, 1],
      [1.5, 2],
      Extrapolate.CLAMP
    ),
  }));

  const passwordBorderStyle = useAnimatedStyle(() => ({
    borderColor: interpolate(
      passwordFocused.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    ) === 1 ? colors.primary : colors.border,
    borderWidth: interpolate(
      passwordFocused.value,
      [0, 1],
      [1.5, 2],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Premium Gradient Header */}
      <LinearGradient
        colors={['#0066FF', '#0052CC', '#003D99']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Decorative circles */}
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />
        
        <View style={styles.headerContent}>
          {/* Animated Logo */}
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.logoGradient}
            >
              <Ionicons name="diamond" size={40} color="#fff" />
            </LinearGradient>
          </Animated.View>
          
          <Text style={styles.brandName}>WillBank</Text>
          <Text style={styles.brandTagline}>Votre banque digitale premium</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.formContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={[styles.formCard, { backgroundColor: colors.card }, cardAnimatedStyle]}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.text }]}>Bienvenue</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Connectez-vous pour accéder à votre espace
            </Text>
          </View>

          {/* Premium Email Input */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
            <Animated.View style={[
              styles.inputContainer, 
              { backgroundColor: colors.backgroundSecondary },
              emailBorderStyle
            ]}>
              <View style={[styles.inputIconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="mail" size={18} color={colors.primary} />
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="exemple@email.com"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                onFocus={() => (emailFocused.value = withSpring(1))}
                onBlur={() => (emailFocused.value = withSpring(0))}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </Animated.View>
          </View>

          {/* Premium Password Input */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Mot de passe</Text>
            <Animated.View style={[
              styles.inputContainer, 
              { backgroundColor: colors.backgroundSecondary },
              passwordBorderStyle
            ]}>
              <View style={[styles.inputIconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="lock-closed" size={18} color={colors.primary} />
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                onFocus={() => (passwordFocused.value = withSpring(1))}
                onBlur={() => (passwordFocused.value = withSpring(0))}
                secureTextEntry={!showPassword}
              />
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
            </Animated.View>
          </View>

          {/* Forgot Password */}
          <Pressable style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
              Mot de passe oublié ?
            </Text>
          </Pressable>

          {/* Premium Gradient Login Button */}
          <Animated.View style={buttonAnimatedStyle}>
            <Pressable 
              onPress={handleLogin}
              onPressIn={() => (buttonScale.value = withSpring(0.96))}
              onPressOut={() => (buttonScale.value = withSpring(1))}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#0066FF', '#0052CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.loginButton, { opacity: isLoading ? 0.7 : 1 }]}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Ionicons name="sync" size={20} color="#fff" />
                    <Text style={styles.loginButtonText}>Connexion...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Se connecter</Text>
                    <Ionicons name="arrow-forward-circle" size={24} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>ou continuer avec</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Biometric Button with gradient border */}
          <Pressable 
            style={[styles.biometricButton, { backgroundColor: colors.backgroundSecondary }]}
            onPress={handleBiometric}
          >
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.biometricGradient}
            >
              <View style={[styles.biometricContent, { backgroundColor: colors.backgroundSecondary }]}>
                <Ionicons name="finger-print" size={28} color={colors.primary} />
                <Text style={[styles.biometricButtonText, { color: colors.text }]}>
                  Authentification biométrique
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: colors.textSecondary }]}>
              Nouveau sur WillBank ? 
            </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.registerLinkGradient}
              >
                <Text style={styles.registerLink}> Créer un compte</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Premium Badge */}
          <View style={styles.premiumBadge}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badgeGradient}
            >
              <Ionicons name="shield-checkmark" size={14} color="#fff" />
              <Text style={styles.badgeText}>Connexion sécurisée SSL 256-bit</Text>
            </LinearGradient>
          </View>
        </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 90,
    height: 90,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    marginTop: -40,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formCard: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  // Premium Inputs
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
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
  inputIconContainer: {
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
  eyeButton: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Premium Buttons
  loginButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
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
    fontSize: 13,
    fontWeight: '500',
  },
  biometricButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  biometricGradient: {
    padding: 2,
  },
  biometricContent: {
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  biometricButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerText: {
    fontSize: 15,
  },
  registerLinkGradient: {
    borderRadius: 8,
  },
  registerLink: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  // Premium Badge
  premiumBadge: {
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
