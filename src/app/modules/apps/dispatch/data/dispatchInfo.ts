import {
  DispatchStatus,
  ChecklistItem,
  Driver,
  Fleet,
  ReportRow,
  DivisionGroup,
} from '../types/dispatch'

export const STATUS_MAP: Record<DispatchStatus, {label: string; badge: string; textColor: string}> = {
  dispatched: {label: 'Dispatched', badge: 'badge-light-success',   textColor: 'text-success'},
  nd:         {label: 'ND',         badge: 'badge-light-secondary', textColor: 'text-secondary'},
  shop:       {label: 'Shop',       badge: 'badge-light-warning',   textColor: 'text-warning'},
  hold:       {label: 'Hold',       badge: 'badge-light-danger',    textColor: 'text-danger'},
  cc:         {label: 'CC',         badge: 'badge-light-info',      textColor: 'text-info'},
}

export const CHECKLIST_TEMPLATE: {key: string; label: string}[] = [
  {key: 'lubes',     label: 'Lubes'},
  {key: 'water',     label: 'Water'},
  {key: 'lights',    label: 'Lights'},
  {key: 'tires',     label: 'Tires'},
  {key: 'brakes',    label: 'Brakes'},
  {key: 'scratches', label: 'Scratches / Visible Damages'},
]

export const DEFAULT_CHECKLIST_OK: ChecklistItem[] = CHECKLIST_TEMPLATE.map(({label}) => ({
  label, status: 'ok', remarks: '',
}))

export const makeSkippedChecklist = (reason: string): ChecklistItem[] =>
  CHECKLIST_TEMPLATE.map(({label}) => ({label, status: 'skipped', remarks: reason}))

export const makeIssueChecklist = (remarks: string): ChecklistItem[] =>
  CHECKLIST_TEMPLATE.map(({label}) => ({label, status: 'issue', remarks}))

const WITH_ISSUE_CHECKLIST = [
  ...DEFAULT_CHECKLIST_OK.slice(0, 5),
  {label: 'Scratches / Visible Damages', status: 'issue' as const, remarks: 'Bumper front scratch paint'},
]

const DRIVERS_FL1_DIV1: Driver[] = [
  {
    id: 'DRV-00412', name: 'Acebedo A.', license: 'N3-8821-PH',
    phone: '+63 917 845 2210', photo: '/media/avatars/300-1.jpg',
    car: 'Unit 1 — ABX 4421', boundaryRate: '₱1,200.00 / day',
    odometer: '123,456', dispatchStatus: 'dispatched', remarks: 'OK',
    checklist: WITH_ISSUE_CHECKLIST,
    overrides: [],
  },
  {
    id: 'DRV-00413', name: 'Betchaby G.', license: 'M2-4410-PH',
    phone: '+63 918 223 4401', photo: '/media/avatars/300-2.jpg',
    car: 'Unit 2 — XYZ 9901', boundaryRate: '₱1,200.00 / day',
    odometer: '67,890', dispatchStatus: 'dispatched', remarks: 'Lic will expire',
    checklist: DEFAULT_CHECKLIST_OK,
    overrides: [],
  },
]

const DRIVERS_FL1_DIV2: Driver[] = [
  {
    id: 'DRV-00414', name: 'ND', license: '—',
    phone: '—', photo: '/media/avatars/blank.png',
    car: 'Unit 3 — JKL 3310', boundaryRate: '₱1,200.00 / day',
    odometer: 'Last ODO supplied', dispatchStatus: 'nd', remarks: 'Driver Kulas absent',
    checklist: makeSkippedChecklist('No driver'),
    overrides: [],
  },
  {
    id: 'DRV-00415', name: 'Shop', license: '—',
    phone: '—', photo: '/media/avatars/blank.png',
    car: 'Unit 4 — MNO 7721', boundaryRate: '₱1,200.00 / day',
    odometer: 'Last ODO supplied', dispatchStatus: 'shop', remarks: 'Brake problem',
    checklist: makeSkippedChecklist('In shop'),
    overrides: [{
      scope: 'Checklist', target: 'Pre-Dispatch Checklist',
      reason: 'Vehicle sent to shop before checklist completion',
      timestamp: 'Feb 22, 2026 · 6:15 AM',
    }],
  },
]

