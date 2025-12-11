import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/theme-context';
import { useAuthContext } from '@/contexts/auth-context';
import { useNotifications } from '@/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumCard, PremiumIcon, PremiumBadge } from '@/components/shared';

interface Notification {
  id: number;
  type: 'transaction' | 'security' | 'info' | 'promo';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  colors: string[];
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { client } = useAuthContext();
  const { notifications: rawNotifications, refreshNotifications } = useNotifications(client?.email || null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Transformer les notifications pour l'affichage
  const notifications = rawNotifications.map(notif => {
    // Déterminer le type de notification basé sur le message ou le type
    const getNotificationType = () => {
      const msg = notif.message.toLowerCase();
      if (msg.includes('transaction') || msg.includes('virement') || msg.includes('paiement') || msg.includes('débité')) {
        return 'transaction';
      } else if (msg.includes('sécurité') || msg.includes('connexion') || msg.includes('mot de passe')) {
        return 'security';
      } else if (msg.includes('promo') || msg.includes('offre') || msg.includes('nouveauté')) {
        return 'promo';
      }
      return 'info';
    };

    const notifType = getNotificationType();

    return {
      id: notif.id,
      type: notifType,
      title: notif.type === 'IN_APP' ? 'Notification' : notif.type,
      message: notif.message,
      time: new Date(notif.createdAt).toLocaleString('fr-FR'),
      read: notif.status === 'SENT',
      icon: notifType === 'transaction' ? 'swap-horizontal' :
            notifType === 'security' ? 'shield-checkmark' :
            notifType === 'promo' ? 'megaphone' : 'information-circle',
      colors: notifType === 'transaction' ? ['#0066FF', '#0052CC'] :
              notifType === 'security' ? ['#FF3B30', '#CC2E26'] :
              notifType === 'promo' ? ['#FF9500', '#FF6B00'] : ['#34C759', '#28A745']
    };
  });

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: number) => {
    // Marquer comme lue côté client (optionnel: appeler l'API si disponible)
    await refreshNotifications();
  };

  const handleMarkAllAsRead = async () => {
    // Marquer toutes comme lues (optionnel: appeler l'API si disponible)
    await refreshNotifications();
  };

  const handleDelete = async (id: number) => {
    // Supprimer la notification (optionnel: appeler l'API si disponible)
    await refreshNotifications();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Gradient Header */}
      <LinearGradient
        colors={['#FF9500', '#FF6B00']}
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
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <PremiumBadge
                text={unreadCount.toString()}
                variant="error"
                size="small"
                style={styles.headerBadge}
              />
            )}
          </View>
          <Pressable 
            onPress={handleMarkAllAsRead}
            style={styles.markAllButton}
            disabled={unreadCount === 0}
          >
            <Ionicons 
              name="checkmark-done" 
              size={24} 
              color={unreadCount > 0 ? "#fff" : "rgba(255, 255, 255, 0.5)"} 
            />
          </Pressable>
        </View>
      </LinearGradient>

      {/* Filters */}
      <Animated.View 
        entering={FadeInDown.delay(50).duration(400)}
        style={styles.filtersContainer}
      >
        <Pressable
          style={({ pressed }) => [
            styles.filterBtn,
            filter === 'all' && styles.filterBtnActive,
            { 
              backgroundColor: filter === 'all' ? colors.primary : colors.card,
              opacity: pressed ? 0.8 : 1,
            }
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterText,
            { color: filter === 'all' ? '#fff' : colors.text }
          ]}>
            Toutes ({notifications.length})
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.filterBtn,
            filter === 'unread' && styles.filterBtnActive,
            { 
              backgroundColor: filter === 'unread' ? colors.primary : colors.card,
              opacity: pressed ? 0.8 : 1,
            }
          ]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[
            styles.filterText,
            { color: filter === 'unread' ? '#fff' : colors.text }
          ]}>
            Non lues ({unreadCount})
          </Text>
        </Pressable>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredNotifications.length === 0 ? (
          <Animated.View 
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.emptyState}
          >
            <Ionicons name="notifications-off-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Aucune notification
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {filter === 'unread' 
                ? 'Toutes vos notifications ont été lues'
                : 'Vous n\'avez aucune notification pour le moment'
              }
            </Text>
          </Animated.View>
        ) : (
          filteredNotifications.map((notification, index) => (
            <Animated.View 
              key={notification.id}
              entering={FadeInDown.delay(100 + index * 50).duration(400)}
            >
              <PremiumCard 
                style={[
                  styles.notificationCard, 
                  { 
                    backgroundColor: colors.card,
                    opacity: notification.read ? 0.7 : 1,
                  }
                ]}
                elevated
                delay={0}
              >
                <Pressable 
                  style={styles.notificationContent}
                  onPress={() => handleMarkAsRead(notification.id)}
                >
                  <PremiumIcon
                    name={notification.icon as any}
                    size={48}
                    iconSize={24}
                    colors={notification.colors}
                    shape="rounded"
                  />
                  
                  <View style={styles.notificationBody}>
                    <View style={styles.notificationHeader}>
                      <Text style={[styles.notificationTitle, { color: colors.text }]}>
                        {notification.title}
                      </Text>
                      {!notification.read && (
                        <View style={styles.unreadDot} />
                      )}
                    </View>
                    <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>
                      {notification.message}
                    </Text>
                    <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>
                      {notification.time}
                    </Text>
                  </View>

                  <Pressable 
                    style={styles.deleteButton}
                    onPress={() => handleDelete(notification.id)}
                  >
                    <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
                  </Pressable>
                </Pressable>
              </PremiumCard>
            </Animated.View>
          ))
        )}

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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  headerBadge: {
    marginTop: -2,
  },
  markAllButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Filters
  filtersContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterBtnActive: {
    shadowOpacity: 0.2,
    elevation: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationCard: {
    padding: 16,
    marginBottom: 12,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  notificationBody: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  notificationMessage: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 4,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
