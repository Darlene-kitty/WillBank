import { AnimatedSuccessIcon } from '@/components/animated-success-icon';
import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TransferSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  
  const amount = params.amount || '150.00';
  const beneficiary = params.beneficiary || 'John Doe';
  const reference = params.reference || 'FR123456789';
  const date = new Date().toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Reçu de virement\n\nMontant envoyé: €${amount}\nBénéficiaire: ${beneficiary}\nDate et heure: ${date}\nNuméro de référence: ${reference}`,
        title: 'Reçu de virement'
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = () => {
    Alert.alert(
      'Téléchargement',
      'Le reçu a été téléchargé dans vos fichiers',
      [{ text: 'OK' }]
    );
  };

  const handleClose = () => {
    router.replace('/(tabs)/');
  };

  return (
    <View style={[styles.overlay, { backgroundColor: colors.background + 'F0' }]}>
      <View style={[styles.modal, { backgroundColor: colors.card }]}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>

        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <AnimatedSuccessIcon size={120} color="#34C759" />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>Virement Effectué !</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Votre transaction a été traitée avec succès.</Text>

        {/* Transaction Details */}
        <View style={[styles.detailsContainer, { backgroundColor: colors.cardSecondary }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Montant envoyé</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>€{amount}</Text>
          </View>

          <View style={[styles.separator, { backgroundColor: colors.border }]} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Bénéficiaire</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{ beneficiary}</Text>
          </View>

          <View style={[styles.separator, { backgroundColor: colors.border }]} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date et heure</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{date}</Text>
          </View>

          <View style={[styles.separator, { backgroundColor: colors.border }]} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Numéro de référence</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{reference}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-social" size={20} color="#fff" />
          <Text style={styles.shareButtonText}>Partager le reçu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <Ionicons name="download" size={20} color="#3B9EFF" />
          <Text style={styles.downloadButtonText}>Télécharger le reçu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={handleClose}>
          <Text style={styles.homeButtonText}>Retourner à l'accueil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  successIconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  detailsContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 1,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3B9EFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3B9EFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  downloadButtonText: {
    color: '#3B9EFF',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    padding: 16,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#3B9EFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
