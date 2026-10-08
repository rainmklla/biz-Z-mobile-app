export type FinanceEstimateKind = 'startup' | 'unitCost' | 'price' | 'sales' | 'monthlyExpenses';
export type GuidedQuestion = { prompt: string; choices?: readonly string[]; helper?: string; requiresAmount?: boolean; group?: string; singleChoiceOnly?: boolean; estimateKind?: FinanceEstimateKind };
const q = (prompt: string, choices?: string[], helper?: string, requiresAmount = false, group?: string, singleChoiceOnly = false, estimateKind?: FinanceEstimateKind): GuidedQuestion => ({ prompt, choices, helper, requiresAmount, group, singleChoiceOnly, estimateKind });
export const MODULES = [
  { id: 'overview', title: 'Company overview', icon: '🌱', hint: 'Start with the basics. We will ask for one detail at a time.', questions: [
    q('What business name have you chosen?', undefined, 'Use the name you want readers to see on the business plan cover.'),
    q('Why did you choose this name?', ['It describes what I sell', 'It reflects my values', 'It is personal to me', 'It is inspired by a place or person'], 'Tell us what the name means to you. A short phrase is enough.'),
    q('What gave you the idea for this business?', ['A personal interest or skill', 'A need I noticed in my community', 'A request from potential customers', 'A product or service I wanted to improve'], 'For example: “I enjoy baking and people often ask me to make cakes.”'),
    q('What is one need or problem your business will address?', undefined, 'Think about what people need, find difficult, or cannot easily get. Example: “Nearby students have few affordable lunch options.”'),
    q('What will you sell or provide first?', undefined, 'Name your first product or service. Example: “Custom birthday cakes” or “Basic phone repair.”'),
    q('Who do you think will buy it first?', ['Families nearby', 'Students', 'Workers', 'Local small businesses', 'People shopping online'], 'Name the people most likely to become your first customers. You can be specific, such as “students at nearby schools.”'),
    q('What is one way your product or service will help those customers?', ['Save them time', 'Make something easier to get', 'Offer a more affordable option', 'Give them a more personal service', 'Help solve a local problem'], 'Describe one clear benefit. Example: “Customers can order a cake made for their event.”'),
    q('How will customers receive or use what you offer?', ['They will collect it', 'I will deliver it', 'They will use it online', 'I will provide the service at their location'], 'Choose the main way customers will get the product or service.'),
    q('Three years from now, what would you like your business to be like?', undefined, 'Picture a realistic future: for example, serving more customers, earning steady income, or opening a small shop.'),
    q('What is one result you want to achieve in the first year?', undefined, 'Choose one clear goal. Include a number and when you want to reach it. Example: “Get 20 paying customers by month 6.”'),
    q('What is a second result you want to achieve in the first year?', undefined, 'Choose a different goal from the previous step. Example: “Reach 30 orders per month by month 10.” Include a number and deadline.'),
    q('What is a third result you want to achieve in the first year?', undefined, 'Choose one more useful goal. Example: “Save PHP 10,000 for equipment by December.” Include a number and deadline.'),
  ] },
  { id: 'products', title: 'Products & services', icon: '💎', hint: 'Describe what customers get, how it works, and what makes it valuable.', questions: [
    q('What does a customer get when they buy your main product or service?', undefined, 'The main offer you named in Company Overview is shown above. Describe what the customer receives. Example: “One 8-inch cake decorated with their chosen name and colors.”'),
    q('How will a customer use the product, or what will happen during the service?', undefined, 'For a product, say what a customer does with it. For a service, give the main steps in order. Example: “The customer books, I clean the kitchen and bathroom, then we review the result.”'),
    q('What choices or versions will customers be able to choose from?', ['One standard option', 'Different sizes', 'Different flavors or styles', 'Basic and premium packages', 'Optional add-ons'], 'Example: “Customers can choose small, medium, or large.”'),
    q('What important materials or parts are used in your product or service?', undefined, 'For food, name key ingredients; for an item, name its main parts; for a service, name materials used or say none are included. Example: “Flour, butter, and chocolate” or “No physical materials are included.”'),
    q('What is the main benefit customers get from your offer?', ['It saves them time', 'It is easier to access', 'It costs less', 'It is made to their needs', 'It helps solve a specific problem'], 'Say how it helps the customer. Example: “Customers can order a custom cake without travelling to the city.”'),
    q('What makes your product or service different from similar options?', undefined, 'Name one feature customers may not get elsewhere. Example: “Custom designs are ready for pickup the same day.”'),
    q('What should customers be able to count on every time they buy from you?', undefined, 'Describe one quality or experience you will consistently provide. Example: “Every order is ready at the agreed pickup time.”'),
    q('How will you check that your product or service meets that standard?', ['Use a checklist', 'Inspect each item before handoff', 'Test the service steps', 'Ask the customer to confirm'], 'Example: “I will compare each cake with the order details before pickup.”'),
    q('How will customer feedback help you improve your offer?', ['Ask customers after purchase', 'Review ratings or comments', 'Track repeat requests', 'Make a change based on common feedback'], 'Example: “If customers request a flavor often, I will add it to the menu.”'),
  ] },
  { id: 'market', title: 'Market & competition', icon: '🔎', hint: 'Learn about your customers, the market, and the other options they have.', questions: [
    q('Which group of people do you want to sell to first?', undefined, 'Make your answer more specific than the one in Company Overview. For example, instead of “students,” write “college students who live near campus.”'),
    q('Where will you look for these customers first?', ['My city or town', 'A nearby school or workplace', 'A local community', 'An online group or platform'], 'Name a place or online community. Example: “Angeles City” or “a local Facebook group.”'),
    q('About how many potential customers like these could you reach in your first year?', undefined, 'A rough estimate is okay. Example: “About 200 students at two nearby schools.” Use a number, even if it is an estimate.', true),
    q('What have you seen or heard that suggests these customers want your offer?', ['People have asked for it', 'Similar products or services are selling', 'I heard this in customer conversations', 'I received survey responses', 'Someone has placed an order'], 'Give one piece of evidence. Example: “Five parents asked if I could make birthday cakes.”'),
    q('What change or trend could affect demand for your offer?', ['More people are shopping online', 'Customers are looking for lower prices', 'Demand changes with the season', 'A new need is growing in my community', 'I have not noticed a major change'], 'Use something you have observed. Example: “More customers nearby are ordering through social media.” If you have not noticed a major change, say that plainly.'),
    q('What businesses or other options do customers use now?', undefined, 'Name a business or another way customers solve the same need. Example: “They buy from the bakery downtown” or “They make it at home.”'),
    q('What do customers like about those businesses or options?', undefined, 'Choose one strength. Example: “The shop is close to the school” or “The service is quick.”'),
    q('What could those businesses or options do better for customers?', undefined, 'Name one need that is not fully met. Example: “The shop closes before evening classes end.”'),
    q('How will you check your market assumptions before spending more?', ['Talk with potential customers', 'Run a short survey', 'Offer a small trial', 'Take preorders', 'Test at a local event'], 'Choose one small action and say when you will do it. Example: “Ask 10 local parents this week.”'),
  ] },
  { id: 'marketing', title: 'Marketing plan', icon: '📣', hint: 'Plan your product, price, place, and promotion one step at a time.', questions: [
    q('How will you present your offer so customers recognize it?', undefined, 'Think about the name, look, or style customers will remember. Example: “A friendly neighborhood bakery with simple, colorful labels.”', false, 'Product'),
    q('What packaging or presentation will customers see?', undefined, 'For a product, describe its package or display. For a service, describe what customers see or receive. Example: “Cakes come in a sturdy box with a care card.”', false, 'Product'),
    q('What guarantee or warranty will you offer, if any?', ['Replace an item if it arrives damaged', 'Refund if a service is not completed as agreed', 'Offer a limited repair or replacement period', 'No warranty or guarantee planned'], 'Choose a clear promise customers can understand. Example: “I will replace an item damaged during delivery.”', false, 'Product'),
    q('What support will customers receive after they buy?', ['Answers to follow-up questions', 'Repairs or adjustments', 'A check-in after the purchase', 'No extra support planned'], 'Example: “Customers can message me for help using the product.”', false, 'Product'),
    q('How will you charge for your offer?', ['One price per item', 'By the hour', 'A fixed price for a package', 'A monthly subscription', 'A custom quote for each customer'], 'Choose the way customers will be charged. Example: “A fixed fee for each home-cleaning visit.”', false, 'Price'),
    q('How will you decide the amount to charge?', ['Add a profit amount to my costs', 'Compare prices for similar offers', 'Set a price based on the value to customers', 'Start with an introductory price and review it'], 'Your exact unit price is collected in Finance. Here, choose the approach behind that price.', false, 'Price'),
    q('Will you offer any discounts or special prices?', ['No discounts planned', 'A launch discount', 'A discount for bundles', 'A loyalty discount for repeat customers', 'A lower price for larger orders'], 'Example: “10% off a customer’s first order.” If you do not plan discounts, choose “No discounts planned.”', false, 'Price'),
    q('How will customers be able to pay?', ['Cash', 'Bank transfer', 'E-wallet', 'Debit or credit card', 'A mix of these methods'], 'Choose the payment methods you expect to accept. Example: “Cash or GCash.”', false, 'Price'),
    q('Where or how will customers be able to buy or access your offer?', ['At my shop or stall', 'Through social media messages', 'On my website or app', 'Through a retailer or reseller', 'At local markets or events'], 'Choose the main sales channel. Example: “Customers order through Facebook and collect at the weekend market.”', false, 'Place'),
    q('Which city, town, or neighborhood will you serve or sell to first?', undefined, 'Name a real geographic area, not a website or social media platform. You can list nearby areas too. Example: “Angeles City and nearby towns.”', false, 'Place'),
    q('How will you keep your offer available when customers want it?', ['Make each item after it is ordered', 'Keep a small stock ready', 'Use appointment slots', 'Offer a limited number of bookings each week', 'Make the digital offer available anytime'], 'Example: “Keep 10 items ready each weekend” or “Open five service appointments per week.”', false, 'Place'),
    q('Which promotion method will you try first?', ['Social media posts', 'Flyers or posters', 'A launch event or demonstration', 'Customer referrals', 'Local media or community groups'], 'Choose one first step. Example: “Post three product photos each week in local community groups.”', false, 'Promotion'),
    q('What main message should your promotion communicate?', undefined, 'Use the benefit or difference you described in Products & Services. Example: “Custom cakes made for your celebration, ready for pickup on time.”', false, 'Promotion'),
    q('How much can you spend on promotion each month?', undefined, 'Give your best estimate and include the currency. If you will not spend money on promotion, enter 0. Example: “PHP 500 per month.”', true, 'Promotion'),
    q('What result will show that your promotion is working?', ['More customer inquiries', 'More orders or bookings', 'More repeat customers', 'More visits to my shop or page', 'More people attending an event'], 'Choose one result you can track. Example: “Get 10 new orders from social media each month.”', false, 'Promotion'),
  ] },
  { id: 'operations', title: 'Operations & management', pdfTitle: 'Operations and Management Plan', icon: '⚙️', hint: 'Plan the people, tools, and steps you need to run your business.', questions: [
    q('Who will own the business?', ['I will own it by myself', 'I will own it with one or more partners', 'The business will be owned by a registered company'], 'Choose one option for who will own the business at launch.', false, undefined, true),
    q('Why do you want to own the business this way?', undefined, 'Tell us what makes this choice work for you. Example: “I want to make decisions myself while starting small.”'),
    q('How will you and any helpers share the work?', ['I will manage and do most of the work myself', 'My partner and I will share decisions and tasks', 'Each person will focus on a different job', 'A manager will assign tasks and supervise the workers', 'Different work areas will each have a team leader', 'Family members will help, each with a role', 'I will hire outside workers for specific jobs'], 'Choose the one description that best fits your business.', false, undefined, true),
    q('What positions or roles will the business need at launch?', undefined, 'List job titles, not people’s names. Example: “Owner, baker, and delivery helper.” If you are starting alone, write “Business owner only.”'),
    q('Who will fill each role, and who will report to whom?', undefined, 'This helps us show a simple organization chart. Example: “I will be the owner and baker. The delivery helper will report to me.”'),
    q('What will each role be responsible for?', undefined, 'Give one or two main duties for each role. Example: “Baker: prepare and decorate orders; owner: take orders and manage payments.”'),
    q('What skills or experience will each role need?', undefined, 'Include useful skills for you, employees, or outside help. Example: “The baker needs basic food preparation and decorating skills.”'),
    q('What are the steps from receiving an order to completing the product or service?', ['Receive the request', 'Prepare the product or service', 'Check the result', 'Package or finish it', 'Hand it to the customer'], 'Put the steps in order, adding details for your business. Example: “Confirm order → bake cake → check decoration → package → customer pickup.”'),
    q('Where will the work take place?', ['At home', 'In a rented space', 'At a storefront', 'At the customer’s location', 'Online'], 'Choose the main work location. If you use more than one, name each one.'),
    q('What main materials or supplies will you use, and where will you get each one?', undefined, 'Pair each item with its source. Example: “Flour — local grocery; cake boxes — packaging supplier.” Your main materials from Products & Services are shown above.'),
    q('What equipment, tools, or technology will you use, and what will each one be used for?', undefined, 'Pair each item with its purpose. Example: “Oven — bake cakes; refrigerator — keep ingredients fresh; phone — receive orders.”'),
    q('What is one problem that could interrupt daily operations?', ['Supplier delays', 'Equipment failure', 'Unexpected high demand', 'Staff or owner unavailable', 'Delivery disruption'], 'Choose the most likely problem for your business.'),
    q('What will you do if that problem happens?', ['Contact customers early', 'Use a backup supplier', 'Reschedule orders', 'Offer an alternative', 'Pause orders until resolved'], 'Choose a practical response to the problem you selected.'),
    q('How will completed orders reach your customers?', ['My own delivery', 'A third-party courier', 'Customer pickup', 'A mix of methods'], 'Choose the method you plan to use. Your answer can be one method or a combination.'),
    q('Who will coordinate the delivery or pickup with each customer?', ['I will coordinate it', 'The courier will contact the customer', 'The customer will arrange pickup', 'A team member will coordinate it'], 'Choose who will confirm the time and handoff details.'),
  ] },
  { id: 'finance', title: 'Financial plan & funding', icon: '💰', hint: 'Build the numbers one choice at a time. Zee can suggest rough estimates, and the app will calculate the totals.', questions: [
    q('Who will put money into the business, and how much will each person contribute?', undefined, 'Write one person and their amount on each line. Example: “Rain — PHP 20,000” and “Ana — PHP 10,000.” Biz-Z will calculate each person’s percentage automatically. If you are the only contributor, your share will be 100%. If nobody will contribute money, enter “No owner contributions — PHP 0.”'),
    q('How will the owners share the profit or cover a loss?', ['I will keep all profit and cover all losses', 'We will split profit and losses equally', 'We will split them based on each person’s contribution', 'We agreed on another specific percentage split'], 'If you choose another split, write each owner’s percentage. Example: “Rain 60%, Ana 40%.”'),
    q('How will you pay for the money the business needs to get started?', ['My savings', 'Money from an owner or partner', 'A loan I plan to repay', 'A grant or small-business support', 'A mix of these sources'], 'Choose the source you currently plan to use. You can explain a mix in your own words.'),
    q('Which costs do you expect before you open?', ['Equipment or tools', 'First materials or stock', 'Packaging or signs', 'Registration or setup', 'Rent deposit or space setup', 'Other one-time costs'], 'Tap every type that may apply. Zee will estimate the amounts in the next step.'),
    q('About how much might your setup items cost?', ['0 — I will start without setup purchases'], 'This is a one-time amount for the things you selected in the last step. Tap “Show 3 estimates” to see possible totals, or choose 0 if you will not buy anything to get started.', true, undefined, true, 'startup'),
    q('What does it cost you each time you make or provide one sale?', ['Ingredients or materials', 'Packaging', 'Work time paid per item', 'Delivery or transaction fees', 'Utilities used for each item', 'Other costs for each sale'], 'Tap every cost type that may apply. Zee will estimate the cost for one item or service next.'),
    q('About how much does it cost to make or provide one sale?', ['0 — It costs nothing each time'], 'Tap “Show 3 estimates” to see possible costs for one item, order, or service. Choose the amount that seems closest.', true, undefined, true, 'unitCost'),
    q('What price could you charge for one item, booking, or service?', ['0 — I will offer it for free'], 'Tap “Show 3 estimates” to see possible prices based on your offer and costs. Choose a price that feels realistic. You can change it later.', true, undefined, true, 'price'),
    q('About how many items, orders, or bookings could you make in one month?', ['0 — I expect no sales at first'], 'Tap “Show 3 estimates” to see possible monthly sales amounts based on your business and customer details. Choose a realistic starting point.', true, undefined, true, 'sales'),
    q('Which costs will you pay each month even if you make no sales?', ['Rent or workspace', 'Phone or internet', 'Monthly utilities', 'Regular wages', 'Transport', 'Subscriptions or other regular bills', 'Marketing or promotion'], 'Tap every monthly cost that may apply. Your monthly promotion budget from Marketing Plan will be included automatically.'),
    q('About how much might your regular monthly costs be?', ['0 — I will have no regular monthly costs'], 'Tap “Show 3 estimates” to see possible monthly costs for the items you selected. Your Marketing Plan promotion budget is added separately.', true, undefined, true, 'monthlyExpenses'),
  ] },
  { id: 'summary', title: 'Executive summary', icon: '✨', hint: 'Biz-Z creates a short overview from the information in your earlier plan sections. Review it and edit anything you want.', questions: [] },
] as const;
export type ModuleId = typeof MODULES[number]['id'];
export type Message = { role: 'user' | 'zee'; text: string };
export type Version = { text: string; date: string };
export type Section = { text: string; answers: string[]; reviewed: boolean; versions: Version[]; messages: Message[] };
export type Plan = { schema: 16; sections: Record<ModuleId, Section> & { legal?: Section }; updatedAt: string; logoDataUrl?: string };
const draftLabels = 'Company Overview|Business Name|Concept|Mission|Operational Approach|Target Market|Long-term Vision|Information Still Needed|Customer Segments|Market Need|Competitors|Competitive Advantage|Products and Services|Pricing|Sales Channels|Marketing Strategy|Marketing Budget|Operations|Suppliers|Team|Startup Costs|Monthly Costs|Revenue|Funding|Assumptions|Risks|Milestones|Legal Structure|Registrations|Permits|Compliance Checklist|Executive Summary';
export function formatDraftParagraphs(text: string) {
  const labels = new RegExp(`\\s+(?=(?:${draftLabels}):\\s)`, 'gi');
  return text.replace(/\r\n?/g, '\n').trim().replace(labels, '\n\n').replace(/\n{3,}/g, '\n\n');
}
export function emptyPlan(): Plan {
  const sections = {} as Plan['sections'];
  for (const { id, questions } of MODULES) sections[id] = { text: '', answers: Array(questions.length).fill(''), reviewed: false, versions: [], messages: [] };
  return { schema: 16, updatedAt: '', sections, logoDataUrl: '' };
}
export function isCompleteGuidedAnswer(answer: string) {
  const value = answer.trim();
  if (!value) return false;
  const standaloneUncertainty = /^(?:(?:i(?:['’]m| am)|we(?:['’]re| are))\s+)?(?:not\s+sure|unsure|uncertain|don't\s+know|do\s+not\s+know|have\s+no\s+idea|no\s+idea|haven't\s+decided|have\s+not\s+decided|not\s+decided|still\s+deciding|still\s+figuring(?:\s+this\s+out)?|still\s+(?:need\s+to\s+)?research(?:ing)?|need\s+(?:to\s+)?(?:research|estimate|check|figure\s+out|find\s+out|decide|calculate|make\s+a\s+list|plan)|need\s+help\s+estimating|unknown|tbd|to\s+be\s+determined)\b/i;
  const personalUncertainty = /\b(?:i(?:['’]m| am)|we(?:['’]re| are))\s+(?:not\s+sure|unsure|uncertain|still\s+deciding|still\s+figuring(?:\s+this\s+out)?)\b|\b(?:i|we)\s+(?:don't\s+know|do\s+not\s+know|haven't\s+decided|have\s+not\s+decided|need\s+(?:to\s+)?(?:research|estimate|check|figure\s+out|find\s+out|decide|calculate|make\s+a\s+list|plan)|need\s+help\s+estimating)\b/i;
  return !standaloneUncertainty.test(value) && !personalUncertainty.test(value);
}
export function answeredSteps(section: Section, id: ModuleId) { return Math.min(MODULES.find(m => m.id === id)!.questions.length, section.answers.filter(isCompleteGuidedAnswer).length); }
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
  if (!answer.trim()) throw new Error('Add an answer before continuing.');
  if (!isCompleteGuidedAnswer(answer)) throw new Error('Please give a definite answer. Use your best estimate or make a specific choice instead of writing that you are unsure or have not decided.');
  const question = module.questions[index];
  if (question.requiresAmount && !/\d/.test(answer)) throw new Error('Include a number in your estimate. Enter 0 if the amount is zero.');
  if (id === 'overview' && index >= 9 && index <= 11) {
    const deadline = /\b(?:by|within|in|before|end of|quarter|q[1-4]|month|week|january|february|march|april|may|june|july|august|september|october|november|december)\b/i;
    if (!/\d/.test(answer) || !deadline.test(answer)) throw new Error('Add a number and a time for this goal. Example: “Get 20 paying customers by month 6.”');
  }
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
  const data = JSON.parse(raw) as Omit<Plan, 'schema'> & { schema: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 };
  if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].includes(data.schema) || typeof data.updatedAt !== 'string' || !data.sections) throw new Error('This saved plan could not be read.');
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
  if (data.schema === 4) {
    const oldOverviewAnswers = Array.isArray(data.sections.overview?.answers) ? data.sections.overview.answers : [];
    const oldAnswer = (index: number) => typeof oldOverviewAnswers[index] === 'string' ? oldOverviewAnswers[index].trim() : '';
    const keepAnswer = (value: string) => isCompleteGuidedAnswer(value) ? value : '';
    const oldName = oldAnswer(0).replace(/^(?:i have a name|i am still deciding)\s*/i, '').trim();
    const overview = data.sections.overview;
    if (overview) {
      const businessContext = [['Need or opportunity', oldAnswer(3)], ['Business purpose', oldAnswer(9)]]
        .filter(([, value]) => keepAnswer(value)).map(([label, value]) => label + ': ' + value).join('\n');
      const offerDetails = [['Offer type', oldAnswer(1)], ['Industry', oldAnswer(6)], ['Customer value', oldAnswer(4)]]
        .filter(([, value]) => keepAnswer(value)).map(([label, value]) => label + ': ' + value).join('\n');
      const customerDetails = [['Target customer', oldAnswer(2)], ['Delivery approach', oldAnswer(8)]]
        .filter(([, value]) => keepAnswer(value)).map(([label, value]) => label + ': ' + value).join('\n');
      overview.answers = [keepAnswer(oldName), '', businessContext, offerDetails, customerDetails, '', ''];
      overview.reviewed = false;
    }
    const moveAnswer = (targetId: ModuleId, targetIndex: number, value: string) => {
      const target = data.sections[targetId];
      if (!target || !Array.isArray(target.answers) || !keepAnswer(value) || target.answers[targetIndex]?.trim()) return;
      target.answers[targetIndex] = value;
      target.reviewed = false;
    };
    moveAnswer('market', 0, oldAnswer(2));
    moveAnswer('market', 5, oldAnswer(4));
    moveAnswer('operations', 1, oldAnswer(5));
    moveAnswer('operations', 5, oldAnswer(8));
    moveAnswer('summary', 1, oldAnswer(10));
    if (data.sections.summary) data.sections.summary.reviewed = false;
    data.schema = 5;
  }
  if (data.schema === 5) {
    const overview = data.sections.overview;
    if (overview) {
      const previous = Array.isArray(overview.answers) ? overview.answers : [];
      const answer = (index: number) => typeof previous[index] === 'string' ? previous[index].trim() : '';
      const oldObjectives = answer(6).split(/\r?\n/).map(line => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim()).filter(Boolean);
      overview.answers = [answer(0), answer(1), answer(2), '', answer(3), answer(4), '', '', answer(5), oldObjectives[0] ?? '', oldObjectives[1] ?? '', oldObjectives[2] ?? ''];
      overview.reviewed = false;
    }
    data.schema = 6;
  }
  if (data.schema === 6) {
    const market = data.sections.market;
    if (market) {
      const previous = Array.isArray(market.answers) ? market.answers : [];
      const answer = (index: number) => typeof previous[index] === 'string' ? previous[index].trim() : '';
      market.answers = [answer(0), answer(4), '', answer(1), '', answer(2), '', answer(5), answer(3)];
      market.reviewed = false;
    }
    if (data.sections.summary) data.sections.summary.reviewed = false;
    data.schema = 7;
  }
  if (data.schema === 7) {
    // Checklist revisions invalidate their old drafts. Preserve each draft in history, then require a fresh draft from the revised answers.
    const archiveAndClear = (id: ModuleId) => {
      const section = data.sections[id];
      if (!section) return;
      if (section.text?.trim()) {
        const lastVersion = Array.isArray(section.versions) ? section.versions[section.versions.length - 1] : undefined;
        const versions = Array.isArray(section.versions) ? section.versions : [];
        if (lastVersion?.text !== section.text) versions.push({ text: section.text, date: data.updatedAt || new Date().toISOString() });
        section.versions = versions.slice(-10);
      }
      section.text = '';
      section.reviewed = false;
    };
    archiveAndClear('overview');
    archiveAndClear('market');
    archiveAndClear('summary');
    data.schema = 8;
  }
  if (data.schema === 8) {
    const products = data.sections.products;
    const archiveAndClear = (id: ModuleId) => {
      const section = data.sections[id];
      if (!section) return;
      if (section.text?.trim()) {
        const versions = Array.isArray(section.versions) ? section.versions : [];
        const lastVersion = versions[versions.length - 1];
        if (lastVersion?.text !== section.text) versions.push({ text: section.text, date: data.updatedAt || new Date().toISOString() });
        section.versions = versions.slice(-10);
      }
      section.text = '';
      section.reviewed = false;
    };
    if (products) {
      const previous = Array.isArray(products.answers) ? products.answers : [];
      const answer = (index: number) => typeof previous[index] === 'string' ? previous[index].trim() : '';
      const keep = (value: string) => isCompleteGuidedAnswer(value) ? value : '';
      const offerDetails = [['Main offer', keep(answer(0))], ['What it includes', keep(answer(1))]].filter(([, value]) => value).map(([label, value]) => label + ': ' + value).join('\n');
      products.answers = [offerDetails, '', keep(answer(4)), '', '', '', '', keep(answer(3)), keep(answer(7))];
      products.reviewed = false;
      const transfer = (targetId: ModuleId, targetIndex: number, value: string, label: string) => {
        const target = data.sections[targetId];
        if (!target || !Array.isArray(target.answers) || !keep(value)) return;
        const existing = typeof target.answers[targetIndex] === 'string' ? target.answers[targetIndex].trim() : '';
        if (!existing) target.answers[targetIndex] = value;
        else if (existing !== value && !existing.includes(value)) target.answers[targetIndex] = existing + '\n' + label + ': ' + value;
        target.reviewed = false;
        archiveAndClear(targetId);
      };
      transfer('marketing', 2, answer(2), 'Previous order method');
      transfer('finance', 2, answer(5), 'Price from Products & Services');
      transfer('operations', 5, answer(6), 'Previous delivery method');
    }
    archiveAndClear('products');
    archiveAndClear('summary');
    data.schema = 9;
  }
  if (data.schema === 9) {
    const marketing = data.sections.marketing;
    const archiveAndClear = (id: ModuleId) => {
      const section = data.sections[id];
      if (!section) return;
      if (section.text?.trim()) {
        const versions = Array.isArray(section.versions) ? section.versions : [];
        const lastVersion = versions[versions.length - 1];
        if (lastVersion?.text !== section.text) versions.push({ text: section.text, date: data.updatedAt || new Date().toISOString() });
        section.versions = versions.slice(-10);
      }
      section.text = '';
      section.reviewed = false;
    };
    if (marketing) {
      const previous = Array.isArray(marketing.answers) ? marketing.answers : [];
      const answer = (index: number) => typeof previous[index] === 'string' ? previous[index].trim() : '';
      const keep = (value: string) => isCompleteGuidedAnswer(value) ? value : '';
      const budget = keep(answer(3));
      const normalizedBudget = budget && /no\s+paid\s+budget/i.test(budget) ? 'PHP 0 per month (no paid promotion planned)' : budget;
      marketing.answers = ['', '', '', '', '', '', '', '', keep(answer(2)), '', '', keep(answer(0)), keep(answer(1)), normalizedBudget, keep(answer(4))];
      marketing.reviewed = false;
    }
    archiveAndClear('marketing');
    archiveAndClear('summary');
    data.schema = 10;
  }
  if (data.schema === 10) {
    const operations = data.sections.operations;
    const archiveAndClear = (id: ModuleId) => {
      const section = data.sections[id];
      if (!section) return;
      if (section.text?.trim()) {
        const versions = Array.isArray(section.versions) ? section.versions : [];
        const lastVersion = versions[versions.length - 1];
        if (lastVersion?.text !== section.text) versions.push({ text: section.text, date: data.updatedAt || new Date().toISOString() });
        section.versions = versions.slice(-10);
      }
      section.text = '';
      section.reviewed = false;
    };
    if (operations) {
      const previous = Array.isArray(operations.answers) ? operations.answers : [];
      const answer = (index: number) => typeof previous[index] === 'string' ? previous[index].trim() : '';
      const keep = (value: string) => isCompleteGuidedAnswer(value) ? value : '';
      const materialsAndSources = [
        keep(answer(8)) ? `Materials or supplies: ${keep(answer(8))}` : '',
        keep(answer(9)) ? `Planned source: ${keep(answer(9))}` : '',
      ].filter(Boolean).join('\n');
      operations.answers = ['', '', '', keep(answer(2)), '', keep(answer(10)), keep(answer(0)), keep(answer(1)), materialsAndSources, keep(answer(7)), keep(answer(3)), keep(answer(4)), keep(answer(5)), keep(answer(6))];
      operations.reviewed = false;
    }
    archiveAndClear('operations');
    archiveAndClear('summary');
    data.schema = 11;
  }
  if (data.schema === 11) {
    const operations = data.sections.operations;
    const legalOwnership = data.sections.legal?.answers?.[3]?.trim() ?? '';
    const ownershipChoice = /registered company|corporation/i.test(legalOwnership) ? 'The business will be owned by a registered company'
      : /partner/i.test(legalOwnership) ? 'I will own it with one or more partners'
        : /just me|sole|own it alone/i.test(legalOwnership) ? 'I will own it by myself' : '';
    const archiveAndClear = (id: ModuleId) => {
      const section = data.sections[id];
      if (!section) return;
      if (section.text?.trim()) {
        const versions = Array.isArray(section.versions) ? section.versions : [];
        const lastVersion = versions[versions.length - 1];
        if (lastVersion?.text !== section.text) versions.push({ text: section.text, date: data.updatedAt || new Date().toISOString() });
        section.versions = versions.slice(-10);
      }
      section.text = '';
      section.reviewed = false;
    };
    if (operations) {
      const previous = Array.isArray(operations.answers) ? operations.answers : [];
      const answer = (index: number) => typeof previous[index] === 'string' ? previous[index].trim() : '';
      operations.answers = [ownershipChoice, answer(0), answer(1), answer(2), answer(3), answer(4), answer(5), answer(6), answer(7), answer(8), answer(9), answer(10), answer(11), answer(12), answer(13)];
      operations.reviewed = false;
    }
    archiveAndClear('operations');
    archiveAndClear('summary');
    data.schema = 12;
  }
  if (data.schema === 12) {
    const operations = data.sections.operations;
    const archiveAndClear = (id: ModuleId) => {
      const section = data.sections[id];
      if (!section) return;
      if (section.text?.trim()) {
        const versions = Array.isArray(section.versions) ? section.versions : [];
        const lastVersion = versions[versions.length - 1];
        if (lastVersion?.text !== section.text) versions.push({ text: section.text, date: data.updatedAt || new Date().toISOString() });
        section.versions = versions.slice(-10);
      }
      section.text = '';
      section.reviewed = false;
    };
    if (operations) {
      const previous = typeof operations.answers?.[2] === 'string' ? operations.answers[2].trim().toLowerCase() : '';
      const normalizedChoice = /owner-led|manage the main work|i will run/.test(previous) ? 'I will manage and do most of the work myself'
        : /flat|share decisions|share the work|partner/.test(previous) ? 'My partner and I will share decisions and tasks'
          : /functional|different job|grouped by job/.test(previous) ? 'Each person will focus on a different job'
            : /hierarchical|manager|supervis/.test(previous) ? 'A manager will assign tasks and supervise the workers'
              : /team lead|each.*leader/.test(previous) ? 'Different work areas will each have a team leader'
                : /family/.test(previous) ? 'Family members will help, each with a role'
                  : /outside|contract|outsourc/.test(previous) ? 'I will hire outside workers for specific jobs' : '';
      operations.answers[2] = normalizedChoice;
      operations.reviewed = false;
    }
    archiveAndClear('operations');
    archiveAndClear('summary');
    data.schema = 13;
  }
  if (data.schema === 13) {
    const finance = data.sections.finance;
    if (finance) {
      const previous = Array.isArray(finance.answers) ? finance.answers : [];
      const old = (index: number) => typeof previous[index] === 'string' ? previous[index].trim() : '';
      const startupChoices = ['Equipment or tools', 'First materials or stock', 'Packaging or signs', 'Registration or setup', 'Rent deposit or space setup', 'Other one-time costs'];
      const variableChoices = ['Ingredients or materials', 'Packaging', 'Work time paid per item', 'Delivery or transaction fees', 'Utilities used for each item', 'Other costs for each sale'];
      const monthlyChoices = ['Rent or workspace', 'Phone or internet', 'Monthly utilities', 'Regular wages', 'Transport', 'Subscriptions or other regular bills', 'Marketing or promotion'];
      const lowerStartup = old(0).toLowerCase();
      const lowerVariable = old(5).toLowerCase();
      const lowerMonthly = old(1).toLowerCase();
      const funding = old(4).toLowerCase();
      const startup = startupChoices.filter((_, i) => [ /equipment|tool/, /initial material|stock/, /packaging|sign/, /registration|setup fee/, /rent|deposit|space/, /other/ ][i].test(lowerStartup)).join('\n');
      const variable = variableChoices.filter((_, i) => [ /ingredient|material/, /packaging/, /labor|work time/, /delivery|payment|transaction/, /utilit/, /other/ ][i].test(lowerVariable)).join('\n');
      const monthly = monthlyChoices.filter((_, i) => [ /rent/, /internet|phone/, /utilit/, /wage/, /transport/, /subscription|other/, /market|promotion/ ][i].test(lowerMonthly)).join('\n');
      const fundingChoice = /saving/.test(funding) ? 'My savings' : /loan/.test(funding) ? 'A loan I plan to repay' : /family|partner|support/.test(funding) ? 'Money from an owner or partner' : /grant/.test(funding) ? 'A grant or small-business support' : '';
      finance.answers = ['', '', fundingChoice, startup, '', variable, '', old(2), '', monthly, ''];
      finance.reviewed = false;
    }
    const archiveAndClear = (id: ModuleId) => {
      const section = data.sections[id];
      if (!section) return;
      if (section.text?.trim()) {
        const versions = Array.isArray(section.versions) ? section.versions : [];
        const lastVersion = versions[versions.length - 1];
        if (lastVersion?.text !== section.text) versions.push({ text: section.text, date: data.updatedAt || new Date().toISOString() });
        section.versions = versions.slice(-10);
      }
      section.text = '';
      section.reviewed = false;
    };
    archiveAndClear('finance');
    archiveAndClear('summary');
    data.schema = 14;
  }
  if (data.schema === 14) {
    const summary = data.sections.summary;
    if (summary) {
      if (summary.text?.trim()) {
        const versions = Array.isArray(summary.versions) ? summary.versions : [];
        const lastVersion = versions[versions.length - 1];
        if (lastVersion?.text !== summary.text) versions.push({ text: summary.text, date: data.updatedAt || new Date().toISOString() });
        summary.versions = versions.slice(-10);
      }
      summary.text = '';
      summary.answers = [];
      summary.reviewed = false;
    }
    data.schema = 15;
  }
  if (data.schema === 15) data.schema = 16;
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
export function businessNameFromPlan(plan: Plan) {
  const answer = plan.sections.overview.answers[0]?.trim();
  return isCompleteGuidedAnswer(answer ?? '') && !/^(?:i have a name|i am still deciding)$/i.test(answer) ? answer : '';
}
export function planHtml(plan: Plan): string {
  const businessName = businessNameFromPlan(plan);
  const chapters = MODULES.filter(module => module.id !== 'summary');
  const chapterTitles: Record<string, string> = {
    overview: 'Company Overview', products: 'Product/Service', market: 'Market Analysis',
    marketing: 'Marketing Plan', operations: 'Operations and Management Plan', finance: 'Financial Plan',
  };
  const content = (id: ModuleId) => escapeHtml(formatDraftParagraphs(plan.sections[id].text) || '');
  const summary = content('summary');
  const logo = plan.logoDataUrl?.startsWith('data:image/') ? `<img class="logo" src="${plan.logoDataUrl}" alt="Business logo">` : '';
  const toc = ['Executive Summary', ...chapters.map((m, i) => `Chapter ${i + 1}: ${chapterTitles[m.id]}`)];
  const sections = [
    `<section class="page"><h1>Table of Contents</h1><ol>${toc.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol></section>`,
    `<section class="page"><h1>Executive Summary</h1>${summary ? `<div>${summary.split(/\n\s*\n/).map(p => `<p>${p}</p>`).join('')}</div>` : ''}</section>`,
    ...chapters.map((m, i) => `<section class="page"><h1>Chapter ${i + 1}: ${escapeHtml(chapterTitles[m.id])}</h1>${content(m.id).split(/\n\s*\n/).filter(Boolean).map(p => `<p>${p}</p>`).join('')}</section>`),
  ].join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>@page{margin:1in}body{font:12pt "Times New Roman",serif;color:#111;line-height:1.5}h1{font-size:18pt;text-align:center;margin:0 0 20pt}p{white-space:pre-wrap;overflow-wrap:anywhere;text-align:justify;margin:0 0 12pt}li{margin:0 0 8pt}.cover{box-sizing:border-box;height:8in;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;page-break-after:always;break-after:page}.cover h1{font-size:24pt;margin-top:30pt}.logo{max-width:180px;max-height:140px;object-fit:contain}.business-name{font-size:18pt}.page{page-break-before:always;break-before:page}</style></head><body><section class="cover">${logo}<div>A Business Plan</div>${businessName ? `<div class="business-name">${escapeHtml(businessName)}</div>` : ''}</section>${sections}</body></html>`;
}
