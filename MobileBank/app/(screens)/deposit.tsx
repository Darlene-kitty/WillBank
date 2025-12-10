import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumCard, PremiumInput, PremiumButton, PremiumIcon } from '@/components/shared';

export default function DepositScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('Compte Courant');
  const [depositMethod, setDepositMethod] = useState('');
  const [reference, setReference] = useState('');

  const accounts = [
    { id: 1, name: 'Compte Courant', number: '**** 1234', balance: 10110.00, icon: 'card' },
    { id: 2, name: 'Épargne Premium', number: '**** 5678', balance: 5120.50, icon: 'wallet' },
  ];

  const depositMethods = [
    { id: 1, name: 'Chèque', icon: 'document-text', description: 'Dépôt par chèque' },
    { id: 2, name: 'Espèces', icon: 'cash', description: 'Dépôt en espèces' },
    { id: 3, name: 'Virement', icon: 'swap-horizontal', description: 'Virement externe' },
    { id: 4, name: 'Carte', icon: 'card', description: 'Carte bancaire' },
  ];

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0 || !depositMethod) {
      return;
    }
    router.push({
      pathname: '/(screens)/deposit-confirmation',
      params: {
        amount,
        account: selectedAccount,
        method: depositMethod,
        reference: reference || 'Dépôt'
      }
    } as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Premium Gradient Header */}
        <LinearGradient
          colors={['#34C759', '#28A745']}
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
            <Text style={styles.headerTitle}>Dépôt d'Argent</Text>
            <View style={{ width: 40 }} />
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Account Selection */}
          <PremiumCard 
            style={[styles.card, { backgroundColor: colors.card }]}
            elevated
            delay={0}
          >
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
              VERS VOTRE COMPTE
            </Text>
            
            {accounts.map((account) => (
              <Pressable
                key={account.id}
                style={({ pressed }) => [
                  styles.accountItem,
                  selectedAccount === account.name && styles.accountItemSelected,
                  { 
                    backgroundColor: selectedAccount === account.name 
                      ? colors.primary + '10' 
                      : colors.backgroundSecondary,
                    opacity: pressed ? 0.8 : 1,
                  }
                ]}
                onPress={() => setSelectedAccount(account.name)}
              >
                <View style={styles.accountLeft}>
                  <View style={[
                    styles.accountIcon,
                    { backgroundColor: selectedAccount === account.name ? colors.primary + '20' : colors.primary + '15' }
                  ]}>
                    <Ionicons 
                      name={account.icon as any} 
                      size={20} 
                      color={colors.primary} 
                    />
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={[styles.accountName, { color: colors.text }]}>
                      {account.name}
                    </Text>
                    <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>
                      {account.number}
                    </Text>
                  </View>
                </View>
                <View style={styles.accountRight}>
                  <Text style={[styles.accountBalance, { color: colors.text }]}>
                    {account.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </Text>
                  {selectedAccount === account.name && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  )}
                </View>
              </Pressable>
            ))}
          </PremiumCard>

          {/* Deposit Method Selection */}
          <PremiumCard 
            style={[styles.card, { backgroundColor: colors.card }]}
            elevated
            delay={100}
          >
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
              MÉTHODE DE DÉPÔT
            </Text>
            
            <View style={styles.methodsGrid}>
              {depositMethods.map((method) => (
                <Pressable
                  key={method.id}
                  style={({ pressed }) => [
                    styles.methodItem,
                    depositMethod === method.name && styles.methodItemSelected,
                    { 
                      backgroundColor: depositMethod === method.name 
                        ? colors.primary + '10' 
                        : colors.backgroundSecondary,
                      opacity: pressed ? 0.8 : 1,
                      borderColor: depositMethod === method.name ? colors.primary : 'transparent',
                    }
                  ]}
                  onPress={() => setDepositMethod(method.name)}
                >
                  <PremiumIcon
                    name={method.icon as any}
                    size={48}
                    iconSize={24}
                    colors={depositMethod === method.name ? ['#34C759', '#28A745'] : ['#8E8E93', '#8E8E93']}
                    shape="rounded"
                  />
                  <Text style={[
                    styles.methodName, 
                    { color: depositMethod === method.name ? colors.text : colors.textSecondary }
                  ]}>
                    {method.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </PremiumCard>

          {/* Amount Input */}
          <PremiumCard 
            style={[styles.card, { backgroundColor: colors.card }]}
            elevated
            delay={200}
          >
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
              MONTANT
            </Text>
            
            <LinearGradient
              colors={['#34C759', '#28A745']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.amountContainer}
            >
              <TextInput
                placeholder="0.00"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                style={styles.amountInput}
              />
              <Text style={styles.currency}>€</Text>
            </LinearGradient>
            
            {/* Quick Amount Buttons */}
            <View style={styles.quickAmounts}>
              {[50, 100, 200, 500].map((value) => (
                <Pressable
                  key={value}
                  style={({ pressed }) => [
                    styles.quickAmountBtn,
                    { 
                      backgroundColor: colors.backgroundSecondary,
                      opacity: pressed ? 0.7 : 1,
                    }
                  ]}
                  onPress={() => setAmount(value.toString())}
                >
                  <Text style={[styles.quickAmountText, { color: colors.text }]}>
                    {value} €
                  </Text>
                </Pressable>
              ))}
            </View>
          </PremiumCard>

          {/* Reference Input */}
          <PremiumCard 
            style={[styles.card, { backgroundColor: colors.card }]}
            elevated
            delay={300}
          >
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
              RÉFÉRENCE (OPTIONNEL)
            </Text>
            
            <PremiumInput
              icon="document-text"
              placeholder="Ex: Salaire, Prime..."
              value={reference}
              onChangeText={setReference}
            />
          </PremiumCard>

          {/* Info Card */}
          <Animated.View entering={FadeInDown.delay(350).duration(400)}>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <Ionicons name="information-circle" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Les dépôts par chèque peuvent prendre 2-3 jours ouvrés pour être crédités.
              </Text>
            </View>
          </Animated.View>

          {/* Continue Button */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(400)}
            style={styles.buttonContainer}
          >
            <PremiumButton
              title="Continuer"
              onPress={handleContinue}
              icon="arrow-forward"
              variant="primary"
              disabled={!amount || parseFloat(amount) <= 0 || !depositMethod}
            />
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
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
  // Account Selection
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  accountItemSelected: {
    borderWidth: 2,
    borderColor: '#0066FF',
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  accountNumber: {
    fontSize: 12,
    fontWeight: '500',
  },
  accountRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  // Deposit Methods
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  methodItem: {
    width: '47%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  methodItemSelected: {
    borderWidth: 2,
  },
  methodName: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: -0.2,
  },
  // Amount Input
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  amountInput: {
    flex: 1,
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    padding: 0,
  },
  currency: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
    marginLeft: 8,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAmountBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 13,
    fontWeight: '600',
  },
  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  // Button Container
  buttonContainer: {
    marginBottom: 20,
  },
});
