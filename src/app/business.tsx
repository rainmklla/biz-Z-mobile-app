import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AccountGate, useBusinessApp } from '../../App';
import { Action, ZeeNote } from '../ui/BizUI';
import { colors, ui } from '../ui/theme';
function BusinessDetails() {
  const { selectedBusiness } = useBusinessApp();
  const router = useRouter();
  if (!selectedBusiness) return <View style={ui.content}><Text style={ui.title}>Your idea belongs here.</Text><Text style={ui.body}>Choose a business from Ideas to save your starting point.</Text><Action title="Explore ideas" onPress={() => router.replace('/ideas')} /></View>;
  const { idea, currency } = selectedBusiness;
  const money = (amount: number) => `${currency} ${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  return <ScrollView style={ui.screen} contentContainerStyle={ui.content}>
    <Text style={ui.eyebrow}>LOOK WHAT YOU’RE STARTING</Text><Text style={ui.title}>{idea.title}</Text><Text style={[ui.chipText, { color: colors.green }]}>{idea.industry}</Text><Text style={ui.body}>{idea.overview}</Text>
    <View style={[ui.card, { backgroundColor: colors.cream }]}><Text style={ui.heading}>Your starting numbers</Text><Text style={ui.small}>ESTIMATED STARTUP COST</Text><Text style={ui.heading}>{money(idea.estimatedStartupCost)}</Text><Text style={ui.small}>ESTIMATED MONTHLY COST</Text><Text style={ui.heading}>{money(idea.estimatedMonthlyCost)}</Text><Text style={ui.small}>Preliminary estimates. Check local prices and demand before spending.</Text></View>
    {([['Why it feels like you', idea.whyItFits], ['Your first little step', idea.firstStep], ['Assumptions to check', idea.assumptions]] as const).map(([title, body]) => <View key={title} style={ui.card}><Text style={ui.heading}>{title}</Text><Text style={ui.body}>{body}</Text></View>)}
    <ZeeNote>Your selected idea is saved to your account. Build your plan one little section at a time.</ZeeNote>
    <Action title="Start building my plan" onPress={() => router.push({ pathname: '/plan/[id]', params: { id: 'overview' } })} />
    <Action title="Explore other ideas" variant="secondary" onPress={() => router.replace('/ideas')} />
  </ScrollView>;
}
export default function BusinessRoute() { return <AccountGate><BusinessDetails /></AccountGate>; }
