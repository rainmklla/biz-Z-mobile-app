import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  checkPasswordResetLink,
  completePasswordReset,
} from '../services/passwordResetService';
import { Action, Brand } from '../ui/BizUI';
import { colors, ui } from '../ui/theme';
import { getPasswordRequirementStatus } from '../services/passwordPolicy';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  code: string;
  onDone: (email: string) => void;
  onCancel: () => void;
};

export default function ResetPasswordScreen({
  code,
  onDone,
  onCancel,
}: Props) {
  const [checking, setChecking] = useState(true);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [linkError, setLinkError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [success, setSuccess] = useState(false);

  const savingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    // The route keys this component by code, so a new link starts with fresh state.
    checkPasswordResetLink(code)
      .then(email => {
        if (!cancelled) {
          setVerifiedEmail(email);
        }
      })
      .catch(error => {
        if (!cancelled) {
          setLinkError(
            error instanceof Error
              ? error.message
              : 'Unable to verify this reset link.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setChecking(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  async function saveNewPassword() {
    if (
      checking ||
      !verifiedEmail ||
      linkError ||
      savingRef.current ||
      success
    ) {
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setSaveError('');

    try {
      await completePasswordReset(code, password, confirmation);
      setPassword('');
      setConfirmation('');
      setSuccess(true);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <View style={{ marginBottom: 28 }}><Brand /></View>

      {checking ? (
        <View style={styles.status}>
          <ActivityIndicator size="large" color="#245c42" />
          <Text style={styles.description}>
            Checking your reset link…
          </Text>
        </View>
      ) : linkError ? (
        <View>
          <Text style={styles.title}>Unable to use this link</Text>
          <Text style={styles.error}>{linkError}</Text>

          <Action
            title="Back to login"
            onPress={onCancel}
          />
        </View>
      ) : success ? (
        <View>
          <Text style={styles.title}>Password updated</Text>

          <Text style={styles.description}>
            Your new password has been saved. Log in with it to
            continue your business plan.
          </Text>

          <Action
            title="Go to login"
            onPress={() => onDone(verifiedEmail)}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Choose a new password</Text>

          <Text style={styles.description}>
            Resetting the password for {verifiedEmail}
          </Text>

          <Text style={styles.label}>New password</Text>
          <TextInput
            style={[ui.input, { marginBottom: 20 }]}
            accessibilityLabel="New password"
            placeholder="Enter your new password"
            placeholderTextColor="#77857d"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!saving}
          />

          <View style={styles.passwordRequirements} accessibilityLiveRegion="polite">
            <Text style={styles.requirementsTitle}>Your password must have</Text>
            {getPasswordRequirementStatus(password).map(requirement => (
              <View key={requirement.id} style={styles.requirementRow}>
                <Ionicons
                  name={requirement.met ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={requirement.met ? '#3f7655' : colors.muted}
                />
                <Text style={[styles.requirementText, requirement.met && styles.requirementMet]}>
                  {requirement.label}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.label}>Confirm new password</Text>
          <TextInput
            style={[ui.input, { marginBottom: 20 }]}
            accessibilityLabel="Confirm new password"
            placeholder="Enter it again"
            placeholderTextColor="#77857d"
            value={confirmation}
            onChangeText={setConfirmation}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!saving}
          />

          {!!saveError && (
            <Text style={styles.error} accessibilityLiveRegion="polite">
              {saveError}
            </Text>
          )}

          <Action
            title={saving ? 'Updating password…' : 'Update password'}
            onPress={saveNewPassword}
            disabled={saving}
          />

          <View style={styles.space} />

          <Action
            title="Cancel"
            onPress={onCancel}
            disabled={saving}
            variant="secondary"
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 48,
  },
  brand: {
    fontSize: 14,
    fontWeight: '600',
    color: '#245c42',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#18382c',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#596c62',
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18382c',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
    color: '#18382c',
  },
  passwordRequirements: {
    marginTop: -8,
    marginBottom: 20,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  requirementsTitle: {
    color: '#18382c',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    minHeight: 23,
  },
  requirementText: {
    color: colors.muted,
    fontSize: 12,
  },
  requirementMet: {
    color: '#3f7655',
  },
  error: {
    color: '#b3261e',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  status: {
    alignItems: 'center',
    gap: 16,
    marginTop: 32,
  },
  space: {
    height: 16,
  },
});
