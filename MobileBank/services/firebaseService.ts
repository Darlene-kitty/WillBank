/**
 * Service de gestion des notifications Firebase Cloud Messaging
 * Version compatible Expo - utilise le token par défaut pour le développement
 */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FCM_TOKEN_KEY = 'fcmToken';
const DEFAULT_FCM_TOKEN = '6w088Q-tg6lOvFDlIM81GxI7oFXGZvczzNs2O8aHYA8';

// Type pour les permissions (compatible avec Firebase)
type AuthorizationStatus = {
  AUTHORIZED: number;
  DENIED: number;
  NOT_DETERMINED: number;
  PROVISIONAL: number;
};

export const firebaseService = {
  /**
   * Demande la permission pour les notifications push
   * Version Expo : Retourne toujours true et utilise le token par défaut
   */
  requestPermission: async (): Promise<boolean> => {
    try {
      console.log('Firebase permission requested (Expo mode - using default token)');
      // En mode Expo, on simule l'acceptation des permissions
      return true;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return true; // Retourner true pour ne pas bloquer le flux
    }
  },

  /**
   * Récupère le token FCM
   * Version Expo : Retourne toujours le token par défaut
   */
  getFCMToken: async (): Promise<string> => {
    try {
      // Vérifier si on a déjà un token en cache
      const cachedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
      if (cachedToken) {
        console.log('Using cached FCM token');
        return cachedToken;
      }

      // En mode Expo, utiliser le token par défaut
      console.log('Using default FCM token for development');
      const token = DEFAULT_FCM_TOKEN;
      
      // Sauvegarder en cache
      await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      // Retourner le token par défaut en cas d'erreur
      return DEFAULT_FCM_TOKEN;
    }
  },

  /**
   * Configure les listeners pour les notifications
   * Version Expo : Fonction vide qui retourne un cleanup
   */
  setupNotificationListeners: () => {
    console.log('Notification listeners setup (Expo mode - limited functionality)');
    
    // Retourner une fonction de nettoyage vide
    return () => {
      console.log('Notification listeners cleaned up');
    };
  },

  /**
   * Vérifie si les notifications sont activées
   * Version Expo : Retourne toujours true
   */
  checkNotificationPermission: async (): Promise<boolean> => {
    console.log('Checking notification permission (Expo mode)');
    return true;
  },

  /**
   * Supprime le token FCM
   */
  deleteFCMToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(FCM_TOKEN_KEY);
      console.log('FCM token deleted from cache');
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  },

  /**
   * Récupère le token par défaut
   */
  getDefaultToken: (): string => {
    return DEFAULT_FCM_TOKEN;
  },
};
