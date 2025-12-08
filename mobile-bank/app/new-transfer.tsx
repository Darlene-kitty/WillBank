import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function NewTransferScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [amount, setAmount] = useState('0');
  const [selectedAccount, setSelectedAccount] = useState('Compte Courant (...1234)');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('');
  const [reference, setReference] = useState('');

  const beneficiaries = [
    { id: 1, name: 'Jean Dupont', initials: 'JD' },
    { id: 2, name: 'Marie Curie', initials: 'MC' },
    { id: 3, name: 'Louis Pasteur', initials: 'LP' },
  ];

  const handleContinue = () => {
    router.push({
      pathname: '/transfer-confirmation',
      params: {
        amount,
        account: selectedAccount,
        beneficiary: selectedBeneficiary || 'Alexandre Dupont',
        reference: reference || 'Loyer Appartement'
      }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable 
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Nouveau Virement</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          entering={FadeInDown.duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Depuis votre compte</Text>
          <Pressable 
            style={({ pressed }) => [
              styles.selectButton, 
              { 
                backgroundColor: colors.card,
                opacity: pressed ? 0.7 : 1 
              }
            ]}
          >
            <View style={styles.selectLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="business" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.selectText, { color: colors.text }]}>Compte Courant</Text>
                <Text style={[styles.selectSubtext, { color: colors.textSecondary }]}>Solde: 1234,56 €</Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </Pressable>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Vers</Text>
          <Pressable 
            style={({ pressed }) => [
              styles.selectButton,
              { 
                backgroundColor: colors.card,
                opacity: pressed ? 0.7 : 1 
              }
            ]}
            onPress={() => router.push('/beneficiaries')}
          >
            <View style={styles.selectLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="person" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.selectText, { color: colors.text }]}>
                {selectedBeneficiary || 'Sélectionner un bénéficiaire'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.addBeneficiaryBtn,
              { opacity: pressed ? 0.7 : 1 }
            ]}
            onPress={() => router.push('/add-beneficiary-modal')}
          >
            <Text style={[styles.addBeneficiaryText, { color: colors.primary }]}>+ Nouveau bénéficiaire</Text>
          </Pressable>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Montant</Text>
          <View style={styles.amountContainer}>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#8E8E93"
            />
            <Text style={styles.currency}>€</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Référence (Optionnel)</Text>
          <TextInput
            style={styles.textInput}
            value={reference}
            onChangeText={setReference}
            placeholder="Ex: Loyer, Facture..."
            placeholderTextColor="#8E8E93"
          />
        </View>

        <Pressable 
          style={({ pressed }) => [
            styles.continueButton,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continuer</Text>
        </Pressable>

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
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  selectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectText: {
    fontSize: 16,
  },
  selectSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  addBeneficiaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 8,
  },
  addBeneficiaryText: {
    color: '#3B9EFF',
    fontSize: 14,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2942',
    padding: 20,
    borderRadius: 12,
  },
  amountInput: {
    flex: 1,
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  currency: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  textInput: {
    backgroundColor: '#1A2942',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#3B9EFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
