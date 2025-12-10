import { 
  PremiumCard, 
  PremiumAccountCard, 
  PremiumTransactionItem,
  PremiumStat,
  PremiumFAB,
  PremiumBadge
} from '@/components/shared';
import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAccounts, useTransactions, useNotifications } from '@/hooks';
import { useAuthContext } from '@/contexts/auth-context';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  // Hooks API - utiliser le contexte d'authentification
  const { clientId, isAuthenticated, isLoading: authLoading, client } = useAuthContext();
  const { accounts, isLoading: accountsLoading, refreshAccounts, totalBalance } = useAccounts(clientId);
  const { transactions, isLoading: transactionsLoading, refreshTransactions } = useTransactions(accounts[0]?.id);
  const { unreadCount } = useNotifications(client?.email || null);

  // État local
  const [refreshing, setRefreshing] = React.useState(false);
  const [balanceVisible, setBalanceVisible] = React.useState(true);
  const [isMounted, setIsMounted] = React.useState(false);

  // Animation values
  const headerScale = useSharedValue(0.9);
  const headerOpacity = useSharedValue(0);
  const balanceScale = useSharedValue(0);

  // Marquer le composant comme monté
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirection si non authentifié (après que le composant soit monté et l'auth vérifiée)
  useEffect(() => {
    if (isMounted && !authLoading && !isAuthenticated) {
      router.replace('/(auth)/login' as any);
    }
  }, [isMounted, authLoading, isAuthenticated]);

  // Calcul des stats mensuelles
  const monthlyIncome = React.useMemo(() => {
    return transactions
      .filter(tx => tx.type === 'DEPOSIT' && tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const monthlyExpenses = React.useMemo(() => {
    return transactions
      .filter(tx => (tx.type === 'WITHDRAWAL' || tx.type === 'TRANSFER') && tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  // Prendre les 10 dernières transactions
  const recentActivity = React.useMemo(() => {
    return transactions.slice(0, 10);
  }, [transactions]);

  // Gestion du refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshAccounts(),
        refreshTransactions(),
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshAccounts, refreshTransactions]);

  // Entrance animations
  useEffect(() => {
    headerScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    headerOpacity.value = withTiming(1, { duration: 600 });
    balanceScale.value = withSequence(
      withTiming(1.1, { duration: 400 }),
      withSpring(1, { damping: 12 })
    );
  }, []);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
    opacity: headerOpacity.value,
  }));

  const balanceAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: balanceScale.value }],
  }));

  // Affichage du loader initial - inclure aussi authLoading
  if (authLoading || (accountsLoading && accounts.length === 0)) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.text, marginTop: 16 }}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Gradient Header */}
      <LinearGradient
        colors={['#0066FF', '#0052CC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.avatar}
            >
              <Ionicons name="diamond" size={20} color="#fff" />
            </LinearGradient>
            <View>
              <Text style={styles.greetingSmall}>Bonjour,</Text>
              <Text style={styles.greeting}>{client?.firstName || 'Utilisateur'}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable 
              onPress={() => router.push('/(screens)/account-settings' as any)}
              style={styles.settingsButton}
            >
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </Pressable>
            <Pressable 
              onPress={() => router.push('/(screens)/notifications')}
              style={styles.notificationButton}
            >
              <Ionicons name="notifications" size={24} color="#fff" />
              {unreadCount > 0 && (
                <PremiumBadge
                  text={unreadCount.toString()}
                  variant="error"
                  size="small"
                  style={styles.notificationBadge}
                />
              )}
            </Pressable>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >

        {/* Premium Balance Card */}
        <PremiumCard 
          style={[styles.balanceCard, { backgroundColor: colors.card }]}
          elevated
          delay={0}
        >
          <View style={styles.balanceHeader}>
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
              SOLDE TOTAL
            </Text>
            <Pressable 
              onPress={() => setBalanceVisible(!balanceVisible)}
              style={styles.eyeButton}
            >
              <Ionicons 
                name={balanceVisible ? 'eye' : 'eye-off'} 
                size={20} 
                color={colors.textSecondary} 
              />
            </Pressable>
          </View>
          
          <Animated.View style={balanceAnimatedStyle}>
            <Text style={[styles.balanceAmount, { color: colors.text }]}>
              {balanceVisible 
                ? `${totalBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
                : '••••••'
              }
            </Text>
          </Animated.View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.balanceStatsScroll}
          >
            <PremiumStat
              icon="trending-up"
              label="Revenus"
              value={`+${monthlyIncome.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`}
              colors={['#34C759', '#28A745']}
              variant="vertical"
              style={styles.statItem}
            />
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <PremiumStat
              icon="trending-down"
              label="Dépenses"
              value={`-${monthlyExpenses.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`}
              colors={['#FF3B30', '#CC2E26']}
              variant="vertical"
              style={styles.statItem}
            />
          </ScrollView>
        </PremiumCard>

        {/* Premium Account Cards */}
        <View style={styles.accountsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Mes Comptes</Text>
            <Pressable>
              <Ionicons name="add-circle" size={22} color={colors.primary} />
            </Pressable>
          </View>
          
          {accounts.length > 0 ? (
            accounts.map((account, index) => (
              <PremiumAccountCard
                key={account.id}
                name={account.accountType === 'CHECKING' ? 'Compte Courant' : account.accountType === 'SAVINGS' ? 'Compte Épargne' : 'Compte Business'}
                number={`**** ${account.accountNumber.slice(-4)}`}
                balance={account.balance}
                icon={account.accountType === 'CHECKING' ? 'card' : 'wallet'}
                colors={account.accountType === 'CHECKING' ? ['#0066FF', '#0052CC'] : ['#667EEA', '#764BA2']}
                balanceVisible={balanceVisible}
                onPress={() => router.push(`/(screens)/account-details?id=${account.id}` as any)}
                delay={200 + index * 100}
                style={styles.accountCard}
              />
            ))
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary }}>Aucun compte disponible</Text>
            </View>
          )}
        </View>

        {/* Premium Action Buttons */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.actionButtons}
        >
          <Pressable 
            style={({ pressed }) => [
              styles.actionBtn,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }
            ]}
            onPress={() => router.push('/(screens)/new-transfer' as any)}
          >
            <LinearGradient
              colors={['#0066FF', '#0052CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionBtnGradient}
            >
              <Ionicons name="paper-plane" size={24} color="#fff" />
            </LinearGradient>
            <Text style={[styles.actionBtnText, { color: colors.text }]}>Virement</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.actionBtn,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }
            ]}
            onPress={() => router.push('/statistics' as any)}
          >
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionBtnGradient}
            >
              <Ionicons name="stats-chart" size={24} color="#fff" />
            </LinearGradient>
            <Text style={[styles.actionBtnText, { color: colors.text }]}>Stats</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.actionBtn,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }
            ]}
            onPress={() => router.push('/(screens)/deposit' as any)}
          >
            <LinearGradient
              colors={['#34C759', '#28A745']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionBtnGradient}
            >
              <Ionicons name="wallet" size={24} color="#fff" />
            </LinearGradient>
            <Text style={[styles.actionBtnText, { color: colors.text }]}>Dépôt</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.actionBtn,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }
            ]}
          >
            <LinearGradient
              colors={['#FF9500', '#FF6B00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionBtnGradient}
            >
              <Ionicons name="grid" size={24} color="#fff" />
            </LinearGradient>
            <Text style={[styles.actionBtnText, { color: colors.text }]}>Plus</Text>
          </Pressable>
        </Animated.View>

        {/* Premium Recent Activity */}
        <View style={styles.recentActivity}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Activité Récente</Text>
            <Pressable onPress={() => router.push('/(screens)/transaction-history' as any)}>
              <Text style={styles.viewAllText}>Tout voir →</Text>
            </Pressable>
          </View>

          {recentActivity.length > 0 ? (
            recentActivity.map((transaction, index) => {
              const isPositive = transaction.type === 'DEPOSIT';
              const displayAmount = isPositive ? transaction.amount : -transaction.amount;
              
              return (
                <PremiumTransactionItem
                  key={transaction.id}
                  name={transaction.description || `Transaction #${transaction.id}`}
                  category={transaction.type}
                  date={new Date(transaction.createdAt!).toLocaleDateString('fr-FR')}
                  amount={displayAmount}
                  icon={transaction.type === 'DEPOSIT' ? 'arrow-down' : transaction.type === 'WITHDRAWAL' ? 'arrow-up' : 'swap-horizontal'}
                  delay={400 + index * 80}
                  style={styles.transactionItem}
                />
              );
            })
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary }}>Aucune transaction récente</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Premium FAB */}
      <View style={styles.fabContainer}>
        <PremiumFAB
          icon="add"
          onPress={() => router.push('/new-transfer' as any)}
          colors={['#0066FF', '#0052CC']}
          size={64}
          iconSize={32}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  // Premium Header
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greetingSmall: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  // Premium Balance Card
  balanceCard: {
    marginHorizontal: 20,
    marginTop: -10,
    marginBottom: 0,
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eyeButton: {
    padding: 8,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -1.5,
  },
  balanceStatsScroll: {
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
  // Premium Account Cards
  accountsSection: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  accountCard: {
    marginBottom: 16,
  },
  // Premium Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 10,
  },
  actionBtnGradient: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionBtnIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1A2942',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  // Premium Recent Activity
  recentActivity: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
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
  // Premium FAB
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
});
