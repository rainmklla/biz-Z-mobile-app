import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { answeredSteps, completeSections, isSectionComplete, MODULES } from '../data/plan';
import { usePlanning } from '../state/PlanningProvider';
import { Action, ZeeNote } from './BizUI';
import { colors, ui } from './theme';

export function PlanJourney() {
  const { plan, ready, error } = usePlanning();
  const router = useRouter();
  const complete = completeSections(plan);
  const next = MODULES.find(m => !isSectionComplete(plan.sections[m.id], m.id)) ?? MODULES[0];
  return <View style={{ gap: 18 }}>
    <View style={[ui.card, { backgroundColor: colors.mint }]}>
      <Text style={ui.eyebrow}>LOOK AT YOU GROWING</Text><Text style={ui.title}>{Math.round(complete / MODULES.length * 100)}%</Text>
      <Text style={ui.body}>{complete} of {MODULES.length} sections complete. Zee drafts each section after its last step; review, save, and mark it complete.</Text>
      <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: MODULES.length, now: complete }} style={{ height: 10, borderRadius: 8, backgroundColor: colors.line }}><View style={{ width: `${complete / MODULES.length * 100}%`, height: 10, borderRadius: 8, backgroundColor: colors.green }} /></View>
      <Action title={complete === MODULES.length ? 'Review my whole plan' : 'Continue my journey'} disabled={!ready || !!error} icon="arrow-forward" onPress={() => router.push(complete === MODULES.length ? '/plan-preview' : { pathname: '/plan/[id]', params: { id: next.id } })} />
    </View>
    {error ? <Text style={{ color: colors.error }}>{error}</Text> : <Text style={ui.small}>{ready ? 'Drafts save on this device. Manage cloud backups in My plan.' : 'Opening your drafts…'}</Text>}
    <Text style={ui.heading}>Your business journey</Text>
    {MODULES.map((m, i) => <View key={m.id} style={[ui.card, isSectionComplete(plan.sections[m.id], m.id) && { borderColor: colors.green }]}>
      <View style={[ui.row, { justifyContent: 'space-between' }]}><Text style={{ fontSize: 28 }}>{m.icon}</Text><Text style={ui.eyebrow}>{String(i + 1).padStart(2, '0')} / {String(MODULES.length).padStart(2, '0')}</Text></View>
      <Text style={ui.heading}>{m.title}</Text><Text style={ui.body}>{m.hint}</Text>
      <Text style={[ui.small, { color: isSectionComplete(plan.sections[m.id], m.id) ? colors.green : colors.muted }]}>{isSectionComplete(plan.sections[m.id], m.id) ? '✓ Complete' : `${answeredSteps(plan.sections[m.id], m.id)} of ${m.questions.length} steps answered${plan.sections[m.id].reviewed ? ' • needs guided details' : plan.sections[m.id].text.trim() ? ' • draft needs review' : ''}`}</Text>
      <Action title={plan.sections[m.id].text ? 'Open my draft' : 'Let’s start'} variant="secondary" disabled={!ready || !!error} onPress={() => router.push({ pathname: '/plan/[id]', params: { id: m.id } })} />
    </View>)}
    <ZeeNote>Write in your own words or talk it through with me. You decide what goes into your plan.</ZeeNote>
    <Action title="Preview my plan" icon="document-text-outline" onPress={() => router.push('/plan-preview')} />
  </View>;
}
