import { useTheme } from '@/contexts/theme-context';
import { AntMobile } from '@/constants/design-systems/ant-mobile';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

/**
 * 🐜 ANT DESIGN MOBILE (Alibaba)
 * 
 * Caractéristiques :
 * - Composants métier riches
 * - Formulaires structurés
 * - Listes optimisées
 * - Gestes tactiles
 * - Coins arrondis 8-12px
 * - Ombres légères
 * - Espacements 8px grid
 * - Animations fluides
 */

export default function LoginAntScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const buttonOpacity = useSharedValue(1);

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

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(buttonOpacity.value, { duration: AntMobile.animation.duration.fast }),
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Ant Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="wallet-outline" size={36} color="#fff" />
          </View>
          <Text style={styles.brandName}>WillBank</Text>
          <Text style={styles.brandTagline}>Votre banque mobile intelligente</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Ant Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.text }]}>Connexion</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Bienvenue ! Connectez-vous pour continuer
            </Text>
          </View>

          {/* Ant List - Form Items */}
          <View style={styles.formList}>
            {/* Email Item */}
            <View style={styles.listItem}>
              <View style={[styles.itemContent, { borderBottomColor: colors.border }]}>
                <View style={styles.itemIcon}>
                  <Ionicons name="mail" size={20} color={colors.primary} />
                </View>
                <View style={styles.itemBody}>
                  <Text style={[styles.itemLabel, { color: colors.textSecondary }]}>Email</Text>
                  <TextInput
                    style={[styles.itemInput, { color: colors.text }]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="exemple@email.com"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>
            </View>

            {/* Password Item */}
            <View style={styles.listItem}>
              <View style={[styles.itemContent, { borderBottomColor: colors.border }]}>
                <View style={styles.itemIcon}>
                  <Ionicons name="lock-closed" size={20} color={colors.primary} />
                </View>
                <View style={styles.itemBody}>
                  <Text style={[styles.itemLabel, { color: colors.textSecondary }]}>Mot de passe</Text>
                  <TextInput
                    style={[styles.itemInput, { color: colors.text }]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Entrez votre mot de passe"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showPassword}
                  />
                </View>
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.itemExtra}>
                  <Ionicons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Forgot Password Link */}
          <Pressable style={styles.forgotLink}>
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Mot de passe oublié ?
            </Text>
          </Pressable>

          {/* Ant Primary Button */}
          <Animated.View style={buttonAnimatedStyle}>
            <Pressable 
              style={[styles.primaryButton, { backgroundColor: colors.primary, opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleLogin}
              onPressIn={() => (buttonOpacity.value = 0.8)}
              onPressOut={() => (buttonOpacity.value = 1)}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? '登录中...' : '登录'}
              </Text>
              <Text style={styles.primaryButtonSubtext}>
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Divider with text */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>其他登录方式</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Ant Ghost Button - Biometric */}
          <Pressable 
            style={[styles.ghostButton, { borderColor: colors.border }]}
            onPress={handleBiometric}
          >
            <Ionicons name="finger-print" size={24} color={colors.primary} />
            <View style={styles.ghostButtonText}>
              <Text style={[styles.ghostButtonTitle, { color: colors.text }]}>
                生物识别
              </Text>
              <Text style={[styles.ghostButtonSubtitle, { color: colors.textSecondary }]}>
                Connexion biométrique
              </Text>
            </View>
          </Pressable>

          {/* Register Section */}
          <View style={styles.registerSection}>
            <Text style={[styles.registerText, { color: colors.textSecondary }]}>
              还没有账号？
            </Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text style={[styles.registerLink, { color: colors.primary }]}>
                立即注册 / Créer un compte
              </Text>
            </Pressable>
          </View>

          {/* Info Notice */}
          <View style={[styles.notice, { backgroundColor: AntMobile.colors.infoLight }]}>
            <Ionicons name="information-circle" size={16} color={AntMobile.colors.info} />
            <Text style={[styles.noticeText, { color: AntMobile.colors.info }]}>
              Ant Design Mobile - Interface optimisée pour mobile
            </Text>
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
  // Ant Header
  header: {
    paddingTop: 60,
    paddingBottom: AntMobile.spacing.xxl,
    paddingHorizontal: AntMobile.spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: AntMobile.radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AntMobile.spacing.md,
  },
  brandName: {
    ...AntMobile.typography.heading2,
    color: '#fff',
    marginBottom: AntMobile.spacing.xs,
  },
  brandTagline: {
    ...AntMobile.typography.paragraphSmall,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    marginTop: -AntMobile.spacing.lg,
  },
  // Ant Card
  card: {
    flex: 1,
    borderTopLeftRadius: AntMobile.radius.xxl,
    borderTopRightRadius: AntMobile.radius.xxl,
    paddingHorizontal: AntMobile.spacing.lg,
    paddingTop: AntMobile.spacing.xxl,
    ...AntMobile.shadows.md,
  },
  titleSection: {
    marginBottom: AntMobile.spacing.xl,
  },
  title: {
    ...AntMobile.typography.heading2,
    marginBottom: AntMobile.spacing.xs,
  },
  subtitle: {
    ...AntMobile.typography.paragraphSmall,
    lineHeight: 22,
  },
  // Ant List
  formList: {
    marginBottom: AntMobile.spacing.lg,
  },
  listItem: {
    marginBottom: AntMobile.spacing.sm,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: AntMobile.components.list.itemHeight,
    paddingVertical: AntMobile.spacing.sm,
    borderBottomWidth: AntMobile.border.width,
  },
  itemIcon: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBody: {
    flex: 1,
    paddingHorizontal: AntMobile.spacing.sm,
  },
  itemLabel: {
    ...AntMobile.typography.caption,
    marginBottom: 2,
  },
  itemInput: {
    ...AntMobile.typography.paragraph,
    paddingVertical: 0,
  },
  itemExtra: {
    padding: AntMobile.spacing.sm,
  },
  // Links
  forgotLink: {
    alignSelf: 'flex-end',
    paddingVertical: AntMobile.spacing.sm,
    marginBottom: AntMobile.spacing.lg,
  },
  linkText: {
    ...AntMobile.typography.paragraphSmall,
    fontWeight: '500',
  },
  // Ant Buttons
  primaryButton: {
    height: AntMobile.components.button.heightLarge,
    borderRadius: AntMobile.components.button.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    ...AntMobile.shadows.md,
  },
  primaryButtonText: {
    ...AntMobile.typography.button,
    color: '#fff',
    fontWeight: '600',
  },
  primaryButtonSubtext: {
    ...AntMobile.typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  ghostButton: {
    height: AntMobile.components.button.height,
    borderRadius: AntMobile.components.button.borderRadius,
    borderWidth: AntMobile.border.width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: AntMobile.spacing.md,
  },
  ghostButtonText: {
    alignItems: 'center',
  },
  ghostButtonTitle: {
    ...AntMobile.typography.paragraph,
    fontWeight: '500',
  },
  ghostButtonSubtitle: {
    ...AntMobile.typography.caption,
  },
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: AntMobile.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: AntMobile.border.width,
  },
  dividerText: {
    ...AntMobile.typography.caption,
    marginHorizontal: AntMobile.spacing.md,
  },
  // Register
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: AntMobile.spacing.xl,
    flexWrap: 'wrap',
  },
  registerText: {
    ...AntMobile.typography.paragraphSmall,
  },
  registerLink: {
    ...AntMobile.typography.paragraphSmall,
    fontWeight: '600',
    marginLeft: AntMobile.spacing.xs,
  },
  // Notice
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AntMobile.spacing.sm,
    padding: AntMobile.spacing.md,
    borderRadius: AntMobile.radius.sm,
    marginTop: AntMobile.spacing.xl,
    marginBottom: AntMobile.spacing.xxl,
  },
  noticeText: {
    ...AntMobile.typography.caption,
    flex: 1,
  },
});
