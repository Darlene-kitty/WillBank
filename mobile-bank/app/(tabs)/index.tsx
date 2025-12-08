import { AnimatedCard } from '@/components/animated-card';
import { AnimatedFAB } from '@/components/animated-fab';
import { useTheme } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';
import { useAccounts } from '@/hooks/useAccounts';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { accounts, loading, error, loadAccountsByClient, refreshing, onRefresh } = useAccounts();

  useEffect(() => {
    if (user?.id) {
      loadAccountsByClient(user.id);
    }
  }, [user]);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const getAccountIcon = (accountType: string) => {
    switch (accountType) {
      case 'SAVINGS':
        return '🏦';
      case 'CHECKING':
        return '💳';
      default:
        return '💰';
    }
  };

  const formatAccountNumber = (accountNumber: string) => {
    return `**** ${accountNumber.slice(-4)}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {user?.firstName?.[0] || 'W'}
              </Text>
            </View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Bonjour, {user?.firstName || 'Client'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <AnimatedCard style={[styles.balanceCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Solde Total</Text>
          <Text style={[styles.balanceAmount, { color: colors.text }]}>
            {totalBalance.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
          </Text>
          
          {loading && accounts.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Chargement de vos comptes...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : accounts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="card-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Aucun compte disponible
              </Text>
            </View>
          ) : (
            accounts.map((account, index) => (
              <Pressable 
                key={account.id} 
                style={({ pressed }) => [
                  styles.accountItem, 
                  { 
                    backgroundColor: colors.cardSecondary,
                    opacity: pressed ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  }
                ]}
                onPress={() => router.push(`/account-details?id=${account.id}`)}
              >
                <View style={styles.accountLeft}>
                  <View style={[styles.accountIcon, { backgroundColor: colors.primary }]}>
                    <Text style={styles.accountIconText}>{getAccountIcon(account.accountType)}</Text>
                  </View>
                  <View>
                    <Text style={[styles.accountName, { color: colors.text }]}>
                      {account.accountType === 'SAVINGS' ? 'Compte Épargne' : 'Compte Courant'}
                    </Text>
                    <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>
                      {formatAccountNumber(account.accountNumber)}
                    </Text>
                  </View>
                </View>
                <View style={styles.accountRight}>
                  <Text style={[styles.accountBalance, { color: colors.text }]}>
                    {account.balance.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
                  </Text>
                  <View style={[styles.statusBadge, { 
                    backgroundColor: account.status === 'ACTIVE' ? '#22c55e20' : '#ef444420' 
                  }]}>
                    <Text style={[styles.statusText, { 
                      color: account.status === 'ACTIVE' ? '#22c55e' : '#ef4444' 
                    }]}>
                      {account.status === 'ACTIVE' ? 'Actif' : 'Bloqué'}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </AnimatedCard>

        <Pressable 
          style={({ pressed }) => [
            styles.quickTransferBtn,
            { 
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            }
          ]}
          onPress={() => router.push('/new-transfer')}
        >
          <Ionicons name="play" size={16} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.quickTransferText}>Quick Transfer</Text>
        </Pressable>

        <Animated.View 
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.actionButtons}
        >
          <Pressable 
            style={({ pressed }) => [
              styles.actionBtn,
              { opacity: pressed ? 0.7 : 1 }
            ]}
            onPress={() => router.push('/new-transfer')}
          >
            <View style={styles.actionBtnIcon}>
              <Ionicons name="arrow-forward" size={24} color="#3B9EFF" />
            </View>
            <Text style={styles.actionBtnText}>Transfer</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.actionBtn,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <View style={styles.actionBtnIcon}>
              <Ionicons name="card-outline" size={24} color="#3B9EFF" />
            </View>
            <Text style={styles.actionBtnText}>Pay Bills</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.actionBtn,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <View style={styles.actionBtnIcon}>
              <Ionicons name="wallet-outline" size={24} color="#3B9EFF" />
            </View>
            <Text style={styles.actionBtnText}>Deposit</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.actionBtn,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <View style={styles.actionBtnIcon}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#3B9EFF" />
            </View>
            <Text style={styles.actionBtnText}>More</Text>
          </Pressable>
        </Animated.View>

        {/* Note: Transactions history will be implemented with backend integration */}
        
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.fabContainer}>
        <AnimatedFAB 
          onPress={() => router.push('/new-transfer')}
          icon="add"
          color={colors.primary}
        />
      </View>

      <View style={[styles.bottomNav, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid" size={24} color={colors.primary} />
          <Text style={[styles.navText, { color: colors.primary }]}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/new-transfer')}>
          <Ionicons name="swap-horizontal" size={24} color={colors.textSecondary} />
          <Text style={[styles.navText, { color: colors.textSecondary }]}>Transfers</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="card-outline" size={24} color={colors.textSecondary} />
          <Text style={[styles.navText, { color: colors.textSecondary }]}>Cards</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Ionicons name="time-outline" size={24} color={colors.textSecondary} />
          <Text style={[styles.navText, { color: colors.textSecondary }]}>Support</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
  },
  balanceCard: {
    margin: 20,
    marginTop: 10,
    padding: 24,
    borderRadius: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eyeButton: {
    padding: 4,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 24,
    letterSpacing: -1,
  },
  accountsContainer: {
    gap: 12,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountIconText: {
    fontSize: 24,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 13,
  },
  accountRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  accountBalance: {
    fontSize: 18,
    fontWeight: '700',
  },
  accountRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
  },
  quickTransferBtn: {
    backgroundColor: '#3B9EFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  quickTransferText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 20,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 8,
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
    color: '#fff',
    fontSize: 12,
  },
  recentActivity: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  viewAllText: {
    color: '#3B9EFF',
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A2942',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F1E35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionIconText: {
    fontSize: 20,
  },
  transactionName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDate: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: '#34C759',
  },
  negativeAmount: {
    color: '#FF3B30',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 100,
  },
  bottomNav: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 12,
  },
});
