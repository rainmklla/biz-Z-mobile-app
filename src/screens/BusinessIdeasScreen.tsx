import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Action } from '../ui/BizUI';
import { colors } from '../ui/theme';
import type {
  BusinessIdea,
  BusinessRecommendations,
} from '../services/businessIdeaService';

type Props = {
  recommendations: BusinessRecommendations;
  selecting: boolean;
  disabled: boolean;
  onChoose: (idea: BusinessIdea) => void;
};

export default function BusinessIdeasScreen({
  recommendations,
  selecting,
  disabled,
  onChoose,
}: Props) {
  const { currency, ideas } = recommendations;

  function money(amount: number) {
    return `${currency} ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return (
    <View>
      <Text style={styles.title}>Your recommendations</Text>

      <View style={styles.notice}>
        <Text style={styles.body}>
          AI-generated suggestions. Costs are preliminary estimates.
          Check local prices and demand before spending money.
        </Text>
      </View>

      {ideas.map((idea, index) => (
        <View key={`${index}-${idea.title}`} style={styles.card}>
          <Text style={styles.industry}>
            IDEA {index + 1} · {idea.industry}
          </Text>

          <Text style={styles.ideaTitle}>{idea.title}</Text>
          <Text style={styles.body}>{idea.overview}</Text>

          <Text style={styles.label}>Why it fits you</Text>
          <Text style={styles.body}>{idea.whyItFits}</Text>

          <View style={styles.costBox}>
            <Text style={styles.body}>Estimated startup cost</Text>
            <Text style={styles.cost}>
              {money(idea.estimatedStartupCost)}
            </Text>

            <Text style={styles.body}>Estimated monthly cost</Text>
            <Text style={styles.cost}>
              {money(idea.estimatedMonthlyCost)}
            </Text>
          </View>

          <Text style={styles.label}>Assumptions to check</Text>
          <Text style={styles.body}>{idea.assumptions}</Text>

          <Text style={styles.label}>Your first step</Text>
          <Text style={styles.body}>{idea.firstStep}</Text>

          <View style={styles.button}>
            <Action
              title={selecting ? 'Saving your choice…' : 'Choose this idea'}
              onPress={() => onChoose(idea)}
              disabled={disabled}
              icon="arrow-forward"
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#18382c',
    marginBottom: 16,
  },
  notice: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.lavender,
    marginBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    backgroundColor: '#ffffff',
  },
  industry: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.purple,
    marginBottom: 10,
  },
  ideaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#18382c',
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18382c',
    marginTop: 16,
    marginBottom: 6,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    color: '#596c62',
  },
  costBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.cream,
  },
  cost: {
    fontSize: 19,
    fontWeight: '600',
    color: '#245c42',
    marginTop: 4,
    marginBottom: 12,
  },
  button: {
    marginTop: 24,
  },
});
