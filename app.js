/* SOFTWORKER.AI — FRONTEND STATE MACHINE & INTERACTION ENGINE */

// --- GLOBAL APPLICATION STATE ---
const state = {
  activeView: 'home', // 'home', 'create_agent', 'create_skill', 'chats', 'projects', 'agents', 'approvals', 'schedule', 'roi', 'workstream', 'reviews', 'mydesk'
  theme: 'light', // 'light', 'dark'
  
  // --- ENTERPRISE REDESIGN (v2) STATE ---
  activeWorkspaceId: 'ws_1', // 'ws_1', 'ws_2', 'ws_3', 'ws_4'
  inMyDesk: false, // true when in My Desk private space
  myDeskView: 'chats', // 'chats', 'workstreams', 'skills', 'outputs'
  workspaceSwitcherOpen: false,
  collapsedSections: {
    mydesk: false,
    workspaces: false,
    workstreams: false
  },
  workspaces: [
    { id: 'ws_1', name: 'Acme Platform', color: '#185FA5', role: 'admin', members: 18 },
    { id: 'ws_2', name: 'Marketing Operations', color: '#D97706', role: 'editor', members: 6 },
    { id: 'ws_3', name: 'Engineering Core', color: '#8B5CF6', role: 'admin', members: 12 },
    { id: 'ws_4', name: 'Finance & Compliance', color: '#0D9488', role: 'viewer', members: 4 }
  ],
  workstreams: [
    { id: 'wst_1', workspaceId: 'ws_1', name: 'vendor outreach logs', icon: 'ti-mail-forward', status: 'running', lastActive: 'just now', runsCount: 42, activeRuns: 1, pendingReviews: 0 },
    { id: 'wst_2', workspaceId: 'ws_1', name: 'q1 expense audits', icon: 'ti-file-invoice', status: 'paused', lastActive: '12m ago', runsCount: 18, activeRuns: 0, pendingReviews: 2 },
    { id: 'wst_3', workspaceId: 'ws_1', name: 'system access auditing', icon: 'ti-key', status: 'complete', lastActive: '2h ago', runsCount: 9, activeRuns: 0, pendingReviews: 0 },
    { id: 'wst_4', workspaceId: 'ws_2', name: 'social campaign triage', icon: 'ti-brand-instagram', status: 'running', lastActive: '5m ago', runsCount: 22, activeRuns: 2, pendingReviews: 1 },
    { id: 'wst_5', workspaceId: 'ws_3', name: 'core pipeline linting', icon: 'ti-git-pull-request', status: 'running', lastActive: '1m ago', runsCount: 56, activeRuns: 1, pendingReviews: 3 }
  ],
  reviews: [
    { id: 'rev_1', workspaceId: 'ws_1', title: 'accounting API live authorization', requester: 'finance reviewer', date: '12m ago', status: 'pending', risk: 'medium', riskClass: 'risk-medium', workstreamId: 'wst_2' },
    { id: 'rev_2', workspaceId: 'ws_1', title: 'vendor bulk invoice sync (over $5k)', requester: 'billing compiler', date: '30m ago', status: 'pending', risk: 'high', riskClass: 'risk-high', workstreamId: 'wst_2' },
    { id: 'rev_3', workspaceId: 'ws_2', title: 'publish promo thread to twitter', requester: 'social assistant', date: '1h ago', status: 'pending', risk: 'low', riskClass: 'risk-low', workstreamId: 'wst_4' },
    { id: 'rev_4', workspaceId: 'ws_3', title: 'merge PR #1405 to production', requester: 'linting reviewer', date: '15m ago', status: 'pending', risk: 'high', riskClass: 'risk-high', workstreamId: 'wst_5' }
  ],
  // global inbox messages
  globalMessages: [
    { 
      id: 'gmsg_1', 
      workspaceId: 'ws_1',
      sender: 'HRIS system', 
      content: 'new developer onboarding request for Jordan Vance (San Francisco)', 
      status: 'triage', 
      time: '10m ago', 
      intent: {
        parsed: 'onboard Jordan Vance to engineering workspace',
        route: 'system access auditing',
        confidence: '94%'
      }
    },
    { 
      id: 'gmsg_2', 
      workspaceId: 'ws_1',
      sender: 'Stripe webhook', 
      content: 'payment anomaly detected: $4,200 charge from unknown vendor ID 88a3', 
      status: 'triage', 
      time: '22m ago', 
      intent: {
        parsed: 'reconcile expense anomaly for Stripe payout',
        route: 'q1 expense audits',
        confidence: '89%'
      }
    },
    { 
      id: 'gmsg_3', 
      workspaceId: 'ws_3',
      sender: 'Sentry core', 
      content: 'production critical alert: database locks high in workspace ws_3', 
      status: 'complete', 
      time: '1h ago', 
      intent: {
        parsed: 'triage database locking and log alert',
        route: 'core pipeline linting',
        confidence: '97%'
      }
    }
  ],
  // softworker current activities
  softworkerActivities: [
    { id: 'ag_1', status: 'waiting', desc: 'waiting for Sarah CFO token approval' },
    { id: 'ag_2', status: 'active', desc: 'compiling onboarding pack for Sales recruits' },
    { id: 'ag_3', status: 'idle', desc: 'inactive' },
    { id: 'ag_4', status: 'blocked', desc: 'policy block: direct ledger writing restricted' }
  ],
  // recent activities feed
  activityFeed: [
    { workspaceId: 'ws_1', type: 'run_complete', content: 'finance reviewer completed step "cross-reference matching receipt files"', time: '12m ago' },
    { workspaceId: 'ws_1', type: 'review_request', content: 'billing compiler requested invoice authorization (high risk)', time: '30m ago' },
    { workspaceId: 'ws_1', type: 'agent_start', content: 'hr onboarder started "sales recruit setup"', time: '2h ago' }
  ],
  expandedTriageMsgId: null,

  chats: [
    {
      id: 'chat_1',
      projectId: 'pr_1',
      title: 'expense report q1 audit',
      status: 'awaiting approval',
      elapsed: 'paused 12m ago',
      agent: { name: 'finance reviewer', category: 'finance_agent' },
      collaborators: ['AR', 'SJ'],
      messages: [
        {
          id: 'msg_1_1',
          sender: 'user',
          senderName: 'alex rivers',
          avatarType: 'user',
          avatarColor: 'purple',
          avatarInitials: 'AR',
          timestamp: '15m ago',
          content: 'audit the q1 expense ledger. look for anomalies, policy violations, or duplicates.'
        },
        {
          id: 'msg_1_2',
          sender: 'agent',
          senderName: 'finance reviewer',
          avatarType: 'agent',
          avatarCategory: 'finance_agent',
          timestamp: '14m ago',
          content: 'i will begin auditing the q1 expense ledger. i have generated a plan to reconcile items, cross-check receipts, and flag outstanding exceptions.',
          hasPlan: true,
          plan: {
            steps: [
              { id: 1, label: 'parse expense transactions from database', status: 'done' },
              { id: 2, label: 'cross-reference matching receipt files', status: 'done' },
              { id: 3, label: 'verify corporate policy compliance on ledger', status: 'active' },
              { id: 4, label: 'flag exceptions and check risk anomalies', status: 'pending' }
            ]
          },
          comments: [
            {
              id: 'c_1',
              author: 'sarah jenkins',
              avatarColor: 'teal',
              avatarInitials: 'SJ',
              time: '10m ago',
              body: 'please pay special attention to travel & entertainment categories.',
              reactions: [{ emoji: '👍', count: 2, active: true }]
            }
          ]
        },
        {
          id: 'msg_1_3',
          sender: 'agent',
          senderName: 'finance reviewer',
          avatarType: 'agent',
          avatarCategory: 'finance_agent',
          timestamp: '12m ago',
          content: 'i have encountered a policy block while attempting to verify accounts directly against the central banking API. i require governed authorization to proceed.',
          hasApprovalCard: true,
          approvalCard: {
            title: 'access credentials required',
            risk: 'medium',
            riskClass: 'risk-medium',
            needed: ['read access token for central business ledger API', 'read access for corporate banking transaction stream'],
            alternative: 'i can proceed using the raw CSV bank statements exported last month. this covers 76% of transactions but will bypass live q1 ledger validations.',
            status: 'requested' // 'requested', 'sent', 'granted', 'alternative'
          }
        }
      ]
    },
    {
      id: 'chat_2',
      projectId: 'pr_2',
      title: 'hr onboarding automation',
      status: 'complete',
      elapsed: 'completed 2h ago',
      agent: { name: 'hr onboarder', category: 'hr_agent' },
      collaborators: ['AR'],
      messages: [
        {
          id: 'msg_2_1',
          sender: 'user',
          senderName: 'alex rivers',
          avatarType: 'user',
          avatarColor: 'purple',
          avatarInitials: 'AR',
          timestamp: '2h ago',
          content: 'setup onboarding tickets and workspace access for the new sales recruits starting next week.'
        },
        {
          id: 'msg_2_2',
          sender: 'agent',
          senderName: 'hr onboarder',
          avatarType: 'agent',
          avatarCategory: 'hr_agent',
          timestamp: '2h ago',
          content: 'i have successfully executed the onboarding workflow. corporate directories updated, system accesses provisioned, and welcome calendar invites delivered.',
          hasPlan: true,
          plan: {
            steps: [
              { id: 1, label: 'pull recruit credentials from HRIS system', status: 'done' },
              { id: 2, label: 'generate custom email addresses', status: 'done' },
              { id: 3, label: 'provision default workspaces and channels', status: 'done' }
            ]
          }
        }
      ]
    }
  ],
  agents: [
    { id: 'ag_1', name: 'finance reviewer', category: 'finance_agent', status: 'active', desc: 'audits expense reports, matches receipts, and flags policy anomalies.', lastRun: '12 minutes ago', runsThisMonth: 124, approvalRate: '98%' },
    { id: 'ag_2', name: 'hr onboarder', category: 'hr_agent', status: 'active', desc: 'handles new hire system accesses, workspace configurations, and calendar invites.', lastRun: '2 hours ago', runsThisMonth: 82, approvalRate: '92%' },
    { id: 'ag_3', name: 'sales follow-up', category: 'sales_agent', status: 'paused', desc: 'reconciles CRM accounts and manages follow-up communications.', lastRun: '3 days ago', runsThisMonth: 48, approvalRate: '99%' },
    { id: 'ag_4', name: 'it support', category: 'it_agent', status: 'draft', desc: 'triages desktop issues and handles basic password access controls.', lastRun: 'never', runsThisMonth: 0, approvalRate: '—' },
    { id: 'ag_5', name: 'ops coordinator', category: 'ops_agent', status: 'retired', desc: 'coordinates supply chains and logs operational inventory shifts.', lastRun: '1 month ago', runsThisMonth: 11, approvalRate: '88%' }
  ],
  skills: [
    { id: 'sk_1', name: 'read expensify', desc: 'extract line items from expensify records' },
    { id: 'sk_2', name: 'post slack message', desc: 'deliver styled notification to workspace channels' },
    { id: 'sk_3', name: 'update salesforce crm', desc: 'modify deal timelines and contact logs' }
  ],
  projects: [
    {
      id: 'pr_1',
      name: 'q1 financial close audit',
      desc: 'ledger analysis, compliance verification, and anomalies tracking.',
      runs: 24,
      status: 'active',
      pinned: true,
      capacityUsed: 1,
      instructions: 'think step by step and show reasoning for complex problems. use specific examples.',
      files: [
        { name: 'ui audit & accessibility check.pdf', size: '1.2 MB' },
        { name: 'marketing close reports q1.pdf', size: '4.8 MB' }
      ]
    },
    {
      id: 'pr_2',
      name: 'sales workspace onboarding',
      desc: 'system setups and channel provisions for regional hires.',
      runs: 12,
      status: 'complete',
      pinned: true,
      capacityUsed: 5,
      instructions: 'prioritize Slack notifications and send structured summaries to onboarding channel.',
      files: [
        { name: 'recruitment requirements 2026.pdf', size: '1.6 MB' }
      ]
    },
    {
      id: 'pr_3',
      name: 'marketing expense tracking',
      desc: 'vendor spend audits and invoice reconciliations.',
      runs: 9,
      status: 'active',
      pinned: false,
      capacityUsed: 12,
      instructions: 'check invoices against the marketing ledger and flag any discrepancies over $500.',
      files: []
    }
  ],
  activeChatId: null,
  activeProjectId: null,
  activeForkMsgId: null,
  toastTimeout: null,
  activeChips: [], // chips in the prompt box
  plusMenuOpen: false,
  collapsedProjects: {}, // tracks collapsed state for projects by ID
  projectsSectionCollapsed: false,
  selectedPermission: 'Default permissions',
  selectedIntelligence: 'Medium',
  tools: [
    { id: 'conn_1', name: 'Slack', icon: 'ti-brand-slack', enabled: true },
    { id: 'conn_2', name: 'Salesforce', icon: 'ti-cloud', enabled: true },
    { id: 'conn_3', name: 'Google Drive', icon: 'ti-brand-google-drive', enabled: false },
    { id: 'conn_4', name: 'Notion', icon: 'ti-note', enabled: true },
    { id: 'conn_5', name: 'GitHub', icon: 'ti-brand-github', enabled: false }
  ],
  
  // --- KNOWLEDGE BASE REDESIGN STATE ---
  knowledgeBaseView: 'grid', // 'grid' or 'list'
  knowledgeBaseSearchQuery: '',
  kbFilterScope: 'all', // 'all', 'mine', 'others'
  kbScopeDropdownOpen: false,
  kbSortOpen: false,
  kbSortField: 'created_time', // 'name', 'created_time', 'size'
  kbSortDirection: 'desc', // 'asc', 'desc'
  kbSortFieldDropdownOpen: false,
  kbSortDirDropdownOpen: false,
  kbFilterOpen: false,
  kbTypeDropdownOpen: false,
  kbSelectedTypes: [], // Array of filtered types, e.g. ['pdf', 'txt']
  kbFilterDateFrom: '',
  kbFilterDateTo: '',
  kbCalendarOpen: false,
  kbCalendarTarget: null, // 'from' or 'to'
  knowledgeBase: [
    // ws_1 (Acme Platform)
    { id: 'kb_1', workspaceId: 'ws_1', name: 'Potential Customers.xlsx', ext: 'xlsx', size: '60 KB', chunks: 47, date: '19/05/2026', syncing: false, owner: 'me', agentUsage: 14, aiSummary: 'Lists high-intent enterprise contacts and leads for Acme Outreach campaigns. Contains validated domains, direct contact details, lead quality scores, and custom tags for background pipeline targeting.' },
    { id: 'kb_2', workspaceId: 'ws_1', name: 'User Analytics.json', ext: 'json', size: '10 KB', chunks: 10, date: '19/05/2026', syncing: false, owner: 'others', agentUsage: 3, aiSummary: 'Telemetry logs detailing user activation funnels. Identifies a critical onboarding drop-off of 14% and isolates workflow steps showing high browser console errors and long interaction delays.' },
    { id: 'kb_3', workspaceId: 'ws_1', name: 'Legal Terms and Conditions.pdf', ext: 'pdf', size: '32 KB', chunks: 11, date: '19/05/2026', syncing: false, owner: 'others', agentUsage: 8, aiSummary: 'Standard contractor compliance terms and data security rules. Outlines liability limits, vector database isolation requirements, and governance audits mandatory for autonomous background agents.' },
    { id: 'kb_4', workspaceId: 'ws_1', name: 'Meeting Notes.docx', ext: 'docx', size: '50 KB', chunks: 5, date: '19/05/2026', syncing: false, owner: 'me', agentUsage: 1, aiSummary: 'Action items from the Q2 pipeline alignment sync. Directs engineers to transition local vector RAG stores to centralized governed databases and enforces medium-risk verification protocols.' },
    { id: 'kb_5', workspaceId: 'ws_1', name: 'Quarterly Review Presentation.pptx', ext: 'pptx', size: '20 KB', chunks: 9, date: '19/05/2026', syncing: false, owner: 'me', agentUsage: 0, aiSummary: 'Q1 product review and upcoming roadmap updates. Illustrates standard ROI projection models, operational savings, and metrics showing softworkers completing tasks 3.8x faster.' },
    { id: 'kb_6', workspaceId: 'ws_1', name: 'Sales Data.csv', ext: 'csv', size: '37 KB', chunks: 150, date: '19/05/2026', syncing: true, owner: 'others', agentUsage: 25, aiSummary: 'A dense transaction record dataset compiling monthly sales volume. Used by the sales forecaster and auditing agents to cross-verify stripe receipts and anomalous ledger postings.' },
    { id: 'kb_7', workspaceId: 'ws_1', name: 'Project Brief.txt', ext: 'txt', size: '30 KB', chunks: 4, date: '19/05/2026', syncing: false, owner: 'others', agentUsage: 0, aiSummary: 'Initial scope design for the background workforce scheduling engines. Details cron configuration limits, parallel execution queues, and fallback recovery triggers.' },
    { id: 'kb_8', workspaceId: 'ws_1', name: 'Client Feedback.pdf', ext: 'pdf', size: '18 KB', chunks: 65, date: '19/05/2026', syncing: false, owner: 'me', agentUsage: 12, aiSummary: 'Compiled user reviews showing overall satisfaction. Highlights active request for quick mobile layout improvements and a cleaner RAG context search interface.' },
    
    // ws_2 (Marketing Operations)
    { id: 'kb_9', workspaceId: 'ws_2', name: 'API Responses.json', ext: 'json', size: '5 KB', chunks: 25, date: '19/05/2026', syncing: false, owner: 'others', agentUsage: 4, aiSummary: 'Mock webhook event payloads. Useful to verify JSON schema formats for automatic Stripe invoice webhooks and system health check logs.' },
    { id: 'kb_10', workspaceId: 'ws_2', name: 'Budget Overview.xlsx', ext: 'xlsx', size: '2 KB', chunks: 12, date: '19/05/2026', syncing: false, owner: 'me', agentUsage: 2, aiSummary: 'Current marketing operation expense breakdowns showing campaign channel allocations, CPC limits, and total agency payouts for automated search outreach.' },
    { id: 'kb_11', workspaceId: 'ws_2', name: 'Customer Feedback.xlsx', ext: 'xlsx', size: '35 KB', chunks: 34, date: '19/05/2026', syncing: false, owner: 'me', agentUsage: 6, aiSummary: 'Aggregated reviews rating support responsiveness and ticket resolution times. Essential context used by support triaging agents.' },
    { id: 'kb_12', workspaceId: 'ws_2', name: 'Landing Page.html', ext: 'html', size: '28 KB', chunks: 8, date: '19/05/2026', syncing: false, owner: 'others', agentUsage: 0, aiSummary: 'The HTML code markup of the pre-launch landing page. Used to automatically parse and verify current footer script integrations.' },
    
    // ws_3 (Engineering Core)
    { id: 'kb_13', workspaceId: 'ws_3', name: 'Team Goals.docx', ext: 'docx', size: '14 KB', chunks: 12, date: '19/05/2026', syncing: false, owner: 'me', agentUsage: 1, aiSummary: 'Engineering quarterly milestones focusing on pipeline execution speed, database indexing optimization, and RAG retrieval latency reductions.' },
    { id: 'kb_14', workspaceId: 'ws_3', name: 'Project Plan.pdf', ext: 'pdf', size: '45 KB', chunks: 14, date: '19/05/2026', syncing: false, owner: 'others', agentUsage: 5, aiSummary: 'Complete system architecture layout details. Documents microservices structure, redis caching clusters, and backup databases.' },
    { id: 'kb_15', workspaceId: 'ws_3', name: 'Product Launch Strategy.pptx', ext: 'pptx', size: '12 KB', chunks: 15, date: '19/05/2026', syncing: true, owner: 'me', agentUsage: 0, aiSummary: 'Visual slides outlines alpha and beta rollout phases. Directs marketing outreach targeting tech-forward operations directors.' },
    { id: 'kb_16', workspaceId: 'ws_3', name: 'Voice Message.mp3', ext: 'mp3', size: '25 KB', chunks: 1, date: '19/05/2026', syncing: false, owner: 'others', agentUsage: 3, aiSummary: 'Audio transcript recording of a high-priority customer support call detailing critical dashboard login failures on mobile browsers.' },
    
    // ws_4 (Finance & Compliance)
    { id: 'kb_17', workspaceId: 'ws_4', name: 'Inventory Report.csv', ext: 'csv', size: '33 KB', chunks: 200, date: '19/05/2026', syncing: true, owner: 'others', agentUsage: 8, aiSummary: 'Durable physical hardware log tracking. Essential context for compliance auditing.' },
    { id: 'kb_18', workspaceId: 'ws_4', name: 'Training Video.mp4', ext: 'mp4', size: '27 KB', chunks: 6, date: '19/05/2026', syncing: false, owner: 'others', agentUsage: 0, aiSummary: 'Onboarding visual walk-through explaining basic ledgers security guidelines.' },
    { id: 'kb_19', workspaceId: 'ws_4', name: 'Daily Standup.txt', ext: 'txt', size: '40 KB', chunks: 2, date: '19/05/2026', syncing: false, owner: 'me', agentUsage: 2, aiSummary: 'Scrum text updates listing active tasks, resolved merge blockers, and scheduled compliance review sessions.' },
    { id: 'kb_20', workspaceId: 'ws_4', name: 'Sales Forecast.xlsx', ext: 'xlsx', size: '15 KB', chunks: 60, date: '19/05/2026', syncing: true, owner: 'me', agentUsage: 10, aiSummary: 'Statistical revenue models plotting projected conversion gains derived from autonomous pipeline agents.' }
  ]
};

// --- CORE COLOR PALETTES & SVG AVATAR GENERATION ---
const categoryRamps = {
  finance_agent: { color: '#185FA5', bg: '#E6F1FB', icon: 'ti-currency-dollar' },
  hr_agent: { color: '#8B5CF6', bg: '#F3E8FF', icon: 'ti-heart' },
  sales_agent: { color: '#D97706', bg: '#FEF3C7', icon: 'ti-trending-up' },
  it_agent: { color: '#EA580C', bg: '#FFEDD5', icon: 'ti-terminal-2' },
  ops_agent: { color: '#0D9488', bg: '#CCFBF1', icon: 'ti-checklist' }
};

function getAgentAvatarSVG(category, size = 24) {
  const ramp = categoryRamps[category] || categoryRamps.finance_agent;
  
  // Minimal illustrated line character (head circle + shoulder arc + accessory)
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="border-radius: 6px; background-color: ${ramp.bg}">
      <!-- Head Circle -->
      <circle cx="16" cy="11" r="5" stroke="${ramp.color}" stroke-width="1.8" fill="none" />
      <!-- Shoulder Arc -->
      <path d="M7,24 C7,18 11,17 16,17 C21,17 25,18 25,24" stroke="${ramp.color}" stroke-width="1.8" stroke-linecap="round" fill="none" />
      <!-- Tiny Accent Dot/Symbol -->
      <circle cx="16" cy="11" r="1.2" fill="${ramp.color}" />
    </svg>
  `;
}

// --- DOM ELEMENT REFERENCES ---
const DOM = {
  get contentArea() { return document.getElementById('content-area'); },
  get currentViewTitle() { return document.getElementById('current-view-title'); },
  get btnNewChat() { return document.getElementById('btn-new-chat'); },
  get recentThreadsList() { return document.getElementById('sidebar-dynamic-content'); },
  get badgeAgentsCount() { return document.getElementById('badge-agents-count'); },
  get badgeApprovalsCount() { return document.getElementById('badge-approvals-count'); },
  get themeToggle() { return document.getElementById('theme-toggle'); },
  get shareModal() { return document.getElementById('share-modal'); },
  get forkModal() { return document.getElementById('fork-modal'); },
  get toast() { return document.getElementById('toast-notification'); },
  get toastMessage() { return document.getElementById('toast-message'); },
  get btnConfirmFork() { return document.getElementById('btn-confirm-fork'); },
  get btnShareInviteSend() { return document.getElementById('btn-share-invite-send'); },
  get shareInviteInput() { return document.getElementById('share-invite-input'); },
  get shareInvitePerm() { return document.getElementById('share-invite-perm'); },
  get collaboratorsList() { return document.getElementById('collaborators-list'); },
  get publicLinkToggle() { return document.getElementById('public-link-toggle'); },
  get publicLinkPreviewBox() { return document.getElementById('public-link-preview-box'); },
  get btnCopyPublicLink() { return document.getElementById('btn-copy-public-link'); },
  // Navigation elements
  get navChats() { return document.getElementById('nav-chats'); },
  get navProjects() { return document.getElementById('nav-projects'); },
  get navAgents() { return document.getElementById('nav-agents'); },
  get navApprovals() { return document.getElementById('nav-approvals'); },
  get navSchedule() { return document.getElementById('nav-schedule'); },
  get navRoi() { return document.getElementById('nav-roi'); }
};

// --- INITIALIZE & ROUTING ---
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Setup theme
  detectSystemTheme();
  if (DOM.themeToggle) DOM.themeToggle.addEventListener('click', toggleTheme);
  
  // Navigation Handlers
  window.addEventListener('hashchange', handleRouting);
  
  if (DOM.btnNewChat) {
    DOM.btnNewChat.addEventListener('click', () => {
      state.activeChips = [];
      navigateTo('home');
    });
  }

  // Modal actions
  if (DOM.btnConfirmFork) DOM.btnConfirmFork.addEventListener('click', confirmFork);
  if (DOM.btnShareInviteSend) DOM.btnShareInviteSend.addEventListener('click', sendShareInvite);
  if (DOM.publicLinkToggle) DOM.publicLinkToggle.addEventListener('change', togglePublicLink);
  if (DOM.btnCopyPublicLink) DOM.btnCopyPublicLink.addEventListener('click', copyPublicLink);
  
  // Set counts
  updateBadges();
  renderRecentChatsList();
  initSidebarResizer();
  initSidebarHResizer();
  initTooltips();
  
  // Close global search when clicking outside
  document.addEventListener('click', closeGlobalSearchDropdownOutside);
  
  // Default Route
  handleRouting();
}

function initSidebarResizer() {
  const resizer = document.getElementById('sidebar-resizer');
  const sidebar = document.querySelector('.sidebar');
  if (!resizer || !sidebar) return;

  let isDragging = false;

  resizer.addEventListener('mousedown', e => {
    isDragging = true;
    resizer.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const newWidth = Math.max(160, Math.min(400, e.clientX));
    sidebar.style.width = `${newWidth}px`;
    sidebar.style.minWidth = `${newWidth}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      resizer.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
}

