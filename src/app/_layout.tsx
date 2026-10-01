import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import App from '../../App';
import { colors } from '../ui/theme';
import { PlanningProvider } from '../state/PlanningProvider';

export default function RootLayout() {
  return (
    <App>
      <PlanningProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, headerTintColor: colors.ink, headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="business" options={{ headerShown: true, title: 'My business' }} />
        <Stack.Screen name="help" options={{ headerShown: true, title: 'A little help' }} />
        <Stack.Screen name="plan/[id]" options={{ headerShown: true, title: 'Build my plan' }} />
        <Stack.Screen name="plan-preview" options={{ headerShown: true, title: 'Review & export' }} />
        <Stack.Screen name="launch-guide" options={{ headerShown: true, title: 'Start my business' }} />
        <Stack.Screen name="document-preview" options={{ headerShown: false }} />
      </Stack>
      </PlanningProvider>
    </App>
  );
}
