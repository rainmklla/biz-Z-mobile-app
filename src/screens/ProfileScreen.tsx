import React, { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ProfileDetails } from '../services/profileService';
import { INTERESTS, PERSONALITIES, WORKING_STYLES, CURRENCIES } from '../data/profileOptions';
import { profileError, stepError } from '../data/profileValidation';
import { Action, Zee, ZeeNote } from '../ui/BizUI';
import { colors, ui } from '../ui/theme';

type Props = {
  email: string; displayName: string; background: string; details: ProfileDetails; busy: boolean;
  onChangeName: (value: string) => void; onChangeBackground: (value: string) => void;
  onChangeDetails: (value: ProfileDetails) => void; onSave: () => void;
  onCancel?: () => void; editing?: boolean;
};
type Icon = React.ComponentProps<typeof Ionicons>['name'];
const interestIcons: Icon[] = ['restaurant','cafe','laptop','color-palette','shirt','flower','fitness','school','pencil','camera','videocam','chatbubbles','game-controller','musical-notes','cut','airplane','calendar','paw','leaf','home','football','earth','storefront','wallet','people','construct'];
const traitIcons: Icon[] = ['color-palette','analytics','list','search','hammer','hourglass','flag','heart','chatbubbles','moon','shuffle','scan','shield-checkmark','rocket'];
const titles = ['First, a little about you.', 'What sparks your interest?', 'What makes you, you?', 'How do you like to work?', 'Let’s make it realistic.', 'This looks like you.'];
const descriptions = ['Your story is a pretty good place to start.', 'Pick 5 things you could happily talk about for hours.', 'Pick 5 traits. There’s no right kind of entrepreneur.', 'Choose all that fit. Pick at least one to continue.', 'A starting budget and a place to grow. Small is a valid start.', 'A quick look before we find your possibilities.'];
const pastels = [colors.pink, colors.lavender, colors.mint, colors.blue];

