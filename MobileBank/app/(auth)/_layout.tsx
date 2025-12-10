import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen 
        name="design-systems/index" 
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen 
        name="design-systems/material-design-3" 
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="design-systems/ios-hig" 
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="design-systems/ant-mobile" 
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="design-systems/banking-modern" 
        options={{
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