function initSidebarHResizer() {
  const hResizer = document.getElementById('sidebar-h-resizer');
  const sidebarNav = document.querySelector('.sidebar-nav');
  if (!hResizer || !sidebarNav) return;

  let isDraggingH = false;

  hResizer.addEventListener('mousedown', e => {
    isDraggingH = true;
    hResizer.classList.add('dragging');
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!isDraggingH) return;
    const navRect = sidebarNav.getBoundingClientRect();
    // Maintain a minimum height so navigation isn't entirely squished
    const newHeight = Math.max(80, e.clientY - navRect.top);
    sidebarNav.style.height = `${newHeight}px`;
    sidebarNav.style.flex = 'none';
  });

  document.addEventListener('mouseup', () => {
    if (isDraggingH) {
      isDraggingH = false;
      hResizer.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
}

function updateBadges() {
  if (DOM.badgeAgentsCount) {
    DOM.badgeAgentsCount.textContent = state.agents.filter(a => a.status === 'active').length;
  }
  
  // Count active pending approvals
  let pendingCount = 0;
  state.chats.forEach(c => {
    c.messages.forEach(m => {
      if (m.hasApprovalCard && (m.approvalCard.status === 'requested' || m.approvalCard.status === 'sent')) {
        pendingCount++;
      }
    });
  });
  
  if (DOM.badgeApprovalsCount) {
    if (pendingCount > 0) {
      DOM.badgeApprovalsCount.textContent = pendingCount;
      DOM.badgeApprovalsCount.style.display = 'inline-flex';
    } else {
      DOM.badgeApprovalsCount.style.display = 'none';
    }
  }
}

function handleRouting() {
  const hash = window.location.hash || '#/home';
  
  // Clear navigation highlight
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  
  // Enterprise Routing Integration
  if (hash.startsWith('#/mydesk/')) {
    state.inMyDesk = true;
    const parts = hash.split('/');
    state.myDeskView = parts[2] || 'chats';
    navigateTo('mydesk');
  } else if (hash === '#/workspace/global') {
    state.inMyDesk = false;
    navigateTo('global_channel');
  } else if (hash === '#/workspace/skills') {
    state.inMyDesk = false;
    navigateTo('workspace_skills');
  } else if (hash === '#/workspace/softworkers') {
    state.inMyDesk = false;
    navigateTo('agents');
  } else if (hash === '#/workspace/reviews') {
    state.inMyDesk = false;
    navigateTo('reviews');
  } else if (hash === '#/workspace/outputs') {
    state.inMyDesk = false;
    navigateTo('workspace_outputs');
  } else if (hash === '#/workspace/knowledge') {
    state.inMyDesk = false;
    navigateTo('workspace_knowledge');
  } else if (hash === '#/workspace/settings') {
    state.inMyDesk = false;
    navigateTo('workspace_settings');
  } else if (hash.startsWith('#/workspace/') && hash.includes('/workstream/')) {
    state.inMyDesk = false;
    const parts = hash.split('/'); // #, workspace, :wsId, workstream, :streamId
    state.activeWorkspaceId = parts[2];
    state.activeWorkstreamId = parts[4];
    navigateTo('workstream');
  } else if (hash.startsWith('#/chats/')) {
    const chatId = hash.split('/')[2];
    state.activeChatId = chatId;
    navigateTo('chats');
    if (DOM.navChats) DOM.navChats.classList.add('active');
  } else if (hash === '#/chats') {
    if (state.chats.length > 0) {
      window.location.hash = `#/chats/${state.chats[0].id}`;
    } else {
      navigateTo('home');
    }
  } else if (hash.startsWith('#/projects/')) {
    const projectId = hash.split('/')[2];
    state.activeProjectId = projectId;
    navigateTo('project_detail');
    if (DOM.navProjects) DOM.navProjects.classList.add('active');
  } else if (hash === '#/projects') {
    navigateTo('projects');
    if (DOM.navProjects) DOM.navProjects.classList.add('active');
  } else if (hash === '#/agents') {
    navigateTo('agents');
    if (DOM.navAgents) DOM.navAgents.classList.add('active');
  } else if (hash === '#/approvals') {
    navigateTo('approvals');
    if (DOM.navApprovals) DOM.navApprovals.classList.add('active');
  } else if (hash === '#/schedule') {
    navigateTo('schedule');
    if (DOM.navSchedule) DOM.navSchedule.classList.add('active');
  } else if (hash === '#/roi') {
    navigateTo('roi');
    if (DOM.navRoi) DOM.navRoi.classList.add('active');
  } else if (hash === '#/create-agent') {
    state.activeChips = [{ id: 'chip_create_agent', label: 'create agent', type: 'create_agent', icon: 'ti-plus' }];
    navigateTo('create_agent');
  } else if (hash === '#/create-skill') {
    state.activeChips = [{ id: 'chip_create_skill', label: 'create skill', type: 'create_skill', icon: 'ti-file-description' }];
    navigateTo('create_skill');
  } else if (hash.startsWith('#/customize')) {
    const parts = hash.split('/');
    const tab = parts[2] || 'skills';
    const itemId = parts[3] || null;
    state.activeView = 'customize';
    state.customizeTab = tab;
    state.customizeItemId = itemId;
    navigateTo('customize');
    
    document.querySelectorAll('.nav-subitem').forEach(el => el.classList.remove('active'));
    if (tab === 'skills') {
      const el = document.getElementById('nav-customize-skills');
      if (el) el.classList.add('active');
    } else {
      const el = document.getElementById('nav-customize-tools');
      if (el) el.classList.add('active');
    }
  } else {
    state.inMyDesk = false;
    navigateTo('home');
  }
}

function navigateTo(view) {
  state.activeView = view;
  renderView();
}

function renderView() {
  let title = 'home screen';
  
  switch (state.activeView) {
    case 'home':
      title = 'home screen';
      renderHomeScreen();
      break;
    case 'create_agent':
      title = 'create agent flow';
      renderCreateAgentScreen();
      break;
    case 'create_skill':
      title = 'create skill flow';
      renderCreateSkillScreen();
      break;
    case 'chats':
      title = 'run thread';
      renderChatScreen();
      break;
    case 'projects':
      title = 'projects';
      renderProjectsScreen();
      break;
    case 'project_detail':
      title = 'project details';
      renderProjectDetailScreen(state.activeProjectId);
      break;
    case 'agents':
      title = 'agents inventory';
      renderAgentsScreen();
      break;
    case 'approvals':
      title = 'approvals queue';
      renderApprovalsScreen();
      break;
    case 'schedule':
      title = 'run schedules';
      renderScheduleScreen();
      break;
    case 'roi':
      title = 'ROI dashboard';
      renderRoiScreen();
      break;
    case 'customize':
      title = 'Customize';
      renderCustomizeScreen();
      break;
    case 'global_channel':
      title = 'global channel / triage';
      renderGlobalChannelScreen();
      break;
    case 'workstream':
      title = 'workstream details';
      renderWorkstreamScreen();
      break;
    case 'workspace_skills':
      title = 'workspace skills';
      renderWorkspaceSkillsScreen();
      break;
    case 'reviews':
      title = 'reviews & approvals';
      renderReviewsScreen();
      break;
    case 'workspace_outputs':
      title = 'workspace outputs';
      renderWorkspaceOutputsScreen();
      break;
    case 'workspace_knowledge':
      title = 'workspace knowledge';
      renderWorkspaceKnowledgeScreen();
      break;
    case 'workspace_settings':
      title = 'workspace settings';
      renderWorkspaceSettingsScreen();
      break;
    case 'mydesk':
      title = 'my desk';
      renderMyDeskScreen();
      break;
  }
  
  if (state.activeView === 'customize') {
    // Custom topbar for Customize view
    document.querySelector('.topbar-left').innerHTML = `
      <a href="#/home" class="topbar-back-link" style="display:flex;align-items:center;gap:8px;color:var(--color-text-primary);text-decoration:none;font-weight:500;font-size:14px;padding: 4px 8px; border-radius: 6px; transition: background 0.15s;" onmouseover="this.style.background='var(--color-bg-secondary)'" onmouseout="this.style.background='transparent'">
        <i class="ti ti-arrow-left"></i>
        <span style="font-weight:500; font-size:15px;">Customize</span>
      </a>
    `;
    document.querySelector('.topbar-right').style.display = 'none';
  } else if (state.activeView === 'reviews') {
    // Custom topbar for Reviews & approvals view
    document.querySelector('.topbar-left').innerHTML = `
      <a href="#/home" class="topbar-back-link" style="display:flex;align-items:center;gap:8px;color:var(--color-text-primary);text-decoration:none;font-weight:500;font-size:14px;padding: 4px 8px; border-radius: 6px; transition: background 0.15s;" onmouseover="this.style.background='var(--color-bg-secondary)'" onmouseout="this.style.background='transparent'">
        <i class="ti ti-arrow-left"></i>
        <span style="font-weight:500; font-size:15px;">Reviews & approvals</span>
      </a>
    `;
    document.querySelector('.topbar-right').style.display = 'flex';
  } else if (state.activeView === 'workstream') {
    // Custom topbar for workstream view
    const wst = state.workstreams.find(w => w.id === state.activeWorkstreamId) || state.workstreams[0];
    const wsName = wst ? wst.name : 'vendor outreach logs';
    document.querySelector('.topbar-left').innerHTML = `
      <div class="ws-breadcrumb" style="display:flex; align-items:center; gap:6px; font-size:12px; color:var(--ws-text-tertiary);">
        <span>Acme platform</span>
        <span style="opacity:0.5;">/</span>
        <span>Workstreams</span>
        <span style="opacity:0.5;">/</span>
        <span style="color:var(--ws-text-primary); font-weight:500;">${wsName}</span>
      </div>
    `;
    
    // Custom right topbar
    document.querySelector('.topbar-right').innerHTML = `
      <button class="topbar-btn" data-tooltip="Search in workstream">
        <i class="ti ti-search"></i>
      </button>
      <button id="theme-toggle" class="topbar-btn" onclick="toggleTheme()" data-tooltip="Toggle theme">
        <i class="ti ti-sun" id="theme-icon-light" style="display: ${state.theme === 'dark' ? 'block' : 'none'};"></i>
        <i class="ti ti-moon" id="theme-icon-dark" style="display: ${state.theme === 'dark' ? 'none' : 'block'};"></i>
      </button>
      <button class="topbar-btn relative" data-tooltip="Notifications">
        <i class="ti ti-bell"></i>
        <span class="notification-indicator"></span>
      </button>
      <button class="ws-topbar-text-btn secondary-outlined" onclick="addRedirectChip('${wst ? wst.id : ''}')" data-tooltip="Redirect">
        <i class="ti ti-git-branch"></i>
        <span>Redirect</span>
      </button>
      <button class="ws-topbar-text-btn primary-filled" onclick="simulateWorkstreamRun('${wst ? wst.id : ''}')" data-tooltip="Run manual check">
        <i class="ti ti-player-play"></i>
        <span>Run manual check</span>
      </button>
    `;
    document.querySelector('.topbar-right').style.display = 'flex';
  } else {
    // Standard topbar
    document.querySelector('.topbar-left').innerHTML = `
      <span id="current-view-title" class="view-title">${title}</span>
    `;
    
    // Restore standard right content
    document.querySelector('.topbar-right').innerHTML = `
      <button id="theme-toggle" class="topbar-btn" onclick="toggleTheme()" data-tooltip="switch theme">
        <i class="ti ti-sun" id="theme-icon-light" style="display: ${state.theme === 'dark' ? 'block' : 'none'};"></i>
        <i class="ti ti-moon" id="theme-icon-dark" style="display: ${state.theme === 'dark' ? 'none' : 'block'};"></i>
      </button>
      <button class="topbar-btn" id="btn-global-search" data-tooltip="search" onclick="toggleGlobalSearch(event)">
        <i class="ti ti-search"></i>
      </button>
      <button class="topbar-btn relative" data-tooltip="notifications">
        <i class="ti ti-bell"></i>
        <span class="notification-indicator"></span>
      </button>
      <button class="topbar-btn" id="btn-activity-drawer" data-tooltip="activity & status" onclick="toggleActivityDrawer()">
        <i class="ti ti-activity"></i>
      </button>
    `;
    document.querySelector('.topbar-right').style.display = 'flex';
  }

  DOM.currentViewTitle = document.getElementById('current-view-title');
  if (DOM.currentViewTitle) {
    DOM.currentViewTitle.textContent = title;
  }
  updateBadges();
}

// --- ACTIVITY DRAWER ---
let _activityDrawerTab = 'queue';

function toggleActivityDrawer() {
  const drawer = document.getElementById('activity-drawer');
  const overlay = document.getElementById('activity-drawer-overlay');
  const btn = document.getElementById('btn-activity-drawer');
  if (!drawer) return;
  const isOpen = drawer.classList.contains('open');
  if (isOpen) {
    closeActivityDrawer();
  } else {
    drawer.classList.add('open');
    overlay && overlay.classList.add('open');
    btn && btn.classList.add('drawer-active');
    renderActivityDrawerContent(_activityDrawerTab);
  }
}

function closeActivityDrawer() {
  const drawer = document.getElementById('activity-drawer');
  const overlay = document.getElementById('activity-drawer-overlay');
  const btn = document.getElementById('btn-activity-drawer');
  drawer && drawer.classList.remove('open');
  overlay && overlay.classList.remove('open');
  btn && btn.classList.remove('drawer-active');
}

function switchActivityTab(tab) {
  _activityDrawerTab = tab;
  // Update tab active states
  ['queue', 'agents', 'feed'].forEach(t => {
    const el = document.getElementById('tab-' + t);
    if (el) el.classList.toggle('active', t === tab);
  });
  renderActivityDrawerContent(tab);
}

function renderActivityDrawerContent(tab) {
  const body = document.getElementById('activity-drawer-body');
  if (!body) return;
  const activeWorkspace = state.workspaces.find(ws => ws.id === state.activeWorkspaceId) || state.workspaces[0];

  if (tab === 'queue') {
    const pendingReviews = state.reviews.filter(r => r.workspaceId === activeWorkspace.id && r.status === 'pending');
    body.innerHTML = `
      <div class="drawer-section-label">
        my review queue
        ${pendingReviews.length > 0 ? `<span class="badge-count">${pendingReviews.length}</span>` : ''}
      </div>
      ${pendingReviews.length === 0 ? `
        <div style="font-size:12px; color:var(--color-text-tertiary); padding:16px 0;">All caught up! No reviews pending.</div>
      ` : pendingReviews.map(rev => `
        <div class="drawer-review-card" onclick="closeActivityDrawer(); window.location.hash='#/workspace/reviews';">
          <div class="drawer-review-card-left">
            <div class="drawer-review-title">${rev.title}</div>
            <div class="drawer-review-meta">risk: ${rev.risk} · requested by ${rev.requestedBy || 'system'}</div>
          </div>
          <i class="ti ti-chevron-right drawer-review-arrow"></i>
        </div>
      `).join('')}
    `;
  } else if (tab === 'agents') {
    const softworkerStatuses = state.agents.map(ag => {
      let statusClass = 'pulse-gray';
      let activity = 'Idle';
      if (ag.status === 'active') {
        statusClass = 'pulse-green';
        activity = ag.category === 'finance_agent' ? 'Analyzing ledgers' : 'Monitoring feeds';
      } else if (ag.status === 'paused') {
        statusClass = 'pulse-amber';
        activity = 'Waiting approval';
      } else if (ag.status === 'blocked') {
        statusClass = 'pulse-red';
        activity = 'Failed intake check';
      }
      return { name: ag.name, statusClass, activity };
    });
    body.innerHTML = `
      <div class="drawer-section-label">softworkers in action</div>
      ${softworkerStatuses.map(sw => `
        <div class="drawer-agent-row">
          <div class="drawer-agent-avatar">${sw.name.charAt(0).toUpperCase()}</div>
          <div class="drawer-agent-info">
            <div class="drawer-agent-name">${sw.name}</div>
            <div class="drawer-agent-activity">${sw.activity}</div>
          </div>
          <span class="status-pulse-dot ${sw.statusClass}"></span>
        </div>
      `).join('')}
    `;
  } else if (tab === 'feed') {
    const feed = state.activityFeed.filter(a => a.workspaceId === activeWorkspace.id);
    body.innerHTML = `
      <div class="drawer-section-label">workspace activity</div>
      ${feed.length === 0 ? `
        <div style="font-size:12px; color:var(--color-text-tertiary); padding:16px 0;">No recent activity.</div>
      ` : feed.map(act => `
        <div class="drawer-feed-row">
          <i class="ti ti-history drawer-feed-icon"></i>
          <div class="drawer-feed-text">
            ${act.content}
            <span class="drawer-feed-time">${act.time}</span>
          </div>
        </div>
      `).join('')}
    `;
  }
}

// --- THEME SYNC ---
function detectSystemTheme() {
  // Default is always light mode. Respect user's saved preference if they've changed it.
  const savedTheme = localStorage.getItem('sw-theme');
  setTheme(savedTheme === 'dark' ? 'dark' : 'light');
}

function toggleTheme() {
  const current = state.theme;
  setTheme(current === 'light' ? 'dark' : 'light');
}

function setTheme(theme) {
  state.theme = theme;
  // Persist user preference
  localStorage.setItem('sw-theme', theme);
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    document.getElementById('theme-icon-light').style.display = 'block';
    document.getElementById('theme-icon-dark').style.display = 'none';
  } else {
    document.body.classList.remove('dark-theme');
    document.getElementById('theme-icon-light').style.display = 'none';
    document.getElementById('theme-icon-dark').style.display = 'block';
  }
}

// --- SHARED COMPONENTS RENDERING ---

// Helper to resolve icon for permissions
function getPermissionIcon(permission) {
  if (permission === 'Auto-review') return 'ti-shield-code';
  if (permission === 'Full access') return 'ti-shield-exclamation';
  return 'ti-hand-finger'; // Default permissions
}

function getPermissionClass(permission) {
  if (permission === 'Auto-review') return 'perm-auto-review';
  if (permission === 'Full access') return 'perm-full-access';
  return '';
}

// Prompt Box Component HTML Generator
function getPromptBoxHTML(placeholder = 'give a goal, or press "+" to configure...', customId = 'main-prompt') {
  return `
    <div class="prompt-box-wrapper" id="${customId}-wrapper">
      <div class="chips-row${state.activeChips.length === 0 ? ' hidden' : ''}" id="${customId}-chips">
        ${state.activeChips.map(c => `
          <span class="prompt-chip">
            <i class="ti ${c.icon || 'ti-tag'} prompt-chip-icon"></i>
            <span>${c.label}</span>
            <button class="prompt-chip-remove" onclick="removePromptChip('${c.id}')">×</button>
          </span>
        `).join('')}
      </div>
      
      <div contenteditable="true" 
           class="text-input-editable" 
           id="${customId}-input" 
           placeholder="${placeholder}"
           oninput="handlePromptInput(event, '${customId}')"
           onkeydown="handlePromptKeydown(event, '${customId}')"></div>
      
      <div class="prompt-actions-row">
        <div class="actions-left-group">
          <button class="action-btn relative" id="${customId}-btn-plus" onclick="togglePlusMenu(event, '${customId}')">
            <i class="ti ti-plus"></i>
          </button>
          
          <!-- Permissions Selector Dropdown -->
          <div class="prompt-dropdown-container">
            <button class="prompt-dropdown-trigger ${getPermissionClass(state.selectedPermission)}" onclick="togglePermissionDropdown(event, '${customId}')" id="${customId}-btn-permission">
              <i class="ti ${getPermissionIcon(state.selectedPermission)}"></i>
              <span>${state.selectedPermission}</span>
              <i class="ti ti-chevron-down"></i>
            </button>
          </div>
        </div>
        
        <div class="actions-right-group">
          <!-- Intelligence Selector Dropdown -->
          <div class="prompt-dropdown-container">
            <button class="prompt-dropdown-trigger" onclick="toggleIntelligenceDropdown(event, '${customId}')" id="${customId}-btn-intelligence">
              <span>${state.selectedIntelligence}</span>
              <i class="ti ti-chevron-down"></i>
            </button>
          </div>
          
          <button class="action-btn" data-tooltip="voice inputs" onclick="simulateVoiceInput('${customId}')">
            <i class="ti ti-microphone"></i>
          </button>
          
          <button class="btn-send" id="${customId}-btn-send" onclick="submitPrompt('${customId}')" disabled>
            <i class="ti ti-arrow-up"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// --- CHIPS ROW AND PLUS MENU ---
function removePromptChip(chipId) {
  state.activeChips = state.activeChips.filter(c => c.id !== chipId);
  renderView(); // re-render the view to update prompt state
}

function triggerAttachFileAction(promptId) {
  // Close the plus menu
  const dropdown = document.getElementById('plus-menu-dropdown');
  if (dropdown) dropdown.remove();

  // Simulate selecting a file to attach as a chip
  const mockFiles = ['financial_q1_statement.xlsx', 'invoice_2026_audit.pdf', 'employee_roles_ledger.csv'];
  const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
  addChipFromMenu(randomFile, 'doc', 'ti-paperclip', promptId);
  
  showNotification(`simulated attaching: ${randomFile}`);
}

function simulateVoiceInput(promptId) {
  showNotification('🎤 listening for goals... (speak now)');
  setTimeout(() => {
    const input = document.getElementById(`${promptId}-input`);
    if (input) {
      input.textContent = 'analyze financial anomalies in q1 logs';
      // Trigger input event to enable send button
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
      showNotification('🎤 captured goal: "analyze financial anomalies in q1 logs"');
    }
  }, 2000);
}

function togglePermissionDropdown(event, promptId) {
  event.stopPropagation();
  closeAllDropdowns();
  
  const existing = document.getElementById('permission-dropdown-menu');
  if (existing) {
    existing.remove();
    return;
  }
  
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  
  const dropdown = document.createElement('div');
  dropdown.id = 'permission-dropdown-menu';
  dropdown.className = 'prompt-select-dropdown';
  dropdown.style.left = `${rect.left}px`;
  dropdown.style.top = `${rect.top + window.scrollY - 130}px`; // position above
  
  const options = ['Default permissions', 'Auto-review', 'Full access'];
  dropdown.innerHTML = options.map(opt => {
    const isSelected = state.selectedPermission === opt;
    const icon = getPermissionIcon(opt);
    const colorClass = getPermissionClass(opt);
    return `
      <button class="prompt-select-item ${colorClass}" onclick="selectPermissionOption('${opt}', '${promptId}')">
        <div class="prompt-select-item-left">
          <i class="ti ${icon}"></i>
          <span>${opt}</span>
        </div>
        ${isSelected ? '<i class="ti ti-check check-icon"></i>' : ''}
      </button>
    `;
  }).join('');
  
  document.body.appendChild(dropdown);
  
  document.addEventListener('click', closePermissionDropdownOutside);
}

function closePermissionDropdownOutside(event) {
  const dropdown = document.getElementById('permission-dropdown-menu');
  if (dropdown && !dropdown.contains(event.target)) {
    dropdown.remove();
    document.removeEventListener('click', closePermissionDropdownOutside);
  }
}

function selectPermissionOption(opt, promptId) {
  const dropdown = document.getElementById('permission-dropdown-menu');
  if (dropdown) dropdown.remove();

  if (opt === 'Full access') {
    openModal('full-access-modal');
    return;
  }
  
  state.selectedPermission = opt;
  // Re-render views to reflect selection
  renderView();
  showNotification(`permissions set to: ${opt}`);
}

function confirmFullAccess() {
  state.selectedPermission = 'Full access';
  closeModal('full-access-modal');
  renderView();
  showNotification(`permissions set to: Full access`);
}

function toggleIntelligenceDropdown(event, promptId) {
  event.stopPropagation();
  closeAllDropdowns();
  
  const existing = document.getElementById('intelligence-dropdown-menu');
  if (existing) {
    existing.remove();
    return;
  }
  
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  
  const dropdown = document.createElement('div');
  dropdown.id = 'intelligence-dropdown-menu';
  dropdown.className = 'prompt-select-dropdown';
  dropdown.style.left = `${rect.left}px`;
  dropdown.style.top = `${rect.top + window.scrollY - 165}px`; // position above
  
  const options = ['Low', 'Medium', 'High', 'Extra High'];
  dropdown.innerHTML = `
    <div class="prompt-dropdown-header">intelligence</div>
    ` + options.map(opt => {
      const isSelected = state.selectedIntelligence === opt;
      return `
        <button class="prompt-select-item" onclick="selectIntelligenceOption('${opt}', '${promptId}')">
          <span>${opt}</span>
          ${isSelected ? '<i class="ti ti-check check-icon"></i>' : ''}
        </button>
      `;
    }).join('');
  
  document.body.appendChild(dropdown);
  
  document.addEventListener('click', closeIntelligenceDropdownOutside);
}

function closeIntelligenceDropdownOutside(event) {
  const dropdown = document.getElementById('intelligence-dropdown-menu');
  if (dropdown && !dropdown.contains(event.target)) {
    dropdown.remove();
    document.removeEventListener('click', closeIntelligenceDropdownOutside);
  }
}

function selectIntelligenceOption(opt, promptId) {
  state.selectedIntelligence = opt;
  const dropdown = document.getElementById('intelligence-dropdown-menu');
  if (dropdown) dropdown.remove();
  
  // Re-render views to reflect selection
  renderView();
  showNotification(`intelligence level set to: ${opt}`);
}

let activeSubmenu = null;
let hideSubmenuTimeout = null;

function showAgentsSubmenu(event, promptId) {
  clearTimeout(hideSubmenuTimeout);
  
  // Remove any existing submenu
  removeActiveSubmenu();
  
  const menuItem = event.currentTarget;
  const itemRect = menuItem.getBoundingClientRect();
  
  const submenu = document.createElement('div');
  submenu.id = 'plus-submenu-dropdown';
  submenu.className = 'chip-menu-dropdown submenu';
  
  // Position to the right of the menu item
  submenu.style.left = `${itemRect.right + 4}px`;
  submenu.style.top = `${itemRect.top + window.scrollY}px`;
  
  // Listeners to keep submenu open on hover
  submenu.addEventListener('mouseenter', () => clearTimeout(hideSubmenuTimeout));
  submenu.addEventListener('mouseleave', (e) => hideSubmenuDelayed(e));
  
  // Generate recent agents list (up to 5)
  const recentAgents = state.agents.slice(0, 5);
  
  let itemsHTML = recentAgents.map(ag => `
    <button class="chip-menu-item" onclick="addChipFromMenu('${ag.name}', 'agent', '${getAgentIcon(ag.category)}', '${promptId}')">
      <i class="ti ${getAgentIcon(ag.category)}"></i>
      <span>${ag.name}</span>
    </button>
  `).join('');
  
  // Add show more button
  itemsHTML += `
    <hr style="border: none; border-top: 0.5px solid var(--color-border-secondary); margin: 4px 0;">
    <button class="chip-menu-item special" onclick="showAllAgentsList('${promptId}')">
      <i class="ti ti-dots"></i>
      <span>show more</span>
    </button>
  `;
  
  submenu.innerHTML = itemsHTML;
  document.body.appendChild(submenu);
  activeSubmenu = submenu;
}

function showSkillsSubmenu(event, promptId) {
  clearTimeout(hideSubmenuTimeout);
  
  // Remove any existing submenu
  removeActiveSubmenu();
  
  const menuItem = event.currentTarget;
  const itemRect = menuItem.getBoundingClientRect();
  
  const submenu = document.createElement('div');
  submenu.id = 'plus-submenu-dropdown';
  submenu.className = 'chip-menu-dropdown submenu';
  
  // Position to the right of the menu item
  submenu.style.left = `${itemRect.right + 4}px`;
  submenu.style.top = `${itemRect.top + window.scrollY}px`;
  
  // Listeners to keep submenu open on hover
  submenu.addEventListener('mouseenter', () => clearTimeout(hideSubmenuTimeout));
  submenu.addEventListener('mouseleave', (e) => hideSubmenuDelayed(e));
  
  // Generate recent skills list (up to 5)
  const recentSkills = state.skills.slice(0, 5);
  
  let itemsHTML = recentSkills.map(sk => `
    <button class="chip-menu-item" onclick="addChipFromMenu('${sk.name}', 'skill', 'ti-file-description', '${promptId}')">
      <i class="ti ti-file-description"></i>
      <span>${sk.name}</span>
    </button>
  `).join('');
  
  // Add manage and add skill actions
  itemsHTML += `
    <hr style="border: none; border-top: 0.5px solid var(--color-border-secondary); margin: 4px 0;">
    <button class="chip-menu-item" onclick="manageSkillsAction('${promptId}')">
      <i class="ti ti-briefcase"></i>
      <span>manage skills</span>
    </button>
    <button class="chip-menu-item" onclick="addSkillAction('${promptId}')">
      <i class="ti ti-plus"></i>
      <span>add skill</span>
    </button>
  `;
  
  submenu.innerHTML = itemsHTML;
  document.body.appendChild(submenu);
  activeSubmenu = submenu;
}

function showToolsSubmenu(event, promptId) {
  clearTimeout(hideSubmenuTimeout);
  removeActiveSubmenu();

  const menuItem = event.currentTarget;
  const itemRect = menuItem.getBoundingClientRect();

  const submenu = document.createElement('div');
  submenu.id = 'plus-submenu-dropdown';
  submenu.className = 'chip-menu-dropdown submenu';
  submenu.style.left = `${itemRect.right + 4}px`;
  submenu.style.top = `${itemRect.top + window.scrollY}px`;

  submenu.addEventListener('mouseenter', () => clearTimeout(hideSubmenuTimeout));
  submenu.addEventListener('mouseleave', (e) => hideSubmenuDelayed(e));

  let itemsHTML = state.tools.map(conn => `
    <div class="chip-menu-item tool-row">
      <div style="display:flex;align-items:center;gap:8px;flex:1">
        <i class="ti ${conn.icon}"></i>
        <span>${conn.name}</span>
      </div>
      <label class="tool-toggle" onclick="event.stopPropagation()">
        <input type="checkbox" ${conn.enabled ? 'checked' : ''} onchange="toggleTool('${conn.id}', this.checked)">
        <span class="tool-slider"></span>
      </label>
    </div>
  `).join('');

  itemsHTML += `
    <hr style="border: none; border-top: 0.5px solid var(--color-border-secondary); margin: 4px 0;">
    <button class="chip-menu-item" onclick="manageToolsAction()">
      <i class="ti ti-settings"></i>
      <span>manage tools</span>
    </button>
    <button class="chip-menu-item" onclick="addToolAction()">
      <i class="ti ti-plus"></i>
      <span>add tool</span>
    </button>
  `;

  submenu.innerHTML = itemsHTML;
  document.body.appendChild(submenu);
  activeSubmenu = submenu;
}

function toggleTool(connId, enabled) {
  const conn = state.tools.find(c => c.id === connId);
  if (conn) {
    conn.enabled = enabled;
    showNotification(`${conn.name} tool ${enabled ? 'enabled' : 'disabled'}`);
  }
}

function manageToolsAction() {
  removeActiveSubmenu();
  closeAllDropdowns();
  openDirectoryModal('tools');
}

function addToolAction() {
  removeActiveSubmenu();
  closeAllDropdowns();
  showNotification('opening add tool wizard...');
}


function hideSubmenuDelayed(event) {
  hideSubmenuTimeout = setTimeout(() => {
    removeActiveSubmenu();
  }, 250); // short delay to allow moving mouse into submenu
}


function removeActiveSubmenu() {
  const submenu = document.getElementById('plus-submenu-dropdown');
  if (submenu) {
    submenu.remove();
  }
  activeSubmenu = null;
}

// Helper for agent category icons
function getAgentIcon(category) {
  if (category === 'finance_agent') return 'ti-currency-dollar';
  if (category === 'hr_agent') return 'ti-heart';
  if (category === 'sales_agent') return 'ti-chart-line';
  if (category === 'it_agent') return 'ti-device-laptop';
  return 'ti-robot';
}

function showAllAgentsList(promptId) {
  removeActiveSubmenu();
  closeAllDropdowns();
  showNotification("Navigating to all agents dashboard...");
  location.hash = '#/agents';
}

function manageSkillsAction(promptId) {
  removeActiveSubmenu();
  closeAllDropdowns();
  openDirectoryModal('skills');
}

function addSkillAction(promptId) {
  removeActiveSubmenu();
  closeAllDropdowns();
  showNotification('opening skill creator...');
  location.hash = '#/create-skill';
}

function showAllSkillsList(promptId) {
  removeActiveSubmenu();
  closeAllDropdowns();
  showNotification("Navigating to all skills workspace...");
  location.hash = '#/agents';
}

function togglePlusMenu(event, promptId) {
  event.stopPropagation();
  closeAllDropdowns();
  
  // Clear any existing menu first
  const existing = document.getElementById('plus-menu-dropdown');
  if (existing) {
    existing.remove();
    return;
  }
  
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  
  const dropdown = document.createElement('div');
  dropdown.id = 'plus-menu-dropdown';
  dropdown.className = 'chip-menu-dropdown';
  dropdown.style.left = `${rect.left}px`;
  dropdown.style.top = `${rect.top + window.scrollY - 200}px`; // position above
  
  // Listeners to prevent submenu closing when hovering main menu
  dropdown.addEventListener('mouseenter', () => clearTimeout(hideSubmenuTimeout));
  
  dropdown.innerHTML = `
    <button class="chip-menu-item" onclick="triggerAttachFileAction('${promptId}')">
      <i class="ti ti-paperclip"></i>
      <span>attach file</span>
      <span class="chip-menu-meta">@attachment</span>
    </button>
    <hr style="border: none; border-top: 0.5px solid var(--color-border-secondary); margin: 4px 0;">
    
    <button class="chip-menu-item has-submenu" onmouseenter="showAgentsSubmenu(event, '${promptId}')" onmouseleave="hideSubmenuDelayed(event)">
      <div style="display: flex; align-items: center; gap: 8px;">
        <i class="ti ti-robot"></i>
        <span>Agents</span>
      </div>
      <i class="ti ti-chevron-right submenu-arrow"></i>
    </button>
    
    <button class="chip-menu-item has-submenu" onmouseenter="showSkillsSubmenu(event, '${promptId}')" onmouseleave="hideSubmenuDelayed(event)">
      <div style="display: flex; align-items: center; gap: 8px;">
        <i class="ti ti-file-description"></i>
        <span>Skills</span>
      </div>
      <i class="ti ti-chevron-right submenu-arrow"></i>
    </button>
    
    <button class="chip-menu-item has-submenu" onmouseenter="showToolsSubmenu(event, '${promptId}')" onmouseleave="hideSubmenuDelayed(event)">
      <div style="display: flex; align-items: center; gap: 8px;">
        <i class="ti ti-tool"></i>
        <span>Tools</span>
      </div>
      <i class="ti ti-chevron-right submenu-arrow"></i>
    </button>
    
    <hr style="border: none; border-top: 0.5px solid var(--color-border-secondary); margin: 4px 0;">
    
    <button class="chip-menu-item special" onclick="selectSpecialOption('create-agent')">
      <i class="ti ti-plus"></i>
      <span>create agent</span>
      <span class="chip-menu-meta">@create agent</span>
    </button>
    <button class="chip-menu-item special" onclick="selectSpecialOption('create-skill')">
      <i class="ti ti-plus"></i>
      <span>create skill</span>
      <span class="chip-menu-meta">@create skill</span>
    </button>
  `;
  
  document.body.appendChild(dropdown);
  
  // Close menu when clicking outside
  document.addEventListener('click', closePlusMenuOutside);
}

function closePlusMenuOutside(event) {
  const dropdown = document.getElementById('plus-menu-dropdown');
  if (dropdown && !dropdown.contains(event.target)) {
    dropdown.remove();
    document.removeEventListener('click', closePlusMenuOutside);
  }
}

function addChipFromMenu(label, type, icon, promptId) {
  const chip = {
    id: 'chip_' + Date.now(),
    label: label,
    type: type,
    icon: icon
  };
  state.activeChips.push(chip);
  
  const dropdown = document.getElementById('plus-menu-dropdown');
  if (dropdown) dropdown.remove();
  
  renderView();
  
  // Auto focus contenteditable
  setTimeout(() => {
    const input = document.getElementById(`${promptId}-input`);
    if (input) input.focus();
  }, 50);
}

function selectSpecialOption(route) {
  const dropdown = document.getElementById('plus-menu-dropdown');
  if (dropdown) dropdown.remove();
  
  window.location.hash = `#/${route}`;
}

// Handle prompt highlights and activations
function handlePromptInput(event, promptId) {
  const input = event.currentTarget;
  const sendBtn = document.getElementById(`${promptId}-btn-send`);
  const text = input.innerText.trim();
  
  // Enable / disable send button
  if (text.length > 0) {
    sendBtn.removeAttribute('disabled');
  } else {
    sendBtn.setAttribute('disabled', 'true');
  }
  
  // Inline mentions parsing (simulated highlight on specific words)
  const query = input.innerText;
  if (query.endsWith('@') || query.includes('@')) {
    // Optional popup for auto-complete can be integrated here
  }
}

function handlePromptKeydown(event, promptId) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    submitPrompt(promptId);
  }
}

function submitPrompt(promptId) {
  const input = document.getElementById(`${promptId}-input`);
  if (!input) return;
  const text = input.innerText.trim();
  if (text.length === 0) return;
  
  if (text.toLowerCase().includes('@create workstream')) {
    state.activeCreationForm = 'workstream';
    input.innerText = '';
    
    // Reset send button state
    const sendBtn = document.getElementById(`${promptId}-btn-send`);
    if (sendBtn) sendBtn.setAttribute('disabled', 'true');
    
    renderView();
    showToast('configuring new workstream workflow...');
    return;
  }
  
  if (promptId === 'workstream-composer') {
    input.innerText = '';
    const sendBtn = document.getElementById(`${promptId}-btn-send`);
    if (sendBtn) sendBtn.setAttribute('disabled', 'true');
    
    const wst = state.workstreams.find(w => w.id === state.activeWorkstreamId);
    if (!wst) return;
    
    wst.messages.push({
      id: 'msg_h_' + Date.now(),
      sender: 'Alex Rivers',
      senderType: 'human',
      role: 'owner',
      avatarColor: '#854F0B',
      time: 'just now',
      content: text
    });
    
    state.activeChips = [];
    renderView();
    
    setTimeout(() => {
      wst.messages.push({
        id: 'msg_a_ack_' + Date.now(),
        sender: 'Finance reviewer',
        senderType: 'agent',
        time: 'just now',
        content: `Instruction received. Directing my execution modules to process your command: "${text}".`
      });
      renderView();
    }, 1000);
    return;
  }
  
  if (state.activeView === 'create_agent') {
    // Creating agent flow submission
    const agentName = text.split(' ')[0] || 'custom analyst';
    const newAgent = {
      id: 'ag_' + Date.now(),
      name: agentName + ' agent',
      category: 'ops_agent', // default ops category
      status: 'active',
      desc: text,
      lastRun: 'just now',
      runsThisMonth: 0,
      approvalRate: '100%'
    };
    state.agents.push(newAgent);
    state.activeChips = [];
    showToast(`agent "${newAgent.name}" created successfully`);
    window.location.hash = '#/agents';
  } else if (state.activeView === 'create_skill') {
    // Creating skill flow submission
    const skillName = text.split(' ')[0] || 'custom skill';
    const newSkill = {
      id: 'sk_' + Date.now(),
      name: skillName,
      desc: text
    };
    state.skills.push(newSkill);
    state.activeChips = [];
    showToast(`skill "${newSkill.name}" defined successfully`);
    window.location.hash = '#/agents';
  } else {
    // Normal Run Goals Submission
    const newChatId = 'chat_' + Date.now();
    const activeAgent = state.activeChips.find(c => c.type === 'agent') || { label: 'finance reviewer', type: 'agent' };
    const agentCat = activeAgent.label === 'hr onboarder' ? 'hr_agent' : 'finance_agent';
    
    const newChat = {
      id: newChatId,
      projectId: state.activeView === 'project_detail' ? state.activeProjectId : null,
      title: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
      status: 'running',
      elapsed: 'running now',
      agent: { name: activeAgent.label, category: agentCat },
      collaborators: ['AR'],
      messages: [
        {
          id: 'm_' + Date.now(),
          sender: 'user',
          senderName: 'alex rivers',
          avatarType: 'user',
          avatarColor: 'purple',
          avatarInitials: 'AR',
          timestamp: 'just now',
          content: text
        }
      ]
    };
    
    state.chats.unshift(newChat);
    state.activeChips = [];
    renderRecentChatsList();
    
    // Redirect to Chat view and trigger simulation!
    window.location.hash = `#/chats/${newChatId}`;
    
    setTimeout(() => {
      triggerGoalSimulation(newChatId);
    }, 1000);
  }
}

function renderSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  if (!sidebar) return;

  const activeWorkspace = state.workspaces.find(w => w.id === state.activeWorkspaceId) || state.workspaces[0];

  // 1. Brand Header
  let html = `
    <div class="sidebar-brand">
      <div class="brand-logo">S</div>
      <span class="brand-name">softworker.ai</span>
    </div>
  `;

  // Start the scrollable middle navigation wrapper!
  html += `
    <div class="sidebar-scrollable-content">
  `;

  // 2. First Tier: MY DESK Section
  const deskCollapsed = state.collapsedSections.mydesk;
  const inMyDesk = state.inMyDesk;
  html += `
    <div class="sidebar-section-container my-desk-section">
      <div class="sidebar-section-title-wrapper" onclick="toggleSidebarSection('mydesk')">
        <span class="sidebar-section-title">my desk</span>
        <i class="ti ti-chevron-down section-chevron ${deskCollapsed ? 'collapsed' : ''}"></i>
      </div>
      ${!deskCollapsed ? `
        <ul class="sidebar-nav-list">
          <li>
            <a href="#/mydesk/chats" class="nav-item ${inMyDesk && state.myDeskView === 'chats' ? 'active' : ''}">
              <i class="ti ti-message"></i>
              <span>private chats</span>
            </a>
          </li>
          <li>
            <a href="#/mydesk/workstreams" class="nav-item ${inMyDesk && state.myDeskView === 'workstreams' ? 'active' : ''}">
              <i class="ti ti-route"></i>
              <span>personal workstreams</span>
            </a>
          </li>
          <li>
            <a href="#/mydesk/skills" class="nav-item ${inMyDesk && state.myDeskView === 'skills' ? 'active' : ''}">
              <i class="ti ti-code"></i>
              <span>draft skills</span>
            </a>
          </li>
          <li>
            <a href="#/mydesk/outputs" class="nav-item ${inMyDesk && state.myDeskView === 'outputs' ? 'active' : ''}">
              <i class="ti ti-archive"></i>
              <span>draft outputs</span>
            </a>
          </li>
        </ul>
      ` : ''}
    </div>
  `;

  // 3. Second Tier: WORKSPACE SWITCHER
  html += `
    <div class="workspace-switcher-wrapper">
      <div class="workspace-switcher-card ${state.workspaceSwitcherOpen ? 'open' : ''}" onclick="toggleWorkspaceSwitcher(event)">
        <div class="workspace-switcher-left">
          <span class="workspace-color-dot" style="background-color: ${activeWorkspace.color}"></span>
          <div style="display:flex; flex-direction:column; overflow:hidden;">
            <span class="workspace-switcher-name" style="text-align:left;">${activeWorkspace.name}</span>
            <span style="font-size:10px; color:var(--color-text-secondary); text-align:left;">${activeWorkspace.role}</span>
          </div>
        </div>
        <i class="ti ti-selector"></i>
      </div>
      
      ${state.workspaceSwitcherOpen ? `
        <div class="workspace-switcher-dropdown" id="ws-switcher-dropdown">
          <div style="font-size:10.5px; font-weight:500; letter-spacing:0.04em; color:var(--color-text-tertiary); padding:6px 10px 4px 10px; text-transform:uppercase;">switch workspace</div>
          ${state.workspaces.map(ws => {
            const isActive = ws.id === state.activeWorkspaceId && !inMyDesk;
            return `
              <button class="workspace-select-item" onclick="selectWorkspace('${ws.id}')">
                <div class="workspace-select-left">
                  <span class="workspace-color-dot" style="background-color: ${ws.color}"></span>
                  <div style="display:flex; flex-direction:column; overflow:hidden;">
                    <span style="font-size:12.5px; font-weight:500; color:var(--color-text-primary); white-space:nowrap; text-overflow:ellipsis; overflow:hidden; text-align:left;">${ws.name}</span>
                    <span style="font-size:10.5px; color:var(--color-text-secondary); margin-top:1px; text-align:left;">${ws.members} members</span>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <span class="workspace-role-chip">${ws.role}</span>
                  ${isActive ? '<i class="ti ti-check check-icon"></i>' : ''}
                </div>
              </button>
            `;
          }).join('')}
          <div class="workspace-switcher-divider"></div>
          <button class="workspace-switcher-action-item" onclick="createWorkspacePrompt(event)">
            <i class="ti ti-plus"></i>
            <span>create workspace</span>
          </button>
          <button class="workspace-switcher-action-item" onclick="joinWorkspacePrompt(event)">
            <i class="ti ti-enter"></i>
            <span>join workspace</span>
          </button>
        </div>
      ` : ''}
    </div>
  `;

  // 4. Third Tier: CONTEXTUAL WORKSPACE NAVIGATION
  const workstreamsCollapsed = state.collapsedSections.workstreams;
  const wsWorkstreams = state.workstreams.filter(wst => wst.workspaceId === state.activeWorkspaceId);
  const pendingReviewsCount = state.reviews.filter(r => r.workspaceId === state.activeWorkspaceId && r.status === 'pending').length;

  html += `
    <div class="sidebar-section-container workspace-nav-section ${inMyDesk ? 'disabled' : ''}">
      <ul class="sidebar-nav-list" style="list-style:none;">
        <li>
          <a href="#/home" class="nav-item ${!inMyDesk && state.activeView === 'home' ? 'active' : ''}">
            <i class="ti ti-home"></i>
            <span>home</span>
          </a>
        </li>
        <li>
          <a href="#/workspace/global" class="nav-item ${!inMyDesk && state.activeView === 'global_channel' ? 'active' : ''}">
            <i class="ti ti-hash"></i>
            <span>global triage</span>
          </a>
        </li>
        
        <li>
          <div class="sidebar-submenu-header" onclick="toggleSidebarSection('workstreams')">
            <div style="display:flex;align-items:center;gap:8px">
              <i class="ti ti-route"></i>
              <span class="title">workstreams</span>
            </div>
            <div style="display:flex;align-items:center;gap:4px" onclick="event.stopPropagation()">
              <button class="submenu-action-btn" onclick="createWorkstreamPrompt(event, '${state.activeWorkspaceId}')" data-tooltip="new workstream">
                <i class="ti ti-plus"></i>
              </button>
              <i class="ti ti-chevron-down submenu-chevron ${workstreamsCollapsed ? 'collapsed' : ''}"></i>
            </div>
          </div>
          
          ${!workstreamsCollapsed ? `
            <ul class="sidebar-submenu-list">
              ${wsWorkstreams.map(wst => {
                const isActive = !inMyDesk && state.activeView === 'workstream' && state.activeWorkstreamId === wst.id;
                let statusClass = 'status-idle';
                if (wst.status === 'running') statusClass = 'status-active';
                if (wst.status === 'paused') statusClass = 'status-paused';
                if (wst.status === 'blocked') statusClass = 'status-blocked';
                
                return `
                  <li>
                    <a href="#/workspace/${state.activeWorkspaceId}/workstream/${wst.id}" class="sidebar-submenu-item ${isActive ? 'active' : ''}">
                      <span class="workstream-pulse-dot ${statusClass}"></span>
                      <span class="title" style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:left;">${wst.name}</span>
                      ${wst.activeRuns > 0 ? `<span class="runs-badge" style="background:var(--color-accent-blue); color:#fff; font-size:10px; padding:1px 4px; border-radius:10px;">${wst.activeRuns}</span>` : ''}
                    </a>
                  </li>
                `;
              }).join('')}
            </ul>
          ` : ''}
        </li>

        <li>
          <a href="#/workspace/skills" class="nav-item ${!inMyDesk && state.activeView === 'workspace_skills' ? 'active' : ''}">
            <i class="ti ti-code"></i>
            <span>skills</span>
          </a>
        </li>
        <li>
          <a href="#/workspace/softworkers" class="nav-item ${!inMyDesk && state.activeView === 'agents' ? 'active' : ''}">
            <i class="ti ti-users"></i>
            <span>softworkers</span>
            <span class="badge badge-neutral" style="margin-left:auto;">${state.agents.length}</span>
          </a>
        </li>
        <li>
          <a href="#/workspace/reviews" class="nav-item ${!inMyDesk && state.activeView === 'reviews' ? 'active' : ''}">
            <i class="ti ti-check"></i>
            <span>reviews</span>
            ${pendingReviewsCount > 0 ? `<span class="badge badge-amber" style="margin-left:auto;">${pendingReviewsCount}</span>` : ''}
          </a>
        </li>
        <li>
          <a href="#/workspace/outputs" class="nav-item ${!inMyDesk && state.activeView === 'workspace_outputs' ? 'active' : ''}">
            <i class="ti ti-archive"></i>
            <span>outputs</span>
          </a>
        </li>
        <li>
          <a href="#/workspace/knowledge" class="nav-item ${!inMyDesk && state.activeView === 'workspace_knowledge' ? 'active' : ''}">
            <i class="ti ti-book"></i>
            <span>knowledge</span>
          </a>
        </li>
        <li>
          <a href="#/workspace/settings" class="nav-item ${!inMyDesk && state.activeView === 'workspace_settings' ? 'active' : ''}">
            <i class="ti ti-settings"></i>
            <span>settings</span>
          </a>
        </li>
      </ul>
    </div>

    </div>
  `;

  // 5. Sidebar Footer
  html += `
    <div class="sidebar-footer">
      <div class="user-avatar user-color-purple">AR</div>
      <div class="user-details">
        <div class="user-name">alex rivers</div>
        <div class="user-org">acme corp</div>
      </div>
    </div>
  `;

  sidebar.innerHTML = html;
}

