// Daily habits, week tips and reference numbers.

// One habit is shown each day, rotating.
export const HABITS = [
  { t: 'Open one app you use daily and ask three things: why is this feature here, what metric does it move, what would you change?', m: 10 },
  { t: 'Skim product and tech news for 15 minutes and note one launch you could mention in an interview.', m: 15 },
  { t: 'Read one concept card in Learn and explain it out loud in 60 seconds without jargon.', m: 10 },
  { t: 'Pick one AI concept (RAG, agents, evals) and write a 60-second interview-ready explanation.', m: 10 },
  { t: 'Compare two competing apps on one flow and write down which does it better and why.', m: 15 },
  { t: 'Write your answer to a case before looking at any solution. The gap is what you learn from.', m: 15 },
  { t: 'Re-read your notes from an earlier case so you don\'t forget its nuances by interview day.', m: 10 },
]

// Extra guidance per week, shown on week pages.
export const WEEK_TIPS = {
  1: [
    'Before any prep material, spend a few days using everyday apps like a PM: what would you change, and why was it built this way?',
    'Make notes from day one. The point is not to have done many products but to remember what you learned from them.',
    'Critique, don\'t praise. "All praise, no substance" is a common mistake.',
  ],
  2: [
    'Don\'t name the framework out loud. Use the structure and let the answer flow.',
    'One or two clarifying questions are enough. State your assumption and ask for buy-in.',
    'Write the user journey as it happens today, before your solution exists.',
    'Don\'t propose marketing, partnerships or a new strategy unless the question asks for it.',
  ],
  3: [
    'Rule out data and tracking issues before anything else.',
    'Ask whether the change is sudden or gradual: it points to very different causes.',
    'Cut the data by platform, geography and user cohort before forming hypotheses.',
    'Name a counter metric for every metric you push. It signals seniority.',
  ],
  4: [
    'Learn to recognise the case type in the first 30 seconds.',
    'RICE is clean but breaks down when comparing very different bets. Say so when it applies.',
    'Cost-plus is the pricing floor, competitor pricing is table stakes, value-based pricing is the goal.',
    'Pricing questions come up more than expected in fintech, e-commerce and SaaS.',
  ],
  5: [
    'In PM guesstimates, ground numbers in user behaviour, not just population maths.',
    'Validate your approach with the interviewer before calculating.',
    'Write out your PM story first: who you were, what you noticed, why PM is next.',
    'Add a reflection to every STAR story: what you would do differently.',
    'Skip the obvious favourite products unless you have something genuinely interesting to say.',
  ],
  6: [
    'The mock interviewer\'s job is to probe every claim. "Why that segment?" "What does that mean?"',
    'Spend 10 minutes after each mock on a debrief: what was clear, what was vague, where the thread was lost.',
    'The week before interviews, don\'t learn new things. Revisit your cases and notes, and do 2–3 focused mocks on weak areas.',
    'Pick 3–5 products you know deeply as anchor examples.',
    'Shortlists may come with a case submission due in 1–3 days. Leave room for it.',
    'Have 2–3 questions ready for the interviewer that you couldn\'t google in 30 seconds.',
  ],
}

export const NSM_EXAMPLES = [
  ['Airbnb', 'Nights booked'], ['Amazon', 'Purchases per month'], ['BookMyShow', 'Tickets booked'],
  ['Facebook', 'Monthly active users'], ['Google', 'Searches per user'], ['LinkedIn', 'Monthly active users'],
  ['Netflix', 'Total hours viewed'], ['Spotify', 'Time spent listening'], ['Swiggy', 'Orders completed'],
  ['Uber', 'Rides completed'], ['WhatsApp', 'Messages sent'], ['YouTube', 'Total watch time'],
  ['Zoom', 'Weekly hosted meetings'], ['PhonePe', 'Successful transactions per user'],
  ['Language learning app', 'Daily users who complete at least one lesson'],
]

// Rounded reference numbers for India guesstimates.
export const GUESS_DATA = [
  { group: 'People', rows: [
    ['Population', '≈ 1.4–1.45 billion'], ['People per household', '4'], ['Urban / rural', '40% / 60%'],
    ['Age 0–20 / 21–40 / 41–60 / 60+', '40% / 30% / 20% / 10%'], ['Income low / middle / upper-middle / high', '50% / 30% / 15% / 5%'],
    ['Delhi / Mumbai / Kolkata / Bengaluru / Hyderabad', '2% / 1.5% / 1% / 0.9% / 0.9% of population'],
  ] },
  { group: 'Digital', rows: [
    ['Internet users', '≈ 800–900 million'], ['Smartphone users', '≈ 800–900 million'], ['Internet users on mobile', '90%'],
    ['Social and chat users', '≈ 450 million'], ['Video watchers', '≈ 400 million'], ['People transacting online', '≈ 300 million'],
    ['Online shoppers', '≈ 250 million'], ['Time online per day', '≈ 6 hours'],
  ] },
  { group: 'Benchmarks', rows: [
    ['Display ad click-through', '0.5%'], ['Search ad click-through', '3%'], ['Cost per click, search / display', '$2 / $0.5'],
    ['E-commerce conversion', '2.5%'], ['E-commerce order value', '₹1,500'], ['Cart abandonment', '70%'],
  ] },
]

export const COUNTER_METRICS = [
  ['Time spent in app', 'Task completion rate'],
  ['Notifications sent', 'Opt-out and uninstall rate'],
  ['Ad revenue per session', 'Session length, return rate'],
  ['Listings removed by moderation', 'Genuine sellers banned, appeal rate'],
  ['Orders per user', 'Contribution margin per order'],
  ['Support tickets closed', 'Reopen rate'],
]
