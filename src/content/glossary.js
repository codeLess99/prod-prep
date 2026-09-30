// Glossary of prep terms. Anywhere the site renders text through linkify(), these terms become tappable
// and open a short explanation.
//   t: term as shown in the popup title
//   full: expanded name (optional)
//   m: text to match. ALL-CAPS entries match case-sensitively; others ignore case.
//   d: plain-language definition
//   c: id of the Learn concept with more detail (optional)

export const GLOSSARY = [
  // ---------- PM basics ----------
  { t: 'MVP', full: 'Minimum viable product', m: ['MVP', 'MVPs', 'minimum viable product'], d: 'The smallest version of a product that tests your key assumption with real users. It is for learning, not a buggy half-product.', c: 'mvp' },
  { t: 'PRD', full: 'Product requirements document', m: ['PRD', 'PRDs'], d: 'The document that tells every team what will be built, for whom, why, and how success is measured.', c: 'prd' },
  { t: 'Product life cycle', m: ['product life cycle', 'life cycle stage'], d: 'Introduction, growth, maturity, decline. Each stage calls for a different strategy and different metrics.', c: 'plc' },
  { t: 'Product-market fit', m: ['product-market fit', 'PMF'], d: 'The point where a product clearly satisfies a real market need: users keep coming back and tell others without being pushed.', c: 'plc' },
  { t: 'Freemium', m: ['freemium'], d: 'Core features free, advanced ones paid. The risk: too generous and nobody upgrades, too stingy and nobody joins.', c: 'business-models' },
  { t: 'Razor and blade', m: ['razor and blade'], d: 'Sell the base product cheaply and earn on the add-ons, like game consoles and games.', c: 'business-models' },
  { t: 'Take rate', m: ['take rate', 'take rates'], d: 'The share of each transaction a marketplace keeps as its revenue. A 20% take rate on a ₹500 order is ₹100.', c: 'business-models' },
  { t: 'SaaS', full: 'Software as a service', m: ['SaaS'], d: 'Software sold as a subscription and used over the internet, earning recurring revenue instead of one-time sales.', c: 'business-models' },
  { t: 'Marketplace', m: ['marketplace', 'marketplaces', 'two-sided platform', 'two-sided platforms'], d: 'A platform that connects two or more groups, such as buyers and sellers or riders and drivers. It has to keep supply and demand in balance.', c: 'platforms' },
  { t: 'Network effect', m: ['network effect', 'network effects'], d: 'Each user gets more value as more users join. Messaging apps and marketplaces grow stronger this way.', c: 'platforms' },
  { t: 'B2B', full: 'Business to business', m: ['B2B'], d: 'Products sold to companies rather than individual consumers. Buyers care about ROI, security and integrations.' },
  { t: 'B2C', full: 'Business to consumer', m: ['B2C'], d: 'Products sold directly to individual people.' },
  { t: 'D2C', full: 'Direct to consumer', m: ['D2C'], d: 'A brand selling straight to customers through its own site or app instead of through retailers or marketplaces.' },
  { t: 'SMB', full: 'Small and medium business', m: ['SMB', 'SMBs'], d: 'Smaller companies as a customer segment. They are price-sensitive and want quick setup.' },
  { t: 'Unit economics', m: ['unit economics'], d: 'Revenue and cost for a single unit, like one order or one customer. If each unit loses money, growth makes losses bigger.' },
  { t: 'Contribution margin', m: ['contribution margin'], d: 'Revenue from one unit (say, one order) minus the variable costs of serving it, such as delivery, packing and discounts.' },
  { t: 'Cannibalisation', m: ['cannibalisation', 'cannibalises', 'cannibalise'], d: 'When a new product or tier eats into sales of an existing one instead of bringing new money.' },
  { t: 'Commoditisation', m: ['commoditisation'], d: 'When competing products look the same to customers, so they choose on price alone.' },
  { t: 'Moat', m: ['moat', 'defensible position'], d: 'What stops competitors copying you: network effects, data, brand, switching costs or scale.' },

  // ---------- Users and design ----------
  { t: 'CIRCLES', m: ['CIRCLES'], d: 'A checklist for design answers: Comprehend, Identify customer, Report needs, Cut through prioritisation, List solutions, Evaluate trade-offs, Summarise. Use the structure without naming it.', c: 'circles' },
  { t: 'Persona', m: ['persona', 'personas'], d: 'A specific, research-backed profile of a target user: who they are, how they behave, what motivates them. Pick one and stay with it.', c: 'personas' },
  { t: 'Segment', m: ['segmentation', 'user segment', 'user segments'], d: 'A group of users who share traits, behaviour or needs. You choose a segment to focus on by its size and how unmet its need is.', c: 'personas' },
  { t: 'Pain point', m: ['pain point', 'pain points'], d: 'A specific problem or frustration users hit. Rank pain points by how acute and how frequent they are.', c: 'journey' },
  { t: 'JTBD', full: 'Jobs to be done', m: ['JTBD', 'jobs to be done', 'job to be done'], d: 'The progress a person is trying to make in a given situation. It explains why they "hire" a product, not just who they are.', c: 'jtbd' },
  { t: 'User journey', m: ['user journey', 'user journeys', 'journey map'], d: 'The steps a user takes to finish a task. Mapping it shows where things break. Lens: entice, enter, engage, exit, extend (the 5Es).', c: 'journey' },
  { t: 'User story', m: ['user story', 'user stories'], d: '"As a [user], I want [goal] so that [benefit]." A short statement of a need from the user\'s side.', c: 'user-stories' },
  { t: 'Hook model', m: ['hook model'], d: 'A loop for habit-forming products: trigger, action, variable reward, investment.', c: 'hook' },
  { t: 'Design thinking', m: ['design thinking'], d: 'An iterative, user-centred process: empathise, define, ideate, prototype, test.', c: 'design-thinking' },
  { t: 'Onboarding', m: ['onboarding'], d: 'The first steps a new user goes through before they get value from the product.' },
  { t: 'Aha moment', m: ['aha moment', '"aha" moment'], d: 'The moment a new user first feels the product\'s value, like a first order delivered or a first message replied to.', c: 'aarrr' },
  { t: 'Value proposition', m: ['value proposition'], d: 'A clear statement of what the product does for a specific user and why it beats the alternatives.', c: 'gtm-approach' },
  { t: 'Wireframe', m: ['wireframe', 'wireframes'], d: 'A rough, low-fidelity layout of a screen: what goes where, without colours or polish.', c: 'wireframes' },
  { t: 'Prototype', m: ['prototype', 'prototypes'], d: 'A clickable, closer-to-real model of a product used for testing ideas with users.', c: 'wireframes' },
  { t: 'UX', full: 'User experience', m: ['UX'], d: 'How using the product works and feels from start to finish.', c: 'wireframes' },
  { t: 'UI', full: 'User interface', m: ['UI'], d: 'The visual layer the user touches: screens, buttons, text, layout.', c: 'wireframes' },

  // ---------- Prioritisation ----------
  { t: 'RICE', m: ['RICE'], d: 'A prioritisation score: (Reach × Impact × Confidence) ÷ Effort. Higher means do it sooner.', c: 'rice' },
  { t: 'ICE', m: ['ICE'], d: 'Impact × Confidence × Ease, each scored 1–10. A faster version of RICE when you have no reach data.', c: 'ice' },
  { t: 'Kano model', m: ['Kano', 'Kano model'], d: 'Sorts features by their effect on satisfaction: must-haves, performance features, delighters and indifferent ones.', c: 'kano' },
  { t: 'MoSCoW', m: ['MoSCoW'], d: 'Must have, Should have, Could have, Won\'t have (this time). Used to scope a release.', c: 'moscow' },
  { t: 'Quick win', m: ['quick win', 'quick wins'], d: 'High value, low effort. The top-left box of a value vs effort grid.', c: 'value-effort' },
  { t: 'Backlog', m: ['backlog', 'product backlog'], d: 'The prioritised list of features, fixes and ideas waiting to be built.', c: 'sdlc' },

  // ---------- Metrics ----------
  { t: 'North star metric', m: ['north star metric', 'north star'], d: 'The one metric that best captures the value users get from the product, such as nights booked for a stays marketplace.', c: 'north-star' },
  { t: 'KPI', full: 'Key performance indicator', m: ['KPI', 'KPIs'], d: 'One of the few critical numbers a team watches to judge success.', c: 'okr' },
  { t: 'OKR', full: 'Objectives and key results', m: ['OKR', 'OKRs'], d: 'A goal-setting method: an objective (where you want to go) and key results (how you will know you got there).', c: 'okr' },
  { t: 'AARRR', full: 'Pirate metrics', m: ['AARRR', 'pirate metrics'], d: 'A growth funnel: acquisition, activation, retention, referral, revenue. Useful for finding where users leak out.', c: 'aarrr' },
  { t: 'HEART', m: ['HEART'], d: 'A user-experience metrics framework: happiness, engagement, adoption, retention, task success.', c: 'heart' },
  { t: 'Funnel', m: ['funnel', 'funnels'], d: 'The sequence of steps users go through, such as visit → sign up → first order. You measure drop-off between steps.', c: 'aarrr' },
  { t: 'Acquisition', m: ['acquisition'], d: 'How new users find and join the product: installs, sign-ups.', c: 'aarrr' },
  { t: 'Activation', m: ['activation'], d: 'A new user reaching their first moment of real value.', c: 'aarrr' },
  { t: 'Retention', m: ['retention', '7-day retention'], d: 'The share of users who come back after a period. Users active in period 2 ÷ users in period 1.', c: 'common-metrics' },
  { t: 'Churn', m: ['churn', 'churn rate'], d: 'The share of users or customers who stop using or paying in a period. The opposite of retention.', c: 'common-metrics' },
  { t: 'Engagement', m: ['engagement'], d: 'How much and how deeply people use the product: sessions per user, actions per session. Vague on its own, so name the exact measure.', c: 'heart' },
  { t: 'Adoption', m: ['adoption'], d: 'How many users start using a product or a new feature.', c: 'heart' },
  { t: 'Conversion', m: ['conversion', 'conversion rate', 'trial conversion'], d: 'The share of users who move to the next step, such as search to booking or free trial to paid.', c: 'common-metrics' },
  { t: 'Cohort', m: ['cohort', 'cohorts'], d: 'A group of users who started in the same period, such as everyone who signed up in January. Used to compare retention fairly.' },
  { t: 'DAU', full: 'Daily active users', m: ['DAU', 'daily active users'], d: 'Unique users who used the product on a given day.', c: 'common-metrics' },
  { t: 'MAU', full: 'Monthly active users', m: ['MAU', 'monthly active users'], d: 'Unique users who used the product in a month.', c: 'common-metrics' },
  { t: 'Stickiness', m: ['stickiness', 'DAU/MAU', 'DAU ÷ MAU'], d: 'DAU ÷ MAU: how many monthly users show up on a typical day. Higher means more habitual use.', c: 'common-metrics' },
  { t: 'CAC', full: 'Customer acquisition cost', m: ['CAC'], d: 'Marketing and sales spend ÷ new customers acquired in that period.', c: 'common-metrics' },
  { t: 'LTV', full: 'Customer lifetime value', m: ['LTV', 'lifetime value', 'CLV'], d: 'The revenue a customer brings over their whole time with you. Roughly revenue per period ÷ churn rate. An LTV to CAC ratio above 3 is healthy.', c: 'common-metrics' },
  { t: 'Payback period', m: ['payback', 'payback period'], d: 'How long it takes for a customer\'s profit to cover what it cost to acquire them.' },
  { t: 'ARPU', full: 'Average revenue per user', m: ['ARPU'], d: 'Total revenue ÷ number of users in a period.', c: 'aarrr' },
  { t: 'AOV', full: 'Average order value', m: ['AOV'], d: 'Total order revenue ÷ number of orders.' },
  { t: 'GMV', full: 'Gross merchandise value', m: ['GMV'], d: 'The total value of everything sold on a marketplace before fees, returns and discounts. Not the same as revenue.' },
  { t: 'ARR', full: 'Annual recurring revenue', m: ['ARR'], d: 'Yearly value of subscription revenue. Common in SaaS.' },
  { t: 'MRR', full: 'Monthly recurring revenue', m: ['MRR'], d: 'Monthly value of subscription revenue.' },
  { t: 'NPS', full: 'Net promoter score', m: ['NPS'], d: 'Asks how likely users are to recommend you (0–10). % promoters (9–10) minus % detractors (0–6).', c: 'common-metrics' },
  { t: 'CSAT', full: 'Customer satisfaction score', m: ['CSAT'], d: 'The share of users who rate their experience as satisfied, usually right after an interaction.', c: 'heart' },
  { t: 'CTR', full: 'Click-through rate', m: ['CTR'], d: 'Clicks ÷ times something was shown.' },
  { t: 'ROI', full: 'Return on investment', m: ['ROI'], d: 'What you get back relative to what you put in.' },
  { t: 'Bounce rate', m: ['bounce rate'], d: 'The share of users who view one page and leave.', c: 'common-metrics' },
  { t: 'Counter metric', m: ['counter metric', 'counter metrics'], d: 'The number that would get worse if you pushed your main metric the wrong way, such as opt-outs when you send more notifications.', c: 'counter' },
  { t: 'Guardrail metric', m: ['guardrail', 'guardrails', 'guardrail metric'], d: 'A counter metric with a limit: cross it and you stop or roll back.', c: 'counter' },
  { t: 'Leading metric', m: ['leading metric', 'leading metrics', 'leading indicator'], d: 'A metric that moves early and predicts success, and that the team can act on, like items added to cart.', c: 'leading-lagging' },
  { t: 'Lagging metric', m: ['lagging metric', 'lagging metrics', 'lagging indicator'], d: 'A metric that confirms success after the fact and is slow to move, like revenue.', c: 'leading-lagging' },
  { t: 'Vanity metric', m: ['vanity metric', 'vanity metrics'], d: 'A number that looks good but doesn\'t guide decisions, like total sign-ups since launch.', c: 'leading-lagging' },
  { t: 'Metric tree', m: ['metric tree'], d: 'A breakdown from the north star down to the smaller drivers teams can actually move.', c: 'leading-lagging' },
  { t: 'Mix shift', m: ['mix shift'], d: 'An overall metric moves because the mix of users changed, even though each segment is flat or improving.', c: 'segmentation' },
  { t: 'A/B test', m: ['A/B test', 'A/B testing', 'A/B tests'], d: 'Show a control and a variant to comparable users and compare one metric, to let data decide.', c: 'ab' },
  { t: 'Hypothesis', m: ['hypothesis', 'hypotheses'], d: 'A testable guess: the change, the metric it should move, by how much and why.', c: 'ab' },

  // ---------- Case approaches ----------
  { t: 'RCA', full: 'Root cause analysis', m: ['RCA', 'root cause analysis'], d: 'Finding why a metric moved: rule out data issues, scope the drop, split internal from external causes, and narrow down.', c: 'rca-approach' },
  { t: '5 whys', m: ['5 whys', 'five whys'], d: 'Keep asking "why?" about a problem until you reach its underlying cause.', c: 'rca-approach' },
  { t: 'Seasonality', m: ['seasonality'], d: 'Regular ups and downs tied to the calendar, like festivals, exams or weekends. Rule it out before blaming the product.', c: 'rca-approach' },
  { t: 'GTM', full: 'Go-to-market', m: ['GTM', 'go-to-market'], d: 'The plan for launching a product: who it is for, the value proposition, pricing, channels and launch phases.', c: 'gtm-approach' },
  { t: 'Product-led growth', m: ['product-led'], d: 'The product itself acquires and converts users, for example through a free tier or sharing.', c: 'gtm-approach' },
  { t: 'Sales-led', m: ['sales-led'], d: 'Sales and marketing teams find and convert customers. Common for large B2B deals.', c: 'gtm-approach' },
  { t: 'Value-based pricing', m: ['value-based pricing', 'value-based'], d: 'Pricing on what the product is worth to the customer compared with their next best option.', c: 'pricing-approach' },
  { t: 'Cost-plus pricing', m: ['cost-plus'], d: 'Cost plus a margin. The price floor, not the goal.', c: 'pricing-approach' },
  { t: 'Decoy pricing', m: ['decoy pricing', 'decoy'], d: 'Adding an option mainly to make another option look like better value.', c: 'pricing-approach' },
  { t: 'Usage-based pricing', m: ['usage-based pricing', 'usage-based'], d: 'Customers pay for what they use, such as per message or per GB.', c: 'pricing-approach' },
  { t: 'Guesstimate', m: ['guesstimate', 'guesstimates'], d: 'Estimating a number live from logic and stated assumptions, such as monthly cab rides in a city.', c: 'guesstimate-approach' },
  { t: 'Top-down', m: ['top-down'], d: 'Estimating from a big total (population) and narrowing down with percentages.', c: 'guesstimate-approach' },
  { t: 'Bottom-up', m: ['bottom-up'], d: 'Estimating from one unit (one store, one user) and scaling up.', c: 'guesstimate-approach' },
  { t: 'TAM', full: 'Total addressable market', m: ['TAM'], d: 'The total demand for a product if it won every possible customer.', c: 'market-entry' },
  { t: 'Market entry', m: ['market entry'], d: 'Deciding whether and how to enter a new market: build, partner, joint venture or acquire.', c: 'market-entry' },
  { t: 'Moonshot', m: ['moonshot', 'moonshots'], d: 'A case about a huge problem with no budget limit. Tests vision, empathy and ambition vs feasibility.', c: 'moonshot' },
  { t: 'First principles', m: ['first principles', 'first-principles'], d: 'Reasoning from the basic facts of a problem instead of copying what already exists.', c: 'moonshot' },
  { t: 'PESTEL', m: ['PESTEL'], d: 'A scan of external factors: political, economic, social, technological, environmental, legal.' },
  { t: 'Working backwards', m: ['working backwards'], d: 'Write the launch press release before building, to check the customer value is clear.', c: 'company-frameworks' },
  { t: 'Product sense', m: ['product sense'], d: 'Judgement about what makes a product good for its users and business. Tested through design, improvement and critique questions.' },

  // ---------- AI ----------
  { t: 'LLM', full: 'Large language model', m: ['LLM', 'LLMs'], d: 'An AI model trained on huge amounts of text that can write, summarise and answer questions. It only knows its training data, up to a cut-off.', c: 'genai' },
  { t: 'Generative AI', m: ['generative AI', 'GenAI'], d: 'AI that creates new text, images or code by learning patterns from large datasets.', c: 'genai' },
  { t: 'Hallucination', m: ['hallucination', 'hallucinations', 'hallucination rate'], d: 'When an AI model states something false with confidence.', c: 'guardrails' },
  { t: 'RAG', full: 'Retrieval-augmented generation', m: ['RAG'], d: 'Fetch relevant private or fresh documents and give them to the model along with the question, so it answers from them.', c: 'rag' },
  { t: 'Embedding', m: ['embedding', 'embeddings'], d: 'Text turned into a list of numbers that captures its meaning, so similar ideas sit close together.', c: 'rag' },
  { t: 'Vector database', m: ['vector database'], d: 'A database that stores embeddings and quickly finds the ones closest in meaning to a query.', c: 'rag' },
  { t: 'MCP', full: 'Model Context Protocol', m: ['MCP'], d: 'An open standard for connecting AI apps to data and tools, like a universal plug.', c: 'mcp' },
  { t: 'Agentic AI', m: ['agentic AI', 'AI agent', 'AI agents', 'agentic'], d: 'AI that works towards a goal on its own: plans, uses tools and adapts with little human input.', c: 'agents' },
  { t: 'Evals', m: ['evals', 'eval set'], d: 'Tests for an AI system: give it inputs, grade the outputs, measure how often it succeeds.', c: 'evals' },
  { t: 'Precision', m: ['precision'], d: 'Of everything the model flagged, how much was actually right.', c: 'precision-recall' },
  { t: 'Recall', m: ['recall'], d: 'Of everything that was actually there to catch, how much the model caught.', c: 'precision-recall' },
  { t: 'Human in the loop', m: ['human in the loop', 'human-in-the-loop'], d: 'A person reviews or approves the AI\'s output at key steps.', c: 'guardrails' },
  { t: 'Automation bias', m: ['automation bias'], d: 'People stop checking a system that is usually right, so its rare mistakes slip through.', c: 'guardrails' },
  { t: 'Latency', m: ['latency'], d: 'How long a user waits for a response.', c: 'cost-per-task' },
  { t: 'Inference', m: ['inference', 'inference cost'], d: 'Running a trained model to get an answer. Each run costs compute, so AI has a cost on every use.', c: 'cost-per-task' },
  { t: 'Prompt engineering', m: ['prompt engineering', 'system prompt', 'system prompts'], d: 'Designing the instructions given to a model to get reliable, well-formatted output.', c: 'prompting' },
  { t: 'Prompt injection', m: ['prompt injection'], d: 'Text that tries to trick a model into ignoring its instructions.', c: 'prompting' },
  { t: 'Few-shot', m: ['few-shot', 'zero-shot'], d: 'Zero-shot gives the model no examples; few-shot includes 2–5 examples of what you want.', c: 'prompting' },
  { t: 'Chain of thought', m: ['chain of thought'], d: 'Asking the model to reason step by step before answering.', c: 'prompting' },
  { t: 'Fine-tuning', m: ['fine-tuning', 'pre-training'], d: 'Pre-training teaches a model general patterns from huge data; fine-tuning trains it further on a narrower dataset for a specific job.', c: 'genai' },
  { t: 'Vibe coding', m: ['vibe coding'], d: 'Building a working prototype by describing it to an AI coding tool rather than writing code by hand.', c: 'no-code' },

  // ---------- Tech ----------
  { t: 'API', full: 'Application programming interface', m: ['API', 'APIs'], d: 'The contract that lets two pieces of software talk through requests and responses, like a waiter between you and the kitchen.', c: 'apis' },
  { t: 'REST', m: ['REST'], d: 'A common, stateless style of API that works over HTTP.', c: 'apis' },
  { t: 'Webhook', m: ['webhook', 'webhooks'], d: 'A system automatically calls your URL when something happens, instead of you asking repeatedly.', c: 'apis' },
  { t: 'SDLC', full: 'Software development life cycle', m: ['SDLC'], d: 'How software gets built: requirements, design, build, test, deploy, maintain.', c: 'sdlc' },
  { t: 'Agile', m: ['agile'], d: 'Building in small increments with frequent feedback, instead of one long plan (waterfall).', c: 'sdlc' },
  { t: 'Scrum', m: ['scrum', 'sprint', 'sprints'], d: 'An agile method with short sprints (usually 1–2 weeks), a product owner, a scrum master and daily stand-ups.', c: 'sdlc' },
  { t: 'Cloud', m: ['cloud computing'], d: 'Servers, storage and software rented over the internet and paid for as you use them.', c: 'cloud' },
  { t: 'No-code', m: ['no-code', 'low-code'], d: 'Building apps and workflows with visual tools instead of writing much code.', c: 'no-code' },
  { t: 'SSO', full: 'Single sign-on', m: ['SSO'], d: 'Log in once with a company account to access many tools. Enterprise buyers usually expect it.', c: 'security' },
  { t: 'SOC2', m: ['SOC2', 'SOC 2'], d: 'A security audit report. Many enterprise customers ask for it before buying software.', c: 'security' },
  { t: 'CIA triad', m: ['CIA triad'], d: 'Three goals of security: confidentiality, integrity, availability.', c: 'security' },
  { t: 'SLA', full: 'Service level agreement', m: ['SLA', 'SLAs'], d: 'A promised standard, such as 99.9% uptime or food ready in 15 minutes.' },
  { t: 'QA', full: 'Quality assurance', m: ['QA'], d: 'Testing that a product works as intended before and after release.' },
  { t: 'Hotfix', m: ['hotfix', 'rollback'], d: 'A hotfix is a quick fix pushed to live users; a rollback returns to the previous working version.', c: 'rca-approach' },
  { t: 'Uptime', m: ['uptime'], d: 'The share of time a service is working and available.' },

  // ---------- Sector terms ----------
  { t: 'SKU', full: 'Stock keeping unit', m: ['SKU', 'SKUs'], d: 'One distinct product variant a store stocks. A 500 ml and a 1 L bottle of the same milk are two SKUs.' },
  { t: 'Dark store', m: ['dark store', 'dark stores'], d: 'A small warehouse close to customers, used only for fast delivery orders and closed to walk-in shoppers.' },
  { t: 'Fill rate', m: ['fill rate'], d: 'The share of ordered items that were in stock and delivered.' },
  { t: 'ETA', full: 'Estimated time of arrival', m: ['ETA', 'ETAs'], d: 'The delivery or arrival time promised to the user.' },
  { t: 'Cart abandonment', m: ['cart abandonment'], d: 'The share of users who add items to a cart but leave without paying.' },
  { t: 'KYC', full: 'Know your customer', m: ['KYC'], d: 'Identity checks that financial products must legally run before letting someone transact.' },
  { t: 'UPI', full: 'Unified Payments Interface', m: ['UPI'], d: 'India\'s real-time system for bank-to-bank payments through apps.' },
  { t: 'BNPL', full: 'Buy now, pay later', m: ['BNPL'], d: 'Short-term credit at checkout, repaid later or in instalments.' },
  { t: 'Chargeback', m: ['chargeback', 'chargebacks'], d: 'A payment reversed by the bank after a customer disputes it.' },
  { t: 'Authorisation rate', m: ['authorisation rate'], d: 'The share of payment attempts that get approved.' },
  { t: 'OTT', full: 'Over the top', m: ['OTT'], d: 'Video or audio streamed straight over the internet, bypassing cable or satellite.' },
  { t: 'SVOD, AVOD, TVOD', m: ['SVOD', 'AVOD', 'TVOD'], d: 'Streaming revenue models: subscription (SVOD), ad-supported and free to watch (AVOD), pay per title (TVOD).' },
  { t: 'Private label', m: ['private label', 'private-label'], d: 'Products sold under a retailer\'s own brand, usually at higher margins.' },
  { t: 'Return on ad spend', m: ['return on ad spend', 'ROAS'], d: 'Revenue earned for every rupee spent on ads.' },
  { t: 'CRM', full: 'Customer relationship management', m: ['CRM'], d: 'Software to track customers, deals and conversations.' },
  { t: 'Cold chain', m: ['cold chain', 'cold-chain'], d: 'Keeping perishables refrigerated from the warehouse to the doorstep.' },

  // ---------- Behavioural ----------
  { t: 'STAR', m: ['STAR'], d: 'Structure for "tell me about a time" answers: situation, task, action, result. Add a reflection at the end.', c: 'star' },
  { t: 'SOAR', m: ['SOAR'], d: 'Situation, obstacles, actions, result. Use it when the story is about overcoming several obstacles.', c: 'star' },
  { t: 'CAR', m: ['CAR'], d: 'Challenge, action, result. A shorter version of STAR.', c: 'star' },
]

