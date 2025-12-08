import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationsScreen() {
  const router = useRouter();

  const notifications = [
    {
      id: 1,
      title: 'Virement reçu',
      message: 'Vous avez reçu un virement de 1 250,00 € de Jean Dupont',
      time: 'Il y a 2h',
      icon: 'arrow-down-circle',
      iconColor: '#34C759',
      unread: true,
    },
    {
      id: 2,
      title: 'Modification du profil',
      message: 'Votre mot de passe a été modifié avec succès',
      time: 'Hier',
      icon: 'lock-closed',
      iconColor: '#FF9500',
      unread: false,
    },
    {
      id: 3,
      title: 'Rappel de paiement',
      message: 'Votre facture d\'électricité est due dans 3 jours',
      time: 'Il y a 2 jours',
      icon: 'card',
      iconColor: '#FF3B30',
      unread: false,
    },
    {
      id: 4,
      title: 'Paiement par carte',
      message: 'Paiement de 45,50 € chez Carrefour',
      time: 'Il y a 3 jours',
      icon: 'card-outline',
      iconColor: '#8E8E93',
      unread: false,
    },
    {
      id: 5,
      title: 'Nouvelle fonctionnalité',
      message: 'Découvrez notre nouveau système de budget',
      time: 'Il y a 5 jours',
      icon: 'sparkles',
      iconColor: '#3B9EFF',
      unread: false,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Centre de Notifications</Text>
        <TouchableOpacity>
          <Ionicons name="checkmark-done" size={24} color="#3B9EFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.map((notification) => (
          <TouchableOpacity 
            key={notification.id} 
            style={[
              styles.notificationItem,
              notification.unread && styles.notificationUnread
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: notification.iconColor + '20' }]}>
              <Ionicons name={notification.icon as any} size={24} color={notification.iconColor} />
            </View>
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                {notification.unread && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
          </TouchableOpacity>
        ))}

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
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#1A2942',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  notificationUnread: {
    borderLeftWidth: 3,
    borderLeftColor: '#3B9EFF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notificationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B9EFF',
  },
  notificationMessage: {
    color: '#8E8E93',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    color: '#8E8E93',
    fontSize: 12,
  },
});
