import React from 'react';
import { Image, ScrollView, Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBusinessApp } from '../../App';
import { businessNameFromPlan, completeSections, formatDraftParagraphs, MODULES } from '../data/plan';
import { usePlanning } from '../state/PlanningProvider';
import { Action } from '../ui/BizUI';
import { colors, ui } from '../ui/theme';

export default function DocumentPreview() {
  const app = useBusinessApp();
  const { plan } = usePlanning();
  const router = useRouter();
  const selection = app.selectedBusiness;
  const reviewed = completeSections(plan);
  const chapters = MODULES.filter(module => module.id !== 'summary');
  const chapterTitles: Record<string, string> = { overview: 'Company Overview', products: 'Product/Service', market: 'Market Analysis', marketing: 'Marketing Plan', operations: 'Operations and Management Plan', finance: 'Financial Plan' };
  const toc = ['Executive Summary', ...chapters.map((module, index) => `Chapter ${index + 1}: ${chapterTitles[module.id]}`)];

  if (!selection) return <View style={ui.content}><Action title="Back to my plan" icon="arrow-back" onPress={() => router.back()} /><Text style={ui.heading}>Choose a business to preview its plan.</Text></View>;

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <Action title="Back to Review & export" icon="arrow-back" variant="secondary" onPress={() => router.back()} />
    <Text style={ui.eyebrow}>DOCUMENT PREVIEW · {reviewed}/{MODULES.length} MODULES COMPLETE</Text>
    <Text style={ui.small}>Template order: title page, contents, executive summary, and Chapters 1–6.</Text>
    <View style={styles.paper}>
      <View style={styles.cover}>
        {plan.logoDataUrl ? <Image source={{ uri: plan.logoDataUrl }} resizeMode="contain" style={styles.logo} /> : <Text style={styles.logoPlaceholder}>Insert Logo Here</Text>}
        <Text style={styles.coverTitle}>A Business Plan</Text>
        {!!businessNameFromPlan(plan) && <Text style={styles.businessName}>{businessNameFromPlan(plan)}</Text>}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Table of Contents</Text>
        {toc.map((item, index) => <Text key={item} style={styles.paragraph}>{index < 2 || index > chapters.length + 1 ? item : `${item}`}</Text>)}
      </View>
      {[MODULES.find(module => module.id === 'summary')!, ...chapters].map((module, index) => {
        const section = plan.sections[module.id];
        const heading = module.id === 'summary' ? 'Executive Summary' : `Chapter ${index}: ${chapterTitles[module.id]}`;
        const paragraphs = formatDraftParagraphs(section.text).split(/\n\s*\n/).filter(Boolean);
        return <View key={module.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{heading}</Text>
          <View style={styles.rule} />
          {paragraphs.map((paragraph, paragraphIndex) => <Text selectable key={`${module.id}-${paragraphIndex}`} style={styles.paragraph}>{paragraph}</Text>)}
        </View>;
      })}
    </View>
    <Action title="Back to Review & export" icon="arrow-back" variant="secondary" onPress={() => router.back()} />
  </ScrollView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 18, paddingBottom: 36, gap: 14 },
  paper: { paddingHorizontal: 22, paddingVertical: 26, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 8, gap: 24, elevation: 2 },
  cover: { padding: 20, backgroundColor: colors.cream, borderRadius: 8, gap: 10 },
  logo: { width: 160, height: 120 },
  logoPlaceholder: { fontSize: 13, color: colors.muted },
  businessName: { fontSize: 18, color: colors.ink },
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
