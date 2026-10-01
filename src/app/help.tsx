import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AccountGate } from '../../App';
import { Action, ZeeNote } from '../ui/BizUI';
import { colors, ui } from '../ui/theme';
const steps = [
  ['Start with you', 'Tell us your story, choose 5 interests and 5 personality traits, then add your working style, location and budget.'],
  ['Explore a few possibilities', 'Ask for three tailored ideas. Compare the fit, estimated costs and first steps. Generate another set whenever you need a new direction.'],
  ['Choose your starting point', 'Confirm a business to save it. Exploring other ideas never replaces your choice automatically.'],
  ['Build, save and review', 'Open a section from My journey. Write manually or ask Zee for help. Accept suggestions into the editor, save your draft, then mark it reviewed.'],
  ['Bring the story together', 'Review your first six sections before marking the executive summary reviewed. Changing an earlier draft asks you to review the summary again.'],
  ['Preview and export', 'Open My plan to read all eight sections and share a PDF. Unfinished sections are labeled. Device drafts persist after restarting; cloud backups are manual snapshots.'],
];
export default function HelpRoute() {
  const router = useRouter();
  return <AccountGate><ScrollView style={ui.screen} contentContainerStyle={ui.content}>
    <Text style={ui.eyebrow}>A LITTLE CLARITY GOES A LONG WAY</Text><Text style={ui.title}>Your guide to{'\n'}getting started.</Text><Text style={ui.body}>Big plans begin with a small, clear next step.</Text>
    {steps.map(([title, body], i) => <View key={title} style={ui.card}><Text style={[ui.eyebrow, { color: colors.purple }]}>0{i + 1}</Text><Text style={ui.heading}>{title}</Text><Text style={ui.body}>{body}</Text></View>)}
    <ZeeNote>Your profile and business choice are saved to your account. Plan drafts save on this device, separately for each business choice. Use My plan to back up or restore. The last 10 draft versions and 20 chat messages per section are kept.</ZeeNote>
    <Action title="Back to my journey" icon="arrow-forward" onPress={() => router.replace('/')} />
  </ScrollView></AccountGate>;
}
