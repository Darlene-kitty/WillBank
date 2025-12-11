import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import { useTheme } from '@/contexts/theme-context';
import { useAuthContext } from '@/contexts/auth-context';
import { useAccounts, useTransactions } from '@/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { 
  PremiumCard, 
  PremiumTransactionItem,
  PremiumStat,
  PremiumDivider,
  PremiumBadge
} from '@/components/shared';

export default function TransactionHistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { clientId } = useAuthContext();
  const { accounts } = useAccounts(clientId);
  const { transactions: rawTransactions } = useTransactions(accounts[0]?.id);
  const [filter, setFilter] = useState('Tous');
  const [period, setPeriod] = useState('30 derniers jours');

  // Transformer les transactions pour l'affichage
  const transactions = rawTransactions.map(tx => {
    const isPositive = tx.type === 'DEPOSIT';
    const displayAmount = isPositive ? tx.amount : -tx.amount;
    
    return {
      id: tx.id,
      name: tx.description || `Transaction #${tx.id}`,
      amount: displayAmount,
      date: new Date(tx.createdAt!).toLocaleDateString('fr-FR'),
      category: tx.type === 'DEPOSIT' ? 'Revenu' : 
                tx.type === 'WITHDRAWAL' ? 'Retrait' : 'Virement',
      icon: tx.type === 'DEPOSIT' ? 'cash' : 
            tx.type === 'WITHDRAWAL' ? 'cash' : 'swap-horizontal'
    };
  });

  const filters = ['Tous', 'Revenus', 'Dépenses', 'Shopping', 'Restaurant', 'Transport'];

  // Calcul des stats
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const transactionCount = transactions.length;

  // Filtrage des transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'Tous') return true;
    if (filter === 'Revenus') return transaction.amount > 0;
    if (filter === 'Dépenses') return transaction.amount < 0;
    return transaction.category === filter;
  });

  // Groupement par date
  const groupedTransactions = filteredTransactions.reduce((groups: any, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  const handleShare = () => {
    Alert.alert('Partager', 'Fonctionnalité de partage à venir');
  };

  const handlePeriodChange = () => {
    Alert.alert('Période', 'Sélection de période à venir');
  };

  const handleAdvancedFilters = () => {
    Alert.alert('Filtres', 'Filtres avancés à venir');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Gradient Header */}
      <LinearGradient
        colors={['#667EEA', '#0066FF']}
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
          <Text style={styles.headerTitle}>Historique</Text>
          <Pressable 
            onPress={handleShare}
            style={styles.shareButton}
          >
            <Ionicons name="share-outline" size={22} color="#fff" />
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Stats */}
        <PremiumCard 
          style={[styles.summaryCard, { backgroundColor: colors.card }]}
          elevated
          delay={0}
        >
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
            VUE D'ENSEMBLE
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.summaryScrollContent}
          >
            <PremiumStat
              icon="arrow-up-circle"
              label="Revenus"
              value={`${totalIncome.toFixed(2)} €`}
              colors={['#34C759', '#28A745']}
              variant="vertical"
              style={styles.statItem}
            />

            <PremiumDivider 
              variant="solid" 
              thickness={1}
              spacing={0}
              style={styles.verticalDivider}
            />

            <PremiumStat
              icon="arrow-down-circle"
              label="Dépenses"
              value={`${totalExpenses.toFixed(2)} €`}
              colors={['#FF3B30', '#CC2E26']}
              variant="vertical"
              style={styles.statItem}
            />

            <PremiumDivider 
              variant="solid" 
              thickness={1}
              spacing={0}
              style={styles.verticalDivider}
            />

            <PremiumStat
              icon="receipt"
              label="Total"
              value={`${transactionCount}`}
              colors={['#667EEA', '#0066FF']}
              variant="vertical"
              style={styles.statItem}
            />
          </ScrollView>
        </PremiumCard>

        {/* Period & Filters */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.controlsContainer}
        >
          <Pressable 
            style={({ pressed }) => [
              styles.periodSelector,
              { 
                backgroundColor: colors.card,
                opacity: pressed ? 0.8 : 1 
              }
            ]}
            onPress={handlePeriodChange}
          >
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={[styles.periodText, { color: colors.text }]}>{period}</Text>
            <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.filterIconBtn,
              { 
                backgroundColor: colors.card,
                opacity: pressed ? 0.8 : 1 
              }
            ]}
            onPress={handleAdvancedFilters}
          >
            <Ionicons name="options-outline" size={20} color={colors.primary} />
          </Pressable>
        </Animated.View>

        {/* Category Filters */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {filters.map((item) => (
              <Pressable
                key={item}
                style={({ pressed }) => [
                  styles.filterBtn,
                  { 
                    opacity: pressed ? 0.8 : 1 
                  }
                ]}
                onPress={() => setFilter(item)}
              >
                {filter === item ? (
                  <LinearGradient
                    colors={['#667EEA', '#0066FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.filterBtnGradient}
                  >
                    <Text style={styles.filterTextActive}>{item}</Text>
                    {item !== 'Tous' && (
                      <View style={styles.filterBadge}>
                        <Text style={styles.filterBadgeText}>
                          {filteredTransactions.length}
                        </Text>
                      </View>
                    )}
                  </LinearGradient>
                ) : (
                  <View style={[styles.filterBtnInactive, { backgroundColor: colors.card }]}>
                    <Text style={[styles.filterText, { color: colors.text }]}>{item}</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Transactions List Grouped by Date */}
        <View style={styles.transactionsList}>
          {Object.keys(groupedTransactions).map((date, groupIndex) => (
            <Animated.View 
              key={date}
              entering={FadeInDown.delay(200 + groupIndex * 50).duration(400)}
            >
              {/* Date Header */}
              <View style={styles.dateHeader}>
                <Text style={[styles.dateText, { color: colors.text }]}>{date}</Text>
                <View style={[styles.dateLine, { backgroundColor: colors.border }]} />
              </View>

              {/* Transactions for this date */}
              {groupedTransactions[date].map((transaction: any, index: number) => (
                <PremiumTransactionItem
                  key={transaction.id}
                  name={transaction.name}
                  category={transaction.category}
                  date={transaction.date}
                  amount={transaction.amount}
                  icon={transaction.icon as any}
                  delay={0}
                  style={styles.transactionItem}
                />
              ))}
            </Animated.View>
          ))}

          {filteredTransactions.length === 0 && (
            <Animated.View 
              entering={FadeInDown.delay(200).duration(400)}
              style={styles.emptyState}
            >
              <Ionicons name="receipt-outline" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Aucune transaction
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Aucune transaction trouvée pour ce filtre
              </Text>
            </Animated.View>
          )}
        </View>

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
  shareButton: {
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
  // Summary Card
  summaryCard: {
    padding: 20,
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  summaryScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 20,
  },
  statItem: {
    minWidth: 100,
  },
  verticalDivider: {
    width: 1,
    height: 60,
  },
  // Controls
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  periodSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  periodText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  filterIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  // Filters
  filtersContainer: {
    marginBottom: 20,
  },
  filtersContent: {
    gap: 10,
  },
  filterBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  filterBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterBtnInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  filterTextActive: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  // Transactions List
  transactionsList: {
    flex: 1,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  dateLine: {
    flex: 1,
    height: 1,
  },
  transactionItem: {
    marginBottom: 12,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  filterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
