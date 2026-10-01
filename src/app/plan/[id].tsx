import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBusinessApp } from '../../../App';
import { answeredSteps, formatDraftParagraphs, hasAnsweredEveryStep, isSectionComplete, MODULES, saveDraft, saveGuidedAnswer, setReviewed, type ModuleId } from '../../data/plan';
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
  const firstUnanswered = section.answers.findIndex(answer => !answer.trim());
  const initialStep = firstUnanswered < 0 ? module.questions.length : firstUnanswered;
  const [guidedStep, setGuidedStep] = useState(initialStep);
  const [guidedAnswer, setGuidedAnswer] = useState(section.answers[initialStep] ?? '');
  const initialText = formatDraftParagraphs(section.text);
  const [text, setText] = useState(initialText);
  const [answer, setAnswer] = useState('');
  const [proposal, setProposal] = useState('');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState(false);
  const [status, setStatus] = useState(initialText !== section.text ? 'I spaced the labeled sections into paragraphs. Save your draft to keep the formatting.' : '');
  const lock = useRef(false);
  const alive = useRef(true);
  const scroll = useRef<ScrollView>(null);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const guidedDirty = guidedStep < module.questions.length && guidedAnswer !== (section.answers[guidedStep] ?? '');
  const dirty = text !== section.text || !!proposal || !!answer.trim() || guidedDirty;
  usePreventRemove(dirty || busy, ({ data }) => {
    if (busy) { Alert.alert('One little moment', 'Wait for the current action to finish.'); return; }
    Alert.alert('Leave this section?', 'Your saved answers and draft are safe. Unsaved edits, an unsent message or a proposed draft will be discarded.', [{ text: 'Keep editing', style: 'cancel' }, { text: 'Leave', style: 'destructive', onPress: () => navigation.dispatch(data.action) }]);
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
  async function saveGuidedStep(nextStep = guidedStep + 1) {
    if (!guidedAnswer.trim()) { Alert.alert('Add an answer to continue', 'If you are unsure, write what you still need to find out. You can update it later.'); return; }
    await run(async () => {
      let answeredPlan = store.plan;
      await store.update(old => { answeredPlan = saveGuidedAnswer(old, id, guidedStep, guidedAnswer); return answeredPlan; });
      if (!alive.current) return;
      const next = Math.min(nextStep, module.questions.length);
      setGuidedStep(next);
      setGuidedAnswer(section.answers[next] ?? '');
      if (next === module.questions.length) {
        setGuidedAnswer('');
        setStatus('Your answers are saved. Zee is putting them into a business-plan draft…');
        const prompt = `Create a complete, formal ${module.title} section using all of my saved guided answers. Write in clear, connected paragraphs with no bullets or field labels. Use only details supplied in my answers or selected business idea; do not invent or infer facts. Mention missing information only when it is directly requested by this section's guided steps, and do not list topics assigned to other plan sections.`;
        try {
          const reply = await askZee(app.selectedBusiness!, answeredPlan, id, prompt, true);
          if (!alive.current) return;
          await store.update(old => ({ ...old, updatedAt: new Date().toISOString(), sections: { ...old.sections, [id]: { ...old.sections[id], messages: [...old.sections[id].messages, { role: 'user' as const, text: prompt }, { role: 'zee' as const, text: reply.message }].slice(-20) } } }));
          setText(formatDraftParagraphs(reply.draft)); setProposal('');
          setStatus('Your draft is ready below. Review it, make any changes, and save it to complete this section.');
          requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: true }));
        } catch (error) {
          if (!alive.current) return;
          setStatus('Your answers are saved, but Zee could not create the draft. You can retry with Zee or write it yourself below.');
          Alert.alert('Your answers are safe', error instanceof Error ? error.message : 'Zee could not create the draft. Please try again.');
        }
      } else setStatus(`Step ${guidedStep + 1} saved. You can continue whenever you are ready.`);
    });
  }
  function goBackStep() {
    if (guidedStep === 0) return;
    if (guidedStep === module.questions.length) {
      const previous = guidedStep - 1;
      setGuidedStep(previous); setGuidedAnswer(section.answers[previous] ?? ''); return;
    }
    const previous = guidedStep - 1;
    if (guidedAnswer.trim() && guidedAnswer !== (section.answers[guidedStep] ?? '')) {
      void run(async () => {
        await store.update(old => saveGuidedAnswer(old, id, guidedStep, guidedAnswer));
        setGuidedStep(previous); setGuidedAnswer(section.answers[previous] ?? '');
      });
    } else { setGuidedStep(previous); setGuidedAnswer(section.answers[previous] ?? ''); }
  }
  async function send(draft: boolean, request = answer) {
    if (text !== section.text || guidedDirty) { Alert.alert('Save your edits first', 'Zee uses your saved answers and draft. Save them before asking for help.'); return; }
    await run(async () => {
      const prompt = request.trim() || (draft && section.text.trim()
        ? `Revise my current ${module.title} draft using the latest Zee reply in this conversation. Incorporate Zee's ideas as clearly labeled proposed options when I have not confirmed them; do not present those suggestions as decisions or facts about my business. Preserve the details I supplied, use clear paragraphs, and mention missing details only when this section's guided questions ask for them.`
        : `Create a complete ${module.title} draft from my guided answers using clear paragraphs. Use only supplied information, and mention missing details only if this section asks for them.`);
      const reply = await askZee(app.selectedBusiness!, store.plan, id, prompt, draft);
      if (!alive.current) return;
      await store.update(old => ({ ...old, updatedAt: new Date().toISOString(), sections: { ...old.sections, [id]: { ...old.sections[id], messages: [...old.sections[id].messages, { role: 'user' as const, text: prompt }, { role: 'zee' as const, text: reply.message }].slice(-20) } } }));
      setAnswer(''); if (draft) setProposal(formatDraftParagraphs(reply.draft));
      setStatus(draft ? 'Your proposed draft is below. Read it before accepting.' : 'Conversation saved on this device.');
    });
  }
  async function askAboutGuidedStep() {
    if (guidedStep >= module.questions.length || !app.selectedBusiness) return;
    await run(async () => {
      const prompt = `I'm not sure how to answer this guided planning question: “${module.questions[guidedStep].prompt}” Please explain what information it is asking for and give a few clearly labeled examples or idea starters relevant to my business idea, without presenting them as facts. Do not fill in or save my answer. Ask me one simple follow-up if that would help.`;
      const reply = await askZee(app.selectedBusiness!, store.plan, id, prompt, false);
      if (!alive.current) return;
      await store.update(old => ({ ...old, updatedAt: new Date().toISOString(), sections: { ...old.sections, [id]: { ...old.sections[id], messages: [...old.sections[id].messages, { role: 'user' as const, text: prompt }, { role: 'zee' as const, text: reply.message }].slice(-20) } } }));
      setStatus('Zee’s ideas are in the optional chat below. Your checklist answer has not changed.');
      requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: true }));
    });
  }
  function startNewChat() {
    Alert.alert('Start a new Zee chat?', 'This clears the saved Zee conversation and discards any unsent message or unaccepted suggestion for this section. Your guided answers and saved draft stay safe.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Start new chat', style: 'destructive', onPress: () => void run(async () => {
        await store.update(old => ({ ...old, updatedAt: new Date().toISOString(), sections: { ...old.sections, [id]: { ...old.sections[id], messages: [] } } }));
        setAnswer(''); setProposal('');
        setStatus('A fresh Zee chat is ready. Your answers and saved draft are unchanged.');
      }) },
    ]);
  }
  const allStepsAnswered = hasAnsweredEveryStep(section, id);
  const answered = answeredSteps(section, id);
  const summaryReady = MODULES.slice(0, 6).every(m => isSectionComplete(store.plan.sections[m.id], m.id));
  const currentQuestion = module.questions[guidedStep];
  const linkedAnswer = id === 'operations' && guidedStep === 4
    ? { label: 'The disruption you identified', answer: section.answers[3] }
    : id === 'operations' && guidedStep === 6
      ? { label: 'Your selected delivery or pickup method', answer: section.answers[5] }
      : null;
  function addChoice(choice: string) {
    setGuidedAnswer(current => {
      const selected = current.split('\n');
      return selected.includes(choice) ? current : current.trim() ? `${current.trim()}\n${choice}` : choice;
    });
  }
  return <KeyboardAvoidingView style={ui.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
    <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={ui.content}>
      <Text style={ui.eyebrow}>YOUR PLAN • PART {index + 1} OF 8</Text>
      <Text style={ui.title}>{module.icon} {module.title}</Text><Text style={ui.body}>{module.hint}</Text>
      {id === 'summary' && !summaryReady && <ZeeNote>Complete and review the first six sections before finishing the executive summary. You can start these steps now, then return when the earlier sections are ready.</ZeeNote>}
      {id === 'legal' && <ZeeNote>You do not need to know paperwork names to answer. Share what you know and choose “not sure” for anything unclear. Zee will help make a plain-language list of what to prepare and verify for your business and location. The list is a starting point, not confirmation that a specific permit or form is required.</ZeeNote>}
      <View style={[ui.card, { backgroundColor: colors.mint }]}>
        <Text style={ui.eyebrow}>YOUR GUIDED CHECKLIST</Text>
        <Text style={ui.heading}>{guidedStep < module.questions.length ? `Step ${guidedStep + 1} of ${module.questions.length}` : 'All guided steps answered'}</Text>
        <Text style={ui.body}>{answered} of {module.questions.length} answers saved. These are the finite planning steps for this section.</Text>
        <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: module.questions.length, now: answered }} style={{ height: 8, borderRadius: 8, backgroundColor: colors.line }}><View style={{ width: `${answered / module.questions.length * 100}%`, height: 8, borderRadius: 8, backgroundColor: colors.green }} /></View>
        {guidedStep < module.questions.length ? <>
          {linkedAnswer?.answer && <View style={{ padding: 12, borderRadius: 14, backgroundColor: colors.surface }}><Text style={ui.eyebrow}>{linkedAnswer.label.toUpperCase()}</Text><Text style={ui.body}>{linkedAnswer.answer}</Text></View>}
          <Text style={ui.heading}>{currentQuestion.prompt}</Text>
          <Text style={ui.small}>{currentQuestion.helper ?? 'Write a few clear sentences. If you do not know yet, note what you need to research. Your answer saves when you continue or go back.'}</Text>
          {!!currentQuestion.choices?.length && <><Text style={ui.small}>Tap an idea to add it, or write your own answer.</Text><View style={ui.wrap}>{currentQuestion.choices.map(choice => <Pressable key={choice} accessibilityRole="button" accessibilityLabel={`Add answer: ${choice}`} onPress={() => addChoice(choice)} disabled={busy} style={({ pressed }) => [ui.chip, { borderWidth: 1, borderColor: colors.line, opacity: pressed ? 0.7 : 1 }]}><Text style={ui.chipText}>{choice}</Text></Pressable>)}</View></>}
          <Action title="Ask Zee for ideas" icon="chatbubble-ellipses-outline" variant="secondary" loading={busy} disabled={busy} onPress={() => void askAboutGuidedStep()} />
          <TextInput accessibilityLabel={`Step ${guidedStep + 1} answer`} style={[ui.input, { minHeight: 130, textAlignVertical: 'top' }]} multiline value={guidedAnswer} onChangeText={setGuidedAnswer} maxLength={4000} editable={!busy} placeholder="Write your answer here…" placeholderTextColor={colors.muted} />
          <Text style={ui.small}>{guidedAnswer.length.toLocaleString()}/4,000 characters</Text>
          <View style={[ui.row, { justifyContent: 'space-between' }]}>
            <Action title="Back" variant="secondary" disabled={busy || guidedStep === 0} onPress={goBackStep} />
            <Action title={guidedStep === module.questions.length - 1 ? 'Save & create my draft' : 'Save & continue'} icon="arrow-forward" loading={busy} disabled={busy} onPress={() => void saveGuidedStep()} />
          </View>
        </> : <>
          <Text style={ui.body}>{busy ? 'Your answers are saved. Zee is turning them into a business-plan draft. This may take a moment.' : 'You have answered every planning prompt for this section. Review the draft, save it, and mark the section complete.'}</Text>
          <Action title="Review my answers" variant="secondary" disabled={busy} onPress={() => { setGuidedStep(0); setGuidedAnswer(section.answers[0] ?? ''); }} />
        </>}
      </View>
      <View style={[ui.card, { backgroundColor: colors.lavender }]}>
        <Text style={ui.eyebrow}>OPTIONAL HELP</Text><Text style={ui.heading}>Ask Zee whenever you want</Text>
        <Text style={ui.body}>This chat is separate from your checklist. It has no required questions and does not affect your progress. The guided steps above are what you need to finish.</Text>
        <Action title="Start a new chat" icon="refresh-outline" variant="quiet" disabled={busy || (!section.messages.length && !answer.trim() && !proposal)} onPress={startNewChat} />
        {section.messages.map((m, i) => <View key={i} style={{ padding: 14, borderRadius: 16, marginLeft: m.role === 'user' ? 22 : 0, marginRight: m.role === 'zee' ? 22 : 0, backgroundColor: m.role === 'user' ? colors.cream : colors.surface }}><Text style={ui.eyebrow}>{m.role === 'user' ? 'YOU' : 'ZEE'}</Text><Text selectable style={ui.body}>{m.text}</Text></View>)}
        <Text style={ui.label}>What would you like to ask Zee? (optional)</Text>
        <TextInput accessibilityLabel="Optional question for Zee" style={[ui.input, { minHeight: 100, textAlignVertical: 'top' }]} multiline value={answer} onChangeText={setAnswer} maxLength={3000} editable={!busy} placeholder="Ask for an explanation or a suggestion…" placeholderTextColor={colors.muted} />
        <Action title="Send to Zee" icon="chatbubble-outline" loading={busy} disabled={!answer.trim() || !!proposal} onPress={() => void send(false)} />
        <Action title={section.text ? 'Ask Zee to revise my draft' : 'Create a draft from my answers with Zee'} variant="secondary" disabled={busy || !!proposal} onPress={() => void send(true)} />
        <Text style={ui.small}>Zee uses your business idea, saved sections and this conversation. Check suggestions and assumptions before using them. The latest 20 messages are kept.</Text>
      </View>
      {proposal !== '' && <View style={[ui.card, { borderColor: colors.yellowEdge, backgroundColor: '#FFFBE8' }]}><Text style={ui.heading}>Your proposed draft</Text><Text selectable style={ui.body}>{proposal}</Text><Action title="Use this draft in my editor" disabled={busy} onPress={() => { setText(proposal); setProposal(''); setStatus('Proposal moved to your editor. Save when you are ready.'); }} /><Action title="Discard suggestion" variant="quiet" disabled={busy} onPress={() => setProposal('')} /></View>}
      <View style={ui.card}>
        <Text style={ui.eyebrow}>YOUR IDEAS, PUT INTO WORDS</Text><Text style={ui.heading}>Your {module.title.toLowerCase()} draft</Text>
        <Text style={ui.small}>{isSectionComplete(section, id) ? '✓ Complete' : section.reviewed ? 'Reviewed draft • guided details still needed' : section.text ? 'Saved draft • needs review' : 'Not started'}{text !== section.text ? ' • Unsaved edits' : ''}</Text>
        <TextInput accessibilityLabel={`${module.title} draft`} style={[ui.input, { minHeight: 260, textAlignVertical: 'top' }]} multiline value={text} onChangeText={setText} maxLength={12000} editable={!busy} placeholder="Write in your own words here. Use the questions above as a guide." placeholderTextColor={colors.muted} />
        <Text style={ui.small}>{text.length.toLocaleString()}/12,000 characters</Text>
        <Action title="Save my draft" icon="save-outline" disabled={busy || text === section.text} onPress={() => void save()} />
        {!allStepsAnswered && <Text style={ui.small}>Answer all {module.questions.length} guided steps ({answered} answered), then save a draft before reviewing this section.</Text>}
        {allStepsAnswered && !section.text.trim() && <Text style={ui.small}>Save a draft that reflects your answers before reviewing this section.</Text>}
        <Action title={section.reviewed ? 'Mark as needing review' : 'Mark this section complete'} icon="checkmark-circle-outline" variant="secondary" disabled={busy || (!section.reviewed && (!allStepsAnswered || !section.text.trim() || text !== section.text || (id === 'summary' && !summaryReady)))} onPress={() => void run(async () => { await store.update(old => setReviewed(old, id, !old.sections[id].reviewed)); setStatus(section.reviewed ? 'Section marked as needing review.' : 'Section marked complete.'); })} />
        <Action title={`Version history (${section.versions.length})`} variant="quiet" disabled={busy || !section.versions.length} icon="time-outline" onPress={() => setHistory(true)} />
        <Text style={ui.small}>The latest 10 saved versions are kept. Editing or restoring a draft clears its review status.</Text>
      </View>
      {!!status && <Text accessibilityLiveRegion="polite" style={[ui.body, { color: colors.green }]}>{status}</Text>}
      <Action title={index === 7 ? 'Preview my whole plan' : `Next: ${MODULES[index + 1].title}`} disabled={busy} onPress={() => index === 7 ? router.push('/plan-preview') : router.replace({ pathname: '/plan/[id]', params: { id: MODULES[index + 1].id } })} />
    </ScrollView>
      <Modal visible={history} animationType="slide" onRequestClose={() => setHistory(false)}><SafeAreaView style={ui.screen}><ScrollView contentContainerStyle={ui.content}><Text style={ui.title}>Draft version history</Text><Text style={ui.body}>Restoring adds a new version and asks you to review again.</Text><Action title="Close history" variant="secondary" onPress={() => setHistory(false)} />{[...section.versions].reverse().map((v, i) => <View key={`${v.date}-${i}`} style={ui.card}><Text style={ui.label}>Version {section.versions.length - i} · {new Date(v.date).toLocaleString()}</Text><Text selectable style={ui.body}>{formatDraftParagraphs(v.text) || '(Empty draft)'}</Text><Action title="Restore this version" disabled={busy} onPress={() => Alert.alert('Restore this draft?', 'This will replace any unsaved edits. Your saved versions remain available within the 10-version limit.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Restore', onPress: () => void run(async () => { const restored = formatDraftParagraphs(v.text); await store.update(old => saveDraft(old, id, restored, true)); setText(restored); setProposal(''); setHistory(false); setStatus('Version restored on this device. Please review it again.'); }) }])} /></View>)}</ScrollView></SafeAreaView></Modal>
  </KeyboardAvoidingView>;
}