// Collapsible helper
function toggleSidebarSection(section) {
  state.collapsedSections[section] = !state.collapsedSections[section];
  renderSidebar();
}

function toggleWorkspaceSwitcher(event) {
  event.stopPropagation();
  state.workspaceSwitcherOpen = !state.workspaceSwitcherOpen;
  renderSidebar();
}

function selectWorkspace(wsId) {
  state.activeWorkspaceId = wsId;
  state.inMyDesk = false;
  state.workspaceSwitcherOpen = false;
  window.location.hash = '#/home';
  renderSidebar();
}

function createWorkspacePrompt(event) {
  event.stopPropagation();
  const name = prompt('Enter new workspace name:');
  if (name && name.trim()) {
    const colors = ['#185FA5', '#D97706', '#8B5CF6', '#0D9488', '#EA580C', '#E11D48'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newWs = {
      id: 'ws_' + Date.now(),
      name: name.trim(),
      color: randomColor,
      role: 'admin',
      members: 1
    };
    state.workspaces.push(newWs);
    state.activeWorkspaceId = newWs.id;
    state.inMyDesk = false;
    state.workspaceSwitcherOpen = false;
    window.location.hash = '#/home';
    renderSidebar();
    showToast(`Workspace "${name}" created!`);
  }
}

function joinWorkspacePrompt(event) {
  event.stopPropagation();
  const code = prompt('Enter workspace invite code:');
  if (code && code.trim()) {
    showToast('Simulating workspace invite validation...');
    setTimeout(() => {
      const newWs = {
        id: 'ws_' + Date.now(),
        name: 'Shared Workspace ' + code.trim().toUpperCase(),
        color: '#D97706',
        role: 'editor',
        members: 8
      };
      state.workspaces.push(newWs);
      state.activeWorkspaceId = newWs.id;
      state.inMyDesk = false;
      state.workspaceSwitcherOpen = false;
      window.location.hash = '#/home';
      renderSidebar();
      showToast(`Joined workspace "${newWs.name}"!`);
    }, 800);
  }
}

function createWorkstreamPrompt(event, wsId) {
  event.stopPropagation();
  const name = prompt('Enter new workstream name:');
  if (name && name.trim()) {
    const newWst = {
      id: 'wst_' + Date.now(),
      workspaceId: wsId,
      name: name.trim().toLowerCase(),
      icon: 'ti-route',
      status: 'running',
      lastActive: 'just now',
      runsCount: 0,
      activeRuns: 0,
      pendingReviews: 0
    };
    state.workstreams.push(newWst);
    renderSidebar();
    showToast(`Workstream "${name}" created!`);
  }
}

function renderRecentChatsList() {
  renderSidebar();
}

// Collapsible helper
function toggleProjectCollapse(projectId) {
  state.collapsedProjects[projectId] = !state.collapsedProjects[projectId];
  renderRecentChatsList();
}

function closeAllDropdowns() {
  const existingChatMenu = document.getElementById('sidebar-chat-dropdown');
  if (existingChatMenu) existingChatMenu.remove();
  
  const existingProjMenu = document.getElementById('sidebar-project-dropdown');
  if (existingProjMenu) existingProjMenu.remove();

  const existingPlus = document.getElementById('plus-menu-dropdown');
  if (existingPlus) existingPlus.remove();

  const existingPermission = document.getElementById('permission-dropdown-menu');
  if (existingPermission) existingPermission.remove();

  const existingIntel = document.getElementById('intelligence-dropdown-menu');
  if (existingIntel) existingIntel.remove();

  const existingSubmenu = document.getElementById('plus-submenu-dropdown');
  if (existingSubmenu) existingSubmenu.remove();

  if (state.workspaceSwitcherOpen) {
    state.workspaceSwitcherOpen = false;
    renderSidebar();
  }
}

// Add global listener to close dropdowns when clicking outside
document.addEventListener('click', closeAllDropdowns);

function openSidebarChatDropdown(event, chatId) {
  event.preventDefault();
  event.stopPropagation();
  
  closeAllDropdowns();
  
  const chat = state.chats.find(c => c.id === chatId);
  if (!chat) return;
  
  const dropdown = document.createElement('div');
  dropdown.className = 'options-dropdown-menu';
  dropdown.id = 'sidebar-chat-dropdown';
  
  const isPinned = chat.pinned === true;
  
  dropdown.innerHTML = `
    <button class="options-dropdown-item" onclick="togglePinChat('${chat.id}')">
      <i class="ti ti-pin"></i>
      <span>${isPinned ? 'unpin' : 'pin'}</span>
    </button>
    <button class="options-dropdown-item" onclick="renameChatPrompt('${chat.id}')">
      <i class="ti ti-pencil"></i>
      <span>rename</span>
    </button>
    <button class="options-dropdown-item" onclick="addChatToProjectPrompt('${chat.id}')">
      <i class="ti ti-folder"></i>
      <span>add to project</span>
    </button>
    <button class="options-dropdown-item" onclick="openShareModal('${chat.id}')">
      <i class="ti ti-share-2"></i>
      <span>share</span>
    </button>

    <hr style="border: none; border-top: 0.5px solid var(--color-border-secondary); margin: 4px 0;">
    <button class="options-dropdown-item danger" onclick="deleteChatAction('${chat.id}')">
      <i class="ti ti-trash"></i>
      <span>delete</span>
    </button>
    <hr style="border: none; border-top: 0.5px solid var(--color-border-secondary); margin: 4px 0;">
    <button class="options-dropdown-item" onclick="moveChatUp('${chat.id}')">
      <i class="ti ti-arrow-up"></i>
      <span>move up</span>
    </button>
    <button class="options-dropdown-item" onclick="moveChatDown('${chat.id}')">
      <i class="ti ti-arrow-down"></i>
      <span>move down</span>
    </button>
  `;
  
  document.body.appendChild(dropdown);
  
  const rect = event.currentTarget.getBoundingClientRect();
  dropdown.style.left = `${rect.left}px`;
  dropdown.style.top = `${rect.bottom + window.scrollY}px`;
  
  dropdown.addEventListener('click', e => e.stopPropagation());
}

function openSidebarProjectDropdown(event, projectId) {
  event.preventDefault();
  event.stopPropagation();
  
  closeAllDropdowns();
  
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  
  const dropdown = document.createElement('div');
  dropdown.className = 'options-dropdown-menu';
  dropdown.id = 'sidebar-project-dropdown';
  
  dropdown.innerHTML = `
    <button class="options-dropdown-item" onclick="togglePinProject('${project.id}')">
      <i class="ti ti-pin"></i>
      <span>${project.pinned ? 'unpin' : 'pin'}</span>
    </button>
    <button class="options-dropdown-item" onclick="openSidebarProjectExplorer('${project.id}')">
      <i class="ti ti-folder-open"></i>
      <span>open in explorer</span>
    </button>
    <button class="options-dropdown-item" onclick="openSidebarProjectRename('${project.id}')">
      <i class="ti ti-pencil"></i>
      <span>rename project</span>
    </button>
    <button class="options-dropdown-item" onclick="archiveProjectChats('${project.id}')">
      <i class="ti ti-archive"></i>
      <span>archive chats</span>
    </button>
    <hr style="border: none; border-top: 0.5px solid var(--color-border-secondary); margin: 4px 0;">
    <button class="options-dropdown-item danger" onclick="removeProjectAction('${project.id}')">
      <i class="ti ti-trash"></i>
      <span>remove</span>
    </button>
  `;
  
  document.body.appendChild(dropdown);
  
  const rect = event.currentTarget.getBoundingClientRect();
  dropdown.style.left = `${rect.left}px`;
  dropdown.style.top = `${rect.bottom + window.scrollY}px`;
  
  dropdown.addEventListener('click', e => e.stopPropagation());
}

function togglePinChat(chatId) {
  const chat = state.chats.find(c => c.id === chatId);
  if (chat) {
    chat.pinned = !chat.pinned;
    showToast(chat.pinned ? 'chat pinned to sidebar' : 'chat unpinned from sidebar');
    renderRecentChatsList();
  }
  closeAllDropdowns();
}

function renameChatPrompt(chatId) {
  const chat = state.chats.find(c => c.id === chatId);
  if (chat) {
    const newTitle = prompt('enter new chat name:', chat.title);
    if (newTitle !== null && newTitle.trim() !== '') {
      chat.title = newTitle.trim();
      showToast('chat renamed');
      renderRecentChatsList();
      if (state.activeChatId === chatId) {
        renderChatScreen();
      }
    }
  }
  closeAllDropdowns();
}

function addChatToProjectPrompt(chatId) {
  const chat = state.chats.find(c => c.id === chatId);
  if (chat) {
    const options = state.projects.map((p, idx) => `${idx + 1}. ${p.name}`).join('\n');
    const choice = prompt(`select a project to add this chat to (enter number):\n\n${options}\n0. none`);
    if (choice !== null) {
      const idx = parseInt(choice, 10) - 1;
      if (idx >= 0 && idx < state.projects.length) {
        chat.projectId = state.projects[idx].id;
        showToast(`chat added to project "${state.projects[idx].name}"`);
        renderRecentChatsList();
      } else if (parseInt(choice, 10) === 0) {
        chat.projectId = null;
        showToast('chat removed from projects');
        renderRecentChatsList();
      }
    }
  }
  closeAllDropdowns();
}

function saveChatAction(chatId) {
  showToast('chat successfully saved and bookmarked!');
  closeAllDropdowns();
}

function deleteChatAction(chatId) {
  if (confirm('are you sure you want to delete this conversation?')) {
    state.chats = state.chats.filter(c => c.id !== chatId);
    showToast('chat deleted');
    if (state.activeChatId === chatId) {
      state.activeChatId = null;
      window.location.hash = '#/chats';
    } else {
      renderRecentChatsList();
    }
  }
  closeAllDropdowns();
}

function moveChatUp(chatId) {
  const idx = state.chats.findIndex(c => c.id === chatId);
  if (idx > 0) {
    const temp = state.chats[idx];
    state.chats[idx] = state.chats[idx - 1];
    state.chats[idx - 1] = temp;
    showToast('chat moved up');
    renderRecentChatsList();
  }
  closeAllDropdowns();
}

function moveChatDown(chatId) {
  const idx = state.chats.findIndex(c => c.id === chatId);
  if (idx >= 0 && idx < state.chats.length - 1) {
    const temp = state.chats[idx];
    state.chats[idx] = state.chats[idx + 1];
    state.chats[idx + 1] = temp;
    showToast('chat moved down');
    renderRecentChatsList();
  }
  closeAllDropdowns();
}

function togglePinProject(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (project) {
    project.pinned = !project.pinned;
    showToast(project.pinned ? 'project pinned to sidebar' : 'project unpinned from sidebar');
    renderRecentChatsList();
  }
  closeAllDropdowns();
}

function openSidebarProjectExplorer(projectId) {
  closeAllDropdowns();
  window.location.hash = `#/projects/${projectId}`;
}

function openSidebarProjectRename(projectId) {
  closeAllDropdowns();
  const project = state.projects.find(p => p.id === projectId);
  if (project) {
    const newName = prompt('enter new project name:', project.name);
    if (newName !== null && newName.trim() !== '') {
      project.name = newName.trim();
      showToast('project renamed');
      renderRecentChatsList();
      if (state.activeProjectId === projectId) {
        renderProjectDetailScreen(projectId);
      }
    }
  }
}

function archiveProjectChats(projectId) {
  showToast('all chats in this project archived');
  closeAllDropdowns();
}

function removeProjectAction(projectId) {
  if (confirm('are you sure you want to delete this project?')) {
    state.projects = state.projects.filter(p => p.id !== projectId);
    state.chats.forEach(c => {
      if (c.projectId === projectId) {
        c.projectId = null;
      }
    });
    showToast('project removed');
    if (state.activeProjectId === projectId) {
      state.activeProjectId = null;
      window.location.hash = '#/projects';
    } else {
      renderRecentChatsList();
    }
  }
  closeAllDropdowns();
}

// --- SCREENS RENDERING LOGIC ---

function renderHomeScreen() {
  const activeWorkspace = state.workspaces.find(ws => ws.id === state.activeWorkspaceId) || state.workspaces[0];
  const wsWorkstreams = state.workstreams.filter(wst => wst.workspaceId === activeWorkspace.id);
  const activeRunsCount = wsWorkstreams.reduce((acc, curr) => acc + curr.activeRuns, 0);

  // Get hour for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'good morning' : hour < 17 ? 'good afternoon' : 'good evening';

  DOM.contentArea.innerHTML = `
    <div class="centered-container">
      <div class="home-greeting-box">
        <h1 class="home-greeting-title">${greeting}, alex</h1>
        <div class="home-greeting-sub">governing <strong>${activeWorkspace.name}</strong> workspace</div>
        <div class="home-chips-row">
          <div class="workspace-chip-badge">
            <span class="status-pulse-dot pulse-green" style="width:6px; height:6px;"></span>
            <span>${activeRunsCount} active run${activeRunsCount !== 1 ? 's' : ''}</span>
          </div>
          <div class="workspace-chip-badge">
            <i class="ti ti-shield-check"></i>
            <span>${activeWorkspace.role} node</span>
          </div>
        </div>
      </div>

      ${getPromptBoxHTML('describe a goal to delegate... (e.g. @create workstream)')}

      <!-- Natural Creation Inline Form Overlay -->
      ${state.activeCreationForm === 'workstream' ? `
        <div class="creation-form-box">
          <div class="creation-form-title">configure new workstream workflow</div>
          <div class="creation-form-grid">
            <div class="creation-form-row">
              <label>workstream name</label>
              <input type="text" id="form-workstream-name" placeholder="e.g. daily expense reconciliation" value="daily expense reconciliation">
            </div>
            <div class="creation-form-row">
              <label>workspace scope</label>
              <select id="form-workstream-workspace">
                ${state.workspaces.map(ws => `<option value="${ws.id}" ${ws.id === state.activeWorkspaceId ? 'selected' : ''}>${ws.name}</option>`).join('')}
              </select>
            </div>
            <div class="creation-form-row">
              <label>execution frequency</label>
              <select id="form-workstream-frequency">
                <option value="daily">daily at 9:00 AM</option>
                <option value="weekly">weekly on mondays</option>
                <option value="continuous">continuous (event driven)</option>
                <option value="manual" selected>manual trigger</option>
              </select>
            </div>
            <div class="creation-form-row">
              <label>primary softworker</label>
              <select id="form-workstream-agent">
                ${state.agents.map(ag => `<option value="${ag.id}">${ag.name}</option>`).join('')}
              </select>
            </div>
            <div class="creation-form-row full-width">
              <label>operational goal & instructions</label>
              <textarea id="form-workstream-instructions" rows="2" style="background:var(--color-bg-secondary); border:0.5px solid var(--color-border-secondary); color:var(--color-text-primary); border-radius:6px; padding:8px; font-size:12.5px; font-family:inherit; outline:none;" placeholder="describe the automated end-to-end task...">audit all newly uploaded receipts and match against quickbooks ledgers.</textarea>
            </div>
          </div>
          <div class="creation-form-actions">
            <button class="btn btn-outline btn-sm" onclick="cancelCreationForm()">cancel</button>
            <button class="btn btn-primary btn-sm" onclick="submitWorkstreamForm()">create workstream</button>
          </div>
        </div>
      ` : ''}

      <div class="template-section">
        <div class="quickstart-label">quick actions</div>
        <div class="template-grid">
          <div class="template-card" onclick="window.location.hash='#/create-agent'">
            <span class="template-color-indicator" style="background-color: var(--avatar-purple-text);"></span>
            <div class="template-content">
              <div class="quickstart-card-title">create softworker</div>
              <div class="quickstart-card-desc">initialize a specialized agent to manage workspace tasks</div>
            </div>
          </div>

          <div class="template-card" onclick="window.location.hash='#/create-skill'">
            <span class="template-color-indicator" style="background-color: var(--avatar-teal-text);"></span>
            <div class="template-content">
              <div class="quickstart-card-title">define workspace capability</div>
              <div class="quickstart-card-desc">build integrations that softworkers can run securely</div>
            </div>
          </div>

          <div class="template-card" onclick="window.location.hash='#/workspace/global'">
            <span class="template-color-indicator" style="background-color: var(--avatar-amber-text);"></span>
            <div class="template-content">
              <div class="quickstart-card-title">open global triage</div>
              <div class="quickstart-card-desc">review and route incoming goals to workstreams</div>
            </div>
          </div>

          <div class="template-card" onclick="window.location.hash='#/workspace/reviews'">
            <span class="template-color-indicator" style="background-color: var(--avatar-coral-text);"></span>
            <div class="template-content">
              <div class="quickstart-card-title">review approvals</div>
              <div class="quickstart-card-desc">approve or reject pending softworker actions</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

// Helpers for Natural Form Actions
function cancelCreationForm() {
  state.activeCreationForm = null;
  renderView();
}

function submitWorkstreamForm() {
  const nameInput = document.getElementById('form-workstream-name');
  const wsSelect = document.getElementById('form-workstream-workspace');
  const freqSelect = document.getElementById('form-workstream-frequency');
  const agentSelect = document.getElementById('form-workstream-agent');
  
  if (!nameInput || !nameInput.value.trim()) {
    showToast('please enter a workstream name');
    return;
  }
  
  const newWst = {
    id: 'wst_' + Date.now(),
    workspaceId: wsSelect.value,
    name: nameInput.value.trim().toLowerCase(),
    icon: 'ti-route',
    status: 'running',
    lastActive: 'just now',
    runsCount: 0,
    activeRuns: 0,
    pendingReviews: 0,
    frequency: freqSelect.value,
    agentId: agentSelect.value
  };
  
  state.workstreams.push(newWst);
  state.activeCreationForm = null;
  
  showToast(`workstream "${newWst.name}" successfully configured and initialized!`);
  renderSidebar();
  renderView();
}

// Helpers for Global Inbox / Triage Row Expansion and Actions
function toggleTriageRow(msgId) {
  state.activeTriageRowId = state.activeTriageRowId === msgId ? null : msgId;
  renderView();
}

function approveTriageRow(msgId) {
  const msg = state.globalMessages.find(m => m.id === msgId);
  if (msg) {
    msg.status = 'approved';
    showToast('Goal approved and delegated to workstream!');
    
    // Simulate activity log
    state.activityFeed.unshift({
      id: 'act_' + Date.now(),
      workspaceId: state.activeWorkspaceId,
      content: `delegated triage goal from ${msg.sender}`,
      time: 'just now'
    });
    
    // Add running status to workstream
    const ws = state.workspaces.find(w => w.id === state.activeWorkspaceId);
    const wst = state.workstreams.find(w => w.workspaceId === ws.id);
    if (wst) {
      wst.activeRuns++;
      wst.status = 'running';
    }
    
    renderSidebar();
    state.activeTriageRowId = null;
    renderView();
  }
}

function rejectTriageRow(msgId) {
  const msg = state.globalMessages.find(m => m.id === msgId);
  if (msg) {
    msg.status = 'dismissed';
    showToast('Goal dismissed.');
    state.activeTriageRowId = null;
    renderView();
  }
}

function escalateTriageRow(msgId) {
  const msg = state.globalMessages.find(m => m.id === msgId);
  if (msg) {
    showToast('Goal escalated to administrator.');
    state.activeTriageRowId = null;
    renderView();
  }
}

function focusPromptBox() {
  const input = document.getElementById('main-prompt-input');
  if (input) input.focus();
}

// 2. CREATE AGENT SCREEN
function renderCreateAgentScreen() {
  DOM.contentArea.innerHTML = `
    <div class="centered-container">
      <div class="home-greeting-box">
        <h1 class="home-greeting-title">create a new agent</h1>
        <div class="home-greeting-sub">describe what this softworker should do and what templates it should utilize.</div>
      </div>
      
      ${getPromptBoxHTML('e.g. finance agent that reviews expense reports and flags anomalies...')}
      
      <div class="template-section">
        <div class="quickstart-label">or start from a template</div>
        <div class="template-grid">
          <div class="template-card" onclick="prefillAgentTemplate('finance reviewer')">
            <span class="template-color-indicator" style="background-color: var(--avatar-teal-text);"></span>
            <div class="template-content">
              <div class="quickstart-card-title">finance reviewer</div>
              <div class="quickstart-card-desc">expense audits, anomalies flagging, and receipts validations</div>
            </div>
          </div>
          
          <div class="template-card" onclick="prefillAgentTemplate('hr onboarder')">
            <span class="template-color-indicator" style="background-color: var(--avatar-purple-text);"></span>
            <div class="template-content">
              <div class="quickstart-card-title">hr onboarder</div>
              <div class="quickstart-card-desc">new hire system setups, calendar invitations, and workspace accesses</div>
            </div>
          </div>
          
          <div class="template-card" onclick="prefillAgentTemplate('sales follow-up')">
            <span class="template-color-indicator" style="background-color: var(--avatar-amber-text);"></span>
            <div class="template-content">
              <div class="quickstart-card-title">sales follow-up</div>
              <div class="quickstart-card-desc">crm reconciliations, record modifications, and vendor communications</div>
            </div>
          </div>
          
          <div class="template-card" onclick="prefillAgentTemplate('it support')">
            <span class="template-color-indicator" style="background-color: var(--avatar-coral-text);"></span>
            <div class="template-content">
              <div class="quickstart-card-title">it support</div>
              <div class="quickstart-card-desc">ticket triage, password credential checks, and directory audits</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function prefillAgentTemplate(name) {
  const input = document.getElementById('main-prompt-input');
  if (input) {
    input.innerText = `an agent to act as a "${name}" to perform standard governed tasks, retrieve metrics, and notify team on exceptions.`;
    input.dispatchEvent(new Event('input'));
    input.focus();
  }
}

// 3. CREATE SKILL SCREEN
function renderCreateSkillScreen() {
  DOM.contentArea.innerHTML = `
    <div class="centered-container">
      <div class="home-greeting-box">
        <h1 class="home-greeting-title">define a new skill</h1>
        <div class="home-greeting-sub">skills are reusable integrations or actions you can attach to softworkers.</div>
      </div>
      
      ${getPromptBoxHTML('e.g. read expense logs from netsuite and extract row data...')}
    </div>
  `;
}

// 4. RUN THREAD / CHAT SCREEN
function renderChatScreen() {
  const chat = state.chats.find(c => c.id === state.activeChatId);
  if (!chat) {
    DOM.contentArea.innerHTML = `<div class="text-secondary">run thread not found.</div>`;
    return;
  }
  
  // Build header collaborator avatars
  const collaboratorsHTML = chat.collaborators.map(c => {
    if (c === 'AR') return `<div class="user-avatar user-color-purple" data-tooltip="alex rivers">AR</div>`;
    if (c === 'SJ') return `<div class="user-avatar user-color-teal" data-tooltip="sarah jenkins (cfo)">SJ</div>`;
    return `<div class="user-avatar user-color-pink" data-tooltip="${c}">${c}</div>`;
  }).join('');
  
  DOM.contentArea.innerHTML = `
    <div class="thread-container">
      <!-- HEADER -->
      <div class="thread-header">
        <div class="thread-info">
          <div class="thread-title">${chat.title}</div>
          <div class="thread-metadata-row">
            <span class="status-pill status-${chat.status.replace(' ', '-')}">${chat.status}</span>
            <span class="text-metadata">${chat.elapsed}</span>
          </div>
        </div>
        <div class="thread-right">
          <div class="avatar-stack">
            ${collaboratorsHTML}
          </div>
          <button class="btn btn-outline" onclick="openShareModal('${chat.id}')">
            <i class="ti ti-share-2 inline-icon"></i>
            <span>share</span>
          </button>
        </div>
      </div>
      
      <!-- MESSAGES VIEWPORT -->
      <div class="thread-messages-list" id="thread-messages-viewport">
        ${chat.messages.map(m => getMessageHTML(m)).join('')}
      </div>
      
      <!-- REPLY CONTAINER (shows when paused, complete or waiting) -->
      <div class="thread-reply-box">
        ${getPromptBoxHTML(`reply to ${chat.agent.name}...`, 'reply-prompt')}
      </div>
    </div>
  `;
  
  // Auto scroll to bottom
  setTimeout(() => {
    const viewport = document.getElementById('thread-messages-viewport');
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  }, 50);
  
  // Sync the recent selection highlight
  renderRecentChatsList();
}

function getMessageHTML(msg) {
  let avatarHTML = '';
  if (msg.avatarType === 'user') {
    avatarHTML = `<div class="user-avatar user-color-${msg.avatarColor}">${msg.avatarInitials}</div>`;
  } else {
    avatarHTML = `<div class="agent-avatar">${getAgentAvatarSVG(msg.avatarCategory)}</div>`;
  }
  
  let planHTML = '';
  if (msg.hasPlan) {
    planHTML = `
      <div class="plan-card">
        <div class="plan-label">plan execution</div>
        <ul class="plan-steps-list">
          ${msg.plan.steps.map(s => {
            let icon = 'ti-circle';
            let iconClass = 'pending';
            if (s.status === 'done') {
              icon = 'ti-check';
              iconClass = 'done';
            } else if (s.status === 'active') {
              icon = 'ti-loader';
              iconClass = 'active';
            }
            return `
              <li class="plan-step ${s.status}">
                <i class="ti ${icon} plan-step-icon ${iconClass}"></i>
                <span>${s.label}</span>
              </li>
            `;
          }).join('')}
        </ul>
      </div>
    `;
  }
  
  let approvalHTML = '';
  if (msg.hasApprovalCard) {
    if (msg.approvalCard.status === 'requested') {
      approvalHTML = `
        <div class="approval-card approval-card-amber">
          <div class="approval-card-header">
            <i class="ti ti-lock"></i>
            <span class="approval-card-title">${msg.approvalCard.title}</span>
            <span class="risk-badge risk-${msg.approvalCard.risk}">${msg.approvalCard.risk} risk</span>
          </div>
          <div class="approval-card-body">
            <p>the system requires the following governed data access approvals in order to proceed:</p>
            <ul class="approval-needed-list">
              ${msg.approvalCard.needed.map(n => `<li>${n}</li>`).join('')}
            </ul>
          </div>
          <div class="alternative-path-box">
            <div class="alternative-path-label">alternative path I considered</div>
            <div class="alternative-path-content">${msg.approvalCard.alternative}</div>
          </div>
          <div class="approval-actions">
            <button class="btn btn-primary" onclick="requestManagerApproval('${state.activeChatId}', '${msg.id}')">request approval from manager</button>
            <button class="btn btn-outline" onclick="useAlternativePath('${state.activeChatId}', '${msg.id}')">use alternative path</button>
          </div>
        </div>
      `;
    } else if (msg.approvalCard.status === 'sent') {
      approvalHTML = `
        <div class="pending-state-card">
          <i class="ti ti-clock pending-state-icon"></i>
          <div class="pending-state-info">
            <span class="pending-state-title">approval request sent</span>
            <span class="pending-state-sub">waiting for sarah jenkins (cfo) · sent just now</span>
          </div>
        </div>
      `;
    } else if (msg.approvalCard.status === 'granted') {
      approvalHTML = `
        <div class="granted-state-card">
          <i class="ti ti-check granted-state-icon"></i>
          <div class="granted-state-info">
            <span class="granted-state-title">access granted</span>
            <span class="granted-state-sub">read access approved · tokens scoped to this run only</span>
          </div>
        </div>
      `;
    }
  }
  
  // Render comments
  let commentsHTML = '';
  if (msg.comments && msg.comments.length > 0) {
    commentsHTML = `
      <div class="comments-stack">
        ${msg.comments.map(c => `
          <div class="comment-item">
            <div class="comment-header">
              <div class="user-avatar user-color-${c.avatarColor}" style="width:18px; height:18px; font-size:8px;">${c.avatarInitials}</div>
              <span class="comment-author">${c.author}</span>
              <span class="comment-time">${c.time}</span>
            </div>
            <div class="comment-body">${c.body}</div>
            <div class="comment-footer">
              ${c.reactions.map(r => `
                <button class="reaction-btn ${r.active ? 'active' : ''}" onclick="toggleReaction('${state.activeChatId}', '${msg.id}', '${c.id}', '${r.emoji}')">
                  <span>${r.emoji}</span>
                  <span>${r.count}</span>
                </button>
              `).join('')}
              <button class="comment-reply-trigger" onclick="focusCommentReply('${state.activeChatId}', '${msg.id}')">reply</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  return `
    <div class="message-item" id="msg-${msg.id}">
      <div class="message-header-row">
        ${avatarHTML}
        <span class="message-sender-name">${msg.senderName}</span>
        <span class="message-timestamp">${msg.timestamp}</span>
        <button class="btn-fork-subtle" data-tooltip="fork thread from here" onclick="openForkModal('${msg.id}')">
          <i class="ti ti-git-branch"></i>
        </button>
      </div>
      <div class="message-body">
        <p>${msg.content}</p>
        ${planHTML}
        ${approvalHTML}
      </div>
      ${commentsHTML}
    </div>
  `;
}

// --- INTERACTIVE SIMULATION LOGIC ---

function triggerGoalSimulation(chatId) {
  const chat = state.chats.find(c => c.id === chatId);
  if (!chat) return;
  
  // Step 1: Agent acknowledgment & plan
  const agentAck = {
    id: 'sim_ack_' + Date.now(),
    sender: 'agent',
    senderName: chat.agent.name,
    avatarType: 'agent',
    avatarCategory: chat.agent.category,
    timestamp: 'just now',
    content: `understood. i have initialized a dynamic execution plan to accomplish the requested goal: "${chat.title}".`,
    hasPlan: true,
    plan: {
      steps: [
        { id: 1, label: 'inspect transaction logs and metadata', status: 'active' },
        { id: 2, label: 'pull invoices and cross-reference lines', status: 'pending' },
        { id: 3, label: 'access accounting api ledgers', status: 'pending' },
        { id: 4, label: 'compile anomalies report summary', status: 'pending' }
      ]
    }
  };
  
  chat.messages.push(agentAck);
  if (state.activeChatId === chatId) renderChatScreen();
  
  // Simulation Loop
  setTimeout(() => {
    // Mark Step 1 complete, Step 2 active
    agentAck.plan.steps[0].status = 'done';
    agentAck.plan.steps[1].status = 'active';
    if (state.activeChatId === chatId) renderChatScreen();
    
    setTimeout(() => {
      // Mark Step 2 complete, Step 3 active -> triggers safety exception block!
      agentAck.plan.steps[1].status = 'done';
      agentAck.plan.steps[2].status = 'active';
      
      const blockMessage = {
        id: 'sim_block_' + Date.now(),
        sender: 'agent',
        senderName: chat.agent.name,
        avatarType: 'agent',
        avatarCategory: chat.agent.category,
        timestamp: 'just now',
        content: `i have encountered a policy block while trying to fetch the live balances directly from the main corporate ledger ledger API. I require governed manager permission to access these fields.`,
        hasApprovalCard: true,
        approvalCard: {
          title: 'accounting API access authorization required',
          risk: 'medium',
          riskClass: 'risk-medium',
          needed: ['read tokens for live accounts balance database', 'write tokens to ledger audit trail'],
          alternative: 'i can construct a static reconciliation report utilizing last month\'s backup spreadsheets. this covers 81% of typical ledger entries but skips live q1 balance sheets.',
          status: 'requested'
        }
      };
      
      chat.status = 'awaiting approval';
      chat.elapsed = 'paused just now';
      chat.messages.push(blockMessage);
      
      updateBadges();
      if (state.activeChatId === chatId) renderChatScreen();
    }, 2000);
  }, 2000);
}

// Request manager approval action
function requestManagerApproval(chatId, msgId) {
  const chat = state.chats.find(c => c.id === chatId);
  const msg = chat.messages.find(m => m.id === msgId);
  if (!msg || !msg.hasApprovalCard) return;
  
  msg.approvalCard.status = 'sent';
  chat.status = 'awaiting approval';
  chat.elapsed = 'waiting for approver';
  
  // Add user reply message
  const userReply = {
    id: 'user_sent_' + Date.now(),
    sender: 'user',
    senderName: 'alex rivers',
    avatarType: 'user',
    avatarColor: 'purple',
    avatarInitials: 'AR',
    timestamp: 'just now',
    content: `i've requested the cfo Sarah Jenkins to approve this ledger API access token. let's await her input.`
  };
  
  chat.messages.push(userReply);
  updateBadges();
  renderChatScreen();
  
  // Sarah Jenkins CFO responds after 4 seconds
  setTimeout(() => {
    const cfoReply = {
      id: 'cfo_reply_' + Date.now(),
      sender: 'user',
      senderName: 'sarah jenkins',
      avatarType: 'user',
      avatarColor: 'teal',
      avatarInitials: 'SJ',
      timestamp: 'just now',
      content: `access granted. this has been scoped exclusively to this run thread. proceed with full ledger audit.`,
      hasApprovalCard: true,
      approvalCard: {
        status: 'granted'
      }
    };
    
    // Update the original message card state to granted as well
    msg.approvalCard.status = 'granted';
    
    chat.messages.push(cfoReply);
    chat.status = 'running';
    chat.elapsed = 'running now';
    
    if (state.activeChatId === chatId) renderChatScreen();
    
    // Resume agent execution
    setTimeout(() => {
      // Find the first agent plan card message and update it
      const planMsg = chat.messages.find(m => m.hasPlan);
      if (planMsg) {
        planMsg.plan.steps[2].status = 'done';
        planMsg.plan.steps[3].status = 'active';
      }
      
      const resumeMsg = {
        id: 'agent_resume_' + Date.now(),
        sender: 'agent',
        senderName: chat.agent.name,
        avatarType: 'agent',
        avatarCategory: chat.agent.category,
        timestamp: 'just now',
        content: `resuming ledger analysis with authorized read tokens. i have successfully checked transaction line compliance.`
      };
      
      chat.messages.push(resumeMsg);
      if (state.activeChatId === chatId) renderChatScreen();
      
      setTimeout(() => {
        // Complete Step 4
        if (planMsg) {
          planMsg.plan.steps[3].status = 'done';
        }
        
        chat.status = 'complete';
        chat.elapsed = 'completed just now';
        
        const finalMsg = {
          id: 'agent_final_' + Date.now(),
          sender: 'agent',
          senderName: chat.agent.name,
          avatarType: 'agent',
          avatarCategory: chat.agent.category,
          timestamp: 'just now',
          content: `audit reconciled. 0 critical balance discrepancies found. 2 duplicates flagged. generated ledger audit trail and synced reports. goal completed successfully.`
        };
        
        chat.messages.push(finalMsg);
        updateBadges();
        if (state.activeChatId === chatId) renderChatScreen();
      }, 3000);
    }, 2000);
  }, 4000);
}

// Alternative path action
function useAlternativePath(chatId, msgId) {
  const chat = state.chats.find(c => c.id === chatId);
  const msg = chat.messages.find(m => m.id === msgId);
  if (!msg || !msg.hasApprovalCard) return;
  
  // Hide approval card, proceed using backups
  msg.approvalCard.status = 'alternative';
  
  const userReply = {
    id: 'user_alt_' + Date.now(),
    sender: 'user',
    senderName: 'alex rivers',
    avatarType: 'user',
    avatarColor: 'purple',
    avatarInitials: 'AR',
    timestamp: 'just now',
    content: `please bypass banking APIs and run the reconciliation utilizing last month's backup CSV spreadsheets as suggested.`
  };
  
  const agentAck = {
    id: 'agent_alt_ack_' + Date.now(),
    sender: 'agent',
    senderName: chat.agent.name,
    avatarType: 'agent',
    avatarCategory: chat.agent.category,
    timestamp: 'just now',
    content: `understood. pivoting execution. pulling raw backup spreadsheet statements. please note this will limit anomaly coverage to last month's records.`,
  };
  
  chat.messages.push(userReply);
  chat.messages.push(agentAck);
  chat.status = 'running';
  chat.elapsed = 'running now';
  updateBadges();
  renderChatScreen();
  
  setTimeout(() => {
    const planMsg = chat.messages.find(m => m.hasPlan);
    if (planMsg) {
      planMsg.plan.steps[2].status = 'done';
      planMsg.plan.steps[3].status = 'active';
    }
    
    setTimeout(() => {
      if (planMsg) planMsg.plan.steps[3].status = 'done';
      
      chat.status = 'complete';
      chat.elapsed = 'completed just now';
      
      const finalMsg = {
        id: 'agent_final_alt_' + Date.now(),
        sender: 'agent',
        senderName: chat.agent.name,
        avatarType: 'agent',
        avatarCategory: chat.agent.category,
        timestamp: 'just now',
        content: `audit reconciled using static backup files. 1 core reconciliation difference flagged due to file static limits. completed audit trail successfully.`
      };
      
      chat.messages.push(finalMsg);
      if (state.activeChatId === chatId) renderChatScreen();
    }, 2000);
  }, 2000);
}

// Comments, reactions
function toggleReaction(chatId, msgId, commentId, emoji) {
  const chat = state.chats.find(c => c.id === chatId);
  const msg = chat.messages.find(m => m.id === msgId);
  const comment = msg.comments.find(c => c.id === commentId);
  const react = comment.reactions.find(r => r.emoji === emoji);
  
  if (react) {
    if (react.active) {
      react.count--;
      react.active = false;
    } else {
      react.count++;
      react.active = true;
    }
  }
  
  renderChatScreen();
}

function focusCommentReply(chatId, msgId) {
  // Focus the main reply box and prefill it
  const input = document.getElementById('reply-prompt-input');
  if (input) {
    input.innerText = `@comment on message: `;
    input.focus();
  }
}

// 5. PROJECTS SCREEN
function renderProjectsScreen() {
  DOM.contentArea.innerHTML = `
    <div class="projects-container">
      <div class="page-header-row">
        <h2>projects portfolio</h2>
        <button class="btn btn-primary" onclick="showToast('feature deferred to later phase')">+ new project</button>
      </div>
      
      <div class="projects-grid">
        ${state.projects.map(p => `
          <div class="project-card" onclick="window.location.hash = '#/projects/${p.id}'" style="cursor: pointer;">
            <div class="project-card-header">
              <span class="project-title">${p.name}</span>
              <span class="status-tag status-tag-${p.status}">${p.status}</span>
            </div>
            <p class="project-desc">${p.desc}</p>
            <div class="project-stats-row">
              <span class="text-metadata"><i class="ti ti-message"></i> ${p.runs} runs delegated</span>
              <span class="text-metadata"><i class="ti ti-users"></i> 3 agents involved</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 5b. PROJECT DETAIL SCREEN
function renderProjectDetailScreen(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) {
    DOM.contentArea.innerHTML = `
      <div class="projects-container">
        <button class="project-back-btn" onclick="window.location.hash = '#/projects'">
          <i class="ti ti-arrow-left"></i>
          <span>all projects</span>
        </button>
        <div class="text-secondary" style="margin-top: 16px;">project not found.</div>
      </div>
    `;
    return;
  }

  // Get chats linked to this project
  const projectChats = state.chats.filter(c => c.projectId === projectId);

  DOM.contentArea.innerHTML = `
    <div class="projects-container" style="max-width: 1000px; margin: 0 auto; width: 100%;">
      <!-- Back Button -->
      <button class="project-back-btn" onclick="window.location.hash = '#/projects'">
        <i class="ti ti-arrow-left"></i>
        <span>all projects</span>
      </button>

      <!-- Project Header Title Row -->
      <div class="project-title-row">
        <h1 class="project-title">${project.name}</h1>
        <div class="project-title-btn-group">
          <button class="project-share-btn btn btn-outline btn-xs" onclick="openProjectShareModal('${project.id}')">
            <i class="ti ti-share-2 inline-icon"></i>
            <span>share project</span>
          </button>
          <button class="project-pin-btn action-btn" onclick="togglePinProject('${project.id}')" data-tooltip="pin project">
            <i class="ti ti-pin" style="${project.pinned ? 'color: var(--color-accent-600);' : ''}"></i>
          </button>
          <button class="project-options-btn action-btn" onclick="toggleProjectDropdown(event, '${project.id}')" data-tooltip="project options">
            <i class="ti ti-dots-vertical"></i>
          </button>
        </div>
      </div>

      <!-- Split Layout -->
      <div class="project-detail-layout">
        <!-- Left Side: Prompt Box and Tasks -->
        <div class="project-detail-left">
          ${getPromptBoxHTML('how can i help you today?', 'project-prompt')}

          <div class="project-tasks-list">
            <div class="quickstart-label">chats in this project</div>
            ${projectChats.length > 0 ? projectChats.map(c => `
              <div class="project-task-item" id="task-item-${c.id}">
                <div class="project-task-left" onclick="window.location.hash = '#/chats/${c.id}'" style="cursor: pointer;">
                  <span class="project-task-name">${c.title}</span>
                  <span class="project-task-meta">last message ${c.elapsed || '6 hours ago'}</span>
                </div>
                <button class="action-btn" onclick="toggleTaskDropdown(event, '${c.id}')" data-tooltip="chat options">
                  <i class="ti ti-dots-vertical"></i>
                </button>
              </div>
            `).join('') : `
              <div class="text-secondary" style="font-size: 13px; font-style: italic; padding: 12px 0;">no active chats in this project yet. start one above!</div>
            `}

            <div style="margin-top: 16px; text-align: center;">
              <button class="btn btn-outline btn-xs" onclick="showToast('opened cowork tasks')" style="gap: 4px;">
                <i class="ti ti-external-link"></i>
                <span>start a task in cowork</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side: Instructions and Files (No Memory Panel) -->
        <div class="project-detail-right">
          <!-- Instructions Panel -->
          <div class="project-section-panel">
            <div class="project-section-header">
              <span class="project-section-title">instructions</span>
              <button class="project-section-add-btn" onclick="openProjectInstructionsModal('${project.id}')" data-tooltip="add instructions">+</button>
            </div>
            <p class="project-instructions-text">
              ${project.instructions ? project.instructions : 'add instructions to tailor Claude\'s responses'}
            </p>
          </div>

          <!-- Files Panel -->
          <div class="project-section-panel">
            <div class="project-section-header">
              <span class="project-section-title">files</span>
              <button class="project-section-add-btn" onclick="triggerMockFileUpload('${project.id}')" data-tooltip="add files">+</button>
            </div>
            
            <div class="capacity-bar-container">
              <div class="capacity-bar-track">
                <div class="capacity-bar-fill" style="width: ${project.capacityUsed || 1}%;"></div>
              </div>
              <span class="capacity-bar-label">${project.capacityUsed || 1}% of project capacity used</span>
            </div>

            <div class="project-files-grid">
              ${project.files && project.files.length > 0 ? project.files.map(f => `
                <div class="pdf-card" onclick="showToast('viewing: ${f.name}')">
                  <div class="pdf-icon-wrapper">
                    <i class="ti ti-file-type-pdf"></i>
                  </div>
                  <div class="pdf-meta-box">
                    <span class="pdf-name" data-tooltip="${f.name}">${f.name}</span>
                    <span class="pdf-size">${f.size}</span>
                  </div>
                </div>
              `).join('') : `
                <div class="text-secondary" style="font-size: 11px; grid-column: span 2; text-align: center; padding: 12px 0;">no files uploaded yet.</div>
              `}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- PROJECT DETAIL INTERACTION LOGIC ---
function togglePinProject(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  project.pinned = !project.pinned;
  showToast(project.pinned ? 'project pinned successfully' : 'project unpinned');
  renderView();
}

function openProjectInstructionsModal(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  
  const textarea = document.getElementById('project-instructions-textarea');
  textarea.value = project.instructions || '';
  
  const saveBtn = document.getElementById('btn-save-project-instructions');
  saveBtn.onclick = () => {
    project.instructions = textarea.value.trim();
    closeModal('project-instructions-modal');
    showToast('project instructions saved');
    renderView();
  };
  
  openModal('project-instructions-modal');
}

function triggerMockFileUpload(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  
  const mockOptions = [
    { name: 'audit exceptions report.pdf', size: '2.4 MB' },
    { name: 'vendor q1 invoice records.pdf', size: '1.8 MB' },
    { name: 'employee workspace roles.pdf', size: '920 KB' }
  ];
  
  const picked = mockOptions[Math.floor(Math.random() * mockOptions.length)];
  
  if (!project.files.some(f => f.name === picked.name)) {
    project.files.push(picked);
    project.capacityUsed = Math.min(100, project.capacityUsed + 3);
    showToast(`uploaded "${picked.name}" successfully`);
    renderView();
  } else {
    showToast(`file "${picked.name}" is already uploaded`);
  }
}

function openProjectShareModal(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  
  // Reuse share modal elements
  document.querySelector('#share-modal .modal-title').textContent = `share project: ${project.name}`;
  
  const collaboratorsList = document.getElementById('collaborators-list');
  collaboratorsList.innerHTML = `
    <li class="collaborator-item">
      <div class="collaborator-info">
        <div class="user-avatar user-color-purple">AR</div>
        <div class="collaborator-meta">
          <span class="collaborator-name">alex rivers (you)</span>
          <span class="collaborator-email">alex@acme.corp</span>
        </div>
      </div>
      <span class="text-metadata">owner</span>
    </li>
    <li class="collaborator-item">
      <div class="collaborator-info">
        <div class="user-avatar user-color-teal">SJ</div>
        <div class="collaborator-meta">
          <span class="collaborator-name">sarah jenkins</span>
          <span class="collaborator-email">sarah@acme.corp</span>
        </div>
      </div>
      <span class="text-metadata">editor</span>
    </li>
  `;
  
  document.getElementById('btn-share-invite-send').onclick = () => {
    const email = document.getElementById('share-invite-input').value.trim();
    if (email) {
      showToast(`project invitation sent to ${email}`);
      document.getElementById('share-invite-input').value = '';
    }
  };
  
  document.getElementById('public-link-text').textContent = `https://softworker.ai/projects/${project.id}/share`;
  
  openModal('share-modal');
}

// Project options dropup
function toggleProjectDropdown(event, projectId) {
  event.stopPropagation();
  
  const existing = document.getElementById('options-menu-dropdown');
  if (existing) {
    existing.remove();
    return;
  }
  
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  
  const dropdown = document.createElement('div');
  dropdown.id = 'options-menu-dropdown';
  dropdown.className = 'options-dropdown-menu';
  dropdown.style.left = `${rect.left - 130}px`;
  dropdown.style.top = `${rect.top + 30}px`;
  
  dropdown.innerHTML = `
    <button class="options-dropdown-item" onclick="editProjectDetails('${projectId}')">
      <i class="ti ti-edit"></i>
      <span>edit details</span>
    </button>
    <button class="options-dropdown-item" onclick="archiveProject('${projectId}')">
      <i class="ti ti-archive"></i>
      <span>archive</span>
    </button>
    <button class="options-dropdown-item danger" onclick="deleteProject('${projectId}')">
      <i class="ti ti-trash"></i>
      <span>delete</span>
    </button>
  `;
  
  document.body.appendChild(dropdown);
  document.addEventListener('click', closeOptionsMenuOutside);
}

// Task/Chat options dropdown
function toggleTaskDropdown(event, taskId) {
  event.stopPropagation();
  
  const existing = document.getElementById('options-menu-dropdown');
  if (existing) {
    existing.remove();
    return;
  }
  
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  
  const dropdown = document.createElement('div');
  dropdown.id = 'options-menu-dropdown';
  dropdown.className = 'options-dropdown-menu';
  dropdown.style.left = `${rect.left - 130}px`;
  dropdown.style.top = `${rect.top + 30}px`;
  
  dropdown.innerHTML = `
    <button class="options-dropdown-item" onclick="pinTask('${taskId}')">
      <i class="ti ti-pin"></i>
      <span>pin / unpin</span>
    </button>
    <button class="options-dropdown-item" onclick="renameTask('${taskId}')">
      <i class="ti ti-edit"></i>
      <span>rename</span>
    </button>
    <button class="options-dropdown-item" onclick="changeTaskProject('${taskId}')">
      <i class="ti ti-arrows-left-right"></i>
      <span>change project</span>
    </button>
    <button class="options-dropdown-item" onclick="removeTaskFromProject('${taskId}')">
      <i class="ti ti-x"></i>
      <span>remove from project</span>
    </button>
    <button class="options-dropdown-item danger" onclick="deleteTask('${taskId}')">
      <i class="ti ti-trash"></i>
      <span>delete</span>
    </button>
  `;
  
  document.body.appendChild(dropdown);
  document.addEventListener('click', closeOptionsMenuOutside);
}

function closeOptionsMenuOutside(event) {
  const dropdown = document.getElementById('options-menu-dropdown');
  if (dropdown && !dropdown.contains(event.target)) {
    dropdown.remove();
    document.removeEventListener('click', closeOptionsMenuOutside);
  }
}

// CRUD actions
function editProjectDetails(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  
  const newName = prompt('enter new name for this project:', project.name);
  if (newName && newName.trim() !== '') {
    project.name = newName.trim();
    showToast('project name updated');
    renderView();
  }
  
  const dropdown = document.getElementById('options-menu-dropdown');
  if (dropdown) dropdown.remove();
}

function archiveProject(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  
  project.status = 'archived';
  showToast('project archived successfully');
  window.location.hash = '#/projects';
  
  const dropdown = document.getElementById('options-menu-dropdown');
  if (dropdown) dropdown.remove();
}

function deleteProject(projectId) {
  if (confirm('are you sure you want to delete this project? this cannot be undone.')) {
    state.projects = state.projects.filter(p => p.id !== projectId);
    state.chats.forEach(c => {
      if (c.projectId === projectId) c.projectId = null;
    });
    showToast('project deleted');
    window.location.hash = '#/projects';
  }
  
  const dropdown = document.getElementById('options-menu-dropdown');
  if (dropdown) dropdown.remove();
}

function pinTask(taskId) {
  const chat = state.chats.find(c => c.id === taskId);
  if (!chat) return;
  
  chat.pinned = !chat.pinned;
  showToast(chat.pinned ? 'chat pinned to sidebar' : 'chat unpinned');
  renderView();
  
  const dropdown = document.getElementById('options-menu-dropdown');
  if (dropdown) dropdown.remove();
}

function renameTask(taskId) {
  const chat = state.chats.find(c => c.id === taskId);
  if (!chat) return;
  
  const newTitle = prompt('enter new title for this chat:', chat.title);
  if (newTitle && newTitle.trim() !== '') {
    chat.title = newTitle.trim();
    renderRecentChatsList();
    showToast('chat title updated');
    renderView();
  }
  
  const dropdown = document.getElementById('options-menu-dropdown');
  if (dropdown) dropdown.remove();
}

function changeTaskProject(taskId) {
  const chat = state.chats.find(c => c.id === taskId);
  if (!chat) return;
  
  const projectsList = state.projects.map((p, idx) => `${idx + 1}. ${p.name}`).join('\n');
  const selection = prompt(`select a project to move this chat to:\n\n${projectsList}\n\nenter project number (e.g. 1):`);
  
  if (selection) {
    const idx = parseInt(selection) - 1;
    if (idx >= 0 && idx < state.projects.length) {
      const targetProj = state.projects[idx];
      chat.projectId = targetProj.id;
      showToast(`chat moved to "${targetProj.name}"`);
      renderView();
    } else {
      alert('invalid selection');
    }
  }
  
  const dropdown = document.getElementById('options-menu-dropdown');
  if (dropdown) dropdown.remove();
}

function removeTaskFromProject(taskId) {
  const chat = state.chats.find(c => c.id === taskId);
  if (!chat) return;
  
  chat.projectId = null;
  showToast('chat removed from project');
  renderView();
  
  const dropdown = document.getElementById('options-menu-dropdown');
  if (dropdown) dropdown.remove();
}

function deleteTask(taskId) {
  if (confirm('are you sure you want to delete this chat?')) {
    state.chats = state.chats.filter(c => c.id !== taskId);
    renderRecentChatsList();
    showToast('chat deleted');
    renderView();
  }
  
  const dropdown = document.getElementById('options-menu-dropdown');
  if (dropdown) dropdown.remove();
}

// 6. AGENTS INVENTORY SCREEN
function renderAgentsScreen() {
  DOM.contentArea.innerHTML = `
    <div class="projects-container">
      <div class="page-header-row">
        <h2>agents inventory</h2>
        <button class="btn btn-primary" onclick="window.location.hash = '#/create-agent'">+ create agent</button>
      </div>
      
      <div class="agents-grid">
        ${state.agents.map(a => `
          <div class="agent-card">
            <div class="agent-card-header">
              <div class="agent-avatar agent-avatar-header">${getAgentAvatarSVG(a.category, 32)}</div>
              <div class="agent-card-name-group">
                <span class="agent-card-name">${a.name}</span>
                <span class="status-tag status-tag-${a.status}">${a.status}</span>
              </div>
            </div>
            <div class="agent-card-body">${a.desc}</div>
            
            <div class="agent-card-metrics">
              <div class="metric-row">
                <span class="metric-label">last execution</span>
                <span class="metric-value">${a.lastRun}</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">runs this month</span>
                <span class="metric-value">${a.runsThisMonth}</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">approval rate</span>
                <span class="metric-value">${a.approvalRate}</span>
              </div>
            </div>
            
            <div class="agent-card-actions">
              <button class="btn btn-outline btn-xs" onclick="toggleAgentStatus('${a.id}')">
                ${a.status === 'active' ? 'pause' : 'resume'}
              </button>
              <button class="btn btn-outline btn-xs" onclick="showToast('edit configurations')">configure</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function toggleAgentStatus(agentId) {
  const agent = state.agents.find(a => a.id === agentId);
  if (!agent) return;
  agent.status = agent.status === 'active' ? 'paused' : 'active';
  showToast(`agent status updated to "${agent.status}"`);
  renderView();
}

// 7. APPROVALS QUEUE SCREEN
function renderApprovalsScreen() {
  // Aggregate all pending and resolved approvals from chats
  const pendingApprovals = [];
  const completedApprovals = [];
  
  state.chats.forEach(c => {
    c.messages.forEach(m => {
      if (m.hasApprovalCard) {
        const item = {
          chatId: c.id,
          msgId: m.id,
          title: c.title,
          agent: c.agent,
          risk: m.approvalCard.risk,
          status: m.approvalCard.status,
          needed: m.approvalCard.needed,
          alternative: m.approvalCard.alternative
        };
        
        if (m.approvalCard.status === 'requested' || m.approvalCard.status === 'sent') {
          pendingApprovals.push(item);
        } else {
          completedApprovals.push(item);
        }
      }
    });
  });
  
  DOM.contentArea.innerHTML = `
    <div class="projects-container">
      <div class="page-header-row">
        <h2>governed approvals queue</h2>
      </div>
      
      <div class="approvals-list-container">
        <!-- PENDING APPROVALS -->
        <div class="approvals-group">
          <div class="approvals-group-title">pending action (${pendingApprovals.length})</div>
          ${pendingApprovals.length === 0 ? '<div class="text-secondary" style="padding: 10px;">no approvals awaiting review.</div>' : ''}
          ${pendingApprovals.map(a => `
            <div class="approval-item-row" id="app-row-${a.msgId}">
              <div class="approval-item-summary-line" onclick="toggleApprovalExpansion('${a.msgId}')">
                <div class="agent-avatar">${getAgentAvatarSVG(a.agent.category, 24)}</div>
                <div class="approval-item-title">${a.agent.name}</div>
                <div class="approval-item-summary-text">${a.title} — needs database permissions</div>
                <div class="approval-item-meta">
                  <span class="risk-badge risk-${a.risk}">${a.risk} risk</span>
                  <span class="text-metadata">5m ago</span>
                </div>
                <div class="approval-quick-actions" onclick="event.stopPropagation()">
                  <button class="btn btn-outline btn-xs" style="color:var(--status-complete-text)" onclick="approveItemDirect('${a.chatId}', '${a.msgId}')">approve</button>
                  <button class="btn btn-outline btn-xs" style="color:var(--status-failed-text)" onclick="showToast('request rejected')">reject</button>
                </div>
              </div>
              
              <!-- EXPANDED PANEL -->
              <div class="approval-expanded-panel" id="app-exp-${a.msgId}" style="display: none;">
                <div class="expanded-details-grid">
                  <div class="expanded-details-section">
                    <span class="expanded-section-label">governed items requested</span>
                    <ul class="approval-needed-list" style="padding-left:14px; margin-top:2px;">
                      ${a.needed.map(n => `<li>${n}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="expanded-details-section">
                    <span class="expanded-section-label">alternative path considered</span>
                    <p class="expanded-details-content">${a.alternative}</p>
                  </div>
                </div>
                
                <div class="expanded-actions-row">
                  <button class="btn btn-outline btn-xs" onclick="showToast('request rejected')">reject permission</button>
                  <button class="btn btn-primary btn-xs" onclick="approveItemDirect('${a.chatId}', '${a.msgId}')">grant scoped access</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- COMPLETED/HISTORY -->
        <div class="approvals-group" style="margin-top: 12px;">
          <div class="approvals-group-title">recently audited actions (${completedApprovals.length})</div>
          ${completedApprovals.map(a => `
            <div class="approval-item-row" style="opacity: 0.7;">
              <div class="approval-item-summary-line" style="cursor: default;">
                <div class="agent-avatar">${getAgentAvatarSVG(a.agent.category, 24)}</div>
                <div class="approval-item-title" style="text-decoration: line-through;">${a.agent.name}</div>
                <div class="approval-item-summary-text">${a.title}</div>
                <div class="approval-item-meta">
                  <span class="status-pill status-${a.status === 'granted' ? 'complete' : 'paused'}">${a.status === 'granted' ? 'granted' : 'bypassed'}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function toggleApprovalExpansion(msgId) {
  const panel = document.getElementById(`app-exp-${msgId}`);
  if (panel) {
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
  }
}

function approveItemDirect(chatId, msgId) {
  requestManagerApproval(chatId, msgId);
  showToast('governed permission granted successfully');
  setTimeout(() => {
    if (state.activeView === 'approvals') renderApprovalsScreen();
  }, 100);
}

// 8. SCHEDULE SCREEN
function renderScheduleScreen() {
  DOM.contentArea.innerHTML = `
    <div class="schedule-container">
      <div class="page-header-row">
        <h2>recurring execution schedules</h2>
      </div>
      
      <div class="calendar-grid">
        <div class="calendar-header">
          <span class="calendar-month-title">may 2026</span>
          <div class="page-header-actions">
            <button class="btn btn-outline btn-xs" onclick="showToast('schedule adjustments deferred')">< i class="ti ti-chevron-left"></i></button>
            <button class="btn btn-outline btn-xs" onclick="showToast('schedule adjustments deferred')">< i class="ti ti-chevron-right"></i></button>
          </div>
        </div>
        
        <div class="calendar-weekday">sun</div>
        <div class="calendar-weekday">mon</div>
        <div class="calendar-weekday">tue</div>
        <div class="calendar-weekday">wed</div>
        <div class="calendar-weekday">thu</div>
        <div class="calendar-weekday">fri</div>
        <div class="calendar-weekday">sat</div>
        
        <!-- Weeks -->
        <div class="calendar-day empty"></div>
        <div class="calendar-day empty"></div>
        <div class="calendar-day empty"></div>
        <div class="calendar-day empty"></div>
        <div class="calendar-day empty"></div>
        <div class="calendar-day"><span class="calendar-day-num">1</span></div>
        <div class="calendar-day"><span class="calendar-day-num">2</span></div>
        
        <div class="calendar-day"><span class="calendar-day-num">3</span></div>
        <div class="calendar-day">
          <span class="calendar-day-num">4</span>
          <div class="calendar-event">finance ledger audit</div>
        </div>
        <div class="calendar-day"><span class="calendar-day-num">5</span></div>
        <div class="calendar-day"><span class="calendar-day-num">6</span></div>
        <div class="calendar-day">
          <span class="calendar-day-num">7</span>
          <div class="calendar-event">hr access review</div>
        </div>
        <div class="calendar-day"><span class="calendar-day-num">8</span></div>
        <div class="calendar-day"><span class="calendar-day-num">9</span></div>
        
        <div class="calendar-day"><span class="calendar-day-num">10</span></div>
        <div class="calendar-day"><span class="calendar-day-num">11</span></div>
        <div class="calendar-day"><span class="calendar-day-num">12</span></div>
        <div class="calendar-day">
          <span class="calendar-day-num">13</span>
          <div class="calendar-event">finance ledger audit</div>
        </div>
        <div class="calendar-day"><span class="calendar-day-num">14</span></div>
        <div class="calendar-day"><span class="calendar-day-num">15</span></div>
        <div class="calendar-day"><span class="calendar-day-num">16</span></div>
        
        <div class="calendar-day"><span class="calendar-day-num">17</span></div>
        <div class="calendar-day"><span class="calendar-day-num">18</span></div>
        <div class="calendar-day"><span class="calendar-day-num">19</span></div>
        <div class="calendar-day"><span class="calendar-day-num">20</span></div>
        <div class="calendar-day"><span class="calendar-day-num">21</span></div>
        <div class="calendar-day"><span class="calendar-day-num">22</span></div>
        <div class="calendar-day"><span class="calendar-day-num">23</span></div>
      </div>
    </div>
  `;
}

// 9. ROI DASHBOARD SCREEN
function renderRoiScreen() {
  DOM.contentArea.innerHTML = `
    <div class="projects-container">
      <div class="page-header-row">
        <h2>ROI dashboard</h2>
      </div>
      
      <div class="roi-summary-row">
        <div class="metric-card">
          <span class="metric-card-label">runs this month</span>
          <span class="metric-card-value">237</span>
        </div>
        
        <div class="metric-card">
          <span class="metric-card-label">avg cost per run</span>
          <span class="metric-card-value">$0.42</span>
        </div>
        
        <div class="metric-card">
          <span class="metric-card-label">completion rate</span>
          <span class="metric-card-value">89%</span>
        </div>
        
        <div class="metric-card">
          <span class="metric-card-label">approval rate</span>
          <span class="metric-card-value">94%</span>
        </div>
      </div>
      
      <h2>agent cost breakdowns</h2>
      <div class="roi-table-container">
        <table class="roi-table">
          <thead>
            <tr>
              <th>agent name</th>
              <th>runs this month</th>
              <th>avg duration</th>
              <th>simulated cost</th>
              <th>completion rate</th>
              <th>approvals requested</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="roi-agent-cell">
                  <div class="agent-avatar">${getAgentAvatarSVG('finance_agent', 20)}</div>
                  <span>finance reviewer</span>
                </div>
              </td>
              <td>124</td>
              <td>1m 12s</td>
              <td>$52.08</td>
              <td>98%</td>
              <td>14</td>
            </tr>
            <tr>
              <td>
                <div class="roi-agent-cell">
                  <div class="agent-avatar">${getAgentAvatarSVG('hr_agent', 20)}</div>
                  <span>hr onboarder</span>
                </div>
              </td>
              <td>82</td>
              <td>45s</td>
              <td>$34.44</td>
              <td>92%</td>
              <td>2</td>
            </tr>
            <tr>
              <td>
                <div class="roi-agent-cell">
                  <div class="agent-avatar">${getAgentAvatarSVG('sales_agent', 20)}</div>
                  <span>sales coordinator</span>
                </div>
              </td>
              <td>31</td>
              <td>3m 15s</td>
              <td>$13.02</td>
              <td>79%</td>
              <td>18</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// --- MODALS ACTIONS & LOGIC ---

// Toast Notifications
function showToast(message) {
  DOM.toastMessage.textContent = message;
  DOM.toast.style.display = 'flex';
  
  if (state.toastTimeout) clearTimeout(state.toastTimeout);
  
  state.toastTimeout = setTimeout(() => {
    DOM.toast.style.display = 'none';
  }, 2500);
}

// Share Modal
function openShareModal(chatId) {
  const chat = state.chats.find(c => c.id === chatId);
  if (!chat) return;
  
  DOM.shareModal.style.display = 'flex';
  renderCollaborators(chat);
}

function renderCollaborators(chat) {
  DOM.collaboratorsList.innerHTML = '';
  chat.collaborators.forEach(c => {
    let name = 'alex rivers';
    let email = 'alex@acme.com';
    let avatarColor = 'purple';
    let role = 'owner';
    
    if (c === 'SJ') {
      name = 'sarah jenkins';
      email = 'sarah@acme.com';
      avatarColor = 'teal';
      role = 'approver';
    }
    
    const li = document.createElement('li');
    li.className = 'collaborator-item';
    li.innerHTML = `
      <div class="user-avatar user-color-${avatarColor}">${c}</div>
      <div class="collaborator-name-box">
        <span class="collaborator-name">${name}</span>
        <span class="collaborator-email">${email}</span>
      </div>
      <span class="collaborator-role">${role}</span>
      <button class="btn-remove-collab" onclick="removeCollaborator('${chat.id}', '${c}')" ${c === 'AR' ? 'disabled' : ''}>×</button>
    `;
    DOM.collaboratorsList.appendChild(li);
  });
}

function sendShareInvite() {
  const input = DOM.shareInviteInput.value.trim();
  if (input.length === 0) return;
  
  const chat = state.chats.find(c => c.id === state.activeChatId);
  if (!chat) return;
  
  // Extract initials
  const initials = input.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'XX';
  chat.collaborators.push(initials);
  
  DOM.shareInviteInput.value = '';
  renderCollaborators(chat);
  showToast(`invited "${input}" to join conversation`);
  renderChatScreen(); // update header avatars
}

function removeCollaborator(chatId, col) {
  const chat = state.chats.find(c => c.id === chatId);
  if (!chat) return;
  chat.collaborators = chat.collaborators.filter(c => c !== col);
  renderCollaborators(chat);
  renderChatScreen();
  showToast('collaborator removed');
}

function togglePublicLink(event) {
  const isChecked = event.target.checked;
  DOM.publicLinkPreviewBox.style.display = isChecked ? 'flex' : 'none';
}

function copyPublicLink() {
  navigator.clipboard.writeText(document.getElementById('public-link-text').innerText);
  showToast('copied public link to clipboard');
}

// Fork modal
function openForkModal(msgId) {
  const chat = state.chats.find(c => c.id === state.activeChatId);
  const msg = chat.messages.find(m => m.id === msgId);
  if (!msg) return;
  
  state.activeForkMsgId = msgId;
  
  document.getElementById('fork-preview-author').textContent = msg.senderName;
  document.getElementById('fork-preview-time').textContent = msg.timestamp;
  document.getElementById('fork-preview-content').textContent = msg.content;
  
  DOM.forkModal.style.display = 'flex';
}

function confirmFork() {
  const selectedOption = document.querySelector('input[name="fork-option"]:checked').value;
  const chat = state.chats.find(c => c.id === state.activeChatId);
  const msgIndex = chat.messages.findIndex(m => m.id === state.activeForkMsgId);
  if (msgIndex === -1) return;
  
  const newChatId = 'chat_fork_' + Date.now();
  let forkedMessages = [];
  
  if (selectedOption === 'from') {
    // Only from selected message forward (in our mock case just copy the selected one)
    forkedMessages = JSON.parse(JSON.stringify(chat.messages.slice(msgIndex)));
  } else {
    // Up to this point
    forkedMessages = JSON.parse(JSON.stringify(chat.messages.slice(0, msgIndex + 1)));
  }
  
  // Create a new fork chat
  const forkedChat = {
    id: newChatId,
    title: `branched: ${chat.title}`,
    status: 'running',
    elapsed: 'forked now',
    agent: chat.agent,
    collaborators: ['AR'],
    messages: forkedMessages
  };
  
  state.chats.unshift(forkedChat);
  renderRecentChatsList();
  closeModal('fork-modal');
  showToast('forked into new thread');
  
  // Redirect
  window.location.hash = `#/chats/${newChatId}`;
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

// ============================================================
//  DIRECTORY MODAL
// ============================================================

const directoryData = {
  skills: [
    { id: 'ds_1', name: '/web-artifacts-builder', meta: 'Anthropic • ⬇ 450.8K', desc: 'Suite of tools for creating elaborate, multi-component HTML artifacts using modern frontend web...', installed: true },
    { id: 'ds_2', name: '/skill-creator', meta: 'Anthropic • ⬇ 63.4K', desc: 'Create new skills, modify and improve existing skills, and measure skill performance.', installed: true },
    { id: 'ds_3', name: '/canvas-design', meta: 'Anthropic • ⬇ 723.8K', desc: 'Create beautiful visual art in .png and .pdf documents using design philosophy.', installed: false },
    { id: 'ds_4', name: '/mcp-builder', meta: 'Anthropic • ⬇ 367.9K', desc: 'Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with...', installed: false },
    { id: 'ds_5', name: '/theme-factory', meta: 'Anthropic • ⬇ 361K', desc: 'Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages...', installed: false },
    { id: 'ds_6', name: '/brand-guidelines', meta: 'Anthropic • ⬇ 330.4K', desc: "Applies Anthropic's official brand colors and typography to any sort of artifact that may benefit from having...", installed: false },
    { id: 'ds_7', name: '/doc-coauthoring', meta: 'Anthropic • ⬇ 322.9K', desc: 'Guide users through a structured workflow for co-authoring documentation.', installed: false },
    { id: 'ds_8', name: '/internal-comms', meta: 'Anthropic • ⬇ 248.7K', desc: 'A set of resources to help me write all kinds of internal communications, using the style of your company...', installed: false }
  ],
  tools: [
    { id: 'dc_1', name: 'Gmail', meta: '#2 popular', desc: 'Draft replies, summarize threads, & search your inbox', icon: 'ti-brand-gmail', installed: true },
    { id: 'dc_2', name: 'Canva', meta: '#4 popular', desc: 'Search, create, autofill, and export Canva designs', icon: 'ti-brand-canva', installed: true },
    { id: 'dc_3', name: 'Google Drive', meta: 'Most popular', desc: 'Search, read, and upload files instantly', icon: 'ti-brand-google-drive', installed: false },
    { id: 'dc_4', name: 'Microsoft 365', meta: '#8 popular', desc: "Access your company's SharePoint, OneDrive, Outlook, and Teams directly in Softworker", icon: 'ti-brand-windows', installed: false },
    { id: 'dc_5', name: 'Ironclad Contracts', meta: 'New', desc: 'Plain language search for faster contract answers', icon: 'ti-file-text', installed: false, isNew: true },
    { id: 'dc_6', name: 'Figma', meta: '#5 popular', desc: 'Generate diagrams and better code from Figma context', icon: 'ti-brand-figma', installed: true },
    { id: 'dc_7', name: 'Google Calendar', meta: '#3 popular', desc: 'Manage your schedule and coordinate meetings effortlessly', icon: 'ti-brand-google-calendar', installed: false },
    { id: 'dc_8', name: 'Notion', meta: '#6 popular', desc: 'Connect your Notion workspace to search, update, and power workflows across tools', icon: 'ti-brand-notion', installed: true },
    { id: 'dc_9', name: 'GitHub Integration', meta: '#7 popular', desc: 'Manage issues, pull requests, and repositories in your workflows.', icon: 'ti-brand-github', installed: true }
  ]
};

let directoryCurrentTab = 'skills';
let directorySearchQuery = '';

function openDirectoryModal(tab = 'skills') {
  directoryCurrentTab = tab;
  directorySearchQuery = '';
  const modal = document.getElementById('directory-modal');
  modal.style.display = 'flex';
  switchDirectoryTab(tab);
}

function closeDirectoryModal(event) {
  if (event && event.target !== document.getElementById('directory-modal')) return;
  document.getElementById('directory-modal').style.display = 'none';
}

function switchDirectoryTab(tab) {
  directoryCurrentTab = tab;
  directorySearchQuery = '';
  directoryActiveDetailId = null;

  // Hide detail pane on tab switch
  const pane = document.getElementById('directory-detail-pane');
  const card = document.querySelector('.directory-modal-card');
  if (pane) pane.style.display = 'none';
  if (card) card.classList.remove('detail-open');

  // Update nav active state
  ['skills', 'tools'].forEach(t => {
    const btn = document.getElementById(`dir-tab-${t}`);
    if (btn) btn.classList.toggle('active', t === tab);
  });

  // Update search placeholder
  const searchInput = document.getElementById('directory-search-input');
  if (searchInput) {
    searchInput.value = '';
    searchInput.placeholder = `Search ${tab}...`;
  }

  renderDirectoryGrid();
}

function filterDirectoryItems(query) {
  directorySearchQuery = query.toLowerCase();
  renderDirectoryGrid();
}

let directoryActiveDetailId = null;
let toolPermission = {}; // itemId → permission label

function getToolBrandLogo(name, icon) {
  const brandClasses = {
    'Gmail': 'logo-gmail',
    'Canva': 'logo-canva',
    'Google Drive': 'logo-drive',
    'Microsoft 365': 'logo-m365',
    'Ironclad Contracts': 'logo-ironclad',
    'Figma': 'logo-figma',
    'Google Calendar': 'logo-calendar',
    'Notion': 'logo-notion',
    'Slack': 'logo-slack',
    'GitHub Integration': 'logo-github'
  };
  const cls = brandClasses[name] || '';
  return `<i class="ti ${icon} ${cls}"></i>`;
}

function renderDirectoryGrid() {
  const grid = document.getElementById('directory-items-grid');
  if (!grid) return;

  const items = (directoryData[directoryCurrentTab] || []).filter(item => {
    if (!directorySearchQuery) return true;
    return item.name.toLowerCase().includes(directorySearchQuery) ||
           item.desc.toLowerCase().includes(directorySearchQuery);
  });

  if (items.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--color-text-tertiary);font-size:13px;">no results found</div>`;
    return;
  }

  grid.innerHTML = items.map(item => {
    const logoHTML = directoryCurrentTab === 'tools' 
      ? getToolBrandLogo(item.name, item.icon)
      : `<i class="ti ti-file-description" style="color:var(--color-accent-600)"></i>`;

    const actionIcon = item.installed ? 'ti-settings' : 'ti-plus';
    const actionClass = item.installed ? 'directory-card-action installed' : 'directory-card-action';
    const isActive = directoryActiveDetailId === item.id;

    const metaHTML = item.isNew
      ? `<span>${item.meta.replace('New', '').trim()}</span><span class="new-badge">New</span>`
      : `<span>${item.meta}</span>`;

    return `
      <div class="directory-card${isActive ? ' selected' : ''}" onclick="selectDirectoryCard('${item.id}', event)" style="${isActive ? 'border-color:var(--color-accent-400);background:var(--color-accent-50);' : ''}">
        <div class="directory-card-header">
          <div class="directory-card-name-row">
            <div class="directory-card-logo">${logoHTML}</div>
            <div class="directory-card-name-info">
              <div class="directory-card-name">${item.name}</div>
              <div class="directory-card-meta">${metaHTML}</div>
            </div>
          </div>
          <button class="${actionClass}" data-tooltip="${item.installed ? 'settings' : 'add'}"
            onclick="handleDirectoryAction('${item.id}', event)">
            <i class="ti ${actionIcon}"></i>
          </button>
        </div>
        <div class="directory-card-desc">${item.desc}</div>
      </div>
    `;
  }).join('');
}

function selectDirectoryCard(itemId, event) {
  // Don't trigger if clicking the action button
  if (event.target.closest('.directory-card-action')) return;
  const allItems = [...directoryData.skills, ...directoryData.tools];
  const item = allItems.find(i => i.id === itemId);
  if (!item || !item.installed) return;
  openDirectoryDetail(itemId);
}

function handleDirectoryAction(itemId, event) {
  event.stopPropagation();
  const allItems = [...directoryData.skills, ...directoryData.tools];
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;

  if (!item.installed) {
    // Install: add to state + mark installed
    item.installed = true;
    if (directoryCurrentTab === 'skills') {
      // Add to state.skills if not already there
      if (!state.skills.find(s => s.name === item.name)) {
        state.skills.push({ id: 'sk_' + Date.now(), name: item.name, desc: item.desc });
      }
    } else if (directoryCurrentTab === 'tools') {
      // Add to state.tools
      if (!state.tools.find(c => c.name === item.name)) {
        state.tools.push({ id: 'conn_' + Date.now(), name: item.name, icon: item.icon || 'ti-tool', enabled: true });
      }
    }
    showNotification(`${item.name} added successfully`);
    renderDirectoryGrid();
    renderRecentChatsList();
    // Auto-open detail
    openDirectoryDetail(itemId);
  } else {
    // Already installed → open Customize full screen!
    closeDirectoryModal();
    window.location.hash = `#/customize/${directoryCurrentTab}/${itemId}`;
  }
}

function openDirectoryDetail(itemId) {
  directoryActiveDetailId = itemId;
  const allItems = [...directoryData.skills, ...directoryData.tools];
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;

  const pane = document.getElementById('directory-detail-pane');
  const card = document.querySelector('.directory-modal-card');
  pane.style.display = 'flex';
  card.classList.add('detail-open');

  if (directoryCurrentTab === 'skills') {
    pane.innerHTML = renderSkillDetail(item);
  } else {
    pane.innerHTML = rendertoolDetail(item);
  }

  renderDirectoryGrid(); // refresh to show selected state
}

function closeDirectoryDetail() {
  directoryActiveDetailId = null;
  const pane = document.getElementById('directory-detail-pane');
  const card = document.querySelector('.directory-modal-card');
  if (pane) pane.style.display = 'none';
  if (card) card.classList.remove('detail-open');
  renderDirectoryGrid();
}

function renderSkillDetail(item) {
  const isEnabled = item.installed;
  return `
    <div class="detail-header">
      <div class="detail-header-top">
        <span class="detail-name">${item.name}</span>
        <div class="detail-header-actions">
          <label class="detail-toggle-label" data-tooltip="enable / disable">
            <input type="checkbox" ${isEnabled ? 'checked' : ''} onchange="toggleSkillEnabled('${item.id}', this.checked)">
            <span class="detail-toggle-slider"></span>
          </label>
          <button class="detail-more-btn" data-tooltip="more options"><i class="ti ti-dots"></i></button>
          <button class="detail-more-btn" onclick="closeDirectoryDetail()" data-tooltip="close"><i class="ti ti-x"></i></button>
        </div>
      </div>
    </div>
    <div class="detail-meta-row">
      <div class="detail-meta-item">
        <span class="detail-meta-label">Added by</span>
        <span class="detail-meta-value">Anthropic</span>
      </div>
      <div class="detail-meta-item">
        <span class="detail-meta-label">Trigger</span>
        <span class="detail-meta-value">slash command + auto</span>
      </div>
    </div>
    <div class="detail-desc-section">
      <div class="detail-section-label"><i class="ti ti-file-description"></i> Description</div>
      <p class="detail-desc-text">${item.desc}</p>
    </div>
    <div class="detail-preview-box">
      <div class="detail-preview-toolbar">
        <button class="detail-preview-toolbar-btn" data-tooltip="preview"><i class="ti ti-eye"></i></button>
        <button class="detail-preview-toolbar-btn" data-tooltip="code"><i class="ti ti-code"></i></button>
      </div>
      <div class="detail-preview-content">
        <h3>${item.name.replace('/', '')}</h3>
        <p>${item.desc}</p>
        <p>At a high level, using this skill:</p>
        <ul>
          <li>Define the goal clearly and let the skill handle the execution</li>
          <li>Review the output and iterate on prompts for best results</li>
          <li>Run evaluations to test performance across different inputs</li>
          <li>Optimize the skill description for better triggering accuracy</li>
        </ul>
      </div>
    </div>
  `;
}

function toggleSkillEnabled(itemId, enabled) {
  const allItems = [...directoryData.skills];
  const item = allItems.find(i => i.id === itemId);
  if (item) {
    item.installed = enabled;
    showNotification(`${item.name} ${enabled ? 'enabled' : 'disabled'}`);
    renderDirectoryGrid();
  }
}

function rendertoolDetail(item) {
  const perm = toolPermission[item.id] || 'Always allow';
  return `
    <div class="detail-header">
      <div class="detail-header-top">
        <span class="detail-name">${item.name}</span>
        <div class="detail-header-actions">
          <button class="detail-more-btn" data-tooltip="more options"><i class="ti ti-dots"></i></button>
          <button class="detail-more-btn" onclick="closeDirectoryDetail()" data-tooltip="close"><i class="ti ti-x"></i></button>
        </div>
      </div>
    </div>
    <div class="detail-permission-section">
      <p class="detail-permission-desc">${item.desc} Connect this integration to access its features directly inside your Softworker runs.</p>
      <div class="detail-permission-row" id="perm-row-${item.id}">
        <button class="detail-permission-btn" onclick="togglePermDropdown('${item.id}')">
          <i class="ti ti-circle-check"></i>
          <span id="perm-label-${item.id}">${perm}</span>
          <i class="ti ti-chevron-down"></i>
        </button>
      </div>
    </div>
    <div class="detail-perm-icon-bar">
      <button class="detail-perm-icon-btn ${perm === 'Always allow' ? 'active' : ''}" data-tooltip="always allow" onclick="settoolPerm('${item.id}', 'Always allow')"><i class="ti ti-circle-check"></i></button>
      <button class="detail-perm-icon-btn ${perm === 'Needs approval' ? 'active' : ''}" data-tooltip="needs approval" onclick="settoolPerm('${item.id}', 'Needs approval')"><i class="ti ti-hand-stop"></i></button>
      <button class="detail-perm-icon-btn ${perm === 'Blocked' ? 'active' : ''}" data-tooltip="blocked" onclick="settoolPerm('${item.id}', 'Blocked')"><i class="ti ti-ban"></i></button>
    </div>
  `;
}

function togglePermDropdown(itemId) {
  // Remove existing dropdown if open
  const existing = document.getElementById('perm-dropdown-' + itemId);
  if (existing) { existing.remove(); return; }

  const row = document.getElementById('perm-row-' + itemId);
  if (!row) return;

  const perm = toolPermission[itemId] || 'Always allow';
  const options = [
    { label: 'Always allow', icon: 'ti-circle-check' },
    { label: 'Needs approval', icon: 'ti-hand-stop' },
    { label: 'Blocked', icon: 'ti-ban' },
    { label: 'Custom', icon: 'ti-dots' }
  ];

  const dropdown = document.createElement('div');
  dropdown.id = 'perm-dropdown-' + itemId;
  dropdown.className = 'detail-perm-dropdown';
  dropdown.innerHTML = options.map(opt => `
    <div class="detail-perm-option" onclick="settoolPerm('${itemId}', '${opt.label}')">
      <div class="detail-perm-option-left">
        <i class="ti ${opt.icon}"></i>
        <span>${opt.label}</span>
      </div>
      ${perm === opt.label ? '<i class="ti ti-check detail-perm-check"></i>' : ''}
    </div>
  `).join('');

  row.appendChild(dropdown);

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function handler(e) {
      if (!dropdown.contains(e.target)) {
        dropdown.remove();
        document.removeEventListener('click', handler);
      }
    });
  }, 10);
}

function settoolPerm(itemId, perm) {
  toolPermission[itemId] = perm;
  showNotification(`${perm} permission set`);
  // Re-render detail
  openDirectoryDetail(itemId);
}

function toggleMoreOptions() {
  const submenu = document.getElementById('nav-more-submenu');
  const chevron = document.getElementById('nav-more-chevron');
  const textSpan = document.getElementById('nav-more-text');
  
  if (submenu.style.display === 'none') {
    submenu.style.display = 'block';
    chevron.style.transform = 'rotate(180deg)';
    if (textSpan) textSpan.innerText = 'show less';
  } else {
    submenu.style.display = 'none';
    chevron.style.transform = 'rotate(0deg)';
    if (textSpan) textSpan.innerText = 'more options';
  }
}

// --- GLOBAL TOOLTIP LOGIC ---
function initTooltips() {
  const tooltip = document.getElementById('global-tooltip');
  if (!tooltip) return;

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (target) {
      const text = target.getAttribute('data-tooltip');
      if (text) {
        tooltip.textContent = text;
        const rect = target.getBoundingClientRect();
        
        let top = rect.bottom + 8;
        let left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2);
        
        if (top + tooltip.offsetHeight > window.innerHeight) {
          top = rect.top - tooltip.offsetHeight - 8;
        }
        
        if (left < 8) left = 8;
        if (left + tooltip.offsetWidth > window.innerWidth - 8) {
          left = window.innerWidth - tooltip.offsetWidth - 8;
        }
        
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.classList.add('visible');
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (target) {
      tooltip.classList.remove('visible');
    }
  });
  
  document.addEventListener('mousedown', () => {
    tooltip.classList.remove('visible');
  });
}

// --- GLOBAL SEARCH LOGIC ---
function toggleGlobalSearch(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById('global-search-dropdown');
  const input = document.getElementById('global-search-input');
  
  if (dropdown.style.display === 'none' || dropdown.style.display === '') {
    closeAllDropdowns();
    dropdown.style.display = 'flex';
    input.focus();
    renderGlobalSearchResults();
    
    if (event) {
      const btnRect = event.currentTarget.getBoundingClientRect();
      dropdown.style.top = `${btnRect.bottom + 8}px`;
      let left = btnRect.right - 400; // width is 400px
      if (left < 10) left = 10;
      dropdown.style.left = `${left}px`;
    }
  } else {
    dropdown.style.display = 'none';
  }
}

function closeGlobalSearchDropdownOutside(event) {
  const dropdown = document.getElementById('global-search-dropdown');
  const btn = document.getElementById('btn-global-search');
  if (dropdown && dropdown.style.display !== 'none') {
    if (!dropdown.contains(event.target) && (!btn || !btn.contains(event.target))) {
      dropdown.style.display = 'none';
    }
  }
}

function renderGlobalSearchResults() {
  const list = document.querySelector('.search-results-list');
  const recentChats = state.chats.slice(0, 3);
  
  list.innerHTML = recentChats.map((c, i) => `
    <div class="search-result-item" onclick="navigateToChat('${c.id}'); document.getElementById('global-search-dropdown').style.display='none';">
      <div class="search-result-left">
        <span class="search-result-title">${c.name}</span>
      </div>
      <div class="search-result-right">
        <span>Nish Softwork...</span>
        <span class="search-result-shortcut">Ctrl+${i+1}</span>
      </div>
    </div>
  `).join('');
}

// ============================================================
//  CUSTOMIZE FULL-SCREEN PANEL
// ============================================================

function renderCustomizeScreen() {
  const container = document.getElementById('content-area');
  if (!container) return;

  const currentTab = state.customizeTab || 'skills';
  let activeItemId = state.customizeItemId;

  // Gather items depending on tab
  let personalItems = [];
  let builtInItems = [];
  let notConnectedItems = [];
  let desktopItems = [];

  if (currentTab === 'skills') {
    personalItems = directoryData.skills.filter(s => s.installed);
    builtInItems = [
      { id: 'sb_1', name: 'schedule', meta: 'Built-in', desc: 'Allows scheduling workflows and runs automatically.', icon: 'ti-clock', installed: true, isBuiltIn: true },
      { id: 'sb_2', name: 'setup-coworker', meta: 'Built-in', desc: 'Auto-provisioning workspace variables.', icon: 'ti-settings', installed: true, isBuiltIn: true },
      { id: 'sb_3', name: 'context', meta: 'Built-in', desc: 'Provides global contextual prompts to the models.', icon: 'ti-database', installed: true, isBuiltIn: true }
    ];
  } else {
    // tools
    const installedTools = directoryData.tools.filter(t => t.installed);
    personalItems = installedTools.filter(t => t.name !== 'Claude in Chrome' && t.name !== 'figma-console');
    desktopItems = [
      { id: 'dc_chrome', name: 'Claude in Chrome', meta: 'Included', desc: 'Accesses active Google Chrome browser context securely.', icon: 'ti-brand-chrome', installed: true, isDesktop: true, badge: 'INCLUDED' },
      { id: 'dc_figma_console', name: 'figma-console', meta: 'Local dev', desc: 'Local CLI integration for developer debugging.', icon: 'ti-terminal-2', installed: true, isDesktop: true, badge: 'LOCAL DEV' }
    ];
    notConnectedItems = directoryData.tools.filter(t => !t.installed);
  }

  // Get active item
  const allAvailableItems = [...personalItems, ...builtInItems, ...desktopItems, ...notConnectedItems];
  let activeItem = allAvailableItems.find(i => i.id === activeItemId);
  if (!activeItem && allAvailableItems.length > 0) {
    activeItem = allAvailableItems[0];
    activeItemId = activeItem.id;
    state.customizeItemId = activeItemId;
  }

  // Create inner sidebar html
  const sidebarHTML = `
    <div class="customize-inner-sidebar">
      <div class="customize-sidebar-title">Customize</div>
      <button class="customize-sidebar-nav-btn ${currentTab === 'skills' ? 'active' : ''}" onclick="window.location.hash='#/customize/skills'">
        <i class="ti ti-file-description"></i>
        <span>Skills</span>
      </button>
      <button class="customize-sidebar-nav-btn ${currentTab === 'tools' ? 'active' : ''}" onclick="window.location.hash='#/customize/tools'">
        <i class="ti ti-tool"></i>
        <span>Tools</span>
      </button>
    </div>
  `;

  // Create list panel html
  let listItemsHTML = '';
  if (currentTab === 'skills') {
    listItemsHTML += `<div class="customize-list-sec-title">Personal Skills</div>`;
    listItemsHTML += personalItems.map(item => `
      <div class="customize-item-card ${item.id === activeItemId ? 'active' : ''}" onclick="window.location.hash='#/customize/skills/${item.id}'">
        <div class="customize-item-card-left">
          <i class="ti ti-file-description" style="color:var(--color-accent-500)"></i>
          <span>${item.name}</span>
        </div>
      </div>
    `).join('');

    listItemsHTML += `<div class="customize-list-sec-title">Built-in Skills</div>`;
    listItemsHTML += builtInItems.map(item => `
      <div class="customize-item-card ${item.id === activeItemId ? 'active' : ''}" onclick="window.location.hash='#/customize/skills/${item.id}'">
        <div class="customize-item-card-left">
          <i class="ti ${item.icon || 'ti-file-description'}" style="color:var(--color-text-secondary)"></i>
          <span>${item.name}</span>
        </div>
      </div>
    `).join('');
  } else {
    // tools
    listItemsHTML += `<div class="customize-list-sec-title">Web</div>`;
    listItemsHTML += personalItems.map(item => `
      <div class="customize-item-card ${item.id === activeItemId ? 'active' : ''}" onclick="window.location.hash='#/customize/tools/${item.id}'">
        <div class="customize-item-card-left">
          ${getToolBrandLogo(item.name, item.icon)}
          <span>${item.name}</span>
        </div>
      </div>
    `).join('');

    listItemsHTML += `<div class="customize-list-sec-title">Desktop</div>`;
    listItemsHTML += desktopItems.map(item => `
      <div class="customize-item-card ${item.id === activeItemId ? 'active' : ''}" onclick="window.location.hash='#/customize/tools/${item.id}'">
        <div class="customize-item-card-left">
          <i class="ti ${item.icon}" style="color:var(--color-text-secondary)"></i>
          <span>${item.name}</span>
        </div>
        <span class="customize-detail-badge" style="font-size: 9px; padding: 1px 4px; scale: 0.85; margin-left:auto;">${item.badge}</span>
      </div>
    `).join('');

    if (notConnectedItems.length > 0) {
      listItemsHTML += `<div class="customize-list-sec-title">Not Connected</div>`;
      listItemsHTML += notConnectedItems.map(item => `
        <div class="customize-item-card ${item.id === activeItemId ? 'active' : ''}" onclick="window.location.hash='#/customize/tools/${item.id}'" style="opacity: 0.6;">
          <div class="customize-item-card-left">
            ${getToolBrandLogo(item.name, item.icon)}
            <span>${item.name}</span>
          </div>
        </div>
      `).join('');
    }
  }

  const listPanelHTML = `
    <div class="customize-list-panel">
      <div class="customize-list-header">
        <span class="customize-list-title">${currentTab === 'skills' ? 'Skills' : 'Connectors'}</span>
        <div class="customize-list-header-icons">
          <i class="ti ti-search" onclick="toggleCustomizeSearch()"></i>
          <i class="ti ti-plus" onclick="openDirectoryModal('${currentTab}')"></i>
        </div>
      </div>
      <div class="customize-list-scroll">
        ${listItemsHTML}
      </div>
    </div>
  `;

  // Create detail panel html
  let detailPanelHTML = '';
  if (activeItem) {
    if (currentTab === 'skills') {
      const isEnabled = activeItem.installed;
      const isBuiltIn = activeItem.isBuiltIn;
      
      detailPanelHTML = `
        <div class="customize-detail-panel">
          <div class="customize-detail-header">
            <div class="customize-detail-title-group">
              <div class="customize-detail-logo">
                <i class="ti ${activeItem.icon || 'ti-file-description'}" style="color:var(--color-accent-600)"></i>
              </div>
              <span class="customize-detail-name">${activeItem.name}</span>
              ${isBuiltIn ? '<span class="customize-detail-badge">BUILT-IN</span>' : ''}
            </div>
            <div class="customize-detail-header-actions">
              ${!isBuiltIn ? `
                <label class="detail-toggle-label" data-tooltip="enable / disable">
                  <input type="checkbox" ${isEnabled ? 'checked' : ''} onchange="toggleCustomizeSkillEnabled('${activeItem.id}', this.checked)">
                  <span class="detail-toggle-slider"></span>
                </label>
              ` : ''}
              <button class="detail-more-btn" data-tooltip="more options"><i class="ti ti-dots"></i></button>
            </div>
          </div>

          <div class="customize-detail-meta-row">
            <div class="customize-detail-meta-item">
              <span class="customize-detail-meta-label">Added by</span>
              <span class="customize-detail-meta-value">${isBuiltIn ? 'Softworker' : 'Anthropic'}</span>
            </div>
            <div class="customize-detail-meta-item">
              <span class="customize-detail-meta-label">Trigger</span>
              <span class="customize-detail-meta-value">slash command + auto</span>
            </div>
          </div>

          <div class="customize-section-title">
            <i class="ti ti-file-description"></i>
            <span>Description</span>
          </div>
          <p class="customize-desc-text">${activeItem.desc}</p>

          <div class="customize-doc-box">
            <div class="customize-doc-toolbar">
              <button class="customize-doc-toolbar-btn" data-tooltip="preview"><i class="ti ti-eye"></i></button>
              <button class="customize-doc-toolbar-btn" data-tooltip="code"><i class="ti ti-code"></i></button>
            </div>
            <div class="customize-doc-content">
              <h3>${activeItem.name.replace('/', '')}</h3>
              <p>${activeItem.desc}</p>
              <p>At a high level, using this skill:</p>
              <ul>
                <li>Define the goal clearly and let the skill handle the execution</li>
                <li>Review the output and iterate on prompts for best results</li>
                <li>Run evaluations to test performance across different inputs</li>
                <li>Optimize the skill description for better triggering accuracy</li>
              </ul>
            </div>
          </div>
        </div>
      `;
    } else {
      // tool detail
      const isConnected = activeItem.installed;
      const isDesktop = activeItem.isDesktop;
      const badgeText = isDesktop ? activeItem.badge : (isConnected ? 'Interactive' : 'Not Connected');

      detailPanelHTML = `
        <div class="customize-detail-panel">
          <div class="customize-detail-header">
            <div class="customize-detail-title-group">
              <div class="customize-detail-logo">
                ${getToolBrandLogo(activeItem.name, activeItem.icon)}
              </div>
              <span class="customize-detail-name">${activeItem.name}</span>
              <span class="customize-detail-badge">${badgeText}</span>
            </div>
            <div class="customize-detail-header-actions">
              ${isConnected && !isDesktop ? `
                <button class="btn btn-outline btn-xs" style="color:var(--color-danger-500); border-color:var(--color-danger-200); font-size:12px; padding: 4px 10px;" onclick="disconnectCustomizeTool('${activeItem.id}')">Disconnect</button>
              ` : ''}
              ${!isConnected ? `
                <button class="btn btn-primary btn-xs" style="font-size:12px; padding: 4px 10px;" onclick="connectCustomizeTool('${activeItem.id}')">Connect Tool</button>
              ` : ''}
              <button class="detail-more-btn" data-tooltip="more options"><i class="ti ti-dots"></i></button>
            </div>
          </div>

          <p class="customize-desc-text" style="font-size:13.5px; color:var(--color-text-secondary); margin-bottom:24px;">
            ${activeItem.desc} Connect this integration to access its features directly inside your Softworker runs.
          </p>

          ${isConnected ? `
            <div class="customize-section-title" style="margin-bottom:16px;">
              <i class="ti ti-shield-lock"></i>
              <span>Tool Permissions</span>
            </div>

            <!-- Interactive Tools Permissions Group -->
            <div class="customize-perm-group">
              <div class="customize-perm-group-header">
                <div class="customize-perm-group-title">
                  <span>Interactive tools</span>
                  <span class="customize-perm-group-badge">4</span>
                </div>
                <div class="detail-permission-row" style="margin:0; padding:0; border:none; background:transparent;">
                  <button class="detail-permission-btn" style="padding:4px 8px; font-size:12px;" onclick="showNotification('Global permission updated')">
                    <i class="ti ti-circle-check"></i>
                    <span>Always allow</span>
                    <i class="ti ti-chevron-down"></i>
                  </button>
                </div>
              </div>

              <!-- Perm Row 1 -->
              <div class="customize-perm-row">
                <span>generate-design</span>
                <div class="customize-perm-icons">
                  <button class="customize-perm-icon-btn active allow" data-tooltip="Allow" onclick="toggleToolPermState(this, 'allow')"><i class="ti ti-check"></i></button>
                  <button class="customize-perm-icon-btn needs-approval" data-tooltip="Needs approval" onclick="toggleToolPermState(this, 'needs-approval')"><i class="ti ti-hand-stop"></i></button>
                  <button class="customize-perm-icon-btn blocked" data-tooltip="Blocked" onclick="toggleToolPermState(this, 'blocked')"><i class="ti ti-ban"></i></button>
                </div>
              </div>

              <!-- Perm Row 2 -->
              <div class="customize-perm-row">
                <span>generate-design-structured</span>
                <div class="customize-perm-icons">
                  <button class="customize-perm-icon-btn active allow" data-tooltip="Allow" onclick="toggleToolPermState(this, 'allow')"><i class="ti ti-check"></i></button>
                  <button class="customize-perm-icon-btn needs-approval" data-tooltip="Needs approval" onclick="toggleToolPermState(this, 'needs-approval')"><i class="ti ti-hand-stop"></i></button>
                  <button class="customize-perm-icon-btn blocked" data-tooltip="Blocked" onclick="toggleToolPermState(this, 'blocked')"><i class="ti ti-ban"></i></button>
                </div>
              </div>

              <!-- Perm Row 3 -->
              <div class="customize-perm-row">
                <span>request-outline-review</span>
                <div class="customize-perm-icons">
                  <button class="customize-perm-icon-btn allow" data-tooltip="Allow" onclick="toggleToolPermState(this, 'allow')"><i class="ti ti-check"></i></button>
                  <button class="customize-perm-icon-btn active needs-approval" data-tooltip="Needs approval" onclick="toggleToolPermState(this, 'needs-approval')"><i class="ti ti-hand-stop"></i></button>
                  <button class="customize-perm-icon-btn blocked" data-tooltip="Blocked" onclick="toggleToolPermState(this, 'blocked')"><i class="ti ti-ban"></i></button>
                </div>
              </div>

              <!-- Perm Row 4 -->
              <div class="customize-perm-row">
                <span>search-designs</span>
                <div class="customize-perm-icons">
                  <button class="customize-perm-icon-btn active allow" data-tooltip="Allow" onclick="toggleToolPermState(this, 'allow')"><i class="ti ti-check"></i></button>
                  <button class="customize-perm-icon-btn needs-approval" data-tooltip="Needs approval" onclick="toggleToolPermState(this, 'needs-approval')"><i class="ti ti-hand-stop"></i></button>
                  <button class="customize-perm-icon-btn blocked" data-tooltip="Blocked" onclick="toggleToolPermState(this, 'blocked')"><i class="ti ti-ban"></i></button>
                </div>
              </div>
            </div>

            <!-- Read-only Tools Permissions Group -->
            <div class="customize-perm-group">
              <div class="customize-perm-group-header">
                <div class="customize-perm-group-title">
                  <span>Read-only tools</span>
                  <span class="customize-perm-group-badge">15</span>
                </div>
                <div class="detail-permission-row" style="margin:0; padding:0; border:none; background:transparent;">
                  <button class="detail-permission-btn" style="padding:4px 8px; font-size:12px;" onclick="showNotification('Global permission updated')">
                    <i class="ti ti-circle-check"></i>
                    <span>Always allow</span>
                    <i class="ti ti-chevron-down"></i>
                  </button>
                </div>
              </div>

              <!-- Perm Row 1 -->
              <div class="customize-perm-row">
                <span>export-design</span>
                <div class="customize-perm-icons">
                  <button class="customize-perm-icon-btn active allow" data-tooltip="Allow" onclick="toggleToolPermState(this, 'allow')"><i class="ti ti-check"></i></button>
                  <button class="customize-perm-icon-btn needs-approval" data-tooltip="Needs approval" onclick="toggleToolPermState(this, 'needs-approval')"><i class="ti ti-hand-stop"></i></button>
                  <button class="customize-perm-icon-btn blocked" data-tooltip="Blocked" onclick="toggleToolPermState(this, 'blocked')"><i class="ti ti-ban"></i></button>
                </div>
              </div>

              <!-- Perm Row 2 -->
              <div class="customize-perm-row">
                <span>get-assets</span>
                <div class="customize-perm-icons">
                  <button class="customize-perm-icon-btn active allow" data-tooltip="Allow" onclick="toggleToolPermState(this, 'allow')"><i class="ti ti-check"></i></button>
                  <button class="customize-perm-icon-btn needs-approval" data-tooltip="Needs approval" onclick="toggleToolPermState(this, 'needs-approval')"><i class="ti ti-hand-stop"></i></button>
                  <button class="customize-perm-icon-btn blocked" data-tooltip="Blocked" onclick="toggleToolPermState(this, 'blocked')"><i class="ti ti-ban"></i></button>
                </div>
              </div>

              <!-- Perm Row 3 -->
              <div class="customize-perm-row">
                <span>get-design</span>
                <div class="customize-perm-icons">
                  <button class="customize-perm-icon-btn active allow" data-tooltip="Allow" onclick="toggleToolPermState(this, 'allow')"><i class="ti ti-check"></i></button>
                  <button class="customize-perm-icon-btn needs-approval" data-tooltip="Needs approval" onclick="toggleToolPermState(this, 'needs-approval')"><i class="ti ti-hand-stop"></i></button>
                  <button class="customize-perm-icon-btn blocked" data-tooltip="Blocked" onclick="toggleToolPermState(this, 'blocked')"><i class="ti ti-ban"></i></button>
                </div>
              </div>
            </div>
          ` : `
            <div style="text-align:center; padding:48px 24px; border:0.5px dashed var(--color-border-secondary); border-radius:12px; margin-top:24px; background: var(--color-bg-secondary);">
              <i class="ti ti-plug-off" style="font-size:32px; color:var(--color-text-secondary); margin-bottom:12px; display:block;"></i>
              <h4 style="margin-bottom:8px; font-weight:600;">Tool Not Connected</h4>
              <p style="font-size:12.5px; color:var(--color-text-secondary); margin-bottom:16px; line-height:1.5;">Configure permissions and enable secure integrations inside your Softworker chat workspace.</p>
              <button class="btn btn-primary btn-sm" style="font-size:12px; padding: 6px 12px;" onclick="connectCustomizeTool('${activeItem.id}')">Connect integration</button>
            </div>
          `}
        </div>
      `;
    }
  } else {
    detailPanelHTML = `
      <div class="customize-detail-panel" style="align-items:center; justify-content:center; color:var(--color-text-secondary);">
        <i class="ti ti-click" style="font-size:32px; margin-bottom:12px;"></i>
        <span>Select a skill or connector to see its customization and settings</span>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="customize-container">
      ${sidebarHTML}
      ${listPanelHTML}
      ${detailPanelHTML}
    </div>
  `;
}

function toggleCustomizeSearch() {
  showNotification("Search filters active");
}

function toggleCustomizeSkillEnabled(itemId, checked) {
  const item = directoryData.skills.find(s => s.id === itemId);
  if (item) {
    item.installed = checked;
    showNotification(`${item.name} ${checked ? 'enabled' : 'disabled'}`);
    renderCustomizeScreen();
  }
}

function disconnectCustomizeTool(itemId) {
  const item = directoryData.tools.find(t => t.id === itemId);
  if (item) {
    item.installed = false;
    // Also remove from state.tools
    state.tools = state.tools.filter(t => t.name !== item.name);
    showNotification(`${item.name} disconnected successfully`);
    renderCustomizeScreen();
    renderRecentChatsList();
  }
}

function connectCustomizeTool(itemId) {
  const item = directoryData.tools.find(t => t.id === itemId);
  if (item) {
    item.installed = true;
    // Also add to state.tools if not already
    if (!state.tools.find(t => t.name === item.name)) {
      state.tools.push({ id: 'conn_' + Date.now(), name: item.name, icon: item.icon || 'ti-tool', enabled: true });
    }
    showNotification(`${item.name} connected successfully`);
    renderCustomizeScreen();
    renderRecentChatsList();
  }
}

function toggleToolPermState(button, stateName) {
  const container = button.closest('.customize-perm-icons');
  if (!container) return;
  container.querySelectorAll('.customize-perm-icon-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  showNotification(`Permission updated to ${stateName}`);
}

// ==========================================================================
// ENTERPRISE WORKSPACE SCREEN RENDER ENGINES (v2)
// ==========================================================================

function renderGlobalChannelScreen() {
  const activeWorkspace = state.workspaces.find(ws => ws.id === state.activeWorkspaceId) || state.workspaces[0];
  const wsMessages = state.globalMessages.filter(msg => msg.workspaceId === activeWorkspace.id);
  
  DOM.contentArea.innerHTML = `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 20px; text-align: left; height: 100%; overflow-y: auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:0.5px solid var(--color-border-secondary); padding-bottom:12px;">
        <div>
          <h2 style="font-size:20px; font-weight:600; color:var(--color-text-primary); margin:0;">global triage channel</h2>
          <div style="font-size:12.5px; color:var(--color-text-secondary); margin-top:2px;">central incoming inbox for events, webhooks, and manual delegation requests.</div>
        </div>
        <span class="badge badge-amber">${wsMessages.filter(m => m.status === 'triage').length} triage pending</span>
      </div>
      
      <div class="global-channel-list" style="margin-top: 10px;">
        ${wsMessages.length === 0 ? `
          <div style="text-align:center; padding:48px 24px; color:var(--color-text-secondary);">
            <i class="ti ti-mail-opened" style="font-size:32px; margin-bottom:12px; display:block;"></i>
            <span>No triage messages in this workspace.</span>
          </div>
        ` : wsMessages.map(msg => {
          const isExpanded = state.activeTriageRowId === msg.id;
          const hasSuggestedRoute = msg.intent && msg.intent.route;
          
          return `
            <div class="global-channel-row-wrapper">
              <div class="global-channel-row" onclick="toggleTriageRow('${msg.id}')">
                <div class="global-channel-row-left">
                  <i class="ti ${msg.status === 'triage' ? 'ti-alert-circle text-warning' : 'ti-circle-check text-success'}"></i>
                  <span class="global-channel-sender">${msg.sender}</span>
                  <span class="global-channel-preview" style="white-space:normal; overflow:visible;">${msg.content}</span>
                </div>
                <span class="triage-pill ${msg.status === 'triage' ? 'pill-amber' : 'pill-green'}">${msg.status}</span>
              </div>
              
              ${isExpanded ? `
                <div class="intent-card-container">
                  <div class="intent-card-box">
                    <div class="intent-card-header">suggested run route & intent params</div>
                    <div class="intent-card-rows">
                      <div class="intent-card-param-row">
                        <span class="intent-card-label">parsed intent:</span>
                        <span class="intent-card-value">${msg.intent ? msg.intent.parsed : 'unknown'}</span>
                      </div>
                      ${hasSuggestedRoute ? `
                        <div class="intent-card-param-row">
                          <span class="intent-card-label">action route:</span>
                          <span class="intent-card-value" style="color:var(--color-accent-blue);"><i class="ti ti-route"></i> ${msg.intent.route}</span>
                        </div>
                      ` : ''}
                      <div class="intent-card-param-row">
                        <span class="intent-card-label">confidence:</span>
                        <span class="intent-card-value">${msg.intent ? msg.intent.confidence : '0%'}</span>
                      </div>
                    </div>
                    <div class="intent-card-actions">
                      <button class="btn btn-primary btn-sm" onclick="approveTriageRow('${msg.id}')">Approve & Run</button>
                      <button class="btn btn-outline btn-sm" onclick="rejectTriageRow('${msg.id}')">Dismiss</button>
                      <button class="btn btn-outline btn-sm" onclick="escalateTriageRow('${msg.id}')"><i class="ti ti-users"></i> Escalate</button>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function setWorkstreamTab(tab) {
  state.workstreamTab = tab;
  renderView();
}

function renderWorkstreamScreen() {
  const activeWorkspace = state.workspaces.find(ws => ws.id === state.activeWorkspaceId) || state.workspaces[0];
  const wst = state.workstreams.find(w => w.id === state.activeWorkstreamId) || state.workstreams[0];
  
  if (!wst) {
    DOM.contentArea.innerHTML = `<div style="padding:24px; text-align:left;">No workstream selected.</div>`;
    return;
  }
  
  // Set up theme padding and overflow protection for this scroll-fixed layout view
  if (DOM.contentArea) {
    DOM.contentArea.style.padding = '0';
    DOM.contentArea.style.overflow = 'hidden';
  }
  
  state.workstreamTab = state.workstreamTab || 'Channel';
  const assignedAgent = state.agents.find(ag => ag.id === wst.agentId) || state.agents[0];
  
  // Initialize mock members, skills, runs and stats if none exist
  if (!wst.members) {
    wst.members = [
      { name: "Alex Rivers", initials: "AR", color: "#854F0B", role: "owner", type: "human", status: "online" },
      { name: "Priya R.", initials: "PR", color: "#534AB7", role: "operator", type: "human", status: "away" },
      { name: "James K.", initials: "JK", color: "#0F6E56", role: "reviewer", type: "human", status: "offline" },
      { name: "Finance reviewer", initials: "Fr", color: "#185FA5", role: "softworker · executor", type: "agent", status: wst.status === 'running' ? 'running' : 'online' }
    ];
  }
  if (!wst.skills) {
    wst.skills = ["Vendor Log Audit", "Anomaly Detection"];
  }
  if (!wst.stats) {
    wst.stats = { runs: 47, anomalies: 0, approvals: 3, rate: '100%' };
  }
  
  // Initialize dynamic workstream messages if none exist
  if (!wst.messages) {
    wst.messages = [
      {
        id: 'msg_wst_init',
        senderType: 'system',
        content: `workstream initialized · assigned to Finance reviewer · 2 days ago`
      },
      {
        id: 'msg_wst_human_1',
        sender: 'Alex Rivers',
        senderType: 'human',
        role: 'owner',
        avatarColor: '#854F0B',
        time: '2 days ago',
        content: 'Let\'s run a complete audit of the vendor billing logs for Q1. Look for anomalies, policy violations, or duplicates immediately.'
      },
      {
        id: 'msg_wst_agent_1',
        sender: 'Finance reviewer',
        senderType: 'agent',
        time: '2 days ago',
        content: 'Acknowledging the audit directive. I have generated the execution plan below to analyze the Q1 transaction records.',
        hasPlan: true,
        plan: {
          steps: [
            { id: 1, label: 'parse vendor invoice records from logs', status: 'done' },
            { id: 2, label: 'cross-check vendor IDs against authorization ledger', status: 'done' },
            { id: 3, label: 'detect anomalous charge quantities & pricing exceptions', status: 'done' },
            { id: 4, label: 'compile anomaly reports and post output', status: 'done' }
          ]
        }
      },
      {
        id: 'msg_wst_agent_2',
        sender: 'Finance reviewer',
        senderType: 'agent',
        time: '2 days ago',
        content: 'Q1 audit complete. 847 entries reconciled. 0 anomalies detected. 2 unapproved vendor profiles flagged for review.',
        hasOutputCard: true,
        outputCard: {
          title: 'Vendor log audit report - Q1 close.pdf',
          summary: '847 entries reviewed · 0 anomalies · 2 vendors flagged'
        }
      },
      {
        id: 'msg_wst_sys_scheduled',
        senderType: 'system',
        content: `scheduled daily run · 12 hours ago`
      },
      {
        id: 'msg_wst_agent_3',
        sender: 'Finance reviewer',
        senderType: 'agent',
        time: '12 hours ago',
        content: 'Launching automated daily execution check. Compiling active transaction tables...',
        hasPlan: true,
        plan: {
          steps: [
            { id: 1, label: 'pull active daily transaction logs', status: 'done' },
            { id: 2, label: 'cross-reference entries with bank ledger', status: 'active' },
            { id: 3, label: 'validate merchant credentials', status: 'pending' }
          ]
        }
      },
      {
        id: 'msg_wst_agent_4',
        sender: 'Finance reviewer',
        senderType: 'agent',
        time: '12 hours ago',
        content: 'I have encountered a policy block while trying to fetch merchant credentials. I require governed authorization to proceed.',
        hasApprovalCard: true,
        approvalCard: {
          id: 'app_default_1',
          title: 'Access credentials required',
          risk: 'medium',
          needed: 'read access token for central business ledger API',
          alternative: 'proceed using the raw CSV bank statements exported last month (covers 80% of validation steps).',
          status: 'requested'
        },
        comments: [
          {
            id: 'cmt_wst_1',
            author: 'Priya R.',
            avatarInitials: 'PR',
            avatarColor: '#534AB7',
            time: '10 hours ago',
            body: 'Do not grant full live bank ledger access yet. Let us wait for Sarah\'s review or try using the alternative path.',
            reactions: [{ emoji: '👍', count: 2, active: true }]
          }
        ]
      }
    ];
  }
  
  // Set up mock runs list if none exist
  if (!wst.runs) {
    wst.runs = [
      { id: 'run_wst_1', name: 'scheduled daily run', meta: 'Finance reviewer · 12 hrs ago', status: 'waiting' },
      { id: 'run_wst_2', name: 'daily scheduled run', meta: 'Finance reviewer · 1 day ago', status: 'done' },
      { id: 'run_wst_3', name: 'daily scheduled run', meta: 'Finance reviewer · 2 days ago', status: 'done' }
    ];
  }

  // Header collaborator avatars calculations
  const maxVisibleAvatars = 4;
  const visibleMembers = wst.members.slice(0, maxVisibleAvatars);
  const overflowCount = wst.members.length - maxVisibleAvatars;
  
  // Resolve outer layout markup
  DOM.contentArea.innerHTML = `
    <div class="workstream-page workstream-page-layout">
      
      <!-- MAIN WORKSTREAM CHANNEL AREA -->
      <div class="ws-main-content">
        
        <!-- HEADER ZONE -->
        <div class="ws-header">
          <div class="ws-header-title-row">
            <div class="ws-header-title-left">
              <span class="ws-live-dot ${wst.status === 'running' ? 'running' : (wst.status === 'paused' ? 'paused' : 'idle')}"></span>
              <span class="ws-title">${wst.name}</span>
            </div>
            
            <!-- Collaborators Avatars in Header -->
            <div class="ws-avatars-stack" onclick="scrollToRailSection('members')" style="cursor:pointer;" data-tooltip="view members">
              ${visibleMembers.map(m => `
                <div class="ws-avatar-circle" style="background-color:${m.color};" aria-label="${m.name} avatar">
                  ${m.initials}
                </div>
              `).join('')}
              ${overflowCount > 0 ? `
                <div class="ws-avatar-overflow">+${overflowCount}</div>
              ` : ''}
            </div>
          </div>
          
          <!-- Metadata row -->
          <div class="ws-header-meta-row">
            <span>Governed by <strong style="color:var(--ws-text-secondary); font-weight:500;">finance reviewer</strong></span>
            <span class="ws-dot-separator"></span>
            <span>runs daily · scheduled + manual</span>
            <span class="ws-dot-separator"></span>
            <span>${wst.members.length} members</span>
            <span class="ws-dot-separator"></span>
            
            <!-- Dynamic Run Status Pill -->
            ${wst.status === 'running' ? `
              <span class="ws-status-pill running"><span class="ws-inner-dot"></span>running</span>
            ` : (wst.status === 'paused' ? `
              <span class="ws-status-pill waiting"><span class="ws-inner-dot"></span>awaiting approval</span>
            ` : (wst.status === 'complete' ? `
              <span class="ws-status-pill done">last run complete</span>
            ` : `
              <span class="ws-status-pill idle">idle</span>
            `))}
          </div>
          
          <!-- Tabs row -->
          <div class="ws-tabs">
            <button class="ws-tab-btn ${state.workstreamTab === 'Channel' ? 'active' : ''}" onclick="setWorkstreamTab('Channel')"><i class="ti ti-messages" style="margin-right:4px;"></i> Channel</button>
            <button class="ws-tab-btn ${state.workstreamTab === 'Runs' ? 'active' : ''}" onclick="setWorkstreamTab('Runs')"><i class="ti ti-player-play" style="margin-right:4px;"></i> Runs</button>
            <button class="ws-tab-btn ${state.workstreamTab === 'Outputs' ? 'active' : ''}" onclick="setWorkstreamTab('Outputs')"><i class="ti ti-file-export" style="margin-right:4px;"></i> Outputs</button>
            <button class="ws-tab-btn ${state.workstreamTab === 'Skills' ? 'active' : ''}" onclick="setWorkstreamTab('Skills')"><i class="ti ti-tool" style="margin-right:4px;"></i> Skills</button>
            <button class="ws-tab-btn ${state.workstreamTab === 'Members' ? 'active' : ''}" onclick="setWorkstreamTab('Members')"><i class="ti ti-users" style="margin-right:4px;"></i> Members</button>
            <button class="ws-tab-btn ${state.workstreamTab === 'Settings' ? 'active' : ''}" onclick="setWorkstreamTab('Settings')"><i class="ti ti-settings" style="margin-right:4px;"></i> Settings</button>
          </div>
        </div>
        
        <!-- MAIN VIEW FLEX CONTAINER -->
        <div style="flex:1; display:flex; flex-direction:column; min-height:0; position:relative;">
          ${renderActiveWorkstreamTab(wst)}
        </div>
        
      </div>
      
      <!-- ALWAYS VISIBLE RIGHT RAIL -->
      <div class="ws-rail" id="workstream-right-rail">
        
        <!-- Members Section -->
        <div class="ws-rail-section" id="rail-section-members">
          <div class="ws-rail-section-header">
            <span class="ws-label-caps">Members</span>
          </div>
          <div style="display:flex; flex-direction:column;">
            ${wst.members.map(m => `
              <div class="ws-rail-member-row">
                <div class="ws-rail-member-avatar ${m.type === 'human' ? 'human' : 'agent'}" style="background-color:${m.color};" aria-label="${m.name} avatar">
                  ${m.initials}
                </div>
                <div class="ws-rail-member-info">
                  <span class="ws-rail-member-name">${m.name}</span>
                  <span class="ws-rail-member-role">${m.role}</span>
                </div>
                <span class="ws-rail-status-dot ${m.status}"></span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Skills Section -->
        <div class="ws-rail-section" id="rail-section-skills">
          <div class="ws-rail-section-header">
            <span class="ws-label-caps">Skills attached</span>
          </div>
          <div style="display:flex; flex-direction:column;">
            ${wst.skills.map(sk => `
              <div class="ws-rail-skill-row" onclick="window.location.hash='#/customize/skills'">
                <i class="ti ti-tool"></i>
                <span>${sk}</span>
              </div>
            `).join('')}
            <div class="ws-rail-add-skill-row" onclick="addWorkstreamSkill('${wst.id}')">
              <i class="ti ti-plus" style="font-size:12px;"></i>
              <span>+ Add skill</span>
            </div>
          </div>
        </div>
        
        <!-- Recent Runs Section -->
        <div class="ws-rail-section" id="rail-section-runs">
          <div class="ws-rail-section-header">
            <span class="ws-label-caps">Recent runs</span>
            <span class="ws-rail-link" onclick="setWorkstreamTab('Runs')">View all</span>
          </div>
          <div style="display:flex; flex-direction:column;">
            ${wst.runs.slice(0, 3).map(r => `
              <div class="ws-rail-run-row">
                <div class="ws-rail-run-top">
                  <div style="display:flex; align-items:center; gap:6px;">
                    <i class="ti ti-activity" style="font-size:14px; color:var(--ws-text-tertiary);"></i>
                    <span class="ws-rail-run-name" title="${r.name}">${r.name}</span>
                  </div>
                  <span class="ws-rail-run-status ${r.status}">${r.status}</span>
                </div>
                <span class="ws-rail-run-meta">${r.meta}</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Impact Stats Section -->
        <div class="ws-rail-section" id="rail-section-stats">
          <div class="ws-rail-section-header">
            <span class="ws-label-caps">This month</span>
          </div>
          <div class="ws-rail-stats-grid">
            <div class="ws-rail-stat-card">
              <i class="ti ti-player-play" style="color:var(--ws-text-secondary); margin-bottom:6px; font-size:16px;"></i>
              <span class="ws-rail-stat-number">${wst.stats.runs}</span>
              <span class="ws-rail-stat-label">runs completed</span>
            </div>
            <div class="ws-rail-stat-card">
              <i class="ti ti-alert-triangle" style="color:var(--ws-text-secondary); margin-bottom:6px; font-size:16px;"></i>
              <span class="ws-rail-stat-number">${wst.stats.anomalies}</span>
              <span class="ws-rail-stat-label">anomalies found</span>
            </div>
            <div class="ws-rail-stat-card">
              <i class="ti ti-shield-check" style="color:var(--ws-text-secondary); margin-bottom:6px; font-size:16px;"></i>
              <span class="ws-rail-stat-number">${wst.stats.approvals}</span>
              <span class="ws-rail-stat-label">approvals asked</span>
            </div>
            <div class="ws-rail-stat-card">
              <i class="ti ti-chart-pie" style="color:var(--ws-green-text); margin-bottom:6px; font-size:16px;"></i>
              <span class="ws-rail-stat-number" style="color:var(--ws-green-text);">${wst.stats.rate}</span>
              <span class="ws-rail-stat-label">completion rate</span>
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
  `;

  // Auto-scroll feed to bottom
  if (state.workstreamTab === 'Channel') {
    const feed = document.getElementById('workstream-channel-feed');
    if (feed) feed.scrollTop = feed.scrollHeight;
  }
}

// Render dynamic content based on active workstream tab
function renderActiveWorkstreamTab(wst) {
  if (state.workstreamTab === 'Channel') {
    return `
      <!-- Scrollable collaborative feed -->
      <div class="ws-feed" id="workstream-channel-feed">
        ${renderWorkstreamMessagesList(wst)}
      </div>
      
      <!-- FIXED BOTTOM PROMPT AREA -->
      <div class="ws-prompt-area" style="padding: 16px; background-color: var(--ws-bg-primary); border-top: 1px solid var(--ws-border-subtle);">
        ${getPromptBoxHTML(
          state.activeChips.some(c => c.label === 'redirect') 
            ? 'Give the agent new instructions...' 
            : 'Message the workstream, instruct Finance reviewer, or add context...',
          'workstream-composer'
        )}
      </div>
    `;
  } else if (state.workstreamTab === 'Runs') {
    return `
      <div style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:12px; background-color:var(--ws-bg-primary);">
        <span class="ws-label-caps" style="text-align:left; margin-bottom:4px;">Full Execution History</span>
        ${wst.runs.map(run => `
          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--ws-bg-secondary); border:1px solid var(--ws-border-subtle); border-radius:8px; padding:12px 16px; text-align:left;">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="ws-status-pill ${run.status === 'done' ? 'done' : (run.status === 'running' ? 'running' : (run.status === 'waiting' ? 'waiting' : 'failed'))}">
                  ${run.status === 'running' ? '<span class="ws-inner-dot"></span>' : ''}
                  ${run.status}
                </span>
                <span style="font-size:13.5px; font-weight:500; color:var(--ws-text-primary);">${run.name}</span>
              </div>
              <div style="font-size:11.5px; color:var(--ws-text-secondary); margin-top:4px;">
                Logs: <span class="ws-mono" style="background:var(--ws-bg-tertiary); padding:2px 6px; border-radius:4px; color:var(--ws-text-primary);">${run.status === 'done' ? 'audit succeeded · 0 anomalies' : (run.status === 'running' ? 'analyzing merchant registry' : 'awaiting credential sync')}</span>
              </div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:12px; font-weight:500; color:var(--ws-text-primary);">${run.status === 'done' ? '8s' : '—'}</span><br>
              <span style="font-size:11px; color:var(--ws-text-tertiary);">${run.meta}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (state.workstreamTab === 'Outputs') {
    return `
      <div style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:12px; background-color:var(--ws-bg-primary);">
        <span class="ws-label-caps" style="text-align:left; margin-bottom:4px;">Deliverables Log</span>
        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px;">
          <div style="background:var(--ws-bg-secondary); border:1px solid var(--ws-border-subtle); border-radius:8px; padding:16px; text-align:left; display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <i class="ti ti-file-spreadsheet" style="font-size:24px; color:var(--ws-green-text);"></i>
              <div style="display:flex; flex-direction:column;">
                <span style="font-size:13px; font-weight:500; color:var(--ws-text-primary);">vendor_outreach_close_report.xlsx</span>
                <span style="font-size:11px; color:var(--ws-text-tertiary);">xlsx spreadsheet · 2.4 mb · generated 12 hrs ago</span>
              </div>
            </div>
            <div style="display:flex; gap:6px; justify-content:flex-end; margin-top:8px;">
              <button class="ws-btn-secondary" style="padding:4px 10px; font-size:11px;" onclick="showNotification('opening spreadsheet viewer...')">View output</button>
              <button class="ws-btn-approve" style="padding:4px 10px; font-size:11px; background-color:var(--ws-blue);" onclick="showNotification('downloading spreadsheet...')">Download</button>
            </div>
          </div>
          
          <div style="background:var(--ws-bg-secondary); border:1px solid var(--ws-border-subtle); border-radius:8px; padding:16px; text-align:left; display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <i class="ti ti-file-text" style="font-size:24px; color:var(--ws-blue-text);"></i>
              <div style="display:flex; flex-direction:column;">
                <span style="font-size:13px; font-weight:500; color:var(--ws-text-primary);">flagged_vendor_anomalies_audit.pdf</span>
                <span style="font-size:11px; color:var(--ws-text-tertiary);">pdf document · 450 kb · generated 2 days ago</span>
              </div>
            </div>
            <div style="display:flex; gap:6px; justify-content:flex-end; margin-top:8px;">
              <button class="ws-btn-secondary" style="padding:4px 10px; font-size:11px;" onclick="showNotification('opening pdf viewer...')">View output</button>
              <button class="ws-btn-approve" style="padding:4px 10px; font-size:11px; background-color:var(--ws-blue);" onclick="showNotification('downloading pdf...')">Download</button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (state.workstreamTab === 'Skills') {
    return `
      <div style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:12px; background-color:var(--ws-bg-primary);">
        <span class="ws-label-caps" style="text-align:left; margin-bottom:4px;">Attached Capabilities</span>
        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px;">
          <div style="background:var(--ws-bg-secondary); border:1px solid var(--ws-border-subtle); border-radius:8px; padding:14px; text-align:left; display:flex; align-items:flex-start; gap:12px; cursor:pointer;" onclick="window.location.hash='#/customize/skills'">
            <div style="background-color:var(--ws-blue-dim); color:var(--ws-blue-text); width:32px; height:32px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:16px;">
              <i class="ti ti-mail-forward"></i>
            </div>
            <div style="display:flex; flex-direction:column;">
              <span style="font-size:13px; font-weight:500; color:var(--ws-text-primary);">Vendor Log Audit</span>
              <span style="font-size:11.5px; color:var(--ws-text-secondary); margin-top:2px;">Scrapes billing database tables and matches receipts against merchant IDs.</span>
            </div>
          </div>
          
          <div style="background:var(--ws-bg-secondary); border:1px solid var(--ws-border-subtle); border-radius:8px; padding:14px; text-align:left; display:flex; align-items:flex-start; gap:12px; cursor:pointer;" onclick="window.location.hash='#/customize/skills'">
            <div style="background-color:var(--ws-purple-dim); color:var(--ws-purple); width:32px; height:32px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:16px;">
              <i class="ti ti-shield-code"></i>
            </div>
            <div style="display:flex; flex-direction:column;">
              <span style="font-size:13px; font-weight:500; color:var(--ws-text-primary);">Anomaly Detection</span>
              <span style="font-size:11.5px; color:var(--ws-text-secondary); margin-top:2px;">Deep statistical verification to isolate billing duplicates or pricing anomalies.</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (state.workstreamTab === 'Members') {
    return `
      <div style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:12px; background-color:var(--ws-bg-primary);">
        <span class="ws-label-caps" style="text-align:left; margin-bottom:4px;">Workspace Co-workers</span>
        <div style="background:var(--ws-bg-secondary); border:1px solid var(--ws-border-subtle); border-radius:8px; display:flex; flex-direction:column;">
          ${wst.members.map((m, idx) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:${idx === wst.members.length - 1 ? 'none' : '1px solid var(--ws-border-subtle)'};">
              <div style="display:flex; align-items:center; gap:12px;">
                <div class="ws-avatar-circle" style="width:28px; height:28px; font-size:11px; margin-left:0; background-color:${m.color}; border-radius:${m.type === 'human' ? '50%' : '6px'};">
                  ${m.initials}
                </div>
                <div style="display:flex; flex-direction:column; text-align:left;">
                  <span style="font-size:13px; font-weight:500; color:var(--ws-text-primary);">${m.name}</span>
                  <span style="font-size:11px; color:var(--ws-text-tertiary);">${m.role}</span>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:11.5px; color:var(--ws-text-secondary);">${m.status === 'running' ? 'active in run' : m.status}</span>
                <span class="ws-rail-status-dot ${m.status}" style="margin-left:0;"></span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (state.workstreamTab === 'Settings') {
    return `
      <div style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; background-color:var(--ws-bg-primary);">
        <span class="ws-label-caps" style="text-align:left; margin-bottom:8px;">Rules & Routing Parameters</span>
        <div style="background:var(--ws-bg-secondary); border:1px solid var(--ws-border-subtle); border-radius:8px; padding:20px; text-align:left; display:flex; flex-direction:column; gap:16px;">
          <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:16px;">
            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:10.5px; font-weight:500; color:var(--ws-text-secondary); text-transform:uppercase;">workstream name</label>
              <input type="text" id="cfg-wst-name" value="${wst.name}" style="background:var(--ws-bg-primary); border:1px solid var(--ws-border-default); color:var(--ws-text-primary); border-radius:6px; padding:8px; font-size:13px; outline:none; font-family:inherit;">
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:10.5px; font-weight:500; color:var(--ws-text-secondary); text-transform:uppercase;">assigned softworker</label>
              <select id="cfg-wst-agent" style="background:var(--ws-bg-primary); border:1px solid var(--ws-border-default); color:var(--ws-text-primary); border-radius:6px; padding:8px; font-size:13px; outline:none; font-family:inherit;">
                ${state.agents.map(ag => `<option value="${ag.id}" ${ag.id === wst.agentId ? 'selected' : ''}>${ag.name}</option>`).join('')}
              </select>
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:10.5px; font-weight:500; color:var(--ws-text-secondary); text-transform:uppercase;">execution schedule</label>
              <select id="cfg-wst-freq" style="background:var(--ws-bg-primary); border:1px solid var(--ws-border-default); color:var(--ws-text-primary); border-radius:6px; padding:8px; font-size:13px; outline:none; font-family:inherit;">
                <option value="daily" ${wst.frequency === 'daily' ? 'selected' : ''}>daily at 9:00 AM</option>
                <option value="weekly" ${wst.frequency === 'weekly' ? 'selected' : ''}>weekly on mondays</option>
                <option value="continuous" ${wst.frequency === 'continuous' ? 'selected' : ''}>continuous (event driven)</option>
                <option value="manual" ${wst.frequency === 'manual' ? 'selected' : ''}>manual trigger</option>
              </select>
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:10.5px; font-weight:500; color:var(--ws-text-secondary); text-transform:uppercase;">active status</label>
              <select id="cfg-wst-status" style="background:var(--ws-bg-primary); border:1px solid var(--ws-border-default); color:var(--ws-text-primary); border-radius:6px; padding:8px; font-size:13px; outline:none; font-family:inherit;">
                <option value="running" ${wst.status === 'running' ? 'selected' : ''}>Active Running</option>
                <option value="paused" ${wst.status === 'paused' ? 'selected' : ''}>Paused / Blocked</option>
              </select>
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:8px;">
            <button class="ws-btn-approve" onclick="saveWorkstreamConfig('${wst.id}')">Save changes</button>
          </div>
        </div>
      </div>
    `;
  }
}

// Render dynamic coworker feed items
function renderWorkstreamMessagesList(wst) {
  if (wst.messages.length === 0) {
    return `
      <div class="ws-empty-state-container">
        <div class="ws-empty-state-illustration">
          <i class="ti ti-messages"></i>
        </div>
        <span class="ws-empty-state-title">Workstream ready</span>
        <p class="ws-empty-state-body">Finance reviewer is assigned and waiting. Send a message or trigger a run to start.</p>
        <button class="ws-empty-state-cta" onclick="simulateWorkstreamRun('${wst.id}')">Run first check</button>
      </div>
    `;
  }
  
  let html = '';
  let lastSender = '';
  let lastTime = null;
  
  wst.messages.forEach(msg => {
    // Process system divider messages
    if (msg.senderType === 'system') {
      html += `
        <div class="ws-system-message">
          <div class="ws-system-message-divider"></div>
          <span class="ws-system-message-text">${msg.content}</span>
          <div class="ws-system-message-divider"></div>
        </div>
      `;
      lastSender = 'system';
      return;
    }
    
    // Grouping rule: sender matches and time within 5 minutes (mocked via exact string match)
    const isGrouped = (msg.sender === lastSender) && (lastSender !== 'system');
    lastSender = msg.sender;
    
    if (isGrouped) {
      // Subordinated follow-up message body
      html += `
        <div class="ws-message-container">
          <div class="ws-message-sub">
            <div class="ws-message-body ${msg.senderType}">
              ${msg.content}
            </div>
            ${renderEmbeddedCards(msg)}
            ${renderCommentThread(msg)}
          </div>
        </div>
      `;
    } else {
      // Full message item layout
      const isAgent = msg.senderType === 'agent';
      const initials = isAgent ? msg.sender.substring(0, 2) : msg.sender.split(' ').map(n=>n[0]).join('');
      
      html += `
        <div class="ws-message-container">
          <div class="ws-message-item">
            
            <!-- Left Avatar -->
            <div class="ws-message-avatar-wrap">
              <div class="ws-message-avatar ${isAgent ? 'ws-avatar-agent' : 'ws-avatar-human'}" style="background-color:${isAgent ? '#185FA5' : (msg.avatarColor || '#854F0B')}">
                ${initials}
              </div>
            </div>
            
            <!-- Right Content -->
            <div class="ws-message-content-wrap">
              <div class="ws-message-header">
                <span class="ws-message-sender-name">${msg.sender}</span>
                
                <!-- Role badges -->
                ${isAgent ? `
                  <span class="ws-message-role-badge softworker">softworker</span>
                ` : `
                  <span class="ws-message-role-badge ${msg.role || 'operator'}">${msg.role || 'operator'}</span>
                `}
                
                <span class="ws-message-timestamp">${msg.time}</span>
              </div>
              
              <div class="ws-message-body ${msg.senderType}">
                ${msg.content}
              </div>
              
              ${renderEmbeddedCards(msg)}
              ${renderCommentThread(msg)}
              
            </div>
            
            <!-- Inline Hover Actions -->
            <div class="ws-hover-actions">
              <button class="ws-hover-btn" onclick="showInlineReplyInput('${msg.id}')" data-tooltip="Reply in thread">
                <i class="ti ti-message-reply"></i>
              </button>
              <button class="ws-hover-btn" onclick="triggerForkDialog('${msg.id}')" data-tooltip="Fork conversation">
                <i class="ti ti-git-branch"></i>
              </button>
              <button class="ws-hover-btn" onclick="showReactionPicker('${msg.id}')" data-tooltip="React">
                <i class="ti ti-mood-smile"></i>
              </button>
              <button class="ws-hover-btn" onclick="showNotification('more options')" data-tooltip="More">
                <i class="ti ti-dots"></i>
              </button>
            </div>
            
          </div>
        </div>
      `;
    }
  });
  
  return html;
}

// Render embedded card items (plan, approval, output)
function renderEmbeddedCards(msg) {
  let cardHTML = '';
  
  // Plan card
  if (msg.hasPlan && msg.plan) {
    cardHTML += `
      <div class="ws-plan-card">
        <div class="ws-plan-header">Plan</div>
        ${msg.plan.steps.map(step => {
          let stepClass = 'pending';
          let icon = '<i class="ti ti-circle"></i>';
          if (step.status === 'done') {
            stepClass = 'done';
            icon = '<i class="ti ti-check" style="color:var(--ws-green);"></i>';
          } else if (step.status === 'active') {
            stepClass = 'active';
            icon = '<i class="ti ti-loader"></i>';
          }
          
          return `
            <div class="ws-plan-step ${stepClass}">
              <span class="ws-step-icon ${step.status === 'active' ? 'active' : ''}">${icon}</span>
              <span>${step.label}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  
  // Approval Card
  if (msg.hasApprovalCard && msg.approvalCard) {
    const card = msg.approvalCard;
    
    if (card.status === 'requested') {
      cardHTML += `
        <div class="ws-approval-card">
          <div class="ws-approval-header-row">
            <i class="ti ti-shield" style="color:var(--ws-amber); font-size:15px;"></i>
            <span class="ws-approval-title">Access credentials required</span>
            <span class="ws-risk-badge ${card.risk || 'medium'}">${card.risk || 'medium'} risk</span>
          </div>
          
          <div class="ws-approval-body-text">
            The agent needs the following permissions to complete this execution check:<br>
            <strong style="color:var(--ws-text-primary); font-weight:500;">· ${card.needed}</strong>
          </div>
          
          <div class="ws-approval-alt-path">
            <span class="ws-approval-alt-label">Alternative path</span>
            <span class="ws-approval-alt-text">${card.alternative}</span>
          </div>
          
          <div class="ws-approval-actions">
            <button class="ws-btn-approve" onclick="resolveInlineApproval('${msg.id}', 'granted')">Grant access</button>
            <button class="ws-btn-secondary" onclick="resolveInlineApproval('${msg.id}', 'alternative')">Use alternative path</button>
            <button class="ws-btn-secondary" onclick="resolveInlineApproval('${msg.id}', 'rejected')">Decline</button>
          </div>
        </div>
      `;
    } else if (card.status === 'granted') {
      cardHTML += `
        <div class="ws-approval-card">
          <div class="ws-approval-resolved granted">
            <span class="ws-resolved-title">
              <i class="ti ti-circle-check" style="color:var(--ws-green);"></i>
              Access granted
            </span>
            <span class="ws-resolved-sub">${card.needed} · scoped to this run only</span>
            <span class="ws-resolved-sub" style="font-size:10px; opacity:0.8; margin-top:2px;">Granted by ${card.resolvedBy || 'Alex Rivers'} · just now</span>
          </div>
        </div>
      `;
    } else if (card.status === 'alternative') {
      cardHTML += `
        <div class="ws-approval-card">
          <div class="ws-approval-resolved alt">
            <span class="ws-resolved-title">
              <i class="ti ti-info-circle"></i>
              Proceeding with alternative path
            </span>
            <span class="ws-resolved-sub">Using cached vendor list from last month</span>
            <span class="ws-resolved-sub" style="font-size:10px; opacity:0.8; margin-top:2px;">Triggered by ${card.resolvedBy || 'Alex Rivers'} · just now</span>
          </div>
        </div>
      `;
    } else if (card.status === 'rejected') {
      cardHTML += `
        <div class="ws-approval-card">
          <div class="ws-approval-resolved rejected">
            <span class="ws-resolved-title">
              <i class="ti ti-circle-x" style="color:var(--ws-red);"></i>
              Run Declined
            </span>
            <span class="ws-resolved-sub">Credentials verification blocked. Execution paused.</span>
          </div>
        </div>
      `;
    }
  }
  
  // Output Card
  if (msg.hasOutputCard && msg.outputCard) {
    cardHTML += `
      <div class="ws-output-card">
        <div class="ws-output-header-row">
          <i class="ti ti-file-text" style="color:var(--ws-green); font-size:14px;"></i>
          <span class="ws-output-title">Output ready — ${msg.outputCard.title}</span>
        </div>
        <div class="ws-output-summary">${msg.outputCard.summary}</div>
        <div class="ws-approval-actions">
          <button class="ws-btn-approve" onclick="showNotification('opening output spreadsheet...')" style="background-color:var(--ws-blue);">View output</button>
          <button class="ws-btn-secondary" onclick="showNotification('downloading spreadsheet...')">Download</button>
        </div>
      </div>
    `;
  }
  
  return cardHTML;
}

// Render threaded reply logs under feed messages
function renderCommentThread(msg) {
  if (!msg.comments || msg.comments.length === 0) return '';
  
  return `
    <div class="ws-comments-container">
      ${msg.comments.map(c => `
        <div class="ws-comment-thread">
          <div class="ws-comment-header">
            <div class="ws-comment-avatar" style="background-color:${c.avatarColor || '#534AB7'};">
              ${c.avatarInitials}
            </div>
            <span class="ws-comment-author">${c.author}</span>
            <span class="ws-comment-time">${c.time}</span>
          </div>
          <div class="ws-comment-body">
            ${c.body}
          </div>
          
          <div class="ws-comment-actions">
            ${c.reactions ? c.reactions.map(r => `
              <div class="ws-reaction-pill ${r.active ? 'active' : ''}" onclick="toggleCommentReaction('${msg.id}', '${c.id}')">
                <span>${r.emoji}</span>
                <span>${r.count}</span>
              </div>
            `).join('') : ''}
            <button class="ws-comment-reply-btn" onclick="showInlineReplyInput('${msg.id}')">reply</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Inline comment thread actions
function toggleCommentReaction(msgId, commentId) {
  const wst = state.workstreams.find(w => w.id === state.activeWorkstreamId);
  if (!wst) return;
  const msg = wst.messages.find(m => m.id === msgId);
  if (!msg) return;
  const comment = msg.comments.find(c => c.id === commentId);
  if (!comment) return;
  
  comment.reactions.forEach(r => {
    if (r.active) {
      r.count--;
      r.active = false;
    } else {
      r.count++;
      r.active = true;
    }
  });
  
  renderView();
}

function showInlineReplyInput(msgId) {
  const text = prompt("Enter your reply text:");
  if (text && text.trim()) {
    commentOnWorkstreamMessage(msgId, text.trim());
  }
}

function commentOnWorkstreamMessage(msgId, text) {
  const wst = state.workstreams.find(w => w.id === state.activeWorkstreamId);
  if (!wst) return;
  const msg = wst.messages.find(m => m.id === msgId);
  if (!msg) return;
  
  if (!msg.comments) msg.comments = [];
  
  msg.comments.push({
    id: 'cmt_' + Date.now(),
    author: 'Alex Rivers',
    avatarInitials: 'AR',
    avatarColor: '#854F0B',
    time: 'just now',
    body: text,
    reactions: []
  });
  
  renderView();
  showToast('Reply posted to message thread!');
}

function triggerForkDialog(msgId) {
  const wst = state.workstreams.find(w => w.id === state.activeWorkstreamId);
  if (!wst) return;
  const msg = wst.messages.find(m => m.id === msgId);
  if (!msg) return;
  
  // Reuse the existing global fork modal
  const authorEl = document.getElementById('fork-preview-author');
  const timeEl = document.getElementById('fork-preview-time');
  const contentEl = document.getElementById('fork-preview-content');
  
  if (authorEl) authorEl.textContent = msg.sender || 'system';
  if (timeEl) timeEl.textContent = msg.time;
  if (contentEl) contentEl.textContent = msg.content;
  
  state.activeForkMsgId = msgId;
  openModal('fork-modal');
}

function showReactionPicker(msgId) {
  const emoji = prompt("Enter a reaction emoji (e.g. 👍, ❤️, 🎉):", "👍");
  if (emoji && emoji.trim()) {
    const wst = state.workstreams.find(w => w.id === state.activeWorkstreamId);
    if (!wst) return;
    const msg = wst.messages.find(m => m.id === msgId);
    if (!msg) return;
    
    // Add reaction pill or comment reaction
    showToast(`Reaction added: ${emoji}`);
  }
}

// Scroll layout helper
function scrollToRailSection(sectionId) {
  const element = document.getElementById('rail-section-' + sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Dropdown Toggles and controls
function toggleWorkstreamPlusMenu(event) {
  event.stopPropagation();
  closeAllDropdowns();
  state.wsPlusMenuOpen = !state.wsPlusMenuOpen;
  renderView();
}

function addWorkstreamChip(label, type, icon) {
  const chip = {
    id: 'chip_' + Date.now(),
    label: label,
    type: type,
    icon: icon
  };
  state.activeChips.push(chip);
  state.wsPlusMenuOpen = false;
  renderView();
  
  // Auto focus input
  setTimeout(() => {
    const input = document.getElementById('workstream-composer-input');
    if (input) input.focus();
  }, 50);
}

function removeWorkstreamChip(chipId) {
  state.activeChips = state.activeChips.filter(c => c.id !== chipId);
  renderView();
}

function toggleWorkstreamPermissionDropdown(event) {
  event.stopPropagation();
  closeAllDropdowns();
  state.wsPermissionsDropdownOpen = !state.wsPermissionsDropdownOpen;
  renderView();
}

function selectWorkstreamPermissionOption(opt) {
  state.wsSelectedPermission = opt;
  state.wsPermissionsDropdownOpen = false;
  renderView();
  showToast(`Permissions updated to ${opt}`);
}

function addRedirectChip(wstId) {
  state.activeChips = state.activeChips.filter(c => c.label !== 'redirect');
  addWorkstreamChip('redirect', 'override', 'ti-refresh');
  showToast('Redirect override instruction activated!');
}

function handleWorkstreamComposerInput(event) {
  const input = event.currentTarget;
  const sendBtn = document.getElementById('ws-composer-send-btn');
  if (sendBtn) {
    if (input.innerText.trim().length > 0) {
      sendBtn.removeAttribute('disabled');
    } else {
      sendBtn.setAttribute('disabled', 'true');
    }
  }
}

function handleWorkstreamComposerKeydown(event, wstId) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendWorkstreamMessage(wstId);
  }
}

function sendWorkstreamMessage(wstId) {
  const input = document.getElementById('workstream-composer-input');
  if (!input || !input.innerText.trim()) return;
  const text = input.innerText.trim();
  input.innerText = '';
  
  const sendBtn = document.getElementById('ws-composer-send-btn');
  if (sendBtn) {
    sendBtn.setAttribute('disabled', 'true');
  }
  
  const wst = state.workstreams.find(w => w.id === wstId);
  if (!wst) return;
  
  // Add human message to feed
  wst.messages.push({
    id: 'msg_h_' + Date.now(),
    sender: 'Alex Rivers',
    senderType: 'human',
    role: 'owner',
    avatarColor: '#854F0B',
    time: 'just now',
    content: text
  });
  
  // Clear composer chips
  state.activeChips = [];
  renderView();
  
  // Simulate coworker response loop
  setTimeout(() => {
    wst.messages.push({
      id: 'msg_a_ack_' + Date.now(),
      sender: 'Finance reviewer',
      senderType: 'agent',
      time: 'just now',
      content: `Instruction received. Directing my execution modules to process your command: "${text}".`
    });
    renderView();
  }, 1000);
}

// INTERACTIVE LIFECYCLE SIMULATION CYCLE
function simulateWorkstreamRun(wstId) {
  const wst = state.workstreams.find(w => w.id === wstId);
  if (!wst) return;
  
  // Step 1: Manual Run triggered
  wst.status = 'running';
  wst.messages.push({
    id: 'sim_run_start_' + Date.now(),
    senderType: 'system',
    content: 'Manual run triggered by Alex Rivers · just now'
  });
  
  // Insert initial agent message with running steps
  const runMsgId = 'sim_run_agent_' + Date.now();
  wst.messages.push({
    id: runMsgId,
    sender: 'Finance reviewer',
    senderType: 'agent',
    time: 'just now',
    content: 'I have started the manual check execution. I will compile invoice files and launch ledger validation checks.',
    hasPlan: true,
    plan: {
      steps: [
        { id: 1, label: 'parse vendor invoice records from logs', status: 'active' },
        { id: 2, label: 'cross-check vendor IDs against authorization ledger', status: 'pending' },
        { id: 3, label: 'detect anomalous charge quantities & pricing exceptions', status: 'pending' },
        { id: 4, label: 'compile anomaly reports and post output', status: 'pending' }
      ]
    }
  });
  
  // Add running entry to recent runs rail section
  wst.runs.unshift({
    id: 'run_sim_' + Date.now(),
    name: 'Manual run',
    meta: 'Finance reviewer · just now',
    status: 'running'
  });
  
  showToast('Launching interactive manual check...');
  renderView();
  
  // Step 2: Transition step 1 -> done, step 2 -> active
  setTimeout(() => {
    const msg = wst.messages.find(m => m.id === runMsgId);
    if (msg && msg.plan) {
      msg.plan.steps[0].status = 'done';
      msg.plan.steps[1].status = 'active';
      renderView();
    }
  }, 1500);
  
  // Step 3: Hits policy block & approval wall
  setTimeout(() => {
    const msg = wst.messages.find(m => m.id === runMsgId);
    if (msg && msg.plan) {
      msg.plan.steps[1].status = 'done';
      msg.plan.steps[2].status = 'active';
    }
    
    // Pause run and insert approval request card
    wst.status = 'paused';
    wst.runs[0].status = 'waiting';
    
    wst.messages.push({
      id: 'sim_app_msg_' + Date.now(),
      sender: 'Finance reviewer',
      senderType: 'agent',
      time: 'just now',
      content: 'I have encountered a policy block while trying to fetch merchant records. Governing authorization is required.',
      hasApprovalCard: true,
      approvalCard: {
        id: 'sim_app_card_' + Date.now(),
        title: 'Access required / Approval needed',
        risk: 'medium',
        needed: 'read access credentials for internal merchant register database',
        alternative: 'covers 92% of the validation logs without access using last week\'s offline backups.',
        status: 'requested'
      }
    });
    
    showToast('Run paused: credential authorization required.');
    renderView();
  }, 3000);
}

// Grant access on inline approval request card
function resolveInlineApproval(msgId, decision) {
  const wst = state.workstreams.find(w => w.id === state.activeWorkstreamId);
  if (!wst) return;
  const msg = wst.messages.find(m => m.id === msgId);
  if (!msg || !msg.approvalCard) return;
  
  const card = msg.approvalCard;
  card.status = decision; // 'granted', 'alternative', 'rejected'
  card.resolvedBy = 'Alex Rivers';
  
  if (decision === 'granted' || decision === 'alternative') {
    wst.status = 'running';
    wst.runs[0].status = 'running';
    
    showToast(decision === 'granted' ? 'Access granted. Resuming run...' : 'Proceeding using alternative path...');
    renderView();
    
    // Resume run cycle
    setTimeout(() => {
      // Find the main running plan message and complete step 3, start step 4
      const planMsg = wst.messages.find(m => m.hasPlan && m.plan && m.plan.steps[2].status === 'active');
      if (planMsg && planMsg.plan) {
        planMsg.plan.steps[2].status = 'done';
        planMsg.plan.steps[3].status = 'active';
        renderView();
      }
      
      // Complete run and deliver output card
      setTimeout(() => {
        const planMsgComplete = wst.messages.find(m => m.hasPlan && m.plan && m.plan.steps[3].status === 'active');
        if (planMsgComplete && planMsgComplete.plan) {
          planMsgComplete.plan.steps[3].status = 'done';
        }
        
        wst.status = 'complete';
        wst.runs[0].status = 'done';
        
        // Update right rail stats
        wst.stats.runs++;
        
        // Deliver output card
        wst.messages.push({
          id: 'sim_out_msg_' + Date.now(),
          sender: 'Finance reviewer',
          senderType: 'agent',
          time: 'just now',
          content: 'Audit manual check completed successfully. All ledger tables parsed and fully verified.',
          hasOutputCard: true,
          outputCard: {
            title: 'Q1 Vendor anomalies report.pdf',
            summary: '847 entries reviewed · 0 anomalies · 2 vendors flagged'
          }
        });
        
        showToast('Manual run check completed successfully!');
        renderView();
      }, 1800);
      
    }, 1800);
  } else {
    // Rejected
    wst.status = 'paused';
    wst.runs[0].status = 'failed';
    showToast('Execution check declined.');
    renderView();
  }
}

// Add skill to rail section
function addWorkstreamSkill(wstId) {
  const wst = state.workstreams.find(w => w.id === wstId);
  if (!wst) return;
  
  const skill = prompt("Enter a skill name to attach to this workstream:", "Email Dispatcher");
  if (skill && skill.trim()) {
    wst.skills.push(skill.trim());
    renderView();
    showToast(`Skill "${skill}" attached successfully!`);
  }
}

function saveWorkstreamConfig(wstId) {
  const wst = state.workstreams.find(w => w.id === wstId);
  const nameVal = document.getElementById('cfg-wst-name').value;
  const agentVal = document.getElementById('cfg-wst-agent').value;
  const freqVal = document.getElementById('cfg-wst-freq').value;
  const statusVal = document.getElementById('cfg-wst-status').value;
  
  if (wst) {
    wst.name = nameVal.trim().toLowerCase();
    wst.agentId = agentVal;
    wst.frequency = freqVal;
    wst.status = statusVal;
    showToast('Workstream parameters updated!');
    renderSidebar();
    renderView();
  }
}


function renderReviewsScreen() {
  const activeWorkspace = state.workspaces.find(ws => ws.id === state.activeWorkspaceId) || state.workspaces[0];
  const workspaceReviews = state.reviews.filter(rev => rev.workspaceId === activeWorkspace.id);
  
  DOM.contentArea.innerHTML = `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 20px; text-align: left; height: 100%; overflow-y: auto;">
      
      <!-- HEADER -->
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:0.5px solid var(--color-border-secondary); padding-bottom:12px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <a href="#/home" class="btn btn-outline" style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; padding:0; border-radius:6px; border:0.5px solid var(--color-border-secondary); background:var(--color-bg-secondary); color:var(--color-text-primary); text-decoration:none; transition:background-color 0.15s;" onmouseover="this.style.backgroundColor='var(--color-bg-tertiary)'" onmouseout="this.style.backgroundColor='var(--color-bg-secondary)'">
            <i class="ti ti-arrow-left" style="font-size:14px;"></i>
          </a>
          <div>
            <h2 style="font-size:20px; font-weight:600; color:var(--color-text-primary); margin:0;">reviews & approvals</h2>
            <div style="font-size:12.5px; color:var(--color-text-secondary); margin-top:2px;">governed audit logs requiring human verification before code/financial commit.</div>
          </div>
        </div>
        <span class="badge badge-amber">${workspaceReviews.filter(r => r.status === 'pending').length} pending</span>
      </div>
      
      <!-- REVIEWS LIST -->
      <div style="display:flex; flex-direction:column; gap:12px; margin-top:10px;">
        ${workspaceReviews.length === 0 ? `
          <div style="text-align:center; padding:48px 24px; border:0.5px dashed var(--color-border-secondary); border-radius:12px; color:var(--color-text-secondary);">
            <i class="ti ti-circle-check" style="font-size:32px; color:var(--status-complete-text); margin-bottom:12px; display:block;"></i>
            <span>No pending reviews. Workspace is clean!</span>
          </div>
        ` : workspaceReviews.map(rev => {
          let riskColor = 'var(--status-complete-text)';
          if (rev.risk === 'high') riskColor = 'var(--status-failed-text)';
          if (rev.risk === 'medium') riskColor = 'var(--status-pending-text)';
          
          return `
            <div style="background:var(--color-bg-secondary); border:0.5px solid var(--color-border-secondary); border-left:3.5px solid ${riskColor}; border-radius:8px; padding:16px; display:flex; flex-direction:column; gap:12px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:14.5px; font-weight:600; color:var(--color-text-primary);">${rev.title}</span>
                    <span style="font-size:10px; font-weight:600; text-transform:uppercase; padding:2px 6px; border-radius:4px; background:var(--color-bg-tertiary); color:var(--color-text-secondary);">risk: ${rev.risk}</span>
                  </div>
                  <div style="font-size:11.5px; color:var(--color-text-tertiary); margin-top:4px;">requested by ${rev.requestedBy} · target: ${rev.target} · ${rev.time}</div>
                </div>
                
                <span class="badge ${rev.status === 'pending' ? 'badge-amber' : 'badge-green'}">${rev.status}</span>
              </div>
              
              <div style="background:var(--color-bg-primary); border:0.5px solid var(--color-border-tertiary); border-radius:6px; padding:12px; font-family:monospace; font-size:12px; color:var(--color-text-secondary); white-space:pre-wrap;">${rev.details}</div>
              
              ${rev.status === 'pending' ? `
                <div style="display:flex; gap:8px; justify-content:flex-end; border-top:0.5px solid var(--color-border-tertiary); padding-top:12px;">
                  <button class="btn btn-outline btn-sm" style="color:var(--status-failed-text);" onclick="rejectReview('${rev.id}')">Decline</button>
                  <button class="btn btn-outline btn-sm" onclick="delegateReview('${rev.id}')">Delegate</button>
                  <button class="btn btn-primary btn-sm" onclick="approveReview('${rev.id}')">Approve & Execute</button>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
      
    </div>
  `;
}

function approveReview(revId) {
  const rev = state.reviews.find(r => r.id === revId);
  if (rev) {
    rev.status = 'approved';
    showToast('Review approved successfully!');
    
    // Log to activity feed
    state.activityFeed.unshift({
      id: 'act_' + Date.now(),
      workspaceId: state.activeWorkspaceId,
      content: `approved commit: ${rev.title}`,
      time: 'just now'
    });
    
    // Decrement pending reviews in workstream
    const ws = state.workspaces.find(w => w.id === state.activeWorkspaceId);
    const wst = state.workstreams.find(w => w.workspaceId === ws.id);
    if (wst && wst.pendingReviews > 0) {
      wst.pendingReviews--;
    }
    
    renderSidebar();
    renderView();
  }
}

function rejectReview(revId) {
  const rev = state.reviews.find(r => r.id === revId);
  if (rev) {
    rev.status = 'declined';
    showToast('Commit declined.');
    renderView();
  }
}

function delegateReview(revId) {
  showToast('Review request delegated to admin node.');
}

function setMyDeskView(view) {
  state.myDeskView = view;
  window.location.hash = `#/mydesk/${view}`;
}

function renderMyDeskScreen() {
  state.myDeskView = state.myDeskView || 'chats';
  
  let deskContentHTML = '';
  
  if (state.myDeskView === 'chats') {
    deskContentHTML = `
      <div style="display:flex; flex-direction:column; gap:12px; text-align:left;">
        <div style="font-size:12.5px; color:var(--color-text-secondary); margin-bottom:8px;">private direct messages and operational discussions with your personal agents.</div>
        
        <div style="display:flex; flex-direction:column; border:0.5px solid var(--color-border-secondary); border-radius:8px; background:var(--color-bg-primary); overflow:hidden;">
          ${state.chats.map(ch => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:0.5px solid var(--color-border-secondary); cursor:pointer;" onclick="window.location.hash='#/chats/${ch.id}'" onmouseover="this.style.background='var(--color-bg-secondary)'" onmouseout="this.style.background='none'">
              <div style="display:flex; align-items:center; gap:10px;">
                <div class="agent-avatar" style="width:28px; height:28px; font-size:11px;">
                  ${ch.agent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span style="font-size:13.5px; font-weight:600; color:var(--color-text-primary);">${ch.title}</span><br>
                  <span style="font-size:11.5px; color:var(--color-text-secondary);">with ${ch.agent.name} · ${ch.elapsed}</span>
                </div>
              </div>
              <span class="badge ${ch.status === 'running' ? 'badge-amber' : 'badge-green'}" style="font-size:10px;">${ch.status}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (state.myDeskView === 'workstreams') {
    deskContentHTML = `
      <div style="display:flex; flex-direction:column; gap:12px; text-align:left;">
        <div style="font-size:12.5px; color:var(--color-text-secondary); margin-bottom:8px;">personal draft and testing workstreams not yet published to the enterprise.</div>
        
        <div class="workstream-pulse-grid">
          <div class="workstream-pulse-card" style="border:0.5px dashed var(--color-border-secondary); background:none; display:flex; align-items:center; justify-content:center; padding:24px; cursor:pointer;" onclick="showNotification('Creating draft workstream...')">
            <div style="text-align:center; color:var(--color-text-secondary);">
              <i class="ti ti-plus" style="font-size:24px; margin-bottom:6px; display:block;"></i>
              <span style="font-size:13px; font-weight:500;">create draft workstream</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (state.myDeskView === 'skills') {
    deskContentHTML = `
      <div style="display:flex; flex-direction:column; gap:12px; text-align:left;">
        <div style="font-size:12.5px; color:var(--color-text-secondary); margin-bottom:8px;">private draft capabilities and sandbox scripts.</div>
        
        <div class="quickstart-grid" style="grid-template-columns:repeat(2,1fr); gap:12px;">
          ${state.skills.map(sk => `
            <div class="quickstart-card" style="border:0.5px solid var(--color-border-secondary);" onclick="window.location.hash='#/customize/skills'">
              <div class="quickstart-icon user-color-teal">
                <i class="ti ti-file-description"></i>
              </div>
              <div class="quickstart-card-details">
                <div class="quickstart-card-title">${sk.name}</div>
                <div class="quickstart-card-desc">${sk.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (state.myDeskView === 'outputs') {
    deskContentHTML = `
      <div style="display:flex; flex-direction:column; gap:12px; text-align:left;">
        <div style="font-size:12.5px; color:var(--color-text-secondary); margin-bottom:8px;">files, spreadsheets, and summaries exported by your personal runs.</div>
        
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px;">
          <div style="background:var(--color-bg-secondary); border:0.5px solid var(--color-border-secondary); border-radius:8px; padding:12px; text-align:left; cursor:pointer;" onclick="showNotification('Downloading ledger...')">
            <i class="ti ti-file-spreadsheet" style="font-size:24px; color:var(--avatar-teal-text); margin-bottom:8px; display:block;"></i>
            <span style="font-size:13px; font-weight:600; color:var(--color-text-primary);">expense_reconciliation.xlsx</span><br>
            <span style="font-size:11px; color:var(--color-text-tertiary);">xlsx file · 2.4 mb · q1 results</span>
          </div>
          <div style="background:var(--color-bg-secondary); border:0.5px solid var(--color-border-secondary); border-radius:8px; padding:12px; text-align:left; cursor:pointer;" onclick="showNotification('Downloading pdf...')">
            <i class="ti ti-file-text" style="font-size:24px; color:var(--avatar-coral-text); margin-bottom:8px; display:block;"></i>
            <span style="font-size:13px; font-weight:600; color:var(--color-text-primary);">payroll_anomalies_report.pdf</span><br>
            <span style="font-size:11px; color:var(--color-text-tertiary);">pdf report · 450 kb · generated today</span>
          </div>
        </div>
      </div>
    `;
  }

  DOM.contentArea.innerHTML = `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 20px; text-align: left; height: 100%; overflow-y: auto;">
      
      <!-- HEADER -->
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:0.5px solid var(--color-border-secondary); padding-bottom:12px; flex-shrink:0;">
        <div>
          <h2 style="font-size:20px; font-weight:600; color:var(--color-text-primary); margin:0;">alex's private desk</h2>
          <div style="font-size:12.5px; color:var(--color-text-secondary); margin-top:2px;">your personal sandbox workspace. all chats, files, and drafts are fully private here.</div>
        </div>
      </div>
      
      <!-- TABS -->
      <div class="view-tabs-row" style="flex-shrink:0;">
        <button class="view-tab-btn ${state.myDeskView === 'chats' ? 'active' : ''}" onclick="setMyDeskView('chats')">private chats</button>
        <button class="view-tab-btn ${state.myDeskView === 'workstreams' ? 'active' : ''}" onclick="setMyDeskView('workstreams')">draft workstreams</button>
        <button class="view-tab-btn ${state.myDeskView === 'skills' ? 'active' : ''}" onclick="setMyDeskView('skills')">my draft skills</button>
        <button class="view-tab-btn ${state.myDeskView === 'outputs' ? 'active' : ''}" onclick="setMyDeskView('outputs')">sandbox outputs</button>
      </div>
      
      <!-- CONTENT -->
      <div style="flex:1; min-height:0;">
        ${deskContentHTML}
      </div>
      
    </div>
  `;
}

function renderWorkspaceSkillsScreen() {
  DOM.contentArea.innerHTML = `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 20px; text-align: left; height: 100%; overflow-y: auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:0.5px solid var(--color-border-secondary); padding-bottom:12px;">
        <div>
          <h2 style="font-size:20px; font-weight:600; color:var(--color-text-primary); margin:0;">workspace skills & integrations</h2>
          <div style="font-size:12.5px; color:var(--color-text-secondary); margin-top:2px;">reusable tools and secure APIs connected to this workspace.</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.location.hash='#/create-skill'">
          <i class="ti ti-plus"></i>
          <span>create new skill</span>
        </button>
      </div>
      
      <div class="quickstart-grid" style="grid-template-columns:repeat(2, 1fr); gap:12px; margin-top:10px;">
        ${state.skills.map(sk => `
          <div class="quickstart-card" style="border:0.5px solid var(--color-border-secondary);" onclick="window.location.hash='#/customize/skills'">
            <div class="quickstart-icon user-color-teal">
              <i class="ti ti-file-description"></i>
            </div>
            <div class="quickstart-card-details">
              <div class="quickstart-card-title">${sk.name}</div>
              <div class="quickstart-card-desc">${sk.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderWorkspaceOutputsScreen() {
  DOM.contentArea.innerHTML = `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 20px; text-align: left; height: 100%; overflow-y: auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:0.5px solid var(--color-border-secondary); padding-bottom:12px;">
        <div>
          <h2 style="font-size:20px; font-weight:600; color:var(--color-text-primary); margin:0;">workspace outputs directory</h2>
          <div style="font-size:12.5px; color:var(--color-text-secondary); margin-top:2px;">audited ledgers, csv sheets, and pdf reports approved by humans.</div>
        </div>
      </div>
      
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-top:10px;">
        <div style="background:var(--color-bg-secondary); border:0.5px solid var(--color-border-secondary); border-radius:8px; padding:12px; text-align:left; cursor:pointer;" onclick="showToast('Downloading verified expense sheet...')">
          <i class="ti ti-file-spreadsheet" style="font-size:24px; color:var(--avatar-teal-text); margin-bottom:8px; display:block;"></i>
          <span style="font-size:13px; font-weight:600; color:var(--color-text-primary);">q1_expense_anomalies_audited.xlsx</span><br>
          <span style="font-size:11px; color:var(--color-text-tertiary);">xlsx ledger · 12.8 mb · updated yesterday</span>
        </div>
        <div style="background:var(--color-bg-secondary); border:0.5px solid var(--color-border-secondary); border-radius:8px; padding:12px; text-align:left; cursor:pointer;" onclick="showToast('Downloading onboarding registry...')">
          <i class="ti ti-file-text" style="font-size:24px; color:var(--avatar-purple-text); margin-bottom:8px; display:block;"></i>
          <span style="font-size:13px; font-weight:600; color:var(--color-text-primary);">onboarding_contract_reconciled.pdf</span><br>
          <span style="font-size:11px; color:var(--color-text-tertiary);">pdf registry · 1.2 mb · updated 3 days ago</span>
        </div>
      </div>
    </div>
  `;
}

function renderWorkspaceKnowledgeScreen() {
  const activeWorkspace = state.workspaces.find(ws => ws.id === state.activeWorkspaceId) || state.workspaces[0];
  const query = (state.knowledgeBaseSearchQuery || '').toLowerCase().trim();
  
  // 1. Initial filter by workspace
  let filteredFiles = state.knowledgeBase.filter(file => file.workspaceId === activeWorkspace.id);

  // 2. Scope Filter (All, Your, Created By Others)
  if (state.kbFilterScope === 'mine') {
    filteredFiles = filteredFiles.filter(file => file.owner === 'me');
  } else if (state.kbFilterScope === 'others') {
    filteredFiles = filteredFiles.filter(file => file.owner === 'others');
  }

  // 3. Search Query Match
  if (query) {
    filteredFiles = filteredFiles.filter(file => {
      return file.name.toLowerCase().includes(query) || file.ext.toLowerCase().includes(query);
    });
  }

  // 4. File Type Filter
  if (state.kbSelectedTypes && state.kbSelectedTypes.length > 0) {
    filteredFiles = filteredFiles.filter(file => state.kbSelectedTypes.includes(file.ext.toLowerCase()));
  }

  // 5. Date Added Filter (Simulated date subset exclude)
  if (state.kbFilterDateFrom || state.kbFilterDateTo) {
    filteredFiles = filteredFiles.filter(file => !file.syncing);
  }

  // 6. Dynamic Sorting
  filteredFiles.sort((a, b) => {
    let valA = a.name.toLowerCase();
    let valB = b.name.toLowerCase();

    if (state.kbSortField === 'size') {
      valA = parseFloat(a.size) || 0;
      valB = parseFloat(b.size) || 0;
    } else if (state.kbSortField === 'created_time') {
      valA = Date.parse(a.date) || 0;
      valB = Date.parse(b.date) || 0;
    }

    if (valA < valB) return state.kbSortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return state.kbSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getScopeLabel = (scope) => {
    if (scope === 'mine') return 'Your Knowledge Base';
    if (scope === 'others') return 'Created By Others';
    return 'All Knowledge Base';
  };

  const getSortFieldLabel = (field) => {
    if (field === 'name') return 'File Name';
    if (field === 'size') return 'Document Size';
    return 'Created Time';
  };

  DOM.contentArea.innerHTML = `
    <div class="kb-layout-container" style="position:relative;">
      
      <!-- TOP HEADER (Title + Actions) -->
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:0.5px solid var(--color-border-secondary); padding-bottom:12px;">
        <div>
          <h2 style="font-size:20px; font-weight:600; color:var(--color-text-primary); margin:0;">Knowledge Base</h2>
          <div style="font-size:12.5px; color:var(--color-text-secondary); margin-top:2px;">operational guidelines, reference documentation, and context used by softworkers in ${activeWorkspace.name}.</div>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <button class="btn btn-outline btn-sm" onclick="openRagApiModal()">
            <i class="ti ti-api"></i>
            <span>Rag API</span>
          </button>
          <button class="btn btn-primary btn-sm" onclick="openKBNewUploadModal()">
            <i class="ti ti-plus"></i>
            <span>New Upload</span>
          </button>
        </div>
      </div>

      <!-- SEARCH & FILTERS -->
      <div class="kb-search-container" style="margin-top:14px; position:relative;">
        <div class="kb-search-left">
          <div class="kb-search-box-wrapper">
            <i class="ti ti-search"></i>
            <input type="text" id="kb-search-input" class="kb-search-input" placeholder="Search files..." value="${state.knowledgeBaseSearchQuery}" oninput="handleKBSearch(event)">
          </div>
          
          <div style="position:relative;">
            <button class="btn btn-outline btn-sm ${state.kbSortOpen ? 'active' : ''}" style="display:flex; align-items:center; gap:6px;" onclick="toggleKBSortToolbar(event)">
              <i class="ti ti-arrows-sort" style="font-size:14px;"></i>
              <span>Sort</span>
            </button>

            <!-- Sort Inline Toolbar Drawer (Mockup style matching the third image!) -->
            ${state.kbSortOpen ? `
              <div class="kb-sort-toolbar-bar" style="animation: fadeIn 0.15s ease-out forwards; display:inline-flex; align-items:center; gap:12px; background:var(--color-bg-primary); border:1.2px solid var(--color-border-secondary); border-radius:12px; padding:12px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); z-index: 1000; position:absolute; left:0; top:calc(100% + 6px); width: max-content;" onclick="event.stopPropagation()">
                <div style="position:relative; display:flex; align-items:center; z-index:1110;">
                  <button class="kb-select-styled" style="background:var(--color-bg-primary); border:1px solid var(--color-border-secondary); border-radius:8px; padding:8px 16px; font-size:13px; font-weight:500; min-width:180px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; color:var(--color-text-primary);" onclick="toggleKBSortFieldDropdown(event)">
                    <span>${getSortFieldLabel(state.kbSortField)}</span>
                    <i class="ti ti-chevron-down" style="font-size:11px; color:var(--color-text-secondary);"></i>
                  </button>
                  
                  ${state.kbSortFieldDropdownOpen ? `
                    <div class="kb-scope-dropdown-menu" style="top:100%; left:0; width:100%; margin-top:4px; box-shadow:0 4px 16px rgba(0,0,0,0.08);">
                      <button class="kb-scope-dropdown-item ${state.kbSortField === 'name' ? 'active' : ''}" onclick="setKBSortField(event, 'name')">File Name</button>
                      <button class="kb-scope-dropdown-item ${state.kbSortField === 'created_time' ? 'active' : ''}" onclick="setKBSortField(event, 'created_time')">Created Time</button>
                      <button class="kb-scope-dropdown-item ${state.kbSortField === 'size' ? 'active' : ''}" onclick="setKBSortField(event, 'size')">Document Size</button>
                    </div>
                  ` : ''}
                </div>
                
                <div style="position:relative; display:flex; align-items:center; z-index:1110;">
                  <button class="kb-select-styled" style="background:var(--color-bg-primary); border:1px solid var(--color-border-secondary); border-radius:8px; padding:8px 16px; font-size:13px; font-weight:500; min-width:150px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; color:var(--color-text-primary);" onclick="toggleKBSortDirDropdown(event)">
                    <div style="display:flex; align-items:center; gap:6px;">
                      <i class="ti ti-arrows-sort" style="font-size:13px; color:var(--color-text-secondary);"></i>
                      <span>${state.kbSortDirection === 'asc' ? 'Ascending' : 'Descending'}</span>
                    </div>
                    <i class="ti ti-chevron-down" style="font-size:11px; color:var(--color-text-secondary);"></i>
                  </button>
                  
                  ${state.kbSortDirDropdownOpen ? `
                    <div class="kb-scope-dropdown-menu" style="top:100%; left:0; width:100%; margin-top:4px; box-shadow:0 4px 16px rgba(0,0,0,0.08);">
                      <button class="kb-scope-dropdown-item ${state.kbSortDirection === 'asc' ? 'active' : ''}" onclick="setKBSortDirection(event, 'asc')">Ascending</button>
                      <button class="kb-scope-dropdown-item ${state.kbSortDirection === 'desc' ? 'active' : ''}" onclick="setKBSortDirection(event, 'desc')">Descending</button>
                    </div>
                  ` : ''}
                </div>

                <button style="background:transparent; border:none; color:var(--color-text-secondary); cursor:pointer; font-size:15px; display:flex; align-items:center; padding:4px; transition:color 0.15s; margin-left:4px;" onclick="closeKBSortToolbar(event)" onmouseover="this.style.color='var(--color-text-primary)'" onmouseout="this.style.color='var(--color-text-secondary)'">
                  <i class="ti ti-x"></i>
                </button>
              </div>
            ` : ''}
          </div>

          <div style="position:relative;">
            <button class="btn btn-outline btn-sm ${state.kbFilterOpen ? 'active' : ''}" style="display:flex; align-items:center; gap:6px;" onclick="toggleKBFilterPopover(event)">
              <i class="ti ti-filter" style="font-size:14px;"></i>
              <span>Filter</span>
            </button>
            
            <!-- Filter popover floating drawer -->
            ${state.kbFilterOpen ? `
              <div class="kb-filter-popover" style="left:0; right:auto; top:calc(100% + 6px);" onclick="event.stopPropagation()">
                <div class="kb-form-group">
                  <label>File Type</label>
                  <div class="kb-multi-select-box" onclick="toggleKBTypeDropdown(event)">
                    <div style="display:flex; flex-wrap:wrap; gap:4px; flex:1;">
                      ${state.kbSelectedTypes.length === 0 ? '<span style="color:var(--color-text-tertiary);">Select types</span>' : 
                        state.kbSelectedTypes.map(t => `<span class="kb-type-pill" onclick="removeKBType(event, '${t}')">${t.toUpperCase()} <i class="ti ti-x"></i></span>`).join('')
                      }
                    </div>
                    <i class="ti ti-chevron-down" style="font-size:11px; transform: ${state.kbTypeDropdownOpen ? 'rotate(180deg)' : 'rotate(0)'};"></i>
                  </div>
                  
                  ${state.kbTypeDropdownOpen ? `
                    <div class="kb-scope-dropdown-menu" style="top:100%; left:0; width:100%; max-height:160px; overflow-y:auto; border-radius:8px;">
                      ${['pdf', 'txt', 'md', 'xlsx', 'csv', 'json'].map(type => `
                        <button class="kb-scope-dropdown-item ${state.kbSelectedTypes.includes(type) ? 'active' : ''}" onclick="toggleKBTypeFilter(event, '${type}')">
                          <span>${type.toUpperCase()}</span>
                          ${state.kbSelectedTypes.includes(type) ? '<i class="ti ti-check" style="font-size:12px;"></i>' : ''}
                        </button>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>

                <div class="kb-form-group" style="position:relative;">
                  <label>Created On</label>
                  <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                    <input type="text" id="kb-filter-date-from" class="kb-form-input" style="padding:6px 10px; font-size:12.5px;" placeholder="From" value="${state.kbFilterDateFrom || ''}" onclick="toggleCalendarDropdown('from', event)">
                    <input type="text" id="kb-filter-date-to" class="kb-form-input" style="padding:6px 10px; font-size:12.5px;" placeholder="To" value="${state.kbFilterDateTo || ''}" onclick="toggleCalendarDropdown('to', event)">
                  </div>
                  
                  <!-- Mock calendar popup selector -->
                  ${state.kbCalendarOpen ? `
                    <div class="kb-calendar-popover" onclick="event.stopPropagation()">
                      <div class="kb-calendar-header">
                        <span>May 2026</span>
                        <div style="display:flex; gap:6px;">
                          <i class="ti ti-chevron-left" onclick="showToast('Previous month')"></i>
                          <i class="ti ti-chevron-right" onclick="showToast('Next month')"></i>
                        </div>
                      </div>
                      <div class="kb-calendar-days">
                        <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                        ${Array.from({length: 31}, (_, i) => {
                          const day = i + 1;
                          const isToday = day === 19;
                          return `<span class="kb-day-cell ${isToday ? 'today' : ''}" onclick="selectCalendarDay(event, ${day})">${day}</span>`;
                        }).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>

                <div style="display:flex; justify-content:flex-end; gap:8px; border-top:0.5px solid var(--color-border-secondary); padding-top:12px; margin-top:4px;">
                  <button class="btn btn-outline btn-sm" onclick="closeKBFilterPopover(event)">Close</button>
                  <button class="btn btn-primary btn-sm" onclick="applyKBFilters(event)">Apply</button>
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="kb-search-right" style="display:flex; align-items:center; gap:12px;">
          <div class="kb-view-toggle">
            <button class="kb-toggle-btn ${state.knowledgeBaseView === 'grid' ? 'active' : ''}" onclick="setKBView('grid')" title="Grid View">
              <i class="ti ti-layout-grid"></i>
            </button>
            <button class="kb-toggle-btn ${state.knowledgeBaseView === 'list' ? 'active' : ''}" onclick="setKBView('list')" title="List View">
              <i class="ti ti-list"></i>
            </button>
          </div>
        </div>
      </div>



      <!-- MAIN FILE SECTION -->
      <div id="kb-files-container" style="margin-top:14px;">
        ${renderKBFilesHTML(filteredFiles)}
      </div>

    </div>
  `;
}

/* HELPER: Render Knowledge Base Files HTML (Grid vs List) */
function renderKBFilesHTML(files) {
  if (files.length === 0) {
    return `
      <div style="text-align:center; padding:64px 24px; border:0.5px dashed var(--color-border-secondary); border-radius:12px; color:var(--color-text-secondary); width:100%;">
        <i class="ti ti-file-unknown" style="font-size:36px; color:var(--color-text-tertiary); margin-bottom:12px; display:block;"></i>
        <span>No matching documents found in this workspace.</span>
      </div>
    `;
  }

  // Extensions icon selector helper
  const getExtDetails = (ext) => {
    let icon = 'ti-file';
    let colorClass = 'kb-icon-slate';
    
    switch (ext) {
      case 'xlsx':
      case 'csv':
        icon = 'ti-file-spreadsheet';
        colorClass = 'kb-icon-green';
        break;
      case 'json':
        icon = 'ti-file-code';
        colorClass = 'kb-icon-blue';
        break;
      case 'html':
        icon = 'ti-brand-html5';
        colorClass = 'kb-icon-slate';
        break;
      case 'pdf':
        icon = 'ti-file-text';
        colorClass = 'kb-icon-red';
        break;
      case 'docx':
        icon = 'ti-file-description';
        colorClass = 'kb-icon-blue';
        break;
      case 'pptx':
        icon = 'ti-presentation';
        colorClass = 'kb-icon-orange';
        break;
      case 'txt':
        icon = 'ti-file';
        colorClass = 'kb-icon-slate';
        break;
      case 'mp3':
        icon = 'ti-music';
        colorClass = 'kb-icon-pink';
        break;
      case 'mp4':
        icon = 'ti-video';
        colorClass = 'kb-icon-pink';
        break;
      case 'web':
        icon = 'ti-world';
        colorClass = 'kb-icon-blue';
        break;
    }
    return { icon, colorClass };
  };

  if (state.knowledgeBaseView === 'grid') {
    return `
      <div class="kb-grid">
        ${files.map(file => {
          const { icon, colorClass } = getExtDetails(file.ext);
          const isDropdownOpen = openKBDropdownId === file.id;
          return `
            <div class="kb-card" onclick="showToast('Loading context for ${file.name}...')">
              <!-- Hover-only action trigger -->
              <div class="kb-card-actions-wrapper ${isDropdownOpen ? 'open' : ''}" onclick="event.stopPropagation()">
                <button class="kb-card-actions-btn" onclick="toggleKBDropdown(event, '${file.id}')">
                  <i class="ti ti-dots-vertical" style="font-size:15px;"></i>
                </button>
                ${isDropdownOpen ? `
                  <div class="kb-card-dropdown" onclick="event.stopPropagation()">
                    <button class="kb-dropdown-item" onclick="downloadKBDocument(event, '${file.name}')">
                      <i class="ti ti-download" style="font-size:12px;"></i>
                      <span>Download</span>
                    </button>
                    <button class="kb-dropdown-item danger" onclick="deleteKBDocument(event, '${file.id}')">
                      <i class="ti ti-trash" style="font-size:12px;"></i>
                      <span>Delete</span>
                    </button>
                  </div>
                ` : ''}
              </div>

              <!-- Row 1: Ext type solid block & name -->
              <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px;">
                <div class="kb-file-block-icon ${file.ext}">
                  <span>${file.ext}</span>
                </div>
                <span class="kb-card-title" style="font-weight: 500; font-size:14.5px; color:var(--color-text-primary);" title="${file.name}">
                  ${file.name.includes('.') ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name}
                </span>
                ${file.syncing ? `<span class="kb-syncing-badge" style="margin-left:4px;">Syncing</span>` : ''}
              </div>

              <!-- Row 2: Outline Doc Icon + Size | Robot Icon + Agent Usage Count -->
              <div class="kb-card-meta-row-new">
                <i class="ti ti-file-text" style="font-size:15px; color:var(--color-text-tertiary);"></i>
                <span style="font-weight: 500;">${file.size}</span>
                <span class="kb-card-meta-divider">|</span>
                <i class="ti ti-robot" style="font-size:15px; color:var(--color-text-tertiary);"></i>
                <span style="font-weight: 500;">${file.agentUsage || 0}</span>
              </div>

              <!-- Row 3: User outline Icon + Date Added -->
              <div style="display:flex; align-items:center; gap:8px; font-size:13px; color:var(--color-text-secondary);">
                <i class="ti ti-user" style="font-size:15px; color:var(--color-text-tertiary);"></i>
                <span>${file.date}</span>
              </div>

              <!-- Hover sparkles AI summary button -->
              <button class="kb-ai-summary-btn" onclick="openAISummary(event, '${file.id}')" title="AI Summary">
                <i class="ti ti-sparkles"></i>
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else {
    // List View Table
    return `
      <table class="kb-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Size</th>
            <th>Agent Usage</th>
            <th>Sync State</th>
            <th>Date Added</th>
            <th style="width:70px; text-align:center;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${files.map(file => {
            const { icon, colorClass } = getExtDetails(file.ext);
            const isDropdownOpen = openKBDropdownId === file.id;
            return `
              <tr onclick="showToast('Loading context for ${file.name}...')">
                <td style="display:flex; align-items:center; gap:10px; font-weight:500; color:var(--color-text-primary); position:relative;">
                  <div class="kb-file-block-icon ${file.ext}" style="width:28px; height:28px; font-size:10px;">
                    <span>${file.ext}</span>
                  </div>
                  <span>${file.name}</span>
                  <button class="kb-ai-summary-btn-list" onclick="openAISummary(event, '${file.id}')" title="AI Summary" style="background:transparent; border:none; color:#2563eb; cursor:pointer; margin-left:8px; display:inline-flex; align-items:center; padding:4px; border-radius:4px; transition:background 0.15s;">
                    <i class="ti ti-sparkles" style="font-size:12px;"></i>
                  </button>
                </td>
                <td style="color:var(--color-text-secondary); font-family:monospace; text-transform:uppercase;">${file.ext}</td>
                <td style="color:var(--color-text-secondary);">${file.size}</td>
                <td style="color:var(--color-text-secondary);">
                  <div style="display:flex; align-items:center; gap:6px;">
                    <i class="ti ti-robot" style="font-size:14px; color:var(--color-text-tertiary);"></i>
                    <span>${file.agentUsage || 0} runs</span>
                  </div>
                </td>
                <td>
                  ${file.syncing ? 
                    `<span class="kb-syncing-badge">Syncing</span>` : 
                    `<span style="color:var(--status-complete-text); font-size:11.5px; font-weight:600; display:flex; align-items:center; gap:4px;"><i class="ti ti-circle-check"></i> Synced</span>`
                  }
                </td>
                <td style="color:var(--color-text-tertiary);">${file.date}</td>
                <td style="position:relative; text-align:center;" onclick="event.stopPropagation()">
                  <div class="kb-card-actions-wrapper ${isDropdownOpen ? 'open' : ''}" style="position:relative; top:auto; right:auto; display:inline-block;">
                    <button class="kb-card-actions-btn" onclick="toggleKBDropdown(event, '${file.id}')">
                      <i class="ti ti-dots-vertical" style="font-size:15px;"></i>
                    </button>
                    ${isDropdownOpen ? `
                      <div class="kb-card-dropdown" style="top:auto; bottom:100%; right:0; margin-bottom:4px; z-index:1000;">
                        <button class="kb-dropdown-item" onclick="downloadKBDocument(event, '${file.name}')">
                          <i class="ti ti-download" style="font-size:12px;"></i>
                          <span>Download</span>
                        </button>
                        <button class="kb-dropdown-item danger" onclick="deleteKBDocument(event, '${file.id}')">
                          <i class="ti ti-trash" style="font-size:12px;"></i>
                          <span>Delete</span>
                        </button>
                      </div>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }
}

/* INTERACTION HANDLER: Search */
function handleKBSearch(event) {
  state.knowledgeBaseSearchQuery = event.target.value;
  const activeWorkspace = state.workspaces.find(ws => ws.id === state.activeWorkspaceId) || state.workspaces[0];
  const query = state.knowledgeBaseSearchQuery.toLowerCase().trim();
  
  const filteredFiles = state.knowledgeBase.filter(file => {
    const matchWorkspace = file.workspaceId === activeWorkspace.id;
    const matchQuery = file.name.toLowerCase().includes(query) || file.ext.toLowerCase().includes(query);
    return matchWorkspace && matchQuery;
  });

  const filesContainer = document.getElementById('kb-files-container');
  if (filesContainer) {
    filesContainer.innerHTML = renderKBFilesHTML(filteredFiles);
  }
}

/* INTERACTION HANDLER: Set Grid vs List View */
function setKBView(view) {
  state.knowledgeBaseView = view;
  renderWorkspaceKnowledgeScreen();
}

/* INTERACTION HANDLER: Dynamic File Upload */
function uploadKBFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const activeWorkspace = state.workspaces.find(ws => ws.id === state.activeWorkspaceId) || state.workspaces[0];
  const ext = file.name.split('.').pop().toLowerCase() || 'txt';
  const sizeKB = Math.round(file.size / 1024);
  const sizeStr = sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB';
  const randomChunks = Math.floor(Math.random() * 80) + 5;

  const newDoc = {
    id: 'kb_' + Date.now(),
    workspaceId: activeWorkspace.id,
    name: file.name,
    ext: ext,
    size: sizeStr,
    chunks: randomChunks,
    date: 'July 20, 2026',
    syncing: true // Pulse "Syncing" state initially!
  };

  state.knowledgeBase.push(newDoc);
  showToast(`Uploading and embedding ${file.name}...`);

  // Rerender screen to show the syncing upload immediately
  renderWorkspaceKnowledgeScreen();

  // Simulate embedding vector indexing completing after 3.5 seconds
  setTimeout(() => {
    const doc = state.knowledgeBase.find(d => d.id === newDoc.id);
    if (doc) {
      doc.syncing = false;
      showToast(`Context index complete! ${file.name} is ready.`);
      
      // If still on the knowledge page, rerender to remove the pulse badge
      if (state.activeView === 'workspace_knowledge') {
        renderWorkspaceKnowledgeScreen();
      }
    }
  }, 3500);
}

/* INTERACTION HANDLER: RAG API Modal Developers Panel */
function openRagApiModal() {
  const activeWorkspace = state.workspaces.find(ws => ws.id === state.activeWorkspaceId) || state.workspaces[0];
  
  const modalHTML = `
    <div class="kb-modal-overlay" id="kb-rag-modal-overlay" onclick="closeRagApiModal(event)">
      <div class="kb-modal-card" onclick="event.stopPropagation()">
        <div class="kb-modal-header">
          <div class="kb-modal-title">
            <i class="ti ti-api" style="font-size:20px; color:var(--color-accent-400);"></i>
            <span>Knowledge RAG API Integration</span>
          </div>
          <button class="kb-modal-close" onclick="closeRagApiModal(event)">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="kb-modal-content">
          <div style="font-size:13px; color:var(--color-text-secondary); line-height:1.4;">
            Integrate the RAG retrieval endpoint into your external apps or autonomous agents to query knowledge in <strong>${activeWorkspace.name}</strong>.
          </div>
          
          <div style="margin-top:6px;">
            <label style="font-size:10.5px; font-weight:600; color:var(--color-text-secondary); text-transform:uppercase; display:block; margin-bottom:6px;">RAG endpoint URL</label>
            <div style="background:var(--color-bg-secondary); border:0.5px solid var(--color-border-secondary); border-radius:6px; padding:10px; font-family:monospace; font-size:12px; color:var(--color-text-primary); display:flex; justify-content:space-between; align-items:center;">
              <span>https://api.softworker.ai/v1/rag/query</span>
              <i class="ti ti-copy" style="cursor:pointer;" onclick="showToast('Endpoint URL copied!')" title="Copy endpoint"></i>
            </div>
          </div>

          <div style="margin-top:6px;">
            <label style="font-size:10.5px; font-weight:600; color:var(--color-text-secondary); text-transform:uppercase; display:block; margin-bottom:6px;">Authorization curl example</label>
            <div class="kb-code-box">curl -X POST https://api.softworker.ai/v1/rag/query \\
  -H "Authorization: Bearer sw_live_k8a39a2f7c9e..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "workspace_id": "${activeWorkspace.id}",
    "query": "What is our contractor expense cap?",
    "top_k": 3
  }'</div>
          </div>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; border-top:0.5px solid var(--color-border-secondary); padding-top:14px;">
          <button class="btn btn-outline btn-sm" onclick="showToast('RAG credentials regenerated!')">Regenerate Key</button>
          <button class="btn btn-primary btn-sm" onclick="closeRagApiModal(event)">Done</button>
        </div>
      </div>
    </div>
  `;

  // Append modal directly to body
  const modalDiv = document.createElement('div');
  modalDiv.id = 'kb-rag-modal-wrapper';
  modalDiv.innerHTML = modalHTML;
  document.body.appendChild(modalDiv);
}

function closeRagApiModal(event) {
  const modal = document.getElementById('kb-rag-modal-wrapper');
  if (modal) {
    modal.remove();
  }
}

/* KNOWLEDGE BASE DYNAMIC UPLOAD MODAL & FILTERS */
let openKBDropdownId = null;
let kbSelectedFiles = []; // Store chosen files

// Close any open three-dots menu when clicking anywhere on document body
document.addEventListener('click', (event) => {
  // Auto-dismiss AI summary popovers
  const summaryPopover = document.getElementById('kb-summary-popover');
  if (summaryPopover && !event.target.closest('#kb-summary-popover') && !event.target.closest('.kb-ai-summary-btn') && !event.target.closest('.kb-ai-summary-btn-list')) {
    summaryPopover.remove();
  }

  let changed = false;
  if (openKBDropdownId && !event.target.closest('.kb-card-actions-wrapper') && !event.target.closest('.kb-card-dropdown')) {
    openKBDropdownId = null;
    changed = true;
  }
  if (state.kbScopeDropdownOpen && !event.target.closest('.kb-scope-selector-btn') && !event.target.closest('.kb-scope-dropdown-menu')) {
    state.kbScopeDropdownOpen = false;
    changed = true;
  }
  if (state.kbSortFieldDropdownOpen && !event.target.closest('.kb-select-styled') && !event.target.closest('.kb-scope-dropdown-menu')) {
    state.kbSortFieldDropdownOpen = false;
    changed = true;
  }
  if (state.kbSortDirDropdownOpen && !event.target.closest('.kb-select-styled') && !event.target.closest('.kb-scope-dropdown-menu')) {
    state.kbSortDirDropdownOpen = false;
    changed = true;
  }
  if (state.kbTypeDropdownOpen && !event.target.closest('.kb-multi-select-box') && !event.target.closest('.kb-scope-dropdown-menu')) {
    state.kbTypeDropdownOpen = false;
    changed = true;
  }
  if (state.kbCalendarOpen && !event.target.closest('.kb-form-input') && !event.target.closest('.kb-calendar-popover')) {
    state.kbCalendarOpen = false;
    changed = true;
  }

  if (changed && state.activeView === 'workspace_knowledge') {
    renderWorkspaceKnowledgeScreen();
  }
});

// Dropdown/Popover selectors toggles
function toggleKBScopeDropdown(event) {
  event.stopPropagation();
  state.kbScopeDropdownOpen = !state.kbScopeDropdownOpen;
  state.kbSortFieldDropdownOpen = false;
  state.kbSortDirDropdownOpen = false;
  state.kbTypeDropdownOpen = false;
  state.kbCalendarOpen = false;
  renderWorkspaceKnowledgeScreen();
}

function setKBScopeFilter(event, scope) {
  event.stopPropagation();
  state.kbFilterScope = scope;
  state.kbScopeDropdownOpen = false;
  renderWorkspaceKnowledgeScreen();
  showToast(`Scope set to: ${scope === 'mine' ? 'Your Knowledge Base' : scope === 'others' ? 'Created By Others' : 'All Knowledge Base'}`);
}

function toggleKBSortToolbar(event) {
  event.stopPropagation();
  state.kbSortOpen = !state.kbSortOpen;
  state.kbScopeDropdownOpen = false;
  state.kbFilterOpen = false;
  renderWorkspaceKnowledgeScreen();
}

function toggleKBSortFieldDropdown(event) {
  event.stopPropagation();
  state.kbSortFieldDropdownOpen = !state.kbSortFieldDropdownOpen;
  state.kbSortDirDropdownOpen = false;
  renderWorkspaceKnowledgeScreen();
}

function setKBSortField(event, field) {
  event.stopPropagation();
  state.kbSortField = field;
  state.kbSortFieldDropdownOpen = false;
  renderWorkspaceKnowledgeScreen();
}

function toggleKBSortDirDropdown(event) {
  event.stopPropagation();
  state.kbSortDirDropdownOpen = !state.kbSortDirDropdownOpen;
  state.kbSortFieldDropdownOpen = false;
  renderWorkspaceKnowledgeScreen();
}

function setKBSortDirection(event, direction) {
  event.stopPropagation();
  state.kbSortDirection = direction;
  state.kbSortDirDropdownOpen = false;
  renderWorkspaceKnowledgeScreen();
}

function closeKBSortToolbar(event) {
  event.stopPropagation();
  state.kbSortOpen = false;
  state.kbSortFieldDropdownOpen = false;
  state.kbSortDirDropdownOpen = false;
  renderWorkspaceKnowledgeScreen();
}

function toggleKBFilterPopover(event) {
  event.stopPropagation();
  state.kbFilterOpen = !state.kbFilterOpen;
  state.kbSortOpen = false;
  state.kbScopeDropdownOpen = false;
  renderWorkspaceKnowledgeScreen();
}

function toggleKBTypeDropdown(event) {
  event.stopPropagation();
  state.kbTypeDropdownOpen = !state.kbTypeDropdownOpen;
  state.kbCalendarOpen = false;
  renderWorkspaceKnowledgeScreen();
}

function toggleKBTypeFilter(event, type) {
  event.stopPropagation();
  const index = state.kbSelectedTypes.indexOf(type);
  if (index > -1) {
    state.kbSelectedTypes.splice(index, 1);
  } else {
    state.kbSelectedTypes.push(type);
  }
  renderWorkspaceKnowledgeScreen();
}

function removeKBType(event, type) {
  event.stopPropagation();
  state.kbSelectedTypes = state.kbSelectedTypes.filter(t => t !== type);
  renderWorkspaceKnowledgeScreen();
}

function toggleCalendarDropdown(target, event) {
  event.stopPropagation();
  state.kbCalendarOpen = !state.kbCalendarOpen;
  state.kbCalendarTarget = target;
  state.kbTypeDropdownOpen = false;
  renderWorkspaceKnowledgeScreen();
}

function selectCalendarDay(event, day) {
  event.stopPropagation();
  const formattedDate = `05/${day.toString().padStart(2, '0')}/2026`;
  if (state.kbCalendarTarget === 'from') {
    state.kbFilterDateFrom = formattedDate;
  } else {
    state.kbFilterDateTo = formattedDate;
  }
  state.kbCalendarOpen = false;
  renderWorkspaceKnowledgeScreen();
}

function closeKBFilterPopover(event) {
  event.stopPropagation();
  state.kbFilterOpen = false;
  state.kbTypeDropdownOpen = false;
  state.kbCalendarOpen = false;
  renderWorkspaceKnowledgeScreen();
}

function applyKBFilters(event) {
  event.stopPropagation();
  state.kbFilterOpen = false;
  state.kbTypeDropdownOpen = false;
  state.kbCalendarOpen = false;
  renderWorkspaceKnowledgeScreen();
  showToast('Filters applied successfully!');
}

function openKBNewUploadModal() {
  state.kbUploadActiveTab = 'desktop';
  kbSelectedFiles = [];

  const modalHTML = `
    <div class="kb-modal-overlay" style="animation: fadeIn 0.15s ease-out forwards; display: flex; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 10000;" onclick="closeKBNewUploadModal(event)">
      <div class="kb-modal-card" style="animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; background: var(--color-bg-primary); border: 0.5px solid var(--color-border-secondary); border-radius: 12px; width: 560px; padding: 24px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);" onclick="event.stopPropagation()">
        
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:16px; font-weight:600; color:var(--color-text-primary);">Upload Files</span>
          <button style="background:transparent; border:none; color:var(--color-text-secondary); cursor:pointer; font-size:16px;" onclick="closeKBNewUploadModal(event)">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <!-- Tab Bar -->
        <div class="kb-upload-tabs">
          <button class="kb-upload-tab ${state.kbUploadActiveTab === 'desktop' ? 'active' : ''}" onclick="switchKBUploadTab('desktop')">Desktop</button>
          <button class="kb-upload-tab ${state.kbUploadActiveTab === 'scraping' ? 'active' : ''}" onclick="switchKBUploadTab('scraping')">Web Scraping</button>
        </div>

        <!-- Dynamic Body Container -->
        <div id="kb-upload-modal-body" style="min-height: 200px;">
          ${getKBUploadTabContentHTML()}
        </div>

        <!-- Footer Actions -->
        <div style="display:flex; justify-content:flex-end; gap:10px; border-top:0.5px solid var(--color-border-secondary); padding-top:14px; margin-top:4px;">
          <button class="btn btn-outline btn-sm" onclick="closeKBNewUploadModal(event)">Cancel</button>
          <button id="kb-modal-action-btn" class="btn btn-primary btn-sm" onclick="triggerKBUploadAction()">Upload</button>
        </div>

      </div>
    </div>
  `;

  // Append modal directly to body
  const modalDiv = document.createElement('div');
  modalDiv.id = 'kb-upload-modal-wrapper';
  modalDiv.innerHTML = modalHTML;
  document.body.appendChild(modalDiv);
}

function getKBUploadTabContentHTML() {
  if (state.kbUploadActiveTab === 'desktop') {
    return `
      <div class="kb-drop-zone" onclick="document.getElementById('kb-modal-file-input').click()">
        <i class="ti ti-cloud-upload"></i>
        <h4 class="kb-drop-zone-title">Upload Files</h4>
        <p class="kb-drop-zone-desc">Drag files here or select to upload. Supports .pdf, .txt, .md, .docx</p>
        <input type="file" id="kb-modal-file-input" style="display:none;" multiple onchange="handleModalFileSelected(event)">
      </div>
      <div id="kb-modal-selected-files-list" style="margin-top:12px; font-size:12.5px; color:var(--color-text-secondary); text-align:left; display:flex; flex-direction:column; gap:4px;">
        ${kbSelectedFiles.length > 0 ? kbSelectedFiles.map(f => `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 10px; background:var(--color-bg-secondary); border:0.5px solid var(--color-border-secondary); border-radius:6px;">
            <span style="font-weight:500; color:var(--color-text-primary); text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:80%;"><i class="ti ti-file"></i> ${f.name}</span>
            <span style="font-size:11px; color:var(--color-text-tertiary);">${(f.size/1024).toFixed(1)} kb</span>
          </div>
        `).join('') : ''}
      </div>
    `;
  } else if (state.kbUploadActiveTab === 'scraping') {
    return `
      <div class="kb-upload-form">
        <div class="kb-form-group">
          <label>Document Name</label>
          <input type="text" id="kb-scraping-doc-name" class="kb-form-input" placeholder="Document Name">
        </div>
        <div class="kb-form-group">
          <label>Sync Frequency</label>
          <select id="kb-scraping-frequency" class="kb-form-input">
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div style="background:var(--color-bg-secondary); border:0.5px solid var(--color-border-secondary); border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:12px; margin-top:2px;">
          <div class="kb-form-group">
            <label style="display:flex; justify-content:space-between; align-items:center;">
              <span>Import From URL</span>
              <i class="ti ti-info-circle" style="font-size:13px; color:var(--color-text-tertiary);" title="Paste a single target URL or sitemap URL to crawl"></i>
            </label>
            <input type="text" id="kb-scraping-url" class="kb-form-input" placeholder="Paste URL">
          </div>
          <div class="kb-form-grid-2">
            <div class="kb-form-group">
              <label>Max Pages</label>
              <input type="number" id="kb-scraping-max-pages" class="kb-form-input" value="1">
            </div>
            <div class="kb-form-group">
              <label>Max Depth</label>
              <input type="number" id="kb-scraping-max-depth" class="kb-form-input" value="0">
            </div>
          </div>
          <ul class="kb-scraping-info-box">
            <li>If depth is 0, the maximum page count is 1.</li>
            <li>If depth is greater than 0, the page count must be between 1 and 1000.</li>
            <li>Maximum depth count should be 25.</li>
          </ul>
        </div>
      </div>
    `;
  } else if (state.kbUploadActiveTab === 'workdrive') {
    return `
      <div style="text-align:center; padding:36px 12px; border:0.5px dashed var(--color-border-secondary); border-radius:12px;">
        <i class="ti ti-brand-zoom" style="font-size:40px; color:var(--color-accent-400); margin-bottom:12px; display:block;"></i>
        <h4 style="font-size:14px; font-weight:600; color:var(--color-text-primary); margin:0 0 6px 0;">Connect Zoho WorkDrive</h4>
        <p style="font-size:12px; color:var(--color-text-secondary); margin:0 0 16px 0;">Link your corporate team drive directories directly to sync document catalogs.</p>
        <button class="btn btn-outline btn-sm" onclick="showToast('Connecting to Zoho WorkDrive accounts...')">Integrate Account</button>
      </div>
    `;
  } else {
    return `
      <div style="text-align:center; padding:36px 12px; border:0.5px dashed var(--color-border-secondary); border-radius:12px;">
        <i class="ti ti-school" style="font-size:40px; color:var(--color-accent-400); margin-bottom:12px; display:block;"></i>
        <h4 style="font-size:14px; font-weight:600; color:var(--color-text-primary); margin:0 0 6px 0;">Connect Zoho Learn</h4>
        <p style="font-size:12px; color:var(--color-text-secondary); margin:0 0 16px 0;">Retrieve articles, team manuals, and operational guides from Zoho Learn.</p>
        <button class="btn btn-outline btn-sm" onclick="showToast('Connecting to Zoho Learn catalogs...')">Integrate Account</button>
      </div>
    `;
  }
}

function switchKBUploadTab(tab) {
  state.kbUploadActiveTab = tab;
  
  // Re-render tab buttons active state
  const tabs = document.querySelectorAll('.kb-upload-tab');
  tabs.forEach(t => {
    t.classList.remove('active');
    const label = t.innerText.toLowerCase();
    if (label.includes(tab === 'scraping' ? 'scraping' : tab)) {
      t.classList.add('active');
    }
  });

  // Re-render modal body
  const body = document.getElementById('kb-upload-modal-body');
  if (body) {
    body.innerHTML = getKBUploadTabContentHTML();
  }

  // Update primary button text
  const actionBtn = document.getElementById('kb-modal-action-btn');
  if (actionBtn) {
    if (tab === 'desktop' || tab === 'scraping') {
      actionBtn.innerText = 'Upload';
    } else {
      actionBtn.innerText = 'Done';
    }
  }
}

function handleModalFileSelected(event) {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    kbSelectedFiles = files;
    const body = document.getElementById('kb-upload-modal-body');
    if (body) {
      body.innerHTML = getKBUploadTabContentHTML();
    }
  }
}

function triggerKBUploadAction() {
  const activeWorkspace = state.workspaces.find(ws => ws.id === state.activeWorkspaceId) || state.workspaces[0];

  if (state.kbUploadActiveTab === 'desktop') {
    if (kbSelectedFiles.length === 0) {
      showToast('Please select at least one file to upload.');
      return;
    }

    kbSelectedFiles.forEach(file => {
      const parts = file.name.split('.');
      const ext = parts.pop().toLowerCase();
      const name = parts.join('.');
      
      const isDemo = name.toLowerCase().includes('demo') || file.name.toLowerCase().includes('demo');
      const sizeStr = isDemo ? '465.00 B' : ((file.size < 1024) ? file.size + ' B' : (file.size / 1024).toFixed(1) + ' KB');
      const dateStr = isDemo ? '19/05/2026' : (() => {
        const d = new Date();
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      })();
      const summaryText = isDemo ? 
        'QuickServe, founded by students from NIT Rourkela, offers food delivery at up to 20% lower prices than other apps, providing more value for money. Trusted by over 1,200 satisfied customers, the platform features a carefully curated selection of top-rated local restaurants, ensuring delicious meals at affordable prices. Join thousands of others who are saving money on every order while enjoying high-quality food.' : 
        `New document "${name}.${ext}" successfully uploaded and vectorized. Accessing contextual embeddings provides highly precise background agent orchestration context.`;

      const newDoc = {
        id: 'doc_' + Date.now() + Math.random().toString(36).substr(2, 5),
        workspaceId: activeWorkspace.id,
        name: file.name,
        ext: ext || 'txt',
        size: sizeStr,
        chunks: '0',
        agentUsage: isDemo ? 0 : 0,
        aiSummary: summaryText,
        syncing: true,
        date: dateStr,
        owner: 'me'
      };

      state.knowledgeBase.unshift(newDoc);
      
      // Simulate chunk count sync progress
      setTimeout(() => {
        const found = state.knowledgeBase.find(d => d.id === newDoc.id);
        if (found) {
          found.chunks = Math.floor(Math.random() * 20 + 5).toString();
          found.syncing = false;
          showToast(`"${newDoc.name}" successfully indexed!`);
          if (state.activeView === 'workspace_knowledge') {
            renderWorkspaceKnowledgeScreen();
          }
        }
      }, 3500);
    });

    closeKBNewUploadModal();
    renderWorkspaceKnowledgeScreen();
    showToast(`Uploading ${kbSelectedFiles.length} file(s)...`);

  } else if (state.kbUploadActiveTab === 'scraping') {
    const docName = document.getElementById('kb-scraping-doc-name').value.trim();
    const url = document.getElementById('kb-scraping-url').value.trim();

    if (!docName || !url) {
      showToast('Please enter both Document Name and target URL.');
      return;
    }

    const isDemo = docName.toLowerCase().includes('demo');
    const sizeStr = 'Crawl';
    const dateStr = isDemo ? '19/05/2026' : (() => {
      const d = new Date();
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    })();
    const summaryText = isDemo ? 
      'QuickServe, founded by students from NIT Rourkela, offers food delivery at up to 20% lower prices than other apps, providing more value for money. Trusted by over 1,200 satisfied customers, the platform features a carefully curated selection of top-rated local restaurants, ensuring delicious meals at affordable prices. Join thousands of others who are saving money on every order while enjoying high-quality food.' : 
      `Crawled web source ${url} successfully scraped and cataloged in the knowledge base vector store.`;

    const newDoc = {
      id: 'doc_' + Date.now() + Math.random().toString(36).substr(2, 5),
      workspaceId: activeWorkspace.id,
      name: docName,
      ext: 'web',
      size: sizeStr,
      chunks: '0',
      agentUsage: 0,
      aiSummary: summaryText,
      syncing: true,
      date: dateStr,
      owner: 'me'
    };

    state.knowledgeBase.unshift(newDoc);

    // Simulate crawl scraping completion
    setTimeout(() => {
      const found = state.knowledgeBase.find(d => d.id === newDoc.id);
      if (found) {
        found.chunks = Math.floor(Math.random() * 40 + 10).toString();
        found.syncing = false;
        showToast(`Web crawl for "${newDoc.name}" completed successfully!`);
        if (state.activeView === 'workspace_knowledge') {
          renderWorkspaceKnowledgeScreen();
        }
      }
    }, 4500);

    closeKBNewUploadModal();
    renderWorkspaceKnowledgeScreen();
    showToast('Starting web scraping crawl task...');
  } else {
    closeKBNewUploadModal();
  }
}

function closeKBNewUploadModal(event) {
  const modal = document.getElementById('kb-upload-modal-wrapper');
  if (modal) {
    modal.remove();
  }
}

function toggleKBDropdown(event, docId) {
  event.stopPropagation();
  if (openKBDropdownId === docId) {
    openKBDropdownId = null;
  } else {
    openKBDropdownId = docId;
  }
  renderWorkspaceKnowledgeScreen();
}

function deleteKBDocument(event, docId) {
  event.stopPropagation();
  state.knowledgeBase = state.knowledgeBase.filter(d => d.id !== docId);
  openKBDropdownId = null;
  renderWorkspaceKnowledgeScreen();
  showToast('Document deleted from Knowledge Base.');
}

function downloadKBDocument(event, name) {
  event.stopPropagation();
  showToast(`Starting download for "${name}"...`);
  openKBDropdownId = null;
  renderWorkspaceKnowledgeScreen();
}

function openAISummary(event, fileId) {
  event.stopPropagation();
  const file = state.knowledgeBase.find(d => d.id === fileId);
  if (!file) return;

  const summaryText = file.aiSummary || "This document contains verified enterprise knowledge reference chunks synced and integrated into your Softworker context vector workspace.";
  
  // Remove existing summary popover
  const existing = document.getElementById('kb-summary-popover');
  if (existing) existing.remove();

  // Create floating summary card popover
  const popover = document.createElement('div');
  popover.id = 'kb-summary-popover';
  popover.className = 'kb-summary-card-popover';
  
  // Position close to clicked element
  const rect = event.currentTarget.getBoundingClientRect();
  const top = window.scrollY + rect.bottom + 8;
  const left = window.scrollX + rect.left - 200; // Shift left so it overlays beautifully

  popover.style.top = `${top}px`;
  popover.style.left = `${Math.max(16, left)}px`;

  popover.innerHTML = `
    <div class="kb-summary-header">
      <span>AI Summary</span>
      <div class="kb-summary-copy-btn" onclick="copyKBText(event, \`${summaryText.replace(/`/g, '\\`').replace(/"/g, '&quot;')}\`)">
        <i class="ti ti-copy"></i>
        <span>Copy</span>
      </div>
    </div>
    <div class="kb-summary-body">
      ${summaryText}
    </div>
  `;

  document.body.appendChild(popover);

  // Prevent click-out closing when clicking inside popover
  popover.addEventListener('click', e => e.stopPropagation());
}

function copyKBText(event, text) {
  event.stopPropagation();
  navigator.clipboard.writeText(text).then(() => {
    showToast('AI Summary copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy text.');
  });
}


function renderWorkspaceSettingsScreen() {
  const activeWorkspace = state.workspaces.find(ws => ws.id === state.activeWorkspaceId) || state.workspaces[0];
  
  DOM.contentArea.innerHTML = `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 20px; text-align: left; height: 100%; overflow-y: auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:0.5px solid var(--color-border-secondary); padding-bottom:12px;">
        <div>
          <h2 style="font-size:20px; font-weight:600; color:var(--color-text-primary); margin:0;">workspace administration & settings</h2>
          <div style="font-size:12.5px; color:var(--color-text-secondary); margin-top:2px;">workspace naming, security permissions, governance structures, and credentials.</div>
        </div>
      </div>
      
      <div style="background:var(--color-bg-secondary); border:0.5px solid var(--color-border-secondary); border-radius:12px; padding:20px; text-align:left; display:flex; flex-direction:column; gap:16px; margin-top:10px;">
        <div class="creation-form-grid" style="display:grid; grid-template-columns: repeat(2, 1fr); gap:16px;">
          <div class="creation-form-row" style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size:10.5px; font-weight:500; color:var(--color-text-secondary); text-transform:uppercase;">workspace name</label>
            <input type="text" id="cfg-ws-name" value="${activeWorkspace.name}" style="background:var(--color-bg-primary); border:0.5px solid var(--color-border-secondary); color:var(--color-text-primary); border-radius:6px; padding:8px; font-size:13px; outline:none;">
          </div>
          <div class="creation-form-row" style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size:10.5px; font-weight:500; color:var(--color-text-secondary); text-transform:uppercase;">governing node role</label>
            <input type="text" value="${activeWorkspace.role}" disabled style="background:var(--color-bg-tertiary); border:0.5px solid var(--color-border-secondary); color:var(--color-text-secondary); border-radius:6px; padding:8px; font-size:13px; outline:none; cursor:not-allowed;">
          </div>
          <div class="creation-form-row" style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size:10.5px; font-weight:500; color:var(--color-text-secondary); text-transform:uppercase;">human-in-the-loop requirement</label>
            <select style="background:var(--color-bg-primary); border:0.5px solid var(--color-border-secondary); color:var(--color-text-primary); border-radius:6px; padding:8px; font-size:13px; outline:none;">
              <option value="always">Always Require Manual Approval (Strict)</option>
              <option value="risk">High Risk Operations Only</option>
              <option value="none">Fully Autonomous Mode</option>
            </select>
          </div>
          <div class="creation-form-row" style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size:10.5px; font-weight:500; color:var(--color-text-secondary); text-transform:uppercase;">data privacy scope</label>
            <select style="background:var(--color-bg-primary); border:0.5px solid var(--color-border-secondary); color:var(--color-text-primary); border-radius:6px; padding:8px; font-size:13px; outline:none;">
              <option value="private">Workspace Private (No external LLM cache)</option>
              <option value="shared">Anonymized Shared Training</option>
            </select>
          </div>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:8px;">
          <button class="btn btn-primary btn-sm" onclick="saveWorkspaceSettings()">Save workspace settings</button>
        </div>
      </div>
    </div>
  `;
}

function saveWorkspaceSettings() {
  const ws = state.workspaces.find(w => w.id === state.activeWorkspaceId);
  const nameVal = document.getElementById('cfg-ws-name').value;
  if (ws && nameVal.trim()) {
    ws.name = nameVal.trim();
    showToast('Workspace settings saved successfully!');
    renderSidebar();
    renderView();
  }
}


