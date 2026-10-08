import React, { useState } from 'react';
import { Image, Platform, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useBusinessApp } from '../../App';
import { answeredSteps, completeSections, formatDraftParagraphs, isSectionComplete, MODULES, planHtml } from '../data/plan';
import { usePlanning } from '../state/PlanningProvider';
import { Action, Zee } from '../ui/BizUI';
import { colors, ui } from '../ui/theme';
import { useBizDialog } from '../ui/BizDialog';

export default function PlanPreview() {
  const { showDialog } = useBizDialog();
  const app = useBusinessApp(); const store = usePlanning(); const router = useRouter();
  const [busy, setBusy] = useState(false); const [status, setStatus] = useState('');
  const selection = app.selectedBusiness;
  const complete = completeSections(store.plan);
  const planReady = complete === MODULES.length;
  const actionsLocked = !store.ready || !!store.error || !planReady || busy;
  async function run(task: () => Promise<void>) { if (busy) return; setBusy(true); setStatus(''); try { await task(); } catch (e) { showDialog('Could not finish', e instanceof Error ? e.message : 'Please try again.'); } finally { setBusy(false); } }
  async function exportPdf() {
    if (!selection) return;
    if (!planReady) { showDialog('Finish your guided plan first', 'Answer every guided step, save and review each section, then you can export a complete PDF.'); return; }
    await run(async () => {
      const Print = await import('expo-print');
      const html = planHtml(store.plan);
      if (Platform.OS === 'web') { await Print.printAsync({ html }); return; }
      const Sharing = await import('expo-sharing');
      if (!await Sharing.isAvailableAsync()) throw new Error('Sharing is not available on this device.');
      const file = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', UTI: '.pdf', dialogTitle: 'Share your Biz-Z plan' });
      setStatus('PDF created. Choose a destination in the share sheet to keep a copy.');
    });
  }
  async function chooseLogo() {
    let ImagePicker: typeof import('expo-image-picker');
    try { ImagePicker = await import('expo-image-picker'); }
    catch { throw new Error('Logo upload needs the updated development app. Rebuild and reinstall the development app, then try again.'); }
    let result: import('expo-image-picker').ImagePickerResult;
    try { result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.7, base64: true }); }
    catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('ExponentImagePicker') || message.includes('native module')) throw new Error('Logo upload needs the updated development app. Rebuild and reinstall the development app, then try again.');
      throw error;
    }
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset.base64) throw new Error('This image could not be read. Choose another image.');
    const logoDataUrl = `data:${asset.mimeType?.startsWith('image/') ? asset.mimeType : 'image/jpeg'};base64,${asset.base64}`;
    if (logoDataUrl.length > 500_000) throw new Error('Choose a smaller logo image (under about 350 KB).');
    await store.update(old => ({ ...old, logoDataUrl }));
  }
  async function removeLogo() { await store.update(old => ({ ...old, logoDataUrl: '' })); }
  if (!app.user || !selection) return <View style={ui.content}><Text style={ui.heading}>Every plan starts with an idea.</Text><Action title="Explore ideas" onPress={() => router.navigate('/ideas')} /></View>;
  return <ScrollView style={ui.screen} contentContainerStyle={[ui.content, { paddingBottom: 120 }]}>
    <Text style={ui.eyebrow}>LOOK WHAT YOU’RE BUILDING</Text><Text style={ui.title}>{selection.idea.title}</Text>
    <Text style={ui.body}>{complete} of {MODULES.length} sections complete. To make a complete business plan, answer each section’s guided steps, save the draft, and mark it complete.</Text>
    {!!store.error && <Text style={{ color: colors.error }}>{store.error}</Text>}
    <Action title={planReady ? 'Export & share complete PDF' : `Complete all ${MODULES.length} sections to unlock export`} icon={planReady ? 'download-outline' : 'lock-closed-outline'} loading={busy} disabled={actionsLocked} onPress={() => void exportPdf()} />
    <Action title={planReady ? 'Preview full document' : `Complete all ${MODULES.length} sections to unlock preview`} icon={planReady ? 'eye-outline' : 'lock-closed-outline'} variant="secondary" disabled={actionsLocked} onPress={() => router.push('/document-preview')} />
    <Action title={planReady ? 'Start my business' : `Complete all ${MODULES.length} sections to unlock launch guide`} icon={planReady ? 'compass-outline' : 'lock-closed-outline'} variant="accent" disabled={actionsLocked} onPress={() => router.push('/launch-guide')} />
    {!planReady && <Text style={ui.small}>Answer every guided step, save each draft, and mark all {MODULES.length} sections complete to unlock these actions. {complete} of {MODULES.length} complete.</Text>}
    <Text style={ui.small}>Review the complete document in Biz-Z, then use the back button to return here.</Text>
    <View style={[ui.card, { alignItems: 'center', backgroundColor: colors.cream }]}><Zee size={72} /><Text style={ui.eyebrow}>A BUSINESS PLAN BY YOU</Text><Text style={ui.heading}>{selection.idea.title}</Text><Text style={ui.small}>{selection.idea.industry} · {selection.currency}</Text></View>
    {MODULES.map((m, i) => {
      const section = store.plan.sections[m.id];
      const sectionStatus = isSectionComplete(section, m.id) ? 'COMPLETE' : m.id === 'summary' ? section.text ? section.reviewed ? 'DRAFT REVIEWED' : 'DRAFT TO REVIEW' : 'GENERATES FROM EARLIER SECTIONS' : `${answeredSteps(section, m.id)}/${m.questions.length} STEPS · ${answeredSteps(section, m.id) < m.questions.length ? 'GUIDED DETAILS NEEDED' : section.text ? section.reviewed ? 'DRAFT REVIEWED' : 'DRAFT TO REVIEW' : 'DRAFT NEEDED'}`;
      return <View key={m.id} style={ui.card}><Text style={ui.eyebrow}>0{i + 1} • {sectionStatus}</Text><Text style={ui.heading}>{m.title}</Text><Text selectable style={ui.body}>{formatDraftParagraphs(section.text) || (m.id === 'summary' ? 'This overview is created from details in your earlier sections.' : 'A little space for your next idea. This section has not been written yet.')}</Text><Action title={m.id === 'summary' ? 'Create or edit summary' : 'Edit section'} icon="create-outline" variant="secondary" disabled={busy || !store.ready || !!store.error} onPress={() => router.push({ pathname: '/plan/[id]', params: { id: m.id } })} /></View>;
    })}
    <View style={ui.card}>
      <Text style={ui.heading}>Business logo</Text>
      <Text style={ui.body}>Add your own logo to the cover page. This is optional.</Text>
      {store.plan.logoDataUrl ? <Image source={{ uri: store.plan.logoDataUrl }} resizeMode="contain" style={{ width: '100%', height: 120 }} /> : null}
      <Action title={store.plan.logoDataUrl ? 'Change logo' : 'Upload logo'} icon="image-outline" variant="secondary" disabled={busy || !store.ready || !!store.error} onPress={() => void run(chooseLogo)} />
      {!!store.plan.logoDataUrl && <Action title="Remove logo" variant="secondary" disabled={busy} onPress={() => void run(removeLogo)} />}
    </View>
    {!!status && <Text accessibilityLiveRegion="polite" style={[ui.body, { color: colors.green }]}>{status}</Text>}
  </ScrollView>;
}
