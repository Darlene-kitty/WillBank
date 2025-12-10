import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumCard, PremiumButton, PremiumIcon, PremiumDivider } from '@/components/shared';

export default function DepositConfirmationScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { amount, account, method, reference } = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const depositDetails = {
    amount: typeof amount === 'string' ? parseFloat(amount) : 0,
    account: typeof account === 'string' ? account : 'Compte Courant',
    method: typeof method === 'string' ? method : 'Chèque',
    reference: typeof reference === 'string' ? reference : 'Dépôt',
    date: new Date().toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    time: new Date().toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Chèque': return 'document-text';
      case 'Espèces': return 'cash';
      case 'Virement': return 'swap-horizontal';
      case 'Carte': return 'card';
      default: return 'document-text';
    }
  };

  const getMethodColor = (method: string): [string, string] => {
    switch (method) {
      case 'Chèque': return ['#667EEA', '#764BA2'];
      case 'Espèces': return ['#34C759', '#28A745'];
      case 'Virement': return ['#0066FF', '#0052CC'];
      case 'Carte': return ['#FF9500', '#FF6B00'];
      default: return ['#667EEA', '#764BA2'];
    }
  };

  const getProcessingTime = (method: string) => {
    switch (method) {
      case 'Chèque': return '2-3 jours ouvrés';
      case 'Espèces': return 'Immédiat';
      case 'Virement': return '1-2 jours ouvrés';
      case 'Carte': return 'Immédiat';
      default: return '1-2 jours ouvrés';
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    
    // Simuler un traitement
    setTimeout(() => {
      setIsProcessing(false);
      router.replace({
<<<<<<< HEAD
        pathname: '/deposit-success',
=======
        pathname: '/(screens)/deposit-success',
>>>>>>> 55ac17aa7536978a060228b5a91d68ff68d5de1a
        params: {
          amount: depositDetails.amount.toString(),
          account: depositDetails.account,
          method: depositDetails.method,
        }
      } as any);
    }, 1500);
  };

  const handleCancel = () => {
    Alert.alert(
      'Annuler le dépôt',
      'Êtes-vous sûr de vouloir annuler ce dépôt ?',
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
          <Text style={styles.headerTitle}>Confirmation</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount Display */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <LinearGradient
            colors={['#34C759', '#28A745']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.amountCard}
          >
            <Text style={styles.amountLabel}>Montant du dépôt</Text>
            <Text style={styles.amountValue}>
              {depositDetails.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
            </Text>
            <View style={styles.amountBadge}>
              <Ionicons name="add-circle" size={16} color="#fff" />
              <Text style={styles.amountBadgeText}>Crédit</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Deposit Details */}
        <PremiumCard 
          style={[styles.detailsCard, { backgroundColor: colors.card }]}
          elevated
          delay={100}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Détails du Dépôt
          </Text>

          {/* Account */}
          <View style={[styles.detailRow, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={styles.detailLeft}>
              <PremiumIcon
                name="wallet"
                size={44}
                iconSize={20}
                colors={['#0066FF', '#0052CC']}
                shape="rounded"
              />
              <View style={styles.detailTextContainer}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Vers le compte
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {depositDetails.account}
                </Text>
              </View>
            </View>
          </View>

          {/* Method */}
          <View style={[styles.detailRow, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={styles.detailLeft}>
              <PremiumIcon
                name={getMethodIcon(depositDetails.method) as any}
                size={44}
                iconSize={20}
                colors={getMethodColor(depositDetails.method)}
                shape="rounded"
              />
              <View style={styles.detailTextContainer}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Méthode de dépôt
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {depositDetails.method}
                </Text>
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
              {depositDetails.reference}
            </Text>
          </View>

          {/* Date */}
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Date
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {depositDetails.date} à {depositDetails.time}
            </Text>
          </View>

          {/* Processing Time */}
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Délai de traitement
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {getProcessingTime(depositDetails.method)}
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
                Votre dépôt sera traité de manière sécurisée et confidentielle.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Warning Card (for checks) */}
        {depositDetails.method === 'Chèque' && (
          <Animated.View entering={FadeInDown.delay(250).duration(400)}>
            <View style={[styles.warningCard, { backgroundColor: '#FF9500' + '15', borderColor: '#FF9500' }]}>
              <Ionicons name="time" size={20} color="#FF9500" />
              <Text style={[styles.warningText, { color: colors.text }]}>
                Les dépôts par chèque nécessitent 2-3 jours ouvrés avant d'être crédités sur votre compte.
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.buttonsContainer}
        >
          <PremiumButton
            title={isProcessing ? "Traitement..." : "Confirmer le dépôt"}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  // Amount Card
  amountCard: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 20,
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
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  detailRow: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
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
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 20,
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
  // Warning Card
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
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
