import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useBusinessApp } from '../../../App';
import { Action, Zee, ZeeNote } from '../../ui/BizUI';
import { colors, ui } from '../../ui/theme';
import { PlanJourney } from '../../ui/PlanJourney';

export default function JourneyTab() {
  const app = useBusinessApp();
  const router = useRouter();
  const selection = app.selectedBusiness;
  const completed = selection ? 3 : app.recommendations ? 2 : 1;
  return <ScrollView style={ui.screen} contentContainerStyle={ui.content}>
    <Text style={ui.eyebrow}>A LITTLE AMBITION GOES A LONG WAY</Text>
    <Text style={ui.title}>Let’s build your{ '\n' }next big thing.</Text>
    <Text style={ui.body}>Hi {app.displayName.split(' ')[0]}. Your pace. Your path. One little step today.</Text>
    <View style={[ui.card, { backgroundColor: colors.cream, borderColor: '#EAD88D' }]}>
      <View style={{ alignSelf: 'flex-end' }}><Zee size={88} /></View>
      <Text style={ui.eyebrow}>YOUR JOURNEY, YOUR WAY</Text><Text style={[ui.title, { fontSize: 28 }]}>A little closer to{ '\n' }“I built this.”</Text>
      <Text style={ui.body}>{selection ? `You chose ${selection.idea.title}. That’s a real starting point.` : 'The next good idea might start with something you already love.'}</Text>
      <Action title={selection ? 'Open my business plan' : 'Find my business idea'} icon="arrow-forward" onPress={() => router.navigate(selection ? '/plan' : '/ideas')} />
    </View>
    {!selection && <View style={ui.card}><View style={[ui.row, { justifyContent: 'space-between' }]}><Text style={ui.heading}>Your starting steps</Text><Text style={[ui.label, { color: colors.green }]}>{completed}/3</Text></View>
      <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 3, now: completed }} style={{ height: 10, borderRadius: 8, backgroundColor: colors.line, overflow: 'hidden' }}><View style={{ width: `${completed / 3 * 100}%`, backgroundColor: colors.green, height: '100%', borderRadius: 8 }} /></View>
      {['Tell us about you', 'Explore your possibilities', 'Choose your business'].map((label, i) => <View key={label} style={ui.row}><Ionicons name={i < completed ? 'checkmark-circle' : 'ellipse-outline'} size={23} color={i < completed ? colors.green : colors.muted} /><Text style={ui.body}>{label}</Text></View>)}
    </View>}
    {selection && <View style={[ui.card, { borderColor: '#B8CD9D' }]}>
      <Text style={[ui.eyebrow, { color: colors.green }]}>YOUR SELECTED BUSINESS</Text><Text style={ui.heading}>{selection.idea.title}</Text><View style={[ui.chip, { alignSelf: 'flex-start', backgroundColor: colors.mint }]}><Text style={[ui.chipText, { color: colors.green }]}>{selection.idea.industry}</Text></View><Text style={ui.body}>{selection.idea.overview}</Text>
      <Text style={ui.label}>Your first little step</Text><Text style={ui.body}>{selection.idea.firstStep}</Text><Action title="See my business" variant="secondary" icon="arrow-forward" onPress={() => router.push('/business')} />
    </View>}
    {selection ? <PlanJourney /> : <ZeeNote>Your profile is ready. Head to Ideas when you want to find a business that fits.</ZeeNote>}
    <Action title="How Biz-Z works" variant="quiet" icon="help-circle-outline" onPress={() => router.push('/help')} />
  </ScrollView>;
}
