/**
 * Q2 2026 Headcount Recruitment Plan
 * Columns: Role | Type | Current Model | Spec | Capital FTE | Capital BPO | SGC FTE | SGC BPO | Q2 Total | New Hires Joint
 * Offices: Capital = HQ Capital office | SGC = SGC office
 * newHiresJoint: number of planned hires who have officially joined / started onboarding
 */

const Q2_NOTE = 'New models will be applied as current model where applicable.';
const Q2_QUARTER = 'Q2 2026';

const q2RecruitmentPlan = [
  // ── PRODUCT ─────────────────────────────────────────────────────────────────
  {
    group: 'Product',
    role: 'Producer',
    type: 'Desktop',
    model: 'Dell Precision T3680',
    spec: 'Intel i7, 32GB RAM, 512GB SSD, 2T HDD, Nvidia GeForce RTX 4060',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },
  {
    group: 'Product',
    role: 'Product AOV/FF',
    type: 'Desktop',
    model: 'Dell OptiPlex 70xx (High)',
    spec: 'Intel i7 (8 core), 16GB RAM, 512GB SSD, AMD Radeon RX 640',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },
  {
    group: 'Product',
    role: 'Product FC/DF/New Games',
    type: 'Desktop',
    model: 'Dell Precision T3680',
    spec: 'Intel i7, 32GB RAM, 512GB SSD, 2T HDD, Nvidia GeForce RTX 4060',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 1, sgcBPO: 0, q2Total: 1, newHiresJoint: 0,
  },

  // ── MARKETING ───────────────────────────────────────────────────────────────
  {
    group: 'Marketing',
    role: 'Marketing AOV/FF',
    type: 'Desktop',
    model: 'Dell OptiPlex 70xx (High)',
    spec: 'Intel i7 (8 core), 16GB RAM, 512GB SSD, AMD Radeon RX 640',
    capitalFTE: 2, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 2, newHiresJoint: 0,
  },
  {
    group: 'Marketing',
    role: 'Marketing AOV/FF',
    type: 'Laptop',
    model: 'Dell Latitude 34xx (16GB)',
    spec: 'Intel i5, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },
  {
    group: 'Marketing',
    role: 'Marketing FC/DF/New Games',
    type: 'Desktop',
    model: 'Dell Precision T36xx (Low)',
    spec: 'Intel i7, 32GB RAM, 512GB SSD, 2T HDD, Nvidia GeForce RTX 2060 Super',
    capitalFTE: 1, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 1, newHiresJoint: 0,
  },
  {
    group: 'Marketing',
    role: 'Marketing ODP',
    type: 'Desktop',
    model: 'Dell OptiPlex 70xx (Low B)',
    spec: 'Intel i5 (6 core), 16GB RAM, 512GB SSD, Intel Integrated Graphics',
    capitalFTE: 2, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 2, newHiresJoint: 0,
  },
  {
    group: 'Marketing',
    role: 'Marketing ODP (work with data analysis)',
    type: 'Laptop',
    model: 'Dell Latitude 54xx (16GB)',
    spec: 'Intel i7, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },

  // ── ESPORTS ─────────────────────────────────────────────────────────────────
  {
    group: 'Esports',
    role: 'Esports AOV/FF',
    type: 'Desktop',
    model: 'Dell OptiPlex 70xx (High)',
    spec: 'Intel i7 (8 core), 16GB RAM, 512GB SSD, AMD Radeon RX 640',
    capitalFTE: 2, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 2, newHiresJoint: 0,
  },
  {
    group: 'Esports',
    role: 'Esports AOV/FF',
    type: 'Laptop',
    model: 'Dell Latitude 34xx (16GB)',
    spec: 'Intel i5, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },
  {
    group: 'Esports',
    role: 'Esports FC/DF',
    type: 'Desktop',
    model: 'Dell Precision T36xx (Low)',
    spec: 'Intel i7, 32GB RAM, 512GB SSD, 2T HDD, Nvidia GeForce RTX 2060 Super',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 1, sgcBPO: 0, q2Total: 1, newHiresJoint: 0,
  },

  // ── PLATFORM ────────────────────────────────────────────────────────────────
  {
    group: 'Platform',
    role: 'BA/Platform ODP',
    type: 'Desktop',
    model: 'Dell OptiPlex 70xx (High) (Upgrade 32GB RAM)',
    spec: 'Intel i7 (8 core), 32GB RAM (2x16GB), 512GB SSD, AMD Radeon RX 641',
    capitalFTE: 0, capitalBPO: 2, sgcFTE: 0, sgcBPO: 0, q2Total: 2, newHiresJoint: 0,
  },

  // ── CREATIVE ────────────────────────────────────────────────────────────────
  {
    group: 'Creative',
    role: 'Creative (Graphic Design)',
    type: 'Desktop',
    model: 'Dell Precision T3680',
    spec: 'Intel i7, 32GB RAM, 512GB SSD, 2T HDD, Nvidia GeForce RTX 4060',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },
  {
    group: 'Creative',
    role: 'Creative (Video Editor)',
    type: 'Desktop',
    model: 'Dell Pro Max Tower T2 (High)',
    spec: 'Intel Ultra 7 265, 64GB RAM, 512GB SSD, 4T HDD, Nvidia GeForce RTX 5070',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },

  // ── STRATEGY & OPERATIONS ───────────────────────────────────────────────────
  {
    group: 'Strategy & Operations',
    role: 'Strategy & Operations',
    type: 'Desktop',
    model: 'Dell Precision T36xx (Low)',
    spec: 'Intel i7, 32GB RAM, 512GB SSD, 2T HDD, Nvidia GeForce RTX 2060 Super',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },
  {
    group: 'Strategy & Operations',
    role: 'Strategy & Operations',
    type: 'Laptop',
    model: 'Dell Latitude 54xx (16GB)',
    spec: 'Intel i7, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 1, capitalBPO: 0, sgcFTE: 1, sgcBPO: 0, q2Total: 2, newHiresJoint: 0,
  },

  // ── GAME DEV – REGIONAL CRAFTLAND ───────────────────────────────────────────
  {
    group: 'Game Dev (Craftland)',
    role: 'Game Dev (Regional Craftland)',
    type: 'Desktop',
    model: 'Dell Precision T3680',
    spec: 'Intel i7, 32GB RAM, 512GB SSD, 2T HDD, Nvidia GeForce RTX 4060',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 1, sgcBPO: 0, q2Total: 1, newHiresJoint: 0,
  },
  {
    group: 'Game Dev (Craftland)',
    role: 'Game Design (Regional Craftland)',
    type: 'Desktop',
    model: 'Dell Precision T3680',
    spec: 'Intel i7, 32GB RAM, 512GB SSD, 2T HDD, Nvidia GeForce RTX 4060',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 1, sgcBPO: 0, q2Total: 1, newHiresJoint: 0,
  },
  {
    group: 'Game Dev (Craftland)',
    role: 'Game Art (Regional Craftland)',
    type: 'Desktop',
    model: 'Dell Pro Max Tower T2 (High)',
    spec: 'Intel Ultra 7 265, 64GB RAM, 512GB SSD, 4T HDD, Nvidia GeForce RTX 5070',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 1, sgcBPO: 0, q2Total: 1, newHiresJoint: 0,
  },

  // ── GAME DEV – IN-HOUSE ─────────────────────────────────────────────────────
  {
    group: 'Game Dev (In-house)',
    role: 'Game Dev (In-house Game Dev)',
    type: 'Desktop',
    model: 'Dell Precision T3680',
    spec: 'Intel i7, 32GB RAM, 512GB SSD, 2T HDD, Nvidia GeForce RTX 4060',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 2, q2Total: 2, newHiresJoint: 0,
  },
  {
    group: 'Game Dev (In-house)',
    role: 'Game Design (In-house Game Dev)',
    type: 'Desktop',
    model: 'Dell Precision T3680',
    spec: 'Intel i7, 32GB RAM, 512GB SSD, 2T HDD, Nvidia GeForce RTX 4060',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 1, sgcBPO: 0, q2Total: 1, newHiresJoint: 0,
  },
  {
    group: 'Game Dev (In-house)',
    role: 'Game Art (In-house Game Dev)',
    type: 'Desktop',
    model: 'Dell Pro Max Tower T2 (High)',
    spec: 'Intel Ultra 7 265, 64GB RAM, 512GB SSD, 4T HDD, Nvidia GeForce RTX 5070',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 3, q2Total: 3, newHiresJoint: 0,
  },
  {
    group: 'Game Dev (In-house)',
    role: 'Game Art (In-house Game Dev)',
    type: 'Laptop',
    model: '14" MacBook Pro M4 Pro (24G/512GB)',
    spec: 'Apple M4 Pro chip, 12-core CPU, 16-core GPU, 16-core Neural Engine',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 1, sgcBPO: 0, q2Total: 1, newHiresJoint: 0,
  },

  // ── DEVELOPMENT ─────────────────────────────────────────────────────────────
  {
    group: 'Development',
    role: 'Developer',
    type: 'Laptop',
    model: 'MacBook Pro M1',
    spec: 'Apple M1 chip, 8-core CPU, 8-core GPU, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },
  {
    group: 'Development',
    role: 'Developer (Intern)',
    type: 'Laptop',
    model: 'MacBook Pro M1',
    spec: 'Apple M1 chip, 8-core CPU, 8-core GPU, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },

  // ── ADMIN & SUPPORT ─────────────────────────────────────────────────────────
  {
    group: 'Admin & Support',
    role: 'Admin',
    type: 'Desktop',
    model: 'Dell OptiPlex 70xx (Low B)',
    spec: 'Intel i5 (6 core), 16GB RAM, 512GB SSD, Intel Integrated Graphics',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },
  {
    group: 'Admin & Support',
    role: 'Procurement',
    type: 'Laptop',
    model: 'Dell Latitude 34xx (16GB)',
    spec: 'Intel i5, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },

  // ── HR ──────────────────────────────────────────────────────────────────────
  {
    group: 'HR',
    role: 'People Team / HR',
    type: 'Desktop',
    model: 'Dell OptiPlex 70xx (High)',
    spec: 'Intel i7 (8 core), 16GB RAM, 512GB SSD, AMD Radeon RX 640',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },
  {
    group: 'HR',
    role: 'People Team / HR',
    type: 'Laptop',
    model: 'Dell Latitude 34xx (16GB)',
    spec: 'Intel i5, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 1, sgcFTE: 0, sgcBPO: 0, q2Total: 1, newHiresJoint: 0,
  },
  {
    group: 'HR',
    role: 'HR (work with data analysis)',
    type: 'Laptop',
    model: 'Dell Latitude 54xx (16GB)',
    spec: 'Intel i7, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },

  // ── LEGAL ───────────────────────────────────────────────────────────────────
  {
    group: 'Legal',
    role: 'Legal',
    type: 'Laptop',
    model: 'Dell Latitude 34xx (16GB)',
    spec: 'Intel i5, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },
  {
    group: 'Legal',
    role: 'Legal (work with data analysis)',
    type: 'Laptop',
    model: 'Dell Latitude 34xx (16GB)',
    spec: 'Intel i5, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },

  // ── FINANCE ─────────────────────────────────────────────────────────────────
  {
    group: 'Finance',
    role: 'Finance',
    type: 'Desktop',
    model: 'Dell OptiPlex 70xx (High)',
    spec: 'Intel i7 (8 core), 16GB RAM, 512GB SSD, AMD Radeon RX 640',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },
  {
    group: 'Finance',
    role: 'Finance',
    type: 'Laptop',
    model: 'Dell Latitude 54xx (16GB)',
    spec: 'Intel i7, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },

  // ── IT ──────────────────────────────────────────────────────────────────────
  {
    group: 'IT',
    role: 'IT Corporate',
    type: 'Laptop',
    model: 'MacBook Pro M1',
    spec: 'Apple M1 chip, 8-core CPU, 8-core GPU, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0, newHiresJoint: 0,
  },
  {
    group: 'IT',
    role: 'Infrastructure',
    type: 'Laptop',
    model: 'MacBook Pro M1',
    spec: 'Apple M1 chip, 8-core CPU, 8-core GPU, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0,
  },

  // ── OTHER OPERATIONS ────────────────────────────────────────────────────────
  {
    group: 'Operations',
    role: 'Other Operations',
    type: 'Desktop',
    model: 'Dell OptiPlex 70xx (Low B)',
    spec: 'Intel i5 (6 core), 16GB RAM, 512GB SSD, Intel Integrated Graphics',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0,
  },

  // ── ADDITIONAL / UPGRADE ────────────────────────────────────────────────────
  {
    group: 'Additional / Backfill',
    role: 'Additional Laptop',
    type: 'Laptop',
    model: 'Dell Latitude 34xx (16GB)',
    spec: 'Intel i5, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0,
  },
  {
    group: 'Additional / Backfill',
    role: 'Additional Laptop',
    type: 'Laptop',
    model: 'Dell Latitude 54xx (16GB)',
    spec: 'Intel i7, 16GB RAM, 512GB SSD, 14"',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0,
  },
  {
    group: 'Additional / Backfill',
    role: 'Upgrade for Backfill',
    type: '—',
    model: '—',
    spec: '—',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0,
  },
  {
    group: 'Additional / Backfill',
    role: 'Upgrade for Backfill',
    type: '—',
    model: '—',
    spec: '—',
    capitalFTE: 0, capitalBPO: 0, sgcFTE: 0, sgcBPO: 0, q2Total: 0,
  },
];
