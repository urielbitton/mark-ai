export const showXResultsOptions = [
  { name: '10 results', value: 10 },
  { name: '15 results', value: 15 },
  { name: '20 results', value: 20 },
  { name: '25 results', value: 25 },
  { name: '30 results', value: 30 },
  { name: '40 results', value: 40 },
]

export const monthSelectOptions = [
  { label: 'All', value: 'all' },
  { label: 'January', value: 0 },
  { label: 'February', value: 1 },
  { label: 'March', value: 2 },
  { label: 'April', value: 3 },
  { label: 'May', value: 4 },
  { label: 'June', value: 5 },
  { label: 'July', value: 6 },
  { label: 'August', value: 7 },
  { label: 'September', value: 8 },
  { label: 'October', value: 9 },
  { label: 'November', value: 10 },
  { label: 'December', value: 11 },
]

export const supportIssuesOptions = [
  {
    label: 'Choose a support issue',
    value: '',
    disabled: true,
  },
  {
    label: 'Technical issue',
    value: 'technical',
  },
  {
    label: 'Billing issue',
    value: 'billing',
  },
  {
    label: 'Feature request',
    value: 'feature',
  },
  {
    label: 'Account Issue',
    value: 'account',
  },
  {
    label: 'Other',
    value: 'other',
  }
]

export const homeTypewriteTexts = [
  "AI Tools",
  "Online Tools",
  "Prompts"
]

export const proMenuLinks = [
  {
    label: 'Dashboard',
    url: '',
    icon: 'fas fa-tachometer',
  },
  {
    label: 'My AI Tools',
    url: 'my-ai-tools',
    icon: 'fas fa-robot',
  },
  {
    label: 'My Online Tools',
    url: 'my-online-tools',
    icon: 'fas fa-flask',
  },
  {
    label: 'My Prompts',
    url: 'my-prompts',
    icon: 'fas fa-comment-dots',
  },
  {
    label: 'New Submission',
    icon: 'fas fa-plus',
    url: '',
    sublinks: [
      {
        label: 'New AI Tool',
        icon: 'fas fa-robot',
        url: 'new-ai-tool',
      },
      {
        label: 'New Online Tool',
        icon: 'fas fa-flask',
        url: 'new-online-tool',
      },
      {
        label: 'New Prompt',
        icon: 'fas fa-comment-dots',
        url: 'new-prompt',
      },
    ]
  },
  {
    label: 'Settings',
    url: 'settings',
    icon: 'fas fa-cog',
  },
]