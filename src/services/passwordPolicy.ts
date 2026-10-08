export const PASSWORD_REQUIREMENTS = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (password: string) => password.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter (A–Z)',
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter (a–z)',
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    id: 'number',
    label: 'One number (0–9)',
    test: (password: string) => /[0-9]/.test(password),
  },
] as const;

export function getPasswordRequirementStatus(password: string) {
  return PASSWORD_REQUIREMENTS.map(requirement => ({
    ...requirement,
    met: requirement.test(password),
  }));
}

export function validatePassword(password: string): string | null {
  const unmet = getPasswordRequirementStatus(password).filter(
    requirement => !requirement.met,
  );

  if (unmet.length === 0) return null;

  return `Your password needs ${unmet.map(item => item.label.toLowerCase()).join(', ')}.`;
}
