import React, { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useBusinessApp } from '../../../App';
import ProfileScreen from '../../screens/ProfileScreen';
import { Action, ZeeNote } from '../../ui/BizUI';
import { colors, ui } from '../../ui/theme';
import { useBizDialog } from '../../ui/BizDialog';

export default function ProfileTab() {
  const { showDialog } = useBizDialog();
  const app = useBusinessApp();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const original = useRef({ displayName: app.displayName, background: app.background, details: app.details });
  function cancel() {
    app.setDisplayName(original.current.displayName); app.setBackground(original.current.background); app.setDetails(original.current.details); setEditing(false);
  }
  if (editing) return <ProfileScreen editing email={app.user?.email ?? ''} displayName={app.displayName} background={app.background} details={app.details} busy={app.working} onChangeName={app.setDisplayName} onChangeBackground={app.setBackground} onChangeDetails={app.setDetails} onCancel={() => showDialog('Leave your edits?', 'Your saved profile will stay as it was.', [{ text: 'Keep editing', style: 'cancel' }, { text: 'Discard edits', onPress: cancel }])} onSave={() => { void app.saveProfile().then(saved => { if (saved) setEditing(false); }); }} />;
  return <ScrollView style={ui.screen} contentContainerStyle={ui.content}>
    <Text style={ui.eyebrow}>THE PERSON BEHIND THE POSSIBILITIES</Text>
    <Text style={ui.title}>A business that feels like you.</Text>
    <Text style={ui.body}>Your interests and starting point help shape your recommendations.</Text>
    <View style={ui.card}>
      <View style={ui.row}><View style={{ width: 54, height: 54, borderRadius: 18, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center' }}><Text style={[ui.heading, { color: colors.purple }]}>{app.displayName.charAt(0).toUpperCase()}</Text></View><View style={{ flex: 1 }}><Text style={ui.heading}>{app.displayName}</Text><Text style={ui.small}>{app.user?.email}</Text></View></View>
      <Text style={ui.body}>{app.background}</Text>
      {([['Your interests', app.details.interests], ['Your personality', app.details.personality], ['Your working style', app.details.workingStyle]] as const).map(([title, values]) => <View key={title} style={{ gap: 10 }}><Text style={ui.label}>{title}</Text><View style={ui.wrap}>{values.map(v => <View key={v} style={ui.chip}><Text style={ui.chipText}>{v}</Text></View>)}</View></View>)}
      <View style={{ borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 16, gap: 6 }}><Text style={ui.small}>STARTING CAPITAL · MONTHLY BUDGET</Text><Text style={ui.label}>{app.details.currency} {app.details.startingCapital} · {app.details.currency} {app.details.monthlyBudget}</Text><Text style={ui.small}>YOUR CORNER OF THE WORLD</Text><Text style={ui.body}>{app.details.location}</Text></View>
      <Action title="Edit my profile" icon="create-outline" disabled={app.working} onPress={() => { original.current = { displayName: app.displayName, background: app.background, details: app.details }; setEditing(true); }} />
    </View>
    <ZeeNote>You’re allowed to change your mind. Update your profile whenever your interests or plans change.</ZeeNote>
    <Action title="A little help" icon="help-circle-outline" variant="secondary" onPress={() => router.push('/help')} />
    <Action title="Sign out" icon="log-out-outline" variant="quiet" disabled={app.working} onPress={app.logOut} />
  </ScrollView>;
}
