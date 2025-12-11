import { useTheme } from '@/contexts/theme-context';
import { useAuthContext } from '@/contexts/auth-context';
import { useAccounts } from '@/hooks';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumCard, PremiumInput, PremiumButton } from '@/components/shared';

export default function NewTransferScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { clientId } = useAuthContext();
  const { accounts } = useAccounts(clientId);
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('');
  const [reference, setReference] = useState('');

  // Transformer les comptes pour l'affichage
  const displayAccounts = accounts.map(account => ({
    id: account.id,
    name: account.accountType === 'CHECKING' ? 'Compte Courant' : 
          account.accountType === 'SAVINGS' ? 'Compte Épargne' : 'Compte Business',
    number: `**** ${account.accountNumber.slice(-4)}`,
    balance: account.balance,
    icon: account.accountType === 'CHECKING' ? 'card' : 'wallet'
  }));

  // Sélectionner le premier compte par défaut
  React.useEffect(() => {
    if (displayAccounts.length > 0 && !selectedAccount) {
      setSelectedAccount(displayAccounts[0].name);
    }
  }, [displayAccounts, selectedAccount]);

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }
    router.push({
      pathname: '/(screens)/transfer-confirmation',
      params: {
        amount,
        account: selectedAccount,
        beneficiary: selectedBeneficiary || 'Alexandre Dupont',
        reference: reference || 'Virement'
      }
    } as any);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
        {/* Premium Gradient Header */}
      <LinearGradient
        colors={['#0066FF', '#0052CC']}
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
          <Text style={styles.headerTitle}>Nouveau Virement</Text>
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
            DEPUIS VOTRE COMPTE
          </Text>
          
          {accounts.map((account, index) => (
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

        {/* Beneficiary Selection */}
        <PremiumCard 
          style={[styles.card, { backgroundColor: colors.card }]}
          elevated
          delay={100}
        >
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
            BÉNÉFICIAIRE
          </Text>
          
          <PremiumInput
            icon="person"
            placeholder="Nom du bénéficiaire"
            value={selectedBeneficiary}
            onChangeText={setSelectedBeneficiary}
          />
          
          <Pressable 
            style={({ pressed }) => [
              styles.addButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Ionicons name="add-circle" size={20} color={colors.primary} />
            <Text style={[styles.addButtonText, { color: colors.primary }]}>
              Nouveau bénéficiaire
            </Text>
          </Pressable>
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
            colors={['#0066FF', '#0052CC']}
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
            placeholder="Ex: Loyer, Facture..."
            value={reference}
            onChangeText={setReference}
          />
        </PremiumCard>

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
            disabled={!amount || parseFloat(amount) <= 0}
          />
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  card: {
    padding: 16,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
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
  buttonContainer: {
    marginTop: 8,
  },
});
