export type GuidedQuestion = { prompt: string; choices?: readonly string[]; helper?: string; requiresAmount?: boolean };
const q = (prompt: string, choices?: string[], helper?: string, requiresAmount = false): GuidedQuestion => ({ prompt, choices, helper, requiresAmount });
export const MODULES = [
  { id: 'overview', title: 'Company overview', icon: '🌱', hint: 'Describe what your business is and why it exists.', questions: [
    q('What name would you like to use for your business?', ['I have a name', 'I am still deciding']),
    q('What will your business sell or provide?', ['Physical products', 'A service', 'Digital products', 'A mix of these']),
    q('Who is the main customer you want to serve?', ['Local residents', 'Students', 'Families', 'Small businesses', 'Online customers']),
    q('How will your business meet a need or solve a problem for that customer?', ['Save them time', 'Make something easier to get', 'Offer a lower-cost option', 'Solve a local need', 'I am still figuring this out']),
    q('What will make a customer choose your business over another option?', ['Convenience', 'Price', 'Quality', 'Personal service', 'A specialized offer']),
    q('Where will your business operate?', ['From home', 'A storefront', 'Online', 'At customer locations', 'More than one place']),
    q('Which industry or field will your business operate in?', ['Food and beverage', 'Retail', 'Technology', 'Professional services', 'Education', 'Other', 'Not decided yet']),
    q('What will a normal business day look like?', ['Make or prepare orders', 'Serve customers', 'Manage bookings', 'Create or deliver services', 'A mix of these']),
    q('How will customers receive or access what they buy?', ['Delivery', 'Customer pickup', 'Online access', 'Service at their location', 'Not decided yet']),
    q('What is the main purpose or mission of your business?', ['Serve my local community', 'Make a useful product easier to access', 'Create a sustainable source of income', 'Support a particular customer group']),
    q('What is one realistic goal you want to reach during your first year?', ['Get my first paying customers', 'Reach a monthly sales target', 'Build repeat customers', 'Launch a new product or service']),
  ] },
  { id: 'market', title: 'Market & competition', icon: '🔎', hint: 'Understand the people you serve and the alternatives they have.', questions: [
    q('Which group of people is most likely to buy from you?', ['Local residents', 'Students', 'Families', 'Hobby communities', 'Small businesses']),
    q('What have you seen or heard that suggests people want this offer?', ['People have asked for it', 'Similar offers already sell', 'Survey or interview feedback', 'Preorders or paid interest', 'I still need to research']),
    q('What other businesses or alternatives could your customers choose?', ['A direct competitor', 'A different type of business', 'A do-it-yourself option', 'Customers may currently go without an option']),
    q('What is a low-cost way you can test demand before investing more?', ['Ask potential customers', 'Offer a small trial', 'Take preorders', 'Run a survey', 'Test at a local event']),
    q('Where can you reach these potential customers?', ['Social media', 'Local events', 'Community groups', 'A storefront', 'Online search']),
    q('What will your business do differently or better for its customers?', ['More convenient', 'More affordable', 'More personal', 'More specialized', 'Better quality']),
  ] },
  { id: 'products', title: 'Products & services', icon: '💎', hint: 'Explain what customers can buy and how you will deliver it.', questions: [
    q('What product or service will you offer first?'),
    q('What will the product or service include?', ['One main item or service', 'A bundle or package', 'Optional add-ons', 'Different sizes or levels']),
    q('How will customers place an order or book your service?', ['In person', 'By phone or message', 'Through a website or app', 'Through social media']),
    q('How will you check that each product or service meets your quality standard?', ['Use a checklist', 'Inspect each item before delivery', 'Test the service before launch', 'Ask customers for feedback']),
    q('What specific items, ingredients, or options will make up your initial menu or service package?', ['A small starter selection', 'Several core options', 'One main package with add-ons', 'I have not decided yet']),
    q('What exact price will you charge for one product or service? Include the currency and price per unit.', undefined, 'Example: PHP 50 per snack. If you have not set a price yet, write “Not decided yet.”', true),
    q('How will customers receive or use what they ordered?', ['Delivery', 'Customer pickup', 'Online access', 'Service at their location', 'Not decided yet']),
    q('How will you use customer feedback to improve the offer?', ['Ask after each purchase', 'Review ratings or comments', 'Track repeat requests', 'Make changes during regular reviews']),
  ] },
  { id: 'marketing', title: 'Marketing & sales', icon: '📣', hint: 'Plan how customers will find you and make a purchase.', questions: [
    q('Which channel will you use first to reach potential customers?', ['Facebook or Instagram', 'TikTok', 'Community groups', 'Local events', 'A website or online search']),
    q('What is the main benefit you want customers to remember?', ['Convenience', 'Affordable pricing', 'High quality', 'Personal service', 'A specialized offer']),
    q('What steps will a customer take from discovering your business to placing an order?', ['See an ad or post', 'Ask a question', 'Choose an offer', 'Pay or book', 'Receive confirmation']),
    q('How much do you expect to spend on marketing each month?', ['No paid budget at first', 'I need to estimate this']),
    q('What result will tell you that your marketing is working?', ['Inquiries', 'Orders or bookings', 'Repeat customers', 'Website visits', 'Social media engagement']),
  ] },
  { id: 'operations', title: 'Operations & management', icon: '⚙️', hint: 'Map the day-to-day work behind your offer.', questions: [
    q('What are the main steps to prepare one typical order or complete one typical service?', ['Receive the order', 'Prepare the product or service', 'Check the result', 'Package or finish it', 'Hand it to the customer']),
    q('Where will you do the work?', ['At home', 'In a rented space', 'At a storefront', 'At the customer’s location', 'Online']),
    q('Who will be responsible for the main jobs?', ['I will do everything at first', 'I will share tasks with a partner', 'I will hire employees', 'I will use contractors']),
    q('What is one problem that could interrupt daily operations?', ['Supplier delays', 'Equipment failure', 'Unexpected high demand', 'Staff or owner unavailable', 'Delivery disruption']),
    q('How would you respond to that disruption to keep work on track?', ['Contact customers early', 'Use a backup supplier', 'Reschedule orders', 'Offer an alternative', 'Pause orders until resolved']),
    q('How will completed orders reach your customers?', ['My own delivery', 'A third-party courier', 'Customer pickup', 'A mix of methods', 'Not decided yet']),
    q('For the delivery or pickup method you selected, who will coordinate the handoff with the customer?', ['I will coordinate it', 'The courier will contact the customer', 'The customer will arrange pickup', 'A team member will coordinate it', 'Not decided yet']),
    q('What equipment will you need to do the work?', ['Equipment I already own', 'Kitchen or production tools', 'Computer or phone', 'Tools for a service', 'I need to make a list']),
    q('What materials or supplies will you use?', ['Ingredients', 'Packaging', 'Office supplies', 'Cleaning supplies', 'Materials used to provide the service']),
    q('Which suppliers will provide the materials or supplies you need?', ['Local shops', 'Wholesale suppliers', 'Online suppliers', 'I am still researching']),
    q('What skills or outside help will you need?', ['Bookkeeping', 'Marketing', 'Production or preparation', 'Delivery', 'Technical or professional support']),
  ] },
  { id: 'finance', title: 'Financial plan & funding', icon: '💰', hint: 'Make your costs, prices, and funding needs visible.', questions: [
    q('What one-time purchases or setup costs do you expect before opening?', ['Equipment', 'Initial materials or stock', 'Registration or setup fees', 'Packaging or signage', 'I need to estimate these']),
    q('What regular costs will you pay each month, even if you make no sales?', ['Rent', 'Internet or phone', 'Utilities', 'Subscriptions', 'I need to estimate these']),
    q('What exact price will you charge for one typical product or service? Include the currency and price per unit.', undefined, 'Example: PHP 50 per snack. If you have not set a price yet, write “Not decided yet.”', true),
    q('What assumptions are you using for your cost, price, or sales estimates?', ['Expected number of customers', 'Cost of supplies', 'Time needed per order', 'I need help estimating']),
    q('How do you plan to pay for those startup costs?', ['Personal savings', 'A loan', 'Support from family or partners', 'A grant', 'Not decided yet']),
    q('What costs will increase each time you make or sell one item?', ['Ingredients or materials', 'Packaging', 'Delivery fees', 'Payment processing fees', 'I need to estimate these']),
    q('How many sales or bookings do you hope to make in a typical month?', ['I have a monthly target', 'I need to estimate this', 'I will start with a small trial']),
    q('When do you hope monthly sales will cover monthly costs?', ['Within 3 months', 'Within 6 months', 'Within 1 year', 'I do not know yet']),
  ] },
  { id: 'summary', title: 'Executive summary', icon: '✨', hint: 'Give a reader the short version of your complete plan.', questions: [
    q('What does your business sell or provide?', ['Products', 'Services', 'Digital products', 'A mix of these']),
    q('What is the most important goal for your business?', ['Get the first customers', 'Reach a sales target', 'Build repeat business', 'Expand the offer']),
    q('What is the next important milestone you want to reach?', ['Finish planning', 'Test the offer', 'Make the first sale', 'Open or launch', 'Reach a sales goal']),
    q('Who are your main customers, and what need do you meet for them?'),
    q('What funding or financial support will you need, if any?', ['No outside funding planned', 'A loan', 'An investor or partner', 'A grant', 'Not decided yet']),
    q('Why is this business worth pursuing now?', ['Customers are asking for it', 'I have the skills to start', 'There is a timely opportunity', 'I can begin with a small test']),
  ] },
  { id: 'legal', title: 'Legal & pre-launch planning', pdfTitle: 'Legal Structure & Pre-launch Requirements', icon: '📋', hint: 'Make a plain-language plan for what to prepare and verify before opening. You do not need to know form names.', questions: [
    q('In which city or municipality will your business operate?'),
    q('What have you done so far to register the business, if anything?', ['Nothing yet', 'I have started checking', 'Already registered', 'I am not sure what registration I need']),
    q('How will you protect customer information?', ['Limit who can access it', 'Use secure storage', 'Collect only what is needed', 'I need to plan this']),
    q('How do you plan to own the business?', ['Just me', 'Me and one or more partners', 'Through a registered company', 'I have not decided'], 'You do not need to know the formal structure name yet. Tell us who will own it, or choose “I have not decided.”'),
    q('Have you heard of any permits or special approvals your business might need?', ['I know one I need to check', 'I have not checked yet', 'I need help figuring this out']),
    q('What do you know so far about business taxes or tax registration?', ['I have already checked', 'I know I need to check', 'I am not sure what applies']),
    q('Which agreements do you expect to use with other people?', ['Agreements with suppliers', 'Terms for customers', 'Agreements with workers or contractors', 'I am not sure yet']),
    q('What will you do to keep customers and workers safe?', ['Set clear safety steps', 'Keep the work area and equipment safe', 'Train anyone helping the business', 'I need to plan this']),
  ] },
] as const;
export type ModuleId = typeof MODULES[number]['id'];
export type Message = { role: 'user' | 'zee'; text: string };
export type Version = { text: string; date: string };
export type Section = { text: string; answers: string[]; reviewed: boolean; versions: Version[]; messages: Message[] };
export type Plan = { schema: 4; sections: Record<ModuleId, Section>; updatedAt: string };
const draftLabels = 'Company Overview|Business Name|Concept|Mission|Operational Approach|Target Market|Long-term Vision|Information Still Needed|Customer Segments|Market Need|Competitors|Competitive Advantage|Products and Services|Pricing|Sales Channels|Marketing Strategy|Marketing Budget|Operations|Suppliers|Team|Startup Costs|Monthly Costs|Revenue|Funding|Assumptions|Risks|Milestones|Legal Structure|Registrations|Permits|Compliance Checklist|Executive Summary';
export function formatDraftParagraphs(text: string) {
  const labels = new RegExp(`\\s+(?=(?:${draftLabels}):\\s)`, 'gi');
  return text.replace(/\r\n?/g, '\n').trim().replace(labels, '\n\n').replace(/\n{3,}/g, '\n\n');
}
export function emptyPlan(): Plan {
  const sections = {} as Plan['sections'];
  for (const { id, questions } of MODULES) sections[id] = { text: '', answers: Array(questions.length).fill(''), reviewed: false, versions: [], messages: [] };
  return { schema: 4, updatedAt: '', sections };
}
export function answeredSteps(section: Section, id: ModuleId) { return Math.min(MODULES.find(m => m.id === id)!.questions.length, section.answers.filter(answer => answer.trim()).length); }
export function hasAnsweredEveryStep(section: Section, id: ModuleId) { return answeredSteps(section, id) === MODULES.find(m => m.id === id)!.questions.length; }
export function isSectionComplete(section: Section, id: ModuleId) { return hasAnsweredEveryStep(section, id) && !!section.text.trim() && section.reviewed; }
export function completeSections(plan: Plan) { return MODULES.filter(m => isSectionComplete(plan.sections[m.id], m.id)).length; }
export function setReviewed(plan: Plan, id: ModuleId, reviewed: boolean): Plan {
  if (reviewed && !plan.sections[id].text.trim()) throw new Error('Write and save a draft before reviewing it.');
  if (reviewed && !hasAnsweredEveryStep(plan.sections[id], id)) throw new Error('Finish every guided step before reviewing this section.');
  if (reviewed && id === 'summary' && !MODULES.slice(0, 6).every(m => isSectionComplete(plan.sections[m.id], m.id))) throw new Error('Complete and review the first six sections before the executive summary.');
  const next = { ...plan, updatedAt: new Date().toISOString(), sections: { ...plan.sections, [id]: { ...plan.sections[id], reviewed } } };
  if (!reviewed && MODULES.slice(0, 6).some(m => m.id === id)) next.sections.summary = { ...next.sections.summary, reviewed: false };
  return next;
}
export function saveGuidedAnswer(plan: Plan, id: ModuleId, index: number, answer: string): Plan {
  const module = MODULES.find(m => m.id === id)!;
  if (!Number.isInteger(index) || index < 0 || index >= module.questions.length) throw new Error('That guided step is no longer available.');
  if (answer.length > 4000) throw new Error('Keep each answer under 4,000 characters.');
  if (!answer.trim()) throw new Error('Add an answer before continuing. If you are unsure, write what you still need to find out.');
  const question = module.questions[index];
  if (question.requiresAmount && !/\d/.test(answer) && !/not\s+(?:decided|set|sure)|still\s+(?:deciding|researching)|need\s+to\s+(?:research|estimate|calculate)|do\s+not\s+know|don't\s+know/i.test(answer)) throw new Error('Enter a price amount, such as “PHP 50 per item,” or write “Not decided yet.”');
  const old = plan.sections[id];
  const next = { ...plan, updatedAt: new Date().toISOString(), sections: { ...plan.sections, [id]: { ...old, answers: old.answers.map((value, i) => i === index ? answer.trim() : value), reviewed: false } } };
  if (MODULES.slice(0, 6).some(m => m.id === id)) next.sections.summary = { ...next.sections.summary, reviewed: false };
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
  const data = JSON.parse(raw) as Omit<Plan, 'schema'> & { schema: 1 | 2 | 3 | 4 };
  if (![1, 2, 3, 4].includes(data.schema) || typeof data.updatedAt !== 'string' || !data.sections) throw new Error('This saved plan could not be read.');
  if (data.schema === 1) {
    const overview = data.sections.overview;
    const legal = data.sections.legal;
    const oldStructureAnswer = Array.isArray(overview?.answers) ? overview.answers[6] : '';
    const oldStructure = typeof oldStructureAnswer === 'string' ? oldStructureAnswer.trim().toLowerCase() : '';
    const movedAnswer = oldStructure === 'sole proprietorship' ? 'Just me; I was considering a sole proprietorship.'
      : oldStructure === 'partnership' ? 'Me and one or more partners; I was considering a partnership.'
        : oldStructure === 'corporation' ? 'Through a registered company; I was considering a corporation.'
          : oldStructure === 'not decided yet' ? 'I have not decided who will own the business or which structure to use.' : '';
    if (movedAnswer && overview && legal) {
      overview.answers[6] = '';
      legal.answers ??= [];
      const priorLegalAnswer = typeof legal.answers[3] === 'string' ? legal.answers[3] : '';
      legal.answers[3] = [priorLegalAnswer, movedAnswer].filter(Boolean).join('\n');
      overview.reviewed = false;
      legal.reviewed = false;
      if (data.sections.summary) data.sections.summary.reviewed = false;
    }
    data.schema = 2;
  }
  if (data.schema === 2) {
    const operations = data.sections.operations;
    if (operations) {
      const previous = Array.isArray(operations.answers) ? operations.answers : [];
      const answer = (index: number) => typeof previous[index] === 'string' ? previous[index] : '';
      operations.answers = [answer(0), answer(1), answer(2), answer(3), answer(9), answer(4), answer(5), answer(6), answer(7), answer(8), answer(10)];
      operations.reviewed = false;
      if (data.sections.summary) data.sections.summary.reviewed = false;
    }
    data.schema = 3;
  }
  if (data.schema === 3) {
    const operations = data.sections.operations;
    if (operations) {
      const previous = Array.isArray(operations.answers) ? operations.answers : [];
      const answer = (index: number) => typeof previous[index] === 'string' ? previous[index] : '';
      operations.answers = [answer(0), answer(1), answer(2), answer(3), answer(4), answer(5), answer(10), answer(6), answer(7), answer(8), answer(9)];
      operations.reviewed = false;
      if (data.sections.summary) data.sections.summary.reviewed = false;
    }
    data.schema = 4;
  }
  for (const { id } of MODULES) {
    const s = data.sections[id];
    if (!s || typeof s.text !== 'string' || s.text.length > 12000 || typeof s.reviewed !== 'boolean' || !Array.isArray(s.versions) || s.versions.length > 10 || !Array.isArray(s.messages) || s.messages.length > 20) throw new Error('This saved plan has an invalid section.');
    const questionCount = MODULES.find(m => m.id === id)!.questions.length;
    if (!Array.isArray(s.answers)) s.answers = Array(questionCount).fill('');
    else if (s.answers.length < questionCount) s.answers = [...s.answers, ...Array(questionCount - s.answers.length).fill('')];
    else if (s.answers.length > questionCount) s.answers = s.answers.slice(0, questionCount);
    if (s.answers.length !== questionCount || s.answers.some(answer => typeof answer !== 'string' || answer.length > 4000)) throw new Error('This saved plan has invalid guided answers.');
    if (s.versions.some(v => typeof v.text !== 'string' || v.text.length > 12000 || typeof v.date !== 'string')) throw new Error('This version history could not be read.');
    if (s.messages.some(m => !['user', 'zee'].includes(m.role) || typeof m.text !== 'string' || m.text.length > 6000)) throw new Error('This conversation could not be read.');
  }
  return data as Plan;
}
export function escapeHtml(text: string) { return text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)); }
export function planHtml(title: string, plan: Plan): string {
  return `<!doctype html><html><head><meta charset="utf-8"><style>@page{margin:36px}body{font:14px Arial;color:#27352c;line-height:1.6}h1{font-size:32px}h2{border-bottom:2px solid #ffd84d;padding-bottom:8px;break-after:avoid}.status{color:#667064;font-size:11px}p{white-space:pre-wrap;overflow-wrap:anywhere}header{background:#fff2b3;padding:24px;border-radius:18px}</style></head><body><header><b>biz-z. • YOUR BUSINESS PLAN</b><h1>${escapeHtml(title)}</h1><p>Prepared ${escapeHtml(new Date().toLocaleDateString())} · ${MODULES.filter(m => plan.sections[m.id].reviewed).length}/8 sections reviewed</p></header>${MODULES.map((m, i) => {
    const section = plan.sections[m.id];
    const status = m.id === 'legal'
      ? section.text.trim() ? 'Planning notes — confirm applicable requirements before opening' : 'Not started'
      : section.reviewed ? 'Reviewed by owner' : section.text.trim() ? 'Draft — not reviewed' : 'Not started';
    return `<section><h2>${i + 1}. ${escapeHtml('pdfTitle' in m ? m.pdfTitle : m.title)}</h2><div class="status">${status}</div><p>${escapeHtml(formatDraftParagraphs(section.text) || 'This section has not been written yet.')}</p></section>`;
  }).join('')}<footer>Built with Biz-Z. Estimates and assumptions require verification. Legal planning notes do not confirm compliance; verify requirements before launch.</footer></body></html>`;
}
