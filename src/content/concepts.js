// Concept library. Each concept has a short summary, key points, an optional example and flashcards.
export const CONCEPT_GROUPS = [
  { id: 'basics', label: 'PM basics' },
  { id: 'design', label: 'Design and users' },
  { id: 'prioritise', label: 'Prioritisation' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'cases', label: 'Case approaches' },
  { id: 'ai', label: 'AI for PMs' },
  { id: 'tech', label: 'Tech basics' },
  { id: 'people', label: 'Behavioural' },
]

export const CONCEPTS = [
  // ---------- PM basics ----------
  {
    id: 'what-pm', group: 'basics', title: 'What a PM actually does',
    summary: 'A PM sits where business, technology and user experience meet, and is accountable for what gets built and why.',
    points: [
      'Uncover stated and unstated user needs, then own how the problem gets solved.',
      'Constantly weigh ideas on impact, effort, feasibility and business value.',
      'Adapt the message for executives, engineers, designers and marketers.',
      'Rarely manages people directly: the job is getting teams aligned without formal authority.',
      'Interviewers look for three things: product thinking, people skills and learning fast.',
    ],
    cards: [
      ['What three things do interviewers evaluate in PM candidates?', 'Product thinking, people skills and the ability to learn fast.'],
      ['Does a PM usually have direct reports early on?', 'Rarely. The skill is getting engineering, design, data and business to agree on what to build without owning the room.'],
    ],
  },
  {
    id: 'plc', group: 'basics', title: 'Product life cycle',
    summary: 'Products move through introduction, growth, maturity and decline. Each stage needs a different strategy and different metrics.',
    points: [
      'Introduction: find early adopters and validate the core idea.',
      'Growth: product-market fit is found, so scale fast and build a defensible position.',
      'Maturity: growth slows, so optimise, retain and fend off competitors.',
      'Decline: protect profitability, cut costs, or sunset the product.',
      'In RCA and strategy answers, say which stage the product is in. It changes what you look at first.',
    ],
    example: 'A short-video feature that launched with heavy promotion is later in maturity, where the focus shifts to refining the experience and ad monetisation.',
    cards: [
      ['Name the four stages of the product life cycle.', 'Introduction, growth, maturity, decline.'],
      ['What is the focus in the maturity stage?', 'Optimisation and retention: defend against competitors and get more value from existing users.'],
    ],
  },
  {
    id: 'mvp', group: 'basics', title: 'MVP',
    summary: 'The version of a new product that gives you the most validated learning with the least effort. Not a buggy half-product.',
    points: [
      'Prevents overbuilding and wasted resources.',
      'Tests assumptions early so you can pivot quickly.',
      'Gives real-world feedback to shape the next iterations.',
    ],
    example: 'Instead of a full AI resume review platform, launch "upload a PDF, get an instant score" and see whether job seekers care.',
    cards: [['What is an MVP really for?', 'Maximum validated learning about customers with the least effort.']],
  },
  {
    id: 'prd', group: 'basics', title: 'PRD',
    summary: 'A product requirements document tells every team what will be built, for whom and why, and how success is measured.',
    points: [
      'Problem statement backed by research.',
      'Goals, personas and user stories.',
      'Features in and out of scope, with priorities.',
      'Functional and non-functional requirements, wireframes.',
      'Success metrics, including the north star.',
    ],
    cards: [['Name four sections of a PRD.', 'Problem statement, goals, personas and user stories, scope, requirements, wireframes, success metrics (any four).']],
  },
  {
    id: 'business-models', group: 'basics', title: 'Business and monetisation models',
    summary: 'Know how products make money: it comes up in design, pricing and strategy questions.',
    points: [
      'Freemium: essentials free, delight features paid.',
      'Advertising: keep ads relevant so they don\'t hurt the experience.',
      'Subscription: justify a monthly price against competitors.',
      'Bundling, in-app purchases, one-time pricing.',
      'Razor and blade: cheap hardware or platform, paid add-ons (like game consoles).',
      'Marketplaces earn a take rate on transactions; SaaS earns recurring revenue.',
    ],
    cards: [
      ['What is the razor and blade model?', 'Sell the hardware or platform cheaply and charge more for the add-ons or software.'],
      ['What is the main risk of freemium?', 'If the free tier is too generous it cannibalises the paid tier; too stingy and nobody joins.'],
    ],
  },
  {
    id: 'platforms', group: 'basics', title: 'Network effects and platforms',
    summary: 'A network effect exists when each user gets more value as more users join. Marketplaces must balance both sides.',
    points: [
      'Two-sided platforms (riders and drivers, buyers and sellers) grow by balancing supply and demand.',
      'Reducing friction on one side, like making listings easier, can grow the whole marketplace.',
      'Growth vs monetisation trade-offs are common in marketplace questions.',
    ],
    cards: [['What is a network effect?', 'When a user\'s value from the product rises as more users join.']],
  },

  // ---------- Design and users ----------
  {
    id: 'circles', group: 'design', title: 'CIRCLES',
    summary: 'A checklist for product design answers: Comprehend, Identify, Report, Cut, List, Evaluate, Summarise.',
    points: [
      'Comprehend the situation: what, who, why, how.',
      'Identify the customer: a few personas, then choose one.',
      'Report needs as user stories: As a [user], I want [goal] so that [benefit].',
      'Cut through prioritisation: pick 1–2 needs by depth and breadth.',
      'List solutions, evaluate trade-offs, summarise the recommendation.',
      'Use it to structure your thinking. Don\'t name it or read it out in the interview.',
    ],
    cards: [
      ['What does CIRCLES stand for?', 'Comprehend, Identify customer, Report needs, Cut through prioritisation, List solutions, Evaluate trade-offs, Summarise.'],
      ['Should you say "I will use CIRCLES" in the interview?', 'No. Use the structure without naming the framework.'],
    ],
  },
  {
    id: 'personas', group: 'design', title: 'Personas and segmentation',
    summary: 'Research-backed profiles of target users. They anchor design choices in real needs rather than internal opinion.',
    points: [
      'Segment on demographics, behaviour (how often, when) and motivation.',
      'Aim for 3–4 personas, name them, then choose one to focus on.',
      'Choose based on segment size and how unmet the need is.',
      'Once you choose a segment, don\'t drift. Pain points and solutions must stay with that persona.',
    ],
    example: '"Ravi, 28, urban professional, tracks expenses on his phone and hates manual entry" points you towards bank sync over advanced charts.',
    cards: [['How should you choose which persona to focus on?', 'By the size of the segment and how badly their need is unmet.']],
  },
  {
    id: 'jtbd', group: 'design', title: 'Jobs to be done',
    summary: 'People "hire" a product to make progress in a specific situation. It explains why someone seeks a solution, not just who they are.',
    points: [
      'Job statement: When [situation], I want to [make progress], so I can [outcome].',
      'Jobs have functional, emotional and social sides.',
      'Four forces decide a switch: push (dissatisfaction), pull (better outcome), anxiety (fear of switching), habit (comfort with today).',
      'Competitors include workarounds and doing nothing, not just similar apps.',
    ],
    example: 'A student finishing class after the canteen closes might hire a delivery app, instant noodles or a friend. All three compete for the same job.',
    cards: [
      ['What are the four forces in a switch?', 'Push and pull move people towards you; anxiety and habit hold them back.'],
      ['Personas vs JTBD?', 'Personas explain who the customer is. JTBD explains why they seek a solution in a specific situation.'],
    ],
  },
  {
    id: 'journey', group: 'design', title: 'User journeys and the 5Es',
    summary: 'Map what the user does step by step to find where things break. Most design and RCA answers improve with a journey.',
    points: [
      'Entice: what triggers the user to start?',
      'Enter: the first few steps.',
      'Engage: the core task.',
      'Exit: how the task finishes.',
      'Extend: what happens afterwards.',
      'Write the journey as it happens without your solution, and note emotions and friction at each step.',
    ],
    cards: [['What are the 5Es of a user journey?', 'Entice, Enter, Engage, Exit, Extend.']],
  },
  {
    id: 'user-stories', group: 'design', title: 'User stories',
    summary: 'Short statements of a need from the user\'s view: As a [user], I want [goal] so that [benefit].',
    points: ['Keep requirements user-focused.', 'Give engineers the purpose behind a feature.', 'Slice work into smaller deliverable pieces.'],
    cards: [['Complete the template: As a …', 'As a [user type], I want [goal] so that [benefit].']],
  },
  {
    id: 'hook', group: 'design', title: 'Hook model',
    summary: 'A loop for habit-forming products: trigger, action, variable reward, investment.',
    points: [
      'Trigger: an external cue (notification) or internal one (boredom).',
      'Action: the simplest thing a user can do expecting a reward.',
      'Variable reward: satisfying but unpredictable.',
      'Investment: small effort that loads the next trigger (a playlist, a follow).',
    ],
    example: 'A language app: daily reminder (trigger), finish a lesson (action), streak animation (reward), progress in a skill tree (investment).',
    cards: [['Name the four steps of the Hook model.', 'Trigger, action, variable reward, investment.']],
  },
  {
    id: 'app-critique', group: 'design', title: 'App critique lenses',
    summary: 'Five lenses to critique an app with substance instead of listing what you like.',
    points: [
      'Jobs to be done: what is the user trying to accomplish?',
      'Personas: goals, motivation, attitudes, behaviour.',
      'Familiarity: new, regular and expert users need different things.',
      'Inclusivity: vision, hearing, motor, cognitive, low bandwidth and low-end phones.',
      'Zoom in and out: aesthetic (how it looks), functional (how it works), strategic (why it exists).',
      'Avoid: getting stuck on visuals, all praise, or narrating the UI.',
    ],
    cards: [['Name the three layers when zooming in and out of an app.', 'Aesthetic (how it looks), functional (how it works), strategic (why it exists).']],
  },
  {
    id: 'design-thinking', group: 'design', title: 'Design thinking',
    summary: 'A human-centred, iterative way to solve problems: empathise, define, ideate, prototype, test.',
    points: ['Empathise without assumptions.', 'Define a clear problem statement.', 'Ideate widely, then narrow.', 'Prototype cheaply.', 'Test with users. Results often send you back a step.'],
    cards: [['What are the five steps of design thinking?', 'Empathise, define, ideate, prototype, test.']],
  },

  // ---------- Prioritisation ----------
  {
    id: 'rice', group: 'prioritise', title: 'RICE',
    summary: 'Score = (Reach × Impact × Confidence) ÷ Effort. A structured way to compare ideas and reduce "loudest voice" bias.',
    points: [
      'Reach: users affected in a period, for example 5,000 a month.',
      'Impact: 3 massive, 2 high, 1 medium, 0.5 low.',
      'Confidence: 100% high, 80% medium, 50% low.',
      'Effort: person-months across product, design and engineering.',
      'Works best when comparing ideas within the same product. It breaks down across very different kinds of bets.',
    ],
    cards: [
      ['What is the RICE formula?', '(Reach × Impact × Confidence) ÷ Effort.'],
      ['Reach vs impact?', 'Reach is how many people a feature affects; impact is how much it affects each of them.'],
      ['When does RICE break down?', 'When comparing fundamentally different kinds of bets.'],
    ],
  },
  {
    id: 'ice', group: 'prioritise', title: 'ICE',
    summary: 'Impact × Confidence × Ease, each scored 1–10. Fast when you don\'t have reach data.',
    points: ['Good for quick backlog grooming.', 'Can bias you towards features that help a small group a lot.'],
    example: 'Dark mode (8, 9, 7 → 504) beats custom themes (5, 7, 5 → 175).',
    cards: [['What does ICE leave out compared with RICE?', 'Reach.']],
  },
  {
    id: 'value-effort', group: 'prioritise', title: 'Value vs effort',
    summary: 'A 2×2: high value and low effort are quick wins; high value and high effort are major projects; low value and low effort are fill-ins; low value and high effort you avoid.',
    points: ['Value can be user, business or strategic.', 'Effort includes build time, cost and risk.', 'Break major projects into phases.'],
    cards: [['What do you do with low value, high effort ideas?', 'Avoid them.']],
  },
  {
    id: 'kano', group: 'prioritise', title: 'Kano model',
    summary: 'Classifies features by how they affect satisfaction: must-haves, performance features, delighters and indifferent ones.',
    points: [
      'Must-haves: absence angers users, presence doesn\'t delight.',
      'Performance: satisfaction grows as quality grows.',
      'Delighters: unexpected, create fans, absence isn\'t noticed.',
      'Today\'s delighters become tomorrow\'s must-haves.',
    ],
    example: 'Hotel booking app: accurate availability is a must-have, better filters are performance, a free late checkout for loyal guests is a delighter.',
    cards: [['Name the Kano categories.', 'Must-have, performance, delighter, indifferent.']],
  },
  {
    id: 'moscow', group: 'prioritise', title: 'MoSCoW',
    summary: 'Must have, Should have, Could have, Won\'t have (this time). Best for scoping a release or MVP.',
    points: ['Must: the release fails without it.', 'Should: important but the release still works.', 'Could: only if time allows.', 'Won\'t: explicitly out of scope for now.'],
    cards: [['What is MoSCoW best used for?', 'Deciding what goes into a specific release or MVP.']],
  },

  // ---------- Metrics ----------
  {
    id: 'north-star', group: 'metrics', title: 'North star metric',
    summary: 'One metric that captures the core value you deliver to users and guides every team.',
    points: [
      'It measures value to the customer, not value to the company.',
      'It reflects the product strategy.',
      'It leads revenue. If it rises and revenue stays flat, rethink it.',
      'It can\'t be easily gamed by short-term marketing (no vanity metrics).',
    ],
    example: 'Nights booked (Airbnb), time spent listening (Spotify), rides completed (Uber), learners completing at least one lesson a day (language app).',
    cards: [
      ['Name the tests of a good north star.', 'Reflects customer value, matches strategy, leads revenue, not a vanity metric.'],
      ['Why is "daily active users" alone risky as a north star?', 'It can be a vanity metric. Adding a qualifier like "who complete a lesson" measures real value.'],
    ],
  },
  {
    id: 'aarrr', group: 'metrics', title: 'AARRR (pirate metrics)',
    summary: 'A funnel for growth: acquisition, activation, retention, referral, revenue.',
    points: [
      'Acquisition: how users find you (installs, sign-ups).',
      'Activation: the first "aha" moment (first order, first message).',
      'Retention: are they coming back (churn, frequency)?',
      'Referral: do they tell others (invites, viral coefficient)?',
      'Revenue: ARPU, lifetime value, order value.',
      'Great for spotting where the funnel leaks.',
    ],
    cards: [['What does AARRR stand for?', 'Acquisition, activation, retention, referral, revenue.']],
  },
  {
    id: 'heart', group: 'metrics', title: 'HEART',
    summary: 'A user-experience measurement framework: happiness, engagement, adoption, retention, task success. For each, set goals, signals and metrics.',
    points: [
      'Happiness: NPS, CSAT, ratings.',
      'Engagement: sessions per user, actions per session.',
      'Adoption: new users, share using a new feature in its first week.',
      'Retention: returning users, churn.',
      'Task success: time to complete, success rate.',
      'You don\'t need all five every time.',
    ],
    cards: [['What does HEART stand for?', 'Happiness, engagement, adoption, retention, task success.']],
  },
  {
    id: 'counter', group: 'metrics', title: 'Counter metrics and guardrails',
    summary: 'The number that would get worse if you pushed your main metric the wrong way. A guardrail is a counter metric with a limit and a consequence.',
    points: [
      'Ask: how could someone move my metric without helping the user?',
      'Time in app → watch task completion. Notifications sent → watch opt-outs and uninstalls.',
      'Orders per user → watch contribution margin. Tickets closed → watch reopen rate.',
      'Agree the guardrail threshold before results arrive.',
      'Naming your own counter metric is one of the fastest ways to sound senior.',
    ],
    cards: [
      ['Counter metric vs guardrail?', 'A guardrail is a counter metric with a threshold: cross it and you stop or roll back.'],
      ['Counter metric for "notifications sent"?', 'Opt-out rate or uninstall rate.'],
    ],
  },
  {
    id: 'leading-lagging', group: 'metrics', title: 'Leading, lagging and vanity metrics',
    summary: 'Lagging metrics confirm success but are hard to move. Leading metrics predict it and are actionable. Vanity metrics look good but change nothing.',
    points: ['Build a metric tree from the north star down to actionable drivers.', 'Revenue and retention are lagging; items added to cart are leading.', 'Total sign-ups since launch is a classic vanity metric.'],
    cards: [['Give an example of a vanity metric.', 'Total sign-ups since launch.']],
  },
  {
    id: 'common-metrics', group: 'metrics', title: 'Common product metrics',
    summary: 'Definitions worth having at your fingertips.',
    points: [
      'Stickiness = DAU ÷ MAU.',
      'Retention = users active in period 2 ÷ users in period 1. Churn is its inverse.',
      'CAC = marketing spend ÷ customers acquired in the period.',
      'Customer lifetime value ≈ revenue per user in a period ÷ churn rate.',
      'NPS = % promoters − % detractors.',
      'Trial conversion = paying customers ÷ trial users.',
      'Bounce rate = share of users who view one page and leave.',
    ],
    cards: [
      ['How is stickiness calculated?', 'DAU ÷ MAU.'],
      ['How is NPS calculated?', 'Percentage of promoters minus percentage of detractors.'],
      ['Healthy LTV to CAC ratio?', 'Above 3.'],
    ],
  },
  {
    id: 'segmentation', group: 'metrics', title: 'Cutting data by segment',
    summary: 'An average hides groups moving in opposite directions. Cut the data before you hypothesise.',
    points: [
      'Cut by lifecycle, tenure, platform, geography, behaviour, acquisition source and version.',
      'A drop concentrated in one segment points to a local cause; spread evenly points to something systemic.',
      'Watch for mix shift: a metric can fall overall while rising in every segment.',
      'For AI features, cut by model version. It is the dimension most teams forget.',
    ],
    example: 'DAU down 8%: iOS −1%, Android −15%. Cut Android by app version and one release shows a collapse. The fix is a rollback, not a redesign.',
    cards: [['What is mix shift?', 'The overall metric changes because the mix of users changed, even if every segment is flat or improving.']],
  },
  {
    id: 'ab', group: 'metrics', title: 'A/B testing',
    summary: 'Compare a control and a variant on one metric to let data decide. Change one variable at a time.',
    points: [
      'Write a sharp hypothesis: the change, the metric, the expected lift and why.',
      'Pick one primary metric and a counter metric.',
      'Run long enough on enough users to be statistically confident.',
      'Outcomes: ship, scrap and document, or dig into an unexpected result.',
    ],
    cards: [['What makes a strong A/B hypothesis?', 'It names the change, the metric, the expected impact and the reason.']],
  },
  {
    id: 'okr', group: 'metrics', title: 'OKRs, KPIs and metrics',
    summary: 'Objectives set direction, KPIs are the critical dials, metrics are everything you can measure.',
    points: ['Objective: the destination.', 'Key results: how you know you got there.', 'KPIs: the few numbers you watch closely.', 'Metrics: the wider context.'],
    cards: [['KPI vs metric?', 'KPIs are the few critical measures of success; metrics are all measurable data points.']],
  },

  // ---------- Case approaches ----------
  {
    id: 'rca-approach', group: 'cases', title: 'Root cause analysis',
    summary: 'Metric movement = internal drivers + external drivers. Narrow down step by step.',
    points: [
      'Define the metric and check for definition or tracking changes.',
      'Scope: since when, how much, sudden or gradual, which segment.',
      'Separate internal (product, journey, tech, business) from external (competition, seasonality, macro, user shifts).',
      'Walk the funnel to find the drop-off step.',
      'Rank hypotheses by likely impact × ease of validating.',
      'Internal and fixable: hotfix. External: escalate and align.',
      'Tools: 5 whys, fishbone diagram, fault tree.',
    ],
    cards: [
      ['A sudden drop most often points to…', 'A new release, bug, outage or server problem.'],
      ['What should you rule out first in RCA?', 'Data and tracking issues.'],
    ],
  },
  {
    id: 'gtm-approach', group: 'cases', title: 'Go-to-market',
    summary: 'Define the what, why, who and how of a launch, then measure it.',
    points: [
      'What: product, portfolio fit, market landscape.',
      'Why: company expectations from the launch.',
      'Who: segments, pain points, market gaps.',
      'How: value proposition, pricing, marketing funnel, channels, launch phases.',
      'Motions: product-led (the product sells itself) or sales-led (sales teams convert prospects).',
      'Also: inbound content, demand generation buzz.',
    ],
    cards: [['Product-led vs sales-led GTM?', 'Product-led uses the product to acquire and retain users; sales-led uses marketing and sales teams to convert prospects.']],
  },
  {
    id: 'pricing-approach', group: 'cases', title: 'Pricing',
    summary: 'Move up the ladder: cost-plus is the floor, competitor-based is table stakes, value-based is the goal.',
    points: [
      'Start with the business goal: share or profit.',
      'Know the market stage and your cost advantage.',
      'Value: what is the next best alternative and what is our difference worth?',
      'Tactics: freemium, tiers (and decoy pricing), usage-based, per-user, market skimming.',
      'Always model churn from a price increase, not just the revenue gain.',
    ],
    cards: [
      ['What is the pricing ladder?', 'Cost-plus (floor), competitor-based (table stakes), value-based (the goal).'],
      ['What is decoy pricing?', 'Adding an option mainly to make another option look more attractive.'],
    ],
  },
  {
    id: 'guesstimate-approach', group: 'cases', title: 'Guesstimates',
    summary: 'Clarify, choose an approach, state assumptions, calculate with round numbers, sanity-check.',
    points: [
      'Approaches: top-down, bottom-up, supply side, demand side.',
      'Validate the approach with the interviewer before calculating.',
      'Split into segments: age, city, income, usage.',
      'In PM interviews, estimates are grounded in user behaviour, not just population maths.',
      'Check intermediate numbers as well as the final one.',
    ],
    cards: [['Why agree your approach before calculating?', 'So the interviewer can redirect you before you solve the wrong problem.']],
  },
  {
    id: 'market-entry', group: 'cases', title: 'Market entry',
    summary: 'Should we enter, and how?',
    points: [
      'Company: goals, core capabilities, where we excel.',
      'Industry: size, share, growth, competitive forces.',
      'Feasibility: operations, finances, distribution, regulations.',
      'Customers: who, overlap with competitors, value offered.',
      'Risks: legal, market, operational.',
      'How: build from scratch, joint venture, partnership or acquisition.',
    ],
    cards: [['Four ways to enter a market?', 'Build from scratch, joint venture, partnership, acquisition.']],
  },
  {
    id: 'moonshot', group: 'cases', title: 'Moonshot cases',
    summary: 'Massive problems, no budget limit, long-term vision. Tests vision, empathy, first principles and ambition vs feasibility.',
    points: ['Vision, users, core problem, transform with tech, adoption, metrics.', 'Start small: prove you can help one person before scaling to everyone.', 'Avoid irrational tech justified only by "the future".'],
    cards: [['What does a moonshot case test?', 'Vision, user empathy, first-principles thinking, feasibility vs ambition, product strategy.']],
  },
  {
    id: 'system-design', group: 'cases', title: 'System design',
    summary: 'Occasionally asked: design the architecture behind a product at a high level.',
    points: ['Understand the problem and scope; write assumptions down.', 'Propose a high-level design and get buy-in.', 'Deep dive where the interviewer wants detail.', 'Wrap up with bottlenecks, edge cases and how it scales.'],
    cards: [['What are the four steps of a system design answer?', 'Scope, high-level design, deep dive, wrap up.']],
  },
  {
    id: 'company-frameworks', group: 'cases', title: 'Company frameworks',
    summary: 'Some companies have signature ways of building products. Useful when interviewing there.',
    points: [
      'Working backwards (Amazon): write the press release before building.',
      'Product excellence (Google): know your users, critical user journeys, focused utility, simple design, crafted execution. HEART for consumer products.',
      'Think it, build it, ship it, tweak it (Spotify): validate problems through experiments and ship in phases.',
    ],
    cards: [['What is working backwards?', 'Writing the launch press release before building, to test whether the customer value is clear.']],
  },
  {
    id: 'interview-habits', group: 'cases', title: 'Habits that beat frameworks',
    summary: 'Small moves that make answers feel natural and senior.',
    points: [
      'Ask for 30–60 seconds to think before starting.',
      'Know your previous company\'s product well.',
      'Have 2–3 favourite products you can discuss in depth.',
      'Know business models and the company\'s recent launches.',
      'Summarise after each major section.',
      'Prepare 2–3 questions to ask that you couldn\'t google in 30 seconds.',
      'Most cases should be answered in about 8–12 minutes.',
    ],
    cards: [['How long should most PM cases take?', 'About 8–12 minutes.']],
  },

  // ---------- AI for PMs ----------
  {
    id: 'genai', group: 'ai', title: 'Generative AI and LLMs',
    summary: 'Models that create new text, images or code by learning patterns from huge datasets. Most use the transformer architecture.',
    points: [
      'Trained in stages: pre-training, fine-tuning, then inference on prompts.',
      'Great for drafting, summarising, prototyping and research.',
      'Risks: hallucination, bias, privacy and plagiarism.',
      'LLMs are frozen at their training cut-off and don\'t remember past sessions on their own.',
    ],
    cards: [['Why can\'t an LLM answer questions about your company\'s private data by itself?', 'It only knows its training data, up to a cut-off, and has no access to private data unless the application provides it.']],
  },
  {
    id: 'rag', group: 'ai', title: 'RAG',
    summary: 'Retrieval-augmented generation fetches relevant private or fresh data and feeds it to the model with the question.',
    points: [
      'Ingest and clean documents, then split them into chunks.',
      'Turn chunks into embeddings (vectors of meaning) and store them in a vector database.',
      'Embed the user\'s question and find the nearest chunks.',
      'Add those chunks to the prompt and let the model answer from them.',
      'PM implications: data quality is everything, latency vs accuracy trade-off, and specialised evaluation (did we retrieve the right data, did we miss any, did the model invent anything).',
    ],
    cards: [
      ['What does an embedding capture?', 'The meaning of a piece of text as numbers, so similar ideas sit close together.'],
      ['Name three things to evaluate in a RAG system.', 'Context precision, context recall and faithfulness.'],
    ],
  },
  {
    id: 'mcp', group: 'ai', title: 'MCP',
    summary: 'Model Context Protocol is an open standard for connecting AI apps to data sources and tools, like a universal plug.',
    points: [
      'Hosts are where the user talks to the AI; clients inside them route requests; servers sit in front of data sources.',
      'Servers expose resources (data to read), prompts (templates) and tools (actions).',
      'Actions can require explicit human approval.',
      'For PMs: many integrations without custom code, easier to swap models, less lock-in.',
    ],
    cards: [['What three things can an MCP server expose?', 'Resources (data), prompts (templates) and tools (actions).']],
  },
  {
    id: 'agents', group: 'ai', title: 'Agentic AI',
    summary: 'AI that works towards a goal on its own: planning, using tools and adapting with little human input.',
    points: [
      'Traits: initiative, context awareness, adaptability, tool use.',
      'Best for repetitive or context-heavy workflows where hand-offs slow things down.',
      'Users must still feel in control: build transparency and override options.',
      'Interfaces shift from buttons to conversations.',
      'In agentic software development, planner, coder, reviewer and QA agents work together, with humans approving key steps.',
    ],
    cards: [['What is the key difference between agentic AI and a chatbot?', 'An agent pursues a goal and takes actions on its own, instead of only responding to prompts.']],
  },
  {
    id: 'evals', group: 'ai', title: 'Evals',
    summary: 'A test for an AI system: give it inputs, grade its outputs, measure success. The eval set is where the quality bar lives.',
    points: [
      'Offline evals check the model on a labelled set; online metrics check users are better off.',
      'Build test cases from real failures. 20–50 real tasks is a strong start.',
      'Graders: humans (accurate, slow) or a model as judge (cheap, needs a clear rubric).',
      'No eval set, no launch. Gate launches on quality, never on engagement.',
    ],
    cards: [['Why gate an AI launch on a quality metric rather than engagement?', 'Engagement can rise while outputs are wrong; quality is what protects users and trust.']],
  },
  {
    id: 'precision-recall', group: 'ai', title: 'Precision, recall and thresholds',
    summary: 'Two ways to measure a model\'s calls, and the dial that trades one for the other.',
    points: [
      'Precision = true positives ÷ everything flagged. How often a flag is right.',
      'Recall = true positives ÷ everything actually wrong. How much you catch.',
      'Raising the threshold gives fewer false alarms but more misses.',
      'Which mistake hurts users more is a product decision, not an ML one.',
    ],
    example: 'Seller moderation: protect precision (a false flag bans a real seller). Payment fraud: protect recall (a miss loses real money).',
    cards: [
      ['Flag 100 listings as fake, 80 truly are. Precision?', '80%.'],
      ['When should you optimise recall?', 'When missing a real problem costs more than a false alarm.'],
    ],
  },
  {
    id: 'guardrails', group: 'ai', title: 'Guardrails and human in the loop',
    summary: 'Controls on what an AI can send users, and where a person must step in.',
    points: [
      'Grounding, citations, abstaining when unsure, routing risky topics to humans.',
      'Measure hallucination rate on a labelled sample.',
      'Automation spectrum: fully automated, human approves, human assisted, human only.',
      'Automate what can be undone. Gate what cannot.',
      'Design against automation bias, where people stop checking a mostly-right model.',
    ],
    example: 'A support copilot drafts replies (agent sends), fills internal fields (no approval), and never issues refunds on its own.',
    cards: [['What decides how much to automate?', 'Reversibility: automate what can be undone, gate what cannot.']],
  },
  {
    id: 'cost-per-task', group: 'ai', title: 'Cost per task',
    summary: 'AI has variable cost on every use. Measure cost per resolved task, including retries and failures.',
    points: [
      'Latency, quality and cost pull against each other.',
      'Levers: route simple queries to cheaper models, cache answers, narrow the scope.',
      'Flat per-seat pricing can make heavy users unprofitable. Consider usage-based pricing.',
    ],
    example: 'Three model calls at ₹2 each with a 60% success rate cost ₹10 per resolved task, not ₹6.',
    cards: [['Why can per-seat pricing hurt an AI product?', 'Heavy users cost far more to serve, so the more a feature succeeds the worse the margin can get.']],
  },
  {
    id: 'prompting', group: 'ai', title: 'Prompt engineering',
    summary: 'Designing the inputs to a model to get accurate, reliable, well-formatted outputs. For AI features, prompts are product logic.',
    points: [
      'Parts: role, context, task, constraints, output format.',
      'Zero-shot vs few-shot (2–5 examples).',
      'Chain of thought: ask the model to reason step by step.',
      'System prompts wrap every user message and hold the product\'s rules.',
      'Treat prompts like code: version them, test them, defend against prompt injection.',
    ],
    cards: [['Name the five parts of a production prompt.', 'Role, context, task, constraints, output format.']],
  },
  {
    id: 'ai-pm', group: 'ai', title: 'Answering AI product questions',
    summary: 'How to handle AI in interviews without sounding like hype.',
    points: [
      'Start with the user problem, not the model.',
      'Explain why AI is needed at all.',
      'Define success and evaluation before features.',
      'Discuss guardrails and fallback flows.',
      'Name trade-offs: accuracy vs latency, cost vs quality, personalisation vs privacy.',
      'Pitfalls: AI without a problem, no safeguards, weak evals, high inference cost, ignoring human workflows.',
    ],
    cards: [['What should come first in an AI product answer?', 'The user problem, and why AI is needed to solve it.']],
  },

  // ---------- Tech basics ----------
  {
    id: 'apis', group: 'tech', title: 'APIs',
    summary: 'The contract that lets two pieces of software talk through requests and responses. Think of a waiter carrying orders between you and the kitchen.',
    points: [
      'A request has an endpoint, a method (GET, POST, PUT), parameters, headers and a body.',
      'A response has a status code (200 OK, 404 not found), headers and a body.',
      'REST is stateless and uses HTTP; SOAP uses structured XML; others include GraphQL, webhooks and gRPC.',
      'Secured with auth tokens (who the user is) and API keys (which app is calling).',
    ],
    cards: [
      ['What does "stateless" mean for a REST API?', 'The server doesn\'t keep client data between requests.'],
      ['What does status code 404 mean?', 'Not found.'],
    ],
  },
  {
    id: 'sdlc', group: 'tech', title: 'SDLC, agile and scrum',
    summary: 'How software gets built: requirements, design, build, test, deploy, maintain. Agile does it in small increments.',
    points: [
      'Waterfall is linear; agile is iterative with tight feedback loops.',
      'Scrum roles: product owner, scrum master, development team.',
      'Scrum artifacts: product backlog, sprint backlog, increment.',
      'Scrum events: sprint planning, daily stand-up, sprint review.',
    ],
    cards: [['Name the three scrum roles.', 'Product owner, scrum master, development team.']],
  },
  {
    id: 'cloud', group: 'tech', title: 'Cloud computing',
    summary: 'Servers, storage, databases and software delivered over the internet, paid for as you use them.',
    points: ['Faster innovation, flexible resources, economies of scale.', 'Major providers: AWS, Azure, Google Cloud.'],
    cards: [['Name the three largest cloud providers.', 'AWS, Microsoft Azure, Google Cloud.']],
  },
  {
    id: 'no-code', group: 'tech', title: 'No-code and low-code',
    summary: 'Build apps, workflows and prototypes with visual tools instead of heavy engineering.',
    points: ['Great for early MVPs, internal tools and automations.', 'Risks: lock-in, poor scalability, hard to debug, limited control.', 'AI prototyping tools can come up in "vibe coding" interview rounds.'],
    cards: [['When should a team move off no-code?', 'When scale, performance or control needs outgrow the tool.']],
  },
  {
    id: 'wireframes', group: 'tech', title: 'UX, UI, wireframes and prototypes',
    summary: 'UX is how an experience works and feels; UI is the visual interface. Wireframes are low-fidelity blueprints; prototypes are working models.',
    points: ['Wireframes show information, layout and direction.', 'Prototypes add colour, content and interactions for testing.', 'Tools: Figma, Balsamiq, Adobe XD.'],
    cards: [['Wireframe vs prototype?', 'A wireframe is a low-fidelity layout; a prototype is a clickable, higher-fidelity working model.']],
  },
  {
    id: 'security', group: 'tech', title: 'Cybersecurity basics',
    summary: 'Protect confidentiality, integrity and availability of data and systems.',
    points: ['The CIA triad: confidentiality, integrity, availability.', 'Enterprise buyers expect SSO, role-based access, audit logs and certifications like SOC2.'],
    cards: [['What is the CIA triad?', 'Confidentiality, integrity, availability.']],
  },

  // ---------- Behavioural ----------
  {
    id: 'star', group: 'people', title: 'STAR, SOAR and CAR',
    summary: 'Structures for "tell me about a time" questions.',
    points: [
      'STAR: situation, task, action, result.',
      'SOAR: situation, obstacles, actions, result (when there were several obstacles).',
      'CAR: challenge, action, result.',
      'For PM, make the action a decision with a trade-off, make the result measurable, and add a reflection.',
      'Have a 2–3 minute version of each story and tell it, don\'t recite it.',
    ],
    cards: [
      ['What does SOAR add over STAR?', 'It focuses on obstacles instead of the task.'],
      ['What do most candidates leave out of STAR answers?', 'A reflection: what they would do differently.'],
    ],
  },
  {
    id: 'pm-story', group: 'people', title: 'Your PM story',
    summary: 'Before individual questions, write out who you were, what you worked on, what you noticed and why PM is the logical next step.',
    points: [
      'Honest and coherent beats a perfect origin story.',
      'Reverse-engineered narratives crack under follow-up questions.',
      'Ops, finance or consulting backgrounds are assets: lean into how businesses actually work.',
      'Always have a plan B answer for "what if not PM?".',
    ],
    cards: [['What makes a good "Why PM?" answer?', 'An honest, coherent story linking your past work to PM, backed by specific examples.']],
  },
]
