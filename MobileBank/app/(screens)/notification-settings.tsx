import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View,
  Switch,
  Alert
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumCard, PremiumIcon, PremiumDivider, PremiumButton } from '@/components/shared';

// Interface basée sur l'entité Notification du backend
interface NotificationPreferences {
  // Types de notifications (basé sur NotificationType enum)
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  
  // Catégories de notifications
  transactions: boolean;
  security: boolean;
  marketing: boolean;
  updates: boolean;
  
  // Paramètres avancés
  transactionThreshold: number; // Montant minimum pour notification
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  // État des préférences de notifications
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    // Types
    email: true,
    sms: false,
    push: true,
    inApp: true,
    
    // Catégories
    transactions: true,
    security: true,
    marketing: false,
    updates: true,
    
    // Avancés
    transactionThreshold: 100,
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simuler un appel API
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        'Préférences enregistrées',
        'Vos préférences de notifications ont été mises à jour.',
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const handleTestNotification = () => {
    Alert.alert(
      'Notification de test',
      'Une notification de test a été envoyée à tous vos canaux activés.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Gradient Header */}
      <LinearGradient
        colors={['#FF9500', '#FF6B00']}
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
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Gérez vos préférences de notifications pour rester informé de l'activité de vos comptes.
            </Text>
          </View>
        </Animated.View>

        {/* Notification Types (basé sur NotificationType enum) */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <PremiumCard 
            style={[styles.card, { backgroundColor: colors.card }]}
            elevated
            delay={0}
          >
            <View style={styles.cardHeader}>
              <PremiumIcon
                name="notifications"
                size={40}
                iconSize={20}
                colors={['#FF9500', '#FF6B00']}
                shape="rounded"
              />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Canaux de Notification
              </Text>
            </View>

            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              Choisissez comment vous souhaitez recevoir vos notifications
            </Text>

            <View style={styles.settingsList}>
              {/* EMAIL */}
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="mail" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                      Email
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      Notifications par email
                    </Text>
                  </View>
                </View>
                <Switch
                  value={preferences.email}
                  onValueChange={() => handleToggle('email')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              <PremiumDivider variant="solid" spacing={12} />

              {/* SMS */}
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="chatbubble" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                      SMS
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      Notifications par SMS
                    </Text>
                  </View>
                </View>
                <Switch
                  value={preferences.sms}
                  onValueChange={() => handleToggle('sms')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              <PremiumDivider variant="solid" spacing={12} />

              {/* PUSH */}
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="phone-portrait" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                      Push
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      Notifications push sur mobile
                    </Text>
                  </View>
                </View>
                <Switch
                  value={preferences.push}
                  onValueChange={() => handleToggle('push')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              <PremiumDivider variant="solid" spacing={12} />

              {/* IN_APP */}
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="apps" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                      Dans l'application
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      Notifications dans l'app
                    </Text>
                  </View>
                </View>
                <Switch
                  value={preferences.inApp}
                  onValueChange={() => handleToggle('inApp')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Notification Categories */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <PremiumCard 
            style={[styles.card, { backgroundColor: colors.card }]}
            elevated
            delay={0}
          >
            <View style={styles.cardHeader}>
              <PremiumIcon
                name="list"
                size={40}
                iconSize={20}
                colors={['#0066FF', '#0052CC']}
                shape="rounded"
              />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Catégories
              </Text>
            </View>

            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              Sélectionnez les types d'événements à notifier
            </Text>

            <View style={styles.settingsList}>
              {/* Transactions */}
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                      Transactions
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      Virements, paiements, retraits
                    </Text>
                  </View>
                </View>
                <Switch
                  value={preferences.transactions}
                  onValueChange={() => handleToggle('transactions')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              <PremiumDivider variant="solid" spacing={12} />

              {/* Security */}
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                      Sécurité
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      Connexions, modifications de compte
                    </Text>
                  </View>
                </View>
                <Switch
                  value={preferences.security}
                  onValueChange={() => handleToggle('security')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              <PremiumDivider variant="solid" spacing={12} />

              {/* Marketing */}
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="megaphone" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                      Marketing
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      Offres, promotions, nouveautés
                    </Text>
                  </View>
                </View>
                <Switch
                  value={preferences.marketing}
                  onValueChange={() => handleToggle('marketing')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              <PremiumDivider variant="solid" spacing={12} />

              {/* Updates */}
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="refresh" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                      Mises à jour
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      Nouvelles fonctionnalités, maintenance
                    </Text>
                  </View>
                </View>
                <Switch
                  value={preferences.updates}
                  onValueChange={() => handleToggle('updates')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Advanced Settings */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <PremiumCard 
            style={[styles.card, { backgroundColor: colors.card }]}
            elevated
            delay={0}
          >
            <View style={styles.cardHeader}>
              <PremiumIcon
                name="settings"
                size={40}
                iconSize={20}
                colors={['#667EEA', '#764BA2']}
                shape="rounded"
              />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Paramètres Avancés
              </Text>
            </View>

            <View style={styles.settingsList}>
              {/* Transaction Threshold */}
              <Pressable 
                style={({ pressed }) => [
                  styles.actionButton,
                  { 
                    backgroundColor: colors.backgroundSecondary,
                    opacity: pressed ? 0.7 : 1,
                  }
                ]}
                onPress={() => Alert.alert('Seuil', 'Configurer le montant minimum')}
              >
                <View style={styles.actionLeft}>
                  <Ionicons name="cash" size={20} color={colors.primary} />
                  <View>
                    <Text style={[styles.actionText, { color: colors.text }]}>
                      Seuil de notification
                    </Text>
                    <Text style={[styles.actionSubtext, { color: colors.textSecondary }]}>
                      Notifier si montant ≥ {preferences.transactionThreshold} €
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Pressable>

              <View style={{ height: 12 }} />

              {/* Quiet Hours */}
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="moon" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                      Heures silencieuses
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      {preferences.quietHoursStart} - {preferences.quietHoursEnd}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={preferences.quietHoursEnabled}
                  onValueChange={() => handleToggle('quietHoursEnabled')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Test Notification */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Pressable 
            style={({ pressed }) => [
              styles.testButton,
              { 
                backgroundColor: colors.card,
                opacity: pressed ? 0.7 : 1,
              }
            ]}
            onPress={handleTestNotification}
          >
            <Ionicons name="send" size={20} color={colors.primary} />
            <Text style={[styles.testButtonText, { color: colors.text }]}>
              Envoyer une notification de test
            </Text>
          </Pressable>
        </Animated.View>

        {/* Save Button */}
        <Animated.View entering={FadeInDown.delay(450).duration(400)}>
          <PremiumButton
            title={isSaving ? "Enregistrement..." : "Enregistrer les préférences"}
            onPress={handleSave}
            icon="checkmark-circle"
            variant="primary"
            disabled={isSaving}
          />
        </Animated.View>

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
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  // Card
  card: {
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionDescription: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 16,
    lineHeight: 16,
  },
  // Settings List
  settingsList: {
    gap: 0,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  settingDescription: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Action Button
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  actionSubtext: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  // Test Button
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  testButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
