import React, { useState } from 'react';
import { Alert, Platform, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useBusinessApp } from '../../App';
import { MODULES, planHtml } from '../data/plan';
import { usePlanning } from '../state/PlanningProvider';
import { Action, Zee } from '../ui/BizUI';
import { colors, ui } from '../ui/theme';

export default function PlanPreview() {
  const app = useBusinessApp(); const store = usePlanning(); const router = useRouter();
  const [busy, setBusy] = useState(false); const [status, setStatus] = useState('');
  const selection = app.selectedBusiness;
  async function run(task: () => Promise<void>) { if (busy) return; setBusy(true); setStatus(''); try { await task(); } catch (e) { Alert.alert('Could not finish', e instanceof Error ? e.message : 'Please try again.'); } finally { setBusy(false); } }
  async function exportPdf() {
    if (!selection) return;
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
    <Text style={ui.body}>{MODULES.filter(m => store.plan.sections[m.id].reviewed).length} / 8 sections reviewed. You can export at any stage; unfinished sections are labeled.</Text>
    {!!store.error && <Text style={{ color: colors.error }}>{store.error}</Text>}
    <Action title="Export & share PDF" icon="download-outline" loading={busy} disabled={!store.ready || !!store.error} onPress={() => void exportPdf()} />
    <View style={[ui.card, { alignItems: 'center', backgroundColor: colors.cream }]}><Zee size={72} /><Text style={ui.eyebrow}>A BUSINESS PLAN BY YOU</Text><Text style={ui.heading}>{selection.idea.title}</Text><Text style={ui.small}>{selection.idea.industry} · {selection.currency}</Text></View>
    {MODULES.map((m, i) => <View key={m.id} style={ui.card}><Text style={ui.eyebrow}>0{i + 1} • {store.plan.sections[m.id].reviewed ? 'REVIEWED' : store.plan.sections[m.id].text ? 'DRAFT — NOT REVIEWED' : 'NOT STARTED'}</Text><Text style={ui.heading}>{m.title}</Text><Text selectable style={ui.body}>{store.plan.sections[m.id].text || 'A little space for your next idea. This section has not been written yet.'}</Text><Action title="Edit section" variant="quiet" disabled={busy || !store.ready || !!store.error} onPress={() => router.push({ pathname: '/plan/[id]', params: { id: m.id } })} /></View>)}
    <View style={[ui.card, { backgroundColor: colors.lavender }]}><Text style={ui.heading}>Keep your progress safe</Text><Text style={ui.body}>Drafts and history save on this device. Cloud backups are manual snapshots. Back up again after changes. Restoring replaces this device’s drafts with the cloud copy.</Text>
      <Action title="Back up to my account" icon="cloud-upload-outline" disabled={busy || !store.ready || !!store.error} onPress={() => Alert.alert('Replace the cloud backup?', 'Your current device plan will replace the existing backup for this business, including changes saved from another device.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Back up', onPress: () => void run(async () => { await store.backup(); setStatus('Cloud backup saved.'); }) }])} />
      <Action title="Restore my cloud backup" variant="secondary" disabled={busy || !store.ready || !!store.error} onPress={() => Alert.alert('Replace device drafts?', 'All local sections, conversations and version history will be replaced by your cloud backup.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Restore', style: 'destructive', onPress: () => void run(async () => { await store.restore(); setStatus('Cloud backup restored to this device.'); }) }])} />
    </View>
    {!!status && <Text accessibilityLiveRegion="polite" style={[ui.body, { color: colors.green }]}>{status}</Text>}
  </ScrollView>;
}
