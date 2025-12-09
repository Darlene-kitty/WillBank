import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Image
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumCard, PremiumInput, PremiumButton, PremiumIcon, PremiumBadge } from '@/components/shared';

// Interface basée sur l'entité Client du backend
interface ClientProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  cin: string;
  role: 'CLIENT' | 'ADMIN' | 'AGENT';
  status: 'ACTIVE' | 'BLOCKED' | 'PENDING' | 'SUSPENDED';
  createdAt: string;
  lastLogin: string;
}

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  // Données mockées basées sur l'entité Client
  const [profile, setProfile] = useState<ClientProfile>({
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix, 75001 Paris',
    cin: 'AB123456',
    role: 'CLIENT',
    status: 'ACTIVE',
    createdAt: '2023-01-15',
    lastLogin: '2024-12-09T10:30:00',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // États pour les champs éditables
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simuler un appel API
    setTimeout(() => {
      setProfile({
        ...profile,
        firstName,
        lastName,
        email,
        phone,
        address,
      });
      setIsSaving(false);
      setIsEditing(false);
      
      Alert.alert(
        'Profil mis à jour',
        'Vos informations ont été enregistrées avec succès.',
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const handleCancel = () => {
    // Réinitialiser les valeurs
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setEmail(profile.email);
    setPhone(profile.phone);
    setAddress(profile.address);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#34C759';
      case 'BLOCKED': return '#FF3B30';
      case 'PENDING': return '#FF9500';
      case 'SUSPENDED': return '#FF9500';
      default: return '#8E8E93';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'BLOCKED': return 'Bloqué';
      case 'PENDING': return 'En attente';
      case 'SUSPENDED': return 'Suspendu';
      default: return status;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'CLIENT': return 'Client';
      case 'ADMIN': return 'Administrateur';
      case 'AGENT': return 'Agent';
      default: return role;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
        {/* Premium Gradient Header */}
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
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
            <Text style={styles.headerTitle}>Mon Profil</Text>
            <Pressable 
              onPress={() => setIsEditing(!isEditing)}
              style={({ pressed }) => [
                styles.editButton,
                { opacity: pressed ? 0.6 : 1 }
              ]}
            >
              <Ionicons 
                name={isEditing ? "close" : "create"} 
                size={24} 
                color="#fff" 
              />
            </Pressable>
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Header Card */}
          <Animated.View entering={FadeInDown.delay(0).duration(400)}>
            <PremiumCard 
              style={[styles.profileCard, { backgroundColor: colors.card }]}
              elevated
              delay={0}
            >
              <View style={styles.profileHeader}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={['#667EEA', '#764BA2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatar}
                  >
                    <Text style={styles.avatarText}>
                      {profile.firstName[0]}{profile.lastName[0]}
                    </Text>
                  </LinearGradient>
                  <Pressable style={styles.avatarEditButton}>
                    <Ionicons name="camera" size={16} color="#fff" />
                  </Pressable>
                </View>

                {/* Profile Info */}
                <View style={styles.profileInfo}>
                  <Text style={[styles.profileName, { color: colors.text }]}>
                    {profile.firstName} {profile.lastName}
                  </Text>
                  <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                    {profile.email}
                  </Text>
                  
                  <View style={styles.badges}>
                    <PremiumBadge
                      text={getStatusLabel(profile.status)}
                      variant={profile.status === 'ACTIVE' ? 'success' : 'warning'}
                      size="small"
                    />
                    <PremiumBadge
                      text={getRoleLabel(profile.role)}
                      variant="info"
                      size="small"
                    />
                  </View>
                </View>
              </View>
            </PremiumCard>
          </Animated.View>

          {/* Personal Information */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <PremiumCard 
              style={[styles.card, { backgroundColor: colors.card }]}
              elevated
              delay={0}
            >
              <View style={styles.cardHeader}>
                <PremiumIcon
                  name="person"
                  size={40}
                  iconSize={20}
                  colors={['#667EEA', '#764BA2']}
                  shape="rounded"
                />
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Informations Personnelles
                </Text>
              </View>

              <View style={styles.inputsContainer}>
                <PremiumInput
                  label="Prénom"
                  icon="person"
                  placeholder="Prénom"
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={isEditing}
                />

                <PremiumInput
                  label="Nom"
                  icon="person"
                  placeholder="Nom"
                  value={lastName}
                  onChangeText={setLastName}
                  editable={isEditing}
                />

                <PremiumInput
                  label="Email"
                  icon="mail"
                  placeholder="email@exemple.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  editable={isEditing}
                />

                <PremiumInput
                  label="Téléphone"
                  icon="call"
                  placeholder="+33 6 12 34 56 78"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  editable={isEditing}
                />

                <PremiumInput
                  label="Adresse"
                  icon="location"
                  placeholder="Adresse complète"
                  value={address}
                  onChangeText={setAddress}
                  editable={isEditing}
                />
              </View>
            </PremiumCard>
          </Animated.View>

          {/* Account Information (Read-only) */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <PremiumCard 
              style={[styles.card, { backgroundColor: colors.card }]}
              elevated
              delay={0}
            >
              <View style={styles.cardHeader}>
                <PremiumIcon
                  name="shield-checkmark"
                  size={40}
                  iconSize={20}
                  colors={['#34C759', '#28A745']}
                  shape="rounded"
                />
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Informations du Compte
                </Text>
              </View>

              <View style={styles.infoList}>
                <View style={styles.infoItem}>
                  <View style={styles.infoLeft}>
                    <Ionicons name="card" size={20} color={colors.textSecondary} />
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      CIN
                    </Text>
                  </View>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {profile.cin}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.infoLeft}>
                    <Ionicons name="calendar" size={20} color={colors.textSecondary} />
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      Membre depuis
                    </Text>
                  </View>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {new Date(profile.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.infoLeft}>
                    <Ionicons name="time" size={20} color={colors.textSecondary} />
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      Dernière connexion
                    </Text>
                  </View>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {new Date(profile.lastLogin).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
              </View>
            </PremiumCard>
          </Animated.View>

          {/* Security Actions */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <PremiumCard 
              style={[styles.card, { backgroundColor: colors.card }]}
              elevated
              delay={0}
            >
              <View style={styles.cardHeader}>
                <PremiumIcon
                  name="lock-closed"
                  size={40}
                  iconSize={20}
                  colors={['#FF9500', '#FF6B00']}
                  shape="rounded"
                />
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Sécurité
                </Text>
              </View>

              <Pressable 
                style={({ pressed }) => [
                  styles.actionButton,
                  { 
                    backgroundColor: colors.backgroundSecondary,
                    opacity: pressed ? 0.7 : 1,
                  }
                ]}
                onPress={() => {
                  Alert.alert(
                    'Changer le mot de passe',
                    'Cette fonctionnalité sera disponible prochainement.',
                    [{ text: 'OK' }]
                  );
                }}
              >
                <View style={styles.actionLeft}>
                  <Ionicons name="key" size={20} color={colors.primary} />
                  <Text style={[styles.actionText, { color: colors.text }]}>
                    Changer le mot de passe
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Pressable>
            </PremiumCard>
          </Animated.View>

          {/* Save/Cancel Buttons (visible only when editing) */}
          {isEditing && (
            <Animated.View 
              entering={FadeInDown.delay(350).duration(400)}
              style={styles.buttonsContainer}
            >
              <PremiumButton
                title={isSaving ? "Enregistrement..." : "Enregistrer"}
                onPress={handleSave}
                icon="checkmark-circle"
                variant="primary"
                disabled={isSaving}
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
                disabled={isSaving}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  Annuler
                </Text>
              </Pressable>
            </Animated.View>
          )}

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
  editButton: {
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
    paddingTop: 16,
  },
  // Profile Card
  profileCard: {
    padding: 20,
    marginBottom: 12,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -1,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667EEA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  profileEmail: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 10,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  // Card
  card: {
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  // Inputs
  inputsContainer: {
    gap: 12,
  },
  // Info List
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  // Action Button
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
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
