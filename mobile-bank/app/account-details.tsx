import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/theme-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AccountDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

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
        <Text style={styles.headerTitle}>Détails du Compte</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance */}
        <Animated.View 
          entering={FadeInDown.duration(400)}
          style={[styles.balanceSection, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
            Solde actuel sur le Compte Courant
          </Text>
          <Text style={[styles.balanceAmount, { color: colors.text }]}>1 234,56 €</Text>
        </Animated.View>

        {/* Account Info */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={[styles.infoCard, { backgroundColor: colors.card }]}
        >
          <Pressable 
            style={({ pressed }) => [
              styles.infoRow,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <View style={styles.infoLeft}>
              <View style={[styles.iconBg, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="card" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Numéro de compte</Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={[styles.infoValue, { color: colors.text }]}>FRXX XXXX XXXX XXXX XX12 345</Text>
              <Ionicons name="copy-outline" size={18} color={colors.textSecondary} />
            </View>
          </Pressable>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Pressable 
            style={({ pressed }) => [
              styles.infoRow,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <View style={styles.infoLeft}>
              <View style={[styles.iconBg, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="business" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.infoLabel, { color: colors.text }]}>IBAN</Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={[styles.infoValue, { color: colors.text }]}>FR76 XXXX XXXX XXXX XX123</Text>
              <Ionicons name="copy-outline" size={18} color={colors.textSecondary} />
            </View>
          </Pressable>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <View style={[styles.iconBg, { backgroundColor: '#34C75920' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              </View>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Statut</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Actif</Text>
            </View>
          </View>
        </Animated.View>

        {/* Transaction History Button */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Pressable 
            style={({ pressed }) => [
              styles.historyButton,
              { 
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1 
              }
            ]}
            onPress={() => router.push('/transaction-history')}
          >
            <Ionicons name="receipt-outline" size={20} color="#fff" />
            <Text style={styles.historyButtonText}>Voir l'historique des transactions</Text>
          </Pressable>
        </Animated.View>

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  balanceSection: {
    backgroundColor: '#1A2942',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  balanceLabel: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 12,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#1A2942',
    borderRadius: 16,
    padding: 20,
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    color: '#8E8E93',
    fontSize: 14,
  },
  infoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A3A52',
  },
  statusBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  historyButton: {
    backgroundColor: '#3B9EFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
