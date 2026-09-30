// What to read first. Each concept id lists the one or two concepts that make it easier to follow.
// The reverse ("Leads to") is worked out automatically. Keep ids in sync with concepts.js.
export const PREREQS = {
  prd: ['personas', 'user-stories'],
  platforms: ['business-models'],

  circles: ['personas', 'journey'],
  jtbd: ['personas'],
  journey: ['personas'],
  'user-stories': ['personas'],
  hook: ['journey'],
  'app-critique': ['jtbd', 'personas'],

  rice: ['value-effort'],
  ice: ['rice'],
  moscow: ['mvp'],

  heart: ['aarrr'],
  counter: ['north-star'],
  'leading-lagging': ['north-star'],
  'common-metrics': ['aarrr'],
  segmentation: ['common-metrics'],
  ab: ['counter'],
  okr: ['north-star'],

  'rca-approach': ['journey', 'segmentation'],
  'gtm-approach': ['personas', 'business-models'],
  'pricing-approach': ['business-models'],
  'market-entry': ['gtm-approach'],
  moonshot: ['circles'],
  'system-design': ['apis'],
  'company-frameworks': ['heart'],

  rag: ['genai'],
  mcp: ['genai', 'apis'],
  agents: ['genai'],
  evals: ['genai'],
  'precision-recall': ['evals'],
  guardrails: ['evals'],
  'cost-per-task': ['genai', 'pricing-approach'],
  prompting: ['genai'],
  'ai-pm': ['evals', 'guardrails'],

  'no-code': ['mvp'],

  'pm-story': ['star'],
}
