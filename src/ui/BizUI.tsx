import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
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

// Zee is drawn with native shapes so it stays crisp without loading an image.
export function Zee({ size = 96 }: { size?: number }) {
  return (
    <View accessible accessibilityLabel="Zee, your cheerful bee guide" style={{ width: size, height: size }}>
      <View style={{ width: 100, height: 100, transform: [{ scale: size / 100 }], transformOrigin: 'top left' }}>
        <View style={[styles.wing, { left: 3, transform: [{ rotate: '-30deg' }] }]} />
        <View style={[styles.wing, { right: 3, transform: [{ rotate: '30deg' }] }]} />
        <View style={[styles.antenna, { left: 34, transform: [{ rotate: '-20deg' }] }]} />
        <View style={[styles.antenna, { right: 34, transform: [{ rotate: '20deg' }] }]} />
        <View style={styles.bee}>
          <View style={styles.stripe} />
          <View style={[styles.eye, { left: 18 }]} /><View style={[styles.eye, { right: 18 }]} />
          <View style={[styles.cheek, { left: 9 }]} /><View style={[styles.cheek, { right: 9 }]} />
          <View style={styles.smile} />
        </View>
      </View>
    </View>
  );
}

export function Brand() {
  return <View style={ui.row}><Zee size={34} /><Text style={styles.brand}>biz<Text style={{ color: '#9C7800' }}>-z.</Text></Text></View>;
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
  wing: { position: 'absolute', top: 31, width: 30, height: 38, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#DDD8C6' },
  antenna: { position: 'absolute', top: 8, height: 22, width: 5, borderRadius: 8, backgroundColor: colors.ink },
  bee: { position: 'absolute', top: 23, left: 16, width: 68, height: 65, borderRadius: 34, borderWidth: 2, borderColor: '#D5AE32', backgroundColor: colors.yellow, overflow: 'hidden' },
  stripe: { position: 'absolute', bottom: 5, height: 11, width: 68, backgroundColor: colors.ink },
  eye: { position: 'absolute', top: 18, width: 6, height: 9, borderRadius: 5, backgroundColor: colors.ink },
  cheek: { position: 'absolute', top: 30, width: 12, height: 7, borderRadius: 8, backgroundColor: '#F4A071' },
  smile: { position: 'absolute', top: 28, left: 26, width: 13, height: 9, borderBottomWidth: 3, borderLeftWidth: 2, borderRightWidth: 2, borderColor: colors.ink, borderBottomLeftRadius: 9, borderBottomRightRadius: 9 },
  note: { padding: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.lavender },
  noteTitle: { color: colors.purple, fontSize: 13, fontWeight: '800' },
});
