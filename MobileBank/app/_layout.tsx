import { ThemeProvider } from '@/contexts/theme-context';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

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

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'default',
          animationDuration: 250,
        }}
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            animation: 'fade',
          }} 
        />
        <Stack.Screen 
          name="login"
          options={{
            animation: 'fade',
            animationDuration: 200,
          }}
        />
        <Stack.Screen 
          name="register" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            animationDuration: 300,
          }}
        />
        <Stack.Screen 
          name="account-details"
          options={{
            animation: 'slide_from_right',
            animationDuration: 250,
          }}
        />
        <Stack.Screen 
          name="transaction-history"
          options={{
            animation: 'slide_from_right',
            animationDuration: 250,
          }}
        />
        <Stack.Screen 
          name="new-transfer"
          options={{
            animation: 'slide_from_bottom',
            animationDuration: 300,
          }}
        />
        <Stack.Screen 
          name="transfer-confirmation"
          options={{
            animation: 'slide_from_right',
            animationDuration: 250,
          }}
        />
        <Stack.Screen 
          name="transfer-success" 
          options={{
            presentation: 'modal',
            animation: 'fade',
            animationDuration: 200,
          }}
        />
        <Stack.Screen 
          name="beneficiaries"
          options={{
            animation: 'slide_from_right',
            animationDuration: 250,
          }}
        />
        <Stack.Screen 
          name="add-beneficiary-modal"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            animationDuration: 300,
          }}
        />
        <Stack.Screen 
          name="notifications"
          options={{
            animation: 'slide_from_right',
            animationDuration: 250,
          }}
        />
        <Stack.Screen 
          name="profile"
          options={{
            animation: 'slide_from_right',
            animationDuration: 250,
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
    </ThemeProvider>
  );
}
