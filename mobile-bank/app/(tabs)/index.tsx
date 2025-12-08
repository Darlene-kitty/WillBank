import { AnimatedCard } from '@/components/animated-card';
import { AnimatedFAB } from '@/components/animated-fab';
import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const accounts = [
    { id: 1, name: 'Everyday Checking', number: '**** 1234', balance: 10110.00, icon: '💳' },
    { id: 2, name: 'High-Yield Savings', number: '**** 5678', balance: 5120.50, icon: '🏦' },
  ];

  const recentActivity = [
    { id: 1, name: 'Apple Store', date: 'Today', amount: -999.00, icon: '🛍️' },
    { id: 2, name: 'Starbucks', date: 'Yesterday', amount: -6.50, icon: '🍴' },
    { id: 3, name: 'Direct Deposit', date: 'Mar 15, 2024', amount: 2500.00, icon: '💵' },
    { id: 4, name: 'Metro Transit', date: 'Mar 14, 2024', amount: -2.75, icon: '🚌' },
  ];

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>W</Text>
            </View>
            <Text style={[styles.greeting, { color: colors.text }]}>Good morning, Will</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <AnimatedCard style={[styles.balanceCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Total Balance</Text>
          <Text style={[styles.balanceAmount, { color: colors.text }]}>
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          
          {accounts.map((account, index) => (
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
                  <Text style={styles.accountIconText}>{account.icon}</Text>
                </View>
                <View>
                  <Text style={[styles.accountName, { color: colors.text }]}>{account.name}</Text>
                  <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>{account.number}</Text>
                </View>
              </View>
              <Text style={[styles.accountBalance, { color: colors.text }]}>
                ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </Pressable>
          ))}
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

        <View style={styles.recentActivity}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/transaction-history')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentActivity.map((transaction, index) => (
            <Animated.View 
              key={transaction.id} 
              entering={FadeInDown.delay(300 + index * 50).duration(400)}
            >
              <Pressable 
                style={({ pressed }) => [
                  styles.transactionItem,
                  { opacity: pressed ? 0.7 : 1 }
                ]}
              >
                <View style={styles.transactionLeft}>
                  <View style={styles.transactionIcon}>
                    <Text style={styles.transactionIconText}>{transaction.icon}</Text>
                  </View>
                  <View>
                    <Text style={styles.transactionName}>{transaction.name}</Text>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                  </View>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  transaction.amount > 0 ? styles.positiveAmount : styles.negativeAmount
                ]}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>

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
    fontSize: 16,
    fontWeight: '700',
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
