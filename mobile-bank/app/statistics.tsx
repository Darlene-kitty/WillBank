import { AnimatedCard } from '@/components/animated-card';
import { AnimatedChart } from '@/components/animated-chart';
import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StatisticsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const expenseData = [
    { label: 'Alimentation', value: 450.50, color: '#FF3B30' },
    { label: 'Transport', value: 120.00, color: '#FF9500' },
    { label: 'Loisirs', value: 280.75, color: '#3B9EFF' },
    { label: 'Logement', value: 850.00, color: '#34C759' },
    { label: 'Santé', value: 95.20, color: '#AF52DE' },
  ];

  const monthlyData = [
    { label: 'Jan', value: 2500, color: '#3B9EFF' },
    { label: 'Fév', value: 2800, color: '#3B9EFF' },
    { label: 'Mar', value: 2200, color: '#3B9EFF' },
    { label: 'Avr', value: 3100, color: '#3B9EFF' },
    { label: 'Mai', value: 2900, color: '#3B9EFF' },
    { label: 'Juin', value: 3200, color: '#3B9EFF' },
  ];

  const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);
  const totalIncome = 4500.00;
  const savings = totalIncome - totalExpenses;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Statistiques</Text>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <AnimatedCard style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-down-circle" size={32} color="#FF3B30" />
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Dépenses</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${totalExpenses.toFixed(2)}
            </Text>
          </AnimatedCard>

          <AnimatedCard style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-up-circle" size={32} color="#34C759" />
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Revenus</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${totalIncome.toFixed(2)}
            </Text>
          </AnimatedCard>

          <AnimatedCard style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Ionicons name="wallet" size={32} color="#3B9EFF" />
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Épargne</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${savings.toFixed(2)}
            </Text>
          </AnimatedCard>
        </View>

        {/* Expenses by Category */}
        <AnimatedCard style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Dépenses par Catégorie
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Ce mois
            </Text>
          </View>
          <AnimatedChart data={expenseData} />
        </AnimatedCard>

        {/* Monthly Trend */}
        <AnimatedCard style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Tendance Mensuelle
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              6 derniers mois
            </Text>
          </View>
          <AnimatedChart data={monthlyData} />
        </AnimatedCard>

        {/* Top Expenses */}
        <AnimatedCard style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Principales Dépenses
          </Text>
          <View style={styles.expensesList}>
            {[
              { name: 'Loyer', amount: 850.00, icon: 'home', color: '#34C759' },
              { name: 'Courses', amount: 450.50, icon: 'cart', color: '#FF3B30' },
              { name: 'Restaurant', amount: 280.75, icon: 'restaurant', color: '#FF9500' },
            ].map((expense, index) => (
              <View key={index} style={styles.expenseItem}>
                <View style={styles.expenseLeft}>
                  <View style={[styles.expenseIcon, { backgroundColor: expense.color + '20' }]}>
                    <Ionicons name={expense.icon as any} size={20} color={expense.color} />
                  </View>
                  <Text style={[styles.expenseName, { color: colors.text }]}>
                    {expense.name}
                  </Text>
                </View>
                <Text style={[styles.expenseAmount, { color: colors.text }]}>
                  ${expense.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </AnimatedCard>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  expensesList: {
    gap: 16,
    marginTop: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '500',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
