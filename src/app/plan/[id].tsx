import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBusinessApp } from '../../../App';
import { MODULES, saveDraft, setReviewed, type ModuleId } from '../../data/plan';
import { usePlanning } from '../../state/PlanningProvider';
import { askZee } from '../../services/planAI';
import { Action, ZeeNote } from '../../ui/BizUI';
import { colors, ui } from '../../ui/theme';

export default function ModuleRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const app = useBusinessApp();
  const store = usePlanning();
  const router = useRouter();
  const module = MODULES.find(m => m.id === id);
  if (!app.user || !app.selectedBusiness || !module || !store.ready || store.error) return <View style={ui.content}><Text style={ui.heading}>{store.error || (!store.ready ? 'Opening your draft…' : 'Choose a business to begin your plan.')}</Text><Action title="Back to my journey" onPress={() => router.replace('/')} /></View>;
  return <ModuleEditor key={id} id={module.id} />;
}
function ModuleEditor({ id }: { id: ModuleId }) {
  const app = useBusinessApp();
  const store = usePlanning();
  const router = useRouter();
  const navigation = useNavigation();
  const module = MODULES.find(m => m.id === id)!;
  const index = MODULES.findIndex(m => m.id === id);
  const section = store.plan.sections[id];
  const [text, setText] = useState(section.text);
  const [answer, setAnswer] = useState('');
  const [proposal, setProposal] = useState('');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState(false);
  const [status, setStatus] = useState('');
  const lock = useRef(false);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const dirty = text !== section.text || !!proposal || !!answer.trim();
  usePreventRemove(dirty || busy, ({ data }) => {
    if (busy) { Alert.alert('One little moment', 'Wait for the current action to finish.'); return; }
    Alert.alert('Leave this section?', 'Your saved draft is safe. Unsaved edits, an unsent message or a proposed draft will be discarded.', [{ text: 'Keep editing', style: 'cancel' }, { text: 'Leave', style: 'destructive', onPress: () => navigation.dispatch(data.action) }]);
  });
  async function run(work: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setStatus('');
    try { await work(); } catch (error) { if (alive.current) Alert.alert('Could not finish', error instanceof Error ? error.message : 'Please try again.'); }
    finally { lock.current = false; if (alive.current) setBusy(false); }
  }
  async function save() {
    await run(async () => { await store.update(old => saveDraft(old, id, text)); setStatus('Saved on this device.'); });
  }
  async function send(draft: boolean, request = answer) {
    if (text !== section.text) { Alert.alert('Save your edits first', 'Zee uses your saved draft so none of your changes are missed.'); return; }
    await run(async () => {
      const prompt = request.trim() || 'Create a first draft from what we know. Clearly label information still needed.';
      const reply = await askZee(app.selectedBusiness!, store.plan, id, prompt, draft);
      if (!alive.current) return;
      await store.update(old => ({ ...old, updatedAt: new Date().toISOString(), sections: { ...old.sections, [id]: { ...old.sections[id], messages: [...old.sections[id].messages, { role: 'user' as const, text: prompt }, { role: 'zee' as const, text: reply.message }].slice(-20) } } }));
      setAnswer(''); if (draft) setProposal(reply.draft);
      setStatus(draft ? 'Your proposed draft is below. Read it before accepting.' : 'Conversation saved on this device.');
    });
  }
  const summaryReady = MODULES.slice(0, 6).every(m => store.plan.sections[m.id].reviewed);
  return <KeyboardAvoidingView style={ui.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={ui.content}>
      <Text style={ui.eyebrow}>YOUR PLAN • PART {index + 1} OF 8</Text>
      <Text style={ui.title}>{module.icon} {module.title}</Text><Text style={ui.body}>{module.hint}</Text>
      {id === 'summary' && !summaryReady && <ZeeNote>You can start a summary now. Review your first six sections before marking it reviewed. Editing those sections will reopen this review.</ZeeNote>}
      <View style={ui.card}><Text style={ui.heading}>A few things to think about</Text>{module.questions.map((q, i) => <Text key={q} style={ui.body}>{i + 1}. {q}</Text>)}</View>
      <View style={[ui.card, { backgroundColor: colors.lavender }]}>
        <Text style={ui.eyebrow}>LET’S THINK THIS THROUGH</Text><Text style={ui.heading}>A little chat. A big step forward.</Text>
        <Text style={ui.body}>Zee is optional. You can write your draft below at any time.</Text>
        <View style={[ui.card, { padding: 14 }]}><Text style={ui.small}>Zee</Text><Text style={ui.body}>{module.questions[0]}</Text></View>
        {section.messages.map((m, i) => <View key={i} style={{ padding: 14, borderRadius: 16, marginLeft: m.role === 'user' ? 22 : 0, marginRight: m.role === 'zee' ? 22 : 0, backgroundColor: m.role === 'user' ? colors.cream : colors.surface }}><Text style={ui.eyebrow}>{m.role === 'user' ? 'YOU' : 'ZEE'}</Text><Text selectable style={ui.body}>{m.text}</Text></View>)}
        <Text style={ui.label}>Your answer or revision request</Text>
        <TextInput accessibilityLabel="Message to Zee" style={[ui.input, { minHeight: 100, textAlignVertical: 'top' }]} multiline value={answer} onChangeText={setAnswer} maxLength={3000} editable={!busy} placeholder="A few words are enough…" placeholderTextColor={colors.muted} />
        <Action title="Send to Zee" icon="chatbubble-outline" loading={busy} disabled={!answer.trim() || !!proposal} onPress={() => void send(false)} />
        <Action title={section.text ? 'Ask Zee to revise my draft' : 'Create a draft with Zee'} variant="secondary" disabled={busy || !!proposal} onPress={() => void send(true)} />
        <Text style={ui.small}>Zee uses your business idea, saved sections and this conversation. Check suggestions and assumptions before using them. The latest 20 messages are kept.</Text>
      </View>
      {proposal !== '' && <View style={[ui.card, { borderColor: colors.yellowEdge, backgroundColor: '#FFFBE8' }]}><Text style={ui.heading}>Your proposed draft</Text><Text selectable style={ui.body}>{proposal}</Text><Action title="Use this draft in my editor" disabled={busy} onPress={() => { setText(proposal); setProposal(''); setStatus('Proposal moved to your editor. Save when you are ready.'); }} /><Action title="Discard suggestion" variant="quiet" disabled={busy} onPress={() => setProposal('')} /></View>}
      <View style={ui.card}>
        <Text style={ui.eyebrow}>YOUR IDEAS, PUT INTO WORDS</Text><Text style={ui.heading}>Your {module.title.toLowerCase()} draft</Text>
        <Text style={ui.small}>{section.reviewed ? '✓ Reviewed' : section.text ? 'Saved draft • needs review' : 'Not started'}{text !== section.text ? ' • Unsaved edits' : ''}</Text>
        <TextInput accessibilityLabel={`${module.title} draft`} style={[ui.input, { minHeight: 260, textAlignVertical: 'top' }]} multiline value={text} onChangeText={setText} maxLength={12000} editable={!busy} placeholder="Write in your own words here. Use the questions above as a guide." placeholderTextColor={colors.muted} />
        <Text style={ui.small}>{text.length.toLocaleString()}/12,000 characters</Text>
        <Action title="Save my draft" icon="save-outline" disabled={busy || text === section.text} onPress={() => void save()} />
        <Action title={section.reviewed ? 'Mark as needing review' : 'Mark reviewed'} icon="checkmark-circle-outline" variant="secondary" disabled={busy || !section.text.trim() || text !== section.text || (id === 'summary' && !summaryReady)} onPress={() => void run(async () => { await store.update(old => setReviewed(old, id, !old.sections[id].reviewed)); setStatus('Review status saved.'); })} />
        <Action title={`Version history (${section.versions.length})`} variant="quiet" disabled={busy || !section.versions.length} icon="time-outline" onPress={() => setHistory(true)} />
        <Text style={ui.small}>The latest 10 saved versions are kept. Editing or restoring a draft clears its review status.</Text>
      </View>
      {!!status && <Text accessibilityLiveRegion="polite" style={[ui.body, { color: colors.green }]}>{status}</Text>}
      <Action title={index === 7 ? 'Preview my whole plan' : `Next: ${MODULES[index + 1].title}`} disabled={busy} onPress={() => index === 7 ? router.push('/plan-preview') : router.replace({ pathname: '/plan/[id]', params: { id: MODULES[index + 1].id } })} />
    </ScrollView>
    <Modal visible={history} animationType="slide" onRequestClose={() => setHistory(false)}><SafeAreaView style={ui.screen}><ScrollView contentContainerStyle={ui.content}><Text style={ui.title}>Draft version history</Text><Text style={ui.body}>Restoring adds a new version and asks you to review again.</Text><Action title="Close history" variant="secondary" onPress={() => setHistory(false)} />{[...section.versions].reverse().map((v, i) => <View key={`${v.date}-${i}`} style={ui.card}><Text style={ui.label}>Version {section.versions.length - i} · {new Date(v.date).toLocaleString()}</Text><Text selectable style={ui.body}>{v.text || '(Empty draft)'}</Text><Action title="Restore this version" disabled={busy} onPress={() => Alert.alert('Restore this draft?', 'This will replace any unsaved edits. Your saved versions remain available within the 10-version limit.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Restore', onPress: () => void run(async () => { await store.update(old => saveDraft(old, id, v.text, true)); setText(v.text); setProposal(''); setHistory(false); setStatus('Version restored on this device. Please review it again.'); }) }])} /></View>)}</ScrollView></SafeAreaView></Modal>
  </KeyboardAvoidingView>;
}
