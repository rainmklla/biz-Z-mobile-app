import React from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, ui } from './theme';

type ActionProps = {
  title: string; onPress: () => void; disabled?: boolean; loading?: boolean;
  variant?: 'primary' | 'secondary' | 'accent' | 'quiet';
  icon?: React.ComponentProps<typeof Ionicons>['name'];
};

export function Action({ title, onPress, disabled = false, loading = false, variant = 'primary', icon }: ActionProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={({ pressed }) => [styles.button, variant === 'primary' ? styles.primary : variant === 'accent' ? styles.accent : styles.secondary,
        variant === 'quiet' && styles.quiet, pressed && { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
        (disabled || loading) && { opacity: 0.55 }]}>
      {loading ? <ActivityIndicator color={variant === 'accent' ? colors.purple : colors.ink} /> : icon ? <Ionicons name={icon} size={19} color={variant === 'accent' ? colors.purple : colors.ink} /> : null}
      <Text style={[styles.buttonText, variant === 'accent' && styles.accentText]}>{title}</Text>
    </Pressable>
  );
}

export function Zee({ size = 96 }: { size?: number }) {
  return (
    <Image
      accessible
      accessibilityLabel="Zee, your cheerful bee guide"
      source={require('../../assets/biz-z.png')}
      resizeMode="contain"
      style={{ width: size, height: size }}
    />
  );
}

export function Brand() {
  return <View style={ui.row}><Image accessible accessibilityLabel="Biz-Z logo" source={require('../../assets/favicon.png')} resizeMode="contain" style={{ width: 34, height: 34 }} /><Text style={styles.brand}>biz<Text style={{ color: '#9C7800' }}>-z.</Text></Text></View>;
}

export function ZeeNote({ children }: React.PropsWithChildren) {
  return <View style={styles.note}><Zee size={54} /><View style={{ flex: 1, gap: 4 }}><Text style={styles.noteTitle}>A little help from Zee</Text><Text style={ui.small}>{children}</Text></View></View>;
}

const styles = StyleSheet.create({
  button: { minHeight: 54, borderRadius: 16, paddingVertical: 13, paddingHorizontal: 17, borderWidth: 2, borderBottomWidth: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primary: { backgroundColor: colors.yellow, borderColor: colors.yellowEdge },
  accent: { backgroundColor: colors.lavender, borderColor: colors.purple },
  secondary: { backgroundColor: colors.surface, borderColor: colors.line },
  quiet: { backgroundColor: 'transparent', borderColor: 'transparent', borderBottomWidth: 2 },
  buttonText: { fontSize: 15, fontWeight: '800', color: colors.ink, flexShrink: 1, textAlign: 'center' },
  accentText: { color: colors.purple },
  brand: { fontSize: 25, fontWeight: '900', letterSpacing: -1, color: colors.ink },
  note: { padding: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.lavender },
  noteTitle: { color: colors.purple, fontSize: 13, fontWeight: '800' },
});
