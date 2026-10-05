import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Action, Brand, Zee } from '../ui/BizUI';
import { colors, ui } from '../ui/theme';
export default function LandingScreen({ onGetStarted, onLogin }: { onGetStarted: () => void; onLogin: () => void }) {
  return <ScrollView style={ui.screen} contentContainerStyle={[ui.content, { flexGrow: 1 }]}>
    <Brand />
    <View style={styles.hero}><View style={styles.spark}><Ionicons name="sparkles" size={25} color={colors.yellowEdge} /></View><View style={styles.halo}><Zee size={150} /></View><Text style={styles.sticker}>Small steps. Big possibilities.</Text></View>
    <Text style={ui.eyebrow}>BIG IDEAS START SMALL</Text>
    <Text style={styles.title}>A little closer to{'\n'}“I built this.”</Text>
    <Text style={ui.body}>Turn what makes you, you into a business idea worth exploring. One small step at a time.</Text>
    <View style={styles.steps}>{['Find your spark', 'Explore ideas', 'Choose your path'].map((text, i) => <View key={text} style={styles.step}><Text style={styles.number}>{i + 1}</Text><Text style={styles.stepText}>{text}</Text></View>)}</View>
    <View style={{ gap: 12, marginTop: 'auto', paddingTop: 8 }}><Action title="Sign up" icon="arrow-forward" onPress={onGetStarted} /><Action title="Log in" variant="secondary" onPress={onLogin} /><Text style={[ui.small, { textAlign: 'center' }]}>A little progress. A lot of possibility.</Text></View>
  </ScrollView>;
}
const styles = StyleSheet.create({
  hero: { height: 190, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  halo: { width: 176, height: 176, borderRadius: 88, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream },
  spark: { position: 'absolute', top: 18, right: '14%' },
  sticker: { position: 'absolute', bottom: 0, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.line, borderRadius: 10, padding: 9, transform: [{ rotate: '-5deg' }], color: colors.ink, fontSize: 11, fontWeight: '800' },
  title: { fontSize: 39, lineHeight: 44, letterSpacing: -1.3, fontWeight: '900', color: colors.ink },
  steps: { flexDirection: 'row', gap: 8 },
  step: { flex: 1, padding: 12, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, gap: 8 },
  number: { color: colors.purple, fontSize: 18, fontWeight: '800' },
  stepText: { fontSize: 12, lineHeight: 17, fontWeight: '600', color: colors.ink },
});
