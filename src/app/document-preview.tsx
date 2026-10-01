import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBusinessApp } from '../../App';
import { answeredSteps, completeSections, formatDraftParagraphs, isSectionComplete, MODULES } from '../data/plan';
import { usePlanning } from '../state/PlanningProvider';
import { Action } from '../ui/BizUI';
import { colors, ui } from '../ui/theme';

export default function DocumentPreview() {
  const app = useBusinessApp();
  const { plan } = usePlanning();
  const router = useRouter();
  const selection = app.selectedBusiness;
  const reviewed = completeSections(plan);

  if (!selection) return <View style={ui.content}><Action title="Back to my plan" icon="arrow-back" onPress={() => router.back()} /><Text style={ui.heading}>Choose a business to preview its plan.</Text></View>;

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <Action title="Back to Review & export" icon="arrow-back" variant="secondary" onPress={() => router.back()} />
    <Text style={ui.eyebrow}>DOCUMENT PREVIEW · {reviewed}/8 SECTIONS COMPLETE</Text>
    <Text style={ui.small}>This in-app preview follows the PDF’s content and section order. Page breaks may look different when exported.</Text>
    <View style={styles.paper}>
      <View style={styles.cover}>
        <Text style={styles.brand}>biz-z. <Text style={styles.brandTag}>YOUR BUSINESS PLAN</Text></Text>
        <Text style={styles.coverTitle}>{selection.idea.title}</Text>
        <Text style={styles.meta}>Prepared {new Date().toLocaleDateString()} · {reviewed}/8 sections reviewed</Text>
        <Text style={styles.meta}>{selection.idea.industry} · {selection.currency}</Text>
      </View>
      {MODULES.map((module, index) => {
        const section = plan.sections[module.id];
        const count = answeredSteps(section, module.id);
        const status = module.id === 'legal'
          ? section.text.trim() ? 'Planning notes — confirm applicable requirements before opening' : 'Not started'
          : section.reviewed ? 'Reviewed by owner' : section.text.trim() ? 'Draft — not reviewed' : 'Not started';
        const heading = 'pdfTitle' in module ? module.pdfTitle : module.title;
        const paragraphs = (formatDraftParagraphs(section.text) || 'This section has not been written yet.').split(/\n\s*\n/);
        return <View key={module.id} style={styles.section}>
          <Text style={styles.sectionEyebrow}>{String(index + 1).padStart(2, '0')} · {isSectionComplete(section, module.id) ? 'COMPLETE' : `${count}/${module.questions.length} STEPS · ${status.toUpperCase()}`}</Text>
          <Text style={styles.sectionTitle}>{heading}</Text>
          <View style={styles.rule} />
          <Text style={styles.status}>{status}</Text>
          {paragraphs.map((paragraph, paragraphIndex) => <Text selectable key={`${module.id}-${paragraphIndex}`} style={styles.paragraph}>{paragraph}</Text>)}
        </View>;
      })}
      <Text style={styles.footer}>Built with Biz-Z. Estimates and assumptions require verification. Legal planning notes do not confirm compliance; verify requirements before launch.</Text>
    </View>
    <Action title="Back to Review & export" icon="arrow-back" variant="secondary" onPress={() => router.back()} />
  </ScrollView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 18, paddingBottom: 36, gap: 14 },
  paper: { paddingHorizontal: 22, paddingVertical: 26, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 8, gap: 24, elevation: 2 },
  cover: { padding: 20, backgroundColor: colors.cream, borderRadius: 8, gap: 10 },
  brand: { fontSize: 13, fontWeight: '900', color: colors.ink, letterSpacing: 1 },
  brandTag: { fontSize: 10, color: colors.muted, letterSpacing: 1.2 },
  coverTitle: { fontSize: 28, lineHeight: 34, fontWeight: '800', color: colors.ink },
  meta: { fontSize: 12, lineHeight: 18, color: colors.muted },
  section: { gap: 10 },
  sectionEyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.1, color: colors.muted },
  sectionTitle: { fontSize: 20, lineHeight: 27, fontWeight: '800', color: colors.ink },
  rule: { height: 2, backgroundColor: colors.yellow, marginBottom: 2 },
  status: { fontSize: 11, lineHeight: 17, color: colors.muted },
  paragraph: { fontSize: 14, lineHeight: 21, color: colors.ink },
  footer: { borderTopWidth: 1, borderColor: colors.line, paddingTop: 14, fontSize: 11, lineHeight: 17, color: colors.muted },
});