// ---------- matching ----------
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
const isCaps = (s) => s === s.toUpperCase() && /[A-Z]/.test(s)

const ALIASES = []
GLOSSARY.forEach((g, i) => {
  g.id = 'g' + i
  g.m.forEach((a) => ALIASES.push({ a, i, caps: isCaps(a) }))
})
ALIASES.sort((x, y) => y.a.length - x.a.length)
const BY_LOWER = new Map()
ALIASES.forEach((x) => { const k = x.a.toLowerCase(); if (!BY_LOWER.has(k)) BY_LOWER.set(k, []); BY_LOWER.get(k).push(x) })

export const TERM_RE = new RegExp('(?<![\\w-])(' + ALIASES.map((x) => escape(x.a)).join('|') + ')(?![\\w-])', 'gi')

// Returns the glossary entry for a matched piece of text, respecting case for acronyms.
export function lookup(text) {
  const opts = BY_LOWER.get(text.toLowerCase()) || []
  const hit = opts.find((x) => (x.caps ? x.a === text : true))
  return hit ? GLOSSARY[hit.i] : null
}

// Split a string into plain text and glossary terms.
// seen: a Set shared across calls so each term is linked once per block.
// skip: the title of the concept being read; a term named in that title is not linked.
export function tokenize(text, seen = new Set(), skip) {
  if (!text) return []
  const out = []
  let last = 0
  TERM_RE.lastIndex = 0
  let m
  while ((m = TERM_RE.exec(text))) {
    const g = lookup(m[1])
    if (!g || seen.has(g.id) || (skip && skip.toLowerCase().includes(m[1].toLowerCase()))) continue
    seen.add(g.id)
    if (m.index > last) out.push(text.slice(last, m.index))
    out.push({ g, text: m[1] })
    last = m.index + m[1].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}
