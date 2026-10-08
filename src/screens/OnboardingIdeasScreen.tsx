import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Action, Brand, Zee } from '../ui/BizUI';
import { colors, ui } from '../ui/theme';

export type OnboardingIdeasStatus =
  | 'idle'
  | 'saving'
  | 'generating'
  | 'ready'
  | 'error';

type Props = {
  status: Exclude<OnboardingIdeasStatus, 'idle'>;
  error: string;
  onRetry: () => void;
  onContinue: () => void;
};

export default function OnboardingIdeasScreen({
  status,
  error,
  onRetry,
  onContinue,
}: Props) {
  const [scale] = useState(() => new Animated.Value(1));
  const loading = status === 'saving' || status === 'generating';
  const ready = status === 'ready';

  useEffect(() => {
    if (loading) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.06,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }

    if (ready) {
      scale.setValue(0.72);
      Animated.spring(scale, {
        toValue: 1,
        speed: 15,
        bounciness: 8,
        useNativeDriver: true,
      }).start();
    } else {
      scale.setValue(1);
    }
  }, [loading, ready, scale]);

  return (
    <View style={styles.screen}>
      <View style={styles.brand}><Brand /></View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.illustration,
            ready && styles.successIllustration,
            { transform: [{ scale }] },
          ]}
        >
          {ready ? (
            <Ionicons name="checkmark" size={58} color={colors.green} />
          ) : status === 'error' ? (
            <Ionicons name="refresh" size={48} color={colors.purple} />
          ) : (
            <>
              <Zee size={110} />
              <ActivityIndicator
                style={styles.spinner}
                size="small"
                color={colors.purple}
              />
            </>
          )}
        </Animated.View>

        {ready ? (
          <>
            <Text style={ui.eyebrow}>A GREAT FIRST STEP</Text>
            <Text style={[ui.title, styles.centerText]}>Your ideas are ready!</Text>
            <Text style={[ui.body, styles.centerText]}>
              Zee has found three possibilities shaped around your interests,
              strengths, and starting point.
            </Text>
            <View style={styles.successCard}>
              <Ionicons name="sparkles" size={20} color={colors.purple} />
              <Text style={styles.successCardText}>
                Take a look, compare them, and choose the one you’d like to explore.
              </Text>
            </View>
            <Action title="See my ideas" icon="arrow-forward" onPress={onContinue} />
          </>
        ) : status === 'error' ? (
          <>
            <Text style={ui.eyebrow}>ONE SMALL SETBACK</Text>
            <Text style={[ui.title, styles.centerText]}>We couldn’t find your ideas just yet.</Text>
            <Text style={[ui.body, styles.centerText]}>
              Your profile is saved. Try again when you’re ready.
            </Text>
            {!!error && <Text style={styles.error}>{error}</Text>}
            <Action title="Try again" icon="refresh" onPress={onRetry} />
          </>
        ) : (
          <>
            <Text style={ui.eyebrow}>YOUR PROFILE IS IN</Text>
            <Text style={[ui.title, styles.centerText]}>
              {status === 'saving' ? 'Saving your starting point…' : 'Finding ideas that feel like you…'}
            </Text>
            <Text style={[ui.body, styles.centerText]}>
              {status === 'saving'
                ? 'We’re keeping your answers safe before Zee gets to work.'
                : 'Zee is connecting your interests, strengths, location, and budget.'}
            </Text>
            <View style={styles.progressCard}>
              <View style={styles.progressRow}>
                {status === 'saving' ? (
                  <ActivityIndicator size="small" color={colors.purple} />
                ) : (
                  <View style={styles.doneIcon}>
                    <Ionicons name="checkmark" size={14} color={colors.green} />
                  </View>
                )}
                <Text style={status === 'saving' ? styles.activeText : styles.doneText}>
                  {status === 'saving' ? 'Saving your profile' : 'Profile saved'}
                </Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressRow}>
                {status === 'saving' ? (
                  <Ionicons name="ellipse-outline" size={18} color={colors.line} />
                ) : (
                  <ActivityIndicator size="small" color={colors.purple} />
                )}
                <Text style={status === 'saving' ? styles.doneText : styles.activeText}>
                  {status === 'saving' ? 'Tailoring your ideas next' : 'Tailoring your ideas'}
                </Text>
              </View>
            </View>
            <Text style={[ui.small, styles.centerText]}>
              This may take a little moment. Keep the app open while Zee thinks.
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  brand: {
    paddingTop: 14,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 18,
    paddingBottom: 30,
  },
  illustration: {
    width: 156,
    height: 156,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 78,
    backgroundColor: colors.cream,
    marginBottom: 6,
  },
  successIllustration: {
    backgroundColor: colors.mint,
    borderWidth: 3,
    borderColor: '#D6E7C4',
  },
  spinner: {
    position: 'absolute',
    bottom: 17,
    right: 21,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 5,
  },
  centerText: {
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 24,
  },
  doneIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mint,
  },
  doneText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  activeText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  progressDivider: {
    height: 1,
    backgroundColor: colors.line,
    marginLeft: 10,
  },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    borderRadius: 18,
    padding: 15,
    backgroundColor: colors.lavender,
  },
  successCardText: {
    flex: 1,
    color: colors.purple,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  error: {
    color: colors.error,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
  },
});