export default function ProfileScreen(props: Props) {
  const [step, setStep] = useState(0);
  const scroll = useRef<ScrollView>(null);
  const { details, busy } = props;
  const input = { displayName: props.displayName, background: props.background, details };
  const error = step === 5 ? profileError(input) : stepError(step, input);
  function move(next: number) { Keyboard.dismiss(); setStep(next); scroll.current?.scrollTo({ y: 0, animated: false }); }
  function update(patch: Partial<ProfileDetails>) { props.onChangeDetails({ ...details, ...patch }); }
  function cards(options: string[], selected: string[], change: (values: string[]) => void, icons: Icon[], limit?: number) {
    return <View style={styles.grid}>{options.map((option, index) => {
      const checked = selected.includes(option);
      const disabled = busy || (!checked && !!limit && selected.length >= limit);
      return <Pressable key={option} accessibilityRole="checkbox" accessibilityLabel={option}
        accessibilityState={{ checked, disabled }} disabled={disabled}
        onPress={() => change(checked ? selected.filter(v => v !== option) : [...selected, option])}
        style={({ pressed }) => [styles.tile, { backgroundColor: pastels[index % 4] }, checked && styles.checked, disabled && !checked && { opacity: 0.48 }, pressed && { transform: [{ scale: 0.97 }] }]}>
        <View style={[styles.check, checked && { backgroundColor: colors.ink }]}>{checked && <Ionicons name="checkmark" size={12} color="white" />}</View>
        <Ionicons name={icons[index % icons.length]} size={28} color={checked ? colors.ink : colors.purple} />
        <Text style={styles.tileText}>{option}</Text>
      </Pressable>;
    })}</View>;
  }
  function field(label: string, value: string, change: (v: string) => void, placeholder: string, numeric = false) {
    return <View><Text style={ui.label}>{label}</Text><TextInput style={ui.input} value={value} onChangeText={change} placeholder={placeholder} placeholderTextColor={colors.muted} accessibilityLabel={label} keyboardType={numeric ? 'decimal-pad' : 'default'} maxLength={numeric ? 15 : 200} editable={!busy} /></View>;
  }
  return <KeyboardAvoidingView style={ui.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={styles.top}><Text style={ui.eyebrow}>{props.editing ? 'MAKE IT MORE YOU' : 'YOUR STARTING POINT'}</Text><Text style={ui.small}>{step + 1} of 6</Text></View>
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 6, now: step + 1 }} style={styles.track}><View style={[styles.fill, { width: `${((step + 1) / 6) * 100}%` }]} /></View>
    <ScrollView ref={scroll} contentContainerStyle={ui.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <View style={styles.intro}><Zee size={70} /><Text style={[ui.title, { textAlign: 'center' }]}>{titles[step]}</Text><Text style={[ui.body, { textAlign: 'center' }]}>{descriptions[step]}</Text></View>
      {step === 0 && <View style={{ gap: 20 }}>
        {field('What should we call you?', props.displayName, props.onChangeName, 'Your name')}
        <View><Text style={ui.label}>Your background & experience</Text><TextInput style={[ui.input, { minHeight: 140, textAlignVertical: 'top' }]} value={props.background} onChangeText={props.onChangeBackground} placeholder="I study IT, enjoy making things, and help our family sell food…" placeholderTextColor={colors.muted} accessibilityLabel="Background and experience" multiline maxLength={2000} editable={!busy} /></View>
        <ZeeNote>Studies, hobbies, work, life experience—it all counts.</ZeeNote>
      </View>}
      {(step === 1 || step === 2) && <>
        <View style={ui.row}><View style={[ui.chip, { backgroundColor: colors.mint }]}><Text accessibilityLiveRegion="polite" style={[ui.chipText, { color: colors.green }]}>{step === 1 ? details.interests.length : details.personality.length} of 5 selected</Text></View><Text style={ui.small}>Tap again to swap.</Text></View>
        {step === 1 ? cards(INTERESTS, details.interests, interests => update({ interests }), interestIcons, 5) : cards(PERSONALITIES, details.personality, personality => update({ personality }), traitIcons, 5)}
      </>}
      {step === 3 && cards(WORKING_STYLES, details.workingStyle, workingStyle => update({ workingStyle }), ['person','people','flag','heart','calendar','shuffle','construct','map','home','chatbubbles','time','alarm'])}
      {step === 4 && <View style={{ gap: 20 }}>
        <View><Text style={ui.label}>Your currency</Text><View style={styles.picker}><Picker accessibilityLabel="Currency" selectedValue={details.currency} onValueChange={currency => update({ currency: String(currency) })} enabled={!busy} style={{ color: colors.ink }}>{CURRENCIES.map(([code, label]) => <Picker.Item key={code} label={label} value={code} />)}</Picker></View></View>
        {field(`Starting capital (${details.currency})`, details.startingCapital, startingCapital => update({ startingCapital }), 'e.g. 15000', true)}
        {field(`Monthly budget (${details.currency})`, details.monthlyBudget, monthlyBudget => update({ monthlyBudget }), 'e.g. 3000', true)}
        {field('Country and city', details.location, location => update({ location }), 'Philippines, Angeles City')}
        <ZeeNote>No budget yet? Enter 0. We’ll work with your starting point.</ZeeNote>
      </View>}
      {step === 5 && <>
        <View style={ui.card}><Text style={ui.heading}>{props.displayName}</Text><Text style={ui.body}>{props.background}</Text>
          <Text style={ui.label}>Your interests</Text><View style={ui.wrap}>{details.interests.map(v => <View key={v} style={ui.chip}><Text style={ui.chipText}>{v}</Text></View>)}</View>
          <Text style={ui.label}>Your personality</Text><Text style={ui.body}>{details.personality.join(' · ')}</Text>
          <Text style={ui.label}>Your working style</Text><Text style={ui.body}>{details.workingStyle.join(' · ')}</Text>
          <Text style={ui.body}>{details.currency} {details.startingCapital} to start · {details.currency} {details.monthlyBudget}/month</Text><Text style={ui.body}>{details.location}</Text>
        </View><ZeeNote>Your answers help tailor your ideas. You can change them in Profile whenever you grow in a new direction.</ZeeNote>
      </>}
      {!!error && <Text style={ui.small} accessibilityLiveRegion="polite">{error}</Text>}
    </ScrollView>
    <View style={styles.footer}>
      {(step > 0 || props.onCancel) && <View style={{ flex: 1 }}><Action title={step > 0 ? 'Back' : 'Cancel'} variant="secondary" disabled={busy} onPress={() => step > 0 ? move(step - 1) : props.onCancel?.()} /></View>}
      <View style={{ flex: 2 }}><Action title={step === 5 ? (props.editing ? 'Save my profile' : 'Let’s begin') : 'Continue'} icon={step === 5 ? 'checkmark' : 'arrow-forward'} disabled={busy || !!error} loading={busy && step === 5} onPress={() => step === 5 ? props.onSave() : move(step + 1)} /></View>
    </View>
  </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', padding: 22, paddingBottom: 12 },
  track: { height: 9, borderRadius: 8, backgroundColor: colors.line, marginHorizontal: 22, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.yellow, borderRadius: 8 },
  intro: { alignItems: 'center', gap: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { width: '47.5%', flexGrow: 1, minHeight: 118, padding: 16, paddingTop: 25, borderRadius: 19, borderWidth: 2, borderBottomWidth: 4, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center', gap: 10 },
  checked: { borderColor: colors.yellowEdge, backgroundColor: colors.cream },
  tileText: { fontSize: 13, fontWeight: '700', textAlign: 'center', color: colors.ink },
  check: { position: 'absolute', right: 8, top: 8, width: 17, height: 17, borderRadius: 9, backgroundColor: '#FFFFFFB0', alignItems: 'center', justifyContent: 'center' },
  picker: { borderRadius: 16, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.surface, overflow: 'hidden' },
  footer: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.background },
});
