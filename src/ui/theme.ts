import { StyleSheet } from 'react-native';

export const colors = {
  background: '#FAFAF4', surface: '#FFFFFF', ink: '#27352C', muted: '#667064',
  yellow: '#FFD84D', yellowEdge: '#CBA42D', cream: '#FFF2B3', purple: '#7754B5',
  lavender: '#F0E9FC', green: '#527B35', mint: '#EAF3DE', blue: '#EAF2FC',
  pink: '#FCECE9', line: '#E3E6DA', error: '#AB3434',
};

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 22, paddingBottom: 32, gap: 20 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.6, color: colors.muted },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '800', color: colors.ink, letterSpacing: -0.8 },
  heading: { fontSize: 21, lineHeight: 28, fontWeight: '800', color: colors.ink },
  body: { fontSize: 15, lineHeight: 23, color: colors.muted },
  small: { fontSize: 12, lineHeight: 19, color: colors.muted },
  card: { padding: 20, borderRadius: 22, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.surface, gap: 12 },
  label: { fontSize: 15, fontWeight: '700', color: colors.ink, marginBottom: 8 },
  input: { borderWidth: 2, borderColor: colors.line, borderRadius: 16, padding: 14, fontSize: 16, color: colors.ink, backgroundColor: colors.surface, minHeight: 54 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.lavender, borderRadius: 12 },
  chipText: { color: colors.purple, fontSize: 12, fontWeight: '700' },
});
