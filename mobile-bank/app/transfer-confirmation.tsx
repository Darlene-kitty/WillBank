import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TransferConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const amount = params.amount || '1250.00';
  const account = params.account || 'Compte Courant (...1234)';
  const beneficiary = params.beneficiary || 'Alexandre Dupont';
  const reference = params.reference || 'Loyer Appartement';

  const handleConfirm = () => {
    // Redirect to success modal
    router.push({
      pathname: '/transfer-success',
      params: {
        amount,
        beneficiary,
        reference: reference || 'N/A'
      }
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Reçu de virement\n\nMontant: ${amount} €\nBénéficiaire: ${beneficiary}\nRéférence: ${reference}\nDate: ${new Date().toLocaleDateString('fr-FR')}`,
        title: 'Reçu de virement'
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmation du Virement</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.amountSection}>
          <Text style={styles.amount}>{amount} €</Text>
          <Text style={styles.amountLabel}>Montant du virement</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Depuis votre compte</Text>
            <Text style={styles.detailValue}>{account}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vers le bénéficiaire</Text>
            <Text style={styles.detailValue}>{beneficiary}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date d'exécution</Text>
            <Text style={styles.detailValue}>Immédiat</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Motif du virement</Text>
            <Text style={styles.detailValue}>{reference}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>Confirmer et envoyer</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.modifyButton}
          onPress={() => router.back()}
        >
          <Text style={styles.modifyButtonText}>Modifier les informations</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={20} color="#3B9EFF" />
          <Text style={styles.shareButtonText}>Partager le reçu</Text>
        </TouchableOpacity>
      </View>
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
  amountSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  amount: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  amountLabel: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 8,
  },
  detailsCard: {
    backgroundColor: '#1A2942',
    borderRadius: 16,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  detailLabel: {
    color: '#8E8E93',
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#0F1E35',
  },
  confirmButton: {
    backgroundColor: '#3B9EFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modifyButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  modifyButtonText: {
    color: '#3B9EFF',
    fontSize: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#3B9EFF',
    borderRadius: 12,
  },
  shareButtonText: {
    color: '#3B9EFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
