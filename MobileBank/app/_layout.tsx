import { ThemeProvider } from '@/contexts/theme-context';
import { AuthProvider } from '@/contexts/auth-context';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { firebaseService } from '@/services';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Add any custom fonts here if needed
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Initialiser Firebase et les notifications
  useEffect(() => {
    const initFirebase = async () => {
      try {
        console.log('Initializing Firebase notifications...');
        
        // Demander la permission pour les notifications
        const hasPermission = await firebaseService.requestPermission();
        console.log('Notification permission:', hasPermission);
        
        // Configurer les listeners
        const unsubscribe = firebaseService.setupNotificationListeners();
        
        // Récupérer le token FCM (pour vérification)
        const token = await firebaseService.getFCMToken();
        console.log('FCM Token initialized:', token.substring(0, 20) + '...');
        
        return unsubscribe;
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    };

    const cleanup = initFirebase();
    
    return () => {
      cleanup.then(unsubscribe => {
        if (unsubscribe) {
          unsubscribe();
        }
      });
    };
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'default',
            animationDuration: 250,
          }}
        >
          <Stack.Screen 
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="(auth)" 
            options={{ 
              headerShown: false,
              animation: 'fade',
            }} 
          />
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              animation: 'fade',
            }} 
          />
          <Stack.Screen 
            name="(screens)"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="statistics"
            options={{
              animation: 'slide_from_right',
              animationDuration: 250,
            }}
          />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