const DRIVERS_FL2_DIV1: Driver[] = [
  {
    id: 'DRV-00416', name: 'Luis Garcia', license: 'P4-7732-PH',
    phone: '+63 919 334 5521', photo: '/media/avatars/300-3.jpg',
    car: 'Unit 5 — PQR 5540', boundaryRate: '₱1,300.00 / day',
    odometer: '93,120', dispatchStatus: 'cc', remarks: 'Change car requested',
    checklist: DEFAULT_CHECKLIST_OK,
    overrides: [],
  },
  {
    id: 'DRV-00417', name: 'Ramon Dela Cruz', license: 'Q5-9910-PH',
    phone: '+63 917 001 8823', photo: '/media/avatars/300-4.jpg',
    car: 'Unit 6 — STU 8812', boundaryRate: '₱1,300.00 / day',
    odometer: 'Last ODO supplied', dispatchStatus: 'hold', remarks: 'Registration expired',
    checklist: [
      ...DEFAULT_CHECKLIST_OK.slice(0, 3),
      {label: 'Tires',  status: 'issue' as const, remarks: 'Rear tire low'},
      DEFAULT_CHECKLIST_OK[4],
      {label: 'Scratches / Visible Damages', status: 'issue' as const, remarks: 'Door front with scratches'},
    ],
    overrides: [{
      scope: 'Dispatch', target: 'Hold Warning — Registration Expired',
      reason: 'Temporary permit secured, cleared by supervisor',
      timestamp: 'Feb 22, 2026 · 7:00 AM',
    }],
  },
]

export const FLEET_DATA: Fleet[] = [
  {
    fleetId: 'FL-001', fleetName: 'Fleet 1',
    divisions: [
      {division: 'Metro North', collections: [{collectionId: 'COL-001', drivers: DRIVERS_FL1_DIV1}]},
      {division: 'Metro South', collections: [{collectionId: 'COL-002', drivers: DRIVERS_FL1_DIV2}]},
    ],
  },
  {
    fleetId: 'FL-002', fleetName: 'Fleet 2',
    divisions: [
      {division: 'East Zone', collections: [{collectionId: 'COL-003', drivers: DRIVERS_FL2_DIV1}]},
    ],
  },
]


// ─── Profile Driver (Dispatch page) ──────────────────────────────────────────

export const PROFILE_DRIVER = {
  name:             'Rafael Mendoza',
  id:               'DRV-00412',
  license:          'N3-8821-PH',
  phone:            '+63 917 845 2210',
  email:            'r.mendoza@fleet.ph',
  address:          'Brgy. Sta. Cruz, Quezon City, Metro Manila',
  birthdate:        'March 4, 1988',
  age:              37,
  gender:           'Male',
  civilStatus:      'Married',
  emergencyContact: 'Maria Mendoza',
  emergencyPhone:   '+63 918 223 4401',
  photo:            '/media/avatars/300-1.jpg',
}

// ─── Dispatch Window Info (Dispatch page) ─────────────────────────────────────

export const DISPATCH_INFO = {
  assignedCar:  'Toyota Vios — ABX 4421',
  boundaryRate: '₱1,200.00 / day',
  dispatchTime: 'Feb 22, 2026 · 6:30 AM',
  brief: {
    outstandingCharges: [
      {label: 'Fuel advance — Feb 18', amount: '₱450.00'},
    ],
    damages: [
      {label: 'Minor scratch, rear bumper', date: 'Feb 10', severity: 'low'},
    ],
    adminNotes: [
      'License renewal due March 15',
      'Mandatory safety seminar pending',
    ],
    holdWarnings: ['Driver flagged — pending clearance review'] as string[],
  },
}

// ─── Daily Report Rows (Dispatch > Reports tab) ───────────────────────────────

