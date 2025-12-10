import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/theme-context';
import { useAuthContext } from '@/contexts/auth-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumCard, PremiumIcon, PremiumDivider } from '@/components/shared';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { colors, toggleTheme, colorScheme } = useTheme();
  const { logout } = useAuthContext();
  const isDark = colorScheme === 'dark';

  const settingsSections = [
    {
      title: 'Compte',
      items: [
        { id: 1, icon: 'person-outline', label: 'Informations personnelles', route: '/profile' },
        { id: 2, icon: 'lock-closed-outline', label: 'Sécurité et confidentialité', route: '/security' },
        { id: 3, icon: 'card-outline', label: 'Mes cartes bancaires', route: '/cards' },
        { id: 4, icon: 'wallet-outline', label: 'Mes comptes', route: '/accounts' },
      ],
    },
    {
      title: 'Préférences',
      items: [
        { id: 5, icon: 'notifications-outline', label: 'Notifications', route: '/notification-settings' },
        { id: 6, icon: 'language-outline', label: 'Langue', value: 'Français' },
        { id: 7, icon: 'moon-outline', label: 'Mode sombre', toggle: true },
        { id: 8, icon: 'finger-print', label: 'Biométrie', toggle: true },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 9, icon: 'help-circle-outline', label: 'Centre d\'aide', route: '/help' },
        { id: 10, icon: 'chatbubble-outline', label: 'Nous contacter', route: '/contact' },
        { id: 11, icon: 'document-text-outline', label: 'Conditions d\'utilisation', route: '/terms' },
        { id: 12, icon: 'shield-checkmark-outline', label: 'Politique de confidentialité', route: '/privacy' },
      ],
    },
  ];

  const handleItemPress = (item: any) => {
    if (item.toggle && item.label === 'Mode sombre') {
      toggleTheme();
    } else if (item.route) {
      // Navigation vers les pages
      if (item.route === '/profile') {
      } else if (item.route === '/accounts') {
        router.push('/(screens)/account-config?accountId=1' as any);
      } else if (item.route === '/notification-settings') {
        router.push('/notification-settings' as any);
        router.push('/(screens)/profile-settings' as any);
      } else if (item.route === '/accounts') {
        router.push('/(screens)/account-config?accountId=1' as any);
      } else if (item.route === '/notification-settings') {
        router.push('/(screens)/notification-settings' as any);
      } else {
        Alert.alert('Navigation', `Vers ${item.label}`);
      }
    } else {
      Alert.alert(item.label, 'Fonctionnalité à venir');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Gradient Header */}
      <LinearGradient
        colors={['#0066FF', '#0052CC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Pressable 
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.6 : 1 }
            ]}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Paramètres</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <PremiumCard 
          style={[styles.profileCard, { backgroundColor: colors.card }]}
          elevated
          delay={0}
        >
          <View style={styles.profileContent}>
            <LinearGradient
              colors={['#0066FF', '#0052CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileAvatar}
            >
              <Ionicons name="person" size={32} color="#fff" />
            </LinearGradient>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                William Dupont
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                william.dupont@email.com
              </Text>
            </View>
            <Pressable 
              onPress={() => router.push('/(screens)/profile-settings' as any)}
              style={styles.editButton}
            >
              <Ionicons name="create-outline" size={20} color={colors.primary} />
            </Pressable>
          </View>
        </PremiumCard>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <Animated.View 
            key={section.title}
            entering={FadeInDown.delay(100 + sectionIndex * 50).duration(400)}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            
            <PremiumCard 
              style={[styles.settingsCard, { backgroundColor: colors.card }]}
              elevated
              delay={0}
            >
              {section.items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <Pressable 
                    style={({ pressed }) => [
                      styles.settingItem,
                      { 
                        backgroundColor: pressed ? colors.backgroundSecondary : 'transparent',
                      }
                    ]}
                    onPress={() => handleItemPress(item)}
                  >
                    <View style={styles.settingLeft}>
                      <PremiumIcon
                        name={item.icon as any}
                        size={44}
                        iconSize={20}
                        colors={['#0066FF', '#0052CC']}
                        shape="rounded"
                      />
                      <Text style={[styles.settingLabel, { color: colors.text }]}>
                        {item.label}
                      </Text>
                    </View>
                    <View style={styles.settingRight}>
                      {item.value && (
                        <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                          {item.value}
                        </Text>
                      )}
                      {item.toggle ? (
                        <View style={[
                          styles.toggle,
                          { backgroundColor: (item.label === 'Mode sombre' ? isDark : false) ? colors.primary : colors.border }
                        ]}>
                          <View style={[
                            styles.toggleThumb,
                            { 
                              backgroundColor: '#fff',
                              transform: [{ translateX: (item.label === 'Mode sombre' ? isDark : false) ? 20 : 2 }]
                            }
                          ]} />
                        </View>
                      ) : (
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                      )}
                    </View>
                  </Pressable>
                  {index < section.items.length - 1 && (
                    <PremiumDivider variant="solid" spacing={0} />
                  )}
                </React.Fragment>
              ))}
            </PremiumCard>
          </Animated.View>
        ))}

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Pressable 
            style={({ pressed }) => [
              styles.logoutButton,
              { 
                backgroundColor: colors.card,
                opacity: pressed ? 0.8 : 1,
              }
            ]}
            onPress={() => Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
              { text: 'Annuler', style: 'cancel' },
              { 
                text: 'Déconnexion', 
                style: 'destructive', 
                onPress: async () => {
                  await logout();
                  router.replace('/(auth)/login' as any);
                }
              }
            ])}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </Pressable>
        </Animated.View>

        {/* App Version */}
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          Version 1.0.0
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // Profile Card
  profileCard: {
    padding: 20,
    marginBottom: 24,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
  },
  // Settings Sections
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },
  settingsCard: {
    padding: 0,
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  // Version
  versionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
});
