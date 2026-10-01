import React from 'react';
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useBusinessApp } from '../../App';
import { completeSections, MODULES } from '../data/plan';
import { LAUNCH_GUIDE_RESEARCH_DATE, LAUNCH_GUIDE_SOURCES } from '../data/launchGuide';
import { usePlanning } from '../state/PlanningProvider';
import { Action, ZeeNote } from '../ui/BizUI';
import { colors, ui } from '../ui/theme';

const source = (id: string) => LAUNCH_GUIDE_SOURCES.find(item => item.id === id)!;

function SourceLink({ id }: { id: string }) {
  const item = source(id);
  return <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(item.url).catch(() => Alert.alert('Could not open the guide', 'Check your internet connection and try again.'))} style={({ pressed }) => [ui.card, { padding: 15, gap: 4 }, pressed && { opacity: 0.7 }]}>
    <Text style={[ui.label, { color: colors.green, marginBottom: 0 }]}>{item.title} ↗</Text>
    <Text style={ui.small}>{item.agency} · {item.scope}</Text>
  </Pressable>;
}

export default function LaunchGuide() {
  const app = useBusinessApp();
  const store = usePlanning();
  const router = useRouter();
  const planReady = completeSections(store.plan) === MODULES.length;
  const location = store.plan.sections.legal.answers[0]?.trim();

  return <ScrollView style={ui.screen} contentContainerStyle={ui.content}>
    <Action title="Back to my plan" icon="arrow-back" variant="secondary" onPress={() => router.back()} />
    <Text style={ui.eyebrow}>AFTER YOUR BUSINESS PLAN</Text>
    <Text style={ui.title}>Official guides to get started</Text>
    <Text style={ui.small}>This researched guide covers businesses in the Philippines. If you plan to operate in another country, these agencies and rules will not apply.</Text>
    <Text style={ui.body}>Use these Philippine government guides to work through business registration, tax registration, local permits, and any extra steps for your type of business. This guide links to official information instead of asking AI to guess which documents apply.</Text>
    {!!location && <View style={[ui.card, { backgroundColor: colors.blue }]}><Text style={ui.heading}>Your planned location</Text><Text style={ui.body}>{location}</Text><Text style={ui.small}>Confirm the exact requirements for this address with its city or municipal Business Permits and Licensing Office (BPLO) or Business One-Stop Shop (BOSS). Local procedures vary.</Text></View>}
    {!planReady && <View style={[ui.card, { backgroundColor: colors.mint }]}><Text style={ui.heading}>Finish your plan first</Text><Text style={ui.body}>Complete and review all 8 plan sections to unlock this launch guide.</Text><Action title="Return to my plan" onPress={() => router.back()} /></View>}

    <View style={[ui.card, { backgroundColor: colors.cream }]}>
      <Text style={ui.heading}>1. Start with the Philippine Business Hub</Text>
      <Text style={ui.body}>Its official application guide covers company registration, tax registration, employee registration, business licenses, and permits. Its online services do not cover every LGU, so check whether your city is supported.</Text>
      <SourceLink id="pbh-guide" />
      <SourceLink id="pbh-how-to" />
      <SourceLink id="pbh-faq" />
    </View>

    <View style={ui.card}>
      <Text style={ui.heading}>2. Follow the path for your ownership type</Text>
      <Text style={ui.body}>Sole proprietors using a business name other than their own should check DTI’s business-name guidance. Corporations and partnerships should check SEC registration. These registrations are not the same as permission to operate from your local government.</Text>
      <SourceLink id="dti" />
      <SourceLink id="sec" />
    </View>

    <View style={ui.card}>
      <Text style={ui.heading}>3. Confirm your local permits before opening</Text>
      <Text style={ui.body}>Contact the BPLO/BOSS for the exact checklist for your address, business activity, and home or storefront setup. Ask which applications, clearances, inspections, or property documents apply, where to file, current fees, and renewal dates. A national overview cannot confirm a particular city’s rules.</Text>
      <SourceLink id="boi-permit" />
    </View>

    <View style={ui.card}>
      <Text style={ui.heading}>4. Register with the BIR and set up records</Text>
      <Text style={ui.body}>Use BIR’s current registration pages to check the documents for your business type, tax obligations, registration method, invoices, and books of accounts. Ask BIR or a qualified tax professional which tax types apply to your situation.</Text>
      <SourceLink id="bir-newbizreg" />
      <SourceLink id="bir-orus" />
    </View>

    {(app.selectedBusiness?.idea.industry.toLowerCase().includes('food') || /food|snack|bak|restaurant|catering/i.test(app.selectedBusiness?.idea.title ?? '') || store.plan.sections.legal.answers.some(answer => /food|sanitary|health certificate/i.test(answer))) && <View style={ui.card}>
      <Text style={ui.heading}>If you will prepare or sell food</Text>
      <Text style={ui.body}>The national sanitation rules address sanitary permits for food establishments and health certificates for food handlers. Ask your local health office what applies to your home-based or other setup, and what inspection or documents it requires.</Text>
      <SourceLink id="food-sanitation" />
    </View>}

    {store.plan.sections.operations.answers.some(answer => /hire|employee|staff|worker|team member/i.test(answer)) && <View style={ui.card}>
      <Text style={ui.heading}>If you will hire employees</Text>
      <Text style={ui.body}>Check each agency’s current employer registration and employee-reporting steps. The Philippine Business Hub may combine some applications where its service is available.</Text>
      <SourceLink id="sss" />
      <SourceLink id="philhealth" />
      <SourceLink id="pagibig" />
    </View>}

    <ZeeNote>These links were checked on {LAUNCH_GUIDE_RESEARCH_DATE}. Requirements and online services can change. Confirm the latest checklist and fees with the agency or your local government before applying. This guide is for planning and does not certify that a business is legally ready to operate.</ZeeNote>
  </ScrollView>;
}
