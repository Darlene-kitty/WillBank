import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeIn, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { PremiumCard, PremiumButton, PremiumSuccessAnimation } from '@/components/shared';

export default function TransferSuccessScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { amount, beneficiary, reference, transactionRef } = useLocalSearchParams();

  const transferDetails = {
    amount: typeof amount === 'string' ? parseFloat(amount) : 0,
    beneficiary: typeof beneficiary === 'string' ? beneficiary : 'Alexandre Dupont',
    reference: typeof reference === 'string' ? reference : 'Virement',
    transactionRef: typeof transactionRef === 'string' ? transactionRef : `TRX-${Date.now()}`,
    date: new Date().toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: 'COMPLETED',
  };

  // Animation values
  const cardScale = useSharedValue(0.8);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    cardScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    cardOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const handleBackToDashboard = () => {
    router.replace('/(tabs)/' as any);
  };

  const handleViewDetails = () => {
    router.push(`/transaction-details?transactionId=1` as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Success Header */}
      <View style={styles.header}>
        <Pressable 
          onPress={handleBackToDashboard}
          style={({ pressed }) => [
            styles.closeButton,
            { opacity: pressed ? 0.6 : 1 }
          ]}
        >
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* Success Animation */}
        <Animated.View 
          entering={FadeIn.delay(200).duration(600)}
          style={styles.animationContainer}
        >
          <PremiumSuccessAnimation size={120} />
        </Animated.View>

        {/* Success Message */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.messageContainer}
        >
          <Text style={[styles.successTitle, { color: colors.text }]}>
            Virement effectué !
          </Text>
          <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
            Votre virement a été traité avec succès
          </Text>
        </Animated.View>

        {/* Amount Card */}
        <Animated.View style={[cardAnimatedStyle]}>
          <LinearGradient
            colors={['#0066FF', '#0052CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.amountCard}
          >
            <Text style={styles.amountLabel}>Montant</Text>
            <Text style={styles.amountValue}>
              -{transferDetails.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Details Card */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)}>
          <PremiumCard 
            style={[styles.detailsCard, { backgroundColor: colors.card }]}
            elevated
            delay={0}
          >
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="person" size={20} color={colors.primary} />
                <View style={styles.detailText}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Bénéficiaire
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {transferDetails.beneficiary}
                  </Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="document-text" size={20} color={colors.primary} />
                <View style={styles.detailText}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Référence
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {transferDetails.reference}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                N° de transaction
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {transferDetails.transactionRef}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Date
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {transferDetails.date}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Statut
              </Text>
              <View style={styles.statusBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={styles.statusText}>Complété</Text>
              </View>
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Info Message */}
        <Animated.View entering={FadeInDown.delay(700).duration(600)}>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Le virement sera crédité sur le compte du bénéficiaire sous 1-2 jours ouvrés
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          entering={FadeInDown.delay(800).duration(600)}
          style={styles.buttonsContainer}
        >
          <PremiumButton
            title="Retour à l'accueil"
            onPress={handleBackToDashboard}
            icon="home"
            variant="primary"
          />

          <Pressable 
            style={({ pressed }) => [
              styles.secondaryButton,
              { 
                backgroundColor: colors.card,
                opacity: pressed ? 0.7 : 1,
              }
            ]}
            onPress={handleViewDetails}
          >
            <Ionicons name="receipt" size={20} color={colors.primary} />
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Voir les détails
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  // Animation
  animationContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  // Message
  messageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Amount Card
  amountCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  amountLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -1.5,
  },
  // Details Card
  detailsCard: {
    padding: 20,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
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
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  // Buttons
  buttonsContainer: {
    gap: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});