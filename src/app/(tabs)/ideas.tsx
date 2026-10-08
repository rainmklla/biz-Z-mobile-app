import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useBusinessApp } from '../../../App';
import { Action, Zee, ZeeNote } from '../../ui/BizUI';
import { colors, ui } from '../../ui/theme';
import BusinessIdeasScreen from '../../screens/BusinessIdeasScreen';

export default function IdeasTab() {
  const app = useBusinessApp();
  return <ScrollView style={ui.screen} contentContainerStyle={[ui.content, { paddingBottom: 120 }]}>
    <Text style={ui.eyebrow}>FOLLOW YOUR CURIOSITY</Text><Text style={ui.title}>A few possibilities.{ '\n' }A whole lot of you.</Text><Text style={ui.body}>Ideas shaped by your interests, strengths, location and budget.</Text>
    {!app.recommendations && !app.generating && <View style={[ui.card, { backgroundColor: colors.lavender, alignItems: 'center' }]}><Zee size={110} /><Text style={ui.heading}>Let’s find your spark.</Text><Text style={[ui.body, { textAlign: 'center' }]}>You bring the you. Gemini helps connect the dots.</Text></View>}
    <Action title={app.generating ? 'Finding your possibilities…' : app.recommendations ? 'Explore a fresh set' : 'Find my business ideas'} icon="sparkles" loading={app.generating} disabled={app.working} onPress={app.exploreIdeas} />
    {app.generating && <ZeeNote>Good ideas need a little thinking time. You can visit another tab while your recommendations are prepared.</ZeeNote>}
    {app.selectedBusiness && <View style={[ui.card, { backgroundColor: colors.mint }]}><Text style={[ui.small, { color: colors.green }]}>YOUR CURRENT CHOICE</Text><Text style={ui.label}>{app.selectedBusiness.idea.title}</Text><Text style={ui.small}>Exploring is free of commitment. Your saved choice changes only when you confirm a replacement.</Text></View>}
    {app.recommendations && <BusinessIdeasScreen recommendations={app.recommendations} selecting={app.selecting} disabled={app.working} onChoose={app.chooseIdea} />}
    <Text style={ui.small}>Generating saves your latest profile answers. Your name and email are not included in the AI prompt.</Text>
  </ScrollView>;
}
