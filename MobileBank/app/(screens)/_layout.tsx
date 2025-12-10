import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="account-config" />
      <Stack.Screen name="account-details" />
      <Stack.Screen name="account-settings" />
      <Stack.Screen 
        name="add-beneficiary-modal"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="beneficiaries" />
      <Stack.Screen name="deposit-confirmation" />
      <Stack.Screen 
        name="deposit-success"
        options={{
          presentation: 'modal',
          animation: 'fade',
        }}
      />
      <Stack.Screen name="deposit" />
      <Stack.Screen name="new-transfer" />
      <Stack.Screen name="notification-settings" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="profile-settings" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="transaction-history" />
      <Stack.Screen name="transfer-confirmation" />
      <Stack.Screen 
        name="transfer-success-temp"
        options={{
          presentation: 'modal',
          animation: 'fade',
        }}
      />
      <Stack.Screen 
        name="transfer-success"
        options={{
          presentation: 'modal',
          animation: 'fade',
        }}
      />
    </Stack>
  );
}