export const DAILY_REPORT_ROWS: ReportRow[] = [
  {id: 'r1', car: 'Toyota Vios ABX 4421',       driver: 'Rafael Mendoza',  odometer: '84,210',  checklist: 'Complete', remarks: 'All OK',                         status: 'dispatched'},
  {id: 'r2', car: 'Toyota Innova XYZ 9901',     driver: 'Mario Santos',    odometer: '102,540', checklist: 'Complete', remarks: 'Minor tire wear noted',           status: 'dispatched'},
  {id: 'r3', car: 'Mitsubishi Mirage JKL 3310', driver: 'Eduardo Cruz',    odometer: '61,880',  checklist: 'Partial',  remarks: 'Brake check pending',             status: 'shop'},
  {id: 'r4', car: 'Honda City MNO 7721',        driver: '—',               odometer: '—',       checklist: '—',        remarks: 'No driver assigned',              status: 'nd'},
  {id: 'r5', car: 'Toyota Vios PQR 5540',       driver: 'Luis Garcia',     odometer: '93,120',  checklist: 'Complete', remarks: 'Change car requested',            status: 'cc'},
  {id: 'r6', car: 'Hyundai Accent STU 8812',    driver: 'Ramon Dela Cruz', odometer: '—',       checklist: '—',        remarks: 'Vehicle on hold — damage review', status: 'hold'},
]

export const REPORT_SUMMARY = {
  totalDispatched: 2, cc: 1, nd: 1, shop: 1, hold: 1, fleetTotal: 6,
}

// ─── Driver factory (fills in safe defaults) ──────────────────────────────────

const mkDriver = (
  fields: Partial<Driver> & Pick<Driver, 'id' | 'name' | 'car' | 'dispatchStatus' | 'remarks'>
): Driver => ({
  license:      '—',
  phone:        '—',
  photo:        '/media/avatars/blank.png',
  boundaryRate: '₱1,200.00 / day',
  odometer:     'Last ODO supplied',
  checklist:    DEFAULT_CHECKLIST_OK,
  overrides:    [],
  ...fields,
})

// ─── Driver pools — COL-001 ───────────────────────────────────────────────────

const FL1_COL1: Driver[] = [
  mkDriver({
    id: 'DRV-001', name: 'Acebedo A.', car: 'Unit 1 — ABX 4421',
    license: 'N3-8821-PH', phone: '+63 917 845 2210', photo: '/media/avatars/300-1.jpg',
    odometer: '123,456', dispatchStatus: 'dispatched', remarks: 'OK',
    checklist: makeIssueChecklist('Bumper front scratch paint'),
  }),
  mkDriver({
    id: 'DRV-002', name: 'Betchaby G.', car: 'Unit 2 — XYZ 9901',
    license: 'M2-4410-PH', phone: '+63 918 223 4401', photo: '/media/avatars/300-2.jpg',
    odometer: '67,890', dispatchStatus: 'dispatched', remarks: 'Lic will expire',
  }),
  mkDriver({
    id: 'DRV-003', name: 'ND', car: 'Unit 3 — JKL 3310',
    dispatchStatus: 'nd', remarks: 'Driver Kulas absent',
    checklist: makeSkippedChecklist('No driver'),
  }),
]

const FL2_COL1: Driver[] = [
  mkDriver({
    id: 'DRV-004', name: 'Castillo R.', car: 'Unit 4 — MNO 7721',
    license: 'P4-7732-PH', phone: '+63 919 334 5521', photo: '/media/avatars/300-3.jpg',
    odometer: '93,120', dispatchStatus: 'dispatched', remarks: 'OK',
  }),
  mkDriver({
    id: 'DRV-005', name: 'Shop', car: 'Unit 5 — PQR 5540',
    dispatchStatus: 'shop', remarks: 'Brake problem',
    checklist: makeSkippedChecklist('In shop'),
    overrides: [{
      scope: 'Checklist', target: 'Pre-Dispatch Checklist',
      reason: 'Vehicle sent to shop before checklist completion',
      timestamp: 'Feb 22, 2026 · 6:15 AM',
    }],
  }),
]

// ─── Driver pools — COL-002 ───────────────────────────────────────────────────

