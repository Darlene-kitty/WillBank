import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/theme-context';
import { useAuthContext } from '@/contexts/auth-context';
import { useAccounts, useTransactions } from '@/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { 
  PremiumCard, 
  PremiumButton, 
  PremiumStat, 
  PremiumDivider,
  PremiumIcon,
  PremiumBadge,
  PremiumTransactionItem
} from '@/components/shared';

export default function AccountDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const { clientId } = useAuthContext();
  const { accounts, getAccountById } = useAccounts(clientId);
  const [balanceVisible, setBalanceVisible] = useState(true);

  // Récupérer le compte par ID
  const accountId = typeof id === 'string' ? parseInt(id) : 1;
  const account = getAccountById(accountId);
  
  // Si le compte n'est pas trouvé, utiliser des données par défaut
  const accountData = account ? {
    name: account.accountType === 'CHECKING' ? 'Compte Courant' : 
          account.accountType === 'SAVINGS' ? 'Compte Épargne' : 'Compte Business',
    number: `**** ${account.accountNumber.slice(-4)}`,
    balance: account.balance,
    iban: `FR76 3000 6000 0112 3456 7890 ${account.id.toString().padStart(3, '0')}`,
    bic: 'BNPAFRPPXXX',
    status: account.status === 'ACTIVE' ? 'Actif' : 
            account.status === 'SUSPENDED' ? 'Suspendu' : 'Fermé',
    openDate: new Date(account.createdAt!).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    type: account.accountType === 'CHECKING' ? 'Compte Courant' : 
          account.accountType === 'SAVINGS' ? 'Compte Épargne' : 'Compte Business',
    interestRate: account.accountType === 'SAVINGS' ? 3.5 : null,
    monthlyDeposit: account.accountType === 'SAVINGS' ? 200.00 : null,
  } : {
    name: 'Compte Courant',
    number: '**** 1234',
    balance: 0,
    iban: 'FR76 3000 6000 0112 3456 7890 189',
    bic: 'BNPAFRPPXXX',
    status: 'Actif',
    openDate: '15 Janvier 2020',
    type: 'Compte Courant',
    interestRate: null,
    monthlyDeposit: null,
  };

  const recentTransactions = isCheckingAccount ? [
    { id: 1, name: 'Apple Store', date: "Aujourd'hui", amount: -999.00, icon: 'bag-handle', category: 'Shopping' },
    { id: 2, name: 'Starbucks', date: 'Hier', amount: -6.50, icon: 'cafe', category: 'Restaurant' },
    { id: 3, name: 'Salaire', date: '15 Mar 2024', amount: 2500.00, icon: 'cash', category: 'Revenu' },
  ] : [
    { id: 1, name: 'Virement automatique', date: "Aujourd'hui", amount: 200.00, icon: 'repeat', category: 'Épargne' },
    { id: 2, name: 'Intérêts mensuels', date: '1er Nov', amount: 15.00, icon: 'trending-up', category: 'Intérêts' },
    { id: 3, name: 'Virement automatique', date: '1er Nov', amount: 200.00, icon: 'repeat', category: 'Épargne' },
  ];

  const handleCopy = (text: string, label: string) => {
    Alert.alert('Copié', `${label} copié dans le presse-papier`);
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
          <Text style={styles.headerTitle}>Détails du Compte</Text>
          <Pressable 
            onPress={() => Alert.alert('Options', 'Fonctionnalité à venir')}
            style={styles.optionsButton}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Premium Balance Card */}
        <PremiumCard 
          style={[styles.balanceCard, { backgroundColor: colors.card }]}
          elevated
          delay={0}
        >
          <View style={styles.balanceHeader}>
            <View>
              <Text style={[styles.accountType, { color: colors.textSecondary }]}>
                {accountData.type.toUpperCase()}
              </Text>
              <Text style={[styles.accountNumber, { color: colors.text }]}>
                {accountData.number}
              </Text>
            </View>
            <Pressable 
              onPress={() => setBalanceVisible(!balanceVisible)}
              style={styles.eyeButton}
            >
              <Ionicons 
                name={balanceVisible ? 'eye' : 'eye-off'} 
                size={22} 
                color={colors.textSecondary} 
              />
            </Pressable>
          </View>

          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
            SOLDE DISPONIBLE
          </Text>
          <Text style={[styles.balanceAmount, { color: colors.text }]}>
            {balanceVisible 
              ? `${accountData.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
              : '••••••'
            }
          </Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScrollContent}
          >
            {isCheckingAccount ? (
              <>
                <PremiumStat
                  icon="trending-up"
                  label="Revenus"
                  value="+2 500 €"
                  colors={['#34C759', '#28A745']}
                  variant="vertical"
                  style={styles.statItem}
                />
                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                <PremiumStat
                  icon="trending-down"
                  label="Dépenses"
                  value="-1 008 €"
                  colors={['#FF3B30', '#CC2E26']}
                  variant="vertical"
                  style={styles.statItem}
                />
              </>
            ) : (
              <>
                <PremiumStat
                  icon="trending-up"
                  label="Taux d'intérêt"
                  value={`${accountData.interestRate}% / an`}
                  colors={['#667EEA', '#764BA2']}
                  variant="vertical"
                  style={styles.statItem}
                />
                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                <PremiumStat
                  icon="calendar"
                  label="Dépôt mensuel"
                  value={`${accountData.monthlyDeposit?.toFixed(2)} €`}
                  colors={['#34C759', '#28A745']}
                  variant="vertical"
                  style={styles.statItem}
                />
              </>
            )}
          </ScrollView>
        </PremiumCard>

        {/* Quick Actions */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.quickActions}
        >
          {isCheckingAccount ? (
            <>
              <Pressable 
                style={({ pressed }) => [
                  styles.actionBtn,
                  { opacity: pressed ? 0.9 : 1 }
                ]}
                onPress={() => router.push('/(screens)/new-transfer' as any)}
              >
                <LinearGradient
                  colors={['#0066FF', '#0052CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGradient}
                >
                  <Ionicons name="paper-plane" size={20} color="#fff" />
                </LinearGradient>
                <Text style={[styles.actionBtnText, { color: colors.text }]}>Virement</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [
                  styles.actionBtn,
                  { opacity: pressed ? 0.9 : 1 }
                ]}
                onPress={() => router.push('/(screens)/deposit' as any)}
                onPress={() => router.push('/deposit' as any)}
              >
                <LinearGradient
                  colors={['#34C759', '#28A745']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGradient}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </LinearGradient>
                <Text style={[styles.actionBtnText, { color: colors.text }]}>Dépôt</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [
                  styles.actionBtn,
                  { opacity: pressed ? 0.9 : 1 }
                ]}
              >
                <LinearGradient
                  colors={['#FF9500', '#FF6B00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGradient}
                >
                  <Ionicons name="download" size={20} color="#fff" />
                </LinearGradient>
                <Text style={[styles.actionBtnText, { color: colors.text }]}>Relevé</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [
                  styles.actionBtn,
                  { opacity: pressed ? 0.9 : 1 }
                ]}
              >
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGradient}
                >
                  <Ionicons name="card" size={20} color="#fff" />
                </LinearGradient>
                <Text style={[styles.actionBtnText, { color: colors.text }]}>Carte</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable 
                style={({ pressed }) => [
                  styles.actionBtn,
                  { opacity: pressed ? 0.9 : 1 }
                ]}
                onPress={() => router.push('/(screens)/deposit' as any)}
                onPress={() => router.push('/deposit' as any)}
              >
                <LinearGradient
                  colors={['#34C759', '#28A745']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGradient}
                >
                  <Ionicons name="add-circle" size={20} color="#fff" />
                </LinearGradient>
                <Text style={[styles.actionBtnText, { color: colors.text }]}>Alimenter</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [
                  styles.actionBtn,
                  { opacity: pressed ? 0.9 : 1 }
                ]}
              >
                <LinearGradient
                  colors={['#0066FF', '#0052CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGradient}
                >
                  <Ionicons name="repeat" size={20} color="#fff" />
                </LinearGradient>
                <Text style={[styles.actionBtnText, { color: colors.text }]}>Auto</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [
                  styles.actionBtn,
                  { opacity: pressed ? 0.9 : 1 }
                ]}
              >
                <LinearGradient
                  colors={['#FF9500', '#FF6B00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGradient}
                >
                  <Ionicons name="download" size={20} color="#fff" />
                </LinearGradient>
                <Text style={[styles.actionBtnText, { color: colors.text }]}>Relevé</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [
                  styles.actionBtn,
                  { opacity: pressed ? 0.9 : 1 }
                ]}
              >
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGradient}
                >
                  <Ionicons name="calculator" size={20} color="#fff" />
                </LinearGradient>
                <Text style={[styles.actionBtnText, { color: colors.text }]}>Simuler</Text>
              </Pressable>
            </>
          )}
        </Animated.View>

        {/* Savings Info (Épargne only) */}
        {!isCheckingAccount && (
          <PremiumCard 
            style={[styles.infoCard, { backgroundColor: colors.card }]}
            elevated
            delay={200}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Informations d'Épargne
            </Text>

            {/* Interest Rate */}
            <View style={[styles.infoRow, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.infoLeft}>
                <PremiumIcon
                  name="trending-up"
                  size={44}
                  iconSize={20}
                  colors={['#667EEA', '#764BA2']}
                  shape="rounded"
                />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    Taux d'intérêt annuel
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {accountData.interestRate}% brut
                  </Text>
                </View>
              </View>
            </View>

            {/* Monthly Interest */}
            <View style={[styles.infoRow, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.infoLeft}>
                <PremiumIcon
                  name="cash"
                  size={44}
                  iconSize={20}
                  colors={['#34C759', '#28A745']}
                  shape="rounded"
                />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    Intérêts mensuels estimés
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {((accountData.balance * (accountData.interestRate! / 100)) / 12).toFixed(2)} €
                  </Text>
                </View>
              </View>
            </View>

            {/* Annual Interest */}
            <View style={[styles.infoRow, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.infoLeft}>
                <PremiumIcon
                  name="calendar"
                  size={44}
                  iconSize={20}
                  colors={['#FF9500', '#FF6B00']}
                  shape="rounded"
                />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    Intérêts annuels estimés
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {(accountData.balance * (accountData.interestRate! / 100)).toFixed(2)} €
                  </Text>
                </View>
              </View>
            </View>
          </PremiumCard>
        )}

        {/* Account Information */}
        <PremiumCard 
          style={[styles.infoCard, { backgroundColor: colors.card }]}
          elevated
          delay={!isCheckingAccount ? 300 : 200}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Informations du Compte
          </Text>

          {/* IBAN */}
          <Pressable 
            style={({ pressed }) => [
              styles.infoRow,
              { 
                backgroundColor: colors.backgroundSecondary,
                opacity: pressed ? 0.8 : 1,
              }
            ]}
            onPress={() => handleCopy(accountData.iban, 'IBAN')}
          >
            <View style={styles.infoLeft}>
              <PremiumIcon
                name="business"
                size={44}
                iconSize={20}
                colors={['#0066FF', '#0052CC']}
                shape="rounded"
              />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  IBAN
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {accountData.iban}
                </Text>
              </View>
            </View>
            <Ionicons name="copy-outline" size={20} color={colors.primary} />
          </Pressable>

          {/* BIC */}
          <Pressable 
            style={({ pressed }) => [
              styles.infoRow,
              { 
                backgroundColor: colors.backgroundSecondary,
                opacity: pressed ? 0.8 : 1,
              }
            ]}
            onPress={() => handleCopy(accountData.bic, 'BIC')}
          >
            <View style={styles.infoLeft}>
              <PremiumIcon
                name="globe"
                size={44}
                iconSize={20}
                colors={['#667EEA', '#764BA2']}
                shape="rounded"
              />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  BIC / SWIFT
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {accountData.bic}
                </Text>
              </View>
            </View>
            <Ionicons name="copy-outline" size={20} color={colors.primary} />
          </Pressable>

          <PremiumDivider variant="solid" spacing={16} />

          {/* Status */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <PremiumIcon
                name="checkmark-circle"
                size={44}
                iconSize={20}
                colors={['#34C759', '#28A745']}
                shape="rounded"
              />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Statut
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {accountData.status}
                </Text>
              </View>
            </View>
            <PremiumBadge
              text="Actif"
              variant="success"
              size="medium"
            />
          </View>

          {/* Open Date */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <PremiumIcon
                name="calendar"
                size={44}
                iconSize={20}
                colors={['#FF9500', '#FF6B00']}
                shape="rounded"
              />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Date d'ouverture
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {accountData.openDate}
                </Text>
              </View>
            </View>
          </View>
        </PremiumCard>

        {/* Recent Transactions */}
        <PremiumCard 
          style={[styles.transactionsCard, { backgroundColor: colors.card }]}
          elevated
          delay={300}
        >
          <View style={styles.transactionsHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Transactions Récentes
            </Text>
            <Pressable onPress={() => router.push('/(screens)/transaction-history' as any)}>
              <Text style={styles.viewAllText}>Tout voir →</Text>
            </Pressable>
          </View>

          {recentTransactions.map((transaction, index) => (
            <PremiumTransactionItem
              key={transaction.id}
              name={transaction.name}
              category={transaction.category}
              date={transaction.date}
              amount={transaction.amount}
              icon={transaction.icon as any}
              delay={400 + index * 80}
              style={styles.transactionItem}
            />
          ))}
        </PremiumCard>

        {/* Action Button */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.buttonContainer}
        >
          <PremiumButton
            title="Voir l'historique complet"
            onPress={() => router.push('/(screens)/transaction-history' as any)}
            icon="receipt"
            variant="primary"
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
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  optionsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // Premium Balance Card
  balanceCard: {
    padding: 24,
    marginBottom: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  accountType: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  eyeButton: {
    padding: 8,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: -1.5,
  },
  statsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 20,
  },
  statItem: {
    minWidth: 100,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 10,
  },
  actionBtnGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  // Info Card
  infoCard: {
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  // Transactions Card
  transactionsCard: {
    padding: 20,
    marginBottom: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#0066FF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  transactionItem: {
    marginBottom: 12,
  },
  // Button Container
  buttonContainer: {
    marginBottom: 20,
  },
});
