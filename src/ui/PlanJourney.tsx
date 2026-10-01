import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MODULES } from '../data/plan';
import { usePlanning } from '../state/PlanningProvider';
import { Action, ZeeNote } from './BizUI';
import { colors, ui } from './theme';

export function PlanJourney() {
  const { plan, ready, error } = usePlanning();
  const router = useRouter();
  const reviewed = MODULES.filter(m => plan.sections[m.id].reviewed).length;
  const next = MODULES.find(m => !plan.sections[m.id].reviewed) ?? MODULES[0];
  return <View style={{ gap: 18 }}>
    <View style={[ui.card, { backgroundColor: colors.mint }]}>
      <Text style={ui.eyebrow}>LOOK AT YOU GROWING</Text><Text style={ui.title}>{Math.round(reviewed / 8 * 100)}%</Text>
      <Text style={ui.body}>{reviewed} of 8 sections reviewed. One little step at a time.</Text>
      <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 8, now: reviewed }} style={{ height: 10, borderRadius: 8, backgroundColor: colors.line }}><View style={{ width: `${reviewed / 8 * 100}%`, height: 10, borderRadius: 8, backgroundColor: colors.green }} /></View>
      <Action title={reviewed === 8 ? 'Review my whole plan' : 'Continue my journey'} disabled={!ready || !!error} icon="arrow-forward" onPress={() => router.push(reviewed === 8 ? '/plan-preview' : { pathname: '/plan/[id]', params: { id: next.id } })} />
    </View>
    {error ? <Text style={{ color: colors.error }}>{error}</Text> : <Text style={ui.small}>{ready ? 'Drafts save on this device. Manage cloud backups in My plan.' : 'Opening your drafts…'}</Text>}
    <Text style={ui.heading}>Your business journey</Text>
    {MODULES.map((m, i) => <View key={m.id} style={[ui.card, plan.sections[m.id].reviewed && { borderColor: colors.green }]}>
      <View style={[ui.row, { justifyContent: 'space-between' }]}><Text style={{ fontSize: 28 }}>{m.icon}</Text><Text style={ui.eyebrow}>0{i + 1} / 08</Text></View>
      <Text style={ui.heading}>{m.title}</Text><Text style={ui.body}>{m.hint}</Text>
      <Text style={[ui.small, { color: plan.sections[m.id].reviewed ? colors.green : colors.muted }]}>{plan.sections[m.id].reviewed ? '✓ Reviewed' : plan.sections[m.id].text.trim() ? 'Draft saved • needs review' : 'Your next little possibility'}</Text>
      <Action title={plan.sections[m.id].text ? 'Open my draft' : 'Let’s start'} variant="secondary" disabled={!ready || !!error} onPress={() => router.push({ pathname: '/plan/[id]', params: { id: m.id } })} />
    </View>)}
    <ZeeNote>Write in your own words or talk it through with me. You decide what goes into your plan.</ZeeNote>
    <Action title="Preview my plan" icon="document-text-outline" onPress={() => router.push('/plan-preview')} />
  </View>;
}