const FL1_COL2: Driver[] = [
  mkDriver({
    id: 'DRV-006', name: 'Dela Cruz R.', car: 'Unit 6 — STU 8812',
    license: 'Q5-9910-PH', phone: '+63 917 001 8823', photo: '/media/avatars/300-4.jpg',
    dispatchStatus: 'hold', remarks: 'Registration expired',
    checklist: [
      ...DEFAULT_CHECKLIST_OK.slice(0, 3),
      {label: 'Tires',                       status: 'issue', remarks: 'Rear tire low'},
      DEFAULT_CHECKLIST_OK[4],
      {label: 'Scratches / Visible Damages', status: 'issue', remarks: 'Door front with scratches'},
    ],
    overrides: [{
      scope: 'Dispatch', target: 'Hold Warning — Registration Expired',
      reason: 'Temporary permit secured, cleared by supervisor',
      timestamp: 'Feb 22, 2026 · 7:00 AM',
    }],
  }),
  mkDriver({
    id: 'DRV-007', name: 'Espino M.', car: 'Unit 7 — VWX 1234',
    license: 'R6-2231-PH', phone: '+63 918 445 7712', photo: '/media/avatars/300-1.jpg',
    odometer: '55,210', dispatchStatus: 'dispatched', remarks: 'OK',
  }),
  mkDriver({
    id: 'DRV-008', name: 'CC', car: 'Unit 8 — YZA 5566',
    dispatchStatus: 'cc', remarks: 'Change car requested',
    checklist: makeSkippedChecklist('Change car'),
  }),
]

const FL2_COL2: Driver[] = [
  mkDriver({
    id: 'DRV-009', name: 'Fernandez J.', car: 'Unit 9 — BCD 9988',
    license: 'S7-4450-PH', phone: '+63 919 112 3344', photo: '/media/avatars/300-2.jpg',
    odometer: '78,340', dispatchStatus: 'dispatched', remarks: 'OK',
  }),
  mkDriver({
    id: 'DRV-010', name: 'Garcia L.', car: 'Unit 10 — EFG 2211',
    license: 'T8-6673-PH', phone: '+63 917 887 5522', photo: '/media/avatars/300-3.jpg',
    odometer: '102,100', dispatchStatus: 'dispatched', remarks: 'All clear',
  }),
  mkDriver({
    id: 'DRV-011', name: 'ND', car: 'Unit 11 — HIJ 4477',
    dispatchStatus: 'nd', remarks: 'No driver scheduled',
    checklist: makeSkippedChecklist('No driver'),
  }),
]

// ─── Driver pools — COL-003 ───────────────────────────────────────────────────

const FL1_COL3: Driver[] = [
  mkDriver({
    id: 'DRV-012', name: 'Hernandez K.', car: 'Unit 12 — KLM 3322',
    license: 'U9-8814-PH', phone: '+63 918 667 1100', photo: '/media/avatars/300-4.jpg',
    odometer: '44,500', dispatchStatus: 'dispatched', remarks: 'OK',
  }),
  mkDriver({
    id: 'DRV-013', name: 'Ibañez P.', car: 'Unit 13 — NOP 7755',
    license: 'V1-3340-PH', phone: '+63 917 223 9988', photo: '/media/avatars/300-1.jpg',
    odometer: '61,200', dispatchStatus: 'dispatched', remarks: 'OK',
  }),
  mkDriver({
    id: 'DRV-014', name: 'Shop', car: 'Unit 14 — QRS 6611',
    dispatchStatus: 'shop', remarks: 'Engine check',
    checklist: makeSkippedChecklist('In shop'),
  }),
]

// ─── Report Data: Division → Collection → Fleet ───────────────────────────────

export const DIVISION_DATA: DivisionGroup[] = [
  {
    divisionId:   'DIV-001',
    divisionName: 'Metro North',
    collections: [
      {
        collectionId: 'COL-001',
        fleets: [
          {fleetId: 'FL-001', fleetName: 'Fleet 1', drivers: FL1_COL1},
          {fleetId: 'FL-002', fleetName: 'Fleet 2', drivers: FL2_COL1},
        ],
      },
      {
        collectionId: 'COL-002',
        fleets: [
          {fleetId: 'FL-001', fleetName: 'Fleet 1', drivers: FL1_COL2},
          {fleetId: 'FL-002', fleetName: 'Fleet 2', drivers: FL2_COL2},
        ],
      },
    ],
  },
  {
    divisionId:   'DIV-002',
    divisionName: 'East Zone',
    collections: [
      {
        collectionId: 'COL-003',
        fleets: [
          {fleetId: 'FL-001', fleetName: 'Fleet 1', drivers: FL1_COL3},
        ],
      },
    ],
  },
]