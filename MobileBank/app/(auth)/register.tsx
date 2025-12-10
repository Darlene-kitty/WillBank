import { useTheme } from '@/contexts/theme-context';
import { useAuthContext } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { register } = useAuthContext();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [cin, setCin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !address || !cin) {
      setError('Veuillez remplir tous les champs');
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!email.includes('@')) {
      setError('Email invalide');
      Alert.alert('Erreur', 'Email invalide');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // Validation du mot de passe : au moins 8 caractères avec majuscule, minuscule, chiffre et caractère spécial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Le mot de passe doit contenir au moins 8 caractères avec majuscule, minuscule, chiffre et caractère spécial (@$!%*?&)');
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères avec majuscule, minuscule, chiffre et caractère spécial (@$!%*?&)');
      return;
    }
    
    // Validation du CIN : 8-20 caractères alphanumériques en majuscules
    const cinRegex = /^[A-Z0-9]{8,20}$/;
    if (!cinRegex.test(cin.toUpperCase())) {
      setError('Le CIN doit contenir 8 à 20 caractères alphanumériques');
      Alert.alert('Erreur', 'Le CIN doit contenir 8 à 20 caractères alphanumériques');
      return;
    }
    
    // Validation du téléphone : 10-15 chiffres (peut commencer par +)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setError('Le numéro de téléphone doit contenir 10 à 15 chiffres');
      Alert.alert('Erreur', 'Le numéro de téléphone doit contenir 10 à 15 chiffres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim().replace(/\s/g, ''),
        password,
        address: address.trim(),
        cin: cin.trim().toUpperCase(),
      });
      
      // Afficher un message de succès
      Alert.alert(
        'Compte créé avec succès !',
        'Bienvenue chez WillBank. Vous allez recevoir un email de confirmation et une notification push.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Rediriger vers le dashboard
              router.replace('/(tabs)/' as any);
            }
          }
        ]
      );
    } catch (err: any) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      
      let errorMessage = 'Une erreur est survenue lors de la création du compte';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.errors) {
          // Validation errors
          const errors = Object.values(err.response.data.errors).join('\n');
          errorMessage = errors;
        }
      }
      
      setError(errorMessage);
      Alert.alert('Erreur de création de compte', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.text }]}>
              Ouvrez votre compte WillBank
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Simple, rapide et sécurisé.
            </Text>
          </View>

          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: '#ff000020', borderColor: '#ff0000' }]}>
              <Ionicons name="alert-circle" size={20} color="#ff0000" />
              <Text style={[styles.errorText, { color: '#ff0000' }]}>{error}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.form}>
            {/* First Name Input */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Prénom</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Entrez votre prénom"
                  placeholderTextColor={colors.textSecondary}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Last Name Input */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Nom</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Entrez votre nom"
                  placeholderTextColor={colors.textSecondary}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Adresse email</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Entrez votre adresse email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Numéro de téléphone</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                <Ionicons name="call-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Entrez votre numéro de téléphone"
                  placeholderTextColor={colors.textSecondary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Address Input */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Adresse</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                <Ionicons name="home-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Entrez votre adresse"
                  placeholderTextColor={colors.textSecondary}
                  value={address}
                  onChangeText={setAddress}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* CIN Input */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Numéro CIN</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                <Ionicons name="card-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Entrez votre numéro CIN"
                  placeholderTextColor={colors.textSecondary}
                  value={cin}
                  onChangeText={setCin}
                  autoCapitalize="characters"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Créez votre mot de passe</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Entrez votre mot de passe (min. 6 caractères)"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  disabled={isLoading}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              style={[
                styles.registerButton, 
                { backgroundColor: colors.primary },
                isLoading && { opacity: 0.7 }
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>S'inscrire</Text>
              )}
            </TouchableOpacity>

            {/* Terms */}
            <Text style={[styles.termsText, { color: colors.textSecondary }]}>
              En vous inscrivant, vous acceptez nos{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                Conditions d'utilisation
              </Text>
              {' '}et notre{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                Politique de confidentialité
              </Text>
              .
            </Text>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                Déjà un compte ?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={[styles.loginLink, { color: colors.primary }]}>
                  Se connecter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 158, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    gap: 4,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  registerButton: {
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  termsText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 15,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '700',
  },
});
