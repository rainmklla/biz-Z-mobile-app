import type { ProfileDetails } from '../services/profileService';
import { CURRENCIES, INTERESTS, PERSONALITIES, WORKING_STYLES } from './profileOptions';
export type ProfileInput = { displayName: string; background: string; details: ProfileDetails };
export function stepError(step: number, { displayName, background, details }: ProfileInput): string {
  if (step === 0) {
    if (!displayName.trim() || displayName.trim().length > 100) return 'Add a name between 1 and 100 characters.';
    if (!background.trim() || background.trim().length > 2000) return 'Tell us about your background (up to 2,000 characters).';
  }
  if (step === 1 && (new Set(details.interests).size !== 5 || details.interests.length !== 5 || details.interests.some(v => !INTERESTS.includes(v)))) return 'Pick exactly 5 interests. Tap a selected card to swap it.';
  if (step === 2 && (new Set(details.personality).size !== 5 || details.personality.length !== 5 || details.personality.some(v => !PERSONALITIES.includes(v)))) return 'Pick exactly 5 traits that sound like you.';
  if (step === 3 && (!details.workingStyle.length || details.workingStyle.some(v => !WORKING_STYLES.includes(v)))) return 'Choose at least one working style.';
  if (step === 4) {
    if (!CURRENCIES.some(([code]) => code === details.currency)) return 'Choose a currency.';
    for (const [value, label] of [[details.startingCapital, 'starting capital'], [details.monthlyBudget, 'monthly budget']]) {
      if (!/^\d+(\.\d{1,2})?$/.test(value.trim()) || Number(value) > 1000000000) return `Enter your ${label} without commas (0–1,000,000,000, up to 2 decimals).`;
    }
    if (!details.location.trim() || details.location.trim().length > 200) return 'Add your country and city (up to 200 characters).';
  }
  return '';
}
export function profileError(profile: ProfileInput) {
  for (let step = 0; step < 5; step++) { const error = stepError(step, profile); if (error) return error; }
  return '';
}
