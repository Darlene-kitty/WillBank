import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumCard, PremiumButton, PremiumIcon, PremiumDivider } from '@/components/shared';

// Interface basée sur l'entité Transaction du backend
interface TransferDetails {
  amount: number;
  sourceAccount: string;
  beneficiary: string;
  destinationIban?: string;
  reference: string;
  type: 'TRANSFER';
  status: 'PENDING';
}

export default function TransferConfirmationScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { amount, account, beneficiary, reference } = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const transferDetails: TransferDetails = {
    amount: typeof amount === 'string' ? parseFloat(amount) : 0,
    sourceAccount: typeof account === 'string' ? account : 'Compte Courant',
    beneficiary: typeof beneficiary === 'string' ? beneficiary : 'Alexandre Dupont',
    destinationIban: 'FR76 9876 5432 1098 7654 3210 987',
    reference: typeof reference === 'string' ? reference : 'Virement',
    type: 'TRANSFER',
    status: 'PENDING',
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    
    // Simuler un appel API POST /api/transactions
    setTimeout(() => {
      setIsProcessing(false);
      router.replace({
        pathname: '/(screens)/transfer-success',
        params: {
          amount: transferDetails.amount.toString(),
          beneficiary: transferDetails.beneficiary,
          reference: transferDetails.reference,
          transactionRef: `TRX-${Date.now().toString().slice(-8)}`,
        }
      } as any);
    }, 1500);
  };

  const handleCancel = () => {
    Alert.alert(
      'Annuler le virement',
      'Êtes-vous sûr de vouloir annuler ce virement ?',
      [
        { text: 'Non', style: 'cancel' },
        { 
          text: 'Oui, annuler', 
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          <Text style={styles.headerTitle}>Confirmation</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount Display */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <LinearGradient
            colors={['#0066FF', '#0052CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.amountCard}
          >
            <Text style={styles.amountLabel}>Montant du virement</Text>
            <Text style={styles.amountValue}>
              {transferDetails.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
            </Text>
            <View style={styles.amountBadge}>
              <Ionicons name="swap-horizontal" size={16} color="#fff" />
              <Text style={styles.amountBadgeText}>Virement</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Transfer Details */}
        <PremiumCard 
          style={[styles.detailsCard, { backgroundColor: colors.card }]}
          elevated
          delay={100}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Détails du Virement
          </Text>

          {/* Source Account */}
          <View style={[styles.detailRow, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={styles.detailLeft}>
              <PremiumIcon
                name="wallet"
                size={44}
                iconSize={20}
                colors={['#FF9500', '#FF6B00']}
                shape="rounded"
              />
              <View style={styles.detailTextContainer}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Depuis
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {transferDetails.sourceAccount}
                </Text>
              </View>
            </View>
          </View>

          {/* Beneficiary */}
          <View style={[styles.detailRow, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={styles.detailLeft}>
              <PremiumIcon
                name="person"
                size={44}
                iconSize={20}
                colors={['#34C759', '#28A745']}
                shape="rounded"
              />
              <View style={styles.detailTextContainer}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Vers
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {transferDetails.beneficiary}
                </Text>
                {transferDetails.destinationIban && (
                  <Text style={[styles.detailSubtext, { color: colors.textSecondary }]}>
                    {transferDetails.destinationIban}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <PremiumDivider variant="solid" spacing={16} />

          {/* Reference */}
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Référence
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {transferDetails.reference}
            </Text>
          </View>

          {/* Date */}
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Date
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>

          {/* Type */}
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Type
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              Virement bancaire
            </Text>
          </View>
        </PremiumCard>

        {/* Info Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Ionicons name="shield-checkmark" size={24} color="#34C759" />
            <View style={styles.infoCardText}>
              <Text style={[styles.infoCardTitle, { color: colors.text }]}>
                Transaction sécurisée
              </Text>
              <Text style={[styles.infoCardMessage, { color: colors.textSecondary }]}>
                Votre virement sera traité de manière sécurisée et confidentielle.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          entering={FadeInDown.delay(250).duration(400)}
          style={styles.buttonsContainer}
        >
          <PremiumButton
            title={isProcessing ? "Traitement..." : "Confirmer le virement"}
            onPress={handleConfirm}
            icon="checkmark-circle"
            variant="primary"
            disabled={isProcessing}
          />

          <Pressable 
            style={({ pressed }) => [
              styles.cancelButton,
              { 
                backgroundColor: colors.card,
                opacity: pressed ? 0.7 : 1,
              }
            ]}
            onPress={handleCancel}
            disabled={isProcessing}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
              Annuler
            </Text>
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
  // Amount Card
  amountCard: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  amountValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -2,
    marginBottom: 16,
  },
  amountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  amountBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  // Details Card
  detailsCard: {
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  detailRow: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  detailSubtext: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  infoCardText: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  infoCardMessage: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  // Buttons
  buttonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
