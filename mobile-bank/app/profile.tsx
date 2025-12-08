import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [promotionsEnabled, setPromotionsEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: () => router.replace('/login')
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Paramètres du Profil</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AD</Text>
          </View>
          <Text style={styles.profileName}>Alexandre Dubois</Text>
          <Text style={styles.profileId}>ID Client: 742-198-335</Text>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Apparence</Text>
          <View style={[styles.menuItem, { backgroundColor: colors.card }]}>
            <ThemeToggle />
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Informations Personnelles</Text>
          
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card }]}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#3B9EFF20' }]}>
                <Ionicons name="person" size={20} color="#3B9EFF" />
              </View>
              <View>
                <Text style={[styles.menuLabel, { color: colors.text }]}>Nom et Prénom</Text>
                <Text style={[styles.menuValue, { color: colors.textSecondary }]}>Alexandre Dubois</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#34C75920' }]}>
                <Ionicons name="home" size={20} color="#34C759" />
              </View>
              <View>
                <Text style={styles.menuLabel}>Adresse Postale</Text>
                <Text style={styles.menuValue}>123 Rue de la République...</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FF950020' }]}>
                <Ionicons name="call" size={20} color="#FF9500" />
              </View>
              <View>
                <Text style={styles.menuLabel}>Numéro de téléphone</Text>
                <Text style={styles.menuValue}>+33 6 •••• ••90</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FF3B3020' }]}>
                <Ionicons name="mail" size={20} color="#FF3B30" />
              </View>
              <View>
                <Text style={styles.menuLabel}>Adresse e-mail</Text>
                <Text style={styles.menuValue}>a••••••s@email.com</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sécurité</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#3B9EFF20' }]}>
                <Ionicons name="lock-closed" size={20} color="#3B9EFF" />
              </View>
              <Text style={styles.menuLabel}>Changer le mot de passe</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#34C75920' }]}>
                <Ionicons name="finger-print" size={20} color="#34C759" />
              </View>
              <Text style={styles.menuLabel}>Gérer Face ID / Touch ID</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#3A3A3C', true: '#34C759' }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FF950020' }]}>
                <Ionicons name="phone-portrait" size={20} color="#FF9500" />
              </View>
              <Text style={styles.menuLabel}>Appareils connectés</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences de Notification</Text>
          
          <View style={styles.notificationGroup}>
            <View style={styles.notificationHeader}>
              <View style={[styles.menuIcon, { backgroundColor: '#3B9EFF20' }]}>
                <Ionicons name="swap-horizontal" size={20} color="#3B9EFF" />
              </View>
              <Text style={styles.notificationGroupTitle}>Alertes de transaction</Text>
            </View>
            
            <View style={styles.notificationSubItem}>
              <Text style={styles.notificationSubLabel}>Notifications Push</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#3A3A3C', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.notificationSubItem}>
              <Text style={styles.notificationSubLabel}>Email</Text>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#3A3A3C', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.notificationGroup}>
            <View style={styles.notificationHeader}>
              <View style={[styles.menuIcon, { backgroundColor: '#34C75920' }]}>
                <Ionicons name="person" size={20} color="#34C759" />
              </View>
              <Text style={styles.notificationGroupTitle}>Modifications de profil</Text>
            </View>
            
            <View style={styles.notificationSubItem}>
              <Text style={styles.notificationSubLabel}>Notifications Push</Text>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#3A3A3C', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.notificationSubItem}>
              <Text style={styles.notificationSubLabel}>Email</Text>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#3A3A3C', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.notificationGroup}>
            <View style={styles.notificationHeader}>
              <View style={[styles.menuIcon, { backgroundColor: '#FF3B3020' }]}>
                <Ionicons name="card" size={20} color="#FF3B30" />
              </View>
              <Text style={styles.notificationGroupTitle}>Rappels de paiement</Text>
            </View>
            
            <View style={styles.notificationSubItem}>
              <Text style={styles.notificationSubLabel}>Notifications Push</Text>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#3A3A3C', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.notificationSubItem}>
              <Text style={styles.notificationSubLabel}>Email</Text>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: '#3A3A3C', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.notificationGroup}>
            <View style={styles.notificationHeader}>
              <View style={[styles.menuIcon, { backgroundColor: '#FF950020' }]}>
                <Ionicons name="megaphone" size={20} color="#FF9500" />
              </View>
              <Text style={styles.notificationGroupTitle}>Annonces de la banque</Text>
            </View>
            
            <View style={styles.notificationSubItem}>
              <Text style={styles.notificationSubLabel}>Notifications Push</Text>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: '#3A3A3C', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.notificationSubItem}>
              <Text style={styles.notificationSubLabel}>Email</Text>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: '#3A3A3C', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Se Déconnecter</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B9EFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileId: {
    color: '#8E8E93',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A2942',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    color: '#fff',
    fontSize: 16,
  },
  menuValue: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationGroup: {
    backgroundColor: '#1A2942',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  notificationGroupTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationSubItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 52,
  },
  notificationSubLabel: {
    color: '#8E8E93',
    fontSize: 14,
  },
});
