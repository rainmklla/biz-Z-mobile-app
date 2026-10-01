import React from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBusinessApp } from '../../App';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

export default function ResetPasswordRoute() {
  const app = useBusinessApp();
  const params = useLocalSearchParams<{
    mode?: string | string[];
    oobCode?: string | string[];
  }>();

  const valid =
    params.mode === 'resetPassword' &&
    typeof params.oobCode === 'string' &&
    params.oobCode.trim().length > 0;

  if (app.initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#245c42" />
        <Text>Opening your reset link…</Text>
      </View>
    );
  }

  if (app.startupError) {
    return (
      <View style={styles.center}>
        <Text>{app.startupError}</Text>
        <Button title="Try again" onPress={app.retryStartup} />
      </View>
    );
  }

  if (!valid || typeof params.oobCode !== 'string') {
    return (
      <View style={styles.center}>
        <Text>This reset link is incomplete. Please request a new one.</Text>
        <Button
          title="Back to login"
          onPress={app.cancelPasswordReset}
          color="#245c42"
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ResetPasswordScreen
        key={params.oobCode}
        code={params.oobCode}
        onDone={accountEmail => {
          void app.finishPasswordReset(accountEmail);
        }}
        onCancel={app.cancelPasswordReset}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
    backgroundColor: '#ffffff',
  },
});