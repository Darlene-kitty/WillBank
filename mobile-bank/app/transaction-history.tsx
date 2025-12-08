import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/contexts/theme-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function TransactionHistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [filter, setFilter] = useState('Tous');

  const transactions = [
    { id: 1, name: 'Achat par carte - Starbucks', amount: -5.50, date: 'Aujourd\'hui', time: '10:42', type: 'Virement', icon: 'cart' },
    { id: 2, name: 'Virement reçu - Jane...', amount: 250.00, date: 'Aujourd\'hui', time: '09:15', type: 'Dépôt', icon: 'arrow-down' },
    { id: 3, name: 'Paiement - Le Bistrot...', amount: -85.30, date: 'Hier', time: '20:15', type: 'Paiement', icon: 'restaurant' },
    { id: 4, name: 'Retrait DAB', amount: -50.00, date: 'Hier', time: '12:30', type: 'Retrait', icon: 'cash' },
    { id: 5, name: 'Dépôt - Salaire Octobre', amount: 2300.00, date: '15 Octobre 2023', time: '08:00', type: 'Dépôt', icon: 'arrow-down' },
    { id: 6, name: 'Virement envoyé - Loyer', amount: -750.00, date: '15 Octobre 2023', time: '08:05', type: 'Virement', icon: 'arrow-up' },
  ];

  const filters = ['Tous', 'Virement', 'Dépôt', 'Retrait', 'Paiement'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Pressable 
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Historique</Text>
        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Period Selector */}
      <View style={styles.periodContainer}>
        <Pressable 
          style={({ pressed }) => [
            styles.periodSelector,
            { 
              backgroundColor: colors.card,
              opacity: pressed ? 0.7 : 1 
            }
          ]}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.text} />
          <Text style={[styles.periodText, { color: colors.text }]}>30 derniers jours</Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </Pressable>
        <Pressable 
          style={({ pressed }) => [
            styles.filterIcon,
            { 
              backgroundColor: colors.card,
              opacity: pressed ? 0.7 : 1 
            }
          ]}
        >
          <Ionicons name="options-outline" size={20} color={colors.text} />
        </Pressable>
      </View>

      {/* Filters */}
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
              filter === item && [styles.filterBtnActive, { backgroundColor: colors.primary }],
              { 
                backgroundColor: filter === item ? colors.primary : colors.card,
                opacity: pressed ? 0.7 : 1 
              }
            ]}
            onPress={() => setFilter(item)}
          >
            <Text style={[
              styles.filterText,
              { color: filter === item ? '#fff' : colors.text }
            ]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Transactions List */}
      <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false}>
        {transactions.map((transaction) => (
          <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
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
              {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} €
            </Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2942',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  filtersContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1A2942',
  },
  filterBtnActive: {
    backgroundColor: '#3B9EFF',
  },
  filterText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
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
    flex: 1,
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
  periodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  periodSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  periodText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  filterIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
