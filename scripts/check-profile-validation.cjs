const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

// Load the pure TypeScript validation functions without a native runtime.
require.extensions['.ts'] = (module, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(result.outputText, filename);
};
const { profileError, stepError } = require('../src/data/profileValidation.ts');
const { INTERESTS, PERSONALITIES, WORKING_STYLES } = require('../src/data/profileOptions.ts');
const valid = {
  displayName: 'Rain', background: 'IT student who enjoys making things.',
  details: {
    interests: INTERESTS.slice(0, 5), personality: PERSONALITIES.slice(0, 5),
    workingStyle: WORKING_STYLES.slice(0, 1), currency: 'PHP',
    startingCapital: '0', monthlyBudget: '1500.50', location: 'Philippines, Angeles City',
  },
};
const withDetails = patch => ({ ...valid, details: { ...valid.details, ...patch } });
assert.equal(profileError(valid), '', 'zero starting budget is valid');
assert.notEqual(stepError(1, withDetails({ interests: INTERESTS.slice(0, 4) })), '');
assert.notEqual(stepError(1, withDetails({ interests: INTERESTS.slice(0, 6) })), '');
assert.notEqual(stepError(1, withDetails({ interests: Array(5).fill(INTERESTS[0]) })), '');
assert.notEqual(stepError(2, withDetails({ personality: PERSONALITIES.slice(0, 4) })), '');
assert.notEqual(stepError(2, withDetails({ personality: PERSONALITIES.slice(0, 6) })), '');
assert.notEqual(stepError(3, withDetails({ workingStyle: [] })), '');
for (const amount of ['', '-1', '1,000', 'Infinity', '1.234', '1000000001']) {
  assert.notEqual(stepError(4, withDetails({ startingCapital: amount })), '', amount);
}
assert.equal(stepError(4, withDetails({ startingCapital: '1000000000' })), '');
assert.notEqual(profileError(withDetails({ currency: 'INVALID' })), '');
assert.notEqual(profileError(withDetails({ location: ' ' })), '');
assert.notEqual(profileError({ ...valid, displayName: ' ' }), '');
assert.notEqual(profileError({ ...valid, background: ' ' }), '');
console.log('Profile validation passed: exact-five choices, uniqueness, budgets, currency and required fields.');
