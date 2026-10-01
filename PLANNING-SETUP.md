# Biz-Z planning workspace

All eight sections support manual drafts, optional Zee conversations and proposed drafts, ten saved versions, review status, preview and PDF sharing. Executive summary review requires the first six sections to be reviewed; editing one invalidates summary review.

## Run the updated app

New native dependencies (AsyncStorage, Expo Print and Sharing) require rebuilding the development app once with `npm run android`. Starting Metro alone does not add these capabilities to an older installed build.

This update was built and installed on the Android emulator successfully. If Java reports `Unable to establish loopback connection`, the verified workaround in PowerShell is to set `$env:JAVA_TOOL_OPTIONS='-Djdk.net.unixdomain.tmpdir="C:\Users\Rhianna Gomez\Documents\RN\business-plan-builder\.expo"'` for that terminal before building. This avoids the failing temporary socket location; no global Java settings were changed.

## Storage

Plans are stored locally per signed-in user and business selection timestamp. Replacing a business starts a fresh workspace; previous data is retained locally but there is currently no previous-business picker. Selecting the same idea again creates a new workspace. Uninstalling the app removes device drafts.

My plan has explicit cloud backup and restore actions. Backups replace the account snapshot for that workspace; restoring replaces the device snapshot. This is not automatic multi-device synchronization. Cloud backup requires adding the match block from `firestore-plan-backups.rules.txt` to the existing Firestore rules and publishing. Existing profile and selection rules must remain in place. The rules have NOT been deployed by this change.

Backups are limited to 200,000 JavaScript characters (up to 800,000 UTF-8 bytes). Large plans can still be exported to PDF. Backups validate again on restore. Local plan content is not encrypted by AsyncStorage.

## Review checklist

- Choose a business, open a section, save a manual draft, leave and reopen it.
- Mark the first six sections reviewed; then review the executive summary. Edit an earlier section and confirm summary review resets.
- Ask Zee a question, request a draft, accept it into the editor, then save. Check failure paths without losing manual edits.
- Restore an older version and confirm review resets.
- Restart the app and confirm drafts return. Sign out and use another account to confirm isolation.
- Preview incomplete and completed plans; share a PDF and open it.
- After publishing the additive rules, back up and restore a disposable test plan. Verify a second account cannot access its backup.

Zee suggestions are not automatically saved as a draft or marked reviewed. No paid AI requests or production backup writes are needed for static checks.

## Verification completed

TypeScript, Expo lint, plan logic tests, profile validation tests, Android bundle export and Android debug build passed. The updated APK was installed on emulator-5554. Verified loading device drafts, opening a module, warning on leaving an unsent message, and producing a PDF that opens the Android share sheet. The test message was discarded; no cloud data was changed. Live Gemini replies and cloud backup/restore remain unverified.
