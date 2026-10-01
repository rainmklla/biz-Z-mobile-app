export const MODULES = [
  { id: 'overview', title: 'Company overview', icon: '🌱', hint: 'Give your big idea a little shape.', questions: ['What problem will your business solve?', 'Who will you help, and what makes your approach different?', 'What would success look like in your first year?'] },
  { id: 'market', title: 'Market & competition', icon: '🔎', hint: 'Get to know your future customers.', questions: ['Who is your ideal customer and where are they?', 'What alternatives do they use today?', 'How will you test demand before spending?'] },
  { id: 'products', title: 'Products & services', icon: '💎', hint: 'Create something worth choosing.', questions: ['What will you offer at launch?', 'What does each offer include and cost?', 'How will you deliver quality consistently?'] },
  { id: 'marketing', title: 'Marketing & sales', icon: '📣', hint: 'Help the right people find you.', questions: ['Where will you reach your first customers?', 'What message and offer will you test?', 'What is your marketing budget and how will you measure results?'] },
  { id: 'operations', title: 'Operations & management', icon: '⚙️', hint: 'Make the everyday work work.', questions: ['What does a typical order or service involve?', 'What people, equipment and suppliers will you need?', 'Who handles each task and what could interrupt operations?'] },
  { id: 'finance', title: 'Financial plan & funding', icon: '💰', hint: 'Give every peso a purpose.', questions: ['What are your one-time startup costs and funding sources?', 'What are your monthly fixed and per-sale costs?', 'What price and sales volume will you test, and when might you break even?'] },
  { id: 'summary', title: 'Executive summary', icon: '✨', hint: 'Bring your first six sections together.', questions: ['What should a reader remember about your business?', 'What are your key goals and funding needs?', 'What is your next milestone?'] },
  { id: 'legal', title: 'Legal compliance', icon: '📋', hint: 'Create a checklist to verify locally.', questions: ['Where will you operate and what business structure are you considering?', 'Which registrations, permits, taxes or industry requirements need checking?', 'How will you handle contracts, customer data and safety?'] },
] as const;
export type ModuleId = typeof MODULES[number]['id'];
export type Message = { role: 'user' | 'zee'; text: string };
export type Version = { text: string; date: string };
export type Section = { text: string; reviewed: boolean; versions: Version[]; messages: Message[] };
export type Plan = { schema: 1; sections: Record<ModuleId, Section>; updatedAt: string };
export function emptyPlan(): Plan {
  const sections = {} as Plan['sections'];
  for (const { id } of MODULES) sections[id] = { text: '', reviewed: false, versions: [], messages: [] };
  return { schema: 1, updatedAt: '', sections };
}
export function setReviewed(plan: Plan, id: ModuleId, reviewed: boolean): Plan {
  if (reviewed && !plan.sections[id].text.trim()) throw new Error('Write and save a draft before reviewing it.');
  if (reviewed && id === 'summary' && !MODULES.slice(0, 6).every(m => plan.sections[m.id].reviewed)) throw new Error('Review the first six sections before the executive summary.');
  const next = { ...plan, updatedAt: new Date().toISOString(), sections: { ...plan.sections, [id]: { ...plan.sections[id], reviewed } } };
  if (!reviewed && MODULES.slice(0, 6).some(m => m.id === id)) next.sections.summary = { ...next.sections.summary, reviewed: false };
  return next;
}
export function saveDraft(plan: Plan, id: ModuleId, text: string, restore = false): Plan {
  if (text.length > 12000) throw new Error('Keep each section under 12,000 characters.');
  const old = plan.sections[id];
  if (old.text === text && !restore) return plan;
  const date = new Date().toISOString();
  const next = { ...plan, updatedAt: date, sections: { ...plan.sections, [id]: { ...old, text, reviewed: false, versions: [...old.versions, { text, date }].slice(-10) } } };
  if (MODULES.slice(0, 6).some(m => m.id === id)) next.sections.summary = { ...next.sections.summary, reviewed: false };
  return next;
}
export function parsePlan(raw: string): Plan {
  const data = JSON.parse(raw) as Plan;
  if (data.schema !== 1 || typeof data.updatedAt !== 'string' || !data.sections) throw new Error('This saved plan could not be read.');
  for (const { id } of MODULES) {
    const s = data.sections[id];
    if (!s || typeof s.text !== 'string' || s.text.length > 12000 || typeof s.reviewed !== 'boolean' || !Array.isArray(s.versions) || s.versions.length > 10 || !Array.isArray(s.messages) || s.messages.length > 20) throw new Error('This saved plan has an invalid section.');
    if (s.versions.some(v => typeof v.text !== 'string' || v.text.length > 12000 || typeof v.date !== 'string')) throw new Error('This version history could not be read.');
    if (s.messages.some(m => !['user', 'zee'].includes(m.role) || typeof m.text !== 'string' || m.text.length > 6000)) throw new Error('This conversation could not be read.');
  }
  return data;
}
export function escapeHtml(text: string) { return text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)); }
export function planHtml(title: string, plan: Plan): string {
  return `<!doctype html><html><head><meta charset="utf-8"><style>@page{margin:36px}body{font:14px Arial;color:#27352c;line-height:1.6}h1{font-size:32px}h2{border-bottom:2px solid #ffd84d;padding-bottom:8px;break-after:avoid}.status{color:#667064;font-size:11px}p{white-space:pre-wrap;overflow-wrap:anywhere}header{background:#fff2b3;padding:24px;border-radius:18px}</style></head><body><header><b>biz-z. • YOUR BUSINESS PLAN</b><h1>${escapeHtml(title)}</h1><p>Prepared ${escapeHtml(new Date().toLocaleDateString())} · ${MODULES.filter(m => plan.sections[m.id].reviewed).length}/8 sections reviewed</p></header>${MODULES.map((m, i) => `<section><h2>${i + 1}. ${escapeHtml(m.title)}</h2><div class="status">${plan.sections[m.id].reviewed ? 'Reviewed by owner' : plan.sections[m.id].text.trim() ? 'Draft — not reviewed' : 'Not started'}</div><p>${escapeHtml(plan.sections[m.id].text || 'This section has not been written yet.')}</p></section>`).join('')}<footer>Built with Biz-Z. Estimates and assumptions require verification.</footer></body></html>`;
}
