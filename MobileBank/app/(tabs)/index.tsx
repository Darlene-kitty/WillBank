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
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  // Animation values
  const headerScale = useSharedValue(0.9);
  const headerOpacity = useSharedValue(0);
  const balanceScale = useSharedValue(0);
  const [balanceVisible, setBalanceVisible] = React.useState(true);

  const accounts = [
    { id: 1, name: 'Compte Courant', number: '**** 1234', balance: 10110.00, icon: 'card', color: '#0066FF' },
    { id: 2, name: 'Épargne Premium', number: '**** 5678', balance: 5120.50, icon: 'wallet', color: '#667EEA' },
  ];

  const recentActivity = [
    { id: 1, name: 'Apple Store', date: "Aujourd'hui", amount: -999.00, icon: 'bag-handle', category: 'Shopping' },
    { id: 2, name: 'Starbucks', date: 'Hier', amount: -6.50, icon: 'cafe', category: 'Restaurant' },
    { id: 3, name: 'Salaire', date: '15 Mar 2024', amount: 2500.00, icon: 'cash', category: 'Revenu' },
    { id: 4, name: 'Transport', date: '14 Mar 2024', amount: -2.75, icon: 'bus', category: 'Transport' },
  ];

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
              <Text style={styles.greeting}>William</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable 
              onPress={() => router.push('/account-settings' as any)}
              style={styles.settingsButton}
            >
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </Pressable>
            <Pressable 
              onPress={() => router.push('/notifications')}
              style={styles.notificationButton}
            >
              <Ionicons name="notifications" size={24} color="#fff" />
              <PremiumBadge
                text="3"
                variant="error"
                size="small"
                style={styles.notificationBadge}
              />
            </Pressable>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

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
          
          {accounts.map((account, index) => (
            <PremiumAccountCard
              key={account.id}
              name={account.name}
              number={account.number}
              balance={account.balance}
              icon={account.icon as any}
              colors={[account.color, account.color + 'CC']}
              balanceVisible={balanceVisible}
              onPress={() => router.push(`/account-details?id=${account.id}` as any)}
              delay={200 + index * 100}
              style={styles.accountCard}
            />
          ))}
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
            onPress={() => router.push('/new-transfer' as any)}
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
            onPress={() => router.push('/deposit' as any)}
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
            <Pressable onPress={() => router.push('/transaction-history' as any)}>
              <Text style={styles.viewAllText}>Tout voir →</Text>
            </Pressable>
          </View>

          {recentActivity.map((transaction, index) => (
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
    </SafeAreaView>
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
    paddingTop: 10,
    paddingBottom: 20,
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
