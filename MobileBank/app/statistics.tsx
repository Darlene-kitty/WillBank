import { 
  PremiumCard, 
  PremiumChart, 
  PremiumStat,
  PremiumIcon,
  PremiumDivider
} from '@/components/shared';
import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

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
          <Text style={styles.headerTitle}>Statistiques</Text>
          <Pressable style={styles.calendarButton}>
            <Ionicons name="calendar-outline" size={22} color="#fff" />
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
              icon="wallet"
              label="Épargne"
              value={`${savings.toFixed(2)} €`}
              colors={['#667EEA', '#0066FF']}
              variant="vertical"
              style={styles.statItem}
            />
          </ScrollView>
        </PremiumCard>

        {/* Expenses by Category */}
        <PremiumCard 
          style={[styles.chartCard, { backgroundColor: colors.card }]}
          elevated
          delay={100}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Dépenses par Catégorie
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Ce mois
              </Text>
            </View>
            <LinearGradient
              colors={['#FF3B30', '#CC2E26']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.chartIconContainer}
            >
              <Ionicons name="pie-chart" size={20} color="#fff" />
            </LinearGradient>
          </View>
          
          <PremiumChart 
            data={expenseData.map(item => item.value)} 
            colors={['#FF3B30', '#CC2E26']}
            height={180}
            showGradient
          />
          
          {/* Category Legend */}
          <View style={styles.legendContainer}>
            {expenseData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </PremiumCard>

        {/* Monthly Trend */}
        <PremiumCard 
          style={[styles.chartCard, { backgroundColor: colors.card }]}
          elevated
          delay={200}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Tendance Mensuelle
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                6 derniers mois
              </Text>
            </View>
            <LinearGradient
              colors={['#0066FF', '#0052CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.chartIconContainer}
            >
              <Ionicons name="trending-up" size={20} color="#fff" />
            </LinearGradient>
          </View>
          
          <PremiumChart 
            data={monthlyData.map(item => item.value)} 
            colors={['#0066FF', '#0052CC']}
            height={180}
            showGradient
          />
          
          {/* Month Labels */}
          <View style={styles.monthLabels}>
            {monthlyData.map((item, index) => (
              <Text key={index} style={[styles.monthLabel, { color: colors.textSecondary }]}>
                {item.label}
              </Text>
            ))}
          </View>
        </PremiumCard>

        {/* Top Expenses */}
        <PremiumCard 
          style={[styles.expensesCard, { backgroundColor: colors.card }]}
          elevated
          delay={300}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Principales Dépenses
          </Text>
          
          <View style={styles.expensesList}>
            {[
              { name: 'Loyer', amount: 850.00, icon: 'home', colors: ['#34C759', '#28A745'] },
              { name: 'Courses', amount: 450.50, icon: 'cart', colors: ['#FF3B30', '#CC2E26'] },
              { name: 'Restaurant', amount: 280.75, icon: 'restaurant', colors: ['#FF9500', '#FF6B00'] },
            ].map((expense, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.expenseItem,
                  { 
                    backgroundColor: colors.backgroundSecondary,
                    opacity: pressed ? 0.8 : 1,
                  }
                ]}
              >
                <View style={styles.expenseLeft}>
                  <PremiumIcon
                    name={expense.icon as any}
                    size={44}
                    iconSize={22}
                    colors={expense.colors}
                    shape="rounded"
                  />
                  <Text style={[styles.expenseName, { color: colors.text }]}>
                    {expense.name}
                  </Text>
                </View>
                <View style={styles.expenseRight}>
                  <Text style={[styles.expenseAmount, { color: colors.text }]}>
                    {expense.amount.toFixed(2)} €
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </View>
              </Pressable>
            ))}
          </View>
        </PremiumCard>

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
  calendarButton: {
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
  summaryCard: {
    padding: 20,
    marginBottom: 16,
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
  chartCard: {
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '500',
  },
  monthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  monthLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  expensesCard: {
    padding: 20,
    marginBottom: 16,
  },
  expensesList: {
    gap: 12,
    marginTop: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  expenseName: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  expenseRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
