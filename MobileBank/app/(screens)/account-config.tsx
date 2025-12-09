import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View,
  Alert,
  Switch
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumCard, PremiumIcon, PremiumBadge, PremiumDivider, PremiumButton } from '@/components/shared';

// Interface basée sur l'entité Account du backend
interface BankAccount {
  id: number;
  accountNumber: string;
  clientId: number;
  accountType: 'SAVINGS' | 'CHECKING' | 'BUSINESS';
  balance: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export default function AccountConfigScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { accountId } = useLocalSearchParams();
  
  // Données mockées basées sur l'entité Account
  const [account, setAccount] = useState<BankAccount>({
    id: typeof accountId === 'string' ? parseInt(accountId) : 1,
    accountNumber: 'FR76 1234 5678 9012 3456 7890 123',
    clientId: 1,
    accountType: 'CHECKING',
    balance: 10110.00,
    status: 'ACTIVE',
    createdAt: '2023-01-15T10:00:00',
    updatedAt: '2024-12-09T10:30:00',
  });

  // États pour les paramètres
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [overdraftProtection, setOverdraftProtection] = useState(true);
  const [autoSavings, setAutoSavings] = useState(false);
  const [contactlessLimit, setContactlessLimit] = useState(50);

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'CHECKING': return 'Compte Courant';
      case 'SAVINGS': return 'Compte Épargne';
      case 'BUSINESS': return 'Compte Professionnel';
      default: return type;
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'CHECKING': return 'card';
      case 'SAVINGS': return 'wallet';
      case 'BUSINESS': return 'briefcase';
      default: return 'card';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#34C759';
      case 'SUSPENDED': return '#FF9500';
      case 'CLOSED': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'SUSPENDED': return 'Suspendu';
      case 'CLOSED': return 'Fermé';
      default: return status;
    }
  };

  const handleCloseAccount = () => {
    Alert.alert(
      'Fermer le compte',
      'Êtes-vous sûr de vouloir fermer ce compte ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Fermer', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Compte fermé', 'Votre compte a été fermé avec succès.');
            router.back();
          }
        }
      ]
    );
  };

  const handleSuspendAccount = () => {
    Alert.alert(
      'Suspendre le compte',
      'Voulez-vous suspendre temporairement ce compte ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Suspendre', 
          style: 'destructive',
          onPress: () => {
            setAccount({ ...account, status: 'SUSPENDED' });
            Alert.alert('Compte suspendu', 'Votre compte a été suspendu temporairement.');
          }
        }
      ]
    );
  };

  const handleReactivateAccount = () => {
    setAccount({ ...account, status: 'ACTIVE' });
    Alert.alert('Compte réactivé', 'Votre compte a été réactivé avec succès.');
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
          <Text style={styles.headerTitle}>Configuration du Compte</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {/* Account Info Card */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <PremiumCard 
            style={[styles.accountCard, { backgroundColor: colors.card }]}
            elevated
            delay={0}
          >
            <View style={styles.accountHeader}>
              <PremiumIcon
                name={getAccountTypeIcon(account.accountType) as any}
                size={56}
                iconSize={28}
                colors={['#0066FF', '#0052CC']}
                shape="rounded"
                gradient
              />
              <View style={styles.accountInfo}>
                <Text style={[styles.accountType, { color: colors.text }]}>
                  {getAccountTypeLabel(account.accountType)}
                </Text>
                <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>
                  {account.accountNumber}
                </Text>
                <View style={styles.accountBadges}>
                  <PremiumBadge
                    text={getStatusLabel(account.status)}
                    variant={account.status === 'ACTIVE' ? 'success' : account.status === 'SUSPENDED' ? 'warning' : 'error'}
                    size="small"
                  />
                </View>
              </View>
            </View>

            <PremiumDivider variant="solid" spacing={16} />

            <View style={styles.balanceContainer}>
              <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
                Solde actuel
              </Text>
              <Text style={[styles.balanceValue, { color: colors.text }]}>
                {account.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </Text>
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Account Details */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <PremiumCard 
            style={[styles.card, { backgroundColor: colors.card }]}
            elevated
            delay={0}
          >
            <View style={styles.cardHeader}>
              <PremiumIcon
                name="information-circle"
                size={40}
                iconSize={20}
                colors={['#667EEA', '#764BA2']}
                shape="rounded"
              />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Informations du Compte
              </Text>
            </View>

            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <View style={styles.infoLeft}>
                  <Ionicons name="calendar" size={18} color={colors.textSecondary} />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    Date d'ouverture
                  </Text>
                </View>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {new Date(account.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoLeft}>
                  <Ionicons name="time" size={18} color={colors.textSecondary} />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    Dernière mise à jour
                  </Text>
                </View>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {new Date(account.updatedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoLeft}>
                  <Ionicons name="person" size={18} color={colors.textSecondary} />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    ID Client
                  </Text>
                </View>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  #{account.clientId}
                </Text>
              </View>
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Account Settings */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
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
                colors={['#34C759', '#28A745']}
                shape="rounded"
              />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Paramètres du Compte
              </Text>
            </View>

            <View style={styles.settingsList}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="notifications" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                      Notifications
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      Recevoir des alertes pour ce compte
                    </Text>
                  </View>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              <PremiumDivider variant="solid" spacing={12} />

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                      Protection découvert
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      Bloquer les paiements si solde insuffisant
                    </Text>
                  </View>
                </View>
                <Switch
                  value={overdraftProtection}
                  onValueChange={setOverdraftProtection}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              {account.accountType === 'CHECKING' && (
                <>
                  <PremiumDivider variant="solid" spacing={12} />

                  <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                      <Ionicons name="wallet" size={20} color={colors.primary} />
                      <View style={styles.settingText}>
                        <Text style={[styles.settingLabel, { color: colors.text }]}>
                          Épargne automatique
                        </Text>
                        <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                          Transférer 10% vers l'épargne
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={autoSavings}
                      onValueChange={setAutoSavings}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor="#fff"
                    />
                  </View>
                </>
              )}
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Limits & Security */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <PremiumCard 
            style={[styles.card, { backgroundColor: colors.card }]}
            elevated
            delay={0}
          >
            <View style={styles.cardHeader}>
              <PremiumIcon
                name="lock-closed"
                size={40}
                iconSize={20}
                colors={['#FF9500', '#FF6B00']}
                shape="rounded"
              />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Limites et Sécurité
              </Text>
            </View>

            <Pressable 
              style={({ pressed }) => [
                styles.actionButton,
                { 
                  backgroundColor: colors.backgroundSecondary,
                  opacity: pressed ? 0.7 : 1,
                }
              ]}
              onPress={() => Alert.alert('Limites', 'Gérer les limites de paiement')}
            >
              <View style={styles.actionLeft}>
                <Ionicons name="card" size={20} color={colors.primary} />
                <View>
                  <Text style={[styles.actionText, { color: colors.text }]}>
                    Limite sans contact
                  </Text>
                  <Text style={[styles.actionSubtext, { color: colors.textSecondary }]}>
                    {contactlessLimit} € par transaction
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>

            <View style={{ height: 8 }} />

            <Pressable 
              style={({ pressed }) => [
                styles.actionButton,
                { 
                  backgroundColor: colors.backgroundSecondary,
                  opacity: pressed ? 0.7 : 1,
                }
              ]}
              onPress={() => Alert.alert('Plafonds', 'Gérer les plafonds de retrait')}
            >
              <View style={styles.actionLeft}>
                <Ionicons name="cash" size={20} color={colors.primary} />
                <View>
                  <Text style={[styles.actionText, { color: colors.text }]}>
                    Plafonds de retrait
                  </Text>
                  <Text style={[styles.actionSubtext, { color: colors.textSecondary }]}>
                    500 € / jour
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          </PremiumCard>
        </Animated.View>

        {/* Danger Zone */}
        {account.status === 'ACTIVE' && (
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <PremiumCard 
              style={[styles.card, { backgroundColor: colors.card }]}
              elevated
              delay={0}
            >
              <View style={styles.cardHeader}>
                <PremiumIcon
                  name="warning"
                  size={40}
                  iconSize={20}
                  colors={['#FF3B30', '#CC0000']}
                  shape="rounded"
                />
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Zone de Danger
                </Text>
              </View>

              <Pressable 
                style={({ pressed }) => [
                  styles.dangerButton,
                  { 
                    backgroundColor: '#FF9500' + '15',
                    borderColor: '#FF9500',
                    opacity: pressed ? 0.7 : 1,
                  }
                ]}
                onPress={handleSuspendAccount}
              >
                <Ionicons name="pause-circle" size={20} color="#FF9500" />
                <Text style={styles.dangerButtonText}>
                  Suspendre temporairement
                </Text>
              </Pressable>

              <View style={{ height: 8 }} />

              <Pressable 
                style={({ pressed }) => [
                  styles.dangerButton,
                  { 
                    backgroundColor: '#FF3B30' + '15',
                    borderColor: '#FF3B30',
                    opacity: pressed ? 0.7 : 1,
                  }
                ]}
                onPress={handleCloseAccount}
              >
                <Ionicons name="close-circle" size={20} color="#FF3B30" />
                <Text style={[styles.dangerButtonText, { color: '#FF3B30' }]}>
                  Fermer définitivement
                </Text>
              </Pressable>
            </PremiumCard>
          </Animated.View>
        )}

        {/* Reactivate Button (if suspended) */}
        {account.status === 'SUSPENDED' && (
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <PremiumButton
              title="Réactiver le compte"
              onPress={handleReactivateAccount}
              icon="checkmark-circle"
              variant="primary"
            />
          </Animated.View>
        )}

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
  // Account Card
  accountCard: {
    padding: 20,
    marginBottom: 12,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountType: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  accountNumber: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  accountBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -1,
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
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  // Info List
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
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
  // Danger Zone
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9500',
  },
});
