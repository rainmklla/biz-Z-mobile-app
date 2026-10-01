import React, { useState } from 'react';
import { Alert, Platform, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useBusinessApp } from '../../App';
import { answeredSteps, completeSections, formatDraftParagraphs, isSectionComplete, MODULES, planHtml } from '../data/plan';
import { usePlanning } from '../state/PlanningProvider';
import { Action, Zee } from '../ui/BizUI';
import { colors, ui } from '../ui/theme';

export default function PlanPreview() {
  const app = useBusinessApp(); const store = usePlanning(); const router = useRouter();
  const [busy, setBusy] = useState(false); const [status, setStatus] = useState('');
  const selection = app.selectedBusiness;
  const complete = completeSections(store.plan);
  const planReady = complete === MODULES.length;
  const actionsLocked = !store.ready || !!store.error || !planReady || busy;
  async function run(task: () => Promise<void>) { if (busy) return; setBusy(true); setStatus(''); try { await task(); } catch (e) { Alert.alert('Could not finish', e instanceof Error ? e.message : 'Please try again.'); } finally { setBusy(false); } }
  async function exportPdf() {
    if (!selection) return;
    if (!planReady) { Alert.alert('Finish your guided plan first', 'Answer every guided step, save and review each section, then you can export a complete PDF.'); return; }
    await run(async () => {
      const Print = await import('expo-print');
      const html = planHtml(selection.idea.title, store.plan);
      if (Platform.OS === 'web') { await Print.printAsync({ html }); return; }
      const Sharing = await import('expo-sharing');
      if (!await Sharing.isAvailableAsync()) throw new Error('Sharing is not available on this device.');
      const file = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', UTI: '.pdf', dialogTitle: 'Share your Biz-Z plan' });
      setStatus('PDF created. Choose a destination in the share sheet to keep a copy.');
    });
  }
  if (!app.user || !selection) return <View style={ui.content}><Text style={ui.heading}>Every plan starts with an idea.</Text><Action title="Explore ideas" onPress={() => router.navigate('/ideas')} /></View>;
  return <ScrollView style={ui.screen} contentContainerStyle={ui.content}>
    <Text style={ui.eyebrow}>LOOK WHAT YOU’RE BUILDING</Text><Text style={ui.title}>{selection.idea.title}</Text>
    <Text style={ui.body}>{complete} of 8 sections complete. To make a complete business plan, answer each section’s guided steps, save the draft, and mark it complete.</Text>
    {!!store.error && <Text style={{ color: colors.error }}>{store.error}</Text>}
    <Action title={planReady ? 'Export & share complete PDF' : 'Complete all 8 sections to unlock export'} icon={planReady ? 'download-outline' : 'lock-closed-outline'} loading={busy} disabled={actionsLocked} onPress={() => void exportPdf()} />
    <Action title={planReady ? 'Preview full document' : 'Complete all 8 sections to unlock preview'} icon={planReady ? 'eye-outline' : 'lock-closed-outline'} variant="secondary" disabled={actionsLocked} onPress={() => router.push('/document-preview')} />
    <Action title={planReady ? 'Start my business' : 'Complete all 8 sections to unlock launch guide'} icon={planReady ? 'compass-outline' : 'lock-closed-outline'} variant="accent" disabled={actionsLocked} onPress={() => router.push('/launch-guide')} />
    {!planReady && <Text style={ui.small}>Answer every guided step, save each draft, and mark all 8 sections complete to unlock these actions. {complete} of 8 complete.</Text>}
    <Text style={ui.small}>Review the complete document in Biz-Z, then use the back button to return here.</Text>
    <View style={[ui.card, { alignItems: 'center', backgroundColor: colors.cream }]}><Zee size={72} /><Text style={ui.eyebrow}>A BUSINESS PLAN BY YOU</Text><Text style={ui.heading}>{selection.idea.title}</Text><Text style={ui.small}>{selection.idea.industry} · {selection.currency}</Text></View>
    {MODULES.map((m, i) => <View key={m.id} style={ui.card}><Text style={ui.eyebrow}>0{i + 1} • {isSectionComplete(store.plan.sections[m.id], m.id) ? 'COMPLETE' : `${answeredSteps(store.plan.sections[m.id], m.id)}/${m.questions.length} STEPS · ${answeredSteps(store.plan.sections[m.id], m.id) < m.questions.length ? 'GUIDED DETAILS NEEDED' : store.plan.sections[m.id].text ? store.plan.sections[m.id].reviewed ? 'DRAFT REVIEWED' : 'DRAFT TO REVIEW' : 'DRAFT NEEDED'}`}</Text><Text style={ui.heading}>{m.title}</Text><Text selectable style={ui.body}>{formatDraftParagraphs(store.plan.sections[m.id].text) || 'A little space for your next idea. This section has not been written yet.'}</Text><Action title="Edit section" icon="create-outline" variant="secondary" disabled={busy || !store.ready || !!store.error} onPress={() => router.push({ pathname: '/plan/[id]', params: { id: m.id } })} /></View>)}
    {!!status && <Text accessibilityLiveRegion="polite" style={[ui.body, { color: colors.green }]}>{status}</Text>}
  </ScrollView>;
}
